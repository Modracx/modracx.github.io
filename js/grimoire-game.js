/* ==========================================================================
   THE GRIMOIRE: ARCANE ODYSSEY ENGINE
   Multi-Mode Arcade & Odyssey Games with Theme Adaptability:
   - NIGHT THEME: "Cosmic Space Odyssey" (Pilot the Void Runner, dodge asteroids, collect star cores)
   - DAY THEME: "Alchemical Rune Catcher" (Solar sigil weaving & rune matching)
   ========================================================================== */

(function () {
  "use strict";

  var grimoire = document.getElementById("grimoire");
  if (!grimoire) return;

  var book = grimoire.querySelector(".grimoire-book");
  if (!book) return;

  // Check if game canvas already exists
  var gameContainer = document.getElementById("grimoire-game-container");
  if (!gameContainer) {
    gameContainer = document.createElement("div");
    gameContainer.id = "grimoire-game-container";
    gameContainer.style.cssText = "display:none; position:relative; width:100%; height:320px; background:#04040f; border-bottom:1px solid var(--glass-edge); overflow:hidden;";
    gameContainer.innerHTML = '<canvas id="grimoire-canvas" width="640" height="320" style="width:100%; height:100%; display:block;"></canvas>' +
      '<div id="game-ui-overlay" style="position:absolute; top:8px; left:12px; right:12px; display:flex; justify-content:space-between; font-family:var(--font-rune); font-size:0.78rem; color:#f0c060; pointer-events:none; z-index:2;">' +
      '<div>MODE: <span id="game-mode-name">SPACE ODYSSEY</span></div>' +
      '<div>SCORE: <span id="game-score">0</span> | BEST: <span id="game-high">0</span></div>' +
      '</div>' +
      '<div id="game-controls-hint" style="position:absolute; bottom:8px; left:0; width:100%; text-align:center; font-family:var(--font-rune); font-size:0.72rem; color:#a78bfa; pointer-events:none; z-index:2;">[← / →] or [A / D] to Navigate · [Space] / Click to Warp Dash</div>';
    
    var log = grimoire.querySelector(".grimoire-log");
    if (log) {
      book.insertBefore(gameContainer, log);
    }
  }

  var canvas = document.getElementById("grimoire-canvas");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var scoreEl = document.getElementById("game-score");
  var highEl = document.getElementById("game-high");
  var modeEl = document.getElementById("game-mode-name");

  var highScore = 0;
  try { highScore = parseInt(localStorage.getItem("grimoire_high_score") || "0", 10); } catch(e) {}
  if (highEl) highEl.textContent = highScore;

  var animId = null;
  var isPlaying = false;
  var score = 0;
  var speed = 3.5;
  var frameCount = 0;

  // Player ship / alchemist orb
  var player = {
    x: 320,
    y: 260,
    width: 24,
    height: 24,
    vx: 0,
    trail: []
  };

  var entities = [];
  var particles = [];
  var stars = [];

  // Generate background parallax stars
  for (var i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * 640,
      y: Math.random() * 320,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 1.5 + 0.5
    });
  }

  var keys = {};
  window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
    if (e.key === " " && isPlaying) {
      e.preventDefault();
      warpDash();
    }
  });
  window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
  });

  // Touch & Click Controls for Mobile
  if (canvas) {
    canvas.addEventListener("pointerdown", function(e) {
      var rect = canvas.getBoundingClientRect();
      var clickX = (e.clientX - rect.left) / rect.width * 640;
      if (clickX < player.x) player.vx = -6;
      else player.vx = 6;
      warpDash();
    });
  }

  function warpDash() {
    for (var i = 0; i < 15; i++) {
      particles.push({
        x: player.x,
        y: player.y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 20,
        color: isNightTheme() ? "#f0c060" : "#a78bfa"
      });
    }
  }

  function isNightTheme() {
    return document.documentElement.getAttribute("data-theme") !== "light";
  }

  function spawnEntity() {
    var isNight = isNightTheme();
    var isScoreItem = Math.random() < 0.35;
    entities.push({
      x: Math.random() * 580 + 30,
      y: -20,
      size: isScoreItem ? 12 : Math.random() * 16 + 14,
      isScoreItem: isScoreItem,
      type: isScoreItem ? (isNight ? "core" : "rune") : (isNight ? "debris" : "flux"),
      vy: Math.random() * 2 + speed
    });
  }

  function loop() {
    if (!isPlaying) return;
    frameCount++;
    ctx.clearRect(0, 0, 640, 320);

    var isNight = isNightTheme();
    if (modeEl) modeEl.textContent = isNight ? "COSMIC SPACE ODYSSEY" : "SOLAR RUNE ALCHEMY";

    // 1. Render Parallax Stars
    ctx.fillStyle = isNight ? "rgba(240, 244, 255, 0.6)" : "rgba(124, 92, 240, 0.4)";
    for (var s = 0; s < stars.length; s++) {
      var star = stars[s];
      star.y += star.speed * (speed / 3);
      if (star.y > 320) { star.y = 0; star.x = Math.random() * 640; }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Update Player Position
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) player.vx = -5.5;
    else if (keys["ArrowRight"] || keys["d"] || keys["D"]) player.vx = 5.5;
    else player.vx *= 0.84;

    player.x += player.vx;
    if (player.x < 20) player.x = 20;
    if (player.x > 620) player.x = 620;

    // Player Trail
    if (frameCount % 2 === 0) {
      player.trail.push({ x: player.x, y: player.y, alpha: 0.8 });
    }
    for (var t = player.trail.length - 1; t >= 0; t--) {
      var tr = player.trail[t];
      tr.alpha -= 0.08;
      if (tr.alpha <= 0) {
        player.trail.splice(t, 1);
        continue;
      }
      ctx.fillStyle = isNight ? "rgba(167, 139, 250, " + tr.alpha + ")" : "rgba(240, 192, 96, " + tr.alpha + ")";
      ctx.beginPath();
      ctx.arc(tr.x, tr.y + 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Player Vessel / Sigil
    ctx.save();
    ctx.translate(player.x, player.y);
    if (isNight) {
      // Spacecraft
      ctx.fillStyle = "#f0c060";
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(12, 12);
      ctx.lineTo(0, 6);
      ctx.lineTo(-12, 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Alchemist Sigil Orb
      ctx.strokeStyle = "#7c5cf0";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#f0c060";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Spawn Entities
    if (frameCount % Math.max(18, 50 - Math.floor(score / 40)) === 0) {
      spawnEntity();
    }

    // 4. Update & Render Entities
    for (var e = entities.length - 1; e >= 0; e--) {
      var ent = entities[e];
      ent.y += ent.vy;

      // Draw Entity
      if (ent.isScoreItem) {
        // Collectible Star Core / Rune
        ctx.fillStyle = isNight ? "#f0c060" : "#7c5cf0";
        ctx.shadowColor = ent.isScoreItem ? "#f0c060" : "#a78bfa";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Hazard (Asteroid / Void Flux)
        ctx.fillStyle = isNight ? "rgba(124, 92, 240, 0.8)" : "rgba(220, 80, 80, 0.85)";
        ctx.strokeStyle = isNight ? "#a78bfa" : "#ff8888";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Collision Detection
      var dx = ent.x - player.x;
      var dy = ent.y - player.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < ent.size + 12) {
        if (ent.isScoreItem) {
          // Collected
          score += 25;
          speed += 0.08;
          if (scoreEl) scoreEl.textContent = score;
          warpDash();
          entities.splice(e, 1);
        } else {
          // Game Over Collision
          gameOver();
          return;
        }
      } else if (ent.y > 340) {
        if (!ent.isScoreItem) score += 5;
        if (scoreEl) scoreEl.textContent = score;
        entities.splice(e, 1);
      }
    }

    // 5. Update Particles
    for (var p = particles.length - 1; p >= 0; p--) {
      var pt = particles[p];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life--;
      if (pt.life <= 0) {
        particles.splice(p, 1);
        continue;
      }
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(loop);
  }

  function gameOver() {
    isPlaying = false;
    cancelAnimationFrame(animId);
    if (score > highScore) {
      highScore = score;
      try { localStorage.setItem("grimoire_high_score", highScore.toString()); } catch(e) {}
      if (highEl) highEl.textContent = highScore;
    }

    ctx.fillStyle = "rgba(4, 4, 15, 0.82)";
    ctx.fillRect(0, 0, 640, 320);

    ctx.fillStyle = "#f0c060";
    ctx.font = "20px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("VESSEL DESTABILIZED", 320, 130);

    ctx.fillStyle = "#f0f4ff";
    ctx.font = "14px 'Space Grotesk', sans-serif";
    ctx.fillText("Final Odyssey Score: " + score + " points", 320, 165);

    ctx.fillStyle = "#a78bfa";
    ctx.font = "12px 'DM Mono', monospace";
    ctx.fillText("Type 'play' or click 'play game' to relaunch!", 320, 205);
  }

  function startGame() {
    if (gameContainer) gameContainer.style.display = "block";
    isPlaying = true;
    score = 0;
    speed = 3.5;
    entities = [];
    particles = [];
    player.x = 320;
    player.vx = 0;
    if (scoreEl) scoreEl.textContent = "0";
    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(loop);
  }

  function stopGame() {
    isPlaying = false;
    cancelAnimationFrame(animId);
    if (gameContainer) gameContainer.style.display = "none";
  }

  window.GrimoireArcade = {
    start: startGame,
    stop: stopGame
  };
})();
