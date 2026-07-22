/* Selected work — fixed stage; sliding dots; tap flips card only */
(function(){
  var stage=document.getElementById('workStage');
  var dotsHost=document.getElementById('workDots');
  if(!stage || !dotsHost) return;

  var projects=[
    {
      name:'Goalden',
      year:'2024',
      info:'Turning big yearly goals into daily habits with a clean check-in people actually open.',
      roles:['Brand identity','App design','Web design','Graphic design'],
      theme:{id:'golden',primary:'#009254',secondary:'#8FD4A8'},
      logo:'assets/projects/golden/golden-logo-mark.svg',
      href:'works/golden.html'
    },
    {
      name:'CrediGo',
      year:'2024',
      info:'Fintech lending: clear loan plans, calm dashboards, and repayment tracking without the stress.',
      roles:['Brand identity','App design','Web design','Graphic design'],
      theme:{id:'credigo',primary:'#0B2E65',secondary:'#93C5FD'},
      logo:'assets/projects/credigo/credigo-logo-mark.svg',
      href:'works/credigo.html'
    },
    {
      name:'Cue Africa',
      year:'2024',
      info:'Connecting creators with production teams in Africa: find and hire top talent in minutes.',
      roles:['Brand identity','App design','Web design','Graphic design'],
      theme:{id:'qafrica',primary:'#0F3D2E',secondary:'#6BB08A'},
      logo:'assets/projects/qafrica/qafrica-logo-mark.svg',
      href:'works/qafrica.html'
    },
    {
      name:'Blackgold Studio',
      year:'2024',
      info:'Premium photography and editing studio: see the space, pick a service, book without back-and-forth.',
      roles:['Brand identity','App design','Web design','Graphic design'],
      theme:{id:'blackgold',primary:'#3D2914',secondary:'#D4C4B0'},
      logo:'assets/projects/blackgold-studio/blackgold-logo-mark.svg',
      href:'works/blackgold-studio.html'
    },
    {
      name:'Nicovellor',
      year:'2025',
      info:'Private luxury network brand — clothing and art for Velourians.',
      roles:['Brand identity','Web design','Graphic design','App design'],
      theme:{id:'nicovellor',primary:'#111111',secondary:'#F2F2F2'},
      href:'works/nicovellor.html'
    },
    {
      name:'Spotlight',
      year:'2025',
      info:'Open black folder — Google Movie (entertainment OS), RESJAM (marketplace redesign), Yeild Mates.',
      roles:['Brand identity','Web design','Graphic design','App design'],
      theme:{id:'spotlight',primary:'#0A0A0A',secondary:'#2A2A2A'},
      href:'works/spotlight.html'
    }
  ];

  var index=0;
  var busy=false;
  var touchX=null;
  var swiped=false;
  var OUT_MS=150;
  var IN_MS=320;
  var thumb=null;
  var track=null;

  function pillHtml(roles){
    return roles.map(function(r){
      return '<span class="work-pill">'+r+'</span>';
    }).join('');
  }

  function folderMark(theme, logoSrc){
    var t=theme||{};
    var primary=t.primary||'#2F80ED';
    var secondary=t.secondary||'#7EC8F0';
    var id=(t.id||'x').replace(/[^a-z0-9]/gi,'');
    var logo=logoSrc
      ? '<span class="work-folder-logo"><img src="'+logoSrc+'" alt=""></span>'
      : '';
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
        logo+
      '</span>';
  }

  function cardHtml(p){
    var tint=(p.theme&&p.theme.secondary)||'#e9e9e9';
    return ''+
      '<article class="work-card" data-work-card>'+
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
          folderMark(p.theme, p.logo)+
        '</div>'+
      '</article>';
  }

  function buildDots(){
    dotsHost.innerHTML='';
    dotsHost.setAttribute('role','group');
    dotsHost.setAttribute('aria-label','Project pages');
    track=document.createElement('div');
    track.className='work-dots-track';
    projects.forEach(function(p,i){
      var b=document.createElement('button');
      b.type='button';
      b.className='work-dot'+(i===index?' is-on':'');
      b.setAttribute('aria-label', p.name);
      if(i===index) b.setAttribute('aria-current','true');
      b.addEventListener('click',function(e){
        e.stopPropagation();
        goTo(i);
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

  function syncDots(){
    if(!track) return;
    track.querySelectorAll('.work-dot').forEach(function(b,i){
      var on=i===index;
      b.classList.toggle('is-on', on);
      if(on) b.setAttribute('aria-current','true');
      else b.removeAttribute('aria-current');
    });
  }

  function ensureHint(){
    var wrap=document.getElementById('workShowcase');
    if(!wrap || wrap.querySelector('.work-key-hint')) return;
    var hint=document.createElement('p');
    hint.className='work-key-hint';
    hint.setAttribute('aria-hidden','true');
    hint.innerHTML='<span>←</span><span>→</span> to flip';
    wrap.appendChild(hint);
    try{
      if(sessionStorage.getItem('bb-work-keys')==='1') hint.classList.add('is-gone');
    }catch(e){}
    window.setTimeout(function(){ hint.classList.add('is-fade'); }, 4200);
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
  }

  function mount(withIn){
    stage.innerHTML=cardHtml(projects[index]);
    var card=stage.querySelector('[data-work-card]');
    var view=stage.querySelector('.work-view');
    var folder=stage.querySelector('.work-card-folder');
    if(view){
      view.addEventListener('click',function(e){
        e.stopPropagation();
        try{ sessionStorage.setItem('bb-folders-open', '0'); }catch(err){}
      });
    }
    /* clicking the folder opens the project (same as View Project) */
    if(folder){
      folder.setAttribute('role','link');
      folder.setAttribute('tabindex','0');
      folder.setAttribute('aria-label','Open '+projects[index].name);
      folder.style.cursor='pointer';
      var openProject=function(e){
        e.preventDefault();
        e.stopPropagation();
        try{ sessionStorage.setItem('bb-folders-open', '0'); }catch(err){}
        window.location.href=projects[index].href;
      };
      folder.addEventListener('click',openProject);
      folder.addEventListener('keydown',function(e){
        if(e.key==='Enter' || e.key===' '){ openProject(e); }
      });
    }
    if(withIn && card){
      void card.offsetWidth;
      card.classList.add('is-in');
      setTimeout(function(){
        card.classList.remove('is-in');
        busy=false;
      },IN_MS);
    }else{
      busy=false;
    }
    syncThumb();
  }

  function goTo(next){
    if(busy) return;
    next=((next%projects.length)+projects.length)%projects.length;
    if(next===index) return;
    var card=stage.querySelector('[data-work-card]');
    if(!card){
      index=next;
      syncThumb();
      syncDots();
      mount(true);
      return;
    }
    busy=true;
    index=next;
    syncThumb();
    syncDots();
    card.classList.remove('is-in');
    card.classList.add('is-out');
    setTimeout(function(){
      mount(true);
    },OUT_MS);
  }

  function next(){ goTo(index+1); }

  stage.setAttribute('aria-label','Project card. Arrow keys, tap, or swipe for the next.');
  stage.addEventListener('click',function(e){
    if(e.target.closest('a')) return;
    if(swiped){ swiped=false; return; }
    next();
  });
  stage.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight' || e.key==='ArrowDown'){
      e.preventDefault();
      try{ sessionStorage.setItem('bb-work-keys','1'); }catch(err){}
      next();
    }else if(e.key==='ArrowLeft' || e.key==='ArrowUp'){
      e.preventDefault();
      try{ sessionStorage.setItem('bb-work-keys','1'); }catch(err){}
      goTo(index-1);
    }
  });

  var dragActive=false;
  var SWIPE_MIN=45;

  stage.addEventListener('pointerdown',function(e){
    if(e.target.closest('a')) return;
    dragActive=true;
    touchX=e.clientX;
    swiped=false;
    stage.classList.add('is-grabbing');
  });

  stage.addEventListener('pointermove',function(e){
    if(!dragActive || touchX===null) return;
    if(Math.abs(e.clientX-touchX)>8) swiped=true;
  });

  function endDrag(e){
    if(!dragActive) return;
    dragActive=false;
    stage.classList.remove('is-grabbing');
    if(touchX===null) return;
    var dx=(e && typeof e.clientX==='number' ? e.clientX : touchX)-touchX;
    touchX=null;
    if(Math.abs(dx)<SWIPE_MIN) return;
    swiped=true;
    if(dx<0) next();
    else goTo(index-1);
  }

  window.addEventListener('pointerup',endDrag);
  window.addEventListener('pointercancel',function(){
    dragActive=false;
    touchX=null;
    stage.classList.remove('is-grabbing');
  });

  window.addEventListener('resize',syncThumb);

  buildDots();
  mount(false);
  ensureHint();
})();
