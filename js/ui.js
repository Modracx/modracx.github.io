/* ==========================================================================
   UI — header state, navigation, ward sheets, the project brief, and toasts.
   ========================================================================== */

(function () {
  "use strict";

  var body = document.body;

  /* --- Toast ---------------------------------------------------------- */

  var toast = document.getElementById("toast");
  var toastTimer;

  function say(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-shown");
    }, 3200);
  }

  /* --- Header --------------------------------------------------------- */

  var header = document.querySelector(".sky-header");
  if (header) {
    var anchor = function () {
      header.classList.toggle("is-anchored", window.scrollY > 40);
    };
    window.addEventListener("scroll", anchor, { passive: true });
    anchor();
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("sky-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") return;
      nav.classList.remove("is-open");
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  /* --- Pointer-tracked highlights ------------------------------------- */

  document.addEventListener("pointermove", function (e) {
    var lit = e.target.closest(".ward, .spell");
    if (!lit) return;
    var box = lit.getBoundingClientRect();
    lit.style.setProperty("--mx", ((e.clientX - box.left) / box.width * 100).toFixed(1) + "%");
    lit.style.setProperty("--my", ((e.clientY - box.top) / box.height * 100).toFixed(1) + "%");
  }, { passive: true });

  /* --- Ward sheet ------------------------------------------------------ */

  var sheet = document.getElementById("ward-sheet");

  if (sheet) {
    var lastFocus = null;
    var fields = {
      rune: sheet.querySelector("[data-sheet-rune]"),
      title: sheet.querySelector("[data-sheet-title]"),
      lede: sheet.querySelector("[data-sheet-lede]"),
      flow: sheet.querySelector("[data-sheet-flow]"),
      focus: sheet.querySelector("[data-sheet-focus]"),
      stack: sheet.querySelector("[data-sheet-stack]"),
      link: sheet.querySelector("[data-sheet-link]")
    };

    var closeSheet = function () {
      sheet.classList.remove("is-open");
      sheet.setAttribute("aria-hidden", "true");
      if (lastFocus) lastFocus.focus();
    };

    var openSheet = function (ward) {
      lastFocus = ward;
      fields.rune.textContent = ward.dataset.rune || "";
      fields.title.textContent = ward.dataset.title || "";
      fields.lede.textContent = ward.dataset.lede || "";
      fields.focus.textContent = ward.dataset.focus || "";
      fields.stack.textContent = ward.dataset.stack || "";
      fields.link.href = ward.getAttribute("href");

      fields.flow.innerHTML = "";
      (ward.dataset.flow || "").split("|").filter(Boolean).forEach(function (step, i) {
        var li = document.createElement("li");
        li.innerHTML = "<span>" + (i + 1).toString().padStart(2, "0") + "</span>" + step;
        fields.flow.appendChild(li);
      });

      sheet.classList.add("is-open");
      sheet.setAttribute("aria-hidden", "false");
      sheet.querySelector(".sheet-close").focus();
    };

    document.addEventListener("click", function (e) {
      var ward = e.target.closest(".ward[data-title]");
      if (ward) {
        e.preventDefault();
        openSheet(ward);
        return;
      }
      if (e.target.closest("[data-close-sheet]")) closeSheet();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("is-open")) closeSheet();
    });
  }


  /* --- Descend shortcut ------------------------------------------------ */

  var descend = document.querySelector("[data-descend]");
  if (descend) {
    var target = document.querySelector(descend.dataset.descend);
    var jump = function () {
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    descend.addEventListener("click", jump);
    document.addEventListener("keydown", function (e) {
      if (e.code !== "Space") return;
      if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(document.activeElement.tagName)) return;
      if (window.scrollY > 40) return;
      e.preventDefault();
      jump();
    });
  }

  /* --- Project brief --------------------------------------------------- */

  var brief = document.getElementById("brief-form");
  if (brief) {
    brief.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(brief);
      var name = (data.get("name") || "").toString().trim();
      var subject = "Project brief — " + (data.get("projectType") || "New project");
      var lines = [
        "Name: " + name,
        "Email: " + (data.get("email") || ""),
        "Company: " + (data.get("company") || "—"),
        "Project type: " + (data.get("projectType") || ""),
        "",
        (data.get("brief") || "").toString()
      ];
      window.location.href = "mailto:kd.xtrm@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
      say("Draft ready — check your mail app");
    });
  }

  /* --- Realm clock ------------------------------------------------------ */

  var clock = document.getElementById("realm-clock");
  if (clock) {
    var tick = function () {
      clock.textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });
    };
    tick();
    setInterval(tick, 1000);
  }
})();
