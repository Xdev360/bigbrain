/* Selected work — fixed stage; sliding dots; tap flips card only */
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
          folderMark(p.theme)+
        '</div>'+
      '</article>';
  }

  function buildDots(){
    dotsHost.innerHTML='';
    track=document.createElement('div');
    track.className='work-dots-track';
    projects.forEach(function(_,i){
      var b=document.createElement('button');
      b.type='button';
      b.className='work-dot';
      b.setAttribute('aria-label','Project '+(i+1));
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
      view.addEventListener('click',function(e){ e.stopPropagation(); });
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
      mount(true);
      return;
    }
    busy=true;
    index=next;
    syncThumb();
    card.classList.remove('is-in');
    card.classList.add('is-out');
    setTimeout(function(){
      mount(true);
    },OUT_MS);
  }

  function next(){ goTo(index+1); }

  stage.addEventListener('click',function(e){
    if(e.target.closest('a')) return;
    if(swiped){ swiped=false; return; }
    next();
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
})();
