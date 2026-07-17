(function(){
  var lightbox=document.getElementById('pjLightbox');
  var backdrop=document.getElementById('pjLightboxBackdrop');
  var closeBtn=document.getElementById('pjLightboxClose');
  var stage=document.getElementById('pjLightboxStage');

  function openLightbox(idx){
    var p=window.__pjProject;
    if(!lightbox||!stage||!p||!p.screens) return;
    var sc=p.screens[idx];
    if(!sc) return;
    window.__pjLightboxIdx=idx;
    renderLightbox(sc._mode||p.screenMode||'desktop',sc.tone,sc._inner);
  }

  function openHeroLightbox(){
    var p=window.__pjProject;
    if(!lightbox||!stage||!p) return;
    var cover=document.getElementById('pjCover');
    var inner=cover?cover.innerHTML:'';
    window.__pjLightboxIdx=null;
    renderLightbox(p.coverType||p.screenMode||'desktop',p.tone,inner);
  }

  function renderLightbox(mode,tone,inner){
    stage.innerHTML='<div class="pj-screen-frame is-'+mode+'" style="--tone:'+tone+'">'+inner+'</div>';
    stage.className='pj-lightbox-stage is-'+mode;
    lightbox.hidden=false;
    document.body.classList.add('pj-lightbox-open');
    document.body.classList.remove('pj-screen-hover');
    if(closeBtn) closeBtn.focus();
    document.dispatchEvent(new CustomEvent('pj:lightbox-open'));
  }

  function closeLightbox(){
    if(!lightbox) return;
    lightbox.hidden=true;
    if(stage) stage.innerHTML='';
    document.body.classList.remove('pj-lightbox-open');
    window.__pjLightboxIdx=null;
    document.dispatchEvent(new CustomEvent('pj:lightbox-close'));
  }

  function bindScreens(){
    document.querySelectorAll('[data-pj-screen]').forEach(function(btn){
      btn.addEventListener('mouseenter',function(){
        document.body.classList.add('pj-screen-hover');
      });
      btn.addEventListener('mouseleave',function(){
        document.body.classList.remove('pj-screen-hover');
      });
      btn.addEventListener('click',function(){
        openLightbox(parseInt(btn.getAttribute('data-pj-screen'),10));
      });
    });
    var cover=document.getElementById('pjCover');
    if(cover&&!cover.dataset.pjBound){
      cover.dataset.pjBound='1';
      cover.setAttribute('role','button');
      cover.setAttribute('tabindex','0');
      cover.setAttribute('aria-label','Expand project hero visual');
      cover.addEventListener('click',openHeroLightbox);
      cover.addEventListener('keydown',function(e){
        if(e.key==='Enter'||e.key===' ') { e.preventDefault(); openHeroLightbox(); }
      });
    }
  }

  if(backdrop) backdrop.addEventListener('click',closeLightbox);
  if(closeBtn) closeBtn.addEventListener('click',closeLightbox);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&!lightbox.hidden) closeLightbox();
  });

  window.__pjBindScreens=bindScreens;
  document.addEventListener('pj:ready',bindScreens);
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bindScreens);
  }else{
    setTimeout(bindScreens,0);
  }
})();
