document.addEventListener('DOMContentLoaded',()=>{
  const obs=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');
      e.target.querySelectorAll('.metric-val[data-count]').forEach(el=>{const t=+el.dataset.count;let c=0;const s=Math.ceil(t/40);const i=setInterval(()=>{c+=s;if(c>=t){c=t;clearInterval(i)}el.textContent=c},25)});
      obs.unobserve(e.target);}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  document.querySelectorAll('.metric-val[data-count]').forEach(el=>obs.observe(el.closest('.metrics-strip')||el));
  document.querySelector('.quote-form')?.addEventListener('submit',e=>{e.preventDefault();alert('Quote request received! We will respond within 24 hours.');e.target.reset()});
});
