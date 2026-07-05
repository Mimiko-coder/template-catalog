document.addEventListener('DOMContentLoaded',()=>{
  const sidebar=document.querySelector('.docs-sidebar'),toggle=document.querySelector('.sidebar-toggle');
  toggle?.addEventListener('click',()=>sidebar.classList.toggle('open'));
  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab)?.classList.add('active');
  }));
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  document.querySelector('.cli-form')?.addEventListener('submit',e=>{e.preventDefault();alert('Welcome to Flowbase! Check your email to get started.');e.target.reset()});
});
