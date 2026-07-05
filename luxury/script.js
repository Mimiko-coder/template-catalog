document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 60));

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  document.querySelector('.contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you. A concierge will contact you within 24 hours.');
    e.target.reset();
  });
});
