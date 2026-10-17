const slides = document.querySelector(".slides");
const width = () => slides.clientWidth;

document.querySelector(".next").addEventListener("click", () => {
  const atEnd = slides.scrollLeft + width() >= slides.scrollWidth - 1;
  slides.scrollTo({ left: atEnd ? 0 : slides.scrollLeft + width(), behavior: "smooth" });
});

document.querySelector(".prev").addEventListener("click", () => {
  const atStart = slides.scrollLeft <= 0;
  slides.scrollTo({ left: atStart ? slides.scrollWidth : slides.scrollLeft - width(), behavior: "smooth" });
});