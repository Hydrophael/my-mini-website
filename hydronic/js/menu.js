let hamOpen = false;
let currentActive = -1;

const HAM_GROUPS = [
  {
    label: 'Identity',
    icon: '🌍',
    planetIndices: [2],
  },
  {
    label: 'Projects',
    icon: '🚀',
    planetIndices: [3, 4, 5, 6, 7],
  },
  {
    label: 'Experience',
    icon: '💻',
    planetIndices: [0, 1],
  },
];

let openGroupIdx = 0;

function buildHamMenu() {
  const container = document.getElementById('hd-groups');
  container.innerHTML = '';

  HAM_GROUPS.forEach((group, gi) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'hd-group' + (gi === openGroupIdx ? ' open' : '');
    groupEl.id = 'hd-group-' + gi;

    const header = document.createElement('div');
    header.className = 'hd-group-header';
    header.innerHTML = `
      <span class="hd-group-icon">${group.icon}</span>
      <span class="hd-group-label">${group.label}</span>
      <span class="hd-group-count">${group.planetIndices.length}</span>
      <span class="hd-group-chevron">›</span>
    `;
    header.addEventListener('click', () => toggleGroup(gi));

    const submenu = document.createElement('div');
    submenu.className = 'hd-submenu';
    const inner = document.createElement('div');
    inner.className = 'hd-submenu-inner';

    group.planetIndices.forEach(pi => {
      const p = PLANET_DATA[pi];
      const item = document.createElement('div');
      item.className = 'hd-planet-item';
      item.id = 'hd-item-' + pi;
      item.innerHTML = `
        <div class="hd-planet-icon">${p.icon}</div>
        <div class="hd-planet-info">
          <div class="hd-planet-name">${p.name}</div>
          <div class="hd-planet-tag">${p.tag}</div>
        </div>
        <div class="hd-planet-arrow">›</div>
      `;
      item.addEventListener('click', () => navigateToPlanet(pi));
      inner.appendChild(item);
    });

    submenu.appendChild(inner);
    groupEl.appendChild(header);
    groupEl.appendChild(submenu);
    container.appendChild(groupEl);
  });
}

function toggleGroup(gi) {
  const wasOpen = openGroupIdx === gi;

  document.querySelectorAll('.hd-group').forEach(el => el.classList.remove('open'));
  if(!wasOpen) {
    document.getElementById('hd-group-' + gi).classList.add('open');
    openGroupIdx = gi;
  } else {
    openGroupIdx = -1;
  }
}

function navigateToPlanet(idx) {
  closeHamMenu();

  currentActive = idx;
  document.querySelectorAll('.hd-planet-item').forEach((el) => {
    el.classList.toggle('active', el.id === 'hd-item-' + idx);
  });

  const dots = document.querySelectorAll('.hb-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));

  setTimeout(() => {
    if(typeof focusPlanet === 'function') {
      focusPlanet(idx);
    } else {
      openPanel(idx);
    }
  }, 420);
}

function toggleHamMenu() {
  hamOpen ? closeHamMenu() : openHamMenu();
}

function openHamMenu() {
  hamOpen = true;
  document.getElementById('ham-btn').classList.add('open');
  document.getElementById('ham-btn').setAttribute('aria-expanded','true');
  document.getElementById('ham-overlay').classList.add('show');
  document.getElementById('ham-drawer').classList.add('open');
}

function closeHamMenu() {
  hamOpen = false;
  document.getElementById('ham-btn').classList.remove('open');
  document.getElementById('ham-btn').setAttribute('aria-expanded','false');
  document.getElementById('ham-overlay').classList.remove('show');
  document.getElementById('ham-drawer').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeHamMenu();
});

(function waitForLoader() {
  const loader = document.getElementById('loader');
  if(!loader) { setTimeout(waitForLoader, 100); return; }
  const observer = new MutationObserver(() => {
    if(loader.classList.contains('out')) {
      document.getElementById('ham-btn').classList.add('visible');
      buildHamMenu();
      observer.disconnect();
    }
  });
  observer.observe(loader, {attributes:true, attributeFilter:['class']});
})();