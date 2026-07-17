/* BigBrain marketplace — demo auth stored in localStorage (front-end only) */
(function(global){
  var KEY='bigbrain-mp-user';

  function getUser(){
    try{
      var raw=localStorage.getItem(KEY);
      return raw?JSON.parse(raw):null;
    }catch(e){ return null; }
  }

  function setUser(user){
    try{ localStorage.setItem(KEY,JSON.stringify(user)); }catch(e){}
  }

  function signOut(){
    try{ localStorage.removeItem(KEY); }catch(e){}
  }

  function initials(name){
    return (name||'?').trim().split(/\s+/).slice(0,2).map(function(w){
      return w.charAt(0).toUpperCase();
    }).join('');
  }

  global.MPAuth={getUser:getUser,setUser:setUser,signOut:signOut,initials:initials};
})(window);
