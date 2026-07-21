/* Services accordion — homepage */
(function(){
  var root=document.getElementById('svcAcc');
  if(!root) return;
  var items=Array.prototype.slice.call(root.querySelectorAll('[data-svc]'));

  function closeAll(except){
    items.forEach(function(item){
      if(item===except) return;
      item.classList.remove('is-open');
      var btn=item.querySelector('.svc-head');
      if(btn) btn.setAttribute('aria-expanded','false');
    });
  }

  items.forEach(function(item){
    var btn=item.querySelector('.svc-head');
    if(!btn) return;
    btn.addEventListener('click',function(e){
      e.preventDefault();
      var open=item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
})();
