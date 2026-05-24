// Configuration Supabase
const SUPABASE_URL = 'https://wesdqlztqygsljkpjusw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc2RxbHp0cXlnc2xqa3BqdXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTQ4NjYsImV4cCI6MjA5NDU5MDg2Nn0.tMbX4sbHOS8qzsKaa_nRMfLa5CCbqYWfDOH2hc-r8mQ';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Données du curriculum freeCodeCamp
const CERTS = [
  { id:'html', name:'HTML', icon:'🌐', sections:[
    {id:'h1', name:'Basic HTML', badge:'theory', steps:137},
    {id:'h2', name:'Semantic HTML', badge:'theory', steps:55},
    {id:'h3', name:'Forms and Tables', badge:'theory', steps:53},
    {id:'h4', name:'Accessibility', badge:'theory', steps:55},
  ]},
  { id:'computers', name:'Computers', icon:'💻', sections:[
    {id:'c1', name:'Computer Basics', badge:'theory', steps:16},
  ]},
  { id:'css', name:'CSS', icon:'🎨', sections:[
    {id:'css1',  name:'Basic CSS', badge:'theory', steps:122},
    {id:'css2',  name:'Design', badge:'theory', steps:23},
    {id:'css3',  name:'Absolute and Relative Units', badge:'theory', steps:8},
    {id:'css4',  name:'Pseudo Classes and Elements', badge:'theory', steps:74},
    {id:'css5',  name:'Colors', badge:'theory', steps:98},
    {id:'css6',  name:'Styling Forms', badge:'theory', steps:84},
    {id:'css7',  name:'The Box Model', badge:'theory', steps:54},
    {id:'css8',  name:'Flexbox', badge:'theory', steps:70},
    {id:'css9',  name:'Build a Page of Playing Cards', badge:'cert', steps:1},
    {id:'css10', name:'Typography', badge:'theory', steps:78},
    {id:'css11', name:'Accessibility', badge:'theory', steps:72},
    {id:'css12', name:'Positioning', badge:'theory', steps:88},
    {id:'css13', name:'Attribute Selectors', badge:'theory', steps:71},
    {id:'css14', name:'Build a Book Inventory App', badge:'cert', steps:1},
    {id:'css15', name:'Responsive Design', badge:'theory', steps:37},
    {id:'css16', name:'Build a Technical Documentation Page', badge:'cert', steps:1},
    {id:'css17', name:'Variables', badge:'theory', steps:120},
    {id:'css18', name:'Grid', badge:'theory', steps:91},
    {id:'css19', name:'Build a Product Landing Page', badge:'cert', steps:1},
    {id:'css20', name:'Animations', badge:'theory', steps:139},
    {id:'css21', name:'CSS Review', badge:'review', steps:1},
    {id:'css22', name:'Responsive Web Design Certification Exam', badge:'exam', steps:1},
  ]},
  { id:'js', name:'JavaScript', icon:'⚡', sections:[
    {id:'js1',  name:'Variables and Data Types', badge:'theory'},
    {id:'js2',  name:'Strings', badge:'theory'},
    {id:'js3',  name:'Arrays', badge:'theory'},
    {id:'js4',  name:'Objects', badge:'theory'},
    {id:'js5',  name:'Functions', badge:'theory'},
    {id:'js6',  name:'Conditionals', badge:'theory'},
    {id:'js7',  name:'Loops', badge:'theory'},
    {id:'js8',  name:'Scope', badge:'theory'},
    {id:'js9',  name:'ES6+ and Modern JS Methods', badge:'theory'},
    {id:'js10', name:'Build a Role Playing Game', badge:'workshop'},
    {id:'js11', name:'DOM Manipulation', badge:'theory'},
    {id:'js12', name:'Events', badge:'theory'},
    {id:'js13', name:'Build a Calorie Counter', badge:'workshop'},
    {id:'js14', name:'Build a Rock Paper Scissors Game', badge:'workshop'},
    {id:'js15', name:'Build a Music Player', badge:'workshop'},
    {id:'js16', name:'Build a Date Formatter', badge:'workshop'},
    {id:'js17', name:'Build a Drum Machine', badge:'lab'},
    {id:'js18', name:'Modern Array Methods', badge:'theory'},
    {id:'js19', name:'Build Football Team Cards', badge:'workshop'},
    {id:'js20', name:'Build a Todo App', badge:'workshop'},
    {id:'js21', name:'Build a Decimal to Binary Converter', badge:'workshop'},
    {id:'js22', name:'Debugging Techniques', badge:'theory'},
    {id:'js23', name:'Build a Number Sorter', badge:'workshop'},
    {id:'js24', name:'Build a Statistics Calculator', badge:'workshop'},
    {id:'js25', name:'Build a Spreadsheet', badge:'workshop'},
    {id:'js26', name:'Build a Palindrome Checker', badge:'cert'},
    {id:'js27', name:'Regular Expressions', badge:'theory'},
    {id:'js28', name:'Build a Spam Filter', badge:'workshop'},
    {id:'js29', name:'Build a Number Formatter', badge:'workshop'},
    {id:'js30', name:'Build a Phone Number Validator', badge:'cert'},
    {id:'js31', name:'Fetch and Async/Await', badge:'theory'},
    {id:'js32', name:'Build a Shopping Cart', badge:'workshop'},
    {id:'js33', name:'Build a Platformer Game', badge:'workshop'},
    {id:'js34', name:'Build a Dice Game', badge:'workshop'},
    {id:'js35', name:'Build a fCC Authors Page', badge:'workshop'},
    {id:'js36', name:'Build a fCC Forum Leaderboard', badge:'workshop'},
    {id:'js37', name:'Build a Roman Numeral Converter', badge:'cert'},
    {id:'js38', name:'Build a Telephone Number Validator', badge:'cert'},
    {id:'js39', name:'Build a Cash Register', badge:'cert'},
    {id:'js40', name:'JavaScript Certification Exam', badge:'exam'},
  ]},
];

const TOTAL = CERTS.reduce((a,c) => a + c.sections.length, 0);
let state = {};
let estAdmin = false;

// Charger la progression depuis Supabase
async function charger() {
  try {
    const { data } = await db.from('progression').select('*');
    if (data) data.forEach(r => { state[r.section_id] = r.complete; });
  } catch(e) {}
  render();
}

// Sauvegarder une section
async function sauvegarder(id, val) {
  try {
    await db.from('progression').upsert({ section_id: id, complete: val }, { onConflict: 'section_id' });
  } catch(e) {}
}

// Vérifier la session auth
async function verifierSession() {
  const { data: { session } } = await db.auth.getSession();
  if (session) { estAdmin = true; afficherAdmin(); }
  await charger();
}

function afficherAdmin() {
  document.getElementById('adminTrigger').style.display = 'none';
  document.getElementById('adminBadge').style.display = 'block';
}

function ouvrirModal() { document.getElementById('modalOverlay').classList.add('open'); }
function fermerModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('loginErr').style.display = 'none';
}

async function seConnecter() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const { error } = await db.auth.signInWithPassword({ email, password: pass });
  if (error) { document.getElementById('loginErr').style.display = 'block'; return; }
  estAdmin = true; fermerModal(); afficherAdmin(); render();
}

async function seDeconnecter() {
  await db.auth.signOut();
  estAdmin = false;
  document.getElementById('adminTrigger').style.display = 'block';
  document.getElementById('adminBadge').style.display = 'none';
}

// Cocher/décocher une section
async function togItem(id) {
  if (!estAdmin) return;
  state[id] = !state[id];
  await sauvegarder(id, state[id]);
  render();
}

// Ouvrir/fermer une certification
function togCert(id) {
  state['open_' + id] = !state['open_' + id];
  render();
}

// Rendu de la page
function render() {
  const list = document.getElementById('certList');
  list.innerHTML = '';

  CERTS.forEach(cert => {
    const done = cert.sections.filter(s => state[s.id]).length;
    const pct  = Math.round(done / cert.sections.length * 100);
    const open = state['open_' + cert.id];
    const div  = document.createElement('div');
    div.className = 'cert';
    div.innerHTML = `
      <div class="cert-head" onclick="togCert('${cert.id}')">
        <div class="cert-left">
          <span class="cert-icon">${cert.icon}</span>
          <div class="cert-info">
            <div class="cert-name">${cert.name}</div>
            <div class="cert-meta">${done} / ${cert.sections.length} sections</div>
          </div>
        </div>
        <div class="cert-right">
          <span class="cert-pct-pill">${pct}%</span>
          <span class="cert-chev${open ? ' open' : ''}">›</span>
        </div>
      </div>
      <div class="cert-prog"><div class="cert-prog-fill" style="width:${pct}%"></div></div>
      <div class="cert-body${open ? ' open' : ''}">
        ${cert.sections.map((s, i) => `
          ${i > 0 ? '<div class="divider"></div>' : ''}
          <div class="item" onclick="togItem('${s.id}')">
            <div class="check${state[s.id] ? ' done' : ''}">
              ${state[s.id] ? '<svg class="check-icon" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>' : ''}
            </div>
            <span class="item-name${state[s.id] ? ' done' : ''}">${s.name}${s.steps ? ` <span class="steps-count">(${s.steps} steps)</span>` : ''}</span>
            <span class="badge b-${s.badge}">${s.badge}</span>
          </div>
        `).join('')}
      </div>
    `;
    list.appendChild(div);
  });

  // Progression globale
  const totalDone = CERTS.reduce((a, c) => a + c.sections.filter(s => state[s.id]).length, 0);
  const gPct = Math.round(totalDone / TOTAL * 100);
  document.getElementById('gPct').textContent = gPct + '%';
  document.getElementById('gFill').style.width = gPct + '%';
  document.getElementById('gSub').textContent = totalDone + ' section' + (totalDone > 1 ? 's' : '') + ' terminée' + (totalDone > 1 ? 's' : '') + ' sur ' + TOTAL;
}

verifierSession();
