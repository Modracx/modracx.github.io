(function () {
  const root = document.body;
  if (!root || root.dataset.page !== "realm-world") return;

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const map = document.getElementById("realm-map");
  const viewport = document.getElementById("realm-viewport");
  const intro = document.getElementById("realm-intro");
  const panel = document.getElementById("realm-panel");
  const terminal = document.getElementById("world-terminal");
  const history = document.getElementById("terminal-history");
  const input = document.getElementById("terminal-input");
  const toast = document.getElementById("toast-message");
  const progressBar = document.getElementById("world-progress-bar");
  const progressLabel = document.getElementById("world-progress-label");
  const levelLabel = document.getElementById("world-level");
  const zoomLabel = document.getElementById("zoom-readout");

  const districts = {
    profile: {
      index: "CORE 00",
      kicker: "The Architect",
      title: "The mind behind the map",
      lead: "I build digital businesses: ecommerce systems, secure architectures, search-aware interfaces, and the machinery that helps a business move.",
      flow: ["Observe", "Model", "Build", "Refine"],
      focus: "Systems thinking, business outcomes, and readable decisions.",
      stack: "Commerce · Engineering · SEO · Security",
      link: "/about.html",
    },
    commerce: {
      index: "DISTRICT 01",
      kicker: "Commerce District",
      title: "The Market",
      lead: "Storefronts, checkout paths, inventory logic, and the systems behind a useful buying experience.",
      flow: ["Catalog", "Cart", "Checkout", "Payment", "Fulfillment"],
      focus: "Conversion, product architecture, payments, inventory, and performance.",
      stack: "Magento · Shopify · APIs · SQL",
      link: "/services.html#ecommerce",
    },
    engineering: {
      index: "DISTRICT 02",
      kicker: "Engineering District",
      title: "The Forge",
      lead: "A place to inspect how frontend, APIs, data, queues, deployment, and observability connect.",
      flow: ["Frontend", "API", "Database", "Queue", "Deploy"],
      focus: "Boundaries, reliability, maintainability, and the cost of future change.",
      stack: "React · Node · Laravel · Docker",
      link: "/services.html#systems",
    },
    security: {
      index: "DISTRICT 03",
      kicker: "Security District",
      title: "The Bastion",
      lead: "Safer systems begin before the final checklist: identity, access, validation, limits, and visibility.",
      flow: ["Identity", "Access", "Validate", "Limit", "Monitor"],
      focus: "Authentication, authorization, OWASP awareness, secure deployment, and rate limits.",
      stack: "Sessions · JWT · Headers · Audits",
      link: "/services.html#seo-security",
    },
    seo: {
      index: "DISTRICT 04",
      kicker: "SEO District",
      title: "The Oracle",
      lead: "Search visibility becomes less mysterious when speed, structure, rendering, and indexing are designed together.",
      flow: ["Speed", "Structure", "Schema", "Links", "Indexing"],
      focus: "Core Web Vitals, technical audits, schema, crawlability, and internal linking.",
      stack: "HTML · Schema · Analytics · Audits",
      link: "/services.html#seo-security",
    },
    ai: {
      index: "DISTRICT 05",
      kicker: "AI Laboratory",
      title: "The Aether",
      lead: "Applied experiments with recommendation systems, agents, retrieval, vision, and clear human boundaries.",
      flow: ["Question", "Context", "Generate", "Review"],
      focus: "Useful automation, inspectable context, evaluation loops, and human approval.",
      stack: "Agents · RAG · Events · Workflows",
      link: "#ai-laboratory",
    },
    library: {
      index: "DISTRICT 06",
      kicker: "Knowledge Library",
      title: "The Archive",
      lead: "Architecture notes, security observations, commerce decisions, SEO research, and field snippets.",
      flow: ["Notice", "Question", "Record", "Share"],
      focus: "The ideas behind the implementation and the lessons worth carrying forward.",
      stack: "Notes · Tutorials · Research · CLI",
      link: "#knowledge-library",
    },
  };

  const commands = {
    help: "Available: map, profile, commerce, engineering, security, seo, ai, library, stack, whoami, contact, clear.",
    map: "Map centered. Choose a district or drag the world to travel.",
    profile: "Architect profile loaded. The core is the starting point, not the finish line.",
    commerce: "Opening The Market: catalog, checkout, payment, and fulfillment.",
    engineering: "Opening The Forge: frontend, APIs, data, queues, and deployment.",
    security: "Opening The Bastion: identity, access, validation, limits, and monitoring.",
    seo: "Opening The Oracle: speed, structure, schema, links, and indexing.",
    ai: "Opening The Aether: applied AI experiments with human review.",
    library: "Opening The Archive: architecture notes and field research.",
    stack: "React, Next.js, Node, Laravel, Magento, Shopify, SQL, Redis, Docker, NGINX, AWS.",
    whoami: "Kenneth D'Silva // Digital Architect // commerce systems, engineering, SEO, security, automation.",
    sudo: "Root access is unnecessary. The useful paths are already visible.",
    contact: "Opening a secure transmission channel...",
  };

  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragStart = null;
  let toastTimer;
  let discovered = new Set();
  try {
    discovered = new Set(JSON.parse(sessionStorage.getItem("modracx-realm-world") || "[]"));
  } catch (error) {
    discovered = new Set();
  }

  function saveProgress() {
    try { sessionStorage.setItem("modracx-realm-world", JSON.stringify(Array.from(discovered))); } catch (error) {}
  }

  function updateProgress() {
    const progress = Math.min(100, Math.round((discovered.size / 7) * 100));
    const level = Math.min(9, Math.max(1, Math.floor(progress / 20) + 1));
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressLabel) progressLabel.textContent = `${progress}%`;
    if (levelLabel) levelLabel.textContent = String(level).padStart(2, "0");
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function updateMapTransform() {
    if (!map) return;
    map.style.transform = `translate(calc(-50% + ${panX}px), calc(-43% + ${panY}px)) scale(${zoom})`;
    if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function setZoom(nextZoom) {
    zoom = Math.min(1.32, Math.max(0.72, nextZoom));
    updateMapTransform();
  }

  function resetMap() {
    zoom = 1;
    panX = 0;
    panY = 0;
    updateMapTransform();
  }

  function openPanel(name) {
    const data = districts[name];
    if (!data || !panel) return;
    document.getElementById("panel-index").textContent = data.index;
    document.getElementById("panel-kicker").textContent = data.kicker;
    document.getElementById("panel-title").textContent = data.title;
    document.getElementById("panel-lead").textContent = data.lead;
    document.getElementById("panel-focus").textContent = data.focus;
    document.getElementById("panel-stack").textContent = data.stack;
    document.getElementById("panel-link").href = data.link;
    const flow = document.getElementById("panel-flow");
    flow.replaceChildren();
    data.flow.forEach((step, index) => {
      const item = document.createElement("span");
      item.textContent = step;
      flow.appendChild(item);
      if (index < data.flow.length - 1) {
        const arrow = document.createElement("b");
        arrow.textContent = "→";
        flow.appendChild(arrow);
      }
    });
    document.querySelectorAll("[data-realm-node]").forEach((node) => node.classList.toggle("is-active", node.dataset.realmNode === name));
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    discovered.add(name);
    saveProgress();
    updateProgress();
    showToast(`${data.kicker} signal acquired`);
    window.setTimeout(() => panel.querySelector("[data-close-panel]")?.focus(), reducedMotion ? 0 : 250);
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.querySelectorAll("[data-realm-node]").forEach((node) => node.classList.remove("is-active"));
  }

  function openTerminal() {
    if (!terminal) return;
    terminal.classList.add("is-open");
    terminal.setAttribute("aria-hidden", "false");
    window.setTimeout(() => input?.focus(), reducedMotion ? 0 : 220);
  }

  function closeTerminal() {
    if (!terminal) return;
    terminal.classList.remove("is-open");
    terminal.setAttribute("aria-hidden", "true");
  }

  function writeHistory(command, response) {
    if (!history) return;
    const line = document.createElement("p");
    const prompt = document.createElement("b");
    const message = document.createElement("span");
    prompt.textContent = `> ${command}`;
    message.textContent = response;
    line.append(prompt, message);
    history.appendChild(line);
    history.scrollTop = history.scrollHeight;
  }

  function runCommand(raw) {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      history.replaceChildren();
      return;
    }
    if (command === "map") {
      resetMap();
      writeHistory(command, commands.map);
      discovered.add("map");
      saveProgress();
      updateProgress();
      return;
    }
    if (command === "contact") {
      writeHistory(command, commands.contact);
      window.setTimeout(() => { window.location.href = "/contact.html#project-form"; }, reducedMotion ? 0 : 500);
      return;
    }
    if (districts[command]) {
      writeHistory(command, commands[command] || `Opening ${command}.`);
      closeTerminal();
      openPanel(command);
      return;
    }
    writeHistory(command, commands[command] || "Unknown command. Type help to inspect the command deck.");
    discovered.add(command);
    saveProgress();
    updateProgress();
  }

  function enterWorld() {
    root.classList.add("world-entered");
    intro?.classList.add("is-dismissed");
    discovered.add("entry");
    saveProgress();
    updateProgress();
    showToast("Realm entered · choose a pathway");
  }

  function tickClock() {
    const clock = document.getElementById("world-clock");
    if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour12: false });
  }

  function initStarfield() {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let stars = [];
    let width = 0;
    let height = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: Math.min(220, Math.floor((width * height) / 8500)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.2,
        alpha: Math.random() * 0.75 + 0.15,
        speed: Math.random() * 0.13 + 0.02,
        hue: Math.random() > 0.82 ? "gold" : "cyan",
      }));
    };
    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        const shimmer = reducedMotion ? 1 : 0.75 + Math.sin(time * 0.001 * star.speed * 20 + star.x) * 0.25;
        context.globalAlpha = star.alpha * shimmer;
        context.fillStyle = star.hue === "gold" ? "#ffd17d" : "#b9f8ff";
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
        if (!reducedMotion) {
          star.y += star.speed;
          if (star.y > height + 4) star.y = -4;
        }
      });
      context.globalAlpha = 1;
      if (!reducedMotion) window.requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.requestAnimationFrame(draw);
  }

  document.querySelectorAll("[data-realm-node]").forEach((node) => {
    node.addEventListener("click", () => openPanel(node.dataset.realmNode));
  });
  document.querySelectorAll("[data-open-terminal]").forEach((button) => button.addEventListener("click", openTerminal));
  document.querySelectorAll("[data-close-panel]").forEach((button) => button.addEventListener("click", closePanel));
  document.querySelectorAll("[data-close-terminal]").forEach((button) => button.addEventListener("click", closeTerminal));
  document.querySelectorAll("[data-command]").forEach((button) => button.addEventListener("click", () => runCommand(button.dataset.command || "help")));
  document.getElementById("enter-world")?.addEventListener("click", enterWorld);
  document.getElementById("zoom-in")?.addEventListener("click", () => setZoom(zoom + 0.1));
  document.getElementById("zoom-out")?.addEventListener("click", () => setZoom(zoom - 0.1));
  document.getElementById("map-reset")?.addEventListener("click", resetMap);
  document.getElementById("terminal-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(input.value);
    input.value = "";
  });

  viewport?.addEventListener("wheel", (event) => {
    event.preventDefault();
    setZoom(zoom + (event.deltaY > 0 ? -0.04 : 0.04));
  }, { passive: false });
  viewport?.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    dragStart = { x: event.clientX - panX, y: event.clientY - panY };
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  });
  viewport?.addEventListener("pointermove", (event) => {
    if (!dragStart) return;
    panX = event.clientX - dragStart.x;
    panY = event.clientY - dragStart.y;
    updateMapTransform();
  });
  viewport?.addEventListener("pointerup", () => {
    dragStart = null;
    viewport.classList.remove("is-dragging");
  });

  document.addEventListener("keydown", (event) => {
    if ((event.key === " " || event.key === "Enter") && !root.classList.contains("world-entered") && document.activeElement === document.body) {
      event.preventDefault();
      enterWorld();
    }
    if (event.key === "?") openTerminal();
    if (event.key === "Escape") {
      closePanel();
      closeTerminal();
    }
  });

  initStarfield();
  tickClock();
  window.setInterval(tickClock, 1000);
  updateMapTransform();
  updateProgress();
})();
