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



const WEB3FORMS_KEY = "0cfbbf8c-ef5e-4da4-9d01-bf5ac6e14df9";

const letterForm = document.getElementById("letter-form");

if (letterForm) {
  const ideia = document.getElementById("ideia");
  const board = document.querySelector(".ideia-board");
  const envelope = document.getElementById("envelope");
  const msg = document.getElementById("letter-msg");
  const nameInput = document.getElementById("letter-name");
  const contact = document.getElementById("letter-contact");
  const error = document.getElementById("letter-error");
  const btn = document.getElementById("letter-btn");
  const note = document.getElementById("mail-note");
  const LINE = 38;
  const MIN_LINES = 5;
  const defaultNote = note.innerHTML;

  
  function growMessage() {
    msg.style.height = "auto";
    const lines = Math.max(MIN_LINES, Math.ceil(msg.scrollHeight / LINE));
    msg.style.height = lines * LINE + "px";
  }
  msg.addEventListener("input", growMessage);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  
  function measureCenter() {
    const b = board.getBoundingClientRect();
    const e = envelope.getBoundingClientRect();
    envelope.style.setProperty("--cx", (b.left + b.width / 2) - (e.left + e.width / 2) + "px");
    envelope.style.setProperty("--cy", (b.top + b.height / 2) - (e.top + e.height / 2) + "px");
  }

 
  function sendLetter() {
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: "Nova carta para a Agroot - " + nameInput.value.trim(),
        from_name: "Site Agroot",
        nome: nameInput.value.trim(),
        contato: contact.value.trim(),
        mensagem: "Agroot,\n\n" + msg.value.trim() +
          "\n\nAtenciosamente,\n" + nameInput.value.trim() + " · " + contact.value.trim()
      })
    })
      .then((res) => res.json())
      .then((data) => data.success === true)
      .catch(() => false);
  }

  letterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!msg.value.trim() || !nameInput.value.trim() || !contact.value.trim()) {
      error.textContent = "Escreva a sua ideia, o seu nome e um contato.";
      return;
    }
    error.textContent = "";
    btn.disabled = true;

    const sending = sendLetter();

   
    ideia.classList.add("sending");
    await wait(650);
  
    ideia.classList.add("sealed");
    await wait(350);
    
    measureCenter();
    ideia.classList.add("centering");
    await wait(650);
  
    ideia.classList.add("stamped");
    await wait(800);
    
    ideia.classList.add("flying");
    await wait(750);

    const ok = await sending;

    
    if (ok) letterForm.reset();
    growMessage();
    ideia.classList.remove("sending", "sealed", "centering", "stamped", "flying");
    ideia.classList.add("returning");
    note.textContent = ok
      ? "Carta enviada! Vamos ler com carinho e responder em breve."
      : "Não foi possível enviar agora. Verifique a internet e tente de novo.";
    await wait(800);
    ideia.classList.remove("returning");
    btn.disabled = false;
    setTimeout(() => { note.innerHTML = defaultNote; }, 6000);
  });
}

