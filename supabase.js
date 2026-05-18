// ── Configuration Supabase ──
const SUPABASE_URL = 'https://wesdqlztqygsljkpjusw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc2RxbHp0cXlnc2xqa3BqdXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTQ4NjYsImV4cCI6MjA5NDU5MDg2Nn0.tMbX4sbHOS8qzsKaa_nRMfLa5CCbqYWfDOH2hc-r8mQ';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Messages ──
async function sauvegarderMessage(nom, email, sujet, message) {
  const { error } = await db.from('messages').insert([{ nom, email, sujet, message }]);
  if (error) throw error;
}

// ── Tâches ──
async function recupererTaches() {
  const { data, error } = await db.from('taches').select('*').order('created_at');
  if (error) throw error;
  return data;
}
async function ajouterTache(texte, colonne) {
  const { data, error } = await db.from('taches').insert([{ texte, colonne }]).select();
  if (error) throw error;
  return data[0];
}
async function deplacerTache(id, nouvelleColonne) {
  const { error } = await db.from('taches').update({ colonne: nouvelleColonne }).eq('id', id);
  if (error) throw error;
}
async function supprimerTache(id) {
  const { error } = await db.from('taches').delete().eq('id', id);
  if (error) throw error;
}
