(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const toggle = nav.querySelector(".nav-toggle");
  const links = nav.querySelector(".nav-links");

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    const current = window.location.pathname.replace(/\/$/, "") || "/";
    const target = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "");
    if (current === target || (current === "/" && target === "/")) {
      link.classList.add("active");
    }
  });

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
