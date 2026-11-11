const logo = document.querySelector(".hero-logo");

function updateLogo() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const mobile = w < 600;

  const progress = Math.min(window.scrollY / (h * 0.6), 1);

  const startSize = Math.min(w * 0.6, 360);
  const endSize = mobile ? 64 : 96;
  const size = startSize + (endSize - startSize) * progress;

  const startX = (w - startSize) / 2;
  const startY = (h - startSize) / 2;
  const endPos = mobile ? 16 : 24;

  logo.style.width = size + "px";
  logo.style.left = startX + (endPos - startX) * progress + "px";
  logo.style.top = startY + (endPos - startY) * progress + "px";

  const hide = w < 800 && window.scrollY > h * 0.9;
  logo.style.opacity = hide ? 0 : 1;
  logo.style.pointerEvents = hide ? "none" : "auto";
}

window.addEventListener("scroll", updateLogo);
window.addEventListener("resize", updateLogo);
updateLogo();

const slides = document.querySelector(".slides");

if (slides) {
  const width = () => slides.clientWidth;

  document.querySelector(".next").addEventListener("click", () => {
    const atEnd = slides.scrollLeft + width() >= slides.scrollWidth - 1;
    slides.scrollTo({ left: atEnd ? 0 : slides.scrollLeft + width(), behavior: "smooth" });
  });

  document.querySelector(".prev").addEventListener("click", () => {
    const atStart = slides.scrollLeft <= 0;
    slides.scrollTo({ left: atStart ? slides.scrollWidth : slides.scrollLeft - width(), behavior: "smooth" });
  });
}




if (window.lucide) lucide.createIcons();

const dotsBox = document.querySelector(".dots");

if (slides && dotsBox) {
  const count = slides.children.length;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", () => {
      slides.scrollTo({ left: i * slides.clientWidth, behavior: "smooth" });
    });
    dotsBox.appendChild(dot);
  }

  const updateDots = () => {
    const index = Math.round(slides.scrollLeft / slides.clientWidth);
    dotsBox.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === index));
  };

  slides.addEventListener("scroll", updateDots, { passive: true });
  updateDots();
}


const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + "s";
  revealObserver.observe(el);
});

const nav = document.querySelector(".nav");
const navToggle = document.getElementById("nav-toggle");

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

const whatSection = document.querySelector(".what");
const board = document.querySelector(".journal");

function updateNav() {
  const sectionTop = whatSection.getBoundingClientRect().top;
  const boardTop = board.getBoundingClientRect().top;
  const navBottom = nav.getBoundingClientRect().bottom + 16;

  const reachedSection = sectionTop <= 1;
  const boardBelowNav = boardTop > navBottom;
  const show = reachedSection && boardBelowNav;

  nav.classList.toggle("show", show);
  if (!show) nav.classList.remove("open");
}

if (nav && whatSection && board) {
  window.addEventListener("scroll", updateNav, { passive: true });
  window.addEventListener("resize", updateNav);
  updateNav();
}


document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();

    const insideBoard = target.closest(".journal");
    const offset = insideBoard ? 110 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  });
});