# Portfolio — Ismaël Ouzani

> Candidat BTS SIO en alternance · Option SLAM · Lens, France

Site portfolio multi-pages avec backend, animations et espace admin, déployé sur GitHub Pages.

## 🔗 Live

**[io2310.github.io/Portfolio-V2](https://io2310.github.io/Portfolio-V2/)**

---

## 🛠 Stack technique

| Couche | Technologie | Usage |
|--------|-------------|-------|
| Frontend | HTML5, CSS3, JavaScript | Structure, style, interactions |
| Animations | GSAP 3 + ScrollTrigger | Révélation au scroll, mot par mot |
| Backend | Supabase (PostgreSQL) | BDD, auth, API REST |
| Email | EmailJS | Formulaire de contact |
| Hébergement | GitHub Pages | Déploiement statique gratuit |

---

## 📁 Structure

```
Portfolio/
├── index.html          # Accueil
├── about.html          # À propos + compétences
├── projects.html       # Projets
├── contact.html        # Formulaire contact → Supabase + EmailJS
├── style.css           # CSS global
├── script.js           # JS global (animations, nav, transitions)
├── supabase.js         # Connexion base de données
├── libs/               # Librairies locales (GSAP)
├── live-editor/        # Éditeur HTML/CSS/JS en temps réel
└── taskboard/          # Kanban avec auth Supabase
    ├── taskboard.html  # Interface publique + login admin
    ├── test.js         # Logique Supabase + auth
    └── test.css        # Styles Apple
```

---

## ⚙️ Fonctionnalités

### Formulaire contact
- Sauvegarde chaque message dans Supabase
- Envoi email via EmailJS
- Double sécurité : même si l'email part en spam, le message est en BDD

### TaskBoard public
- Tâches visibles par tous en lecture seule
- Login admin discret (bouton ⚙ en bas à droite)
- Toi seul peux ajouter/modifier/supprimer via Supabase Auth
- Barre de progression de formation visible par les recruteurs

### Espace admin local
- `admin.html` — non déployé, à ouvrir en local uniquement
- Voir tous les messages reçus avec bouton Répondre
- Gérer les tâches du TaskBoard

### LiveCode Editor
- Éditeur HTML/CSS/JS avec rendu temps réel
- Coloration syntaxique, sauvegarde auto, téléchargement
- Inspiré de CodePen — construit from scratch

---

## 🗄 Base de données Supabase

### Table `messages`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| nom | text | Nom de l'expéditeur |
| email | text | Email de l'expéditeur |
| sujet | text | Sujet du message |
| message | text | Contenu |
| created_at | timestamp | Date d'envoi |

### Table `taches`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| texte | text | Contenu de la tâche |
| colonne | text | todo / encours / termine |
| created_at | timestamp | Date de création |

### Règles de sécurité (RLS)
- `messages` → accès public en lecture/écriture (formulaire contact)
- `taches` → lecture publique, écriture réservée aux utilisateurs authentifiés

---

## 📬 Contact

**ismael.ouzani@gmail.com** · [github.com/IO2310](https://github.com/IO2310)
