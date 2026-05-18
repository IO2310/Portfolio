const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ma page</title>
  <style>
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f7;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px}
    h1{font-size:2.5rem;font-weight:700;letter-spacing:-.04em;background:linear-gradient(135deg,#0071e3,#5e5ce6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:0}
    p{color:#6e6e73;font-size:1rem;margin:0}
    .card{background:white;border-radius:18px;padding:28px 36px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06);border:.5px solid rgba(0,0,0,.06)}
    button{margin-top:14px;padding:10px 24px;border-radius:980px;background:#0071e3;color:white;border:none;font-size:15px;cursor:pointer;transition:all .2s}
    button:hover{background:#0077ed;transform:scale(1.02)}
    #counter{font-size:2rem;font-weight:700;color:#0071e3;letter-spacing:-.04em}
  </style>
</head>
<body>
  <h1>LiveCode by Ismaël</h1>
  <p>Éditeur HTML · CSS · JS en temps réel</p>
  <div class="card">
    <div id="counter">0</div>
    <p style="font-size:.85rem;margin-top:4px">clics</p>
    <button onclick="increment()">Clique-moi !</button>
  </div>
</body>
</html>`;

const DEFAULT_CSS = `/* style.css */
body {
  background: #f5f5f7;
}
.card {
  border-color: rgba(0,113,227,.15);
}`;

const DEFAULT_JS = `// script.js — s'exécute en direct !
let count = 0;

function increment() {
  count++;
  document.getElementById('counter').textContent = count;
  if (count === 10) alert('🎉 10 clics !');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('LiveCode — prêt');
});`;

let currentTab = 'html';
let codes = { html: DEFAULT_HTML, css: DEFAULT_CSS, js: DEFAULT_JS };
let debounceTimer;

const input       = document.getElementById('codeInput');
const hlCode      = document.getElementById('hlCode');
const preview     = document.getElementById('preview');
const lineNums    = document.getElementById('lineNums');
const modDot      = document.getElementById('modDot');
const lineCount   = document.getElementById('lineCount');
const charCount   = document.getElementById('charCount');
const stCursor    = document.getElementById('stCursor');
const currentFile = document.getElementById('currentFile');

function loadStorage() {
  try { const s=localStorage.getItem('livecode_v7'); if(s){codes={...codes,...JSON.parse(s)};showToast('✓ Code restauré');} } catch(e){}
}
function saveStorage() {
  try { localStorage.setItem('livecode_v7',JSON.stringify(codes)); } catch(e){}
}

function hl(code, lang) {
  const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  if(lang==='html') return e(code).replace(/(&lt;\/?)([\w-]+)/g,'<span class="hl-tag">$1$2</span>').replace(/\s([\w-:]+)(=)/g,' <span class="hl-attr">$1</span>$2').replace(/(".*?"|'.*?')/g,'<span class="hl-str">$1</span>').replace(/(&lt;!--[\s\S]*?--&gt;)/g,'<span class="hl-cmt">$1</span>');
  if(lang==='css') return e(code).replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="hl-cmt">$1</span>').replace(/([.#\w-]+)\s*\{/g,'<span class="hl-tag">$1</span> {').replace(/([\w-]+)\s*:/g,'<span class="hl-attr">$1</span>:').replace(/:\s*([^;{\n]+)/g,(m,v)=>': <span class="hl-str">'+v+'</span>');
  return e(code).replace(/(\/\/[^\n]*)/g,'<span class="hl-cmt">$1</span>').replace(/\b(function|let|const|var|return|if|else|for|while|class|new|document|window|console)\b/g,'<span class="hl-kw">$1</span>').replace(/(".*?"|'.*?'|`.*?`)/gs,'<span class="hl-str">$1</span>').replace(/\b(\d+)\b/g,'<span class="hl-num">$1</span>');
}

function applyHL() {
  hlCode.innerHTML=hl(input.value,currentTab);
  hlCode.scrollTop=input.scrollTop; hlCode.scrollLeft=input.scrollLeft;
}

function updateLines() {
  const lines=input.value.split('\n');
  const pos=input.value.substring(0,input.selectionStart).split('\n').length;
  lineNums.innerHTML=lines.map((_,i)=>`<div class="ln${i+1===pos?' cur':''}">${i+1}</div>`).join('');
  lineNums.scrollTop=input.scrollTop;
  lineCount.textContent=lines.length; charCount.textContent=input.value.length;
  const col=input.value.substring(0,input.selectionStart).split('\n').pop().length+1;
  stCursor.textContent=`Ln ${pos}, Col ${col}`;
}

function switchTab(tab) {
  codes[currentTab]=input.value; currentTab=tab; input.value=codes[tab];
  currentFile.textContent={html:'index.html',css:'style.css',js:'script.js'}[tab];
  document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',(i===0&&tab==='html')||(i===1&&tab==='css')||(i===2&&tab==='js')));
  document.querySelectorAll('.file-item').forEach((f,i)=>f.classList.toggle('active',(i===0&&tab==='html')||(i===1&&tab==='css')||(i===2&&tab==='js')));
  applyHL(); updateLines();
  showToast({html:'📄 index.html',css:'🎨 style.css',js:'⚡ script.js'}[tab]);
}

function buildPreview() {
  const h=currentTab==='html'?input.value:codes.html;
  const c=currentTab==='css'?input.value:codes.css;
  const j=currentTab==='js'?input.value:codes.js;
  const out=h.replace('</head>',`<style>${c}</style></head>`).replace('</body>',`<script>${j}<\/script></body>`);
  preview.src=URL.createObjectURL(new Blob([out],{type:'text/html'}));
}

function forceRefresh(){codes[currentTab]=input.value;buildPreview();showToast('✓ Rendu mis à jour');}

function openFull(){
  codes[currentTab]=input.value;
  const out=codes.html.replace('</head>',`<style>${codes.css}</style></head>`).replace('</body>',`<script>${codes.js}<\/script></body>`);
  window.open(URL.createObjectURL(new Blob([out],{type:'text/html'})),'_blank');
}

function downloadAll(){
  codes[currentTab]=input.value;
  [{name:'index.html',c:codes.html,t:'text/html'},{name:'style.css',c:codes.css,t:'text/css'},{name:'script.js',c:codes.js,t:'text/javascript'}].forEach(f=>{
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([f.c],{type:f.t})); a.download=f.name; a.click();
  });
  showToast('⬇ 3 fichiers téléchargés');
}

function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);}

input.addEventListener('input',()=>{
  applyHL(); updateLines(); modDot.classList.add('show');
  clearTimeout(debounceTimer);
  debounceTimer=setTimeout(()=>{codes[currentTab]=input.value;buildPreview();saveStorage();modDot.classList.remove('show');},400);
});
input.addEventListener('scroll',()=>{hlCode.scrollTop=input.scrollTop;hlCode.scrollLeft=input.scrollLeft;lineNums.scrollTop=input.scrollTop;});
input.addEventListener('keyup',updateLines); input.addEventListener('click',updateLines);
input.addEventListener('keydown',e=>{
  if(e.key==='Tab'){e.preventDefault();const s=input.selectionStart,en=input.selectionEnd;input.value=input.value.substring(0,s)+'  '+input.value.substring(en);input.selectionStart=input.selectionEnd=s+2;applyHL();}
  if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();codes[currentTab]=input.value;saveStorage();showToast('💾 Sauvegardé');}
});

const divider=document.getElementById('divider'),previewPane=document.getElementById('previewPane');
let dragging=false;
divider.addEventListener('mousedown',()=>{dragging=true;});
document.addEventListener('mousemove',e=>{if(!dragging)return;const w=document.body.offsetWidth;const pct=((w-e.clientX)/w)*100;previewPane.style.width=Math.max(25,Math.min(65,pct))+'%';});
document.addEventListener('mouseup',()=>{dragging=false;});

loadStorage();
input.value=codes[currentTab];
applyHL(); updateLines(); buildPreview();
