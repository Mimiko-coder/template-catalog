document.addEventListener('DOMContentLoaded',()=>{
  const sidebar=document.querySelector('.sidebar'),toggle=document.querySelector('.sidebar-toggle');
  toggle?.addEventListener('click',()=>sidebar.classList.toggle('open'));
  document.querySelectorAll('.sidebar-nav a').forEach(a=>a.addEventListener('click',()=>sidebar.classList.remove('open')));
  const obs=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');
      e.target.querySelectorAll('.kpi-val[data-count]').forEach(el=>animateCount(el));
      obs.unobserve(e.target);}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  function animateCount(el){const t=+el.dataset.count;let c=0;const s=Math.ceil(t/40);const i=setInterval(()=>{c+=s;if(c>=t){c=t;clearInterval(i)}el.textContent=c+'+'},25)}
  document.querySelector('.inquiry-form')?.addEventListener('submit',e=>{e.preventDefault();alert('Inquiry submitted! We will contact you shortly.');e.target.reset()});
});
