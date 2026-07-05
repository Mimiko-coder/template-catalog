document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  document.querySelector('.contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const business = form.business.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Website Inquiry${business ? ` — ${business}` : ''}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nBusiness: ${business || 'N/A'}\n\n${message}`
    );

    window.location.href = `mailto:mercysit2002@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
});
