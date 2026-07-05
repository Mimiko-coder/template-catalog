(function () {
  'use strict';

  /* ── Sidebar mobile toggle ── */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  /* ── Live timestamp ── */
  const timestampEl = document.getElementById('liveTimestamp');

  function updateTimestamp() {
    const now = new Date();
    const formatted = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    timestampEl.textContent = 'Updated — ' + formatted;
  }

  updateTimestamp();
  setInterval(updateTimestamp, 60000);

  /* ── Active nav on scroll ── */
  const navItems = document.querySelectorAll('.nav-item');
  const observedSections = document.querySelectorAll(
    '#dashboard, #projects, #team, #capabilities, #trust, #about, #contact'
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navItems.forEach((item) => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      });
    },
    { rootMargin: '-18% 0px -55% 0px', threshold: 0 }
  );

  observedSections.forEach((sec) => sectionObserver.observe(sec));

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  /* ── Fade-up reveals ── */
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
  );

  fadeEls.forEach((el) => fadeObserver.observe(el));

  /* ── KPI counter animation ── */
  const kpiCounters = document.querySelectorAll('[data-count]');

  const kpiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        kpiObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  kpiCounters.forEach((el) => kpiObserver.observe(el));

  /* ── Mini bar charts in KPI tiles ── */
  const miniCharts = document.querySelectorAll('.mini-chart');

  const miniObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bars = entry.target.querySelectorAll('.mini-bar');
        bars.forEach((bar, i) => {
          const h = bar.dataset.h;
          bar.style.setProperty('--bar-h', h);
          setTimeout(() => bar.classList.add('animated'), i * 40);
        });
        miniObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  miniCharts.forEach((chart) => miniObserver.observe(chart));

  /* ── Main bar chart ── */
  const barChart = document.getElementById('barChart');
  const bars = barChart.querySelectorAll('.bar');

  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        bars.forEach((bar, i) => {
          bar.style.setProperty('--target-h', bar.dataset.height);
          setTimeout(() => bar.classList.add('animated'), i * 55);
        });
        chartObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  chartObserver.observe(barChart);

  /* ── Utilization bars ── */
  const utilFills = document.querySelectorAll('.util-fill');

  const utilObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fill = entry.target;
        const width = fill.dataset.width + '%';
        fill.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fill.style.width = width;
          });
        });
        utilObserver.unobserve(fill);
      });
    },
    { threshold: 0.4 }
  );

  utilFills.forEach((fill) => utilObserver.observe(fill));

  /* ── Area chart (About) ── */
  const areaChart = document.getElementById('areaChart');
  const areaBars = areaChart.querySelectorAll('.area-bar');

  const areaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        areaBars.forEach((bar, i) => {
          bar.style.setProperty('--area-h', bar.dataset.height);
          setTimeout(() => bar.classList.add('animated'), i * 80);
        });
        areaObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  areaObserver.observe(areaChart);

  /* ── Table progress bars ── */
  const progressBars = document.querySelectorAll('.progress-fill');

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.width = width;
          });
        });
        progressObserver.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));

  /* ── Inquiry form ── */
  const form = document.getElementById('inquiryForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Inquiry submitted — we\u2019ll be in touch';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 3500);
  });

  /* ── Smooth scroll with offset ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth <= 900 ? 56 : 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Close sidebar on resize ── */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeSidebar();
  });
})();
