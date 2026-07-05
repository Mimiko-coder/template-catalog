document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('scroll-container');
  const dots = document.querySelectorAll('.film-dots button');
  const panels = document.querySelectorAll('.panel');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const isMobile = () => window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let wheelLocked = false;
  let wheelTimeout;

  // ── Panel navigation via dots ──
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.panel, 10);
      navigateToPanel(index);
    });
  });

  function navigateToPanel(index) {
    if (isMobile()) {
      panels[index]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    scroll.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' });
  }

  // ── Update active dot + progress on scroll ──
  function onScroll() {
    if (isMobile()) {
      let activeIndex = 0;
      panels.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) activeIndex = i;
      });
      updateDots(activeIndex);
      return;
    }

    const index = Math.round(scroll.scrollLeft / window.innerWidth);
    const clamped = Math.max(0, Math.min(index, panels.length - 1));
    updateDots(clamped);

    const progress = scroll.scrollLeft / (scroll.scrollWidth - window.innerWidth);
    if (progressBar) progressBar.style.width = `${progress * 100}%`;

    panels.forEach((panel, i) => {
      panel.classList.toggle('in-view', i === clamped);
    });
  }

  function updateDots(activeIndex) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
      dot.setAttribute('aria-selected', i === activeIndex);
    });
  }

  scroll?.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Wheel → horizontal scroll (desktop only) ──
  if (!prefersReducedMotion) {
    document.addEventListener('wheel', (e) => {
      if (isMobile()) return;

      const absY = Math.abs(e.deltaY);
      const absX = Math.abs(e.deltaX);

      if (absY > absX) {
        e.preventDefault();

        if (wheelLocked) return;

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          const direction = e.deltaY > 0 ? 1 : -1;
          const current = Math.round(scroll.scrollLeft / window.innerWidth);
          const next = Math.max(0, Math.min(current + direction, panels.length - 1));

          wheelLocked = true;
          scroll.scrollTo({ left: next * window.innerWidth, behavior: 'smooth' });

          setTimeout(() => { wheelLocked = false; }, 800);
        }, 50);
      }
    }, { passive: false });
  }

  // ── Keyboard navigation ──
  document.addEventListener('keydown', (e) => {
    if (isMobile()) return;

    const current = Math.round(scroll.scrollLeft / window.innerWidth);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      navigateToPanel(Math.min(current + 1, panels.length - 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      navigateToPanel(Math.max(current - 1, 0));
    }
  });

  // ── Portfolio slide stack ──
  const slides = document.querySelectorAll('.port-slide');
  const prevBtn = document.querySelector('.port-prev');
  const nextBtn = document.querySelector('.port-next');
  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('port-slide--active', i === currentSlide);
    });
  }

  prevBtn?.addEventListener('click', () => showSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => showSlide(currentSlide + 1));

  // Auto-advance portfolio when panel is in view
  let portInterval;
  const portObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !prefersReducedMotion) {
          clearInterval(portInterval);
          portInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
        } else {
          clearInterval(portInterval);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelector('.panel-portfolio') &&
    portObserver.observe(document.querySelector('.panel-portfolio'));

  // ── Mobile body class ──
  function handleResize() {
    document.body.classList.toggle('mobile-stack', isMobile());
  }

  window.addEventListener('resize', handleResize, { passive: true });
  handleResize();

  // ── Film CTA smooth scroll ──
  document.querySelector('.film-cta')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToPanel(panels.length - 1);
  });
});
