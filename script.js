const revealNodes = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => {
        entry.target.classList.add("in-view");
      }, delay);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      if (!id) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
      });
    });
  },
  {
    threshold: 0.5,
    rootMargin: "-25% 0px -35% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const cadEmbeds = document.querySelectorAll(".cad-embed");

cadEmbeds.forEach((frame) => {
  const src = (frame.dataset.src || "").trim();
  if (!src) {
    frame.srcdoc = `
      <style>
        html, body {
          margin: 0;
          width: 100%;
          height: 100%;
          background: #0f1114;
          color: #c9c9c9;
          font-family: "IBM Plex Mono", monospace;
        }
        body {
          display: grid;
          place-items: center;
          text-align: center;
          padding: 1rem;
          box-sizing: border-box;
        }
        p {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.5;
        }
        code {
          color: #ff796f;
        }
      </style>
      <p>Add an embed URL in <code>data-src</code><br>to render this CAD preview.</p>
    `;
    return;
  }

  frame.src = src;
});
