document.addEventListener('DOMContentLoaded',()=>{
  const scroll=document.querySelector('.horizontal-scroll'),dots=document.querySelectorAll('.film-dots span'),panels=document.querySelectorAll('.panel');
  scroll?.addEventListener('scroll',()=>{
    const i=Math.round(scroll.scrollLeft/window.innerWidth);
    dots.forEach((d,j)=>d.classList.toggle('active',j===i));
  });
  let wheelTimeout;
  document.addEventListener('wheel',e=>{
    if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();clearTimeout(wheelTimeout);
      wheelTimeout=setTimeout(()=>{scroll.scrollBy({left:e.deltaY>0?window.innerWidth:-window.innerWidth,behavior:'smooth'})},50);}
  },{passive:false});
});
