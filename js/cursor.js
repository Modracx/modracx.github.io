(function () {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring || isTouch || reduceMotion) {
    document.body.classList.add("cursor-disabled");
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
    return;
  }

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;
  let scale = 1;

  document.addEventListener("mousemove", (event) => {
    mx = event.clientX;
    my = event.clientY;
  });

  document.querySelectorAll("a, button, input, textarea, select, summary").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      scale = 1.6;
      ring.classList.add("active");
    });
    element.addEventListener("mouseleave", () => {
      scale = 1;
      ring.classList.remove("active");
    });
  });

  const tick = () => {
    dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px) scale(${scale})`;
    window.requestAnimationFrame(tick);
  };

  tick();
})();
