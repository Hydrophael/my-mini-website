function makeTex(type, colorHex) {
  const S = isMobile ? 256 : 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const r = (colorHex >> 16) & 255;
  const g = (colorHex >> 8) & 255;
  const b = colorHex & 255;

  const fill = (color) => { ctx.fillStyle = color; ctx.fillRect(0,0,S,S); };
  const noise = (n, alpha, bright) => {
    for(let i=0;i<n;i++){
      const px = Math.random()*S, py = Math.random()*S;
      const cr = Math.random()*3.5;
      ctx.beginPath(); ctx.arc(px,py,cr,0,Math.PI*2);
      const delta = bright ? 50 : -50;
      ctx.fillStyle = `rgba(${Math.max(0,Math.min(255,r+delta+Math.random()*40-20))},${Math.max(0,Math.min(255,g+delta+Math.random()*40-20))},${Math.max(0,Math.min(255,b+delta+Math.random()*40-20))},${alpha*Math.random()})`;
      ctx.fill();
    }
  };

  if(type === 'sun') {
    const grd = ctx.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
    grd.addColorStop(0,'#fff9e8');
    grd.addColorStop(0.18,'#ffe580');
    grd.addColorStop(0.5,'#ffaa22');
    grd.addColorStop(0.8,'#ff6600');
    grd.addColorStop(1,'#cc2200');
    ctx.fillStyle = grd; ctx.fillRect(0,0,S,S);

    for(let i=0;i<500;i++){
      const px=Math.random()*S, py=Math.random()*S;
      const rad = Math.random()*8+2;
      const bright = Math.random() > 0.4;
      ctx.beginPath(); ctx.arc(px,py,rad,0,Math.PI*2);
      ctx.fillStyle = bright ? `rgba(255,240,120,${Math.random()*0.4+0.1})` : `rgba(180,80,0,${Math.random()*0.3})`;
      ctx.fill();
    }

    for(let i=0;i<12;i++){
      const angle = (i/12)*Math.PI*2;
      const len = S*0.3 + Math.random()*S*0.25;
      ctx.beginPath();
      ctx.moveTo(S/2,S/2);
      ctx.lineTo(S/2 + Math.cos(angle)*len, S/2 + Math.sin(angle)*len);
      ctx.strokeStyle = `rgba(255,200,50,${Math.random()*0.15})`;
      ctx.lineWidth = Math.random()*4+1;
      ctx.stroke();
    }
  }
  else if(type === 'mercury') {
    fill(`rgb(${r},${g},${b})`);
    noise(600, 0.5, false); noise(200, 0.3, true);

    for(let i=0;i<18;i++){
      const cx=Math.random()*S, cy=Math.random()*S, cr=Math.random()*14+3;
      ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2);
      ctx.strokeStyle='rgba(80,80,80,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
      ctx.fillStyle='rgba(60,60,60,0.3)'; ctx.fill();
    }
  }
  else if(type === 'venus') {
    fill(`rgb(${r},${g},${b})`);

    for(let i=0;i<8;i++){
      const y = (i/8)*S;
      const h = S/8 + Math.random()*20;
      ctx.fillStyle=`rgba(${Math.min(255,r-20+i*5)},${Math.max(0,g-30)},${Math.max(0,b-40)},0.5)`;
      ctx.fillRect(0,y,S,h);
    }
    noise(300, 0.25, false);
  }
  else if(type === 'earth') {

    const grd = ctx.createLinearGradient(0,0,S,S);
    grd.addColorStop(0,'#1a5fa0'); grd.addColorStop(1,'#0e3d70');
    ctx.fillStyle = grd; ctx.fillRect(0,0,S,S);

    const continents = [
      {x:0.12,y:0.2,w:0.18,h:0.32},{x:0.4,y:0.15,w:0.22,h:0.28},
      {x:0.62,y:0.3,w:0.18,h:0.22},{x:0.25,y:0.55,w:0.15,h:0.2},
      {x:0.55,y:0.6,w:0.25,h:0.25},{x:0.08,y:0.6,w:0.1,h:0.12},
      {x:0.7,y:0.1,w:0.12,h:0.15},{x:0.45,y:0.72,w:0.08,h:0.2},
    ];
    ctx.fillStyle='#2d8c45';
    continents.forEach(({x,y,w,h}) => {
      ctx.beginPath();
      ctx.ellipse(x*S,y*S,w*S*0.5,h*S*0.5,Math.random()*Math.PI,0,Math.PI*2);
      ctx.fill();
    });

    ctx.fillStyle='rgba(240,248,255,0.85)';
    ctx.fillRect(0,0,S,14); ctx.fillRect(0,S-14,S,14);

    ctx.fillStyle='rgba(255,255,255,0.38)';
    for(let i=0;i<12;i++){
      ctx.beginPath();
      ctx.ellipse(Math.random()*S,Math.random()*S,Math.random()*60+20,Math.random()*16+6,Math.random()*Math.PI,0,Math.PI*2);
      ctx.fill();
    }
  }
  else if(type === 'mars') {
    const grd = ctx.createRadialGradient(S*0.4,S*0.4,0,S/2,S/2,S*0.7);
    grd.addColorStop(0,'#d4600a'); grd.addColorStop(1,'#7a2500');
    ctx.fillStyle = grd; ctx.fillRect(0,0,S,S);
    noise(400, 0.4, false); noise(200, 0.3, true);

    ctx.fillStyle='rgba(230,220,210,0.7)';
    ctx.beginPath(); ctx.ellipse(S/2,14,S*0.35,16,0,0,Math.PI*2); ctx.fill();

    ctx.strokeStyle='rgba(100,30,0,0.6)'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(S*0.2,S*0.48); ctx.lineTo(S*0.75,S*0.52); ctx.stroke();
  }
  else if(type === 'jupiter') {
    fill(`rgb(${r},${g},${b})`);

    const bandColors = [
      'rgba(200,140,60,0.7)','rgba(160,100,40,0.6)','rgba(230,200,140,0.5)',
      'rgba(140,80,30,0.7)','rgba(220,180,100,0.6)','rgba(180,120,50,0.7)',
      'rgba(240,210,160,0.4)','rgba(150,90,35,0.65)',
    ];
    bandColors.forEach((bc, i) => {
      const y = (i/bandColors.length)*S;
      const h = (S/bandColors.length)*(0.6+Math.random()*0.8);
      ctx.fillStyle=bc; ctx.fillRect(0,y,S,h);
    });

    for(let i=0;i<6;i++){
      const y = (i/6)*S + S/12;
      ctx.beginPath(); ctx.moveTo(0,y);
      for(let x=0;x<=S;x+=20){
        ctx.lineTo(x, y + Math.sin(x*0.05+i)*8*Math.random());
      }
      ctx.strokeStyle=`rgba(${r-30},${g-30},${b-20},0.3)`;
      ctx.lineWidth=2; ctx.stroke();
    }

    ctx.save();
    ctx.translate(S*0.62, S*0.58);
    const grs = ctx.createRadialGradient(0,0,0,0,0,S*0.1);
    grs.addColorStop(0,'rgba(200,60,20,0.9)'); grs.addColorStop(1,'rgba(180,60,20,0)');
    ctx.fillStyle=grs;
    ctx.beginPath(); ctx.ellipse(0,0,S*0.1,S*0.07,0.2,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  else if(type === 'saturn') {
    fill(`rgb(${r},${g},${b})`);
    for(let i=0;i<10;i++){
      const y=(i/10)*S; const h=S/10*(0.5+Math.random()*0.8);
      ctx.fillStyle=`rgba(${r-20+Math.random()*40},${g-10},${b-20+Math.random()*20},0.4)`;
      ctx.fillRect(0,y,S,h);
    }
    noise(150, 0.2, true);
  }
  else if(type === 'uranus') {
    const grd = ctx.createRadialGradient(S*0.35,S*0.35,0,S/2,S/2,S*0.7);
    grd.addColorStop(0,'#a0f8f8'); grd.addColorStop(0.5,'#5fd0d0'); grd.addColorStop(1,'#1a8888');
    ctx.fillStyle=grd; ctx.fillRect(0,0,S,S);

    for(let i=0;i<5;i++){
      ctx.fillStyle=`rgba(100,220,220,0.12)`;
      ctx.fillRect(0,(i/5)*S,S,S/10);
    }
    noise(80, 0.08, true);
  }
  else if(type === 'neptune') {
    const grd = ctx.createRadialGradient(S*0.4,S*0.35,0,S/2,S/2,S*0.65);
    grd.addColorStop(0,'#5588ff'); grd.addColorStop(0.6,'#1a44cc'); grd.addColorStop(1,'#080e44');
    ctx.fillStyle=grd; ctx.fillRect(0,0,S,S);

    const ns = ctx.createRadialGradient(S*0.6,S*0.45,0,S*0.6,S*0.45,S*0.08);
    ns.addColorStop(0,'rgba(40,60,200,0.8)'); ns.addColorStop(1,'rgba(40,60,200,0)');
    ctx.fillStyle=ns; ctx.beginPath(); ctx.ellipse(S*0.6,S*0.45,S*0.08,S*0.05,0.3,0,Math.PI*2); ctx.fill();
    noise(150, 0.12, true);
  }
  else {
    fill(`rgb(${r},${g},${b})`);
    noise(300, 0.4, false); noise(100, 0.3, true);
  }

  return new THREE.CanvasTexture(c);
}

function makeRingTex() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 1;
  const ctx = c.getContext('2d');
  const grd = ctx.createLinearGradient(0,0,512,0);
  grd.addColorStop(0,'rgba(0,0,0,0)');
  grd.addColorStop(0.08,'rgba(180,160,80,0.6)');
  grd.addColorStop(0.2,'rgba(220,200,120,0.8)');
  grd.addColorStop(0.32,'rgba(180,160,80,0.4)');
  grd.addColorStop(0.45,'rgba(200,180,100,0.7)');
  grd.addColorStop(0.6,'rgba(160,140,60,0.35)');
  grd.addColorStop(0.75,'rgba(200,180,100,0.5)');
  grd.addColorStop(0.9,'rgba(150,130,50,0.2)');
  grd.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=grd; ctx.fillRect(0,0,512,1);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;
  return tex;
}

let _roundSpriteTex = null;
function makeRoundSprite() {
  if(_roundSpriteTex) return _roundSpriteTex;
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  const grd = ctx.createRadialGradient(32,32,0,32,32,32);
  grd.addColorStop(0,'rgba(255,255,255,1)');
  grd.addColorStop(0.4,'rgba(255,255,255,0.8)');
  grd.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,64,64);
  _roundSpriteTex = new THREE.CanvasTexture(c);
  return _roundSpriteTex;
}