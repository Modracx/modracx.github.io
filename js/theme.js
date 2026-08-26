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

  /* What the reader actually chose. "system" is represented by the ABSENCE of
     a stored key — which is exactly what the pre-paint snippet in every page
     already treats as "leave data-theme alone", so nothing else has to change. */
  function choice() {
    return stored() || "system";
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
    /* Read the live token rather than repeating the palette, so retuning
       --c-bg in either chart cannot silently desync the browser chrome. */
    var probe = getComputedStyle(root).getPropertyValue("--c-bg").trim();
    var parts = probe.split(/[\s,]+/).filter(Boolean);
    if (parts.length === 3) {
      meta.setAttribute("content", "rgb(" + parts.join(" ") + ")");
    } else {
      meta.setAttribute("content", theme === "light" ? "#f5f6fb" : "#07071a");
    }
  }

  function apply(theme, opts) {
    opts = opts || {};
    if (opts.animate) {
      root.classList.add("theme-shifting");
      setTimeout(function () {
        root.classList.remove("theme-shifting");
      }, 400);
    }
    root.setAttribute("data-theme", theme);
    paintBrowserChrome(theme);
    if (opts.persist !== false) {
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {
        /* private mode — the choice simply will not outlive the page */
      }
    }
    announce(theme, opts.choice || theme);
  }

  function announce(theme, sel) {
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: theme, choice: sel } })
    );
  }

  /* The only way back to following the operating system: drop the key and the
     attribute, and let the cascade take over. */
  function setChoice(sel, animate) {
    if (sel === "system") {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
      if (animate) {
        root.classList.add("theme-shifting");
        setTimeout(function () {
          root.classList.remove("theme-shifting");
        }, 400);
      }
      root.removeAttribute("data-theme");
      var resolved = systemTheme();
      paintBrowserChrome(resolved);
      announce(resolved, "system");
      return resolved;
    }
    apply(sel, { animate: animate, persist: true, choice: sel });
    return sel;
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

  var SYSTEM =
    '<svg class="icon-system" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="8.4"/>' +
    '<path d="M12 3.6a8.4 8.4 0 0 1 0 16.8z" fill="currentColor" stroke="none"/></svg>';

  function build() {
    var tools = document.querySelector(".sky-tools");
    if (!tools || tools.querySelector(".theme-switch")) return null;

    /* A radiogroup, not a toggle button: three states cannot be expressed by
       aria-pressed, and a reader needs to hear WHICH of three is active rather
       than what the next click would do. */
    var group = document.createElement("div");
    group.className = "theme-switch";
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", "Theme");

    var thumb = document.createElement("i");
    thumb.setAttribute("aria-hidden", "true");
    group.appendChild(thumb);

    var OPTIONS = [
      { value: "system", icon: SYSTEM, text: "Follow system theme" },
      { value: "light", icon: SUN, text: "Light theme" },
      { value: "dark", icon: MOON, text: "Dark theme" }
    ];

    var radios = OPTIONS.map(function (opt) {
      var r = document.createElement("button");
      r.type = "button";
      r.setAttribute("role", "radio");
      r.dataset.choice = opt.value;
      r.innerHTML = opt.icon + '<span class="sr-only">' + opt.text + "</span>";
      r.title = opt.text;
      group.appendChild(r);
      return r;
    });

    var label = function (sel) {
      group.setAttribute("data-choice", sel);
      radios.forEach(function (r) {
        var on = r.dataset.choice === sel;
        r.setAttribute("aria-checked", String(on));
        /* Roving tabindex: the group is one tab stop, arrows move within it. */
        r.tabIndex = on ? 0 : -1;
      });
    };

    label(choice());

    var pick = function (sel, focus) {
      setChoice(sel, true);
      label(sel);
      if (focus) {
        radios.forEach(function (r) {
          if (r.dataset.choice === sel) r.focus();
        });
      }
    };

    group.addEventListener("click", function (e) {
      var r = e.target.closest("[role=radio]");
      if (r) pick(r.dataset.choice, false);
    });

    group.addEventListener("keydown", function (e) {
      var i = radios.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % radios.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i + radios.length - 1) % radios.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = radios.length - 1;
      if (next === null) return;
      e.preventDefault();
      pick(radios[next].dataset.choice, true);
    });

    /* Keep the control honest when the OS flips underneath a "system" reader. */
    document.addEventListener("themechange", function (e) {
      label(e.detail.choice || choice());
    });

    var btn = group;

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
      announce(theme, "system");
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
  window.MODRACX_THEME = { current: current, apply: apply, choice: choice, setChoice: setChoice };
})();
