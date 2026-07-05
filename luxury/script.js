document.addEventListener('DOMContentLoaded',()=>{
  const slides=document.querySelectorAll('.hero-slides img');let i=0;
  setInterval(()=>{slides[i].classList.remove('active');i=(i+1)%slides.length;slides[i].classList.add('active')},4000);
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  document.querySelector('.inquire-form')?.addEventListener('submit',e=>{e.preventDefault();alert('Thank you. A concierge will contact you within 24 hours.');e.target.reset()});
});
