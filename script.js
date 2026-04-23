const prefersReducedMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function on(target, eventName, handler, options) {
  if (!target || typeof target.addEventListener !== "function") return;
  target.addEventListener(eventName, handler, options);
}

function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    on(toggle, "click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach((link) => {
      on(link, "click", () => {
        nav.classList.remove("open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) link.classList.add("active");
  });

  const header = document.getElementById("site-header");
  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  on(window, "scroll", onScroll, { passive: true });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  items.forEach((item) => observer.observe(item));
}

function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".case-card");
  if (!buttons.length || !cards.length) return;
  buttons.forEach((button) => {
    on(button, "click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((btn) => btn.classList.toggle("active", btn === button));
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden-card", !show);
      });
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  on(form, "submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(
      `${data.get("projectType") || "Project Inquiry"} - ${data.get("company") || data.get("name") || "New inquiry"}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Company: ${data.get("company") || ""}`,
        `Project Type: ${data.get("projectType") || ""}`,
        "",
        "Project Brief:",
        `${data.get("brief") || ""}`,
      ].join("\n")
    );
    window.location.href = `mailto:kd.xtrm@gmail.com?subject=${subject}&body=${body}`;
  });
}

function initAscii() {
  const canvas = document.querySelector("[data-ascii-scene]");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const words = (document.body.dataset.keywords || "WEB,SEO,CODE")
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);

  const fontSize = window.innerWidth < 720 ? 12 : 14;
  const mouse = { x: -1000, y: -1000 };
  let width = 0;
  let height = 0;
  let columns = 0;
  let streams = [];

  const rebuild = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.max(10, Math.floor(width / 26));
    streams = Array.from({ length: columns }, (_, index) => ({
      x: index * 26,
      y: Math.random() * -height,
      speed: 0.8 + Math.random() * 1.8,
      text: words[Math.floor(Math.random() * words.length)],
      offset: Math.floor(Math.random() * 6),
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
    ctx.textBaseline = "top";

    streams.forEach((stream, index) => {
      stream.y += stream.speed;
      if (stream.y > height + 40) {
        stream.y = -60;
        stream.text = words[(index + Math.floor(Math.random() * words.length)) % words.length];
      }

      const dx = mouse.x - stream.x;
      const dy = mouse.y - stream.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repel = distance < 120 ? (120 - distance) * 0.04 : 0;
      const xShift = distance < 120 ? (-dx / Math.max(distance, 1)) * repel : 0;

      ctx.fillStyle = distance < 120 ? "rgba(255, 176, 74, 0.92)" : "rgba(141, 234, 255, 0.34)";
      ctx.fillText(stream.text, stream.x + xShift, stream.y);
    });

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  };

  rebuild();
  if (prefersReducedMotion) draw();
  else requestAnimationFrame(draw);

  on(window, "resize", rebuild);
  on(window, "mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
  on(window, "mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
}

async function initThreeScenes() {
  const sceneEls = document.querySelectorAll("[data-three-scene]");
  if (!sceneEls.length) return;

  const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js");
  const scenes = [];

  sceneEls.forEach((host) => {
    const rect = host.getBoundingClientRect();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(Math.max(rect.width, 10), Math.max(rect.height, 10));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const ambient = new THREE.AmbientLight(0xb9eeff, 0.9);
    scene.add(ambient);

    const pointA = new THREE.PointLight(0xffa94d, 1.2, 20);
    pointA.position.set(4, 3, 4);
    scene.add(pointA);

    const pointB = new THREE.PointLight(0x63e6be, 0.8, 20);
    pointB.position.set(-4, -2, 3);
    scene.add(pointB);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(host.dataset.threeScene === "hero" ? 1.08 : 0.78, 1),
      new THREE.MeshStandardMaterial({
        color: 0x8deaff,
        emissive: 0x0b3d49,
        metalness: 0.52,
        roughness: 0.22,
        wireframe: false,
      })
    );
    group.add(core);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffb04a,
      transparent: true,
      opacity: 0.85,
      wireframe: true,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.03, 8, 140), ringMaterial);
    ring1.rotation.x = 1.1;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.022, 8, 120), ringMaterial.clone());
    ring2.rotation.y = 0.8;
    ring2.rotation.x = 0.35;
    group.add(ring2);

    const starGeo = new THREE.BufferGeometry();
    const starCount = host.dataset.threeScene === "hero" ? 90 : 48;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 2.3 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x8deaff, size: host.dataset.threeScene === "hero" ? 0.05 : 0.04 })
    );
    group.add(stars);

    const mouse = { x: 0, y: 0 };
    on(host, "mousemove", (event) => {
      const bounds = host.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.4;
      mouse.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 1.4;
    });
    on(host, "mouseleave", () => {
      mouse.x = 0;
      mouse.y = 0;
    });

    scenes.push({ host, renderer, scene, camera, group, core, ring1, ring2, mouse });
  });

  const resize = () => {
    scenes.forEach((entry) => {
      const rect = entry.host.getBoundingClientRect();
      entry.camera.aspect = rect.width / rect.height;
      entry.camera.updateProjectionMatrix();
      entry.renderer.setSize(Math.max(rect.width, 10), Math.max(rect.height, 10));
    });
  };

  on(window, "resize", resize);
  resize();

  const animate = (time) => {
    scenes.forEach((entry, index) => {
      const t = time * 0.001;
      entry.group.rotation.y += (entry.mouse.x * 0.2 - entry.group.rotation.y) * 0.02;
      entry.group.rotation.x += (-entry.mouse.y * 0.18 - entry.group.rotation.x) * 0.02;
      entry.core.rotation.x = t * 0.35 + index * 0.14;
      entry.core.rotation.y = t * 0.45;
      entry.ring1.rotation.z = t * 0.25;
      entry.ring2.rotation.x = 0.35 + t * 0.18;
      entry.renderer.render(entry.scene, entry.camera);
    });
    if (!prefersReducedMotion) requestAnimationFrame(animate);
  };

  if (prefersReducedMotion) animate(0);
  else requestAnimationFrame(animate);
}

function boot() {
  initNav();
  initReveal();
  initFilters();
  initContactForm();
  initAscii();
  initThreeScenes();
}

if (document.readyState === "loading") {
  on(document, "DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
