document.addEventListener('DOMContentLoaded',()=>{
  const menu=document.querySelector('.mobile-menu'),nav=document.querySelector('.mobile-nav');
  menu?.addEventListener('click',()=>nav.classList.toggle('open'));
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  document.querySelector('.contact-form')?.addEventListener('submit',e=>{e.preventDefault();alert('Thank you! We will get back to you soon.');e.target.reset()});
});
