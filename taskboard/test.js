// ── Configuration Supabase ──
const SUPABASE_URL = 'https://wesdqlztqygsljkpjusw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_whCSSh4C54mEIV_uhzF8rg_pjitToLb';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let estAdmin = false;
let filtre   = 'all';
let toutesTaches = [];

// ── Catégories ──
const CATEGORIES = {
  rwd:      { titre: 'Responsive Web Design',  icone: '🌐', sous: 'HTML, CSS, Flexbox, Grid — freeCodeCamp' },
  js:       { titre: 'JavaScript Algorithms',  icone: '🟨', sous: 'Variables, fonctions, DOM, algos — freeCodeCamp' },
  frontend: { titre: 'Front End Libraries',    icone: '⚛️', sous: 'React, Redux, Sass — freeCodeCamp' },
  perso:    { titre: 'Objectifs personnels',   icone: '🎯', sous: 'BTS SIO, anglais, projets perso' }
};

// ── Tâches par défaut (créées au premier chargement si vide) ──
const TACHES_DEFAUT = [
  // 🌐 Responsive Web Design
  { categorie: 'rwd', texte: 'Apprendre les bases du HTML — balises, structure, sémantique' },
  { categorie: 'rwd', texte: 'Comprendre le rôle du HTML sur le web' },
  { categorie: 'rwd', texte: 'Maîtriser les attributs HTML' },
  { categorie: 'rwd', texte: 'Bases du CSS — sélecteurs, propriétés, box model' },
  { categorie: 'rwd', texte: 'Construire une Cat Photo App (projet pratique)' },
  { categorie: 'rwd', texte: 'CSS Variables — construire un Penguin' },
  { categorie: 'rwd', texte: 'Accessibilité — construire un Web Form' },
  { categorie: 'rwd', texte: 'Flexbox — construire une Twitter Card' },
  { categorie: 'rwd', texte: 'CSS Grid — construire un blog layout complexe' },
  { categorie: 'rwd', texte: 'Media Queries — design responsive' },
  { categorie: 'rwd', texte: 'Projet certif #1 — Survey Form' },
  { categorie: 'rwd', texte: 'Projet certif #2 — Tribute Page' },
  { categorie: 'rwd', texte: 'Projet certif #3 — Technical Documentation Page' },
  { categorie: 'rwd', texte: 'Projet certif #4 — Product Landing Page' },
  { categorie: 'rwd', texte: 'Projet certif #5 — Personal Portfolio Webpage' },
  { categorie: 'rwd', texte: 'Passer l\'examen final Responsive Web Design' },

  // 🟨 JavaScript Algorithms
  { categorie: 'js', texte: 'Bases JS — variables, types, opérateurs' },
  { categorie: 'js', texte: 'Conditions et boucles' },
  { categorie: 'js', texte: 'Fonctions — déclaration, paramètres, retour' },
  { categorie: 'js', texte: 'Tableaux et objets' },
  { categorie: 'js', texte: 'Manipulation du DOM' },
  { categorie: 'js', texte: 'Événements et interactions utilisateur' },
  { categorie: 'js', texte: 'ES6+ — arrow functions, destructuring, modules' },
  { categorie: 'js', texte: 'Programmation orientée objet' },
  { categorie: 'js', texte: 'Programmation fonctionnelle' },
  { categorie: 'js', texte: 'Algorithmes — recherche, tri, récursion' },
  { categorie: 'js', texte: 'Asynchrone — promises, async/await, fetch' },
  { categorie: 'js', texte: 'Projet certif #1 — Palindrome Checker' },
  { categorie: 'js', texte: 'Projet certif #2 — Roman Numeral Converter' },
  { categorie: 'js', texte: 'Projet certif #3 — Caesars Cipher' },
  { categorie: 'js', texte: 'Projet certif #4 — Telephone Number Validator' },
  { categorie: 'js', texte: 'Projet certif #5 — Cash Register' },

  // ⚛️ Front End Libraries
  { categorie: 'frontend', texte: 'Bases de React — composants, JSX' },
  { categorie: 'frontend', texte: 'Props et state' },
  { categorie: 'frontend', texte: 'Hooks — useState, useEffect, useContext' },
  { categorie: 'frontend', texte: 'Gestion d\'état avec Redux' },
  { categorie: 'frontend', texte: 'Routing avec React Router' },
  { categorie: 'frontend', texte: 'Sass — variables, mixins, nesting' },
  { categorie: 'frontend', texte: 'Bootstrap — grid, composants' },

  // 🎯 Objectifs persos
  { categorie: 'perso', texte: 'Certification B1 English for Developers ✓' },
  { categorie: 'perso', texte: 'Décrocher une alternance BTS SIO SLAM' },
  { categorie: 'perso', texte: 'Construire un projet from scratch sans IA' },
  { categorie: 'perso', texte: 'Contribuer à un projet open source' },
  { categorie: 'perso', texte: 'Apprendre Git en profondeur' },
  { categorie: 'perso', texte: 'Maîtriser SQL et bases de données' }
];

// ── Vérifier session ──
async function verifierSession() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    estAdmin = true;
    afficherModeAdmin();
  }
  await chargerTaches();
}

function afficherModeAdmin() {
  document.body.classList.add('admin-mode');
  document.getElementById('adminTrigger').style.display = 'none';
  document.getElementById('adminBadge').style.display = 'block';
}

// ── Modal login ──
function ouvrirModal() {
  document.getElementById('modalOverlay').classList.add('open');
}
function fermerModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('loginErr').style.display = 'none';
}

async function seConnecter() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const err      = document.getElementById('loginErr');
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    err.style.display = 'block';
    return;
  }
  estAdmin = true;
  fermerModal();
  afficherModeAdmin();
  await chargerTaches();
}

async function seDeconnecter() {
  await db.auth.signOut();
  estAdmin = false;
  document.body.classList.remove('admin-mode');
  document.getElementById('adminTrigger').style.display = 'block';
  document.getElementById('adminBadge').style.display = 'none';
  await chargerTaches();
}

// ── Charger les tâches depuis Supabase ──
async function chargerTaches() {
  try {
    const { data: taches, error } = await db.from('taches').select('*').order('ordre');
    if (error) throw error;

    // Si vide et qu'on est admin → on initialise
    if (taches.length === 0 && estAdmin) {
      await initialiserTaches();
      return;
    }

    toutesTaches = taches;
    mettreAJourProgression();
    afficherCategories();
  } catch (err) {
    console.error('Erreur chargement :', err);
    document.getElementById('categoriesList').innerHTML = '<div class="empty">Erreur de chargement</div>';
  }
}

// ── Initialiser les tâches par défaut ──
async function initialiserTaches() {
  const taches = TACHES_DEFAUT.map((t, i) => ({
    texte: t.texte,
    categorie: t.categorie,
    colonne: 'todo',
    complete: false,
    ordre: i
  }));
  await db.from('taches').insert(taches);
  await chargerTaches();
}

// ── Mettre à jour la barre de progression ──
function mettreAJourProgression() {
  const total    = toutesTaches.length;
  const termines = toutesTaches.filter(t => t.complete).length;
  const pct      = total === 0 ? 0 : Math.round((termines / total) * 100);

  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('progressSub').textContent =
    `${termines} tâche${termines > 1 ? 's' : ''} terminée${termines > 1 ? 's' : ''} sur ${total}`;
}

// ── Afficher les catégories et tâches ──
function afficherCategories() {
  const main = document.getElementById('categoriesList');

  if (toutesTaches.length === 0) {
    main.innerHTML = '<div class="empty">Aucune tâche pour le moment.</div>';
    return;
  }

  // Grouper par catégorie
  const groupes = {};
  Object.keys(CATEGORIES).forEach(c => { groupes[c] = []; });
  toutesTaches.forEach(t => {
    if (groupes[t.categorie]) groupes[t.categorie].push(t);
  });

  // Filtrer
  let html = '';
  Object.entries(CATEGORIES).forEach(([key, cat], idx) => {
    let taches = groupes[key] || [];
    if (filtre === 'todo') taches = taches.filter(t => !t.complete);
    if (filtre === 'done') taches = taches.filter(t => t.complete);

    if (taches.length === 0 && filtre !== 'all') return;

    const total    = (groupes[key] || []).length;
    const termines = (groupes[key] || []).filter(t => t.complete).length;
    const openClass = idx === 0 ? 'open' : '';

    html += `
      <div class="categorie ${openClass}" data-cat="${key}">
        <div class="categorie-header" onclick="toggleCategorie('${key}')">
          <div class="cat-titre">
            <span class="cat-icone">${cat.icone}</span>
            <span>${cat.titre}</span>
          </div>
          <div class="cat-stats">
            <span class="cat-count">${termines} / ${total}</span>
            <span class="cat-arrow">▶</span>
          </div>
        </div>
        <div class="taches-list">
          ${taches.map(t => `
            <div class="tache ${t.complete ? 'done' : ''}" onclick="toggleTache('${t.id}')">
              <div class="pastille"></div>
              <div class="tache-texte">${t.texte}</div>
              ${estAdmin ? `<button class="tache-delete" onclick="event.stopPropagation();supprimerTache('${t.id}')">Supprimer</button>` : ''}
            </div>
          `).join('')}
          ${estAdmin ? `<button class="btn-add-tache" onclick="ouvrirModalAjout('${key}')">+ Ajouter une tâche</button>` : ''}
        </div>
      </div>
    `;
  });

  main.innerHTML = html || '<div class="empty">Aucune tâche dans ce filtre.</div>';
}

// ── Toggle catégorie ──
function toggleCategorie(key) {
  const el = document.querySelector(`.categorie[data-cat="${key}"]`);
  if (el) el.classList.toggle('open');
}

// ── Toggle tâche (cocher/décocher) ──
async function toggleTache(id) {
  if (!estAdmin) return;
  const tache = toutesTaches.find(t => t.id === id);
  if (!tache) return;
  const nouveauComplete = !tache.complete;

  // Mise à jour optimiste UI
  tache.complete = nouveauComplete;
  mettreAJourProgression();
  afficherCategories();

  // Mise à jour BDD
  try {
    await db.from('taches').update({
      complete: nouveauComplete,
      colonne: nouveauComplete ? 'termine' : 'todo'
    }).eq('id', id);
  } catch (err) {
    console.error('Erreur toggle :', err);
  }
}

// ── Modal ajouter ──
let categoriePourAjout = null;
function ouvrirModalAjout(cat) {
  categoriePourAjout = cat;
  document.getElementById('addCategorie').value = cat;
  document.getElementById('addTexte').value = '';
  document.getElementById('addModalOverlay').classList.add('open');
  setTimeout(() => document.getElementById('addTexte').focus(), 100);
}
function fermerModalAjout() {
  document.getElementById('addModalOverlay').classList.remove('open');
}

async function ajouterTache() {
  const cat   = document.getElementById('addCategorie').value;
  const texte = document.getElementById('addTexte').value.trim();
  if (!texte) return;
  const maxOrdre = Math.max(0, ...toutesTaches.map(t => t.ordre || 0));
  try {
    await db.from('taches').insert([{
      texte, categorie: cat, colonne: 'todo', complete: false, ordre: maxOrdre + 1
    }]);
    fermerModalAjout();
    await chargerTaches();
  } catch (err) { console.error('Erreur ajout :', err); }
}

// ── Supprimer ──
async function supprimerTache(id) {
  if (!estAdmin) return;
  if (!confirm('Supprimer cette tâche ?')) return;
  try {
    await db.from('taches').delete().eq('id', id);
    await chargerTaches();
  } catch (err) { console.error('Erreur suppression :', err); }
}

// ── Filtres ──
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    filtre = this.dataset.filter;
    afficherCategories();
  });
});

// ── Init ──
verifierSession();
