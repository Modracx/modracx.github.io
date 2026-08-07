/* ==========================================================================
   Theme — the night chart / day chart switch.

   The stored choice is applied by a tiny inline script in each page's <head>
   (see the head snippet) so the correct chart is painted on the first frame
   and there is no flash. This file owns the rest: building the control,
   recording the choice, and telling the canvas layers to repaint.

   Storage: localStorage["modracx_theme"] = "light" | "dark".
   Absent means "follow the system", which is the default.
   ========================================================================== */

(function () {
  "use strict";

  var KEY = "modracx_theme";
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  /* What is actually on screen right now */
  function current() {
    return root.getAttribute("data-theme") || systemTheme();
  }

  /* The <meta name="theme-color"> drives the browser chrome on mobile, so it
     has to follow the chart. Read from the live tokens rather than repeating
     the palette here. */
  function paintBrowserChrome(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", theme === "light" ? "#f5f6fb" : "#07071a");
  }

  function apply(theme, animate) {
    if (animate) {
      root.classList.add("theme-shifting");
      setTimeout(function () {
        root.classList.remove("theme-shifting");
      }, 400);
    }
    root.setAttribute("data-theme", theme);
    paintBrowserChrome(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      /* private mode — the choice simply will not outlive the page */
    }
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  /* --- The control ----------------------------------------------------- */

  var SUN =
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2' +
    'M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/></svg>';

  var MOON =
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>';

  function build() {
    var tools = document.querySelector(".sky-tools");
    if (!tools || tools.querySelector(".theme-switch")) return null;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-switch";
    btn.innerHTML = '<i aria-hidden="true"></i>' + SUN + MOON;

    /* The switch reports the chart it is about to turn on, which is what a
       screen reader user needs to hear before activating it. */
    var label = function (theme) {
      btn.setAttribute("data-mode", theme);
      btn.setAttribute("aria-pressed", String(theme === "dark"));
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Dark theme on. Switch to light." : "Light theme on. Switch to dark."
      );
      btn.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    };

    label(current());

    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next, true);
      label(next);
    });

    document.addEventListener("themechange", function (e) {
      label(e.detail.theme);
    });

    /* Sits ahead of the menu button so the hamburger stays at the edge */
    var navToggle = tools.querySelector(".nav-toggle");
    if (navToggle) tools.insertBefore(btn, navToggle);
    else tools.appendChild(btn);
    return btn;
  }

  /* --- System preference ----------------------------------------------- */

  /* With no choice recorded, the site tracks the operating system live. */
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    var onSystemChange = function () {
      if (stored()) return;
      var theme = systemTheme();
      root.setAttribute("data-theme", theme);
      paintBrowserChrome(theme);
      document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
    };
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  paintBrowserChrome(current());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }

  /* Exposed so other layers (the particle canvas) can ask without guessing */
  window.MODRACX_THEME = { current: current, apply: apply };
})();
