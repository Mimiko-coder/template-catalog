document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const segmentTrack = document.querySelector('.segment-track');
  const segmentIndicator = document.querySelector('.segment-indicator');
  const segmentTabs = document.querySelectorAll('.segment-tab');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  /* ── Header scroll shadow ── */
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ── Segmented nav indicator ── */
  function moveIndicator(tab) {
    if (!segmentIndicator || !tab || !segmentTrack) return;
    const trackRect = segmentTrack.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    segmentIndicator.style.width = `${tabRect.width}px`;
    segmentIndicator.style.transform = `translateX(${tabRect.left - trackRect.left - 4}px)`;
  }

  function setActiveTab(sectionId) {
    segmentTabs.forEach((tab) => {
      const isActive = tab.dataset.section === sectionId;
      tab.classList.toggle('active', isActive);
      if (isActive) moveIndicator(tab);
    });
  }

  segmentTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setActiveTab(tab.dataset.section);
      mobileNav?.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      mobileNav?.setAttribute('aria-hidden', 'true');
    });
  });

  window.addEventListener('resize', () => {
    const active = document.querySelector('.segment-tab.active');
    if (active) moveIndicator(active);
  });

  requestAnimationFrame(() => {
    const active = document.querySelector('.segment-tab.active');
    if (active) moveIndicator(active);
  });

  /* ── Active tab on scroll ── */
  const sectionMap = {
    product: document.getElementById('product'),
    pricing: document.getElementById('pricing'),
    integrations: document.getElementById('integrations'),
    signup: document.getElementById('signup')
  };

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
  );

  Object.values(sectionMap).forEach((section) => {
    if (section) scrollObserver.observe(section);
  });

  /* ── Mobile nav toggle ── */
  navToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav?.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── CLI signup form ── */
  document.querySelector('.cli-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (!input?.value) return;

    const btn = e.target.querySelector('button');
    const original = btn.textContent;
    btn.textContent = '✓';
    btn.style.background = 'var(--green-dim)';
    btn.style.color = 'var(--green)';

    setTimeout(() => {
      alert(`Welcome to Flowbase! Check ${input.value} to get started.`);
      input.value = '';
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
    }, 600);
  });

  /* ── Pricing column hover sync (subtle) ── */
  document.querySelectorAll('.pricing-col').forEach((col) => {
    col.addEventListener('mouseenter', () => {
      document.querySelectorAll('.pricing-col').forEach((c) => {
        if (c !== col) c.style.opacity = '0.7';
      });
    });
    col.addEventListener('mouseleave', () => {
      document.querySelectorAll('.pricing-col').forEach((c) => {
        c.style.opacity = '';
      });
    });
  });
});
