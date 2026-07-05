(function () {
  'use strict';

  /* ── Full-screen drawer menu ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openMenu() {
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('is-open');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('is-open');
    navOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    if (navOverlay.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle && navOverlay) {
    navToggle.addEventListener('click', toggleMenu);

    drawerLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navOverlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ── Scroll reveal ── */
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

  /* ── Metric counters ── */
  const metricEls = document.querySelectorAll('.metric-val[data-count]');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = decimals > 0
        ? current.toFixed(decimals)
        : Math.floor(current).toString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : String(target);
      }
    }

    requestAnimationFrame(tick);
  }

  if (metricEls.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    metricEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ── Live tracker km countdown ── */
  const liveKm = document.querySelector('[data-live="847"]');

  if (liveKm) {
    let km = 847;

    setInterval(function () {
      if (km > 820) {
        km -= Math.floor(Math.random() * 3) + 1;
        liveKm.textContent = km;
      }
    }, 8000);
  }

  /* ── Quote calculator ── */
  const quoteForm = document.querySelector('.quote-form');
  const quoteResult = document.querySelector('.quote-result-value');

  if (quoteForm && quoteResult) {
    const weightInput = quoteForm.querySelector('[name="weight"]');
    const originInput = quoteForm.querySelector('[name="origin"]');
    const destInput = quoteForm.querySelector('[name="destination"]');

    function calculateQuote() {
      const weight = parseFloat(weightInput.value) || 0;
      const origin = originInput.value.trim();
      const dest = destInput.value.trim();

      if (weight <= 0 || !origin || !dest) {
        quoteResult.textContent = '—';
        return;
      }

      const baseRate = 0.85;
      const distanceFactor = 1 + (origin.length + dest.length) * 0.02;
      const total = weight * baseRate * distanceFactor;

      quoteResult.textContent = '€' + total.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }

    [weightInput, originInput, destInput].forEach(function (input) {
      if (input) {
        input.addEventListener('input', calculateQuote);
      }
    });

    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      calculateQuote();

      const btn = quoteForm.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Quote Calculated ✓';
      btn.style.background = '#4ade80';

      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
      }, 2500);
    });
  }

  /* ── Fleet carousel drag scroll ── */
  const fleetScroll = document.querySelector('.fleet-scroll');

  if (fleetScroll) {
    let isDown = false;
    let startX;
    let scrollLeft;

    fleetScroll.addEventListener('mousedown', function (e) {
      isDown = true;
      fleetScroll.style.cursor = 'grabbing';
      startX = e.pageX - fleetScroll.offsetLeft;
      scrollLeft = fleetScroll.scrollLeft;
    });

    fleetScroll.addEventListener('mouseleave', function () {
      isDown = false;
      fleetScroll.style.cursor = '';
    });

    fleetScroll.addEventListener('mouseup', function () {
      isDown = false;
      fleetScroll.style.cursor = '';
    });

    fleetScroll.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - fleetScroll.offsetLeft;
      const walk = (x - startX) * 1.5;
      fleetScroll.scrollLeft = scrollLeft - walk;
    });
  }

  /* ── Smooth anchor scroll offset for fixed header ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ticker-h'), 10)
        + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10);

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
