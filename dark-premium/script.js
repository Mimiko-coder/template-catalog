document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('scroll-container');
  const dots = document.querySelectorAll('.rail-dot');
  const panels = document.querySelectorAll('.panel');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const chapterCurrent = document.getElementById('chapter-current');
  const isMobile = () => window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let wheelLocked = false;
  let wheelTimeout;

  function panelWidth() {
    if (isMobile()) return window.innerWidth;
    return window.innerWidth - 72;
  }

  function navigateToPanel(index) {
    const clamped = Math.max(0, Math.min(index, panels.length - 1));

    if (isMobile()) {
      panels[clamped]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    scroll.scrollTo({ left: clamped * panelWidth(), behavior: 'smooth' });
  }

  function updateDots(activeIndex) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
      dot.setAttribute('aria-selected', i === activeIndex);
    });

    if (chapterCurrent) {
      chapterCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
    }
  }

  function onScroll() {
    if (isMobile()) {
      let activeIndex = 0;
      panels.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) activeIndex = i;
      });
      updateDots(activeIndex);
      panels.forEach((panel, i) => panel.classList.toggle('in-view', i === activeIndex));
      return;
    }

    const index = Math.round(scroll.scrollLeft / panelWidth());
    const clamped = Math.max(0, Math.min(index, panels.length - 1));
    updateDots(clamped);

    const maxScroll = scroll.scrollWidth - panelWidth();
    const progress = maxScroll > 0 ? scroll.scrollLeft / maxScroll : 0;
    if (progressBar) progressBar.style.width = `${progress * 100}%`;

    panels.forEach((panel, i) => panel.classList.toggle('in-view', i === clamped));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      navigateToPanel(parseInt(dot.dataset.panel, 10));
    });
  });

  scroll?.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    handleResize();
    onScroll();
  }, { passive: true });

  onScroll();
  panels[0]?.classList.add('in-view');

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
          const current = Math.round(scroll.scrollLeft / panelWidth());
          const next = Math.max(0, Math.min(current + direction, panels.length - 1));

          wheelLocked = true;
          scroll.scrollTo({ left: next * panelWidth(), behavior: 'smooth' });
          setTimeout(() => { wheelLocked = false; }, 850);
        }, 40);
      }
    }, { passive: false });
  }

  document.addEventListener('keydown', (e) => {
    if (isMobile()) return;

    const current = Math.round(scroll.scrollLeft / panelWidth());

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      navigateToPanel(current + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      navigateToPanel(current - 1);
    }
  });

  const portItems = document.querySelectorAll('.port-item');
  const prevBtn = document.querySelector('.port-prev');
  const nextBtn = document.querySelector('.port-next');
  let currentPort = 0;

  function showPort(index) {
    currentPort = (index + portItems.length) % portItems.length;
    portItems.forEach((item, i) => {
      item.classList.toggle('port-item--active', i === currentPort);
    });
  }

  prevBtn?.addEventListener('click', () => showPort(currentPort - 1));
  nextBtn?.addEventListener('click', () => showPort(currentPort + 1));

  let portInterval;
  const portPanel = document.querySelector('.panel-portfolio');

  const portObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !prefersReducedMotion) {
          clearInterval(portInterval);
          portInterval = setInterval(() => showPort(currentPort + 1), 5500);
        } else {
          clearInterval(portInterval);
        }
      });
    },
    { threshold: 0.45 }
  );

  if (portPanel) portObserver.observe(portPanel);

  function handleResize() {
    document.body.classList.toggle('mobile-stack', isMobile());
  }

  handleResize();
});
