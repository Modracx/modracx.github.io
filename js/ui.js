/* ==========================================================================
   UI — header state, navigation, ward sheets, the grimoire console,
   the project brief, and toasts.
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

  /* --- Grimoire console ------------------------------------------------ */

  var grimoire = document.getElementById("grimoire");

  if (grimoire) {
    var log = grimoire.querySelector(".grimoire-log");
    var form = grimoire.querySelector(".grimoire-form");
    var input = grimoire.querySelector(".grimoire-form input");

    var write = function (who, text, echo) {
      var p = document.createElement("p");
      if (echo) p.className = "echo";
      p.innerHTML = "<b>" + who + "</b>" + text;
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
    };

    var openGrimoire = function () {
      grimoire.classList.add("is-open");
      grimoire.setAttribute("aria-hidden", "false");
      setTimeout(function () {
        input.focus();
      }, 160);
    };

    var closeGrimoire = function () {
      grimoire.classList.remove("is-open");
      grimoire.setAttribute("aria-hidden", "true");
    };

    var go = function (href) {
      write("realm", "Opening " + href + " …");
      setTimeout(function () {
        window.location.href = href;
      }, 450);
    };

    var gameState = {
      activeQuest: 0,
      stage: 0
    };

    var spells = {
      help: function () {
        write("grimoire",
          "Incantations: <strong>play</strong> (launch Arcade Odyssey game), <strong>quest</strong>, <strong>cast dabiro</strong>, <strong>cast webadmin</strong>, <strong>matrix</strong>, <strong>map</strong>, <strong>stack</strong>, <strong>whoami</strong>, <strong>clear</strong>.");
      },
      play: function () {
        write("grimoire", "🚀 <em>Launching Arcade Odyssey Canvas Engine...</em> Use [← / →] or [A / D] to steer, [Space] to Warp Dash!");
        if (window.GrimoireArcade && window.GrimoireArcade.start) {
          window.GrimoireArcade.start();
        }
      },
      game: function () {
        spells.play();
      },
      quest: function () {
        gameState.activeQuest = 1;
        gameState.stage = 1;
        write("grimoire", "✦ <strong>TRIAL I: THE CORRUPTED BASTION</strong> ✦<br />A production database with 10M rows is running out of memory during a live backup. Memory ceiling is strictly 4MB. What incantation do you cast?<br />Option A: <code>phpmyadmin</code><br />Option B: <code>cast dabiro</code>");
      },
      "cast dabiro": function () {
        if (gameState.activeQuest === 1 && gameState.stage === 1) {
          gameState.stage = 2;
          write("grimoire", "⚡ <em>Streaming unbuffered PDO query stream... Capped at 2.8MB RAM!</em><br /><strong>Success!</strong> The database demon is banished.<br /><br />✦ <strong>TRIAL II: THE DAEMON SWARM</strong> ✦<br />Your VPS is burdened by 4,000 Perl scripts. To deploy a single static Go supervisor, type: <code>cast webadmin</code>");
        } else {
          write("grimoire", "⚡ You invoke Dabiro: Zero-dependency single-file database manager summoned. Memory flatlined at 2.8MB!");
        }
      },
      "cast webadmin": function () {
        if (gameState.activeQuest === 1 && gameState.stage === 2) {
          gameState.stage = 3;
          write("grimoire", "🛡️ <em>18MB static Go binary deployed. Automated Let's Encrypt SSL configured in 40ms!</em><br /><strong>Success!</strong><br /><br />✦ <strong>TRIAL III: THE CONSTELLATION WARP</strong> ✦<br />To warp the cosmic background field into high-speed quantum particles, type: <code>matrix</code>");
        } else {
          write("grimoire", "🛡️ Webadmin invoked: Nginx server blocks and Let's Encrypt certificates synchronized.");
        }
      },
      matrix: function () {
        var canvas = document.getElementById("particles");
        if (canvas) {
          canvas.style.filter = "hue-rotate(120deg) brightness(1.5)";
          setTimeout(function(){ canvas.style.filter = ""; }, 5000);
        }
        if (gameState.activeQuest === 1 && gameState.stage === 3) {
          gameState.activeQuest = 0;
          gameState.stage = 0;
          write("grimoire", "🔮 <strong>VICTORY ACHIEVED: GRAND ARCHITECT</strong> 🔮<br />You have restored equilibrium to the realm. You are ready to build production-grade web systems. Type <code>hire</code> or visit <code>/contact/</code> to summon Kenneth D'Silva!");
        } else {
          write("grimoire", "🌌 Cosmic particle matrix accelerated.");
        }
      },
      hire: function () { go("/contact/"); },
      map: function () {
        write("grimoire",
          "/services/ · /work/ · /about/ · /contact/ · /grimoire/ — or name a ward: commerce, engineering, security, seo, ai.");
      },
      wards: function () {
        write("grimoire", "Commerce · Engineering · Security · SEO · AI Lab · Archive.");
      },
      stack: function () {
        write("grimoire",
          "Magento 2, Shopify Plus, PHP/Laravel, Go, React, Next.js, PostgreSQL, MySQL, Technical SEO.");
      },
      whoami: function () {
        write("grimoire", "Kenneth D'Silva — MODRACX. Full-stack & ecommerce developer (7 years experience).");
      },
      commerce: function () { go("/services/#commerce"); },
      engineering: function () { go("/services/#engineering"); },
      security: function () { go("/services/#security"); },
      seo: function () { go("/services/#security"); },
      ai: function () { go("/work/"); },
      archive: function () { go("/about/"); },
      services: function () { go("/services/"); },
      work: function () { go("/work/"); },
      about: function () { go("/about/"); },
      contact: function () { go("/contact/"); },
      clear: function () {
        log.innerHTML = "";
      }
    };

    var cast = function (raw) {
      var word = raw.trim().toLowerCase();
      if (!word) return;
      write("you", word, true);
      if (spells[word]) spells[word]();
      else if (word.indexOf("dabiro") !== -1) spells["cast dabiro"]();
      else if (word.indexOf("webadmin") !== -1) spells["cast webadmin"]();
      else write("grimoire", "No such incantation. Try <strong>quest</strong> or <strong>help</strong>.");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      cast(input.value);
      input.value = "";
    });

    grimoire.addEventListener("click", function (e) {
      var key = e.target.closest("[data-spell]");
      if (key) {
        cast(key.dataset.spell);
        input.focus();
        return;
      }
      if (e.target.closest("[data-close-grimoire]")) closeGrimoire();
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-open-grimoire]")) openGrimoire();
    });

    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === "Escape" && grimoire.classList.contains("is-open")) {
        closeGrimoire();
        return;
      }
      if (typing) return;
      if (e.key === "?" || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        openGrimoire();
      }
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
