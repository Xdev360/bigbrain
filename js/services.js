/* Services — stable hover (no between-row glitch) + solfege */
(function(){
  var root=document.getElementById('svcAcc');
  if(!root) return;
  var items=Array.prototype.slice.call(root.querySelectorAll('[data-svc]'));
  if(!items.length) return;

  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse=window.matchMedia('(hover: none)').matches;
  var NOTES=[523.25,587.33,659.25,698.46,783.99];
  var audioCtx=null;
  var active=null;
  var lockUntil=0;
  var pending=null;
  var flushTimer=null;
  var closeTimer=null;
  var inside=false;

  function ensureAudio(){
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return null;
    if(!audioCtx) audioCtx=new AC();
    return audioCtx;
  }

  function tone(index){
    if(reduced) return;
    var ctx=ensureAudio();
    if(!ctx) return;

    function run(){
      var freq=NOTES[index%NOTES.length];
      var t=ctx.currentTime;
      var master=ctx.createGain();
      master.gain.setValueAtTime(0.0001,t);
      master.gain.exponentialRampToValueAtTime(0.2,t+0.006);
      master.gain.exponentialRampToValueAtTime(0.0001,t+0.2);
      master.connect(ctx.destination);

      function partial(type, mult, level, dur){
        var o=ctx.createOscillator();
        var g=ctx.createGain();
        o.type=type;
        o.frequency.setValueAtTime(freq*mult,t);
        g.gain.setValueAtTime(level,t);
        g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
        o.connect(g);g.connect(master);
        o.start(t);o.stop(t+dur+0.02);
      }
      partial('triangle',1,0.7,0.18);
      partial('sine',2,0.38,0.12);
      partial('sine',3,0.16,0.08);
      partial('sine',4,0.07,0.05);
    }

    if(ctx.state==='suspended') ctx.resume().then(run).catch(function(){});
    else run();
  }

  function applyOpen(item, play){
    var idx=items.indexOf(item);
    items.forEach(function(el){
      var on=el===item;
      el.classList.toggle('is-open', on);
      var btn=el.querySelector('.svc-head');
      if(btn) btn.setAttribute('aria-expanded', on?'true':'false');
    });
    active=item;
    lockUntil=performance.now()+340;
    if(play && idx>=0) tone(idx);

    if(flushTimer) clearTimeout(flushTimer);
    flushTimer=setTimeout(function(){
      flushTimer=null;
      if(pending && pending!==active && inside){
        var next=pending;
        pending=null;
        applyOpen(next, true);
      }else{
        pending=null;
      }
    },350);
  }

  function setActive(item, play){
    if(!item || active===item){
      pending=null;
      return;
    }
    /* While a row is expanding, layout shifts under the cursor.
       Queue the real target instead of flipping back and forth. */
    if(performance.now()<lockUntil && active){
      pending=item;
      return;
    }
    pending=null;
    applyOpen(item, play);
  }

  function closeAll(){
    if(flushTimer){ clearTimeout(flushTimer); flushTimer=null; }
    pending=null;
    items.forEach(function(el){
      el.classList.remove('is-open');
      var btn=el.querySelector('.svc-head');
      if(btn) btn.setAttribute('aria-expanded','false');
    });
    active=null;
    lockUntil=0;
  }

  function cancelClose(){
    if(closeTimer){ clearTimeout(closeTimer); closeTimer=null; }
  }

  function scheduleClose(){
    cancelClose();
    closeTimer=setTimeout(function(){
      closeTimer=null;
      if(!inside) closeAll();
    },100);
  }

  function itemFromEvent(e){
    var node=e.target;
    if(node && node.nodeType===3) node=node.parentElement;
    if(!node || !node.closest) return null;
    var hit=node.closest('[data-svc]');
    return (hit && root.contains(hit)) ? hit : null;
  }

  if(!coarse){
    root.addEventListener('pointerenter',function(){
      inside=true;
      cancelClose();
    });

    root.addEventListener('pointermove',function(e){
      inside=true;
      cancelClose();
      var hit=itemFromEvent(e);
      if(hit) setActive(hit, true);
    });

    root.addEventListener('pointerleave',function(){
      inside=false;
      scheduleClose();
    });
  }

  items.forEach(function(item){
    var btn=item.querySelector('.svc-head');
    if(!btn) return;
    btn.addEventListener('click',function(e){
      e.preventDefault();
      ensureAudio();
      lockUntil=0;
      pending=null;
      if(coarse && active===item){ closeAll(); return; }
      applyOpen(item, true);
    });
  });

  function unlock(){
    var ctx=ensureAudio();
    if(ctx && ctx.state==='suspended') ctx.resume();
  }
  window.addEventListener('pointerdown',unlock,{once:true,passive:true});
})();
