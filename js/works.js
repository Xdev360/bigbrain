/* Selected work — fixed stage; sliding dots; tap flips card only */
(function(){
  var stage=document.getElementById('workStage');
  var dotsHost=document.getElementById('workDots');
  if(!stage || !dotsHost) return;

  var projects=[
    {
      name:'Malete Foods',
      year:'2024',
      info:'Campus food ordering — menu, cart and checkout built for slow connections.',
      roles:['App design','Product UI','UX'],
      image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
      href:'works/malete-foods.html'
    },
    {
      name:'Star Hunt',
      year:'2024',
      info:'Conversion landing for a betting platform — download, play, support.',
      roles:['Web design','Landing','Canada'],
      image:'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80',
      href:'works/star-hunt.html'
    },
    {
      name:'TandF Technology',
      year:'2025',
      info:'Engineering firm site and visual identity — built in Framer.',
      roles:['Web design','Brand identity','Framer'],
      image:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      href:'works/tandf-technology.html'
    },
    {
      name:'PlutoTech Wallet',
      year:'2024',
      info:'Wallet UI made legible for people who don’t live in crypto.',
      roles:['App design','Web3','Product UI'],
      image:'https://images.unsplash.com/photo-1639763483549-9c68de7c1d51?auto=format&fit=crop&w=1400&q=80',
      href:'works/plutotech-wallet.html'
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

  function cardHtml(p){
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
        '<div class="work-card-media">'+
          '<img src="'+p.image+'" alt="'+p.name+'" width="720" height="540" loading="lazy">'+
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
    if(view){
      view.addEventListener('click',function(e){ e.stopPropagation(); });
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

  stage.addEventListener('touchstart',function(e){
    if(!e.changedTouches||!e.changedTouches[0]) return;
    touchX=e.changedTouches[0].clientX;
    swiped=false;
  },{passive:true});

  stage.addEventListener('touchend',function(e){
    if(touchX===null || !e.changedTouches||!e.changedTouches[0]) return;
    var dx=e.changedTouches[0].clientX-touchX;
    touchX=null;
    if(Math.abs(dx)<40) return;
    swiped=true;
    if(dx<0) next();
    else goTo(index-1);
  },{passive:true});

  window.addEventListener('resize',syncThumb);

  buildDots();
  mount(false);
})();
