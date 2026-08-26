/*
   Ticker — one rAF, one scroll listener, one resize listener.

   Every ambient system on the site subscribes here instead of opening its own
   loop. The loop stops completely when nothing continuous is subscribed, so an
   idle tab costs nothing.

   state.sv is the smoothed scroll velocity, computed once and shared by the
   depth rig, the fog, the torch and the particle field, so they can never
   disagree about how fast the reader is moving.
*/
(function () {
  "use strict";

  var reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var MOBILE = 768;

  var state = {
    y: window.scrollY || 0,
    dy: 0,
    sv: 0,
    vw: window.innerWidth,
    vh: window.innerHeight,
    mobile: window.innerWidth < MOBILE,
    reduced: reduced
  };

  var subs = [];
  var continuous = 0;
  var handle = 0;
  var last = 0;
  var lastY = state.y;
  var raw = 0;

  function running() {
    return handle !== 0;
  }

  function frame(now) {
    handle = 0;

    var dt = last ? Math.min((now - last) / 16.667, 3) : 1;
    last = now;

    /* Asymmetric attack / release: quick to respond, and fully settled inside
       --t-slow (900ms) so the fog and the sway are gone shortly after the
       reader stops, rather than trailing them for two seconds. */
    state.sv += (raw - state.sv) * 0.35 * dt;
    raw *= 0.62;
    if (Math.abs(state.sv) < 0.05) state.sv = 0;

    /* Snapshot: a subscriber may unsubscribe itself from inside its own tick. */
    var list = subs.slice();
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      if (!s.active) continue;
      if (s.mode === "continuous" || s.wanted) {
        s.wanted = false;
        s.fn(dt, state);
      }
    }

    /* Keep the loop alive only while something continuous is subscribed, or
       while velocity is still bleeding off toward the deadband. */
    if (continuous > 0 || state.sv !== 0) schedule();
    else last = 0;
  }

  function schedule() {
    if (handle || document.hidden) return;
    handle = window.requestAnimationFrame(frame);
  }

  function requestFrame() {
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].active && subs[i].mode === "ondemand") subs[i].wanted = true;
    }
    schedule();
  }

  function subscribe(fn, mode) {
    var sub = { fn: fn, mode: mode === "continuous" ? "continuous" : "ondemand", active: true, wanted: false };
    subs.push(sub);
    if (sub.mode === "continuous") {
      continuous += 1;
      schedule();
    }
    return function unsubscribe() {
      if (!sub.active) return;
      sub.active = false;
      if (sub.mode === "continuous") continuous = Math.max(0, continuous - 1);
      var idx = subs.indexOf(sub);
      if (idx > -1) subs.splice(idx, 1);
    };
  }

  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY || 0;
      state.dy = y - state.y;
      state.y = y;
      /* Clamp per event so a fling or an anchor jump can't teleport anything. */
      raw = Math.max(-120, Math.min(120, y - lastY));
      lastY = y;
      requestFrame();
    },
    { passive: true }
  );

  var resizeTimer = 0;
  window.addEventListener(
    "resize",
    function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        state.vw = window.innerWidth;
        state.vh = window.innerHeight;
        state.mobile = state.vw < MOBILE;
        requestFrame();
      }, 180);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (handle) window.cancelAnimationFrame(handle);
      handle = 0;
      last = 0;
      return;
    }
    /* Resume without handing anyone a giant delta. */
    lastY = window.scrollY || 0;
    state.y = lastY;
    state.dy = 0;
    state.sv = 0;
    raw = 0;
    last = 0;
    requestFrame();
    if (continuous > 0) schedule();
  });

  window.RealmTicker = {
    subscribe: subscribe,
    requestFrame: requestFrame,
    state: state,
    running: running
  };
})();
