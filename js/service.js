(function(){
  var bar=document.querySelector('.svc-bar');
  if(bar){
    var onScroll=function(){bar.classList.toggle('stuck',window.scrollY>8)};
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  document.querySelectorAll('.sp-faq-item').forEach(function(item){
    var btn=item.querySelector('.sp-faq-q');
    if(!btn) return;
    btn.addEventListener('click',function(){
      var open=item.classList.contains('is-open');
      document.querySelectorAll('.sp-faq-item.is-open').forEach(function(el){
        el.classList.remove('is-open');
        var q=el.querySelector('.sp-faq-q');
        if(q) q.setAttribute('aria-expanded','false');
      });
      if(!open){
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function observeReveals(root){
    var scope=root||document;
    var nodes=scope.querySelectorAll('.reveal:not(.in)');
    if(!nodes.length) return;
    if('IntersectionObserver' in window && !reduced){
      nodes.forEach(function(el){ io.observe(el); });
    }else{
      nodes.forEach(function(el){ el.classList.add('in'); });
    }
  }

  var io;
  if('IntersectionObserver' in window && !reduced){
    io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },{threshold:.1,rootMargin:'0px 0px -32px 0px'});
    observeReveals(document);
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')});
  }

  document.addEventListener('pj:ready',function(){
    observeReveals(document);
    document.querySelectorAll('#pjProcess .reveal, #pjScreens .reveal').forEach(function(el){
      el.classList.add('in');
    });
  });

  function barOffset(){
    var bar=document.querySelector('.svc-bar');
    return (bar?bar.offsetHeight:64)+12;
  }

  function scrollToHash(hash, smooth){
    if(!hash||hash.charAt(0)!=='#') return;
    var id=hash.slice(1);
    var el=document.getElementById(id);
    if(!el) return;
    var top=el.getBoundingClientRect().top+window.scrollY-barOffset();
    window.scrollTo({top:Math.max(0,top),behavior:smooth?'smooth':'auto'});
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    var h=a.getAttribute('href');
    if(!h||h.length<2) return;
    a.addEventListener('click',function(e){
      var el=document.getElementById(h.slice(1));
      if(!el) return;
      e.preventDefault();
      scrollToHash(h,true);
      if(history.pushState) history.pushState(null,'',h);
    });
  });

  function scrollHashOnLoad(){
    if(location.hash&&location.hash.length>1) scrollToHash(location.hash,false);
  }
  if(document.readyState==='complete') scrollHashOnLoad();
  else window.addEventListener('load',scrollHashOnLoad);
})();
