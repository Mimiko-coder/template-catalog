document.addEventListener('DOMContentLoaded',()=>{
  const obs=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');
      document.querySelectorAll('.spec-val[data-count]').forEach(el=>{const t=+el.dataset.count;let c=0;const s=Math.ceil(t/50);const i=setInterval(()=>{c+=s;if(c>=t){c=t;clearInterval(i)}el.textContent=c.toLocaleString()},25)});
      obs.unobserve(e.target);}
  }),{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  obs.observe(document.querySelector('.spec-bar'));
  document.querySelector('.rfq-form')?.addEventListener('submit',e=>{e.preventDefault();alert('RFQ submitted! Our team will contact you within 48 hours.');e.target.reset()});
});
