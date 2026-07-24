/* ==========================================================================
   PathwayRenderer — the constellation spine.
   Threads a curve through every .waypoint inside [data-spine], then draws
   that curve in as the reader descends. Waypoints ignite when reached.
   ========================================================================== */

(function () {
  "use strict";

  var host = document.querySelector("[data-spine]");
  if (!host) return;

  var svg = host.querySelector(".spine");
  var path = host.querySelector(".spine-path");
  var ghost = host.querySelector(".spine-ghost");
  var marks = Array.prototype.slice.call(host.querySelectorAll(".waypoint"));
  if (!svg || !path || marks.length < 2) return;

  var length = 0;
  var queued = false;
  var firstY = 0;
  var lastY = 0;

  // The line reaches a waypoint at the same moment that waypoint ignites.
  var LINE_AT = 0.75;

  function build() {
    var box = host.getBoundingClientRect();
    var top = box.top + window.scrollY;
    var points = marks.map(function (mark, i) {
      var m = mark.getBoundingClientRect();
      return {
        x: m.left + m.width / 2 - box.left,
        // A curve that only ever ran straight down would not be a path.
        sway: (i % 2 === 0 ? -1 : 1) * Math.min(box.width * 0.16, 150),
        y: m.top + window.scrollY - top + m.height / 2
      };
    });

    var d = "M " + points[0].x.toFixed(1) + " " + points[0].y.toFixed(1);
    for (var i = 1; i < points.length; i++) {
      var a = points[i - 1];
      var b = points[i];
      var mid = (a.y + b.y) / 2;
      d += " C " + (a.x + a.sway).toFixed(1) + " " + mid.toFixed(1) +
        " " + (b.x + b.sway).toFixed(1) + " " + mid.toFixed(1) +
        " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
    }

    svg.setAttribute("viewBox", "0 0 " + box.width + " " + host.offsetHeight);
    svg.setAttribute("preserveAspectRatio", "none");
    path.setAttribute("d", d);
    if (ghost) ghost.setAttribute("d", d);

    firstY = points[0].y;
    lastY = points[points.length - 1].y;
    length = path.getTotalLength();
    path.style.strokeDasharray = length;
    draw();
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw() {
    // Without motion the path is simply already there.
    if (reduced) {
      path.style.strokeDashoffset = 0;
      for (var r = 0; r < marks.length; r++) marks[r].classList.add("is-lit");
      return;
    }

    var box = host.getBoundingClientRect();
    var view = window.innerHeight;
    var span = lastY - firstY;
    var travelled = view * LINE_AT - box.top - firstY;
    var p = span > 0 ? Math.max(0, Math.min(1, travelled / span)) : 1;
    path.style.strokeDashoffset = (length * (1 - p)).toFixed(1);

    for (var i = 0; i < marks.length; i++) {
      var m = marks[i].getBoundingClientRect();
      marks[i].classList.toggle("is-lit", m.top + m.height / 2 < view * LINE_AT);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      draw();
    });
  }

  var rebuildTimer;
  window.addEventListener("resize", function () {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(build, 160);
  });
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("load", build);
  build();
})();
