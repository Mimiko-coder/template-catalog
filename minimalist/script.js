(function () {
  'use strict';

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── Service accordion ── */
  const serviceRows = document.querySelectorAll('.service-row');

  function closeRow(row) {
    const trigger = row.querySelector('.service-trigger');
    row.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function openRow(row) {
    const trigger = row.querySelector('.service-trigger');
    row.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  serviceRows.forEach((row) => {
    const trigger = row.querySelector('.service-trigger');

    trigger.addEventListener('click', () => {
      const isOpen = row.classList.contains('is-open');

      serviceRows.forEach((other) => {
        if (other !== row) closeRow(other);
      });

      if (isOpen) {
        closeRow(row);
      } else {
        openRow(row);
      }
    });
  });

  /* ── Bottom pill nav: active section tracking ── */
  const navLinks = document.querySelectorAll('.pill-links a[data-nav]');
  const sections = Array.from(navLinks).map((link) => ({
    id: link.getAttribute('href').slice(1),
    link,
  }));

  function setActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    let current = sections[0].id;

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ── Smooth scroll with bottom nav offset ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-offset'),
        10
      ) || 88;
      const top = target.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });

  /* ── Contact form ── */
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message sent — thank you!';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 3000);
  });

})();
