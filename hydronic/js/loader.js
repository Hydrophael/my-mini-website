(function(){
  const stars = document.getElementById('l-stars');
  for(let i=0;i<120;i++){
    const s = document.createElement('div');
    s.className = 'l-star';
    const size = Math.random()*2+0.5;
    const dur  = (Math.random()*3+1.5).toFixed(2);
    const del  = (Math.random()*4).toFixed(2);
    const minO = (Math.random()*0.1+0.05).toFixed(2);
    const maxO = (Math.random()*0.7+0.2).toFixed(2);
    s.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${size}px;height:${size}px;
      --dur:${dur}s;--delay:${del}s;
      --min:${minO};--max:${maxO};
    `;
    stars.appendChild(s);
  }
})();

const phases = [
  {text:'Calibrating orbit paths...',pct:18},
  {text:'Rendering stellar bodies...',pct:42},
  {text:'Mapping identity to planets...',pct:72},
  {text:'Charging solar arrays...',pct:91},
  {text:'Ready.',pct:100},
];
const fillEl   = document.getElementById('l-fill');
const statusEl = document.getElementById('l-status');
const titleEl  = document.getElementById('l-title');
const typedEl  = document.getElementById('l-typed');
const pctEl    = document.getElementById('l-pct');
const welcome  = '⚡ Welcome to my Solar System';
let phaseIdx=0, charIdx=0;

function animatePct(from, to, dur) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1-t, 3);
    const val = Math.round(from + (to - from) * ease);
    if(pctEl) pctEl.textContent = val + '%';
    if(t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

let prevPct = 0;
function runLoader(){
  if(phaseIdx >= phases.length) return;
  const p=phases[phaseIdx++];
  statusEl.textContent=p.text;
  fillEl.style.width=p.pct+'%';
  animatePct(prevPct, p.pct, 350);
  prevPct = p.pct;
  if(phaseIdx<phases.length) setTimeout(runLoader, 320);
  else setTimeout(typeWelcome, 140);
}
function typeWelcome(){
  titleEl.classList.add('on');
  if(charIdx<welcome.length){
    typedEl.textContent+=welcome[charIdx++];
    setTimeout(typeWelcome,28);
  } else {
    setTimeout(()=>{
      document.getElementById('loader').classList.add('out');
      document.getElementById('main-nav').style.opacity='1';
      document.getElementById('intro-hud').style.opacity='1';
      document.getElementById('hud-bar').style.opacity='1';
      document.getElementById('legend').style.opacity='1';
    }, 600);
  }
}