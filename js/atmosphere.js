/* ==========================================================================
   Starfield · MagicCursor — the ambient layers.
   Parallax star sheets, occasional shooting stars, and a light that
   follows the pointer so the page always has a source of illumination.
   Optimized to cache viewport geometry and eliminate forced reflows.
   ========================================================================== */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  var vw = window.innerWidth;
  var vh = window.innerHeight;

  window.addEventListener("resize", function () {
    vw = window.innerWidth;
    vh = window.innerHeight;
  }, { passive: true });

  /* --- Starfield ----------------------------------------------------- */

  function Starfield(root) {
    this.root = root;
    this.layers = Array.prototype.slice.call(root.querySelectorAll(".star-layer"));
    this.nebulae = Array.prototype.slice.call(root.querySelectorAll(".nebula"));
    this.depths = [0.014, 0.03, 0.055];
    this.mx = 0;
    this.my = 0;
    this.sy = 0;
    this.queued = false;
    if (!this.layers.length) return;
    this.bind();
    this.render();
  }

  Starfield.prototype.bind = function () {
    var self = this;
    var schedule = function () {
      if (self.queued) return;
      self.queued = true;
      requestAnimationFrame(function () {
        self.queued = false;
        self.render();
      });
    };

    window.addEventListener("pointermove", function (e) {
      self.mx = e.clientX / (vw || 1) - 0.5;
      self.my = e.clientY / (vh || 1) - 0.5;
      schedule();
    }, { passive: true });

    window.addEventListener("scroll", function () {
      self.sy = window.scrollY || window.pageYOffset;
      schedule();
    }, { passive: true });
  };

  Starfield.prototype.render = function () {
    /* The three star sheets are driven by js/depth.js, which moves the whole
       rig once per frame and lets perspective divide the displacement per
       plane. Touching them here as well would fight that transform.

       The nebulae stay out of the 3D subtree — they carry blur(90px), and
       scaling a blurred box re-rasterises it and scales the blur with it. */
    if (window.RealmDepth) {
      for (var n = 0; n < this.nebulae.length; n++) {
        var f = (n + 1) * 0.012;
        this.nebulae[n].style.translate =
          (this.mx * f * 600).toFixed(2) + "px " +
          (this.my * f * 400 - this.sy * f * 0.5).toFixed(2) + "px";
      }
      return;
    }

    /* No depth engine (older browser, or it bailed): the original flat
       parallax, unchanged. */
    for (var i = 0; i < this.layers.length; i++) {
      var d = this.depths[i] || 0.02;
      var x = this.mx * d * 900;
      var y = this.my * d * 600 - this.sy * d * 2.4;
      this.layers[i].style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
    }
    for (var m = 0; m < this.nebulae.length; m++) {
      var g = (m + 1) * 0.012;
      this.nebulae[m].style.translate =
        (this.mx * g * 600).toFixed(2) + "px " + (this.my * g * 400).toFixed(2) + "px";
    }
  };

  Starfield.prototype.streak = function () {
    var el = document.createElement("div");
    el.className = "shooting-star";
    el.style.top = (Math.random() * 45) + "vh";
    el.style.left = (Math.random() * 40 - 20) + "vw";
    this.root.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 1500);
  };

  var cosmos = document.querySelector(".cosmos");
  if (cosmos) {
    var sky = new Starfield(cosmos);
    var scheduleStreak = function () {
      var wait = 7000 + Math.random() * 14000;
      setTimeout(function () {
        if (!document.hidden) sky.streak();
        scheduleStreak();
      }, wait);
    };
    scheduleStreak();

    var lastY = window.scrollY || window.pageYOffset;
    var lastStreak = 0;
    window.addEventListener("scroll", function () {
      var now = performance.now();
      var currentY = window.scrollY || window.pageYOffset;
      var delta = Math.abs(currentY - lastY);
      lastY = currentY;
      if (delta > 220 && now - lastStreak > 4000) {
        lastStreak = now;
        sky.streak();
      }
    }, { passive: true });
  }

  /* --- MagicCursor --------------------------------------------------- */

  function MagicCursor(el) {
    this.el = el;
    this.x = vw / 2;
    this.y = vh / 2;
    this.tx = this.x;
    this.ty = this.y;
    this.bind();
    this.loop();
  }

  MagicCursor.prototype.bind = function () {
    var self = this;
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      self.tx = e.clientX;
      self.ty = e.clientY;
      self.el.classList.add("is-lit");
      self.wake();
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      self.el.classList.remove("is-lit");
    }, { passive: true });
  };

  /* Previously an unconditional rAF that recursed forever, even with the
     pointer untouched for an hour and the tab in the background. Now it
     settles and unsubscribes, and wakes on the next pointermove. */
  MagicCursor.prototype.wake = function () {
    if (this.stopTick) {
      window.RealmTicker.requestFrame();
      return;
    }
    var self = this;
    this.stopTick = window.RealmTicker.subscribe(function (dt) {
      var k = Math.min(0.12 * dt, 1);
      self.x += (self.tx - self.x) * k;
      self.y += (self.ty - self.y) * k;
      self.el.style.transform =
        "translate3d(" + self.x.toFixed(1) + "px," + self.y.toFixed(1) + "px,0)";
      if (Math.abs(self.tx - self.x) < 0.1 && Math.abs(self.ty - self.y) < 0.1) {
        self.x = self.tx;
        self.y = self.ty;
        self.stopTick();
        self.stopTick = null;
      }
    }, "continuous");
  };

  MagicCursor.prototype.loop = function () {
    /* Nothing to start: the lerp only runs while the pointer is moving. */
  };

  var wisp = document.querySelector(".wisp");
  if (wisp && window.RealmTicker && window.matchMedia("(pointer: fine)").matches) {
    new MagicCursor(wisp);
  }
})();
