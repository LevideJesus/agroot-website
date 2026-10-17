const logo = document.querySelector(".hero-logo");

function updateLogo() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const mobile = w < 600;

  const progress = Math.min(window.scrollY / (h * 0.6), 1);

  const startSize = Math.min(w * 0.6, 360);
  const endSize = mobile ? 90 : 140;
  const size = startSize + (endSize - startSize) * progress;

  const startX = (w - startSize) / 2;
  const startY = (h - startSize) / 2;
  const endPos = mobile ? 16 : 24;

  logo.style.width = size + "px";
  logo.style.left = startX + (endPos - startX) * progress + "px";
  logo.style.top = startY + (endPos - startY) * progress + "px";
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