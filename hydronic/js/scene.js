const container = document.getElementById('space-canvas');
let scene, camera, renderer;
let sun, sunCorona = [], planets3D = [];
let orbitLines = [], labelSprites = [], planetMeshes = [];
let asteroidBelt, kuiperBelt, nebulaParticles;
let animId, speedMult = 1;
let showOrbits = true, showLabels = false;
let mouse = new THREE.Vector2(-99,-99);
let raycaster = new THREE.Raycaster();
raycaster.params.Points = { threshold: 2 };
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
if(isMobile) raycaster.params.Points = { threshold: 6 };

let isDragging = false, prevMouse = {x:0,y:0}, dragStart = {x:0,y:0};
let camTheta = 0.88, camPhi = 0.4, camRadius = isMobile ? 520 : 430;
const CAM_TARGET = new THREE.Vector3(0,0,0);
let camAnimTo = null;

function initThree() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000408, 0.00008);

  camera = new THREE.PerspectiveCamera(isMobile ? 65 : 52, innerWidth/innerHeight, 0.1, 25000);

  renderer = new THREE.WebGLRenderer({antialias:!isMobile, alpha:true, logarithmicDepthBuffer:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.style.webkitTapHighlightColor = 'transparent';
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = isMobile ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('role','img');
  renderer.domElement.setAttribute('aria-label','Interactive 3D solar system — click planets to explore');
  container.appendChild(renderer.domElement);

  setupControls();

  
  const sunLight = new THREE.PointLight(0xfff5d0, 4.5, 1800);
  sunLight.castShadow = true;
  const shadowMapSize = isMobile ? 512 : 2048;
  sunLight.shadow.mapSize.width = shadowMapSize;
  sunLight.shadow.mapSize.height = shadowMapSize;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 1800;
  scene.add(sunLight);

  const ambient = new THREE.AmbientLight(0x06101a, 1.0);
  scene.add(ambient);

  const rimA = new THREE.DirectionalLight(0x1133cc, 0.18);
  rimA.position.set(-300, 80, -200); scene.add(rimA);
  const rimB = new THREE.DirectionalLight(0x330066, 0.12);
  rimB.position.set(100, -100, 300); scene.add(rimB);

  
  const sunGeo = new THREE.SphereGeometry(28, 48, 48);
  const sunMat = new THREE.MeshBasicMaterial({ map: makeTex('sun', 0xff8800) });
  sun = new THREE.Mesh(sunGeo, sunMat);
  sun.userData = { isSun: true, name: 'Sun', detail: 'The star at the center' };
  scene.add(sun);

  const coronaSizes = [36, 46, 62, 90, 132];
  const coronaOpa   = [0.22, 0.12, 0.07, 0.035, 0.012];
  const coronaCol   = [0xffcc44, 0xff8800, 0xff6600, 0xff4400, 0xff2200];
  coronaSizes.forEach((s,i) => {
    const geo = new THREE.SphereGeometry(s, 16, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: coronaCol[i], transparent:true, opacity:coronaOpa[i],
      side:THREE.BackSide, depthWrite:false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    sun.add(mesh);
    sunCorona.push(mesh);
  });

  
  [[15000,20000],[9000,14000],[5000,8000]].forEach(([min,max],layer) => {
    const count = [2500, 1200, 500][layer];
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const r = min + Math.random()*(max-min);
      const u = Math.random(), v = Math.random();
      const theta = u*Math.PI*2, phi = Math.acos(2*v-1);
      pos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
      pos[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
      pos[i*3+2] = r*Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const mat = new THREE.PointsMaterial({
      size:[2.0,2.0,2.0][layer],
      color: 0xffffff,
      transparent:true, opacity:[0.9,0.7,0.5][layer],
      sizeAttenuation:false, depthWrite:false,
      map:makeRoundSprite(), alphaTest:0.01,
    });
    scene.add(new THREE.Points(geo, mat));
  });

  
  {
    const count = 1800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count*3);
    const col = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const ang = Math.random()*Math.PI*2;
      const r = 148 + Math.random()*30 + Math.sin(ang*7)*4;
      const y = (Math.random()-0.5)*5;
      pos[i*3]=Math.cos(ang)*r; pos[i*3+1]=y; pos[i*3+2]=Math.sin(ang)*r;
      const bright = 0.4+Math.random()*0.4;
      col[i*3]=bright*0.8; col[i*3+1]=bright*0.75; col[i*3+2]=bright*0.65;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    asteroidBelt = new THREE.Points(geo, new THREE.PointsMaterial({
      size:2.5, vertexColors:true, transparent:true, opacity:0.9, sizeAttenuation:true,
      map:makeRoundSprite(), alphaTest:0.01, depthWrite:false,
    }));
    scene.add(asteroidBelt);
  }

  
  {
    const count = 700;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const ang = Math.random()*Math.PI*2;
      const r = 425 + Math.random()*65;
      pos[i*3]=Math.cos(ang)*r; pos[i*3+1]=(Math.random()-0.5)*12; pos[i*3+2]=Math.sin(ang)*r;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    kuiperBelt = new THREE.Points(geo, new THREE.PointsMaterial({
      color:0x8899bb, size:1.2, transparent:true, opacity:0.5, sizeAttenuation:true,
    }));
    scene.add(kuiperBelt);
  }

  
  PLANET_DATA.forEach((spec, idx) => {

    const orbitPts = [];
    for(let i=0;i<=128;i++){
      const a=(i/128)*Math.PI*2;
      orbitPts.push(new THREE.Vector3(Math.cos(a)*spec.orbitR,0,Math.sin(a)*spec.orbitR));
    }
    const oGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
    const oMat = new THREE.LineBasicMaterial({color:0x00d4ff,transparent:true,opacity:0.07,depthWrite:false});
    const orbitLine = new THREE.Line(oGeo, oMat);
    scene.add(orbitLine);
    orbitLines.push(orbitLine);

    const dashGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
    const dashMat = new THREE.LineBasicMaterial({color:0x00d4ff,transparent:true,opacity:0.03,depthWrite:false});
    scene.add(new THREE.Line(dashGeo, dashMat));

    const pivot = new THREE.Group();
    pivot.rotation.y = Math.random()*Math.PI*2;
    scene.add(pivot);

    const seg = isMobile ? 24 : 48;
    const geo = new THREE.SphereGeometry(spec.r, seg, seg);
    const mat = new THREE.MeshStandardMaterial({
      map: makeTex(spec.textureType, spec.color),
      emissive: new THREE.Color(spec.emissive || 0x000000),
      emissiveIntensity: 0.25,
      roughness: 0.75,
      metalness: 0.05,
    });
    const planet = new THREE.Mesh(geo, mat);
    planet.position.x = spec.orbitR;
    planet.rotation.z = THREE.MathUtils.degToRad(spec.tilt || 0);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.userData = { isPlanet:true, name:spec.name, detail:spec.hoverDetail, dataIdx:idx };
    pivot.add(planet);
    planetMeshes.push(planet);

    const atmoMap = {
      Earth:{color:0x4499ff,opacity:0.18},
      Venus:{color:0xffcc44,opacity:0.15},
      Uranus:{color:0x55ffff,opacity:0.14},
      Neptune:{color:0x2244ff,opacity:0.16},
      Jupiter:{color:0xc88b3a,opacity:0.08},
      Saturn:{color:0xe4d191,opacity:0.07},
    };
    if(atmoMap[spec.name]){
      const am = atmoMap[spec.name];
      const aGeo = new THREE.SphereGeometry(spec.r*1.1, 24, 24);
      const aMat = new THREE.MeshBasicMaterial({color:am.color,transparent:true,opacity:am.opacity,side:THREE.BackSide,depthWrite:false});
      planet.add(new THREE.Mesh(aGeo, aMat));

      const aGeo2 = new THREE.SphereGeometry(spec.r*1.2, 20, 20);
      const aMat2 = new THREE.MeshBasicMaterial({color:am.color,transparent:true,opacity:am.opacity*0.4,side:THREE.BackSide,depthWrite:false});
      planet.add(new THREE.Mesh(aGeo2, aMat2));
    }

    if(spec.hasRings) {
      const ringTex = makeRingTex();
      [[spec.r*1.15,spec.r*2.6]].forEach(([inner,outer]) => {
        const rGeo = new THREE.RingGeometry(inner, outer, 256);
        const pos = rGeo.attributes.position;
        const uv = rGeo.attributes.uv;
        for(let i=0;i<pos.count;i++){
          const v = new THREE.Vector3().fromBufferAttribute(pos,i);
          const t = (v.length()-inner)/(outer-inner);
          uv.setXY(i, t, 0);
        }
        const rMat = new THREE.MeshBasicMaterial({
          map:ringTex,side:THREE.DoubleSide,transparent:true,opacity:0.88,depthWrite:false,
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = Math.PI * 0.46;
        planet.add(ring);
      });
    }

    if(spec.hasMoon) {
      const moonPivot = new THREE.Group();
      const mGeo = new THREE.SphereGeometry(1.0, 40, 40);
      const mMat = new THREE.MeshStandardMaterial({
        map: makeTex('mercury', 0x999988), roughness:0.92, metalness:0,
        emissive:new THREE.Color(0x111111), emissiveIntensity:0.1,
      });
      const moon = new THREE.Mesh(mGeo, mMat);
      moon.position.x = spec.r * 2.8;
      moon.castShadow = true;
      moonPivot.add(moon);
      planet.add(moonPivot);
      planets3D.push({ pivot, mesh:planet, speed:spec.speed, moonPivot, rotSelf:0.008 });
      return;
    }

    planets3D.push({ pivot, mesh:planet, speed:spec.speed, moonPivot:null, rotSelf:0.006+Math.random()*0.01 });
  });

  
  PLANET_DATA.forEach((spec) => {
    const lbl = document.createElement('div');
    lbl.className = 'planet-label';
    lbl.textContent = spec.name;
    document.body.appendChild(lbl);
    labelSprites.push(lbl);
  });

  buildHudDots();
}
function setupControls() {
  const el = renderer.domElement;
  el.addEventListener('mousedown', e => {
    if(e.button!==0) return;
    isDragging=true; prevMouse={x:e.clientX,y:e.clientY};
    dragStart={x:e.clientX,y:e.clientY};
    document.body.classList.add('clicking');
  });
  el.addEventListener('mousemove', e => {
    if(isDragging){
      const dx=(e.clientX-prevMouse.x)*0.004;
      const dy=(e.clientY-prevMouse.y)*0.004;
      camPhi += dx;
      camTheta = Math.max(0.08, Math.min(Math.PI*0.46, camTheta+dy));
      prevMouse={x:e.clientX,y:e.clientY};
      camAnimTo = null;
    }
    mouse.x=(e.clientX/innerWidth)*2-1;
    mouse.y=-(e.clientY/innerHeight)*2+1;
  });
  el.addEventListener('mouseup', e => {
    if(!isDragging) return;
    isDragging=false;
    document.body.classList.remove('clicking');

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(planetMeshes);
    if(hits.length){
      const obj = hits[0].object;
      if(obj.userData.isPlanet) openPanel(obj.userData.dataIdx);
    }
  });
  el.addEventListener('mouseleave', () => { isDragging=false; document.body.classList.remove('clicking'); });
  el.addEventListener('wheel', e => {
    camRadius = Math.max(50, Math.min(850, camRadius + e.deltaY*0.28));
    e.preventDefault();
  },{passive:false});

  let td=0;
  el.addEventListener('touchstart', e => {
    if(e.touches.length===1){ isDragging=true; prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY}; }
    if(e.touches.length===2){ td=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); }
  },{passive:false});
  el.addEventListener('touchmove', e => {
    if(e.touches.length===1&&isDragging){
      const dx=(e.touches[0].clientX-prevMouse.x)*0.004;
      const dy=(e.touches[0].clientY-prevMouse.y)*0.004;
      camPhi+=dx; camTheta=Math.max(0.08,Math.min(Math.PI*0.46,camTheta+dy));
      prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY};
    }
    if(e.touches.length===2){
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      camRadius=Math.max(50,Math.min(850,camRadius-(d-td)*1.8)); td=d;
    }
    e.preventDefault();
  },{passive:false});
  el.addEventListener('touchend', ()=>isDragging=false);
}

let camFocusIdx = -1; 

function updateCamera() {
  
  if(camFocusIdx >= 0) {
    const pos = getPlanetWorldPos(camFocusIdx);
    CAM_TARGET.set(pos.x, 0, pos.z);
    const targetPhi = Math.atan2(pos.z, pos.x) + 0.4;
    if(camAnimTo) {
      camAnimTo.phi = targetPhi;
    } else {
      camPhi += (targetPhi - camPhi) * 0.04;
    }
  }

  if(camAnimTo) {
    camTheta += (camAnimTo.theta - camTheta) * 0.06;
    camPhi   += (camAnimTo.phi   - camPhi)   * 0.06;
    camRadius+= (camAnimTo.r     - camRadius) * 0.06;
    if(Math.abs(camAnimTo.theta-camTheta)<0.002&&Math.abs(camAnimTo.phi-camPhi)<0.002&&Math.abs(camAnimTo.r-camRadius)<0.5) camAnimTo=null;
  }

  const x = CAM_TARGET.x + camRadius*Math.sin(camTheta)*Math.cos(camPhi);
  const y = CAM_TARGET.y + camRadius*Math.cos(camTheta);
  const z = CAM_TARGET.z + camRadius*Math.sin(camTheta)*Math.sin(camPhi);
  camera.position.set(x,y,z);
  camera.lookAt(CAM_TARGET);
}

function getPlanetWorldPos(idx) {
  const pos = new THREE.Vector3();
  planets3D[idx].mesh.getWorldPosition(pos);
  return pos;
}

function focusPlanet(idx) {
  const spec = PLANET_DATA[idx];

  camFocusIdx = idx;

  
  const pos = getPlanetWorldPos(idx);
  CAM_TARGET.set(pos.x, 0, pos.z);

  const targetPhi = Math.atan2(pos.z, pos.x) + 0.4;
  camAnimTo = {
    theta: 0.72,
    phi: targetPhi,
    r: spec.r * 6 + 40,
  };
  setTimeout(() => openPanel(idx), 800);
}

function resetCam() {
  camFocusIdx = -1;
  CAM_TARGET.set(0,0,0);
  camAnimTo = { theta:0.88, phi:0.4, r: isMobile ? 520 : 430 };
}
const hoverTip  = document.getElementById('hover-tip');
const htName    = document.getElementById('ht-name');
const htSub     = document.getElementById('ht-sub');

function animate(){
  animId = requestAnimationFrame(animate);
  const dt = speedMult;

  sun.rotation.y += 0.0018 * dt;
  sunCorona.forEach((m,i) => { m.rotation.y += [0.001,-0.0007,0.0005,-0.0003,0.0002][i]*dt; });

  if(asteroidBelt) asteroidBelt.rotation.y += 0.0003*dt;
  if(kuiperBelt)   kuiperBelt.rotation.y   += 0.0001*dt;

  planets3D.forEach((p,i) => {
    p.pivot.rotation.y += PLANET_DATA[i].speed * 0.012 * dt;

    if(PLANET_DATA[i].name === 'Saturn') {
      p.mesh.rotation.y += 0.0008 * dt;
    } else {
      p.mesh.rotation.y += (p.rotSelf || 0.007) * dt;
    }
    if(p.moonPivot) p.moonPivot.rotation.y += 0.04 * dt;
  });

  updateCamera();

  
  if(showLabels) {
    const _v = new THREE.Vector3();
    planetMeshes.forEach((mesh, i) => {
      const lbl = labelSprites[i];
      if(!lbl) return;
      mesh.getWorldPosition(_v);
      _v.project(camera);
      
      if(_v.z > 1){ lbl.style.display='none'; return; }
      const sx = (_v.x * 0.5 + 0.5) * innerWidth;
      const sy = (-_v.y * 0.5 + 0.5) * innerHeight;
      lbl.style.left = sx + 'px';
      lbl.style.top  = (sy - PLANET_DATA[i].r * 2) + 'px';
      lbl.style.display = 'block';
    });
  }

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planetMeshes);
  if(hits.length){
    const obj = hits[0].object;
    if(obj !== lastHovered){
      lastHovered = obj;
      htName.textContent = obj.userData.name;
      htSub.textContent  = obj.userData.detail;
    }
    hoverTip.style.display='block';
    const sx=(mouse.x*0.5+0.5)*innerWidth;
    const sy=(-mouse.y*0.5+0.5)*innerHeight;
    hoverTip.style.left=(sx+18)+'px';
    hoverTip.style.top=(sy-10)+'px';
    renderer.domElement.style.cursor='none';
  } else {
    hoverTip.style.display='none';
    lastHovered=null;
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  if(!camera||!renderer) return;
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

function buildHudDots() {
  const container = document.getElementById('hb-dots');
  PLANET_DATA.forEach((p,i) => {
    const dot = document.createElement('div');
    dot.className='hb-dot';
    dot.title = p.name;
    dot.style.background = `#${p.color.toString(16).padStart(6,'0')}55`;
    dot.style.borderColor = `#${p.color.toString(16).padStart(6,'0')}88`;
    dot.addEventListener('click', () => focusPlanet(i));
    container.appendChild(dot);
  });
}