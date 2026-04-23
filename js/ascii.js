(function () {
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  class ASCIICanvas {
    constructor(container, mode = "rain", options = {}) {
      if (!container) return;
      this.container = container;
      this.mode = mode;
      this.opts = {
        chars: options.chars || "01<>{}[]|/\\-+=ABCDEFX#@%",
        color: options.color || "#00D4FF",
        speed: options.speed || 80,
        fontSize: options.fontSize || 13,
        interactive: options.interactive !== false,
      };
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("aria-hidden", "true");
      this.canvas.setAttribute("role", "presentation");
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      this.ctx = this.canvas.getContext("2d");
      this.container.appendChild(this.canvas);
      this.mouse = { x: -999, y: -999 };
      this.frame = 0;
      this.resize = this.resize.bind(this);
      this.init();
    }

    init() {
      this.resize();
      window.addEventListener("resize", this.resize);
      if (this.opts.interactive) this.bindMouse();
      this.draw();
      if (!reduceMotion) this.loop();
    }

    resize() {
      this.canvas.width = this.container.offsetWidth || 1;
      this.canvas.height = this.container.offsetHeight || 1;
      this.cols = Math.max(1, Math.floor(this.canvas.width / this.opts.fontSize));
      this.rows = Math.max(1, Math.floor(this.canvas.height / this.opts.fontSize));
      this.drops = Array.from({ length: this.cols }, () => Math.random() * -this.rows);
      this.cells = Array.from({ length: this.cols * this.rows }, () => ({
        char: this.randomChar(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.04,
      }));
    }

    bindMouse() {
      this.container.addEventListener("mousemove", (event) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
      });
      this.container.addEventListener("mouseleave", () => {
        this.mouse.x = -999;
        this.mouse.y = -999;
      });
    }

    randomChar() {
      const { chars } = this.opts;
      return chars[Math.floor(Math.random() * chars.length)];
    }

    drawRain() {
      const { ctx, canvas } = this;
      ctx.fillStyle = "rgba(5,8,16,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < this.drops.length; index += 1) {
        const x = index * this.opts.fontSize;
        const y = this.drops[index] * this.opts.fontSize;
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 100);
        ctx.fillStyle =
          proximity > 0
            ? `rgba(255,255,255,${0.35 + proximity * 0.65})`
            : this.opts.color;
        ctx.fillText(this.randomChar(), x, y);
        if (y > canvas.height && Math.random() > 0.975) this.drops[index] = 0;
        this.drops[index] += reduceMotion ? 0.18 : 0.5;
      }
    }

    drawGrid() {
      const { ctx } = this;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let row = 0; row < this.rows; row += 1) {
        for (let col = 0; col < this.cols; col += 1) {
          const cell = this.cells[row * this.cols + col];
          const x = col * this.opts.fontSize;
          const y = row * this.opts.fontSize + this.opts.fontSize;
          const dx = x - this.mouse.x;
          const dy = y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const t = 1 - dist / 120;
            ctx.fillStyle = `rgba(0,212,255,${0.12 + t * 0.88})`;
            ctx.fillText(this.randomChar(), x, y);
          } else {
            cell.phase += reduceMotion ? 0.006 : cell.speed;
            const alpha = ((Math.sin(cell.phase) + 1) / 2) * 0.26;
            ctx.fillStyle = `rgba(0,212,255,${alpha})`;
            ctx.fillText(cell.char, x, y);
          }
        }
      }
    }

    drawWave() {
      const { ctx } = this;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const t = this.frame * (reduceMotion ? 0.01 : 0.03);
      for (let col = 0; col < this.cols; col += 1) {
        const x = col * this.opts.fontSize;
        const wave1 = Math.sin(col * 0.15 + t) * 4;
        const wave2 = Math.sin(col * 0.3 + t * 1.5) * 2;
        const wave3 = Math.sin(col * 0.05 + t * 0.7) * 6;
        const midRow = Math.round(this.rows / 2 + wave1 + wave2 + wave3);
        for (let row = midRow - 4; row <= midRow + 4; row += 1) {
          if (row < 0 || row >= this.rows) continue;
          const dist = Math.abs(row - midRow);
          const alpha = 1 - dist / 5;
          ctx.fillStyle = `rgba(0,212,255,${Math.max(0.08, alpha * 0.85)})`;
          ctx.fillText(this.randomChar(), x, row * this.opts.fontSize + this.opts.fontSize);
        }
      }
    }

    draw() {
      const { ctx } = this;
      ctx.font = `${this.opts.fontSize}px "IBM Plex Mono", monospace`;
      this.frame += 1;
      if (this.mode === "grid") this.drawGrid();
      else if (this.mode === "wave") this.drawWave();
      else this.drawRain();
    }

    loop() {
      const tick = () => {
        this.draw();
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }
  }

  class ASCIITypewriter {
    constructor(element, text, options = {}) {
      if (!element) return;
      this.el = element;
      this.text = text;
      this.speed = options.speed || 40;
      this.cursor = options.cursor !== false;
      this.scramble = options.scramble !== false && !reduceMotion;
      this.chars = "01<>{}[]|/\\-+=@#%";
      if (reduceMotion) {
        this.el.textContent = text;
        return;
      }
      this.run();
    }

    async run() {
      this.el.textContent = "";
      if (this.cursor) this.el.classList.add("typing-cursor");
      for (let index = 0; index <= this.text.length; index += 1) {
        if (this.scramble && index < this.text.length) {
          let loop = 0;
          await new Promise((resolve) => {
            const interval = setInterval(() => {
              const scrambled =
                this.text.slice(0, index) +
                Array.from({ length: Math.min(3, this.text.length - index) }, () =>
                  this.chars[Math.floor(Math.random() * this.chars.length)]
                ).join("");
              this.el.textContent = scrambled;
              loop += 1;
              if (loop >= 3) {
                clearInterval(interval);
                resolve();
              }
            }, 30);
          });
        }
        this.el.textContent = this.text.slice(0, index);
        await new Promise((resolve) => window.setTimeout(resolve, this.speed));
      }
      if (this.cursor) this.el.classList.remove("typing-cursor");
    }
  }

  window.ASCIICanvas = ASCIICanvas;
  window.ASCIITypewriter = ASCIITypewriter;
  window.__asciiReduceMotion = reduceMotion;
})();
