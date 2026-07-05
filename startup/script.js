document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  document.querySelector('.cta-form')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Welcome to Flowbase! Check your email to get started.');
    e.target.reset();
  });
});
