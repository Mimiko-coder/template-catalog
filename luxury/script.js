document.addEventListener('DOMContentLoaded', () => {
  /* ── Hero slideshow ── */
  const slides = document.querySelectorAll('.hero-slides img');
  const dots = document.querySelectorAll('.progress-dot');
  const parallax = document.querySelector('.hero-parallax');
  const nav = document.querySelector('.mag-nav');
  let current = 0;
  const INTERVAL = 6000;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  let slideTimer = setInterval(nextSlide, INTERVAL);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideTimer);
      goToSlide(i);
      slideTimer = setInterval(nextSlide, INTERVAL);
    });
  });

  /* ── Hero parallax ── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (parallax && scrollY < heroHeight) {
          const offset = scrollY * 0.35;
          parallax.style.transform = `translate3d(0, ${offset}px, 0)`;
        }

        nav?.classList.toggle('scrolled', scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ── Inquiry form ── */
  document.querySelector('.inquire-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const btn = form.querySelector('.inquire-submit');
    const original = btn.textContent;
    btn.textContent = 'Received';
    btn.disabled = true;
    setTimeout(() => {
      alert('Thank you. A concierge will contact you within 24 hours.');
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 600);
  });
});
