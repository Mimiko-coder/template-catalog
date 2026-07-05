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

  /* ── Active nav on scroll ── */
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section[id], .trust-strip');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id || 'dashboard';
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  );

  document.querySelectorAll('#dashboard, #about, #capabilities, #projects, #team, #contact').forEach(sec => {
    sectionObserver.observe(sec);
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  /* ── Fade-up reveals ── */
  const fadeEls = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ── KPI counter animation ── */
  const kpiCounters = document.querySelectorAll('[data-count]');

  const kpiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
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
    { threshold: 0.5 }
  );

  kpiCounters.forEach(el => kpiObserver.observe(el));

  /* ── Animated bar chart ── */
  const barChart = document.getElementById('barChart');
  const bars = barChart.querySelectorAll('.bar');

  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        bars.forEach((bar, i) => {
          const h = bar.dataset.height;
          bar.style.setProperty('--target-h', h);
          setTimeout(() => bar.classList.add('animated'), i * 60);
        });
        chartObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  chartObserver.observe(barChart);

  /* ── Progress bar animation ── */
  const progressBars = document.querySelectorAll('.progress-fill');

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
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
    { threshold: 0.5 }
  );

  progressBars.forEach(bar => progressObserver.observe(bar));

  /* ── Inquiry form ── */
  const form = document.getElementById('inquiryForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Inquiry submitted — we\'ll be in touch';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 3500);
  });

  /* ── Smooth scroll with offset ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth <= 900 ? 56 : 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Close sidebar on resize ── */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeSidebar();
  });
})();
