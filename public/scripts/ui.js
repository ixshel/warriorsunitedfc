// Mobile menu toggle + aria-expanded
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.setAttribute(
      'aria-expanded',
      navLinks.classList.contains('active')
    );
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navLinks.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ----- Page navigation (SPA-style) -----

const pages = {
  home: document.getElementById("homePage"),
  contact: document.getElementById("contactPage"),
  // add these if/when you create them:
  about: document.getElementById("aboutPage"),
  academy: document.getElementById("academyPage"),
  teams: document.getElementById("teamsPage"),
  news: document.getElementById("newsPage")
};

function showPage(pageName) {
  // hide all
  Object.values(pages).forEach((page) => {
    if (page) page.classList.add("hidden");
  });

  // show requested or fallback to home
  const target = pages[pageName] || pages.home;
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // close mobile nav if open
  if (navLinks) {
    navLinks.classList.remove("active");
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }
}

// hook nav links
if (navLinks) {
  navLinks.querySelectorAll("a[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      showPage(page);
    });
  });
}

// expose if you ever want to call it inline
window.showPage = showPage;


// Modal
const modal = document.getElementById('registrationModal');

function openModal() {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

if (modal) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Expose for inline HTML handlers
window.openModal = openModal;
window.closeModal = closeModal;

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}