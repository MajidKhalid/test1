/* SPARK v4 · Phase B motion driver: restrained card tilt + pointer parallax on .de-field layers.
   No WebGL. Frozen under prefers-reduced-motion. */
(function(){
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
/* tilt (≤3 .tiltcard per page) */
[].slice.call(document.querySelectorAll('.tiltcard')).slice(0,3).forEach(function(c){
  c.addEventListener('pointermove',function(e){
    var r=c.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    c.style.setProperty('--tx',(x*5).toFixed(2)+'deg');
    c.style.setProperty('--ty',(-y*4).toFixed(2)+'deg');
  });
  c.addEventListener('pointerleave',function(){
    c.style.setProperty('--tx','0deg');c.style.setProperty('--ty','0deg');
  });
});
/* pointer parallax on decorated fields */
[].slice.call(document.querySelectorAll('.de-field[data-plx]')).forEach(function(field){
  var host=field.parentElement,els=[].slice.call(field.querySelectorAll('[data-depth]'));
  if(!els.length)return;
  var tx=0,ty=0,cx=0,cy=0,raf=null,rect=null;
  function measure(){rect=host.getBoundingClientRect()}
  measure();window.addEventListener('resize',measure);
  host.addEventListener('pointermove',function(e){
    if(!rect)measure();
    tx=((e.clientX-rect.left)/rect.width-.5)*2;
    ty=((e.clientY-rect.top)/Math.max(rect.height,1)-.5)*2;
    kick();
  },{passive:true});
  host.addEventListener('pointerleave',function(){tx=0;ty=0;kick()},{passive:true});
  function kick(){if(!raf)raf=requestAnimationFrame(tick)}
  function tick(){
    raf=null;cx+=(tx-cx)*.06;cy+=(ty-cy)*.06;
    els.forEach(function(el){
      var d=+el.getAttribute('data-depth')||.1;
      el.style.translate=(cx*d*24).toFixed(1)+'px '+(cy*d*18).toFixed(1)+'px';
    });
    if(Math.abs(tx-cx)>.004||Math.abs(ty-cy)>.004)kick();
  }
})
})();
