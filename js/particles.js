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

  var PALETTE = [
    [240, 192, 96],
    [167, 139, 250],
    [240, 244, 255]
  ];

  var SPRITES = [];
  function createSprites(dpr) {
    SPRITES = PALETTE.map(function (c) {
      var size = Math.ceil(12 * dpr);
      var off = document.createElement("canvas");
      off.width = size;
      off.height = size;
      var octx = off.getContext("2d");
      var r = size / 2;
      var rgb = c[0] + "," + c[1] + "," + c[2];
      var g = octx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, "rgba(" + rgb + ",0.55)");
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
  };

  ParticleSystem.prototype.makeParticle = function (x, y) {
    var toneIdx = (Math.random() * PALETTE.length) | 0;
    return {
      x: x === undefined ? Math.random() * this.w : x,
      y: y === undefined ? Math.random() * this.h : y,
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
  };

  ParticleSystem.prototype.seed = function () {
    var next = [];
    for (var i = 0; i < this.target; i++) {
      next.push(this.particles[i] || this.makeParticle());
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

  ParticleSystem.prototype.step = function (dt) {
    var pt = this.pointer;
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
          p.vx += (ax / d) * force;
          p.vy += (ay / d) * force;
        }
      }

      p.vx *= 0.965;
      p.vy *= 0.965;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x < -20) p.x = this.w + 20;
      else if (p.x > this.w + 20) p.x = -20;
      if (p.y < -20) p.y = this.h + 20;
      else if (p.y > this.h + 20) p.y = -20;
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

    // Skip heavy spatial hash link calculations on mobile screens
    if (!this.isMobile) {
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
                ctx.strokeStyle = "rgba(" + (150 + near * 90) + "," + (140 + near * 52) + ",235," +
                  (t * (0.07 + near * 0.3)).toFixed(3) + ")";
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
      var twinkle = p.base + Math.sin(p.phase) * 0.24;
      if (twinkle <= 0.02) continue;

      var sprite = SPRITES[p.toneIdx];
      var halo = p.r * 6.4;
      ctx.globalAlpha = twinkle;
      ctx.drawImage(sprite, p.x - halo / 2, p.y - halo / 2, halo, halo);

      var c = p.tone;
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.62, 0, 6.283);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    for (var b2 = 0; b2 < this.bursts.length; b2++) {
      var burst = this.bursts[b2];
      ctx.strokeStyle = "rgba(240,192,96," + (burst.life * 0.5).toFixed(3) + ")";
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

  window.RealmParticles = system;
})();
