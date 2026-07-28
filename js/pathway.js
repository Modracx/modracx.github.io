/* ==========================================================================
   PathwayRenderer — the constellation spine.
   Threads a curve through every .waypoint inside [data-spine], then draws
   that curve in as the reader descends. Waypoints ignite when reached.
   Optimized to cache bounding geometry and prevent forced reflows during scroll.
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
  var hostTop = 0;
  var hostHeight = 0;
  var hostWidth = 0;
  var cachedMarks = [];

  // The line reaches a waypoint at the same moment that waypoint ignites.
  var LINE_AT = 0.75;

  function build() {
    var scrollY = window.scrollY || window.pageYOffset;
    var box = host.getBoundingClientRect();
    hostTop = box.top + scrollY;
    hostHeight = host.offsetHeight;
    hostWidth = box.width;

    cachedMarks = marks.map(function (mark, i) {
      var m = mark.getBoundingClientRect();
      var markTop = m.top + scrollY - hostTop + m.height / 2;
      return {
        el: mark,
        x: m.left + m.width / 2 - box.left,
        sway: (i % 2 === 0 ? -1 : 1) * Math.min(box.width * 0.16, 150),
        y: markTop,
        relTop: markTop
      };
    });

    var d = "M " + cachedMarks[0].x.toFixed(1) + " " + cachedMarks[0].y.toFixed(1);
    for (var i = 1; i < cachedMarks.length; i++) {
      var a = cachedMarks[i - 1];
      var b = cachedMarks[i];
      var mid = (a.y + b.y) / 2;
      d += " C " + (a.x + a.sway).toFixed(1) + " " + mid.toFixed(1) +
        " " + (b.x + b.sway).toFixed(1) + " " + mid.toFixed(1) +
        " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
    }

    svg.setAttribute("viewBox", "0 0 " + hostWidth + " " + hostHeight);
    svg.setAttribute("preserveAspectRatio", "none");
    path.setAttribute("d", d);
    if (ghost) ghost.setAttribute("d", d);

    firstY = cachedMarks[0].y;
    lastY = cachedMarks[cachedMarks.length - 1].y;
    length = path.getTotalLength();
    path.style.strokeDasharray = length;
    draw();
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw() {
    if (reduced) {
      path.style.strokeDashoffset = 0;
      for (var r = 0; r < marks.length; r++) marks[r].classList.add("is-lit");
      return;
    }

    var scrollY = window.scrollY || window.pageYOffset;
    var view = window.innerHeight;
    var currentBoxTop = hostTop - scrollY;
    var span = lastY - firstY;
    var travelled = view * LINE_AT - currentBoxTop - firstY;
    var p = span > 0 ? Math.max(0, Math.min(1, travelled / span)) : 1;
    path.style.strokeDashoffset = (length * (1 - p)).toFixed(1);

    var targetThreshold = view * LINE_AT - currentBoxTop;
    for (var i = 0; i < cachedMarks.length; i++) {
      var cm = cachedMarks[i];
      cm.el.classList.toggle("is-lit", cm.relTop < targetThreshold);
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
