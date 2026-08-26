/* ==========================================================================
   THE GRIMOIRE: SPACE FANTASY GALAXY STAR MAP & SECTOR QUEST ENGINE
   (Completely decoupled from the arcade shooter — focused on lore, 
    interactive star map, character dialogues, quests, and architectural lore)
   ========================================================================== */

(function () {
  "use strict";

  var grimoire = document.getElementById("grimoire");
  if (!grimoire) return;

  var book = grimoire.querySelector(".grimoire-book");
  if (!book) return;

  book.style.width = "min(96vw, 56rem)";
  book.style.maxHeight = "92vh";

  var rpgRoot = document.getElementById("grimoire-rpg-root");
  if (!rpgRoot) {
    rpgRoot = document.createElement("div");
    rpgRoot.id = "grimoire-rpg-root";
    rpgRoot.style.cssText = "display:flex; flex-direction:column; width:100%; height:450px; background:#040410; position:relative; overflow:hidden; border-bottom:1px solid var(--glass-edge-lit);";
    
    rpgRoot.innerHTML = 
      '<!-- Top HUD Bar -->' +
      '<div id="rpg-hud" style="display:flex; justify-content:space-between; align-items:center; padding:8px 16px; background:rgba(10,12,35,0.95); border-bottom:1px solid rgba(240,192,96,0.25); font-family:var(--font-rune); font-size:0.75rem; color:#f0c060; z-index:10;">' +
      '  <div>✦ SECTOR MAP: <strong id="rpg-ship-name" style="color:#a78bfa;">GALAXY ATLAS</strong></div>' +
      '  <div id="rpg-location-badge">SELECT A CELESTIAL BODY</div>' +
      '  <div style="display:flex; gap:12px; align-items:center;">' +
      '    <span>EXPLORATION XP: <strong id="rpg-xp" style="color:#22c55e;">0</strong></span>' +
      '    <button type="button" id="btn-reset-grimoire-progress" style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#fca5a5; padding:2px 8px; font-family:var(--font-rune); font-size:0.68rem; border-radius:4px; cursor:pointer;">RESET SAVE</button>' +
      '  </div>' +
      '</div>' +

      '<!-- Starmap Canvas Viewport -->' +
      '<div id="rpg-viewport" style="flex:1; position:relative; overflow:hidden;">' +
      '  <canvas id="rpg-canvas" width="800" height="380" style="width:100%; height:100%; display:block; cursor:pointer;"></canvas>' +

      '  <!-- Character Dialogue Box -->' +
      '  <div id="rpg-dialogue-box" style="display:none; position:absolute; bottom:12px; left:14px; right:14px; background:rgba(7,7,26,0.96); border:1px solid var(--glass-edge-lit); border-radius:8px; padding:14px 18px; backdrop-filter:blur(12px); box-shadow:0 12px 30px rgba(0,0,0,0.85); z-index:20;">' +
      '    <div style="display:flex; gap:14px; align-items:flex-start;">' +
      '      <div id="rpg-avatar" style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, #f0c060, #7c5cf0); display:grid; place-items:center; font-size:1.5rem; flex-shrink:0; box-shadow:0 0 16px rgba(240,192,96,0.4);">🧙‍♂️</div>' +
      '      <div style="flex:1;">' +
      '        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">' +
      '          <strong id="rpg-speaker" style="font-family:var(--font-rune); font-size:0.88rem; color:#f0c060;">Grand Architect Kenneth</strong>' +
      '          <span id="rpg-speaker-role" style="font-size:0.7rem; color:#a78bfa; font-family:var(--font-rune);">[COMMANDER]</span>' +
      '        </div>' +
      '        <p id="rpg-speech" style="margin:0 0 12px; font-size:0.88rem; line-height:1.5; color:#f0f4ff;"></p>' +
      '        <div id="rpg-choices" style="display:flex; flex-wrap:wrap; gap:8px;"></div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      '  <!-- Navigation Action Links Overlay -->' +
      '  <div id="rpg-nav-overlay" style="position:absolute; top:12px; left:14px; display:flex; gap:8px; z-index:10;">' +
      '    <a href="/game/" style="background:linear-gradient(135deg, #f0c060, #eab308); color:#07071a; font-weight:bold; padding:5px 12px; font-family:var(--font-rune); font-size:0.75rem; border-radius:4px; text-decoration:none; display:flex; align-items:center; gap:4px; box-shadow:0 2px 8px rgba(240,192,96,0.3);">🚀 PLAY SPACE ODYSSEY SHOOTER ↗</a>' +
      '  </div>' +
      '</div>';

    var log = grimoire.querySelector(".grimoire-log");
    var form = grimoire.querySelector(".grimoire-form");
    var keys = grimoire.querySelector(".grimoire-keys");
    if (log) log.style.display = "none";
    if (form) form.style.display = "none";
    if (keys) keys.style.display = "none";

    book.appendChild(rpgRoot);
  }

  var canvas = document.getElementById("rpg-canvas");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var dialogueBox = document.getElementById("rpg-dialogue-box");
  var speakerEl = document.getElementById("rpg-speaker");
  var roleEl = document.getElementById("rpg-speaker-role");
  var speechEl = document.getElementById("rpg-speech");
  var choicesEl = document.getElementById("rpg-choices");
  var avatarEl = document.getElementById("rpg-avatar");
  var locBadge = document.getElementById("rpg-location-badge");
  var xpEl = document.getElementById("rpg-xp");
  var btnReset = document.getElementById("btn-reset-grimoire-progress");

  var xp = 0;
  try { xp = parseInt(localStorage.getItem("grimoire_xp") || "0", 10); } catch(e) {}
  if (xpEl) xpEl.textContent = xp;

  if (btnReset) {
    btnReset.addEventListener("click", function() {
      xp = 0;
      try {
        localStorage.removeItem("grimoire_xp");
        localStorage.removeItem("grimoire_visited_sectors");
      } catch(e) {}
      if (xpEl) xpEl.textContent = "0";
      showDialogue(
        "Atlas Navigation Terminal",
        "[PROGRESS RESET]",
        "Exploration history cleared. All planetary archives are ready for re-discovery.",
        "🔄",
        [{ text: "✦ Return to Map", action: hideDialogue }]
      );
    });
  }

  // Starmap Sectors
  var sectors = [
    { id: "magentis", name: "Planet Magentis", x: 160, y: 160, radius: 28, color: "#d97706", nightColor: "#f0c060", desc: "Monolith citadel burdened with memory spikes.", icon: "🪐" },
    { id: "shopifica", name: "Nebula Shopifica", x: 380, y: 110, radius: 24, color: "#15803d", nightColor: "#86efac", desc: "Liquid commerce clouds forging fast storefronts.", icon: "🌌" },
    { id: "dabiro", name: "Dabiro Comet", x: 630, y: 160, radius: 20, color: "#2563eb", nightColor: "#60a5fa", desc: "Single-file streaming comet consuming <3MB RAM.", icon: "☄️" },
    { id: "orqa", name: "Starbase Orqa", x: 490, y: 270, radius: 22, color: "#7c3aed", nightColor: "#c084fc", desc: "Vault of immutable double-entry financial ledgers.", icon: "🛰️" },
    { id: "webadmin", name: "Webadmin Sentinel", x: 260, y: 280, radius: 21, color: "#0284c7", nightColor: "#38bdf8", desc: "Go-powered static bastion supervising Nginx & SSL.", icon: "🛡️" }
  ];

  var stars = [];
  for (var s = 0; s < 65; s++) {
    stars.push({
      x: Math.random() * 800,
      y: Math.random() * 380,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.2
    });
  }

  function isNightTheme() {
    return document.documentElement.getAttribute("data-theme") !== "light";
  }

  function renderStarmap() {
    if (!ctx) return;
    ctx.clearRect(0, 0, 800, 380);

    var isNight = isNightTheme();

    // Background Gradient
    var grad = ctx.createRadialGradient(400, 190, 20, 400, 190, 420);
    if (isNight) {
      grad.addColorStop(0, "rgba(31, 35, 88, 0.45)");
      grad.addColorStop(1, "rgba(4, 4, 16, 0.98)");
    } else {
      grad.addColorStop(0, "rgba(224, 231, 255, 0.85)");
      grad.addColorStop(1, "rgba(241, 245, 249, 0.98)");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 380);

    // Constellation Vector Lines
    ctx.strokeStyle = isNight ? "rgba(167, 139, 250, 0.18)" : "rgba(79, 70, 229, 0.25)";
    ctx.lineWidth = 1.2;
    for (var i = 0; i < sectors.length; i++) {
      for (var j = i + 1; j < sectors.length; j++) {
        ctx.beginPath();
        ctx.moveTo(sectors[i].x, sectors[i].y);
        ctx.lineTo(sectors[j].x, sectors[j].y);
        ctx.stroke();
      }
    }

    // Parallax Star Dust
    ctx.fillStyle = isNight ? "rgba(240, 244, 255, 0.7)" : "rgba(99, 102, 241, 0.6)";
    for (var k = 0; k < stars.length; k++) {
      var star = stars[k];
      star.y += star.speed;
      if (star.y > 380) { star.y = 0; star.x = Math.random() * 800; }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Planets
    for (var p = 0; p < sectors.length; p++) {
      var sec = sectors[p];
      var color = isNight ? sec.nightColor : sec.color;

      ctx.shadowColor = color;
      ctx.shadowBlur = isNight ? 14 : 6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sec.x, sec.y, sec.radius + 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sec.x, sec.y, sec.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font = "bold 13px 'Space Grotesk', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = isNight ? "#ffffff" : "#0f172a";
      ctx.fillText(sec.name, sec.x, sec.y + sec.radius + 20);
    }
  }

  function addXp(amount) {
    xp += amount;
    try { localStorage.setItem("grimoire_xp", xp.toString()); } catch(e) {}
    if (xpEl) xpEl.textContent = xp;
  }

  function hideDialogue() {
    if (dialogueBox) dialogueBox.style.display = "none";
    if (locBadge) locBadge.textContent = "SELECT A CELESTIAL BODY";
  }

  function showDialogue(speaker, role, text, avatar, choices) {
    if (!dialogueBox) return;
    speakerEl.textContent = speaker;
    roleEl.textContent = role;
    speechEl.innerHTML = text;
    avatarEl.textContent = avatar || "✦";

    choicesEl.innerHTML = "";
    (choices || []).forEach(function(c) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = c.text;
      btn.style.cssText = "background:#f0c060; color:#07071a; font-family:var(--font-rune); font-size:0.75rem; font-weight:600; padding:7px 14px; border:none; border-radius:4px; cursor:pointer;";
      btn.addEventListener("click", function() {
        if (c.action) c.action();
      });
      choicesEl.appendChild(btn);
    });

    dialogueBox.style.display = "block";
  }

  if (canvas) {
    canvas.addEventListener("click", function(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = (e.clientX - rect.left) / rect.width * 800;
      var cy = (e.clientY - rect.top) / rect.height * 380;

      for (var i = 0; i < sectors.length; i++) {
        var sec = sectors[i];
        if (Math.hypot(sec.x - cx, sec.y - cy) < sec.radius + 12) {
          triggerSectorStory(sec);
          return;
        }
      }
    });
  }

  function triggerSectorStory(sec) {
    if (locBadge) locBadge.textContent = "ORBITING: " + sec.name.toUpperCase();

    if (sec.id === "magentis") {
      showDialogue(
        "Arch-Magus Varok",
        "[CITADEL HIGH INQUISITOR]",
        "Greetings, voyager. A 10-million row index has overwhelmed our MySQL monolith during this peak traffic window! We are leaking server memory.",
        "🪐",
        [
          { 
            text: "✦ Cast Dabiro Streaming Solution (+50 XP)", 
            action: function() {
              addXp(50);
              showDialogue(
                "Arch-Magus Varok",
                "[CITADEL SAVED]",
                "Brilliant! The memory ceiling remained strictly under 2.8MB! The citadel is stabilized and orders are processing smoothly.",
                "✨",
                [
                  { text: "✦ Read Magento AWS Cloud Guide", action: function() { window.location.href = "/blog/magento-2-aws-architecture/"; } },
                  { text: "✦ Return to Map", action: hideDialogue }
                ]
              );
            }
          },
          { 
            text: "✦ Inspect Dev Tools Manual", 
            action: function() {
              window.location.href = "/docs/admin-dev-tools/";
            }
          },
          { text: "✦ Return to Map", action: hideDialogue }
        ]
      );
    } else if (sec.id === "shopifica") {
      showDialogue(
        "Navigator Lyra",
        "[LIQUID FORGE OPERATOR]",
        "Welcome to Nebula Shopifica. We are forging high-conversion headless Shopify Plus architectures with sub-second TTFB and zero render blocking.",
        "🌌",
        [
          { 
            text: "✦ View Shopify Case Studies (+30 XP)", 
            action: function() {
              addXp(30);
              window.location.href = "/work/";
            }
          },
          { text: "✦ Return to Map", action: hideDialogue }
        ]
      );
    } else if (sec.id === "dabiro") {
      showDialogue(
        "Comet Pilot KD",
        "[DABIRO SPEED MASTER]",
        "You have intercepted the Dabiro Comet! A zero-dependency single-file multi-database manager for PHP & Node.js.",
        "☄️",
        [
          { text: "✦ Read Dabiro Documentation", action: function() { window.location.href = "/docs/dabiro/"; } },
          { text: "✦ View Dabiro vs phpMyAdmin Benchmarks", action: function() { window.location.href = "/blog/dabiro-vs-phpmyadmin-adminer-alternative/"; } },
          { text: "✦ Return to Map", action: hideDialogue }
        ]
      );
    } else if (sec.id === "webadmin") {
      showDialogue(
        "Commander Kenneth",
        "[SYSTEMS ARCHITECT]",
        "Sentinel Station Webadmin active. Single static 18MB Go binary managing Nginx, Apache2, and automated Let's Encrypt SSL.",
        "🛡️",
        [
          { text: "✦ Read Webadmin Manual", action: function() { window.location.href = "/docs/webadmin/"; } },
          { text: "✦ Compare Webadmin vs cPanel", action: function() { window.location.href = "/blog/webadmin-vs-cpanel-webmin-server-control-panels/"; } },
          { text: "✦ Return to Map", action: hideDialogue }
        ]
      );
    } else {
      showDialogue(
        "Ledger Guardian",
        "[ORQA VAULT KEEPER]",
        "Starbase Orqa stores immutable double-entry ledgers with zero-based envelope budgeting in Next.js & Postgres.",
        "🛰️",
        [
          { text: "✦ Inspect Orqa Platform", action: function() { window.location.href = "/docs/orqa/"; } },
          { text: "✦ Return to Map", action: hideDialogue }
        ]
      );
    }
  }

  function mainLoop() {
    if (grimoire.classList.contains("is-open")) {
      renderStarmap();
    }
    requestAnimationFrame(mainLoop);
  }
  mainLoop();

})();
