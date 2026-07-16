/* Webcam eye / head control — look up or down to scroll the page */
(function(){
  var toggle=document.getElementById('eyeToggle');
  var preview=document.getElementById('handPreview');
  var video=document.getElementById('handVideo');
  var canvas=document.getElementById('handCanvas');
  var hint=document.getElementById('handHint');
  var stopBtn=document.getElementById('camStop');
  if(!toggle || !video || !canvas) return;

  var running=false;
  var faceMesh=null;
  var raf=0;
  var stream=null;
  var neutral=null;
  var samples=0;
  var ctx=canvas.getContext('2d');
  var busy=false;
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
    toggle.textContent=on?'Eye control on':'Enable eye control';
    toggle.hidden=!on;
    if(preview) preview.classList.toggle('is-on',on);
    if(stopBtn) stopBtn.hidden=!on;
    if(!on && hint){ hint.hidden=true; hint.textContent=''; }
  }

  function pitchFromLandmarks(lm){
    var forehead=lm[10], chin=lm[152], nose=lm[1];
    if(!forehead||!chin||!nose) return null;
    var span=chin.y-forehead.y;
    if(span<0.04) return null;
    return (nose.y-forehead.y)/span;
  }

  function onResults(results){
    if(!running) return;
    var w=video.videoWidth||640;
    var h=video.videoHeight||480;
    if(canvas.width!==w) canvas.width=w;
    if(canvas.height!==h) canvas.height=h;
    ctx.save();
    ctx.clearRect(0,0,w,h);
    if(results.image) ctx.drawImage(results.image,0,0,w,h);
    else ctx.drawImage(video,0,0,w,h);

    var lm=results.multiFaceLandmarks && results.multiFaceLandmarks[0];
    if(!lm){
      setHint('Face the camera');
      ctx.restore();
      return;
    }

    ctx.fillStyle='#fafafa';
    [33,133,362,263,1].forEach(function(i){
      var p=lm[i];
      if(!p) return;
      ctx.beginPath();
      ctx.arc(p.x*w,p.y*h,3,0,Math.PI*2);
      ctx.fill();
    });

    var t=pitchFromLandmarks(lm);
    if(t===null){ ctx.restore(); return; }

    if(samples<20){
      neutral=neutral===null?t:neutral*0.85+t*0.15;
      samples++;
      setHint('Calibrating… hold still ('+samples+'/20)');
      ctx.restore();
      return;
    }

    var delta=t-neutral;
    var dead=0.028;
    if(Math.abs(delta)<dead){
      setHint('Look up / down to scroll');
      ctx.restore();
      return;
    }

    var speed=Math.min(28, Math.abs(delta)*220);
    var dy=delta>0?speed:-speed;
    window.scrollBy(0,dy);
    setHint(delta>0?'Scrolling down…':'Scrolling up…');
    ctx.restore();
  }

  async function ensureMesh(){
    if(faceMesh) return faceMesh;
    if(typeof FaceMesh==='undefined'){
      throw new Error('FaceMesh library missing');
    }
    faceMesh=new FaceMesh({locateFile:function(file){
      return 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/'+file;
    }});
    faceMesh.setOptions({
      maxNumFaces:1,
      refineLandmarks:true,
      minDetectionConfidence:0.5,
      minTrackingConfidence:0.5
    });
    faceMesh.onResults(onResults);
    return faceMesh;
  }

  async function tick(){
    if(!running) return;
    if(!busy && video.readyState>=2 && faceMesh){
      busy=true;
      try{ await faceMesh.send({image:video}); }
      catch(e){ console.warn(e); }
      busy=false;
    }
    raf=requestAnimationFrame(tick);
  }

  async function start(){
    if(running) return;
    if(window.BigBrainHand && window.BigBrainHand.isRunning()){
      window.BigBrainHand.stop();
    }

    await ensureMesh();

    stream=await navigator.mediaDevices.getUserMedia({
      video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},
      audio:false
    });
    video.srcObject=stream;
    video.playsInline=true;
    video.muted=true;
    await video.play();

    neutral=null;
    samples=0;
    setStatus(true);
    setHint('Hold still to calibrate');
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(tick);
  }

  function stop(){
    setStatus(false);
    cancelAnimationFrame(raf);
    raf=0;
    busy=false;
    neutral=null;
    samples=0;
    if(stream){
      stream.getTracks().forEach(function(t){t.stop()});
      stream=null;
    }
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
      alert('Camera permission is required for eye control.');
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

  window.BigBrainEye={
    start:start,
    stop:stop,
    isRunning:function(){ return running; }
  };
})();
