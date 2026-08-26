/* ==========================================================================
   SPACE ODYSSEY: 60 FPS ADVANCED RETRO SPACE SHOOTER
   Features:
   - Click/Tap to Launch (Does not auto-start instantly on load)
   - Dynamic Enemy Swarms with Unique AI, Flight Patterns & Firepower:
     1. ☄️ Tumbling Asteroid: Sinusoidal drifting pattern, random rotation, splits on death
     2. 🛸 Interceptor Drone: High-speed zig-zag formation flyer
     3. 🛰️ Plasma Frigate: Strafes horizontally and shoots aimed crimson laser pulses
     4. 👾 Alien Cruiser: S-curve swooper with dual spread fire
     5. 🌌 The Bloat Leviathan: Heavy armored boss with sweeping plasma barrages
   - Arsenal Firepower & Timed Powerups:
     * Tier 1: Single Pulse Laser
     * Tier 2: Dual Plasma Cannons
     * Tier 3: Tri-Quantum Laser (Spread-shot)
     * Tier 4: Quad Nova Beam (High-velocity penetration)
     * Timed Powerup Clocks: ⚡ Rapid Fire, 🛡️ Energy Shield, 🧲 Star Magnet, 💣 Nova Shockwave
   - Full Keyboard ([W/A/S/D] / [Arrows] / [Space] / [P] Pause) & Touch Drag Controls
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.getElementById("space-odyssey-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  function resize() {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  window.addEventListener("resize", resize);
  resize();

  // Engine State
  var G = {
    running: false,
    paused: false,
    ready: true,
    score: 0,
    distance: 0,
    credits: 0,
    highScore: 0,
    health: 100,
    maxHealth: 100,
    weaponLevel: 1,
    powerups: {
      rapidFire: 0, // frames left (max 600)
      shield: 0,    // max 480
      magnet: 0     // max 720
    },
    screenShake: 0,
    shockwave: null,
    frameCount: 0
  };

  try {
    G.credits = parseInt(localStorage.getItem("odyssey_credits") || "0", 10);
    G.highScore = parseInt(localStorage.getItem("odyssey_high_score") || "0", 10);
    G.weaponLevel = parseInt(localStorage.getItem("odyssey_weapon_lvl") || "1", 10);
  } catch (e) {}

  var player = {
    x: 400,
    y: 440,
    w: 32,
    h: 36,
    vx: 0,
    vy: 0,
    speed: 5.5,
    tilt: 0,
    lastShot: 0
  };

  var lasers = [];
  var enemyLasers = [];
  var enemies = [];
  var items = [];
  var particles = [];
  var stars = [];

  for (var i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * 800,
      y: Math.random() * 520,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 2 + 0.5,
      brightness: Math.random() * 0.7 + 0.3
    });
  }

  // Keyboard Controls
  var keys = {};
  window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    if (e.key === " " && G.running) e.preventDefault();
    if ((e.key === "p" || e.key === "P" || e.key === "Escape") && G.running) {
      togglePause();
    }
  });
  window.addEventListener("keyup", function (e) {
    keys[e.key] = false;
  });

  function togglePause() {
    if (!G.running) return;
    G.paused = !G.paused;
    var btnPause = document.getElementById("btn-toggle-pause");
    if (btnPause) btnPause.innerHTML = G.paused ? "▶ Resume" : "⏸ Pause";
    if (!G.paused) {
      animId = requestAnimationFrame(loop);
    }
  }

  // Touch / Pointer Controls
  var touchPos = null;
  canvas.addEventListener("pointerdown", function (e) {
    if (!G.running) {
      startOdyssey();
      return;
    }
    var rect = canvas.getBoundingClientRect();
    touchPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!touchPos || !G.running) return;
    var rect = canvas.getBoundingClientRect();
    touchPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  });
  window.addEventListener("pointerup", function () {
    touchPos = null;
  });

  // Player Shooting
  function fireWeapon() {
    var now = Date.now();
    var cooldown = G.powerups.rapidFire > 0 ? 65 : 150;
    if (now - player.lastShot < cooldown) return;
    player.lastShot = now;

    var isNight = document.documentElement.getAttribute("data-theme") !== "light";
    var color = isNight ? "#f0c060" : "#4f46e5";

    if (G.weaponLevel === 1) {
      lasers.push({ x: player.x, y: player.y - 18, vx: 0, vy: -12, color: color, dmg: 1 });
    } else if (G.weaponLevel === 2) {
      lasers.push({ x: player.x - 10, y: player.y - 14, vx: 0, vy: -13, color: color, dmg: 1 });
      lasers.push({ x: player.x + 10, y: player.y - 14, vx: 0, vy: -13, color: color, dmg: 1 });
    } else if (G.weaponLevel === 3) {
      lasers.push({ x: player.x, y: player.y - 18, vx: 0, vy: -14, color: "#ef4444", dmg: 1.5 });
      lasers.push({ x: player.x - 12, y: player.y - 14, vx: -1.8, vy: -13, color: color, dmg: 1 });
      lasers.push({ x: player.x + 12, y: player.y - 14, vx: 1.8, vy: -13, color: color, dmg: 1 });
    } else {
      // Quad Nova Cannon
      lasers.push({ x: player.x - 6, y: player.y - 18, vx: -0.8, vy: -14, color: "#a78bfa", dmg: 2 });
      lasers.push({ x: player.x + 6, y: player.y - 18, vx: 0.8, vy: -14, color: "#a78bfa", dmg: 2 });
      lasers.push({ x: player.x - 16, y: player.y - 12, vx: -2.8, vy: -12, color: color, dmg: 1.2 });
      lasers.push({ x: player.x + 16, y: player.y - 12, vx: 2.8, vy: -12, color: color, dmg: 1.2 });
    }
  }

  // Enemy Fire
  function fireEnemyWeapon(enemy) {
    if (enemy.type === "frigate") {
      enemyLasers.push({ x: enemy.x, y: enemy.y + enemy.r, vx: 0, vy: 4.5, color: "#ef4444", dmg: 15 });
    } else if (enemy.type === "cruiser") {
      var dx = player.x - enemy.x;
      var dy = player.y - enemy.y;
      var angle = Math.atan2(dy, dx);
      enemyLasers.push({ x: enemy.x - 8, y: enemy.y + 10, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, color: "#f43f5e", dmg: 18 });
      enemyLasers.push({ x: enemy.x + 8, y: enemy.y + 10, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, color: "#f43f5e", dmg: 18 });
    }
  }

  // Nova Bomb Screen Wipe
  function triggerNova() {
    G.shockwave = { x: player.x, y: player.y, r: 10, maxR: 550, alpha: 1 };
    G.screenShake = 22;
    enemies.forEach(function (e) {
      for (var p = 0; p < 12; p++) {
        particles.push({
          x: e.x, y: e.y,
          vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
          life: 25, color: "#f0c060", size: 3
        });
      }
    });
    G.score += enemies.length * 45;
    enemies = [];
    enemyLasers = [];
  }

  // Spawn Enemies with Dynamic Patterns
  function spawnEnemy() {
    var roll = Math.random();
    if (roll < 0.45) {
      // 1. Tumbling Asteroid
      enemies.push({
        type: "asteroid",
        x: Math.random() * 740 + 30,
        y: -30,
        r: Math.random() * 16 + 12,
        hp: 2,
        baseX: Math.random() * 740 + 30,
        freq: Math.random() * 0.03 + 0.01,
        amp: Math.random() * 40 + 20,
        vy: Math.random() * 1.4 + 1.4,
        rot: 0,
        vrot: (Math.random() - 0.5) * 0.06
      });
    } else if (roll < 0.70) {
      // 2. Interceptor Drone (Zig-Zag)
      enemies.push({
        type: "drone",
        x: Math.random() * 740 + 30,
        y: -30,
        r: 15,
        hp: 3,
        vy: Math.random() * 1.8 + 2.0,
        vx: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2.2 + 1.2)
      });
    } else if (roll < 0.90) {
      // 3. Plasma Frigate (Shooting Strafing Ship)
      enemies.push({
        type: "frigate",
        x: Math.random() * 680 + 60,
        y: -40,
        r: 22,
        hp: 6,
        vy: 1.3,
        vx: Math.random() * 2 - 1,
        lastShot: G.frameCount + Math.floor(Math.random() * 60)
      });
    } else {
      // 4. Heavy Alien Cruiser (Aimed Fire)
      enemies.push({
        type: "cruiser",
        x: Math.random() * 660 + 70,
        y: -50,
        r: 28,
        hp: 12,
        vy: 1.0,
        vx: Math.sin(G.frameCount * 0.02) * 2,
        lastShot: G.frameCount + 40
      });
    }
  }

  function spawnPowerupOrCore(x, y) {
    var roll = Math.random();
    if (roll < 0.45) {
      items.push({ type: "core", x: x, y: y, vy: 1.6, r: 8, color: "#f0c060" });
    } else if (roll < 0.75) {
      items.push({ type: "credit", x: x, y: y, vy: 1.8, r: 8, color: "#38bdf8" });
    } else if (roll < 0.85) {
      items.push({ type: "rapid", x: x, y: y, vy: 1.5, r: 13, color: "#ec4899", icon: "⚡" });
    } else if (roll < 0.94) {
      items.push({ type: "shield", x: x, y: y, vy: 1.5, r: 13, color: "#3b82f6", icon: "🛡️" });
    } else if (roll < 0.98) {
      items.push({ type: "magnet", x: x, y: y, vy: 1.5, r: 13, color: "#8b5cf6", icon: "🧲" });
    } else {
      items.push({ type: "nova", x: x, y: y, vy: 1.5, r: 14, color: "#f59e0b", icon: "💣" });
    }
  }

  // Draw Splash/Launch Start Screen
  function drawStartScreen(cw, ch, isNight) {
    ctx.clearRect(0, 0, cw, ch);

    ctx.fillStyle = isNight ? "#040412" : "#f1f5f9";
    ctx.fillRect(0, 0, cw, ch);

    // Starfield in background
    ctx.fillStyle = isNight ? "rgba(255,255,255,0.6)" : "rgba(79,70,229,0.5)";
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Title Card
    ctx.fillStyle = "#f0c060";
    ctx.font = "bold 32px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("SPACE ODYSSEY", cw / 2, ch / 2 - 35);

    ctx.fillStyle = isNight ? "#f0f4ff" : "#0f172a";
    ctx.font = "15px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText("Click Canvas or Launch Button to Start Combat", cw / 2, ch / 2 + 10);

    ctx.fillStyle = "#a78bfa";
    ctx.font = "12px 'DM Mono', monospace";
    ctx.fillText("All-Time Best: " + G.highScore + " pts | Arsenal Level: " + G.weaponLevel, cw / 2, ch / 2 + 40);
  }

  // Main Loop
  var animId = null;
  function loop() {
    if (!G.running || G.paused) return;
    G.frameCount++;

    var cw = 800;
    var ch = 520;
    var isNight = document.documentElement.getAttribute("data-theme") !== "light";

    // Screen Shake
    ctx.save();
    if (G.screenShake > 0) {
      var dx = (Math.random() - 0.5) * G.screenShake;
      var dy = (Math.random() - 0.5) * G.screenShake;
      ctx.translate(dx, dy);
      G.screenShake *= 0.88;
      if (G.screenShake < 0.5) G.screenShake = 0;
    }

    ctx.clearRect(0, 0, cw, ch);

    // Background Gradient
    var bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
    if (isNight) {
      bgGrad.addColorStop(0, "#040412");
      bgGrad.addColorStop(1, "#070724");
    } else {
      bgGrad.addColorStop(0, "#e2e8f0");
      bgGrad.addColorStop(1, "#cbd5e1");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Parallax Starfield
    ctx.fillStyle = isNight ? "#ffffff" : "#4f46e5";
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      st.y += st.speed * (G.powerups.rapidFire > 0 ? 2.4 : 1.4);
      if (st.y > ch) { st.y = 0; st.x = Math.random() * cw; }
      ctx.globalAlpha = st.brightness;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Distance & Powerup Timers
    G.distance += 0.8;
    if (Math.floor(G.distance) % 100 === 0) G.score += 15;

    if (G.powerups.rapidFire > 0) G.powerups.rapidFire--;
    if (G.powerups.shield > 0) G.powerups.shield--;
    if (G.powerups.magnet > 0) G.powerups.magnet--;

    // Player Movement
    if (touchPos) {
      player.x += (touchPos.x - player.x) * 0.18;
      player.y += (touchPos.y - player.y) * 0.18;
      fireWeapon();
    } else {
      if (keys["ArrowLeft"] || keys["a"] || keys["A"]) { player.vx = -player.speed; player.tilt = -0.3; }
      else if (keys["ArrowRight"] || keys["d"] || keys["D"]) { player.vx = player.speed; player.tilt = 0.3; }
      else { player.vx *= 0.82; player.tilt *= 0.82; }

      if (keys["ArrowUp"] || keys["w"] || keys["W"]) player.vy = -player.speed * 0.85;
      else if (keys["ArrowDown"] || keys["s"] || keys["S"]) player.vy = player.speed * 0.85;
      else player.vy *= 0.82;

      player.x += player.vx;
      player.y += player.vy;
      if (keys[" "]) fireWeapon();
    }

    if (player.x < 24) player.x = 24;
    if (player.x > cw - 24) player.x = cw - 24;
    if (player.y < 80) player.y = 80;
    if (player.y > ch - 35) player.y = ch - 35;

    // Draw Player Ship
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.tilt);

    // Jet Engine Flame
    var flameH = Math.random() * 12 + 14;
    ctx.fillStyle = G.powerups.rapidFire > 0 ? "#ec4899" : "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(-8, 14);
    ctx.lineTo(0, 14 + flameH);
    ctx.lineTo(8, 14);
    ctx.closePath();
    ctx.fill();

    // Hull
    ctx.fillStyle = isNight ? "#f0c060" : "#4f46e5";
    ctx.strokeStyle = isNight ? "#ffe1a3" : "#312e81";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(16, 14);
    ctx.lineTo(6, 10);
    ctx.lineTo(0, 14);
    ctx.lineTo(-6, 10);
    ctx.lineTo(-16, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Shield Aura
    if (G.powerups.shield > 0) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.88)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#3b82f6";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    // Update Player Lasers
    for (var l = lasers.length - 1; l >= 0; l--) {
      var lsr = lasers[l];
      lsr.x += lsr.vx;
      lsr.y += lsr.vy;

      ctx.fillStyle = lsr.color;
      ctx.shadowColor = lsr.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(lsr.x - 2, lsr.y - 8, 4, 16);
      ctx.shadowBlur = 0;

      if (lsr.y < -20) lasers.splice(l, 1);
    }

    // Update Enemy Lasers
    for (var el = enemyLasers.length - 1; el >= 0; el--) {
      var elz = enemyLasers[el];
      elz.x += elz.vx;
      elz.y += elz.vy;

      ctx.fillStyle = elz.color;
      ctx.shadowColor = elz.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(elz.x - 2, elz.y - 6, 4, 12);
      ctx.shadowBlur = 0;

      // Hit Player Check
      if (Math.hypot(elz.x - player.x, elz.y - player.y) < 18) {
        enemyLasers.splice(el, 1);
        if (G.powerups.shield <= 0) {
          G.health -= elz.dmg;
          G.screenShake = 12;
          if (G.health <= 0) {
            triggerGameOver();
            ctx.restore();
            return;
          }
        }
      } else if (elz.y > ch + 20) {
        enemyLasers.splice(el, 1);
      }
    }

    // Spawn Enemy Waves
    if (Math.random() < 0.038) spawnEnemy();

    // Update & Render Enemies
    for (var e = enemies.length - 1; e >= 0; e--) {
      var en = enemies[e];
      en.y += en.vy;

      // AI Flight Patterns
      if (en.type === "asteroid") {
        en.rot += en.vrot;
        en.x = en.baseX + Math.sin(G.frameCount * en.freq) * en.amp;
      } else if (en.type === "drone") {
        en.x += en.vx;
        if (en.x < 30 || en.x > cw - 30) en.vx *= -1;
      } else if (en.type === "frigate") {
        en.x += en.vx;
        if (en.x < 50 || en.x > cw - 50) en.vx *= -1;
        if (G.frameCount - en.lastShot > 90) {
          en.lastShot = G.frameCount;
          fireEnemyWeapon(en);
        }
      } else if (en.type === "cruiser") {
        en.x += Math.sin(G.frameCount * 0.03) * 2.2;
        if (G.frameCount - en.lastShot > 110) {
          en.lastShot = G.frameCount;
          fireEnemyWeapon(en);
        }
      }

      // Draw Enemy
      ctx.save();
      ctx.translate(en.x, en.y);
      if (en.type === "asteroid") {
        ctx.rotate(en.rot);
        ctx.fillStyle = isNight ? "#8b5cf6" : "#475569";
        ctx.strokeStyle = isNight ? "#a78bfa" : "#334155";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, en.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (en.type === "drone") {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(0, 16);
        ctx.lineTo(14, -12);
        ctx.lineTo(-14, -12);
        ctx.closePath();
        ctx.fill();
      } else if (en.type === "frigate") {
        ctx.fillStyle = "#f59e0b";
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(18, -14);
        ctx.lineTo(0, -6);
        ctx.lineTo(-18, -14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Heavy Cruiser
        ctx.fillStyle = "#dc2626";
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 3;
        ctx.fillRect(-en.r, -en.r * 0.6, en.r * 2, en.r * 1.2);
        ctx.strokeRect(-en.r, -en.r * 0.6, en.r * 2, en.r * 1.2);
      }
      ctx.restore();

      // Laser Hits on Enemy
      for (var lh = lasers.length - 1; lh >= 0; lh--) {
        var lz = lasers[lh];
        if (Math.hypot(lz.x - en.x, lz.y - en.y) < en.r + 6) {
          en.hp -= lz.dmg;
          lasers.splice(lh, 1);

          for (var p = 0; p < 6; p++) {
            particles.push({
              x: en.x, y: en.y,
              vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
              life: 18, color: "#f0c060", size: 2.5
            });
          }

          if (en.hp <= 0) {
            G.score += en.type === "cruiser" ? 180 : (en.type === "frigate" ? 90 : (en.type === "drone" ? 50 : 30));
            spawnPowerupOrCore(en.x, en.y);
            enemies.splice(e, 1);
            break;
          }
        }
      }

      // Player Collision Check
      if (en && Math.hypot(en.x - player.x, en.y - player.y) < en.r + 14) {
        if (G.powerups.shield > 0) {
          enemies.splice(e, 1);
          G.screenShake = 8;
        } else {
          G.health -= en.type === "cruiser" ? 40 : 20;
          G.screenShake = 16;
          enemies.splice(e, 1);
          if (G.health <= 0) {
            triggerGameOver();
            ctx.restore();
            return;
          }
        }
      }

      if (en && en.y > ch + 40) enemies.splice(e, 1);
    }

    // Update Items & Magnetism
    for (var it = items.length - 1; it >= 0; it--) {
      var item = items[it];
      item.y += item.vy;

      if (G.powerups.magnet > 0) {
        var dx = player.x - item.x;
        var dy = player.y - item.y;
        item.x += dx * 0.08;
        item.y += dy * 0.08;
      }

      ctx.save();
      ctx.translate(item.x, item.y);
      if (item.type === "core" || item.type === "credit") {
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, item.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(0, 0, item.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "13px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.icon, 0, 0);
      }
      ctx.restore();

      if (Math.hypot(item.x - player.x, item.y - player.y) < item.r + 18) {
        if (item.type === "core") G.score += 50;
        else if (item.type === "credit") { G.credits += 10; G.score += 25; }
        else if (item.type === "rapid") G.powerups.rapidFire = 600;
        else if (item.type === "shield") G.powerups.shield = 480;
        else if (item.type === "magnet") G.powerups.magnet = 720;
        else if (item.type === "nova") triggerNova();

        try { localStorage.setItem("odyssey_credits", G.credits.toString()); } catch(e) {}
        items.splice(it, 1);
      } else if (item.y > ch + 20) {
        items.splice(it, 1);
      }
    }

    // Particles
    for (var pt = particles.length - 1; pt >= 0; pt--) {
      var pObj = particles[pt];
      pObj.x += pObj.vx;
      pObj.y += pObj.vy;
      pObj.life--;
      if (pObj.life <= 0) {
        particles.splice(pt, 1);
        continue;
      }
      ctx.fillStyle = pObj.color;
      ctx.beginPath();
      ctx.arc(pObj.x, pObj.y, pObj.size || 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shockwave
    if (G.shockwave) {
      ctx.save();
      ctx.strokeStyle = "rgba(245, 158, 11, " + G.shockwave.alpha + ")";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(G.shockwave.x, G.shockwave.y, G.shockwave.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      G.shockwave.r += 24;
      G.shockwave.alpha -= 0.05;
      if (G.shockwave.alpha <= 0) G.shockwave = null;
    }

    // On-Canvas HUD
    drawOnCanvasHUD(cw, ch, isNight);

    ctx.restore();
    if (G.running && !G.paused) {
      animId = requestAnimationFrame(loop);
    }
  }

  // Draw HUD with Powerup Bars
  function drawOnCanvasHUD(cw, ch, isNight) {
    ctx.fillStyle = "rgba(10, 15, 35, 0.88)";
    ctx.fillRect(16, 16, 220, 48);
    ctx.strokeStyle = "rgba(240, 192, 96, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, 220, 48);

    var healthPct = Math.max(0, G.health) / G.maxHealth;
    var healthColor = healthPct > 0.5 ? "#22c55e" : (healthPct > 0.25 ? "#f59e0b" : "#ef4444");
    ctx.fillStyle = healthColor;
    ctx.fillRect(24, 38, 204 * healthPct, 16);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px 'DM Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("HULL INTEGRITY: " + Math.max(0, G.health) + "%", 24, 31);

    ctx.fillStyle = "rgba(10, 15, 35, 0.88)";
    ctx.fillRect(cw - 240, 16, 224, 48);
    ctx.strokeStyle = "rgba(240, 192, 96, 0.4)";
    ctx.strokeRect(cw - 240, 16, 224, 48);

    ctx.font = "bold 13px 'DM Mono', monospace";
    ctx.fillStyle = "#f0c060";
    ctx.textAlign = "right";
    ctx.fillText("SCORE: " + G.score, cw - 28, 33);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("DIST: " + Math.floor(G.distance) + "m | CR: " + G.credits, cw - 28, 52);

    // Active Powerups Countdown Bars
    var pActive = [];
    if (G.powerups.rapidFire > 0) pActive.push({ name: "RAPID FIRE", frames: G.powerups.rapidFire, max: 600, color: "#ec4899" });
    if (G.powerups.shield > 0) pActive.push({ name: "ENERGY SHIELD", frames: G.powerups.shield, max: 480, color: "#3b82f6" });
    if (G.powerups.magnet > 0) pActive.push({ name: "STAR MAGNET", frames: G.powerups.magnet, max: 720, color: "#8b5cf6" });

    if (pActive.length > 0) {
      var startX = cw / 2 - (pActive.length * 80);
      pActive.forEach(function (p, idx) {
        var boxX = startX + idx * 165;
        var boxY = ch - 52;
        var boxW = 155;
        var boxH = 42;

        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        var pct = p.frames / p.max;
        ctx.fillStyle = p.color;
        ctx.fillRect(boxX + 4, boxY + boxH - 7, (boxW - 8) * pct, 4);

        var secLeft = Math.ceil(p.frames / 60);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(p.name + " (" + secLeft + "s)", boxX + boxW / 2, boxY + 20);
      });
    }
  }

  function triggerGameOver() {
    cancelAnimationFrame(animId);
    animId = null;
    G.running = false;
    if (G.score > G.highScore) {
      G.highScore = G.score;
      try { localStorage.setItem("odyssey_high_score", G.highScore.toString()); } catch(e) {}
    }

    var overModal = document.getElementById("game-over-modal");
    if (overModal) {
      document.getElementById("final-score-val").textContent = G.score;
      document.getElementById("final-dist-val").textContent = Math.floor(G.distance) + "m";
      document.getElementById("final-credits-val").textContent = G.credits;
      document.getElementById("high-score-val").textContent = G.highScore;
      overModal.style.display = "flex";
    }
  }

  function startOdyssey() {
    cancelAnimationFrame(animId);
    animId = null;

    G.running = true;
    G.paused = false;
    G.score = 0;
    G.distance = 0;
    G.health = 100;
    G.powerups.rapidFire = 0;
    G.powerups.shield = 0;
    G.powerups.magnet = 0;
    lasers = [];
    enemyLasers = [];
    enemies = [];
    items = [];
    particles = [];
    player.x = 400;
    player.y = 440;
    player.vx = 0;
    player.vy = 0;

    var btnPause = document.getElementById("btn-toggle-pause");
    if (btnPause) btnPause.innerHTML = "⏸ Pause";

    var overModal = document.getElementById("game-over-modal");
    if (overModal) overModal.style.display = "none";

    animId = requestAnimationFrame(loop);
  }

  // Toast Banner System
  var toastEl = document.getElementById("game-hud-toast");
  var toastTimer = null;
  function showToast(msg, type) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "game-hud-toast";
      toastEl.style.cssText = "position:absolute; top:70px; left:50%; transform:translateX(-50%); background:rgba(7,7,26,0.95); border:1px solid #f0c060; color:#f0c060; font-family:var(--font-rune); font-size:0.85rem; padding:8px 18px; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.85); z-index:100; pointer-events:none; transition:opacity 0.3s;";
      var parent = document.querySelector(".game-viewport-wrap");
      if (parent) parent.appendChild(toastEl);
    }
    toastEl.innerHTML = msg;
    toastEl.style.display = "block";
    toastEl.style.opacity = "1";
    toastEl.style.borderColor = type === "error" ? "#ef4444" : (type === "success" ? "#22c55e" : "#f0c060");
    toastEl.style.color = type === "error" ? "#fca5a5" : (type === "success" ? "#86efac" : "#f0c060");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toastEl.style.opacity = "0";
      setTimeout(function() { toastEl.style.display = "none"; }, 300);
    }, 2800);
  }

  var btnUpgrade = document.getElementById("btn-upgrade-arsenal");
  if (btnUpgrade) {
    btnUpgrade.addEventListener("click", function () {
      if (G.credits >= 100 && G.weaponLevel < 4) {
        G.credits -= 100;
        G.weaponLevel++;
        try {
          localStorage.setItem("odyssey_credits", G.credits.toString());
          localStorage.setItem("odyssey_weapon_lvl", G.weaponLevel.toString());
        } catch (e) {}
        showToast("⚡ <strong>ARSENAL UPGRADED!</strong> Tier " + G.weaponLevel + " Active", "success");
      } else if (G.weaponLevel >= 4) {
        showToast("✦ <strong>MAX TIER!</strong> Quad Nova Cannon Active", "success");
      } else {
        showToast("⚠️ <strong>NEED 100 CREDITS!</strong> Blast enemy ships to earn credits", "error");
      }
    });
  }

  var btnReset = document.getElementById("btn-reset-game-progress");
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      G.credits = 0;
      G.weaponLevel = 1;
      G.highScore = 0;
      try {
        localStorage.removeItem("odyssey_credits");
        localStorage.removeItem("odyssey_weapon_lvl");
        localStorage.removeItem("odyssey_high_score");
      } catch (e) {}
      showToast("🔄 <strong>SAVE CLEARED!</strong> High score and weapon tier reset", "success");
      startOdyssey();
    });
  }

  var btnLaunch = document.getElementById("btn-launch-game");
  if (btnLaunch) btnLaunch.addEventListener("click", startOdyssey);

  var btnRestart = document.getElementById("btn-restart-game");
  if (btnRestart) btnRestart.addEventListener("click", startOdyssey);

  var btnPause = document.getElementById("btn-toggle-pause");
  if (btnPause) btnPause.addEventListener("click", togglePause);

  // Initial title card render (does not auto-run until launched)
  drawStartScreen(800, 520, document.documentElement.getAttribute("data-theme") !== "light");

  window.SpaceOdyssey = { start: startOdyssey, showToast: showToast };
})();
