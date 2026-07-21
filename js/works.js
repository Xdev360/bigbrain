/* Selected work — centered loop carousel, swipe-snap + haptic, hover lift */
(function(){
  var stage=document.getElementById('workStage');
  var dotsHost=document.getElementById('workDots');
  if(!stage || !dotsHost) return;

  var projects=[
    {
      name:'GOLDEN',
      year:'2025',
      info:'Consistency app: one master goal broken into yearly, monthly, weekly and daily discipline.',
      roles:['Brand identity','App design','Web design','Graphic design'],
      theme:{id:'golden',primary:'#1B7A4E',secondary:'#8FD4A8'},
      href:'works/golden.html'
    },
    {
      name:'WinTech Studio',
      year:'2024',
      info:'Agency system: brand identity, websites, motion and delivery.',
      roles:['Brand identity','Web design','Graphic design','App design'],
      theme:{id:'wintech',primary:'#1A1A1A',secondary:'#F0F0F0'},
      href:'works/wintech-studio.html'
    },
    {
      name:'QAfrica',
      year:'2025',
      info:'Crew marketplace: hire models, makeup, photography and production teams fast.',
      roles:['Brand identity','App design','Web design','Graphic design'],
      theme:{id:'qafrica',primary:'#0F3D2E',secondary:'#6BB08A'},
      href:'works/qafrica.html'
    },
    {
      name:'Lumia Essence',
      year:'2025',
      info:'Skincare commerce: P2P products, subscriptions and pay-small-small.',
      roles:['Brand identity','App design','Web design','Graphic design'],
      theme:{id:'lumia',primary:'#6B1E3A',secondary:'#F0B3C4'},
      href:'works/lumia-essence.html'
    },
    {
      name:'Nicovellor',
      year:'2025',
      info:'Ultra-wealthy network brand: clothing and art for Velourians.',
      roles:['Brand identity','Web design','Graphic design','App design'],
      theme:{id:'nicovellor',primary:'#111111',secondary:'#F2F2F2'},
      href:'works/nicovellor.html'
    }
  ];

  var N=projects.length;
  var index=0;
  var busy=false;
  var rail=null;
  var cards=[];
  var thumb=null;
  var track=null;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function pillHtml(roles){
    return roles.map(function(r){
      return '<span class="work-pill">'+r+'</span>';
    }).join('');
  }

  function folderMark(theme){
    var t=theme||{};
    var primary=t.primary||'#2F80ED';
    var secondary=t.secondary||'#7EC8F0';
    var id=(t.id||'x').replace(/[^a-z0-9]/gi,'');
    return ''+
      '<span class="work-folder" aria-hidden="true">'+
        '<svg class="work-folder-svg" viewBox="0 0 200 158" xmlns="http://www.w3.org/2000/svg">'+
          '<defs>'+
            '<linearGradient id="wff'+id+'" x1="100" y1="50" x2="100" y2="148" gradientUnits="userSpaceOnUse">'+
              '<stop offset="0%" stop-color="'+secondary+'"/>'+
              '<stop offset="100%" stop-color="'+secondary+'" stop-opacity=".9"/>'+
            '</linearGradient>'+
            '<linearGradient id="wfb'+id+'" x1="100" y1="22" x2="100" y2="120" gradientUnits="userSpaceOnUse">'+
              '<stop offset="0%" stop-color="'+primary+'" stop-opacity=".95"/>'+
              '<stop offset="100%" stop-color="'+primary+'"/>'+
            '</linearGradient>'+
            '<filter id="wfd'+id+'" x="-18%" y="-12%" width="136%" height="140%">'+
              '<feDropShadow dx="0" dy="10" stdDeviation="7" flood-color="#000" flood-opacity=".16"/>'+
            '</filter>'+
          '</defs>'+
          '<g filter="url(#wfd'+id+')">'+
            '<path fill="url(#wfb'+id+')" d="M28 38c0-9 7-16 16-16h36c5.2 0 10 2.4 13.2 6.4l8.4 10.4c2.2 2.7 5.5 4.2 9 4.2H156c9 0 16 7 16 16v62c0 9-7 16-16 16H44c-9 0-16-7-16-16V38z"/>'+
            '<path fill="'+primary+'" opacity=".4" d="M24 52h152v16H24z"/>'+
            '<path fill="url(#wff'+id+')" d="M20 56c0-8.5 6.5-15 15-15h130c8.5 0 15 6.5 15 15v70c0 8.5-6.5 15-15 15H35c-8.5 0-15-6.5-15-15V56z"/>'+
            '<path d="M38 118h124" stroke="rgba(0,0,0,.1)" stroke-width="2.2" stroke-linecap="round" fill="none"/>'+
            '<path d="M38 126h124" stroke="rgba(0,0,0,.07)" stroke-width="2" stroke-linecap="round" fill="none"/>'+
          '</g>'+
        '</svg>'+
      '</span>';
  }

  function cardHtml(p,i){
    var tint=(p.theme&&p.theme.secondary)||'#e9e9e9';
    return ''+
      '<article class="work-card" data-work-card data-i="'+i+'" tabindex="-1">'+
        '<div class="work-card-copy">'+
          '<p class="work-card-kicker">'+p.year+'</p>'+
          '<h3>'+p.name+'</h3>'+
          '<p class="work-card-info">'+p.info+'</p>'+
          '<div class="work-pills">'+pillHtml(p.roles)+'</div>'+
          '<a class="work-view" href="'+p.href+'">'+
            '<span class="work-view-dot" aria-hidden="true"></span>'+
            'View Project'+
          '</a>'+
        '</div>'+
        '<div class="work-card-folder" style="--fld:'+tint+'">'+
          folderMark(p.theme)+
        '</div>'+
      '</article>';
  }

  /* shortest signed distance on the loop: -floor(N/2) .. +floor(N/2) */
  function ringOff(i,active){
    var d=((i-active)%N+N)%N;
    if(d>Math.floor(N/2)) d-=N;
    return d;
  }

  function haptic(){
    try{
      if(navigator.vibrate) navigator.vibrate([18,28,36]);
    }catch(e){}
  }

  function buildDots(){
    dotsHost.innerHTML='';
    track=document.createElement('div');
    track.className='work-dots-track';
    projects.forEach(function(_,i){
      var b=document.createElement('button');
      b.type='button';
      b.className='work-dot';
      b.setAttribute('aria-label','Go to '+projects[i].name);
      b.addEventListener('click',function(e){
        e.stopPropagation();
        goTo(i,'dot');
      });
      track.appendChild(b);
    });
    thumb=document.createElement('span');
    thumb.className='work-dots-thumb';
    thumb.setAttribute('aria-hidden','true');
    track.appendChild(thumb);
    dotsHost.appendChild(track);
    requestAnimationFrame(syncThumb);
  }

  function syncThumb(){
    if(!thumb || !track) return;
    var dots=track.querySelectorAll('.work-dot');
    var dot=dots[index];
    if(!dot) return;
    var tr=track.getBoundingClientRect();
    var r=dot.getBoundingClientRect();
    var x=r.left-tr.left+(r.width/2)-(thumb.offsetWidth/2);
    thumb.style.transform='translateX('+x+'px)';
    dots.forEach(function(d,i){
      if(i===index) d.setAttribute('aria-current','true');
      else d.removeAttribute('aria-current');
    });
  }

  function layout(animate){
    cards.forEach(function(card){
      var i=parseInt(card.getAttribute('data-i'),10);
      var off=ringOff(i,index);
      var abs=Math.abs(off);
      card.dataset.off=String(off);
      card.classList.toggle('is-active',off===0);
      card.setAttribute('aria-hidden',off===0?'false':'true');
      if(off===0) card.removeAttribute('tabindex');
      else card.setAttribute('tabindex','-1');

      /* hide far cards so only center + neighbors show */
      var show=abs<=1;
      card.style.visibility=show?'visible':'hidden';
      card.style.pointerEvents=off===0?'auto':'none';
      if(!animate) card.style.transition='none';
    });
    if(!animate){
      void stage.offsetWidth;
      cards.forEach(function(c){ c.style.transition=''; });
    }
    syncThumb();
    stage.setAttribute('aria-label','Selected work: '+projects[index].name+'. Swipe or click for the next project.');
  }

  function goTo(next,how){
    next=((next%N)+N)%N;
    if(next===index || busy) return;
    busy=true;
    var dir=ringOff(next,index);
    index=next;
    if(how==='swipe' || how==='tap') haptic();

    cards.forEach(function(card){
      card.classList.remove('is-spin');
    });
    if(how==='tap' || how==='dot'){
      var active=cards[index];
      if(active && !reduced){
        active.classList.add('is-spin');
        setTimeout(function(){ active.classList.remove('is-spin'); },520);
      }
    }

    layout(true);
    stage.classList.toggle('is-dir-next',dir>0);
    stage.classList.toggle('is-dir-prev',dir<0);

    setTimeout(function(){ busy=false; },reduced?80:420);
  }

  function next(){ goTo(index+1,'swipe'); }
  function prev(){ goTo(index-1,'swipe'); }

  function mount(){
    rail=document.createElement('div');
    rail.className='work-rail';
    rail.innerHTML=projects.map(cardHtml).join('');
    stage.innerHTML='';
    stage.appendChild(rail);
    cards=Array.prototype.slice.call(stage.querySelectorAll('[data-work-card]'));

    cards.forEach(function(card){
      var view=card.querySelector('.work-view');
      if(view) view.addEventListener('click',function(e){ e.stopPropagation(); });

      /* inactive / active: click brings that card to center with spin */
      card.addEventListener('click',function(e){
        if(e.target.closest('a')) return;
        if(swiped){ swiped=false; return; }
        var i=parseInt(card.getAttribute('data-i'),10);
        if(i===index) goTo(index+1,'tap');
        else goTo(i,'tap');
      });
    });

    layout(false);
  }

  /* ---- swipe / drag: snaps as soon as threshold is crossed ---- */
  var dragActive=false;
  var touchX=null;
  var swiped=false;
  var dragDx=0;
  var SWIPE_MIN=36;
  var snapped=false;

  stage.addEventListener('pointerdown',function(e){
    if(e.target.closest('a')) return;
    if(busy) return;
    dragActive=true;
    snapped=false;
    touchX=e.clientX;
    dragDx=0;
    swiped=false;
    stage.classList.add('is-grabbing');
    try{ stage.setPointerCapture(e.pointerId); }catch(err){}
  });

  stage.addEventListener('pointermove',function(e){
    if(!dragActive || touchX===null || busy) return;
    dragDx=e.clientX-touchX;
    if(Math.abs(dragDx)>6) swiped=true;

    /* live drag follow on the rail (subtle) */
    if(rail && !snapped){
      var pull=Math.max(-72,Math.min(72,dragDx*0.42));
      rail.style.setProperty('--drag',pull+'px');
    }

    /* snap the moment threshold is crossed — no need to release first */
    if(!snapped && Math.abs(dragDx)>=SWIPE_MIN){
      snapped=true;
      rail.style.setProperty('--drag','0px');
      if(dragDx<0) next();
      else prev();
      dragActive=false;
      stage.classList.remove('is-grabbing');
      touchX=null;
    }
  });

  function endDrag(){
    if(!dragActive) return;
    dragActive=false;
    stage.classList.remove('is-grabbing');
    if(rail) rail.style.setProperty('--drag','0px');
    touchX=null;
    dragDx=0;
  }

  stage.addEventListener('pointerup',endDrag);
  stage.addEventListener('pointercancel',endDrag);
  stage.addEventListener('pointerleave',function(){
    if(dragActive && !snapped) endDrag();
  });

  /* keyboard */
  stage.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight' || e.key===' '){ e.preventDefault(); goTo(index+1,'tap'); }
    else if(e.key==='ArrowLeft'){ e.preventDefault(); goTo(index-1,'tap'); }
  });

  window.addEventListener('resize',function(){
    layout(false);
  });

  buildDots();
  mount();
})();
