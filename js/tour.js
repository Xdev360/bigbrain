/* Tour: head rides the rail · headline lyrics per section · glass music dock */
(function(){
  var root=document.getElementById('guide');
  var svg=document.getElementById('guideSvg');
  var rail=document.getElementById('guideRail');
  var traveler=document.getElementById('guideTraveler');
  var chat=document.getElementById('guideChat');
  var chatText=document.getElementById('guideChatText');
  var avatar=document.getElementById('guideAvatar');
  var track=document.getElementById('guideTrack');
  var musicDock=document.getElementById('musicDock');
  var musicDockToggle=document.getElementById('musicDockToggle');
  var musicDockClose=document.getElementById('musicDockClose');
  if(!root || !svg || !rail || !traveler || !chat || !chatText || !avatar) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    root.style.display='none';
    return;
  }
  /* Mobile: keep lyric street; hide the floating guide face via CSS */
  var narrowMq=window.matchMedia('(max-width:900px)');
  function isMobile(){ return narrowMq.matches; }

  var stops=Array.prototype.slice.call(document.querySelectorAll('[data-guide]'));
  if(stops.length<2) return;

  var xs=[0.92,0.08,0.92,0.08,0.92,0.08,0.92,0.08]; /* legacy; stops pick sides explicitly */
  var points=[];
  var pathLen=0;
  var activeMsg='';
  var resizeTimer=null;
  var posX=0,posY=0,hasPos=false,pathT=0;

  var autoTour=false;
  var musicOn=false;
  var musicPaused=false;
  var sectionIndex=0;
  var useFile=false;
  var musicLevel=0.65;
  var ignoreUntil=0;
  var armX=null,armY=null;
  var tourRaf=0;

  /* tour phase machine */
  var phase='idle'; /* travel | read */
  var step=0;
  var phaseT0=0;
  var phaseDur=0;
  var fromT=0,toT=0;
  var fromScroll=0,toScroll=0;
  var activeHead=null;
  var activeWords=[]; /* letter spans for smooth progress */
  var activeBlocks=[];
  var manualHead=null;

  /* Tour on = hover fly + chat. Tour off = rail follow only. */
  var tourMode=false;
  var exploreMode=false;
  var hoverMoveTimer=null;
  var hoverDwellUntil=0;
  var hoverTargetKey='';
  var hoverArriving=null;
  var hoverLocked=false;
  var queuedHover=null;
  var flyTargetX=0,flyTargetY=0;
  var HOVER_DWELL=4000; /* wait here before flying to the next hover */

  var SERVICE_PITCH={
    'Brand identity':'A mark people remember is the cheapest ad you\'ll ever run — let\'s make yours impossible to forget.',
    'Website':'Your site should sell while you sleep. I build pages with one clear path to yes.',
    'Product Design':'Good UX isn\'t decoration — it\'s fewer drop-offs and more people finishing what they started.',
    'Motion & Video':'Motion holds attention longer than static. That\'s more time to convince someone you\'re the one.',
    'Development':'Fast, clean builds that ship on time — so your idea isn\'t still "almost ready" next quarter.'
  };
  var audioCtx=null,master=null,filter=null,sub=null,pads=[],hatTimer=null,kickTimer=null;
  var analyser=null,freqData=null,mediaSource=null,bassSmooth=0,bassPrev=0,bassHit=0,bassAvg=0.12;

  var MS_PER_CHAR=92; /* letter-by-letter — slow enough to read */
  var TRAVEL_MS=2200;
  var HOLD_MS=3200; /* pause after a section is fully read */
  var CHAT_MS_PER_CHAR=48;
  var chatTypeTimer=null;

  function pageH(){
    return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  }

  /* Headlines normally; black band also reads the scoreboard lines. */
  function lyricBlocksOf(section){
    if(!section) return [];
    if(section.id==='top'){
      var hero=section.querySelector('h1');
      return hero?[hero]:[];
    }
    if(section.id==='band'){
      return Array.prototype.slice.call(section.querySelectorAll('.stats p'));
    }
    if(section.id==='market'){
      var mpEyebrow=section.querySelector('.eyebrow');
      var mpH=section.querySelector('h2');
      return [mpEyebrow,mpH].filter(Boolean);
    }
    if(section.id==='custom'){
      var cEyebrow=section.querySelector('.eyebrow');
      var cH=section.querySelector('h2');
      return [cEyebrow,cH].filter(Boolean);
    }
    if(section.id==='contact'){
      var nEyebrow=section.querySelector('.eyebrow');
      var nH=section.querySelector('h2');
      return [nEyebrow,nH].filter(Boolean);
    }
    var h=section.querySelector('h1, h2');
    return h?[h]:[];
  }

  function headlineOf(section){
    if(section && section.id==='top') return section.querySelector('h1');
    var blocks=lyricBlocksOf(section);
    return blocks.filter(function(b){ return b && b.tagName && /^H[12]$/i.test(b.tagName); })[0]
      || blocks[0]
      || section.querySelector('.eyebrow')
      || null;
  }

  function sectionPitch(el){
    if(!el) return '';
    return el.getAttribute('data-guide-pitch') || el.getAttribute('data-guide') || '';
  }

  function activeSectionFromScroll(){
    var focusY=window.scrollY+window.innerHeight*0.38;
    var bestStop=null,bestScore=-Infinity;
    points.forEach(function(p){
      var el=p.el;
      var r=el.getBoundingClientRect();
      if(r.bottom<0 || r.top>window.innerHeight) return;
      var visible=Math.max(0,Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0));
      var ratio=visible/Math.max(1,r.height);
      var center=window.scrollY+r.top+r.height*0.5;
      var dist=Math.abs(center-focusY)/window.innerHeight;
      var score=ratio-dist*0.35;
      if(score>bestScore){bestScore=score;bestStop=p}
    });
    return bestStop;
  }

  function rebuild(){
    var w=window.innerWidth;
    var h=pageH();
    root.style.height=h+'px';
    svg.setAttribute('viewBox','0 0 '+w+' '+h);
    svg.setAttribute('width',String(w));
    svg.setAttribute('height',String(h));

    points=stops.map(function(el,i){
      var head=headlineOf(el);
      var target=head||el;
      var r;
      var y;
      var x;

      /* Keep the face in the RIGHT gutter — chat opens inward (left) so copy stays clear */
      if(el.id==='band'){
        var bandBox=el.getBoundingClientRect();
        /* Rail parks fully UNDER the black section in open space */
        y=window.scrollY+bandBox.bottom+56;
        x=w*0.93;
      }else if(el.id==='work'){
        var wh=el.querySelector('.works-head')||el;
        r=wh.getBoundingClientRect();
        y=window.scrollY+r.bottom+40;
        x=w*0.93;
      }else if(el.id==='services'){
        r=target.getBoundingClientRect();
        y=window.scrollY+r.top+Math.min(r.height*0.5,40);
        x=w*0.93;
      }else if(el.id==='top'){
        r=target.getBoundingClientRect();
        y=window.scrollY+r.top+Math.min(r.height*0.5,40);
        x=w*0.93;
      }else{
        r=target.getBoundingClientRect();
        y=window.scrollY+r.top+Math.min(r.height*0.5,40);
        x=w*0.93;
      }

      return {
        x:x,
        y:Math.max(90,Math.min(h-90,y)),
        msg:el.getAttribute('data-guide')||'',
        pitch:sectionPitch(el),
        el:el,
        head:head||headlineOf(el)
      };
    });

    if(points.length<2) return;
    var d='M '+points[0].x.toFixed(1)+' '+points[0].y.toFixed(1);
    for(var i=1;i<points.length;i++){
      var a=points[i-1],b=points[i];
      var mid=(a.y+b.y)/2;
      d+=' C '+a.x.toFixed(1)+' '+mid.toFixed(1)+', '+b.x.toFixed(1)+' '+mid.toFixed(1)+', '+b.x.toFixed(1)+' '+b.y.toFixed(1);
    }
    rail.setAttribute('d',d);
    pathLen=rail.getTotalLength?rail.getTotalLength():0;

    /* cache path-t for each stop */
    points.forEach(function(p){
      p.t=tForY(p.y);
    });

    if(!autoTour && points[0]){
      pathT=points[0].t||0;
      placeOnPath(pathT,true);
    }
    root.classList.toggle('is-live', !isMobile());
  }

  function tForY(docY){
    if(!pathLen) return 0;
    var samples=220,bestT=0,bestD=Infinity,i,p,d;
    for(i=0;i<=samples;i++){
      p=rail.getPointAtLength((i/samples)*pathLen);
      d=Math.abs(p.y-docY);
      if(d<bestD){bestD=d;bestT=i/samples}
    }
    return bestT;
  }

  function placeOnPath(t,snap){
    if(isMobile()) return;
    if(!pathLen) return;
    t=Math.max(0,Math.min(1,t));
    var pt=rail.getPointAtLength(t*pathLen);
    if(snap || !hasPos){ posX=pt.x; posY=pt.y; hasPos=true; }
    else{
      posX+=(pt.x-posX)*0.22;
      posY+=(pt.y-posY)*0.28;
    }
    pathT=t;
    traveler.style.transform='translate('+posX+'px,'+posY+'px)';
    /* When face is on the right, open chat toward the LEFT (inward) so it stays in frame */
    traveler.classList.toggle('chat-left', posX>=window.innerWidth*0.5);

    var band=document.getElementById('band');
    var onDark=false;
    if(band){
      var br=band.getBoundingClientRect();
      /* Only mark dark while the face is visually over the band — not when parked under it */
      onDark=posY>(window.scrollY+br.top+20) && posY<(window.scrollY+br.bottom-20);
    }
    root.classList.toggle('on-dark',onDark);
  }

  function placeFree(docX,docY,snap){
    if(isMobile()) return;
    var w=window.innerWidth;
    var h=pageH();
    docX=Math.max(52,Math.min(w-52,docX));
    docY=Math.max(90,Math.min(h-90,docY));
    if(snap || !hasPos){posX=docX;posY=docY;hasPos=true}
    else{
      posX+=(docX-posX)*0.14;
      posY+=(docY-posY)*0.16;
    }
    traveler.style.transform='translate('+posX+'px,'+posY+'px)';
    traveler.classList.toggle('chat-left',posX>=w*0.5);
    var band=document.getElementById('band');
    var onDark=false;
    if(band){
      var br=band.getBoundingClientRect();
      onDark=posY>(window.scrollY+br.top+20) && posY<(window.scrollY+br.bottom-20);
    }
    root.classList.toggle('on-dark',onDark);
  }

  function setChat(msg,opts){
    opts=opts||{};
    var allowCaption=autoTour || (tourMode && exploreMode && opts.force);
    if(!allowCaption){
      clearTimeout(chatTypeTimer);
      chat.classList.remove('is-on');
      chat.classList.remove('is-caption');
      return;
    }
    /* Caption always bottom-left — clear of the right-side face */
  chat.classList.add('is-caption');
  chat.classList.remove('is-caption-right');
    if(!msg){ chat.classList.remove('is-on'); return; }
    if(msg===activeMsg && chatText.dataset.full===msg){
      chat.classList.add('is-on');
      return;
    }
    activeMsg=msg;
    chatText.dataset.full=msg;
    clearTimeout(chatTypeTimer);
    chatText.textContent='';
    chat.classList.add('is-on');
    var i=0;
    function typeNext(){
      if(activeMsg!==msg) return;
      i++;
      chatText.textContent=msg.slice(0,i);
      if(i<msg.length) chatTypeTimer=setTimeout(typeNext, CHAT_MS_PER_CHAR);
    }
    typeNext();
  }

  function hideChat(){
    activeMsg='';
    clearTimeout(chatTypeTimer);
    if(chatText) delete chatText.dataset.full;
    chat.classList.remove('is-on');
    chat.classList.remove('is-caption');
    chat.classList.remove('is-caption-right');
  }

  function wrapLetters(el){
    if(!el) return [];
    if(el.dataset.lyricChars==='1'){
      return Array.prototype.slice.call(el.querySelectorAll('.lyric-char'));
    }
    function wrapNode(node){
      if(node.nodeType===3){
        var text=node.textContent;
        if(!text) return;
        var frag=document.createDocumentFragment();
        for(var i=0;i<text.length;i++){
          var ch=text.charAt(i);
          var s=document.createElement('span');
          s.className='lyric-char'+(ch===' '?' is-space':'');
          s.textContent=ch;
          frag.appendChild(s);
        }
        node.parentNode.replaceChild(frag,node);
      }else if(node.nodeType===1 && !node.classList.contains('lyric-char')){
        Array.prototype.slice.call(node.childNodes).forEach(wrapNode);
      }
    }
    Array.prototype.slice.call(el.childNodes).forEach(wrapNode);
    el.dataset.lyricChars='1';
    el.dataset.lyrics='1';
    return Array.prototype.slice.call(el.querySelectorAll('.lyric-char'));
  }

  function clearAllLyrics(){
    document.querySelectorAll('.is-lyrics').forEach(function(el){
      el.classList.remove('is-lyrics');
      el.querySelectorAll('.lyric-char').forEach(function(w){
        w.classList.add('is-on');
        w.style.opacity='';
      });
    });
    activeHead=null;
    activeWords=[];
    activeBlocks=[];
    manualHead=null;
  }

  function beginReadBlocks(blocks){
    clearActiveReadOnly();
    activeBlocks=blocks||[];
    activeWords=[];
    activeBlocks.forEach(function(block){
      block.classList.add('is-lyrics');
      var chars=wrapLetters(block);
      chars.forEach(function(c){
        c.classList.remove('is-on');
        c.style.opacity='0.14';
      });
      activeWords=activeWords.concat(chars);
    });
    activeHead=activeBlocks[0]||null;
  }

  function clearActiveReadOnly(){
    activeBlocks.forEach(function(block){
      block.classList.remove('is-lyrics');
      block.querySelectorAll('.lyric-char').forEach(function(w){
        w.classList.add('is-on');
        w.style.opacity='';
      });
    });
    activeBlocks=[];
    activeWords=[];
    activeHead=null;
  }

  function beginRead(head){
    beginReadBlocks(head?[head]:[]);
  }

  function setReadProgress(p){
    if(!activeWords.length) return;
    var base=0.14;
    if(activeBlocks.some(function(b){ return b.closest && b.closest('#band'); })) base=0.28;
    var cursor=Math.max(0,Math.min(1,p))*activeWords.length;
    activeWords.forEach(function(el,i){
      var d=cursor-i;
      var op;
      if(d>=1) op=1;
      else if(d<=0) op=base;
      else op=base+d*(1-base); /* smooth blend across the live letter */
      el.style.opacity=String(op);
      el.classList.toggle('is-on', op>0.55);
    });
  }

  function scrollHeat(){
    var max=Math.max(1,pageH()-window.innerHeight);
    return Math.max(0,Math.min(1,window.scrollY/max));
  }

  function scheduleHats(){
    if(!audioCtx || !musicOn || musicPaused || useFile) return;
    clearTimeout(hatTimer);
    var heat=scrollHeat();
    var gap=110-heat*55;
    var noiseBuf=audioCtx.createBuffer(1,audioCtx.sampleRate*0.04,audioCtx.sampleRate);
    var data=noiseBuf.getChannelData(0);
    for(var i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3);
    var src=audioCtx.createBufferSource();
    var g=audioCtx.createGain();
    var hp=audioCtx.createBiquadFilter();
    hp.type='highpass';hp.frequency.value=6000;
    g.gain.value=0.03+heat*0.04;
    src.buffer=noiseBuf;
    src.connect(hp);hp.connect(g);g.connect(master);
    src.start();
    hatTimer=setTimeout(scheduleHats,gap);
  }

  function scheduleKick(){
    if(!audioCtx || !musicOn || musicPaused || useFile) return;
    clearTimeout(kickTimer);
    var heat=scrollHeat();
    var o=audioCtx.createOscillator();
    var g=audioCtx.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(110,audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(38,audioCtx.currentTime+0.18);
    g.gain.setValueAtTime(0.0001,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.28+heat*0.2,audioCtx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.28);
    o.connect(g);g.connect(master);
    o.start();o.stop(audioCtx.currentTime+0.3);
    kickTimer=setTimeout(scheduleKick,520-heat*140);
  }

  function ensureAnalyser(){
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return false;
    if(!audioCtx){
      audioCtx=new AC();
      analyser=audioCtx.createAnalyser();
      analyser.fftSize=256;
      analyser.smoothingTimeConstant=0.68;
      freqData=new Uint8Array(analyser.frequencyBinCount);
      master=audioCtx.createGain();
      master.gain.value=0.0001;
      master.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    if(audioCtx.state==='suspended') audioCtx.resume();
    return true;
  }

  function readBass(){
    if(!analyser || !freqData || !musicOn || musicPaused) return 0;
    analyser.getByteFrequencyData(freqData);
    var sum=0,n=0,i;
    for(i=1;i<=8;i++){sum+=freqData[i];n++}
    var raw=(sum/n)/255;
    bassAvg+=(raw-bassAvg)*0.018;
    var floor=Math.max(0.06,bassAvg*0.75);
    var rel=(raw-floor)/Math.max(0.1,bassAvg*1.1);
    if(rel<0) rel=0;
    if(rel>1) rel=1;
    return rel;
  }

  function applyBassVibe(bass){
    var lerp=bass>bassSmooth?0.42:0.22;
    bassSmooth+=(bass-bassSmooth)*lerp;
    var b=bassSmooth;
    var rise=b-bassPrev;
    if(rise>0.05 && b>0.18) bassHit=Math.min(0.85,0.28+rise*2.1);
    else bassHit*=0.62;
    bassPrev=b;
    var env=Math.min(0.75,b*0.7+bassHit*0.55);
    window.__guideBass=musicOn&&!musicPaused?env:0;
    window.__guideBassHit=musicOn&&!musicPaused?bassHit*0.65:0;
    avatar.classList.toggle('is-bass',musicOn && !musicPaused && env>0.03);
    avatar.style.setProperty('--bass',env.toFixed(3));
    if(musicOn && !musicPaused){
      var jx=(Math.random()-0.5)*env*3;
      var jy=(Math.random()-0.5)*env*2.5;
      var rot=(Math.random()-0.5)*env*4;
      var sc=1+env*0.06;
      avatar.style.transform='translate('+jx.toFixed(2)+'px,'+jy.toFixed(2)+'px) scale('+sc.toFixed(3)+') rotate('+rot.toFixed(2)+'deg)';
    }else{
      avatar.style.transform='';
      avatar.style.removeProperty('--bass');
    }
  }

  function updateTension(){
    if(!musicOn || musicPaused || !audioCtx || useFile || !filter || !sub) return;
    var heat=scrollHeat();
    filter.frequency.setTargetAtTime(420+heat*3200,audioCtx.currentTime,0.25);
    master.gain.setTargetAtTime(Math.max(0.08,musicLevel*0.35+heat*0.22),audioCtx.currentTime,0.3);
    sub.frequency.setTargetAtTime(42+sectionIndex*2,audioCtx.currentTime,0.4);
  }

  function startSynth(){
    if(!ensureAnalyser()) return;
    clearTimeout(hatTimer);clearTimeout(kickTimer);
    filter=audioCtx.createBiquadFilter();
    filter.type='lowpass';
    filter.frequency.value=500;
    filter.Q.value=1.1;
    filter.connect(master);
    sub=audioCtx.createOscillator();
    var sg=audioCtx.createGain();
    sub.type='sine';
    sub.frequency.value=46;
    sg.gain.value=0.22;
    sub.connect(sg);sg.connect(master);
    sub.start();
    pads=[];
    [55,58.27,82.41,110].forEach(function(freq,n){
      var o=audioCtx.createOscillator();
      var g=audioCtx.createGain();
      o.type=n%2?'sawtooth':'triangle';
      o.frequency.value=freq;
      g.gain.value=n<2?0.035:0.02;
      o.connect(g);g.connect(filter);
      o.start();
      pads.push(o);
    });
    var lfo=audioCtx.createOscillator();
    var lg=audioCtx.createGain();
    lfo.frequency.value=0.07;
    lg.gain.value=220;
    lfo.connect(lg);lg.connect(filter.frequency);
    lfo.start();
    master.gain.exponentialRampToValueAtTime(Math.max(0.08,musicLevel*0.4),audioCtx.currentTime+0.8);
    scheduleHats();
    scheduleKick();
    useFile=false;
  }

  function startFileMusic(){
    if(!ensureAnalyser() || !track) return Promise.reject();
    if(!mediaSource){
      mediaSource=audioCtx.createMediaElementSource(track);
      mediaSource.connect(master);
    }
    track.volume=1;
    master.gain.setValueAtTime(0.0001,audioCtx.currentTime);
    master.gain.exponentialRampToValueAtTime(Math.max(0.05,musicLevel),audioCtx.currentTime+0.5);
    return track.play();
  }

  function showMusicDock(on){
    if(!musicDock) return;
    if(on){
      /* Always top-right — never follow the face around the page */
      musicDock.style.top='';
      musicDock.style.left='';
      musicDock.style.right='';
      musicDock.style.bottom='';
      musicDock.hidden=false;
    }else{
      musicDock.hidden=true;
    }
    syncDockIcons();
  }

  function syncDockIcons(){
    if(!musicDockToggle) return;
    var paused=musicPaused || !musicOn;
    musicDockToggle.classList.toggle('is-paused', !!paused);
    musicDockToggle.classList.toggle('is-playing', !paused);
    musicDockToggle.setAttribute('aria-label', paused?'Play music':'Pause music');
  }

  function startMusic(level){
    if(typeof level==='number') musicLevel=level;
    musicPaused=false;
    if(musicOn){
      if(audioCtx && master) master.gain.setTargetAtTime(musicLevel,audioCtx.currentTime,0.25);
      if(track && useFile) track.play().catch(function(){});
      showMusicDock(true);
      syncDockIcons();
      return Promise.resolve();
    }
    musicOn=true;
    avatar.classList.add('is-playing');
    avatar.classList.remove('is-invite');
    showMusicDock(true);
    if(track){
      return startFileMusic().then(function(){
        useFile=true;
        syncDockIcons();
      }).catch(function(){
        startSynth();
        syncDockIcons();
      });
    }
    startSynth();
    syncDockIcons();
    return Promise.resolve();
  }

  function pauseMusic(){
    if(!musicOn || musicPaused) return;
    musicPaused=true;
    if(track){ try{track.pause()}catch(e){} }
    if(audioCtx && master){
      try{master.gain.setTargetAtTime(0.0001,audioCtx.currentTime,0.15)}catch(e){}
    }
    syncDockIcons();
  }

  function resumeMusic(){
    if(!musicOn || !musicPaused) return;
    musicPaused=false;
    if(track && useFile) track.play().catch(function(){});
    if(audioCtx && master) master.gain.setTargetAtTime(musicLevel,audioCtx.currentTime,0.2);
    if(!useFile){ scheduleHats(); scheduleKick(); }
    syncDockIcons();
  }

  function stopMusic(){
    if(!musicOn) return;
    musicOn=false;
    musicPaused=false;
    avatar.classList.remove('is-playing');
    avatar.classList.remove('is-bass');
    avatar.style.transform='';
    avatar.style.removeProperty('--bass');
    bassSmooth=0;bassPrev=0;bassHit=0;bassAvg=0.12;
    window.__guideBass=0;
    window.__guideBassHit=0;
    clearTimeout(hatTimer);clearTimeout(kickTimer);
    if(track){try{track.pause();track.currentTime=0}catch(e){}}
    if(audioCtx && master){
      try{master.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.25)}catch(e){}
    }
    useFile=false;
    showMusicDock(false);
  }

  function cancelTourMotion(){
    cancelAnimationFrame(tourRaf);
    tourRaf=0;
    phase='idle';
  }

  function goToStart(){
    window.scrollTo(0,0);
    clearAllLyrics();
    hideChat();
    if(points[0]){
      pathT=points[0].t||0;
      placeOnPath(pathT,true);
    }
  }

  function abortTourToStart(e){
    if(!autoTour) return;
    if(Date.now()<ignoreUntil) return;
    if(e && e.target){
      if(avatar.contains(e.target)) return;
      if(menu && menu.contains(e.target)) return;
      if(musicDock && musicDock.contains(e.target)) return;
      if(e.target.closest && e.target.closest('.ai-overlay,.mp-hand')) return;
    }
    autoTour=false;
    root.classList.toggle('is-live', !isMobile());
    root.classList.remove('on-dark');
    cancelTourMotion();
    hideChat();
    if(musicOn) stopMusic();
    clearAllLyrics();
    goToStart();
  }

  function finishTour(){
    autoTour=false;
    phase='idle';
    root.classList.toggle('is-live', !isMobile());
    cancelTourMotion();
    setReadProgress(1);
    clearActiveReadOnly();
    hideChat();
  }

  function easeInOut(t){
    return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  }

  function startTravel(i){
    rebuild();
    if(i>=points.length){ finishTour(); return; }
    step=i;
    sectionIndex=i;
    var stop=points[i];
    phase='travel';
    phaseT0=performance.now();
    phaseDur=TRAVEL_MS;
    fromT=pathT;
    toT=stop.t!=null?stop.t:tForY(stop.y);
    fromScroll=window.scrollY;
    var blocks=lyricBlocksOf(stop.el);
    var head=blocks[0]||stop.head;
    var top=head
      ? (window.scrollY+head.getBoundingClientRect().top)
      : (window.scrollY+stop.el.getBoundingClientRect().top);
    toScroll=Math.max(0, top-window.innerHeight*0.28);
    setChat(stop.msg);
    /* dim upcoming lyric lines while approaching */
    beginReadBlocks(blocks);
    setReadProgress(0);
  }

  function startRead(i){
    var stop=points[i];
    beginReadBlocks(lyricBlocksOf(stop.el));
    var chars=activeWords.length||1;
    phase='read';
    phaseT0=performance.now();
    phaseDur=Math.max(2400, chars*MS_PER_CHAR);
    setChat(stop.msg);
    setReadProgress(0);
  }

  function tourFrame(now){
    if(!autoTour) return;
    var u=Math.min(1,(now-phaseT0)/Math.max(1,phaseDur));
    var e=easeInOut(u);

    if(phase==='travel'){
      var t=fromT+(toT-fromT)*e;
      placeOnPath(t,false);
      window.scrollTo(0, fromScroll+(toScroll-fromScroll)*e);
      setReadProgress(0);
      if(u>=1){
        placeOnPath(toT,true);
        window.scrollTo(0,toScroll);
        startRead(step);
      }
    }else if(phase==='read'){
      placeOnPath(toT,false);
      setReadProgress(u);
      updateTension();
      if(u>=1){
        setReadProgress(1);
        phase='hold';
        phaseT0=now;
        phaseDur=HOLD_MS;
      }
    }else if(phase==='hold'){
      placeOnPath(toT,false);
      setReadProgress(1);
      if(u>=1){
        clearActiveReadOnly();
        startTravel(step+1);
      }
    }

    tourRaf=requestAnimationFrame(tourFrame);
  }

  function startAutoTour(opts){
    opts=opts||{};
    if(isMobile()) return;
    if(autoTour) return;
    rebuild();
    autoTour=true;
    step=0;
    armX=null;armY=null;
    ignoreUntil=Date.now()+(opts.grace||1200);
    avatar.classList.remove('is-invite');
    root.classList.add('is-live');
    goToStart();
    musicLevel=typeof opts.volume==='number'?opts.volume:0.65;
    startMusic(musicLevel).catch(function(){});
    startTravel(0);
    cancelAnimationFrame(tourRaf);
    tourRaf=requestAnimationFrame(tourFrame);
  }

  /* Manual scroll: face rides the rail + lyric-read the section you're on */
  function exitExploreMode(){
    if(!exploreMode && !hoverLocked && !queuedHover) return;
    exploreMode=false;
    hoverArriving=null;
    hoverTargetKey='';
    hoverLocked=false;
    hoverDwellUntil=0;
    queuedHover=null;
    clearTimeout(hoverMoveTimer);
    hoverMoveTimer=null;
    root.classList.remove('is-explore');
    if(!tourMode) root.classList.toggle('is-live',!isMobile());
    hideChat();
    if(!tourMode && pathLen){
      var focusY=window.scrollY+window.innerHeight*0.38;
      placeOnPath(tForY(focusY),true);
      updateManualGuide();
    }
  }

  function enableTourMode(){
    tourMode=true;
    root.classList.add('is-tour-on');
    clearActiveReadOnly();
    manualHead=null;
    hideChat();
    syncTourButton();
  }

  function disableTourMode(){
    tourMode=false;
    root.classList.remove('is-tour-on');
    exitExploreMode();
    syncTourButton();
  }

  function toggleTourMode(){
    if(tourMode) disableTourMode();
    else enableTourMode();
  }

  function syncTourButton(){
    var menuTour=document.getElementById('menuTour');
    if(!menuTour) return;
    menuTour.classList.toggle('is-on',tourMode);
    menuTour.setAttribute('aria-pressed',tourMode?'true':'false');
  }

  function isFlyingToTarget(){
    if(!exploreMode) return false;
    return Math.hypot(flyTargetX-posX,flyTargetY-posY)>14;
  }

  function anchorForHover(target){
    if(!target) return null;
    if(target.anchor) return target.anchor;
    if(target.el){
      var h=target.el.querySelector('h1,h2,.svc-head,.eyebrow,.btn');
      return h||target.el;
    }
    return null;
  }

  function flyToHoverTarget(target){
    var anchor=anchorForHover(target);
    if(!anchor) return;
    exploreMode=true;
    root.classList.add('is-explore');
    root.classList.remove('is-live');
    clearActiveReadOnly();
    manualHead=null;
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
      if(hits[i].closest('.guide,.ai-overlay,.inq-overlay,.nav,.nav-dim,.music-dock,.preload')) continue;
      hit=hits[i];
      break;
    }
    if(!hit) return null;

    var svc=hit.closest('.svc-item');
    if(svc){
      var labelEl=svc.querySelector('.svc-label');
      var label=labelEl?labelEl.textContent.trim():'';
      return {
        key:'svc:'+label,
        pitch:SERVICE_PITCH[label]||('Strong '+label.toLowerCase()+' work is how brands stop looking like everyone else.'),
        anchor:svc.querySelector('.svc-head')||svc
      };
    }

    var guide=hit.closest('[data-guide]');
    if(guide){
      return {key:'sec:'+guide.id,pitch:sectionPitch(guide),anchor:headlineOf(guide)||guide};
    }

    if(hit.closest('.mp-overview-sec,.mp-card')){
      var market=document.getElementById('market');
      if(market) return {key:'sec:market',pitch:sectionPitch(market),anchor:market.querySelector('h2')||market};
    }

    if(hit.closest('.custom-sec,#openInquiry,#openInquiryTitle')){
      var custom=document.getElementById('custom');
      if(custom) return {key:'sec:custom',pitch:sectionPitch(custom),anchor:custom.querySelector('h2')||custom};
    }

    if(hit.closest('.work-showcase,.work-stage')){
      var work=document.getElementById('work');
      if(work) return {key:'sec:work',pitch:sectionPitch(work),anchor:work.querySelector('h2')||work};
    }

    if(hit.closest('.contact-grid a,.reach a')){
      return {
        key:'cta:contact',
        pitch:'One message starts the brief — email, phone, or DM. I reply fast.',
        anchor:hit.closest('a')||document.getElementById('contact')
      };
    }

    if(hit.closest('.btn,a')){
      var link=hit.closest('.btn,a');
      return {
        key:'cta:'+(link.textContent||'').trim().slice(0,40),
        pitch:'That\'s the move — tap through and let\'s make it real.',
        anchor:link
      };
    }

    return null;
  }

  function scheduleHoverTarget(target){
    if(!target || !tourMode || autoTour || isMobile()) return;
    if(target.key===hoverTargetKey && (hoverLocked || isFlyingToTarget())){
      queuedHover=target;
      return;
    }
    if(target.key===hoverTargetKey && !hoverLocked) return;
    if(hoverLocked || isFlyingToTarget()){
      queuedHover=target;
      return;
    }
    flyToHoverTarget(target);
  }

  function onTourPointer(clientX,clientY){
    if(!tourMode || autoTour || isMobile()) return;
    if(menu && !menu.hidden && menu.classList.contains('is-on')) return;
    var target=resolveHoverTarget(clientX,clientY);
    if(target) scheduleHoverTarget(target);
  }

  function updateManualGuide(){
    if(autoTour || isMobile() || exploreMode || tourMode) return;
    var focusY=window.scrollY+window.innerHeight*0.38;
    if(pathLen) placeOnPath(tForY(focusY),false);

    var bestStop=activeSectionFromScroll();
    if(!bestStop) return;
    var key=bestStop.el.id||bestStop.msg;
    if(manualHead!==key){
      clearActiveReadOnly();
      manualHead=key;
      beginReadBlocks(lyricBlocksOf(bestStop.el));
      bestStop.el._lyricT0=performance.now();
    }
    var chars=activeWords.length||1;
    var elapsed=performance.now()-(bestStop.el._lyricT0||performance.now());
    setReadProgress(Math.min(1,elapsed/(chars*MS_PER_CHAR)));
  }

  function updateExploreFly(){
    if(!exploreMode || !tourMode || autoTour || isMobile()) return;
    placeFree(flyTargetX,flyTargetY,false);
    var dist=Math.hypot(flyTargetX-posX,flyTargetY-posY);
    if(dist<14 && hoverArriving){
      hoverTargetKey=hoverArriving.key;
      setChat(hoverArriving.pitch,{force:true});
      hoverArriving=null;
      hoverDwellUntil=Date.now()+HOVER_DWELL;
      clearTimeout(hoverMoveTimer);
      hoverMoveTimer=setTimeout(function(){
        hoverLocked=false;
        hoverDwellUntil=0;
        if(queuedHover && queuedHover.key!==hoverTargetKey && tourMode){
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
    if(exploreMode) updateExploreFly();
    else if(!autoTour && !tourMode) updateManualGuide();
    if(musicOn) applyBassVibe(readBass());
    else if(bassSmooth>0.001) applyBassVibe(0);
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize',function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){
      rebuild();
      syncMobileGuide();
    },80);
  });
  window.addEventListener('load',rebuild);
  window.addEventListener('scroll',function(){
    if(!tourMode && !autoTour && !exploreMode) updateManualGuide();
    if(isMobile()) syncMobileGuide();
  },{passive:true});

  document.addEventListener('pointermove',function(e){
    onTourPointer(e.clientX,e.clientY);
  },{passive:true});

  document.addEventListener('pointerdown',function(e){
    if(tourMode && !autoTour && !isMobile()){
      if(e.target.closest && e.target.closest('.guide-menu,.guide-avatar,.music-dock')) return;
      onTourPointer(e.clientX,e.clientY);
      return;
    }
    if(!autoTour) return;
    abortTourToStart(e);
  },{passive:true});

  window.addEventListener('pointermove',function(e){
    if(!autoTour) return;
    if(Date.now()<ignoreUntil){
      armX=e.clientX;armY=e.clientY;
      return;
    }
    if(armX===null){ armX=e.clientX;armY=e.clientY; return; }
    if(Math.hypot(e.clientX-armX,e.clientY-armY)>30) abortTourToStart(e);
  },{passive:true});

  var menu=document.getElementById('guideMenu');
  function closeMenu(){
    if(!menu) return;
    menu.hidden=true;
    menu.classList.remove('is-on');
  }
  function openMenu(){
    if(!menu) return;
    menu.hidden=false;
    requestAnimationFrame(function(){menu.classList.add('is-on')});
  }

  avatar.addEventListener('click',function(e){
    e.stopPropagation();
    avatar.classList.remove('is-invite');
    /* Mobile: music only — no tour / eye / hand menu */
    if(isMobile()){
      closeMenu();
      if(!musicOn) startMusic(0.55).catch(function(){});
      else if(musicPaused) resumeMusic();
      else pauseMusic();
      return;
    }
    if(autoTour){
      ignoreUntil=0;
      abortTourToStart(null);
      closeMenu();
      return;
    }
    var menuOpen=menu && !menu.hidden && menu.classList.contains('is-on');
    if(menuOpen){
      closeMenu();
      return;
    }
    openMenu();
  });

  document.addEventListener('click',function(e){
    if(!menu || menu.hidden) return;
    if(menu.contains(e.target) || avatar.contains(e.target)) return;
    closeMenu();
  });

  if(musicDockToggle){
    musicDockToggle.addEventListener('click',function(e){
      e.stopPropagation();
      if(!musicOn) return;
      if(musicPaused) resumeMusic();
      else pauseMusic();
    });
  }
  if(musicDockClose){
    musicDockClose.addEventListener('click',function(e){
      e.stopPropagation();
      stopMusic();
      if(autoTour){
        ignoreUntil=0;
        abortTourToStart(null);
      }
    });
  }

  var menuTour=document.getElementById('menuTour');
  var menuChat=document.getElementById('menuChatAi');
  var menuEye=document.getElementById('menuEye');
  var menuHand=document.getElementById('menuHand');
  var menuMusic=document.getElementById('menuMusic');
  var overlay=document.getElementById('aiOverlay');
  var aiClose=document.getElementById('aiClose');
  var eyeToggle=document.getElementById('eyeToggle');
  var handToggle=document.getElementById('handToggle');

  if(menuTour){
    menuTour.addEventListener('click',function(){
      closeMenu();
      toggleTourMode();
    });
  }
  if(menuChat){
    menuChat.addEventListener('click',function(){
      closeMenu();
      if(overlay){
        overlay.classList.add('is-on');
        overlay.setAttribute('aria-hidden','false');
        if(window.XBigX) window.XBigX.bindPanel(overlay);
      }
    });
  }
  if(menuEye){
    menuEye.addEventListener('click',function(){
      closeMenu();
      if(eyeToggle) eyeToggle.hidden=false;
      if(handToggle) handToggle.hidden=true;
      if(window.BigBrainEye && !window.BigBrainEye.isRunning()){
        window.BigBrainEye.start().catch(function(){ alert('Camera permission needed for eye control.'); });
      }
    });
  }
  if(menuHand){
    menuHand.addEventListener('click',function(){
      closeMenu();
      if(handToggle) handToggle.hidden=false;
      if(eyeToggle) eyeToggle.hidden=true;
      if(window.BigBrainHand && !window.BigBrainHand.isRunning()){
        window.BigBrainHand.start().catch(function(){ alert('Camera permission needed for hand control.'); });
      }
    });
  }
  if(menuMusic){
    menuMusic.addEventListener('click',function(){
      closeMenu();
      if(musicOn) stopMusic();
      else startMusic(0.65);
    });
  }
  if(aiClose && overlay){
    aiClose.addEventListener('click',function(){
      overlay.classList.remove('is-on');
      overlay.setAttribute('aria-hidden','true');
    });
    overlay.addEventListener('click',function(e){
      if(e.target===overlay){
        overlay.classList.remove('is-on');
        overlay.setAttribute('aria-hidden','true');
      }
    });
  }

  function syncMobileGuide(){
    if(!isMobile()){
      root.classList.remove('is-mobile-music');
      avatar.style.left='';
      avatar.style.top='';
      avatar.style.right='';
      avatar.style.bottom='';
      avatar.style.position='';
      avatar.style.margin='';
      avatar.style.transform='';
      return;
    }
    root.classList.add('is-mobile-music');
    root.setAttribute('aria-hidden','false');
    /* Always pin to the right — stay findable while scrolling */
    var art=document.getElementById('artInner')||document.querySelector('.art');
    var top;
    if(art){
      var r=art.getBoundingClientRect();
      if(r.bottom>100 && r.top<window.innerHeight-60){
        top=Math.max(100, Math.min(window.innerHeight-80, r.top+r.height*0.4));
      }else{
        top=Math.round(window.innerHeight*0.42);
      }
    }else{
      top=Math.round(window.innerHeight*0.42);
    }
    avatar.style.position='fixed';
    avatar.style.left='auto';
    avatar.style.right='16px';
    avatar.style.top=top+'px';
    avatar.style.bottom='auto';
    avatar.style.margin='0';
    avatar.style.transform='none';
    avatar.style.zIndex='81';
    traveler.style.transform='none';
  }

  function playMobileIntro(){
    if(!isMobile()) return;
    avatar.classList.remove('is-invite');
    avatar.classList.add('is-shake');
    setTimeout(function(){
      avatar.classList.remove('is-shake');
      avatar.classList.add('is-live-dot');
    },900);
  }

  rebuild();
  setTimeout(rebuild,300);
  hideChat();
  avatar.classList.add('is-invite');
  syncMobileGuide();
  requestAnimationFrame(tick);

  /* Manual guide only — no auto tour on first visit */
  setTimeout(function(){ updateManualGuide(); },120);
  setTimeout(function(){ updateManualGuide(); },500);
  setTimeout(syncMobileGuide,200);
  setTimeout(syncMobileGuide,800);
  setTimeout(playMobileIntro,600);

  function onNarrowChange(){
    syncMobileGuide();
    if(isMobile()){
      if(tourMode) disableTourMode();
      closeMenu();
    }
  }
  if(narrowMq.addEventListener) narrowMq.addEventListener('change', onNarrowChange);
  else if(narrowMq.addListener) narrowMq.addListener(onNarrowChange);

  window.BigBrainTour={
    start:enableTourMode,
    stop:disableTourMode,
    abort:function(){ disableTourMode(); ignoreUntil=0; abortTourToStart(null); },
    isRunning:function(){ return tourMode || autoTour; }
  };
})();
