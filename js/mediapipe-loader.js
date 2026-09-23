/* Loads the MediaPipe scripts only when eye or hand control is first switched on.
   Keeps ~4 CDN scripts off the initial page load. */
(function(){
  var URLS=[
    'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
    'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
    'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js',
    'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js'
  ];
  var pending=null;
  function load(src){
    return new Promise(function(res,rej){
      var s=document.createElement('script');
      s.src=src; s.async=true; s.crossOrigin='anonymous';
      s.onload=res; s.onerror=function(){ rej(new Error('Failed to load '+src)); };
      document.head.appendChild(s);
    });
  }
  window.loadMediaPipe=function(){
    if(pending) return pending;
    pending=URLS.reduce(function(p,u){ return p.then(function(){ return load(u); }); }, Promise.resolve());
    pending.catch(function(){ pending=null; });
    return pending;
  };
})();
