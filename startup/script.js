document.addEventListener('DOMContentLoaded', () => {
  /* ── Sidebar toggle ── */
  const sidebar = document.querySelector('.docs-sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.sidebar-overlay');

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('visible');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('visible');
    toggle?.setAttribute('aria-expanded', 'true');
  }

  toggle?.addEventListener('click', () => {
    if (sidebar?.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay?.addEventListener('click', closeSidebar);

  document.querySelectorAll('.docs-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  /* ── Active nav on scroll ── */
  const sections = document.querySelectorAll('.docs-section, .terminal-hero');
  const navLinks = document.querySelectorAll('.docs-nav a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach((section) => {
    if (section.id) navObserver.observe(section);
  });

  /* ── Terminal typing effect ── */
  const terminal = document.getElementById('terminal-output');
  const typedCmd = document.querySelector('.typed-cmd');

  const sequence = [
    { type: 'cmd', text: 'flowbase init my-project', delay: 80 },
    { type: 'pause', delay: 400 },
    { type: 'output', text: '✓ Workspace created', class: 'success', delay: 60 },
    { type: 'output', text: '✓ AI assistant connected', class: 'success', delay: 60 },
    { type: 'output', text: '✓ Modules: meetings, email, tasks, analytics', class: 'success', delay: 60 },
    { type: 'output', text: '→ Dashboard ready at localhost:3000', class: 'dim', delay: 60 },
    { type: 'pause', delay: 800 },
    { type: 'newline', delay: 200 },
    { type: 'cmd', text: 'flowbase deploy --prod', delay: 70 },
    { type: 'pause', delay: 500 },
    { type: 'output', text: '✓ Deployed to production', class: 'success', delay: 60 },
    { type: 'output', text: '→ https://my-project.flowbase.dev', class: 'dim', delay: 60 },
    { type: 'pause', delay: 1200 },
    { type: 'reset', delay: 600 }
  ];

  let seqIndex = 0;
  let charIndex = 0;
  let currentLine = null;

  function typeNext() {
    if (seqIndex >= sequence.length) {
      seqIndex = 0;
      charIndex = 0;
    }

    const step = sequence[seqIndex];

    if (step.type === 'reset') {
      terminal.innerHTML = '<p class="term-line"><span class="prompt">$</span> <span class="typed-cmd"></span><span class="cursor-blink">▋</span></p>';
      seqIndex++;
      setTimeout(typeNext, step.delay);
      return;
    }

    if (step.type === 'pause') {
      seqIndex++;
      setTimeout(typeNext, step.delay);
      return;
    }

    if (step.type === 'newline') {
      const line = document.createElement('p');
      line.className = 'term-line';
      line.innerHTML = '<span class="prompt">$</span> <span class="typed-cmd"></span><span class="cursor-blink">▋</span>';
      terminal.appendChild(line);
      currentLine = line.querySelector('.typed-cmd');
      seqIndex++;
      setTimeout(typeNext, step.delay);
      return;
    }

    if (step.type === 'cmd') {
      if (!currentLine) {
        currentLine = document.querySelector('.typed-cmd');
      }
      if (charIndex < step.text.length) {
        currentLine.textContent += step.text[charIndex];
        charIndex++;
        setTimeout(typeNext, step.delay);
      } else {
        charIndex = 0;
        seqIndex++;
        const cursor = currentLine?.closest('.term-line')?.querySelector('.cursor-blink');
        if (cursor) cursor.remove();
        setTimeout(typeNext, 200);
      }
      return;
    }

    if (step.type === 'output') {
      const p = document.createElement('p');
      p.className = `output ${step.class || ''}`;
      p.textContent = step.text;
      terminal.appendChild(p);
      seqIndex++;
      setTimeout(typeNext, step.delay);
      return;
    }
  }

  setTimeout(typeNext, 800);

  /* ── Code tabs ── */
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(tab.dataset.tab)?.classList.add('active');
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
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── CLI signup form ── */
  document.querySelector('.cli-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (!input.value) return;

    const btn = e.target.querySelector('button');
    btn.textContent = '✓';
    btn.style.color = '#3fb950';

    setTimeout(() => {
      alert(`Welcome to Flowbase! Check ${input.value} to get started.`);
      input.value = '';
      btn.textContent = '↵';
    }, 500);
  });
});
