/*
   Depth — the camera rig.

   Builds a preserve-3d wrapper inside .cosmos, moves the three star sheets
   into it at real depths, and drives one transform per frame. Because the
   children sit at different Z, a single shared displacement is projected
   differently per layer, so the parallax is correct by construction rather
   than by a hand-tuned coefficient table.

   Head-sway is applied to perspective-origin on the host, which moves the
   vanishing point and therefore every plane at once, from one property
   write and with no re-rasterisation.

   Nothing here touches text, and the fog it injects sits below the content.
*/
(function () {
  "use strict";

  var ticker = window.RealmTicker;
  if (!ticker) return;

  /* Mirrors the guard in js/atmosphere.js — never rely on the CSS
     sledgehammer in base.css, which cannot stop scroll-driven motion. */
  if (ticker.state.reduced) return;

  var cosmos = document.querySelector(".cosmos");
  if (!cosmos) return;

  /* --- Intensity dial -------------------------------------------------- */

  var PROFILES = {
    home: "full",
    about: "full",
    services: "full",
    work: "light",
    "blog-index": "light",
    docs: "light",
    blog: "minimal",
    contact: "minimal"
  };

  var body = document.body;
  if (!body.dataset.depth) {
    body.dataset.depth = PROFILES[body.dataset.page] || "light";
  }

  function dial() {
    var v = parseFloat(
      window.getComputedStyle(body).getPropertyValue("--depth-scale")
    );
    return isNaN(v) ? 1 : v;
  }

  var scale = dial();
  if (scale <= 0) return;

  /* --- Build the rig --------------------------------------------------- */

  var layers = cosmos.querySelectorAll(".star-layer");
  if (!layers.length) return;

  var field = document.createElement("div");
  field.className = "depth-field";
  field.setAttribute("aria-hidden", "true");
  cosmos.insertBefore(field, cosmos.firstChild);
  for (var i = 0; i < layers.length; i++) {
    /* Drop any inline transform a previous owner left behind — it would win
       over the depth planes declared in css/depth.css. */
    layers[i].style.transform = "";
    field.appendChild(layers[i]);
  }

  /* Fog: injected before .realm so it can never veil a glyph. */
  var fog = document.createElement("div");
  fog.className = "fog";
  fog.setAttribute("aria-hidden", "true");
  var realm = document.getElementById("realm");
  if (realm && realm.parentNode) realm.parentNode.insertBefore(fog, realm);
  else document.body.appendChild(fog);

  /* --- Constants ------------------------------------------------------- */

  var TRAVEL = 0.09; /* world px per scrolled px */
  var LOOP = 1680; /* wrap period; tile sizes are chosen to divide it */
  var SWAY_X = 26;
  var SWAY_Y = 12;
  var W_X = (Math.PI * 2) / 3.4; /* a slow walking gait */
  var W_Y = W_X / 2;

  var env = 0; /* sway envelope, 0 at rest */
  var mx = 0;
  var my = 0;
  var t = 0;

  var wisp = document.querySelector(".wisp");

  /* --- Pointer (replaces the per-layer maths in atmosphere.js) --------- */

  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType === "touch") return;
        mx = e.clientX / ticker.state.vw - 0.5;
        my = e.clientY / ticker.state.vh - 0.5;
        ticker.requestFrame();
      },
      { passive: true }
    );
  }

  /* --- Frame ----------------------------------------------------------- */

  function tick(dt, state) {
    t += dt * 0.016;

    var sv = body.classList.contains("is-composing") ? 0 : state.sv;
    var speed = Math.abs(sv);

    /* Sway envelope: present while moving, still when still. */
    var target = Math.min(speed / 90, 1);
    env += (target - env) * 0.06 * dt;
    if (env < 0.004 && target === 0) env = 0;

    /* Forward travel, wrapped so it never runs out on a long page.
       Positive modulo first, then negate — stars drift up as you descend. */
    var m = ((state.y * TRAVEL * scale) % LOOP + LOOP) % LOOP;
    field.style.transform = "translate3d(0," + (-m).toFixed(2) + "px,0)";

    /* One property, every plane. */
    var amp = (state.mobile ? 0.5 : 1) * scale;
    var px = mx * 40 * scale + SWAY_X * Math.sin(t * W_X) * env * amp;
    var py = my * 26 * scale + SWAY_Y * Math.sin(t * W_Y + 1.3) * env * amp;
    cosmos.style.perspectiveOrigin =
      "calc(50% + " + px.toFixed(1) + "px) calc(42% + " + py.toFixed(1) + "px)";

    /* The canvas vanishing point drifts with the CSS one, so the mote field
       and the star planes read as a single camera rather than two effects. */
    if (window.RealmParticles) {
      window.RealmParticles.swayX = px;
      window.RealmParticles.swayY = py;
    }

    /* Fog thickens with speed. Written on .fog, never on :root — a custom
       property on the root invalidates style for every element that reads
       it, which on a 20-chapter post is the whole document, 60× a second. */
    var fmax = fogCeiling();
    var f = Math.min(fmax, (speed / 120) * fmax);
    fog.style.setProperty("--fog-bot", f.toFixed(3));
    fog.style.setProperty("--fog-top", (f * 0.6).toFixed(3));

    /* Torch dips slightly as you move — opacity only, so it stays free and
       can only ever reduce the veil the contrast audit already passed. */
    if (wisp) {
      wisp.style.opacity = wisp.classList.contains("is-lit")
        ? (1 - Math.min(speed / 120, 1) * 0.3).toFixed(3)
        : "";
    }

    /* Hand the shared velocity to the particle field. */
    if (window.RealmParticles && window.RealmParticles.setScroll) {
      window.RealmParticles.setScroll(sv * scale);
    }
  }

  var fogMax = -1;
  function fogCeiling() {
    if (fogMax < 0) {
      var v = parseFloat(
        window.getComputedStyle(body).getPropertyValue("--depth-fog")
      );
      fogMax = (isNaN(v) ? 0.55 : v) * scale;
    }
    /* The composing guard has to reach the JS-driven layers too. */
    return body.classList.contains("is-composing") ? 0 : fogMax;
  }

  /* --depth-fog differs per chart, and fogCeiling() caches it. Without this
     the ceiling would keep the old chart's value until a reload. */
  document.addEventListener("themechange", function () {
    fogMax = -1;
  });

  ticker.subscribe(tick, "continuous");

  /* --- Composing guard -------------------------------------------------- */

  var missive = document.querySelector(".missive");
  if (missive) {
    missive.addEventListener("focusin", function () {
      body.classList.add("is-composing");
    });
    missive.addEventListener("focusout", function () {
      body.classList.remove("is-composing");
    });
  }

  window.RealmDepth = {
    field: field,
    fog: fog,
    profile: body.dataset.depth
  };
})();
