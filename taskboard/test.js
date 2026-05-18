// ── Configuration Supabase ──
const SUPABASE_URL = 'https://wesdqlztqygsljkpjusw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc2RxbHp0cXlnc2xqa3BqdXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTQ4NjYsImV4cCI6MjA5NDU5MDg2Nn0.tMbX4sbHOS8qzsKaa_nRMfLa5CCbqYWfDOH2hc-r8mQ';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const COLONNES = ['todo', 'encours', 'termine'];
let estAdmin = false;

// ── Vérifier si déjà connecté ──
async function verifierSession() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    estAdmin = true;
    afficherModeAdmin();
  }
  await afficher();
}

// ── Mode admin ──
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

// ── Connexion ──
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
  await afficher();
}

// ── Déconnexion ──
async function seDeconnecter() {
  await db.auth.signOut();
  estAdmin = false;
  document.body.classList.remove('admin-mode');
  document.getElementById('adminTrigger').style.display = 'block';
  document.getElementById('adminBadge').style.display = 'none';
  await afficher();
}

// ── Afficher les tâches ──
async function afficher() {
  try {
    const { data: taches, error } = await db.from('taches').select('*').order('created_at');
    if (error) throw error;
    COLONNES.forEach(col => {
      document.querySelector('#' + col + ' .taches').innerHTML = '';
    });
    taches.forEach(tache => {
      const carte = document.createElement('div');
      carte.className = 'tache';
      carte.innerHTML = `
        <span>${tache.texte}</span>
        <div class="tache-actions">
          ${tache.colonne !== 'todo'    ? `<button class="admin-only" onclick="deplacer('${tache.id}', -1)">◀</button>` : ''}
          ${tache.colonne !== 'termine' ? `<button class="admin-only" onclick="deplacer('${tache.id}', 1)">▶</button>`  : ''}
          <button class="admin-only" onclick="supprimer('${tache.id}')">🗑</button>
        </div>
      `;
      document.querySelector('#' + tache.colonne + ' .taches').appendChild(carte);
    });
  } catch (err) {
    console.error('Erreur chargement :', err);
  }
}

// ── Ajouter une tâche ──
async function ajouter(colonneId) {
  if (!estAdmin) return;
  const texte = prompt('Nom de la tâche :');
  if (!texte || texte.trim() === '') return;
  try {
    await db.from('taches').insert([{ texte: texte.trim(), colonne: colonneId }]);
    await afficher();
  } catch (err) { console.error('Erreur ajout :', err); }
}

// ── Déplacer une tâche ──
async function deplacer(id, direction) {
  if (!estAdmin) return;
  try {
    const { data, error } = await db.from('taches').select('colonne').eq('id', id).single();
    if (error) throw error;
    const nouvelleColonne = COLONNES[COLONNES.indexOf(data.colonne) + direction];
    await db.from('taches').update({ colonne: nouvelleColonne }).eq('id', id);
    await afficher();
  } catch (err) { console.error('Erreur déplacement :', err); }
}

// ── Supprimer une tâche ──
async function supprimer(id) {
  if (!estAdmin) return;
  try {
    await db.from('taches').delete().eq('id', id);
    await afficher();
  } catch (err) { console.error('Erreur suppression :', err); }
}

// ── Boutons Ajouter ──
document.querySelectorAll('.btn-ajouter').forEach(btn => {
  btn.addEventListener('click', function() {
    ajouter(this.closest('.colonne').id);
  });
});

// ── Init ──
verifierSession();
