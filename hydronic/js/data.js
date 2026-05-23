const PLANET_DATA = [
  {
    name: 'Mercury',
    icon: '🖥️',
    tag: 'TEACHING',
    subtitle: 'The foundation · Closest to origin',
    orbitR: 44, r: 1.9, speed: 0.721704, tilt: 7,
    color: 0xa8a8a8, emissive: 0x181818,
    textureType: 'mercury',
    hoverDetail: 'C — Teaching & Lab Assistant',
    panelColor: '#a8a8a8',
    content: {
      section1Label: 'Role',
      section1: 'TA and Lab Assistant for Fundamentals of Programming, Algorithms & Data Structures, and Human-Computer Interaction. Running lab sessions, teaching the material, grading assignments, and helping students work through whatever they\'re stuck on.',
      section2Label: 'Skill Metrics',
      stats: [
        {val:'TA / LA', key:'Role'},
        {val:'Low-level', key:'Domain'},
        {val:'Daily', key:'Usage'}
      ],
      chipsLabel: 'Courses Covered',
      chips: [
        {label:'Fundamentals of Programming', style:'hot'},
        {label:'Algorithms & Data Structures', style:'hot'},
        {label:'Human-Computer Interaction', style:'hot'},
        {label:'Pointers & Memory', style:'warn'},
        {label:'Teaching Lab', style:''},
      ]
    }
  },
  {
    name: 'Venus',
    icon: '🖱️',
    tag: 'UI/UX',
    subtitle: 'Beautiful interfaces · User-centered design',
    orbitR: 68, r: 3.4, speed: 0.282264, tilt: 177,
    color: 0xe8c060, emissive: 0x2a1800,
    textureType: 'venus',
    hoverDetail: 'UI/UX · Design · Frontend',
    panelColor: '#e8c060',
    content: {
      section1Label: 'Identity',
      section1: 'HTML, CSS, and design principles form the visual layer of everything I build. Currently a Teaching Assistant for Human-Computer Interaction.',
      section2Label: 'Toolkit',
      stats: [
        {val:'HTML5', key:'Markup'},
        {val:'CSS3', key:'Styling'},
        {val:'JavaScript', key:'Scripting'},
        {val:'UI/UX', key:'Discipline'}
      ],
      chipsLabel: 'Focus Areas',
      chips: [
        {label:'Figma', style:'warn'},
        {label:'Canva', style:'warn'},
        {label:'JavaScript', style:'hot'},
        {label:'User Research', style:''},
        {label:'Prototyping', style:''},
        {label:'Visual Design', style:'hot'},
      ]
    }
  },
  {
    name: 'Earth',
    icon: '🏠',
    tag: 'IDENTITY',
    subtitle: 'Home base · Where life happens',
    orbitR: 96, r: 3.8, speed: 0.174, tilt: 23,
    color: 0x1a7fc0, emissive: 0x001524,
    textureType: 'earth',
    hoverDetail: 'Hydronic — Core Identity',
    panelColor: '#1a7fc0',
    hasMoon: true,
    content: {
      section1Label: 'Who I Am',
      section1: 'Developer. Building weird things at 2 AM. Passionate about security, Artificial Intelligence, and clean code. Internet dweller somewhere in the universe.',
      stats: [],
      chipsLabel: 'Current Orbits',
      chips: [
        {label:'Member of Google developer group on campus', style:'hot'},
        {label:'Teaching / Lab Assistant for Human-Computer Interaction', style:'hot'},
        {label:'Lab Assistant for Algorithms & Data Structures', style:'hot'},
        {label:'Lab Assistant for Fundamentals of Programming', style:'hot'},
      ],
      discord: true,
      midExtra: `
        <div class="pp-divider"></div>
        <div class="pp-section-label">Interests</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:4px;">
          <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">🔭</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.75rem;color:var(--star);font-weight:600;">Astronomy</span>
          </div>
          <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">💻</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.75rem;color:var(--star);font-weight:600;">Technology</span>
          </div>
          <div style="background:rgba(57,255,20,0.06);border:1px solid rgba(57,255,20,0.18);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">🌍</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.75rem;color:var(--neutron);font-weight:600;">Geography</span>
          </div>
          <div style="background:rgba(196,107,255,0.07);border:1px solid rgba(196,107,255,0.18);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">🧬</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.72rem;color:var(--nova);font-weight:600;">Biology &amp; Biotech</span>
          </div>
          <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">🤖</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.72rem;color:var(--star);font-weight:600;">Artificial Intelligence</span>
          </div>
          <div style="background:rgba(255,123,58,0.07);border:1px solid rgba(255,123,58,0.18);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">👁</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.72rem;color:var(--solar);font-weight:600;">Computer Vision</span>
          </div>
          <div style="background:rgba(255,123,58,0.07);border:1px solid rgba(255,123,58,0.18);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">🔐</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.72rem;color:var(--solar);font-weight:600;">Cybersecurity</span>
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:8px 11px;display:flex;align-items:center;gap:7px;">
            <span style="font-size:1rem;line-height:1;">🕵️</span>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:0.75rem;color:rgba(200,225,255,0.65);font-weight:600;">OSINT</span>
          </div>
          <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:8px 11px;display:flex;align-items:center;justify-content:center;gap:7px;">
            <span style="font-family:'Space Mono',monospace;font-size:0.7rem;color:rgba(200,225,255,0.35);font-weight:600;letter-spacing:0.12em;">& more...</span>
          </div>
        </div>
        <div class="pp-divider"></div>
        <div class="pp-section-label">My Programming Languages</div>
        <div style="margin-bottom:4px;">
          <div style="font-size:0.6rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--plasma);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span style="display:inline-block;width:14px;height:1px;background:var(--plasma);opacity:0.5;"></span>Main Focus
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;">
            <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:7px;padding:7px 10px;">
              <div style="font-family:'Space Mono',monospace;font-size:0.78rem;color:var(--star);font-weight:700;">Python</div>
            </div>
            <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:7px;padding:7px 10px;">
              <div style="font-family:'Space Mono',monospace;font-size:0.78rem;color:var(--star);font-weight:700;">C</div>
            </div>
            <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:7px;padding:7px 10px;grid-column:span 1;">
              <div style="font-family:'Space Mono',monospace;font-size:0.78rem;color:var(--star);font-weight:700;">JavaScript</div>
              <div style="font-size:0.6rem;color:var(--dim);margin-top:2px;">+ HTML, CSS</div>
            </div>
            <div style="background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:7px;padding:7px 10px;">
              <div style="font-family:'Space Mono',monospace;font-size:0.78rem;color:var(--star);font-weight:700;">C++</div>
            </div>
          </div>
          <div style="font-size:0.6rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--dim);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span style="display:inline-block;width:14px;height:1px;background:var(--dim);opacity:0.5;"></span>Secondary Focus
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:7px;padding:7px 10px;">
              <div style="font-family:'Space Mono',monospace;font-size:0.75rem;color:rgba(200,225,255,0.55);font-weight:700;">Java</div>
            </div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:7px;padding:7px 10px;">
              <div style="font-family:'Space Mono',monospace;font-size:0.75rem;color:rgba(200,225,255,0.55);font-weight:700;">PHP</div>
            </div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:7px;padding:7px 10px;">
              <div style="font-family:'Space Mono',monospace;font-size:0.75rem;color:rgba(200,225,255,0.55);font-weight:700;">SQL</div>
            </div>
          </div>
        </div>
      `
    }
  },
  {
    name: 'Mars',
    icon: '🔐',
    tag: 'SECURITY',
    subtitle: 'Red Planet · Hostile terrain',
    orbitR: 118, r: 2.9, speed: 0.092448, tilt: 25,
    color: 0xc14010, emissive: 0x200600,
    textureType: 'mars',
    hoverDetail: 'Security & Exploits',
    panelColor: '#c14010',
    content: {
      section1Label: 'Domain',
      section1: 'I built a Discord multi-tenant access control system with awareness of vulnerability vectors and exploit research. This is where I thrive.',
      section2Label: 'Arsenal',
      stats: [
        {val:'Multi-tenant', key:'Architecture'},
        {val:'Exploit', key:'Research'},
        {val:'Python', key:'Language'},
        {val:'Live', key:'Status'}
      ],
      chipsLabel: 'Projects',
      chips: [
        {label:'Discord Access Control', style:'warn'},
        {label:'Multi-tenant Auth', style:'warn'},
        {label:'Exploit Research', style:''},
        {label:'Permission Management', style:''},
      ]
    }
  },
  {
    name: 'Jupiter',
    icon: '🤖',
    tag: 'AI & AUTOMATION',
    subtitle: 'Largest planet · Great Red Spot',
    orbitR: 220, r: 9.0, speed: 0.014658, tilt: 3,
    color: 0xc88b3a, emissive: 0x1a0d00,
    textureType: 'jupiter',
    hoverDetail: 'Discord Bot · Gemini AI',
    panelColor: '#c88b3a',
    bands: true,
    content: {
      section1Label: 'Flagship Project',
      section1: 'A fully-featured Discord bot powered by Google Gemini AI, deployed on cloud (like Railway) with MongoDB for persistent data. Handles commands, automation, and AI interactions.',
      section2Label: 'Tech Stack',
      stats: [
        {val:'Live', key:'Status'},
        {val:'Gemini', key:'AI Engine'},
        {val:'MongoDB', key:'Database'},
        {val:'Railway', key:'Deploy'}
      ],
      chipsLabel: 'Technologies',
      chips: [
        {label:'Python', style:'hot'},
        {label:'Gemini API', style:'hot'},
        {label:'MongoDB', style:'vio'},
        {label:'Railway', style:'grn'},
        {label:'Discord.py', style:''},
      ]
    }
  },
  {
    name: 'Saturn',
    icon: '📈',
    tag: 'TRACKING',
    subtitle: 'Lord of Rings · Beautiful complexity',
    orbitR: 285, r: 7.2, speed: 0.005904, tilt: 27,
    color: 0xe4d191, emissive: 0x1e1500,
    textureType: 'saturn',
    hoverDetail: 'User Activity Tracking',
    panelColor: '#e4d191',
    hasRings: true,
    content: {
      section1Label: 'Project',
      section1: '<strong style="color:var(--star);font-size:1rem;">User Activity Tracking System</strong><br>A project for tracking and analyzing user activity and behavior patterns — deployable as a web-based app (JavaScript) or a standalone Python script.',
      section2Label: 'About',
      stats: [
        {val:'WIP', key:'Status'},
        {val:'Web / Python', key:'Stack'},
        {val:'Tracking', key:'Domain'},
        {val:'Analysis', key:'Type'}
      ],
      chipsLabel: 'Built With',
      chips: [
        {label:'HTML/CSS/JS', style:'hot'},
        {label:'JavaScript', style:'hot'},
        {label:'Python', style:'hot'},
        {label:'Web-based', style:''},
        {label:'Behavior Tracking', style:'warn'},
      ]
    }
  },
  {
    name: 'Uranus',
    icon: '🌐',
    tag: 'WEB TOOLS',
    subtitle: 'Ice Giant · Tilted 98°',
    orbitR: 345, r: 5.2, speed: 0.00207, tilt: 98,
    color: 0x7de8e8, emissive: 0x003030,
    textureType: 'uranus',
    hoverDetail: 'IP Tracker · Web Tools',
    panelColor: '#7de8e8',
    content: {
      section1Label: 'Project',
      section1: 'A dual-purpose tool: IP Address Tracking using geolocation APIs to fetch and display network intelligence, and Face Detection via computer vision. Deployable as a web app or standalone Python script.',
      section2Label: 'Details',
      stats: [
        {val:'Live', key:'Status'},
        {val:'Web / Python', key:'Stack'},
        {val:'IP + Face', key:'Features'},
        {val:'Geo + CV', key:'Domain'}
      ],
      chipsLabel: 'Technologies',
      chips: [
        {label:'HTML', style:'hot'},
        {label:'CSS', style:'hot'},
        {label:'JavaScript', style:'hot'},
        {label:'Python', style:'hot'},
        {label:'Geolocation', style:''},
        {label:'Face Detection', style:'warn'},
        {label:'Network Intel', style:'warn'},
        {label:'OpenCV', style:'vio'},
      ]
    }
  },
  {
    name: 'Neptune',
    icon: '📱',
    tag: 'FUTURE BUILD',
    subtitle: 'Windiest planet · Deep blue · Far horizon',
    orbitR: 400, r: 4.8, speed: 0.001056, tilt: 28,
    color: 0x2255cc, emissive: 0x000820,
    textureType: 'neptune',
    hoverDetail: 'Mobile App — Planned',
    panelColor: '#2255cc',
    content: {
      section1Label: 'On The Horizon',
      section1: 'A mobile app for managing and trading secondhand goods. Evaluating Kotlin (native Android) vs Flutter (cross-platform).',
      section2Label: 'Planning',
      stats: [
        {val:'Planned', key:'Status'},
        {val:'Mobile', key:'Platform'},
        {val:'Kotlin?', key:'Option A'},
        {val:'Flutter?', key:'Option B'}
      ],
      chipsLabel: 'Under Consideration',
      chips: [
        {label:'Kotlin', style:'vio'},
        {label:'Flutter', style:'vio'},
        {label:'Android', style:''},
        {label:'Cross-platform', style:''},
        {label:'Marketplace', style:'warn'},
      ]
    }
  },
];