document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        const num = e.target.querySelector('.num[data-count]');
        if (num) animateCount(num);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  function animateCount(el) {
    const target = +el.dataset.count;
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString() + '+';
    }, 25);
  }

  document.querySelector('.contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Request submitted! Our team will contact you within 48 hours.');
    e.target.reset();
  });
});
