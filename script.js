// ---------- Mobile rail toggle ----------
const navToggle = document.querySelector('[data-nav-toggle]');
const rail = document.querySelector('.rail');

if (navToggle && rail) {
  navToggle.addEventListener('click', () => {
    const isOpen = rail.classList.toggle('mobile-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.textContent = isOpen ? 'close' : 'menu';
  });

  rail.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      rail.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.textContent = 'menu';
    });
  });
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ---------- Contact form validation ----------
const form = document.querySelector('.contact-form');

if (form) {
  const status = form.querySelector('.form-status');

  const validators = {
    name: (v) => v.trim().length > 0 || 'Enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email.',
    message: (v) => v.trim().length >= 10 || 'Message needs at least 10 characters.',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(validators).forEach((fieldName) => {
      const field = form.elements[fieldName];
      const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
      const result = validators[fieldName](field.value);

      if (result !== true) {
        valid = false;
        if (errorEl) errorEl.textContent = result;
      } else if (errorEl) {
        errorEl.textContent = '';
      }
    });

    if (valid) {
      status.textContent = 'Message ready — connect this form to your backend or a service like Formspree to send it.';
      form.reset();
    } else {
      status.textContent = '';
    }
  });
}
