const cursorEl = document.getElementById('cursor');
const trailEl  = document.getElementById('cursor-trail');

cursorEl.style.opacity = '0';
trailEl.style.opacity  = '0';
let cursorVisible = false;
document.addEventListener('mousemove', e => {
  if(!cursorVisible){
    cursorEl.style.opacity = '1';
    trailEl.style.opacity  = '1';
    cursorVisible = true;
  }
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';

  trailEl.style.left = e.clientX + 'px';
  trailEl.style.top  = e.clientY + 'px';
});