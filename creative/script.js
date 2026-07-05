(function () {
  'use strict';

  /* ---- Custom Cursor ---- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  if (dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll(
      'a, button, input, textarea, .work-tile, .menu-trigger'
    );
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  /* ---- Full-Screen Menu ---- */
  const menuTrigger = document.querySelector('.menu-trigger');
  const fullscreenMenu = document.getElementById('fullscreenMenu');
  const menuLinks = document.querySelectorAll('.menu-link');

  function openMenu() {
    menuTrigger.setAttribute('aria-expanded', 'true');
    fullscreenMenu.classList.add('is-open');
    fullscreenMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    menuTrigger.setAttribute('aria-expanded', 'false');
    fullscreenMenu.classList.remove('is-open');
    fullscreenMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    if (menuTrigger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuTrigger && fullscreenMenu) {
    menuTrigger.addEventListener('click', toggleMenu);

    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && fullscreenMenu.classList.contains('is-open')) {
        closeMenu();
        menuTrigger.focus();
      }
    });
  }

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (contactForm && formMsg) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      formMsg.classList.remove('success', 'error');
      formMsg.textContent = '';

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formMsg.textContent = 'Fill in all fields.';
        formMsg.classList.add('error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        formMsg.textContent = 'Enter a valid email.';
        formMsg.classList.add('error');
        return;
      }

      formMsg.textContent = 'Message sent. We\'ll be in touch.';
      formMsg.classList.add('success');
      contactForm.reset();
    });
  }

  /* ---- Stagger work tiles on reveal ---- */
  const workTiles = document.querySelectorAll('.work-tile.reveal');
  workTiles.forEach(function (tile, i) {
    tile.style.transitionDelay = i * 0.1 + 's';
  });
})();
