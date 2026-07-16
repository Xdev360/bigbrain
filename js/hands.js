/* Webcam hand control — move hand up/down to scroll */
(function(){
  var toggle=document.getElementById('handToggle');
  var preview=document.getElementById('handPreview');
  var video=document.getElementById('handVideo');
  var canvas=document.getElementById('handCanvas');
  var hint=document.getElementById('handHint');
  var stopBtn=document.getElementById('camStop');
  var scroller=document.scrollingElement||document.documentElement;
  if(!toggle || !video || !canvas) return;

  var running=false;
  var camera=null;
  var hands=null;
  var lastY=null;
  var ctx=canvas.getContext('2d');
  var EXIT='Click “Turn off camera” below to exit.';

  function setHint(main){
    if(!hint) return;
    hint.hidden=!running;
    if(!running){ hint.textContent=''; return; }
    hint.innerHTML='<strong>'+main+'</strong>'+EXIT;
  }

  function setStatus(on){
    running=on;
    toggle.classList.toggle('is-on',on);
    toggle.textContent=on?'Hand control on':'Enable hand control';
    toggle.hidden=!on;
    if(preview) preview.classList.toggle('is-on',on);
    if(stopBtn) stopBtn.hidden=!on;
    if(!on && hint){ hint.hidden=true; hint.textContent=''; }
  }

  function scrollByPx(dy){
    if(!scroller) return;
    if(scroller===document.scrollingElement || scroller===document.documentElement || scroller===document.body){
      window.scrollBy(0,dy);
    }else{
      scroller.scrollTop+=dy;
    }
  }

  function onResults(results){
    if(!running) return;
    canvas.width=video.videoWidth||640;
    canvas.height=video.videoHeight||480;
    ctx.save();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(results.image,0,0,canvas.width,canvas.height);

    var landmarks=results.multiHandLandmarks && results.multiHandLandmarks[0];
    if(!landmarks){
      lastY=null;
      setHint('Show your hand to the camera');
      ctx.restore();
      return;
    }

    if(window.drawConnectors && window.HAND_CONNECTIONS){
      drawConnectors(ctx,landmarks,HAND_CONNECTIONS,{color:'#fafafa',lineWidth:2});
      drawLandmarks(ctx,landmarks,{color:'#a1a1aa',lineWidth:1,radius:2});
    }

    var y=(landmarks[0].y+landmarks[9].y)*0.5;
    var open=Math.hypot(landmarks[4].x-landmarks[20].x,landmarks[4].y-landmarks[20].y);
    var paused=open<0.12;

    setHint(paused
      ? 'Paused — open your hand wider to scroll'
      : 'Move hand up/down to scroll');

    if(!paused && lastY!==null){
      var dy=(y-lastY)*900;
      if(Math.abs(dy)>1.2) scrollByPx(dy);
    }
    lastY=y;

    ctx.restore();
  }

  async function start(){
    if(window.BigBrainEye && window.BigBrainEye.isRunning()){
      window.BigBrainEye.stop();
    }
    if(typeof Hands==='undefined' || typeof Camera==='undefined'){
      alert('Hand tracking library failed to load. Check your network and try again.');
      return;
    }
    hands=new Hands({locateFile:function(file){
      return 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/'+file;
    }});
    hands.setOptions({
      maxNumHands:1,
      modelComplexity:1,
      minDetectionConfidence:0.65,
      minTrackingConfidence:0.55
    });
    hands.onResults(onResults);

    camera=new Camera(video,{
      onFrame:async function(){ if(running && hands) await hands.send({image:video}); },
      width:640,
      height:480
    });
    await camera.start();
    setStatus(true);
    setHint('Move hand up/down to scroll');
  }

  function stop(){
    setStatus(false);
    lastY=null;
    if(camera && camera.stop) camera.stop();
    if(video.srcObject){
      video.srcObject.getTracks().forEach(function(t){t.stop()});
      video.srcObject=null;
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  toggle.addEventListener('click',function(){
    if(running) stop();
    else start().catch(function(err){
      console.error(err);
      alert('Camera permission is required for hand control.');
      stop();
    });
  });

  if(stopBtn && !stopBtn.dataset.bound){
    stopBtn.dataset.bound='1';
    stopBtn.addEventListener('click',function(){
      if(window.BigBrainEye && window.BigBrainEye.isRunning()) window.BigBrainEye.stop();
      if(window.BigBrainHand && window.BigBrainHand.isRunning()) window.BigBrainHand.stop();
    });
  }

  window.BigBrainHand={
    start:function(){ return start(); },
    stop:stop,
    isRunning:function(){ return running; }
  };
})();
