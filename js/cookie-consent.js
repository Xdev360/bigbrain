/* Minimal glassmorphism cookie consent — shows once until a choice is stored */
(function(){
  var STORAGE_KEY = 'bb-cookie-consent';

  function stored(){
    try{ return localStorage.getItem(STORAGE_KEY); }
    catch(e){ return null; }
  }

  function save(value){
    try{ localStorage.setItem(STORAGE_KEY, value); }
    catch(e){}
  }

  function build(){
    if(stored()) return;
    if(document.querySelector('.cookie-consent')) return;

    var wrap = document.createElement('section');
    wrap.className = 'cookie-consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-label', 'Cookie consent');
    wrap.innerHTML = ''+
      '<div class="cookie-card">'+
        '<div class="cookie-body">'+
          '<p class="cookie-title">Cookies</p>'+
          '<p class="cookie-text">This site uses cookies to keep things smooth and understand how the work is viewed. Accept to continue.</p>'+
        '</div>'+
        '<div class="cookie-actions">'+
          '<button type="button" class="cookie-btn cookie-btn-ghost" data-cookie="decline">Decline</button>'+
          '<button type="button" class="cookie-btn cookie-btn-accept" data-cookie="accept">Accept</button>'+
        '</div>'+
      '</div>';

    document.body.appendChild(wrap);

    function close(choice){
      save(choice);
      wrap.classList.remove('is-visible');
      wrap.addEventListener('transitionend', function(){
        if(wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }, { once: true });
      /* fallback removal if transitionend doesn't fire */
      setTimeout(function(){ if(wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 600);
    }

    wrap.querySelector('[data-cookie="accept"]').addEventListener('click', function(){ close('accepted'); });
    wrap.querySelector('[data-cookie="decline"]').addEventListener('click', function(){ close('declined'); });

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ wrap.classList.add('is-visible'); });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  }else{
    build();
  }
})();
