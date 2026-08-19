(() => {
  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const viewMoreBtn = document.getElementById("viewMoreExp");
  const expMore = document.getElementById("expMore");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Sticky header state */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav */
  const setNavOpen = (open) => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
  };

  const closeNav = () => setNavOpen(false);

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!open);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (!navLinks.contains(target) && !navToggle.contains(target)) {
        closeNav();
      }
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 860) closeNav();
      },
      { passive: true }
    );
  }

  /* Active nav link on scroll */
  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];

  const setActiveLink = () => {
    const y = window.scrollY + 120;
    let current = "";
    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }
    navAnchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("active", href === `#${current}`);
    });
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* Experience: view more / less */
  if (viewMoreBtn && expMore) {
    viewMoreBtn.addEventListener("click", () => {
      const expanded = viewMoreBtn.getAttribute("aria-expanded") === "true";
      const next = !expanded;
      viewMoreBtn.setAttribute("aria-expanded", String(next));
      expMore.hidden = !next;
      viewMoreBtn.textContent = next ? "Show less" : "View more experience";

      if (next) {
        expMore.querySelectorAll(".exp-card").forEach((card) => {
          card.classList.add("reveal", "visible");
        });
      }
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* Background particles + subtle pointer parallax */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particlesRoot = document.getElementById("bgParticles");

  if (particlesRoot && !reduceMotion) {
    const count = window.matchMedia("(max-width: 760px)").matches ? 18 : 36;
    const colors = ["", "teal", "blue"];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("span");
      const size = 1.5 + Math.random() * 2.8;
      const left = Math.random() * 100;
      const delay = Math.random() * 18;
      const duration = 12 + Math.random() * 18;
      const drift = `${(Math.random() * 80 - 40).toFixed(1)}px`;
      const opacity = (0.25 + Math.random() * 0.5).toFixed(2);
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.className = `particle${color ? ` ${color}` : ""}`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${left}%`;
      p.style.bottom = `${-10 - Math.random() * 20}%`;
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${delay}s`;
      p.style.setProperty("--p-drift", drift);
      p.style.setProperty("--p-opacity", opacity);
      frag.appendChild(p);
    }

    particlesRoot.appendChild(frag);
  }

  /* Pointer parallax for desktop */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-pointer");
    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const applyParallax = () => {
      raf = 0;
      document.documentElement.style.setProperty("--mx", targetX.toFixed(3));
      document.documentElement.style.setProperty("--my", targetY.toFixed(3));
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        targetX = Math.max(-1, Math.min(1, x));
        targetY = Math.max(-1, Math.min(1, y));
        if (!raf) raf = requestAnimationFrame(applyParallax);
      },
      { passive: true }
    );
  }
})();
