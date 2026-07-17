/* Project page Tour — same hover fly + chat as homepage, Tour only */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root=document.getElementById('pjGuide');
  var traveler=document.getElementById('pjGuideTraveler');
  var chat=document.getElementById('pjGuideChat');
  var chatText=document.getElementById('pjGuideChatText');
  var avatar=document.getElementById('pjGuideAvatar');
  var menu=document.getElementById('pjGuideMenu');
  var menuTour=document.getElementById('pjMenuTour');
  if(!root||!traveler||!chat||!chatText||!avatar) return;
  if(window.matchMedia('(max-width:900px)').matches) return;

  var narrowMq=window.matchMedia('(max-width:900px)');
  function isMobile(){ return narrowMq.matches; }

  var posX=0,posY=0,hasPos=false;
  var tourMode=false;
  var exploreMode=false;
  var hoverMoveTimer=null;
  var hoverDwellUntil=0;
  var hoverTargetKey='';
  var hoverArriving=null;
  var hoverLocked=false;
  var queuedHover=null;
  var flyTargetX=0,flyTargetY=0;
  var activeMsg='';
  var chatTypeTimer=null;
  var lightboxOpen=false;

  var HOVER_DWELL=700;
  var CHAT_MS_PER_CHAR=8;

  function pageH(){
    return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  }

  function placeFree(docX,docY,snap){
    if(isMobile()) return;
    var w=window.innerWidth;
    var h=pageH();
    docX=Math.max(52,Math.min(w-52,docX));
    docY=Math.max(90,Math.min(h-90,docY));
    if(snap||!hasPos){posX=docX;posY=docY;hasPos=true}
    else{
      posX+=(docX-posX)*0.28;
      posY+=(docY-posY)*0.32;
    }
    traveler.style.transform='translate('+posX+'px,'+posY+'px)';
    traveler.classList.toggle('chat-left',posX>=w*0.5);
  }

  function anchorToTourSlot(){
    var slot=document.getElementById('pjTourAnchor');
    if(!slot) return;
    var r=slot.getBoundingClientRect();
    placeFree(window.scrollX+r.left+26,window.scrollY+r.top+r.height*0.5,true);
  }

  function anchorToCover(){
    anchorToTourSlot();
  }

  function anchorToLightbox(){
    var stage=document.getElementById('pjLightboxStage');
    if(!stage) return;
    var r=stage.getBoundingClientRect();
    placeFree(window.scrollX+r.left+32,window.scrollY+r.top+32,true);
  }

  function setChat(msg,opts){
    opts=opts||{};
    if(!tourMode||(!exploreMode&&!isMobile())){
      clearTimeout(chatTypeTimer);
      chat.classList.remove('is-on');
      chat.classList.remove('is-caption');
      return;
    }
    chat.classList.add('is-caption');
    if(!msg){
      chat.classList.remove('is-on');
      return;
    }
    if(msg===activeMsg&&chatText.dataset.full===msg){
      chat.classList.add('is-on');
      return;
    }
    activeMsg=msg;
    chatText.dataset.full=msg;
    clearTimeout(chatTypeTimer);
    chatText.textContent='';
    chat.classList.add('is-on');
    if(msg.length<=90){
      chatText.textContent=msg;
      return;
    }
    var i=0;
    function typeNext(){
      if(activeMsg!==msg) return;
      i++;
      chatText.textContent=msg.slice(0,i);
      if(i<msg.length) chatTypeTimer=setTimeout(typeNext,CHAT_MS_PER_CHAR);
    }
    typeNext();
  }

  function hideChat(){
    activeMsg='';
    clearTimeout(chatTypeTimer);
    if(chatText) delete chatText.dataset.full;
    chat.classList.remove('is-on');
    chat.classList.remove('is-caption');
  }

  function closeMenu(){
    if(!menu) return;
    menu.hidden=true;
    menu.classList.remove('is-on');
  }

  function openMenu(){
    if(!menu) return;
    menu.hidden=false;
    requestAnimationFrame(function(){ menu.classList.add('is-on'); });
  }

  function syncTourButton(){
    if(!menuTour) return;
    menuTour.classList.toggle('is-on',tourMode);
    menuTour.setAttribute('aria-pressed',tourMode?'true':'false');
  }

  function enableTourMode(){
    tourMode=true;
    root.classList.add('is-tour-on');
    root.classList.add('is-explore');
    if(isMobile()) exploreMode=true;
    hideChat();
    syncTourButton();
  }

  function disableTourMode(){
    tourMode=false;
    exploreMode=false;
    hoverArriving=null;
    hoverTargetKey='';
    hoverLocked=false;
    hoverDwellUntil=0;
    queuedHover=null;
    clearTimeout(hoverMoveTimer);
    hoverMoveTimer=null;
    root.classList.remove('is-tour-on');
    root.classList.remove('is-explore');
    hideChat();
    syncTourButton();
    if(lightboxOpen) anchorToLightbox();
    else anchorToCover();
  }

  function toggleTourMode(){
    if(tourMode) disableTourMode();
    else enableTourMode();
  }

  function isFlyingToTarget(){
    if(!exploreMode) return false;
    return Math.hypot(flyTargetX-posX,flyTargetY-posY)>14;
  }

  function anchorForHover(target){
    if(!target) return null;
    if(target.anchor) return target.anchor;
    return target.el||null;
  }

  function flyToHoverTarget(target){
    var anchor=anchorForHover(target);
    if(!anchor) return;
    hideChat();
    exploreMode=true;
    root.classList.add('is-explore');
    var r=anchor.getBoundingClientRect();
    var w=window.innerWidth;
    flyTargetX=window.scrollX+r.left+r.width*0.5;
    flyTargetY=window.scrollY+r.top+r.height*0.5;
    if(flyTargetX>w*0.55) flyTargetX-=72;
    else flyTargetX+=72;
    flyTargetY-=8;
    hoverArriving=target;
    hoverLocked=true;
  }

  function resolveHoverTarget(clientX,clientY){
    var hits=document.elementsFromPoint?document.elementsFromPoint(clientX,clientY):[document.elementFromPoint(clientX,clientY)];
    var hit=null;
    for(var i=0;i<hits.length;i++){
      if(!hits[i]) continue;
      if(hits[i].closest('.pj-guide,.pj-lightbox-close,.pj-lightbox-backdrop,.svc-bar')) continue;
      if(lightboxOpen&&!hits[i].closest('#pjLightboxStage,.pj-guide')) continue;
      if(!lightboxOpen&&hits[i].closest('.pj-lightbox')) continue;
      hit=hits[i];
      break;
    }
    if(!hit) return null;

    var tourEl=hit.closest('[data-pj-tour]');
    if(tourEl){
      return {
        key:'pj:'+(tourEl.getAttribute('data-pj-tour-key')||tourEl.id||tourEl.textContent.slice(0,24)),
        pitch:tourEl.getAttribute('data-pj-tour-pitch')||'',
        anchor:tourEl.querySelector('[data-pj-tour-anchor]')||tourEl.querySelector('h3,.pj-tag,p,strong')||tourEl
      };
    }
    return null;
  }

  function scheduleHoverTarget(target){
    if(!target||!tourMode||isMobile()) return;
    if(target.key===hoverTargetKey&&(hoverLocked||isFlyingToTarget())){
      queuedHover=target;
      return;
    }
    if(target.key===hoverTargetKey&&!hoverLocked) return;
    if(hoverLocked||isFlyingToTarget()){
      queuedHover=target;
      hideChat();
      return;
    }
    if(target.key!==hoverTargetKey) hideChat();
    flyToHoverTarget(target);
  }

  function onTourPointer(clientX,clientY){
    if(!tourMode||isMobile()) return;
    if(menu&&!menu.hidden&&menu.classList.contains('is-on')) return;
    var target=resolveHoverTarget(clientX,clientY);
    if(target&&target.pitch) scheduleHoverTarget(target);
    else if(!hoverLocked&&!isFlyingToTarget()) hideChat();
  }

  function updateExploreFly(){
    if(!exploreMode||!tourMode||isMobile()) return;
    placeFree(flyTargetX,flyTargetY,false);
    var dist=Math.hypot(flyTargetX-posX,flyTargetY-posY);
    if(dist<14&&hoverArriving){
      hoverTargetKey=hoverArriving.key;
      setChat(hoverArriving.pitch);
      hoverArriving=null;
      hoverDwellUntil=Date.now()+HOVER_DWELL;
      clearTimeout(hoverMoveTimer);
      hoverMoveTimer=setTimeout(function(){
        hoverLocked=false;
        hoverDwellUntil=0;
        if(queuedHover&&queuedHover.key!==hoverTargetKey&&tourMode){
          var next=queuedHover;
          queuedHover=null;
          flyToHoverTarget(next);
        }else{
          queuedHover=null;
        }
      },HOVER_DWELL);
    }
  }

  function tick(){
    if(exploreMode&&tourMode) updateExploreFly();
    requestAnimationFrame(tick);
  }

  function shortPitch(text){
    if(!text) return '';
    var t=String(text).replace(/\s+/g,' ').trim();
    var first=t.match(/^[^.!?]+[.!?]/);
    if(first&&first[0].length<=120) return first[0];
    if(t.length<=100) return t;
    return t.slice(0,97)+'…';
  }

  function tagLightboxHotspots(){
    var stage=document.getElementById('pjLightboxStage');
    if(!stage) return;
    var p=window.__pjProject;
    var idx=window.__pjLightboxIdx;
    var sc=p&&p.screens&&idx!=null?p.screens[idx]:null;
    var parts=sc&&sc._tor?sc._tor.split(' · '):[];
    var nodes=stage.querySelectorAll('.pj-demo-mark,.pj-demo-block,.pj-demo-chip,.pj-demo-brand-grid,.pj-demo-body');
    if(!nodes.length){
      stage.setAttribute('data-pj-tour','');
      stage.setAttribute('data-pj-tour-pitch',shortPitch(sc?sc._tor||'':''));
      stage.setAttribute('data-pj-tour-key','screen');
      return;
    }
    nodes.forEach(function(el,i){
      el.setAttribute('data-pj-tour','');
      el.setAttribute('data-pj-tour-key','hot-'+i);
      el.setAttribute('data-pj-tour-pitch',shortPitch(parts[i]||parts[0]||sc._tor||''));
    });
  }

  document.addEventListener('pointermove',function(e){
    onTourPointer(e.clientX,e.clientY);
  },{passive:true});

  document.addEventListener('pointerdown',function(e){
    if(tourMode&&!isMobile()){
      if(e.target.closest&&e.target.closest('.pj-guide-menu,.pj-guide-avatar')) return;
      onTourPointer(e.clientX,e.clientY);
    }
  },{passive:true});

  avatar.addEventListener('click',function(e){
    e.stopPropagation();
    avatar.classList.remove('is-invite','is-shake');
    if(isMobile()){
      toggleTourMode();
      return;
    }
    var menuOpen=menu&&!menu.hidden&&menu.classList.contains('is-on');
    if(menuOpen){ closeMenu(); return; }
    openMenu();
  });

  document.addEventListener('click',function(e){
    if(!menu||menu.hidden) return;
    if(menu.contains(e.target)||avatar.contains(e.target)) return;
    closeMenu();
  });

  if(menuTour){
    menuTour.addEventListener('click',function(){
      closeMenu();
      toggleTourMode();
    });
  }

  document.addEventListener('click',function(e){
    if(!tourMode||!isMobile()) return;
    var tourEl=e.target.closest('[data-pj-tour]');
    if(!tourEl) return;
    var pitch=tourEl.getAttribute('data-pj-tour-pitch');
    if(!pitch) return;
    exploreMode=true;
    var anchor=tourEl.querySelector('[data-pj-tour-anchor]')||tourEl.querySelector('h3,.pj-tag,p,strong')||tourEl;
    var r=anchor.getBoundingClientRect();
    placeFree(window.scrollX+r.left-40,window.scrollY+r.top+r.height*0.5,true);
    setChat(pitch);
  });

  document.addEventListener('pj:ready',function(){
    root.style.height=pageH()+'px';
    anchorToTourSlot();
  });

  document.addEventListener('pj:lightbox-open',function(e){
    lightboxOpen=true;
    root.classList.add('is-lightbox');
    tagLightboxHotspots();
    anchorToLightbox();
  });

  document.addEventListener('pj:lightbox-close',function(){
    lightboxOpen=false;
    root.classList.remove('is-lightbox');
    hoverLocked=false;
    queuedHover=null;
    if(tourMode) anchorToTourSlot();
  });

  window.addEventListener('resize',function(){
    root.style.height=pageH()+'px';
    if(lightboxOpen) anchorToLightbox();
    else anchorToTourSlot();
  });

  window.BigBrainProjectTour={
    start:enableTourMode,
    stop:disableTourMode,
    isRunning:function(){ return tourMode; }
  };

  root.style.height=pageH()+'px';
  avatar.classList.add('is-invite','is-shake');
  requestAnimationFrame(tick);
  document.addEventListener('pj:ready',anchorToTourSlot);
  setTimeout(anchorToTourSlot,120);
})();
