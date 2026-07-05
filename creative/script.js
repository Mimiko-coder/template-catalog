document.addEventListener('DOMContentLoaded',()=>{
  const dot=document.querySelector('.cursor-dot');
  document.addEventListener('mousemove',e=>{if(dot){dot.style.left=e.clientX-10+'px';dot.style.top=e.clientY-10+'px'}});
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  document.querySelector('.hi-form')?.addEventListener('submit',e=>{e.preventDefault();alert('Thanks! We\'ll be in touch soon.');e.target.reset()});
});
