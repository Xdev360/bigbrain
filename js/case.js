(function(){
  var bar=document.getElementById('caseBar');
  if(bar){
    var onBar=function(){bar.classList.toggle('stuck',window.scrollY>8)};
    onBar();
    window.addEventListener('scroll',onBar,{passive:true});
  }

  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if('IntersectionObserver' in window && !reduced){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -32px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')});
  }

  /*
    Exact PXDX behaviour:
    1. All three columns start on the same top line
    2. Middle is taller (larger frames)
    3. As you scroll, middle moves UP: translateY(-(scrollDelta / 5))
    4. Stops when middle bottom reaches the same line as left/right bottoms
    5. Project-info block is pulled up by the same amount so it meets the aligned bottoms
  */
  var gallery=document.querySelector('.case-gallery');
  var mid=document.querySelector('.g-col-mid');
  var left=document.querySelector('.g-col-left');
  var body=document.querySelector('.case-body');
  if(!gallery || !mid || !left || !body || reduced) return;

  var desktop=window.matchMedia('(min-width:992px)');
  var ticking=false;
  var maxShift=0;
  var startY=0;

  function measure(){
    mid.style.transform='';
    body.style.marginTop='';
    if(!desktop.matches){
      maxShift=0;
      return;
    }
    maxShift=Math.max(0, mid.offsetHeight - left.offsetHeight);
    startY=gallery.getBoundingClientRect().top + window.scrollY;
  }

  function apply(){
    ticking=false;
    if(!desktop.matches || maxShift<=0){
      mid.style.transform='';
      body.style.marginTop='';
      return;
    }

    var delta=window.scrollY - startY;
    if(delta<=0){
      mid.style.transform='translate3d(0,0,0)';
      body.style.marginTop='0px';
      return;
    }

    var shift=Math.min(maxShift, delta/5);
    mid.style.transform='translate3d(0,'+(-shift)+'px,0)';
    body.style.marginTop=(-shift)+'px';
  }

  function onMove(){
    if(!ticking){
      ticking=true;
      requestAnimationFrame(apply);
    }
  }

  function boot(){
    measure();
    apply();
  }

  if(document.readyState==='complete') boot();
  else window.addEventListener('load',boot);
  window.addEventListener('scroll',onMove,{passive:true});
  window.addEventListener('resize',function(){boot();},{passive:true});
})();
