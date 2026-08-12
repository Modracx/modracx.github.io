/* ==========================================================================
   ScrollController — reveals, resonance meters, journey progress, filtering
   ========================================================================== */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Reveals -------------------------------------------------------- */

  var revealables = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
        if (delay > 0) {
          setTimeout(function () {
            el.classList.add("is-visible");
          }, delay);
        } else {
          el.classList.add("is-visible");
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.01, rootMargin: "100px 0px 50px 0px" });

    Array.prototype.forEach.call(revealables, function (el) {
      // Instantly reveal blog post articles and top hero sections
      if (el.classList.contains("blog-post") || el.closest(".threshold")) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });
  }

  /* --- Resonance meters ----------------------------------------------- */

  var meters = document.querySelectorAll(".meter[data-level]");
  if (meters.length) {
    var fill = function (meter) {
      var bar = meter.querySelector(".meter-track i");
      if (bar) bar.style.width = Math.min(100, +meter.dataset.level || 0) + "%";
    };

    if (reduced || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(meters, fill);
    } else {
      var meterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          fill(entry.target);
          meterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(meters, function (m) {
        meterObserver.observe(m);
      });
    }
  }

  /* --- Journey progress ------------------------------------------------ */

  var bar = document.getElementById("journey-bar");
  var label = document.getElementById("journey-label");
  if (bar || label) {
    var queued = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      if (bar) bar.style.width = pct + "%";
      if (label) label.textContent = pct + "%";
    };
    window.addEventListener("scroll", function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        update();
      });
    }, { passive: true });
    update();
  }

  /* --- Relic filtering -------------------------------------------------- */

  var sieve = document.querySelector(".sieve");
  if (sieve) {
    var relics = document.querySelectorAll(".relic[data-kind]");
    sieve.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var kind = btn.dataset.filter;

      Array.prototype.forEach.call(sieve.querySelectorAll("button"), function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });

      var shown = 0;
      Array.prototype.forEach.call(relics, function (relic) {
        var match = kind === "all" || relic.dataset.kind === kind || (relic.dataset.kind && relic.dataset.kind.indexOf(kind) !== -1);
        relic.classList.toggle("is-hidden", !match);
        relic.classList.toggle("is-dimmed", !match);
        relic.style.display = match ? "" : "none";
        relic.setAttribute("aria-hidden", match ? "false" : "true");
        if (match) shown++;
      });

      var count = document.getElementById("sieve-count");
      if (count) {
        count.textContent = shown + (shown === 1 ? " entry" : " entries");
      }
    });
  }

})();
