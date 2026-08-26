/* ==========================================================================
   ParticleSystem — the drifting motes that make up the realm's air.
   Canvas 2D, spatial-hashed constellation links, pointer forces, click bursts.
   Optimized for mobile to ensure 60fps native momentum scrolling without lag.
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("particles");
  if (!canvas) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Motes are lit points against a night sky, and ink flecks against a day
     one — so the palette (and the constellation link colour) swaps with the
     chart. Values mirror the accents in css/tokens.css. */
  var PALETTES = {
    dark: {
      motes: [[240, 192, 96], [167, 139, 250], [240, 244, 255]],
      link: [150, 140, 235],
      linkLit: [240, 192, 235],
      burst: [240, 192, 96],
      spriteAlpha: 0.55,
      linkAlpha: 1
    },
    light: {
      motes: [[176, 124, 24], [92, 66, 200], [64, 70, 110]],
      link: [96, 104, 168],
      linkLit: [122, 84, 16],
      burst: [150, 104, 16],
      spriteAlpha: 0.34,
      linkAlpha: 1.5
    }
  };

  function themeName() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  var TONE = PALETTES[themeName()];
  var PALETTE = TONE.motes;

  var SPRITES = [];
  function createSprites(dpr) {
    SPRITES = PALETTE.map(function (c) {
      /* Large enough that a mote at the near plane upscales without banding. */
      var size = Math.ceil(64 * dpr);
      var off = document.createElement("canvas");
      off.width = size;
      off.height = size;
      var octx = off.getContext("2d");
      var r = size / 2;
      var rgb = c[0] + "," + c[1] + "," + c[2];
      var g = octx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, "rgba(" + rgb + "," + TONE.spriteAlpha + ")");
      g.addColorStop(1, "rgba(" + rgb + ",0)");
      octx.fillStyle = g;
      octx.beginPath();
      octx.arc(r, r, r, 0, 6.283);
      octx.fill();
      return off;
    });
  }

  function ParticleSystem(el) {
    this.canvas = el;
    this.ctx = el.getContext("2d", { alpha: true });
    this.particles = [];
    this.bursts = [];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.pointer = { x: -9999, y: -9999, px: -9999, py: -9999, speed: 0, down: false, inside: false };
    this.linkRange = 118;
    this.cell = this.linkRange;
    this.grid = new Map();
    this.running = false;
    this.vw = 0;
    this.vh = 0;
    this.isMobile = false;
    createSprites(this.dpr);
    this.resize();
    this.seed();
    this.bind();
  }

  /* One camera for the whole site: F and the vanishing point mirror
     --persp-n: 900 and perspective-origin: 50% 42% in css/depth.css, so the
     canvas and the CSS star planes read as the same space rather than two
     unrelated effects. */
  var F = 900;
  var Z_NEAR = 160;
  var Z_FAR = 900;
  var Z_SPAN = Z_FAR - Z_NEAR;
  var PARTICLE_V = 2; /* bump when the world model changes, to migrate old motes */
  var IDLE_V = 0.06; /* world units/frame at rest — the field breathes */
  var MAX_TRAIL = 64; /* px — a streak must read as motion, not as a scratch */
  var TRAVEL_V = 0.16; /* world units per unit of scroll velocity */

  ParticleSystem.prototype.resize = function () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.w = w;
    this.h = h;
    this.vw = w;
    this.vh = h;
    this.isMobile = w < 768;
    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    var target = Math.round(Math.min(180, Math.max(50, (w * h) / 8500)));
    if (this.isMobile) target = 24; // Low particle count on mobile for smooth 60fps scrolling
    this.target = target;

    /* Vanishing point. depth.js nudges cx/cy with the same head-sway it
       applies to perspective-origin, so both systems drift together. */
    this.cx = w / 2;
    this.cy = h * 0.42;
    this.swayX = this.swayX || 0;
    this.swayY = this.swayY || 0;
  };

  /* World half-extent. Kept tight on purpose: a mote spawned far off-axis
     sweeps out of frame almost immediately, so a narrow span means each mote
     spends most of its travel on screen. */
  ParticleSystem.prototype.spanX = function () {
    return (this.w / F) * Z_FAR * 0.22;
  };
  ParticleSystem.prototype.spanY = function () {
    return (this.h / F) * Z_FAR * 0.22;
  };

  ParticleSystem.prototype.respawn = function (p, far) {
    p.wx = (Math.random() - 0.5) * 2 * this.spanX();
    p.wy = (Math.random() - 0.5) * 2 * this.spanY();
    /* Jitter the return depth, or every mote seeded in one frame arrives at
       the near plane in the same frame and the field visibly pulses. */
    p.z = far ? Z_NEAR + Z_SPAN * (0.55 + Math.random() * 0.45) : Z_NEAR + Math.random() * Z_SPAN;
    p.pz = p.z;
    return p;
  };

  /* wx/wy/z are authoritative. x/y are a per-frame projection cache written at
     the end of step(), so hash(), the link pass, draw() and burst() keep
     working in screen space exactly as before. */
  ParticleSystem.prototype.makeParticle = function () {
    var toneIdx = (Math.random() * PALETTE.length) | 0;
    var p = {
      v: PARTICLE_V,
      x: 0,
      y: 0,
      wx: 0,
      wy: 0,
      z: 0,
      pz: 0,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.5 + 0.5,
      base: Math.random() * 0.5 + 0.28,
      toneIdx: toneIdx,
      tone: PALETTE[toneIdx],
      phase: Math.random() * Math.PI * 2,
      rate: Math.random() * 0.02 + 0.006,
      drift: Math.random() * 0.4 + 0.2
    };
    return this.respawn(p, false);
  };

  ParticleSystem.prototype.seed = function () {
    var next = [];
    for (var i = 0; i < this.target; i++) {
      var existing = this.particles[i];
      /* seed() reuses objects across resizes; a mote from an older world model
         would carry an incompatible z range, so migrate it instead. */
      if (existing && existing.v !== PARTICLE_V) existing = null;
      next.push(existing || this.makeParticle());
    }
    this.particles = next;
  };

  ParticleSystem.prototype.bind = function () {
    var self = this;
    var resizeTimer;

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        self.resize();
        self.seed();
      }, 180);
    });

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch" || self.isMobile) return;
      self.pointer.x = e.clientX;
      self.pointer.y = e.clientY;
      self.pointer.inside = true;
    }, { passive: true });

    window.addEventListener("pointerdown", function (e) {
      if (self.isMobile) return;
      self.pointer.down = true;
      self.burst(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener("pointerup", function () {
      self.pointer.down = false;
    }, { passive: true });

    window.addEventListener("pointerleave", function () {
      self.pointer.inside = false;
      self.pointer.x = -9999;
      self.pointer.y = -9999;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) self.stop();
      else self.start();
    });
  };

  ParticleSystem.prototype.burst = function (x, y) {
    this.bursts.push({ x: x, y: y, r: 0, life: 1 });
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var dx = p.x - x;
      var dy = p.y - y;
      var d2 = dx * dx + dy * dy;
      if (d2 < 46000 && d2 > 0.5) {
        var d = Math.sqrt(d2);
        var push = (1 - d / 214) * 3.4;
        p.vx += (dx / d) * push;
        p.vy += (dy / d) * push;
      }
    }
  };

  ParticleSystem.prototype.hash = function () {
    this.grid.clear();
    var c = this.cell;
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var key = ((p.x / c) | 0) + ":" + ((p.y / c) | 0);
      var bucket = this.grid.get(key);
      if (bucket) bucket.push(p);
      else this.grid.set(key, [p]);
    }
  };

  /* Fed by js/depth.js from the shared ticker, so the motes, the fog and the
     head-sway all agree about how fast the reader is moving. */
  ParticleSystem.prototype.setScroll = function (sv) {
    this.sv = sv || 0;
  };

  ParticleSystem.prototype.step = function (dt) {
    var pt = this.pointer;
    var sv = this.sv || 0;
    var coupling = this.isMobile ? 0.3 : 1;
    var dx = pt.x - pt.px;
    var dy = pt.y - pt.py;
    pt.speed = Math.min(Math.sqrt(dx * dx + dy * dy), 60);
    pt.px = pt.x;
    pt.py = pt.y;

    var repelling = pt.speed > 6 && !pt.down;
    var reach = pt.down ? 260 : 170;
    var reach2 = reach * reach;

    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];

      p.phase += p.rate * dt;
      p.vx += Math.sin(p.phase * 0.6) * 0.004 * p.drift;
      p.vy += Math.cos(p.phase * 0.4) * 0.004 * p.drift;

      /* Pointer force is measured in screen px but has to move world coords,
         so the impulse scales by z/F — a far mote needs a proportionally
         larger world push to shift the same number of pixels. */
      if (pt.inside && !this.isMobile) {
        var ax = p.x - pt.x;
        var ay = p.y - pt.y;
        var d2 = ax * ax + ay * ay;
        if (d2 < reach2 && d2 > 1) {
          var d = Math.sqrt(d2);
          var falloff = 1 - d / reach;
          var force = pt.down
            ? -falloff * 0.9
            : repelling
              ? falloff * (0.4 + pt.speed * 0.02)
              : -falloff * 0.09;
          var world = p.z / F;
          p.vx += (ax / d) * force * world;
          p.vy += (ay / d) * force * world;
        }
      }

      p.vx *= 0.965;
      p.vy *= 0.965;
      p.wx += p.vx * dt;
      p.wy += p.vy * dt;

      /* Forward travel: depth closes toward the camera. A slow idle drift
         keeps the field alive at rest; scrolling accelerates it. */
      p.pz = p.z;
      p.z -= (IDLE_V + Math.abs(sv) * TRAVEL_V * coupling) * dt * (sv < 0 ? -1 : 1);

      /* dt is clamped to 3, and a fast fling can still cross the whole span in
         one frame — so recycle with a loop, not a single if. */
      while (p.z < Z_NEAR) {
        this.respawn(p, true);
      }
      while (p.z > Z_FAR) {
        p.z -= Z_SPAN;
        p.pz = p.z;
      }

      /* Project. x/y are a cache from here on — everything downstream reads
         them in screen space exactly as it always did. */
      var inv = F / p.z;
      p.x = this.cx + this.swayX + p.wx * inv;
      p.y = this.cy + this.swayY + p.wy * inv;

      /* A mote that has drifted far off-axis will never come back; recycle it
         rather than integrating it forever. */
      if (p.x < -this.w || p.x > this.w * 2 || p.y < -this.h || p.y > this.h * 2) {
        this.respawn(p, true);
      }
    }

    for (var b = this.bursts.length - 1; b >= 0; b--) {
      var burst = this.bursts[b];
      burst.r += 6.5 * dt;
      burst.life -= 0.022 * dt;
      if (burst.life <= 0) this.bursts.splice(b, 1);
    }
  };

  ParticleSystem.prototype.draw = function () {
    var ctx = this.ctx;
    var pt = this.pointer;
    ctx.clearRect(0, 0, this.w, this.h);

    // At rest the sky is a chart; in motion it is a tunnel. Screen-space links
    // between motes at very different depths would read as rubber bands into
    // the screen and fight the fly-through, so they only exist when still.
    if (!this.isMobile && Math.abs(this.sv || 0) <= 3) {
      this.hash();
      ctx.lineWidth = 0.6;
      var range = this.linkRange;
      var range2 = range * range;

      this.grid.forEach(function (bucket, key) {
        var parts = key.split(":");
        var cx = +parts[0];
        var cy = +parts[1];
        for (var ox = 0; ox <= 1; ox++) {
          for (var oy = ox === 0 ? 0 : -1; oy <= 1; oy++) {
            var nKey = (cx + ox) + ":" + (cy + oy);
            var other = this.grid.get(nKey);
            if (!other) continue;
            for (var i = 0; i < bucket.length; i++) {
              var a = bucket[i];
              var start = nKey === key ? i + 1 : 0;
              for (var j = start; j < other.length; j++) {
                var b = other[j];
                var dx = a.x - b.x;
                var dy = a.y - b.y;
                var d2 = dx * dx + dy * dy;
                if (d2 > range2) continue;
                var t = 1 - Math.sqrt(d2) / range;
                var mx = (a.x + b.x) * 0.5 - pt.x;
                var my = (a.y + b.y) * 0.5 - pt.y;
                var near = pt.inside ? Math.max(0, 1 - Math.sqrt(mx * mx + my * my) / 300) : 0;
                var lk = TONE.link;
                var lt = TONE.linkLit;
                ctx.strokeStyle = "rgba(" +
                  Math.round(lk[0] + (lt[0] - lk[0]) * near) + "," +
                  Math.round(lk[1] + (lt[1] - lk[1]) * near) + "," +
                  Math.round(lk[2] + (lt[2] - lk[2]) * near) + "," +
                  (t * (0.07 + near * 0.3) * TONE.linkAlpha).toFixed(3) + ")";
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
      }, this);
    }

    // Render motes
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      /* Depth drives everything: nearer is bigger and brighter. */
      var near = Z_FAR / p.z;
      var fade = Math.min(1, (p.z - Z_NEAR) / (Z_SPAN * 0.22)); /* ease in at the near plane */
      var twinkle = (p.base + Math.sin(p.phase) * 0.24) * Math.min(1, 0.35 + near * 0.4) * fade;
      if (twinkle <= 0.02) continue;

      /* The streak is simply where the mote was last frame projected against
         where it is now — automatically radial from the vanishing point and
         automatically longer the closer it gets. */
      var sx = this.cx + this.swayX + p.wx * (F / p.pz);
      var sy = this.cy + this.swayY + p.wy * (F / p.pz);
      var tdx = sx - p.x;
      var tdy = sy - p.y;
      var trail = Math.sqrt(tdx * tdx + tdy * tdy);
      if (trail > MAX_TRAIL) {
        /* Near the camera one frame of travel can span the whole viewport.
           Keep the direction, clamp the length. */
        var k = MAX_TRAIL / trail;
        sx = p.x + tdx * k;
        sy = p.y + tdy * k;
        trail = MAX_TRAIL;
      }

      if (trail > 2) {
        var c2 = p.tone;
        ctx.globalAlpha = twinkle * 0.7;
        ctx.strokeStyle = "rgb(" + c2[0] + "," + c2[1] + "," + c2[2] + ")";
        ctx.lineWidth = Math.max(0.6, p.r * near * 0.5);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      var sprite = SPRITES[p.toneIdx];
      var halo = p.r * 6.4 * near;
      ctx.globalAlpha = twinkle;
      ctx.drawImage(sprite, p.x - halo / 2, p.y - halo / 2, halo, halo);

      var c = p.tone;
      ctx.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.4, p.r * 0.62 * near), 0, 6.283);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    for (var b2 = 0; b2 < this.bursts.length; b2++) {
      var burst = this.bursts[b2];
      ctx.strokeStyle = "rgba(" + TONE.burst.join(",") + "," +
        (burst.life * 0.5).toFixed(3) + ")";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, burst.r, 0, 6.283);
      ctx.stroke();
    }
  };

  ParticleSystem.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    var last = performance.now();

    function frame(now) {
      if (!self.running) return;
      var dt = Math.min((now - last) / 16.667, 3);
      last = now;
      self.step(dt);
      self.draw();
      self.raf = requestAnimationFrame(frame);
    }

    this.raf = requestAnimationFrame(frame);
  };

  ParticleSystem.prototype.stop = function () {
    this.running = false;
    cancelAnimationFrame(this.raf);
  };

  var system = new ParticleSystem(canvas);
  if (reduced) {
    system.step(1);
    system.draw();
  } else {
    system.start();
  }

  /* Repaint the whole system when the chart changes */
  document.addEventListener("themechange", function (e) {
    var next = PALETTES[e.detail.theme] || PALETTES.dark;
    if (next === TONE) return;
    TONE = next;
    PALETTE = TONE.motes;
    createSprites(system.dpr);
    for (var i = 0; i < system.particles.length; i++) {
      var p = system.particles[i];
      p.tone = PALETTE[p.toneIdx];
    }
  });

  window.RealmParticles = system;
})();
