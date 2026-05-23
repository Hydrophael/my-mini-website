function toggleOrbits(){
  showOrbits=!showOrbits;
  orbitLines.forEach(l=>l.visible=showOrbits);
  document.getElementById('btn-orbits').classList.toggle('on',showOrbits);
}
function toggleLabels(){
  showLabels=!showLabels;
  document.getElementById('btn-labels').classList.toggle('on',showLabels);
  if(!showLabels) labelSprites.forEach(l => l.style.display='none');
}
document.getElementById('speed-range').addEventListener('input',function(){
  speedMult=parseFloat(this.value);
  document.getElementById('speed-val').textContent=speedMult.toFixed(1)+'×';
});