(function () {
  const boot = document.getElementById("realm-boot");
  const bootButton = document.getElementById("realm-boot-enter");
  const terminal = document.getElementById("realm-terminal");
  const terminalToggle = document.getElementById("realm-terminal-toggle");
  const terminalClose = document.getElementById("realm-terminal-close");
  const terminalForm = document.getElementById("realm-terminal-form");
  const terminalInput = document.getElementById("realm-terminal-input");
  const terminalOutput = document.getElementById("realm-terminal-output");
  const level = document.getElementById("realm-level");
  const xpValue = document.getElementById("realm-xp-value");
  const xpBar = document.getElementById("realm-xp-bar");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!boot || !terminal || !terminalForm) return;

  const commands = {
    help: {
      response: "Available: map, commerce, engineering, security, seo, ai, toolbox, library, systems, thoughts, experiments, stack, whoami, contact, clear.",
    },
    map: { target: "realm-map", response: "Realm map loaded. Districts are available below." },
    commerce: { target: "district-console", district: "commerce", response: "Opening Commerce District: storefronts, checkout, inventory, and payments." },
    engineering: { target: "district-console", district: "engineering", response: "Opening Engineering District: frontend, APIs, databases, queues, and deployment." },
    security: { target: "district-console", district: "security", response: "Opening Security District: authentication, access control, hardening, and rate limits." },
    seo: { target: "district-console", district: "seo", response: "Opening SEO District: speed, structure, schema, internal linking, and indexing." },
    systems: { target: "system-archive", response: "Systems archive located: practical business software built around clear workflows." },
    thoughts: { target: "thoughts", response: "Philosophy chamber opened. Read the decisions behind the work." },
    experiments: { target: "experiments", response: "Experiment zone opened. The workshop is still learning." },
    ai: { target: "ai-laboratory", response: "AI Laboratory opened: applied experiments with explicit boundaries." },
    library: { target: "knowledge-library", response: "Knowledge Library opened: architecture notes, observations, and field snippets." },
    toolbox: { target: "toolbox", response: "Toolbox network loaded. Select a node to inspect why it belongs in the stack." },
    stack: { response: "Magento, Shopify, Laravel, React, Node, SQL, Redis, Docker, NGINX, AWS, and the tools around them." },
    whoami: { response: "Kenneth D'Silva // digital architect // commerce systems, engineering, SEO, security, automation." },
    contact: { url: "/contact.html#project-form", response: "Preparing a secure transmission to the communication hub..." },
    resume: { url: "/about.html", response: "Opening player profile and working principles..." },
    clear: { clear: true },
    sudo: { response: "Permission noted. The realm already trusts curious builders." },
    hack: { response: "Safe mode only. Explore the systems; do not break the people using them." },
    matrix: { response: "There is no spoon. There is, however, a well-structured database." },
    coffee: { response: "Status: coffee dependency accepted. Build pipeline continues." },
    "42": { response: "The answer is useful architecture and a clear next step." },
    root: { secret: true, response: "Root access granted. Maintenance layer unlocked." },
  };

  const labExperiments = {
    recommendations: {
      title: "Product recommendations",
      copy: "Explore ranking signals, product context, and user intent without turning the storefront into a guessing game.",
      flow: ["Intent", "Context", "Rank", "Review"],
      status: "HUMAN_REVIEW",
      stack: "Embeddings · Events · Rules",
    },
    agents: {
      title: "Workflow agents",
      copy: "Automate bounded operational steps while keeping approvals visible and recoverable.",
      flow: ["Trigger", "Plan", "Tool", "Approve"],
      status: "BOUNDED_ACTION",
      stack: "Tools · Queues · Audit log",
    },
    rag: {
      title: "RAG systems",
      copy: "Ground answers in the documents and business context that people can inspect and correct.",
      flow: ["Question", "Retrieve", "Ground", "Answer"],
      status: "SOURCE_AWARE",
      stack: "Chunks · Vectors · Citations",
    },
    vision: {
      title: "Vision models",
      copy: "Turn images and visual signals into structured input for workflows that still need human judgement.",
      flow: ["Image", "Detect", "Structure", "Review"],
      status: "HUMAN_REVIEW",
      stack: "Vision · JSON · Workflow",
    },
  };

  const toolboxNodes = {
    react: { title: "React", copy: "Interface composition for product surfaces that need clear states and useful feedback.", layer: "Frontend", why: "Composable UI" },
    next: { title: "Next.js", copy: "A route and rendering layer for fast, indexable experiences with clear server boundaries.", layer: "Framework", why: "Routes + rendering" },
    node: { title: "Node", copy: "A practical runtime for APIs, integrations, queues, and the operational glue around a product.", layer: "Backend", why: "Service layer" },
    redis: { title: "Redis", copy: "Fast ephemeral state for caching, queues, rate limits, and coordination where it earns its complexity.", layer: "Data", why: "Speed + state" },
    docker: { title: "Docker", copy: "Repeatable environments that reduce the distance between local work and deployment.", layer: "Infrastructure", why: "Reproducible builds" },
    aws: { title: "AWS", copy: "Cloud primitives selected around reliability, cost, observability, and the actual shape of the workload.", layer: "Cloud", why: "Production scale" },
  };

  let discovered = new Set();
  try {
    discovered = new Set(JSON.parse(sessionStorage.getItem("modracx-realm-discovered") || "[]"));
  } catch (error) {
    discovered = new Set();
  }

  function saveDiscovery() {
    try {
      sessionStorage.setItem("modracx-realm-discovered", JSON.stringify(Array.from(discovered)));
    } catch (error) {
      // Storage can be unavailable in privacy modes; discovery still works in memory.
    }
  }

  function updateProgress() {
    const total = 12;
    const progress = Math.min(100, Math.round((discovered.size / total) * 100));
    if (xpValue) xpValue.textContent = `${progress}%`;
    if (xpBar) xpBar.style.width = `${progress}%`;
    const currentLevel = Math.min(9, Math.max(1, Math.floor(progress / 20) + 1));
    if (level) level.textContent = String(currentLevel).padStart(2, "0");
    const profileLevel = document.getElementById("profile-level");
    if (profileLevel) profileLevel.textContent = String(currentLevel).padStart(2, "0");
    updateAchievements();
  }

  function updateAchievements() {
    const districts = ["commerce", "engineering", "security", "seo"].filter((name) => discovered.has(name));
    const unlocked = new Set();
    if (districts.length >= 3) unlocked.add("explorer");
    if (discovered.has("systems") || discovered.has("archive")) unlocked.add("analyst");
    if (discovered.has("commerce")) unlocked.add("commerce-master");
    if (discovered.has("security") && (discovered.has("hack") || discovered.has("sudo"))) unlocked.add("security-researcher");
    if (discovered.size >= 5) unlocked.add("terminal-hacker");
    if (discovered.size >= 8) unlocked.add("digital-architect");

    document.querySelectorAll("[data-achievement]").forEach((card) => {
      const active = unlocked.has(card.dataset.achievement);
      card.classList.toggle("is-unlocked", active);
      card.setAttribute("aria-label", `${card.querySelector("strong")?.textContent || "Achievement"}: ${active ? "unlocked" : "locked"}`);
    });
    const count = document.getElementById("achievement-count");
    if (count) count.textContent = `${unlocked.size} / 6 unlocked`;
  }

  function unlockSecretRoom() {
    const secret = document.getElementById("secret-room");
    if (!secret) return;
    secret.hidden = false;
    secret.classList.add("is-unlocked");
    window.setTimeout(() => secret.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }), reduceMotion ? 0 : 120);
  }

  function appendOutput(command, response) {
    if (!terminalOutput) return;
    const line = document.createElement("p");
    const prompt = document.createElement("span");
    const message = document.createElement("span");
    prompt.className = "terminal-prompt-mark";
    prompt.textContent = `> ${command}`;
    message.textContent = response;
    line.append(prompt, message);
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function openTerminal() {
    terminal.classList.add("is-open");
    terminalToggle.setAttribute("aria-expanded", "true");
    window.setTimeout(() => terminalInput && terminalInput.focus(), reduceMotion ? 0 : 180);
  }

  function activateDistrict(name, shouldScroll) {
    const tabs = document.querySelectorAll("[data-district-tab]");
    const panels = document.querySelectorAll("[data-district-panel]");
    if (!tabs.length || !panels.length) return;
    tabs.forEach((tab) => {
      const active = tab.dataset.districtTab === name;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.dataset.districtPanel === name;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (shouldScroll) {
      const consolePanel = document.getElementById("district-console");
      if (consolePanel) consolePanel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  function activateLab(name) {
    const experiment = labExperiments[name];
    if (!experiment) return;
    const title = document.getElementById("lab-readout-title");
    const copy = document.getElementById("lab-readout-copy");
    const flow = document.getElementById("lab-readout-flow");
    const status = document.getElementById("lab-readout-status");
    const stack = document.getElementById("lab-readout-stack");
    if (title) title.textContent = experiment.title;
    if (copy) copy.textContent = experiment.copy;
    if (flow) flow.innerHTML = experiment.flow.map((step) => `<span>${step}</span>`).join("<b>→</b>");
    if (status) status.textContent = experiment.status;
    if (stack) stack.textContent = experiment.stack;
    document.querySelectorAll("[data-lab-experiment]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.labExperiment === name);
    });
  }

  function activateTool(name) {
    const tool = toolboxNodes[name];
    if (!tool) return;
    const title = document.getElementById("tool-readout-title");
    const copy = document.getElementById("tool-readout-copy");
    const layer = document.getElementById("tool-readout-layer");
    const why = document.getElementById("tool-readout-why");
    if (title) title.textContent = tool.title;
    if (copy) copy.textContent = tool.copy;
    if (layer) layer.textContent = tool.layer;
    if (why) why.textContent = tool.why;
    document.querySelectorAll("[data-tool-node]").forEach((node) => {
      node.classList.toggle("is-active", node.dataset.toolNode === name);
    });
  }

  function closeTerminal() {
    terminal.classList.remove("is-open");
    terminalToggle.setAttribute("aria-expanded", "false");
  }

  function runCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;
    const action = commands[command];

    if (!action) {
      appendOutput(command, `Command not found. Try <button type="button" data-realm-command="help">help</button> for the available interface.`);
      return;
    }

    if (action.clear) {
      terminalOutput.innerHTML = "";
      return;
    }

    discovered.add(command);
    saveDiscovery();
    updateProgress();
    appendOutput(command, action.response);

    if (action.district) activateDistrict(action.district, false);
    if (action.secret) unlockSecretRoom();

    if (action.target) {
      const target = document.getElementById(action.target);
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        target.classList.add("realm-targeted");
        window.setTimeout(() => target.classList.remove("realm-targeted"), reduceMotion ? 600 : 1600);
      }
    }

    if (typeof action.card === "number") {
      const card = document.querySelectorAll("#districts .room-card")[action.card];
      if (card) card.classList.add("realm-targeted");
    }

    if (action.url) {
      window.setTimeout(() => { window.location.href = action.url; }, reduceMotion ? 0 : 450);
    }
  }

  function enterRealm() {
    document.body.classList.add("realm-entered");
    boot.setAttribute("aria-hidden", "true");
    try { sessionStorage.setItem("modracx-realm-booted", "true"); } catch (error) {}
    window.setTimeout(() => boot.remove(), reduceMotion ? 0 : 700);
  }

  function bindCommandButtons() {
    document.querySelectorAll("[data-realm-command]").forEach((button) => {
      button.addEventListener("click", () => {
        openTerminal();
        runCommand(button.dataset.realmCommand || "help");
      });
    });
  }

  document.querySelectorAll("[data-district-tab]").forEach((tab, index, tabs) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.districtTab || "commerce";
      activateDistrict(name, false);
      discovered.add(name);
      saveDiscovery();
      updateProgress();
    });
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next.focus();
      activateDistrict(next.dataset.districtTab || "commerce", false);
    });
  });

  document.querySelectorAll(".archive-entry").forEach((entry) => {
    entry.addEventListener("toggle", () => {
      if (!entry.open) return;
      discovered.add("archive");
      saveDiscovery();
      updateProgress();
    });
  });

  document.querySelectorAll("[data-lab-experiment]").forEach((button) => {
    button.addEventListener("click", () => {
      activateLab(button.dataset.labExperiment || "recommendations");
      discovered.add("ai");
      saveDiscovery();
      updateProgress();
    });
  });

  document.querySelectorAll("[data-tool-node]").forEach((node) => {
    node.addEventListener("click", () => {
      activateTool(node.dataset.toolNode || "react");
      discovered.add("toolbox");
      saveDiscovery();
      updateProgress();
    });
  });

  bootButton.addEventListener("click", enterRealm);
  boot.addEventListener("keydown", (event) => {
    if (event.key === "Tab") return;
    enterRealm();
  });

  terminalToggle.addEventListener("click", () => {
    if (terminal.classList.contains("is-open")) closeTerminal();
    else openTerminal();
  });
  terminalClose.addEventListener("click", closeTerminal);
  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runCommand(terminalInput.value);
    terminalInput.value = "";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== terminalInput) {
      event.preventDefault();
      openTerminal();
    }
    if (event.key === "Escape") closeTerminal();
  });

  let booted = false;
  try { booted = sessionStorage.getItem("modracx-realm-booted") === "true"; } catch (error) {}
  if (booted) enterRealm();
  bindCommandButtons();
  activateDistrict("commerce", false);
  activateLab("recommendations");
  activateTool("react");
  updateProgress();
})();
