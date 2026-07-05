document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle?.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Scroll reveal + counter animation
  const animated = new Set();

  const animateCounter = (el) => {
    if (animated.has(el)) return;
    animated.add(el);

    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(step);
    };

    if (prefersReducedMotion) {
      el.textContent = decimals ? target.toFixed(decimals) : target;
    } else {
      requestAnimationFrame(step);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.metric-val[data-count]').forEach(animateCounter);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  document.querySelector('.metrics-strip')?.querySelectorAll('.metric').forEach((el) => observer.observe(el));

  // Live tracker km tick
  const liveKm = document.querySelector('[data-live]');
  if (liveKm && !prefersReducedMotion) {
    setInterval(() => {
      const val = parseInt(liveKm.dataset.live, 10);
      const next = Math.max(val - Math.floor(Math.random() * 3), 820);
      liveKm.dataset.live = next;
      liveKm.textContent = next;
    }, 4000);
  }

  // Quote calculator
  const form = document.querySelector('.quote-form');
  const resultEl = document.querySelector('.quote-result-value');
  const weightInput = form?.querySelector('[name="weight"]');

  const estimateRate = () => {
    const weight = parseFloat(weightInput?.value);
    if (!weight || weight <= 0) {
      resultEl.textContent = '—';
      return;
    }
    const base = 120;
    const perKg = 0.18;
    const estimate = base + weight * perKg;
    resultEl.textContent = `€${estimate.toFixed(0)}`;
  };

  weightInput?.addEventListener('input', estimateRate);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    estimateRate();
    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Request Sent ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      form.reset();
      resultEl.textContent = '—';
    }, 2800);
  });

  // Header scroll shadow
  const header = document.querySelector('.top-bar');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
});
