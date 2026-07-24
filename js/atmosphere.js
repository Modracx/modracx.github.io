/* ==========================================================================
   Starfield · MagicCursor — the ambient layers.
   Parallax star sheets, occasional shooting stars, and a light that
   follows the pointer so the page always has a source of illumination.
   ========================================================================== */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

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
      self.mx = e.clientX / window.innerWidth - 0.5;
      self.my = e.clientY / window.innerHeight - 0.5;
      schedule();
    }, { passive: true });

    window.addEventListener("scroll", function () {
      self.sy = window.scrollY;
      schedule();
    }, { passive: true });
  };

  Starfield.prototype.render = function () {
    for (var i = 0; i < this.layers.length; i++) {
      var d = this.depths[i] || 0.02;
      var x = this.mx * d * 900;
      var y = this.my * d * 600 - this.sy * d * 2.4;
      this.layers[i].style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
    }
    for (var n = 0; n < this.nebulae.length; n++) {
      var f = (n + 1) * 0.012;
      this.nebulae[n].style.translate =
        (this.mx * f * 600).toFixed(2) + "px " + (this.my * f * 400).toFixed(2) + "px";
    }
  };

  /* Shooting stars arrive on their own schedule, never twice at once. */
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

    // Scrolling fast enough also tears one loose.
    var lastY = window.scrollY;
    var lastStreak = 0;
    window.addEventListener("scroll", function () {
      var now = performance.now();
      var delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      if (delta > 220 && now - lastStreak > 4000) {
        lastStreak = now;
        sky.streak();
      }
    }, { passive: true });
  }

  /* --- MagicCursor --------------------------------------------------- */

  function MagicCursor(el) {
    this.el = el;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
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
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      self.el.classList.remove("is-lit");
    });
  };

  MagicCursor.prototype.loop = function () {
    var self = this;
    (function frame() {
      self.x += (self.tx - self.x) * 0.12;
      self.y += (self.ty - self.y) * 0.12;
      self.el.style.transform = "translate3d(" + self.x.toFixed(1) + "px," + self.y.toFixed(1) + "px,0)";
      requestAnimationFrame(frame);
    })();
  };

  var wisp = document.querySelector(".wisp");
  if (wisp && window.matchMedia("(pointer: fine)").matches) {
    new MagicCursor(wisp);
  }
})();
