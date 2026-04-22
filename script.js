/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const TECH = [
  { name: 'Magento', type: 'Platform', fallback: 'MG', color: 'EE672F' },
  { name: 'Shopify', type: 'Platform', icon: 'shopify', color: '7AB55C' },
  { name: 'Luma', type: 'Theme Stack', fallback: 'LU' },
  { name: 'Hyva', type: 'Theme Stack', fallback: 'HY' },
  { name: 'Breeze', type: 'Theme Stack', fallback: 'BR' },
  { name: 'Liquid', type: 'Templating', icon: 'shopify', color: '7AB55C' },
  { name: 'HTML5', type: 'Frontend', icon: 'html5', color: 'E34F26' },
  { name: 'CSS', type: 'Frontend', icon: 'css', color: '1572B6' },
  { name: 'LESS', type: 'Styling', icon: 'less', color: '1D365D' },
  { name: 'SCSS', type: 'Styling', icon: 'sass', color: 'CC6699' },
  { name: 'JavaScript', type: 'Frontend', icon: 'javascript', color: 'F7DF1E' },
  { name: 'TypeScript', type: 'Frontend', icon: 'typescript', color: '3178C6' },
  { name: 'PHP', type: 'Backend', icon: 'php', color: '777BB4' },
  { name: 'Lumen', type: 'Framework', icon: 'laravel', color: 'FF2D20' },
  { name: 'Vue.js', type: 'Framework', icon: 'vuedotjs', color: '4FC08D' },
  { name: 'Next.js', type: 'Framework', icon: 'nextdotjs', color: '111111' },
  { name: 'Fabric.js', type: 'Library', fallback: 'FJ' },
  { name: 'MySQL', type: 'Database', icon: 'mysql', color: '4479A1' },
  { name: 'AWS', type: 'Infrastructure', fallback: 'AWS', color: 'FF9900' },
  { name: 'DigitalOcean', type: 'Infrastructure', icon: 'digitalocean', color: '0080FF' },
  { name: 'Apache', type: 'Server', icon: 'apache', color: 'D22128' },
  { name: 'Nginx', type: 'Server', icon: 'nginx', color: '009639' },
  { name: 'Google Search Console', type: 'SEO', icon: 'googlesearchconsole', color: '458CF5' },
  { name: 'Google Analytics', type: 'SEO', icon: 'googleanalytics', color: 'E37400' },
  { name: 'Communication', type: 'Delivery', fallback: 'CO' },
  { name: 'Writing', type: 'Delivery', fallback: 'WR' },
  { name: 'Documentation', type: 'Delivery', icon: 'googledocs', color: '4285F4' },
];
const MQ_ITEMS = ['SEO', 'Cyber Security', 'Magento', 'Shopify', 'Luma', 'Hyva', 'Breeze', 'Liquid', 'HTML5', 'CSS', 'LESS', 'SCSS', 'JavaScript', 'TypeScript', 'PHP', 'Lumen', 'Vue.js', 'Next.js', 'Fabric.js', 'MySQL', 'AWS', 'DigitalOcean', 'Apache', 'Nginx', 'Search Console', 'Analytics', 'Communication', 'Writing'];
const PROJECTS = [
  {
    name: 'Spruha Healthcare',
    category: 'Healthcare Commerce',
    description: 'Custom commerce platform for selling and renting medical equipment, with rental logic, availability calendars, and payment gateway integration built around real operational constraints.',
    meta: 'Commerce and rental workflow',
    topics: ['rental logic', 'payments', 'availability'],
    href: null
  },
  {
    name: 'ADEI',
    category: 'Machine Learning',
    description: 'Emotion-detection application that reads facial expressions or text input and responds with suggestions based on the detected mood, combining interface work with ML experimentation.',
    meta: 'ML and assistive UX',
    topics: ['emotion detection', 'text input', 'recommendations'],
    href: null
  },
  {
    name: 'CBL / CVL',
    category: 'Real-Time Web App',
    description: 'Sports score applications with live updates and real-time data fetching for continuously changing match states.',
    meta: 'Live score platform',
    topics: ['real-time', 'sports data', 'auto updates'],
    href: null
  },
  {
    name: 'Diak Torad',
    category: 'ERP System',
    description: 'Custom ERP system for academic result management, student performance tracking, reporting, and role-based access across admins, teachers, and students.',
    meta: 'Education operations platform',
    topics: ['role access', 'reports', 'academic data'],
    href: null
  },
  {
    name: 'MbFinance',
    category: 'Lead Generation Site',
    description: 'Responsive financial services site built to present offerings clearly, capture leads, and support lightweight content management without overcomplicating the stack.',
    meta: 'Brand and acquisition site',
    topics: ['responsive', 'forms', 'cms'],
    href: null
  },
  {
    name: 'Commerce Delivery',
    category: 'Magento / Shopify Systems',
    description: 'Ongoing delivery across custom extensions, storefront themes, shipping and payment integrations, SEO improvements, security hardening, patching, and cloud-hosted store operations.',
    meta: 'Core commercial work',
    topics: ['seo', 'security', 'extensions'],
    href: 'https://www.linkedin.com/in/kenneth-dsilva-kd/'
  },
  {
    name: 'Fabric Frame Demo',
    category: 'Interface Experiment',
    description: 'Interactive Fabric.js demo for placing and adjusting imagery inside SVG frames, showing a more playful but technically precise side of frontend work.',
    meta: 'GitHub experiment',
    topics: ['fabric.js', 'svg', 'interaction'],
    href: 'https://github.com/Modracx/fabric-frame-demo'
  },
  {
    name: 'Text Curve Object',
    category: 'Interface Experiment',
    description: 'Custom Fabric.js text object that renders single-line text along a circular arc, built as a reusable extension rather than a one-off prototype.',
    meta: 'GitHub experiment',
    topics: ['fabric.js', 'text', 'custom object'],
    href: 'https://github.com/Modracx/fabricjs-textcurve-object'
  }
];
const PINNED_REPOS = [
  {
    name: 'Dabiro',
    category: 'Pinned Repository',
    description: 'Compact PHP-based database management interface designed for quick access, low friction, and a cleaner developer workflow.',
    meta: 'Pinned on GitHub • PHP',
    topics: ['php', 'database', 'tooling'],
    href: 'https://github.com/Modracx/Dabiro'
  },
  {
    name: 'Invyte',
    category: 'Pinned Repository',
    description: 'Open-source inventory management system for Magento stores, built with a lightweight Lumen backend and a reactive Vue.js frontend.',
    meta: 'Pinned on GitHub • Vue',
    topics: ['magento', 'lumen', 'vue'],
    href: 'https://github.com/Modracx/Invyte'
  },
  {
    name: 'ruler-js',
    category: 'Pinned Repository',
    description: 'Lightweight ruler overlay for web pages, offered in both vanilla JavaScript and jQuery variants for practical browser-side measurement.',
    meta: 'Pinned on GitHub • JavaScript',
    topics: ['javascript', 'ui', 'utility'],
    href: 'https://github.com/Modracx/ruler-js'
  },
  {
    name: 'Orqa',
    category: 'Pinned Repository',
    description: 'Modern personal finance app built with Next.js to track income, expenses, budgets, and everyday financial habits through a cleaner dashboard flow.',
    meta: 'Pinned on GitHub • TypeScript',
    topics: ['nextjs', 'typescript', 'finance'],
    href: 'https://github.com/Modracx/Orqa'
  }
];

/* ══════════════════════════════════════════════════
   THEME SYSTEM
══════════════════════════════════════════════════ */
const THEME_RGB = { enterprise: '59,130,246', startup: '168,85,247', creative: '236,72,153', fintech: '34,197,94', saas: '15,23,42', luxury: '217,119,6', gaming: '16,185,129', sustainable: '34,197,94' };
let curRgb = '59,130,246';

function setTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  curRgb = THEME_RGB[name] || '200,134,10';
  document.querySelectorAll('.ts-opt').forEach(o => o.classList.toggle('active', o.dataset.t === name));
  document.querySelectorAll('.mob-tswatch').forEach(s => s.classList.toggle('active', s.dataset.t === name));
  localStorage.setItem('kd-theme', name);
}
(function initTheme() {
  const saved = localStorage.getItem('kd-theme');
  if (saved && THEME_RGB[saved]) { setTheme(saved); } else { curRgb = '59,130,246'; }
})();

/* Theme switcher widget */
const tsToggle = document.getElementById('ts-toggle');
const tsPanel = document.getElementById('ts-panel');
tsToggle.addEventListener('click', e => { e.stopPropagation(); tsPanel.classList.toggle('open'); });
document.addEventListener('click', () => tsPanel.classList.remove('open'));
tsPanel.addEventListener('click', e => e.stopPropagation());
document.querySelectorAll('.ts-opt').forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.t));
});

/* Mobile theme swatches */
const mobRow = document.getElementById('mob-theme-row');
Object.entries(THEME_RGB).forEach(([name, rgb]) => {
  const sw = document.createElement('button');
  const savedTheme = localStorage.getItem('kd-theme') || 'enterprise';
  sw.className = 'mob-tswatch' + (savedTheme === name ? ' active' : '');
  sw.dataset.t = name;
  sw.style.background = `rgb(${rgb})`;
  sw.setAttribute('aria-label', `Select ${name} theme`);
  sw.addEventListener('click', () => setTheme(name));
  mobRow.appendChild(sw);
});

/* ══════════════════════════════════════════════════
   NOISE
══════════════════════════════════════════════════ */
(function () {
  const c = document.createElement('canvas'); c.width = c.height = 200;
  const x = c.getContext('2d'), d = x.createImageData(200, 200);
  for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 22; }
  x.putImageData(d, 0, 0);
  document.getElementById('noise').style.backgroundImage = `url(${c.toDataURL()})`;
})();

/* ══════════════════════════════════════════════════
   MARQUEE
══════════════════════════════════════════════════ */
(function () {
  const t = document.getElementById('mq-track');
  const f = document.createDocumentFragment();
  for (let p = 0; p < 2; p++) {
    MQ_ITEMS.forEach(n => {
      const s = document.createElement('span');
      s.className = 'mq-item';
      s.innerHTML = `${n} <span class="mq-sep">·</span>`;
      f.appendChild(s);
    });
  }
  t.appendChild(f);
})();

/* ══════════════════════════════════════════════════
   ASCII RAIN — Hero background animation
══════════════════════════════════════════════════ */
(function () {
  const cv = document.getElementById('ascii-rain');
  if (!cv) return;
  const cx = cv.getContext('2d');
  const CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{}[]<>/\\*=+$@#;:.!|_~^&%?';
  const SZ = 13, TRAIL = 20;
  let W, H, cols, drops, speeds, trails;
  function setup() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    cols = Math.ceil(W / SZ);
    drops = Array.from({ length: cols }, () => -(Math.random() * 42 | 0));
    speeds = Array.from({ length: cols }, () => 0.9 + Math.random() * 1.8);
    trails = Array.from({ length: cols }, () => []);
  }
  function getRgb() { return getComputedStyle(document.documentElement).getPropertyValue('--prgb').trim() || '15,118,110'; }
  let prev = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    if (ts - prev < 20) return; prev = ts;
    cx.clearRect(0, 0, W, H);
    const r = getRgb();
    cx.textBaseline = 'top';
    for (let i = 0; i < cols; i++) {
      const x = i * SZ, hr = drops[i] | 0;
      /* trail — newest char nearest head, fading upward */
      cx.font = `${SZ}px "JetBrains Mono",monospace`;
      for (let t = 0; t < trails[i].length; t++) {
        const row = hr - t - 1;
        if (row < 0 || row * SZ >= H) continue;
        const a = Math.max(0, 0.68 * (1 - t / TRAIL));
        cx.fillStyle = `rgba(${r},${a.toFixed(2)})`;
        cx.fillText(trails[i][t], x, row * SZ);
      }
      /* head — bright */
      if (hr >= 0 && hr * SZ < H) {
        cx.font = `bold ${SZ}px "JetBrains Mono",monospace`;
        cx.fillStyle = `rgba(${r},0.92)`;
        cx.fillText(CHARS[Math.random() * CHARS.length | 0], x, hr * SZ);
      }
      /* advance */
      const prevRow = drops[i] | 0;
      drops[i] += speeds[i] * 0.32;
      if ((drops[i] | 0) > prevRow && hr >= 0) {
        trails[i].unshift(CHARS[Math.random() * CHARS.length | 0]);
        if (trails[i].length > TRAIL) trails[i].pop();
      }
      /* reset when column fully exits */
      if (drops[i] * SZ > H + TRAIL * SZ) {
        drops[i] = -(Math.random() * 25 | 0);
        trails[i] = [];
        speeds[i] = 0.9 + Math.random() * 1.8;
      }
    }
  }
  setup();
  window.addEventListener('resize', setup);
  requestAnimationFrame(frame);
})();

/* ══════════════════════════════════════════════════
   TERMINAL TYPEWRITER — Contact section
══════════════════════════════════════════════════ */
(function () {
  const el = document.getElementById('ta-text');
  if (!el) return;
  const LINES = [
    'available.for_work --now',
    'specialization --magento --shopify',
    'location --india --remote_ok',
    'contact kd.xtrm@gmail.com',
    'open_to new_challenges',
  ];
  let li = 0, ci = 0, typing = true, wait = 0;
  function tick() {
    if (wait > 0) { wait--; setTimeout(tick, 50); return; }
    const line = LINES[li];
    if (typing) {
      if (ci < line.length) { el.textContent = line.slice(0, ++ci); setTimeout(tick, 52 + Math.random() * 44); }
      else { typing = false; wait = 34; setTimeout(tick, 50); }
    } else {
      if (ci > 0) { el.textContent = line.slice(0, --ci); setTimeout(tick, 20); }
      else { typing = true; li = (li + 1) % LINES.length; wait = 14; setTimeout(tick, 50); }
    }
  }
  setTimeout(tick, 1400);
})();

/* ══════════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════════ */
(function () {
  const dot = document.getElementById('cdot');
  const ring = document.getElementById('cring');
  if (!dot || window.matchMedia('(hover:none)').matches) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.querySelectorAll('a,button,.pc,.tc,.mem-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('big'));
    el.addEventListener('mouseleave', () => ring.classList.remove('big'));
  });
  (function loop() {
    dot.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
    rx += (mx - rx) * .11; ry += (my - ry) * .11;
    ring.style.transform = `translate(${rx - 19}px,${ry - 19}px)`;
    requestAnimationFrame(loop);
  })();
})();

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS + NAV
══════════════════════════════════════════════════ */
const spFill = document.getElementById('sp-fill');
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  spFill.style.height = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  navEl.classList.toggle('scrolled', window.scrollY > 55);
}, { passive: true });

/* ══════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════ */
const ham = document.getElementById('nav-ham');
const mob = document.getElementById('mob-overlay');
function closeMob() { mob.classList.remove('open'); ham.classList.remove('open'); }
ham.addEventListener('click', () => {
  mob.classList.toggle('open'); ham.classList.toggle('open');
});

/* ══════════════════════════════════════════════════
   DANDELION 3D SPHERE — see <script type="module"> below
══════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════
   TEXT SCRAMBLE
══════════════════════════════════════════════════ */
class TextScramble {
  constructor(el) { this.el = el; this.chars = '!<>_\\/[]{}=+*^?#~ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
  setText(txt) {
    const q = Array.from(txt).map(c => ({ to: c, start: Math.floor(Math.random() * 12), end: 20 + Math.floor(Math.random() * 14), ch: '' }));
    let f = 0;
    const run = () => {
      let out = '', done = 0;
      q.forEach(item => {
        if (f >= item.end) { done++; out += item.to == ' ' ? ' ' : item.to; }
        else if (f >= item.start) {
          if (Math.random() < .3) item.ch = this.chars[Math.floor(Math.random() * this.chars.length)];
          out += `<span style="color:rgba(${curRgb},.45)">${item.ch}</span>`;
        } else { out += item.to == ' ' ? ' ' : ' '; }
      });
      this.el.innerHTML = out;
      if (done < q.length) { f++; requestAnimationFrame(run); }
    };
    run();
  }
}

/* ══════════════════════════════════════════════════
   HERO ANIMATION
══════════════════════════════════════════════════ */
function animHero() {
  const nameEl = document.getElementById('hero-name');
  // Use CSS animations for better performance
  const lines = nameEl.querySelectorAll('.ln');
  lines.forEach((line, i) => {
    line.style.animation = `slideUp 0.8s ease-out ${0.35 + i * 0.1}s forwards`;
  });

  const sub = document.getElementById('hero-sub');
  setTimeout(() => new TextScramble(sub).setText('Magento and Shopify Developer'), 1000);
}

/* ══════════════════════════════════════════════════
   POPULATE STACK + WORK
══════════════════════════════════════════════════ */
function populateStack() {
  const g = document.getElementById('stack-grid');
  if (!g) return;
  TECH.forEach(t => {
    const el = document.createElement('div'); el.className = 'tc';
    const icon = t.icon
      ? `<img class="tc-icon" src="https://cdn.simpleicons.org/${t.icon}/${t.color || '111111'}" alt="${t.name}" loading="lazy" onerror="this.outerHTML='<span class=&quot;tc-fallback&quot;>${t.fallback || t.name.slice(0, 2).toUpperCase()}</span>'"/>`
      : `<span class="tc-fallback">${t.fallback || t.name.slice(0, 2).toUpperCase()}</span>`;
    el.innerHTML = `${icon}<span class="tc-name">${t.name}</span><span class="tc-type">${t.type}</span>`;
    g.appendChild(el);
  });
}

function patBg(pat) {
  const stroke = `rgb(${curRgb})`;
  const svgs = {
    grid: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="${stroke}" stroke-width=".6"/></pattern></defs><rect width="200" height="200" fill="url(#p)"/></svg>`,
    lines: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="24" stroke="${stroke}" stroke-width=".6"/></pattern></defs><rect width="200" height="200" fill="url(#p)"/></svg>`,
    wave: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200"><path d="M0 50 Q50 10 100 50 T200 50 T300 50 T400 50" fill="none" stroke="${stroke}" stroke-width=".6"/><path d="M0 100 Q50 60 100 100 T200 100 T300 100 T400 100" fill="none" stroke="${stroke}" stroke-width=".6"/><path d="M0 150 Q50 110 100 150 T200 150 T300 150 T400 150" fill="none" stroke="${stroke}" stroke-width=".6"/></svg>`,
    ticks: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="40"><defs><pattern id="p" width="10" height="40" patternUnits="userSpaceOnUse"><line x1="5" y1="0" x2="5" y2="10" stroke="${stroke}" stroke-width=".6"/></pattern></defs><rect width="300" height="1" y="9" fill="${stroke}" opacity=".4"/><rect width="300" height="40" fill="url(#p)"/></svg>`,
    frames: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect x="5" y="5" width="110" height="110" fill="none" stroke="${stroke}" stroke-width=".6"/><rect x="18" y="18" width="84" height="84" fill="none" stroke="${stroke}" stroke-width=".6"/><rect x="32" y="32" width="56" height="56" fill="none" stroke="${stroke}" stroke-width=".6"/><rect x="46" y="46" width="28" height="28" fill="none" stroke="${stroke}" stroke-width=".6"/></svg>`,
    arc: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" width="300" height="160"><path d="M20 140 A120 120 0 0 1 280 140" fill="none" stroke="${stroke}" stroke-width=".6"/><path d="M50 150 A90 90 0 0 1 250 150" fill="none" stroke="${stroke}" stroke-width=".6"/><path d="M80 155 A60 60 0 0 1 220 155" fill="none" stroke="${stroke}" stroke-width=".6"/></svg>`,
  };
  return 'data:image/svg+xml;base64,' + btoa(svgs[pat] || svgs.grid);
}

/* ══════════════════════════════════════════════════
   PROJECT CARDS — CV driven with pagination
══════════════════════════════════════════════════ */
const PER_PAGE = 4;
const PATS = ['grid', 'lines', 'wave', 'ticks', 'frames', 'arc'];
let ghRepos = [], ghPage = 1;

/* Hash repo name → deterministic background pattern */
function repoPattern(name) {
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return PATS[h % PATS.length];
}

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d < 1) return 'today'; if (d === 1) return '1d ago';
  if (d < 30) return d + 'd ago';
  const m = Math.floor(d / 30); if (m < 12) return m + 'mo ago';
  return Math.floor(m / 12) + 'y ago';
}

function renderWorkCard(repo, idx, total) {
  const el = document.createElement('div');
  el.className = 'pc';
  /* VanillaTilt — subtle depth on hover */
  el.setAttribute('data-tilt', '');
  el.setAttribute('data-tilt-max', '5');
  el.setAttribute('data-tilt-speed', '600');
  el.setAttribute('data-tilt-glare', 'true');
  el.setAttribute('data-tilt-max-glare', '0.08');
  el.setAttribute('data-tilt-scale', '1.012');
  const num = String(idx + 1).padStart(2, '0');
  const total2 = String(total).padStart(2, '0');
  const desc = repo.description || 'A project by Kenneth D\'Silva.';
  const lang = repo.category || repo.language || 'Project';
  const stars = repo.stargazers_count || 0;
  const topics = (repo.topics || []).slice(0, 3);
  const meta = repo.meta || `Updated ${timeAgo(repo.updated_at || repo.pushed_at || new Date().toISOString())}`;
  const pat = repoPattern(repo.name);
  el.innerHTML = `
    <div class="pc-bg" style="background-image:url('${patBg(pat)}')"></div>
    <div class="pc-header">
      <span class="pc-num">${num} / ${total2}</span>
      ${stars > 0 ? `<span class="pc-stars">★ ${stars}</span>` : ''}
    </div>
    <span class="pc-cat">${lang}</span>
    <h3 class="pc-name">${repo.name}</h3>
    <p class="pc-desc">${desc}</p>
    <div class="pc-foot">
      <div class="pc-tags">
        ${topics.map(t => `<span class="pt">${t}</span>`).join('')}
        ${lang ? `<span class="pt">${lang}</span>` : ''}
      </div>
      ${repo.href || repo.html_url ? `<a href="${repo.href || repo.html_url}" target="_blank" rel="noopener" class="pc-lnk" aria-label="View ${repo.name}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </a>`: `<span class="pc-lnk" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 12H17"/></svg>
      </span>`}
    </div>
    <div class="pc-updated">${meta}</div>`;
  return el;
}

function renderWorkPage() {
  const grid = document.getElementById('work-grid');
  grid.innerHTML = '';
  const start = (ghPage - 1) * PER_PAGE;
  const slice = ghRepos.slice(start, start + PER_PAGE);
  slice.forEach((r, i) => grid.appendChild(renderWorkCard(r, start + i, ghRepos.length)));
  /* Tilt — init after cards are in DOM */
  if (typeof VanillaTilt !== 'undefined')
    VanillaTilt.init(grid.querySelectorAll('[data-tilt]'));
  /* Slide-up entrance — cards always reach opacity:1 (no from-opacity-0 conflict) */
  const cards = [...grid.querySelectorAll('.pc')];
  cards.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(20px)';
    setTimeout(() => { c.style.transition = 'opacity .6s var(--ease),transform .6s var(--ease)'; c.style.opacity = '1'; c.style.transform = 'none'; }, i * 100);
  });
}

/* Fetch GitHub repos */
async function fetchRepos() {
  const loading = document.getElementById('work-loading');
  const error = document.getElementById('work-error');
  const grid = document.getElementById('work-grid');
  const pager = document.getElementById('work-pager');
  loading.classList.add('show');
  try {
    const res = await fetch('https://api.github.com/users/Modracx/repos?sort=updated&per_page=100');
    if (!res.ok) throw new Error('Failed to fetch repos');
    const repos = await res.json();
    ghRepos = repos.filter(r => !r.fork && r.name !== 'Modracx.github.io').sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    renderWorkPage();
    pager.classList.add('show');
    updatePager();
  } catch (e) {
    console.error(e);
    error.classList.add('show');
  } finally {
    loading.classList.remove('show');
  }
}

/* Pagination */
function updatePager() {
  const pages = document.getElementById('pg-pages');
  const prev = document.getElementById('pg-prev');
  const next = document.getElementById('pg-next');
  const info = document.getElementById('pg-info');
  const totalPages = Math.ceil(ghRepos.length / PER_PAGE);
  pages.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const dot = document.createElement('button');
    dot.className = 'pg-dot' + (i === ghPage ? ' active' : '');
    dot.setAttribute('aria-label', `Select page number ${i}`);
    dot.addEventListener('click', () => setPage(i));
    pages.appendChild(dot);
  }
  prev.disabled = ghPage === 1;
  next.disabled = ghPage === totalPages;
  if (info) info.textContent = `${ghPage} of ${totalPages}`;
}
function setPage(p) {
  ghPage = p;
  renderWorkPage();
  updatePager();
}
document.getElementById('pg-prev').addEventListener('click', () => setPage(ghPage - 1));
document.getElementById('pg-next').addEventListener('click', () => setPage(ghPage + 1));

/* Populate projects */
(function () {
  const g = document.getElementById('projects-grid');
  PROJECTS.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'pc';
    el.setAttribute('data-tilt', '');
    el.setAttribute('data-tilt-max', '5');
    el.setAttribute('data-tilt-speed', '600');
    el.setAttribute('data-tilt-glare', 'true');
    el.setAttribute('data-tilt-max-glare', '0.08');
    el.setAttribute('data-tilt-scale', '1.012');
    const num = String(i + 1).padStart(2, '0');
    const pat = repoPattern(p.name);
    el.innerHTML = `
      <div class="pc-bg" style="background-image:url('${patBg(pat)}')"></div>
      <div class="pc-header">
        <span class="pc-num">${num} / ${String(PROJECTS.length).padStart(2, '0')}</span>
      </div>
      <span class="pc-cat">${p.category}</span>
      <h3 class="pc-name">${p.name}</h3>
      <p class="pc-desc">${p.description}</p>
      <div class="pc-foot">
        <div class="pc-tags">
          ${p.topics.map(t => `<span class="pt">${t}</span>`).join('')}
        </div>
        ${p.href ? `<a href="${p.href}" target="_blank" rel="noopener" class="pc-lnk" aria-label="View ${p.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </a>`: `<span class="pc-lnk" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 12H17"/></svg>
        </span>`}
      </div>
      <div class="pc-updated">${p.meta}</div>`;
    g.appendChild(el);
  });
  if (typeof VanillaTilt !== 'undefined') VanillaTilt.init(g.querySelectorAll('[data-tilt]'));
})();

/* ══════════════════════════════════════════════════
   GAMES
══════════════════════════════════════════════════ */
let currentGame = null;
const games = { breaker: {}, memory: {}, snake: {} };

/* Breaker */
(function () {
  const canvas = document.getElementById('brk-canvas');
  const overlay = document.getElementById('brk-overlay');
  const title = document.getElementById('brk-ov-title');
  const sub = document.getElementById('brk-ov-sub');
  const btn = document.getElementById('brk-ov-btn');
  const sidebar = document.getElementById('g-sidebar');
  const scoreEl = document.getElementById('g-score');
  const extraEl = document.getElementById('g-extra-val');
  const extraLbl = document.getElementById('g-extra-lbl');
  const hint = document.getElementById('g-hint');
  const restartBtn = document.getElementById('g-restart-btn');
  let ctx, w, h, paddle, ball, bricks, score = 0, lives = 3, gameRunning = false;

  function init() {
    w = canvas.width; h = canvas.height;
    paddle = { x: w / 2 - 50, y: h - 20, w: 100, h: 10 };
    ball = { x: w / 2, y: h - 30, r: 5, vx: 3, vy: -3 };
    bricks = []; for (let r = 0; r < 5; r++)for (let c = 0; c < 10; c++)bricks.push({ x: c * 60 + 10, y: r * 20 + 10, w: 50, h: 15, hit: false });
    score = 0; lives = 3; updateUI();
  }
  function updateUI() {
    scoreEl.textContent = score;
    extraEl.textContent = lives;
    extraLbl.textContent = 'Lives';
    hint.innerHTML = 'Use ← → to move paddle.<br/>SPACE to launch ball.';
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff'; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
    bricks.forEach(b => { if (!b.hit) { ctx.fillStyle = '#f00'; ctx.fillRect(b.x, b.y, b.w, b.h); } });
  }
  function update() {
    if (!gameRunning) return;
    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.x - ball.r < 0 || ball.x + ball.r > w) ball.vx *= -1;
    if (ball.y - ball.r < 0) ball.vy *= -1;
    if (ball.y + ball.r > h) { lives--; if (lives <= 0) { endGame(false); } else { resetBall(); } }
    if (ball.y + ball.r > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) { ball.vy *= -1; ball.y = paddle.y - ball.r; }
    bricks.forEach(b => { if (!b.hit && ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) { b.hit = true; ball.vy *= -1; score += 10; } });
    if (bricks.every(b => b.hit)) endGame(true);
  }
  function resetBall() { ball.x = w / 2; ball.y = h - 30; ball.vx = 3; ball.vy = -3; gameRunning = false; }
  function endGame(win) {
    gameRunning = false;
    title.textContent = win ? 'YOU WIN!' : 'GAME OVER';
    sub.textContent = win ? `Score: ${score}` : `Final Score: ${score}`;
    overlay.classList.remove('gone');
    restartBtn.style.display = 'block';
  }
  function start() {
    if (!ctx) return;
    init();
    overlay.classList.add('gone');
    gameRunning = true;
    restartBtn.style.display = 'none';
    (function loop() { update(); draw(); requestAnimationFrame(loop); })();
  }
  btn.addEventListener('click', start);
  restartBtn.addEventListener('click', start);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && paddle.x > 0) paddle.x -= 10;
    if (e.key === 'ArrowRight' && paddle.x < w - paddle.w) paddle.x += 10;
    if (e.key === ' ' && !gameRunning) { gameRunning = true; e.preventDefault(); }
  });
  games.breaker = { init: () => { ctx = canvas.getContext('2d'); init(); }, start };
})();

/* Memory */
(function () {
  const grid = document.getElementById('mem-grid');
  const overlay = document.getElementById('mem-overlay');
  const btn = document.getElementById('mem-ov-btn');
  const scoreEl = document.getElementById('g-score');
  const extraEl = document.getElementById('g-extra-val');
  const extraLbl = document.getElementById('g-extra-lbl');
  const hint = document.getElementById('g-hint');
  const restartBtn = document.getElementById('g-restart-btn');
  let cards = [], flipped = [], matched = 0, score = 0;

  const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  function init() {
    cards = []; flipped = []; matched = 0; score = 0;
    const syms = [...symbols, ...symbols].sort(() => Math.random() - .5);
    grid.innerHTML = ''; syms.forEach((s, i) => {
      const card = document.createElement('div'); card.className = 'mem-card';
      card.innerHTML = `<div class="mem-inner"><div class="mem-face mem-back"><span class="mem-q">?</span></div><div class="mem-face mem-front"><span class="mem-sym">${s}</span></div></div>`;
      card.dataset.sym = s; card.addEventListener('click', flipCard);
      cards.push(card); grid.appendChild(card);
    });
    updateUI();
  }
  function updateUI() {
    scoreEl.textContent = score;
    extraEl.textContent = matched;
    extraLbl.textContent = 'Pairs';
    hint.innerHTML = 'Match all 8 pairs of symbols.';
  }
  function flipCard() {
    if (flipped.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) return;
    this.classList.add('flipped'); flipped.push(this);
    if (flipped.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
  function checkMatch() {
    const [a, b] = flipped;
    if (a.dataset.sym === b.dataset.sym) {
      a.classList.add('matched'); b.classList.add('matched'); matched++; score += 10;
      if (matched === 8) { endGame(true); }
    } else {
      a.classList.remove('flipped'); b.classList.remove('flipped');
    }
    flipped = []; updateUI();
  }
  function endGame(win) {
    overlay.querySelector('.g-ov-title').textContent = win ? 'MEMORY COMPLETE!' : 'TRY AGAIN';
    overlay.querySelector('.g-ov-sub').textContent = `Score: ${score}`;
    overlay.classList.remove('gone');
    restartBtn.style.display = 'block';
  }
  function start() {
    init(); overlay.classList.add('gone'); restartBtn.style.display = 'none';
  }
  btn.addEventListener('click', start);
  restartBtn.addEventListener('click', start);
  games.memory = { init, start };
})();

/* Snake */
(function () {
  const canvas = document.getElementById('snk-canvas');
  const overlay = document.getElementById('snk-overlay');
  const btn = document.getElementById('snk-ov-btn');
  const dpad = document.getElementById('dpad-wrap');
  const scoreEl = document.getElementById('g-score');
  const hint = document.getElementById('g-hint');
  const restartBtn = document.getElementById('g-restart-btn');
  let ctx, w, h, snake, food, dir, score = 0, gameRunning = false;

  function init() {
    w = canvas.width; h = canvas.height;
    snake = [{ x: 100, y: 100 }]; dir = { x: 10, y: 0 }; food = { x: 200, y: 200 }; score = 0; updateUI();
  }
  function updateUI() {
    scoreEl.textContent = score;
    hint.innerHTML = 'WASD or arrow keys to move.<br/>Touch D-pad on mobile.';
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff'; snake.forEach(s => { ctx.fillRect(s.x, s.y, 10, 10); });
    ctx.fillStyle = '#f00'; ctx.fillRect(food.x, food.y, 10, 10);
  }
  function update() {
    if (!gameRunning) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= w || head.y < 0 || head.y >= h || snake.some(s => s.x === head.x && s.y === head.y)) { endGame(false); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { score++; food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 }; } else { snake.pop(); }
  }
  function endGame(win) {
    gameRunning = false;
    overlay.querySelector('.g-ov-title').textContent = win ? 'SNAKE MASTER!' : 'GAME OVER';
    overlay.querySelector('.g-ov-sub').textContent = `Score: ${score}`;
    overlay.classList.remove('gone');
    restartBtn.style.display = 'block';
  }
  function start() {
    if (!ctx) return;
    init(); overlay.classList.add('gone'); gameRunning = true; restartBtn.style.display = 'none';
    (function loop() { update(); draw(); setTimeout(loop, 100); })();
  }
  btn.addEventListener('click', start);
  restartBtn.addEventListener('click', start);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && dir.y === 0) { dir = { x: 0, y: -10 }; }
    if (e.key === 'ArrowDown' && dir.y === 0) { dir = { x: 0, y: 10 }; }
    if (e.key === 'ArrowLeft' && dir.x === 0) { dir = { x: -10, y: 0 }; }
    if (e.key === 'ArrowRight' && dir.x === 0) { dir = { x: 10, y: 0 }; }
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
      if (e.code === 'KeyW' && dir.y === 0) dir = { x: 0, y: -10 };
      if (e.code === 'KeyS' && dir.y === 0) dir = { x: 0, y: 10 };
      if (e.code === 'KeyA' && dir.x === 0) dir = { x: -10, y: 0 };
      if (e.code === 'KeyD' && dir.x === 0) dir = { x: 10, y: 0 };
    }
  });
  ['dp-u', 'dp-d', 'dp-l', 'dp-r'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      if (id === 'dp-u' && dir.y === 0) dir = { x: 0, y: -10 };
      if (id === 'dp-d' && dir.y === 0) dir = { x: 0, y: 10 };
      if (id === 'dp-l' && dir.x === 0) dir = { x: -10, y: 0 };
      if (id === 'dp-r' && dir.x === 0) dir = { x: 10, y: 0 };
    });
  });
  games.snake = { init: () => { ctx = canvas.getContext('2d'); init(); }, start };
})();

/* Game tabs */
document.querySelectorAll('.g-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.g-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const game = tab.dataset.game;
    document.getElementById(`gp-${game}`).classList.add('active');
    if (currentGame !== game) {
      currentGame = game;
      games[game].init();
    }
  });
});

/* ══════════════════════════════════════════════════
   ANIMATED SECTION CANVASES
══════════════════════════════════════════════════ */

/* ── About — particle constellation ── */
/* ── Canvas Animations — Deferred until after critical path ── */
function initCanvasAnimations() {
  initAboutCanvas();
  initStackCanvas();
  initWorkCanvas();
  initGamesCanvas();
  initProjectsCanvas();
}

function initAboutCanvas() {
  const cv = document.getElementById('about-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H, pts = [];
  function setup() {
    // Defer layout queries to avoid forced reflows
    requestAnimationFrame(() => {
      W = cv.width = cv.offsetWidth || cv.parentElement.clientWidth;
      H = cv.height = cv.offsetHeight || cv.parentElement.clientHeight;
      const n = Math.min(Math.floor(W * H / 14000), 55);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
        r: 1 + Math.random() * 2
      }));
    });
  }
  function rgb() { return getComputedStyle(document.documentElement).getPropertyValue('--prgb').trim() || '15,118,110'; }
  let pt = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - pt < 38) return; pt = ts;
    cx.clearRect(0, 0, W, H);
    const r = rgb();
    /* move */
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    /* connections */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          cx.strokeStyle = `rgba(${r},${(0.11 * (1 - d / 160)).toFixed(3)})`;
          cx.lineWidth = .7;
          cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(pts[j].x, pts[j].y); cx.stroke();
        }
      }
    }
    /* dots */
    pts.forEach(p => {
      cx.fillStyle = `rgba(${r},0.18)`;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2); cx.fill();
    });
  }
  setup(); window.addEventListener('resize', setup); requestAnimationFrame(draw);
}

/* ── Stack — rising energy columns ── */
function initStackCanvas() {
  const cv = document.getElementById('stack-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H, cols = [];
  function setup() {
    // Defer layout queries to avoid forced reflows
    requestAnimationFrame(() => {
      W = cv.width = cv.offsetWidth || cv.parentElement.clientWidth;
      H = cv.height = cv.offsetHeight || cv.parentElement.clientHeight;
      const n = Math.floor(W / 55);
      cols = Array.from({ length: n }, (_, i) => ({
      x: i * (W / n) + Math.random() * 18,
      maxH: H * (0.3 + Math.random() * 0.6),
      speed: .4 + Math.random() * .5,
      phase: Math.random() * Math.PI * 2
    }));
    });
  }
  function rgb() { return getComputedStyle(document.documentElement).getPropertyValue('--prgb').trim() || '15,118,110'; }
  let t = 0, pt = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - pt < 38) return; pt = ts; t += .012;
    cx.clearRect(0, 0, W, H);
    const r = rgb();
    cols.forEach(c => {
      const frac = .5 + .5 * Math.sin(t * c.speed + c.phase);
      const h = c.maxH * frac;
      const a = .032 + .026 * frac;
      const g = cx.createLinearGradient(0, H - h, 0, H);
      g.addColorStop(0, `rgba(${r},0)`);
      g.addColorStop(.7, `rgba(${r},${(a * .8).toFixed(3)})`);
      g.addColorStop(1, `rgba(${r},${a.toFixed(3)})`);
      cx.fillStyle = g;
      cx.fillRect(c.x - 13, H - h, 26, h);
    });
  }
  setup(); window.addEventListener('resize', setup); requestAnimationFrame(draw);
}

/* ── Work — scrolling data grid with scan line ── */
function initWorkCanvas() {
  const cv = document.getElementById('work-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H;
  function setup() {
    // Defer layout queries to avoid forced reflows
    requestAnimationFrame(() => {
      W = cv.width = cv.offsetWidth || cv.parentElement.clientWidth;
      H = cv.height = cv.offsetHeight || cv.parentElement.clientHeight;
    });
  }
  function rgb() { return getComputedStyle(document.documentElement).getPropertyValue('--prgb').trim() || '15,118,110'; }
  let t = 0, pt = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - pt < 38) return; pt = ts; t += .009;
    cx.clearRect(0, 0, W, H);
    const r = rgb();
    const GS = 48;
    for (let x = 0; x < W; x += GS) {
      for (let y = 0; y < H; y += GS) {
        const w = Math.max(0, Math.sin(t + x * .018 + y * .018) * .038);
        if (w > 0) { cx.fillStyle = `rgba(${r},${w.toFixed(3)})`; cx.fillRect(x + 1, y + 1, GS - 3, GS - 3); }
      }
    }
    /* scan line */
    const sy = ((t * 55) % (H + 60)) - 30;
    const g = cx.createLinearGradient(0, sy - 35, 0, sy + 35);
    g.addColorStop(0, `rgba(${r},0)`); g.addColorStop(.5, `rgba(${r},.048)`); g.addColorStop(1, `rgba(${r},0)`);
    cx.fillStyle = g; cx.fillRect(0, sy - 35, W, 70);
  }
  setup(); window.addEventListener('resize', setup); requestAnimationFrame(draw);
}

/* ── Games — CRT scanlines + pixel noise ── */
function initGamesCanvas() {
  const cv = document.getElementById('games-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H;
  function setup() {
    // Defer layout queries to avoid forced reflows
    requestAnimationFrame(() => {
      W = cv.width = cv.offsetWidth || cv.parentElement.clientWidth;
      H = cv.height = cv.offsetHeight || cv.parentElement.clientHeight;
    });
  }
  function rgb() { return getComputedStyle(document.documentElement).getPropertyValue('--prgb').trim() || '15,118,110'; }
  let t = 0, pt = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - pt < 50) return; pt = ts; t += .025;
    cx.clearRect(0, 0, W, H);
    const r = rgb();
    /* scanlines */
    for (let y = 0; y < H; y += 4) {
      const a = .012 + .008 * Math.sin(t + y * .04);
      cx.fillStyle = `rgba(${r},${a.toFixed(3)})`; cx.fillRect(0, y, W, 1);
    }
    /* pixel rain */
    cx.fillStyle = `rgba(${r},.06)`;
    for (let i = 0; i < 35; i++) {
      const px = Math.random() * W | 0, py = (Math.random() * H + t * 28) % H | 0;
      cx.fillRect(px, py, 2, 2);
    }
  }
  setup(); window.addEventListener('resize', setup); requestAnimationFrame(draw);
}

/* ── Projects — diagonal data streams ── */
function initProjectsCanvas() {
  const cv = document.getElementById('projects-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H, streams = [];
  function setup() {
    // Defer layout queries to avoid forced reflows
    requestAnimationFrame(() => {
      W = cv.width = cv.offsetWidth || cv.parentElement.clientWidth;
    H = cv.height = cv.offsetHeight || cv.parentElement.clientHeight;
    const n = Math.min(Math.ceil(W / 38), 50);
    streams = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: 0.9 + Math.random() * .7,
      vy: 0.45 + Math.random() * .35,
      len: 50 + Math.random() * 80,
      a: 0.035 + Math.random() * .055,
      w: 0.7 + Math.random() * .8
    }));
    });
  }
  function rgb() { return getComputedStyle(document.documentElement).getPropertyValue('--prgb').trim() || '15,118,110'; }
  let pt = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - pt < 38) return; pt = ts;
    cx.clearRect(0, 0, W, H);
    const r = rgb();
    streams.forEach(s => {
      const g = cx.createLinearGradient(s.x, s.y, s.x - s.len * s.vx * .8, s.y - s.len * s.vy * .8);
      g.addColorStop(0, `rgba(${r},${s.a.toFixed(3)})`);
      g.addColorStop(1, `rgba(${r},0)`);
      cx.strokeStyle = g; cx.lineWidth = s.w;
      cx.beginPath(); cx.moveTo(s.x, s.y); cx.lineTo(s.x - s.len * s.vx, s.y - s.len * s.vy); cx.stroke();
      /* small bright node at head */
      cx.fillStyle = `rgba(${r},${(s.a * 2.2).toFixed(3)})`;
      cx.beginPath(); cx.arc(s.x, s.y, s.w + .5, 0, Math.PI * 2); cx.fill();
      s.x += s.vx; s.y += s.vy;
      if (s.x > W + 60) { s.x = -60; s.y = Math.random() * H; }
      if (s.y > H + 60) { s.y = -60; s.x = Math.random() * W; }
    });
  }
  setup(); window.addEventListener('resize', setup); requestAnimationFrame(draw);
}

/* ── Contact — expanding concentric rings ── */
(function () {
  const cv = document.getElementById('contact-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H;
  function setup() {
    W = cv.width = cv.offsetWidth || cv.parentElement.clientWidth;
    H = cv.height = cv.offsetHeight || cv.parentElement.clientHeight;
  }
  function rgb() { return getComputedStyle(document.documentElement).getPropertyValue('--prgb').trim() || '15,118,110'; }
  const NR = 6; let t = 0, pt = 0;
  function draw(ts) {
    requestAnimationFrame(draw);
    if (ts - pt < 38) return; pt = ts; t += .006;
    cx.clearRect(0, 0, W, H);
    const r = rgb();
    const ox = W / 2, oy = H / 2;
    const maxR = Math.hypot(ox, oy);
    for (let i = 0; i < NR; i++) {
      const ph = ((t + i / NR) % 1);
      const rad = ph * maxR;
      const a = Math.max(0, (1 - ph) * .14);
      cx.strokeStyle = `rgba(${r},${a.toFixed(3)})`;
      cx.lineWidth = 1.2;
      cx.beginPath(); cx.arc(ox, oy, rad, 0, Math.PI * 2); cx.stroke();
    }
    /* faint grid */
    cx.strokeStyle = `rgba(${r},.025)`; cx.lineWidth = .5;
    const GS = 60;
    for (let x = 0; x < W; x += GS) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x, H); cx.stroke(); }
    for (let y = 0; y < H; y += GS) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }
  }
  setup(); window.addEventListener('resize', setup); requestAnimationFrame(draw);
})();

/* ── Games initialization — Deferred ── */
function initGames() {
  // Games initialization can be added here if needed
  // Currently, games are initialized on demand by game selection
}

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  animHero();
  // Initialize only critical path code
  populateStack();
  // Defer non-critical operations
  setTimeout(() => {
    fetchRepos();
    initGames();
    initCanvasAnimations();
  }, 1500);
  initScrollAnimations();
});

/* ══════════════════════════════════════════════════
   SCROLL-TRIGGERED ANIMATIONS
══════════════════════════════════════════════════ */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'  // Trigger 60px before element enters viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation classes based on data attributes
        const animType = entry.target.dataset.animType || 'fadeSlideUp';
        entry.target.style.animationName = animType;
        entry.target.style.animationDuration = entry.target.dataset.animDuration || '.6s';
        entry.target.style.animationTimingFunction = 'var(--ease)';
        entry.target.style.animationFillMode = 'both';

        // Stop observing after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-scroll-animate attribute
  document.querySelectorAll('[data-scroll-animate]').forEach(el => {
    observer.observe(el);
  });

  // Observe work cards for staggered entrance
  const workCards = document.querySelectorAll('.pc');
  workCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
}

// Add parallax effect to elements on scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  parallaxElements.forEach(el => {
    const speed = el.dataset.parallax || 0.5;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
}, { passive: true });