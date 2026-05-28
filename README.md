# Portfolio — Ismaël Ouzani

> Candidat BTS SIO en alternance · Option SLAM · Lens, France

Portfolio multi-pages déployé sur GitHub Pages, avec suivi de formation en temps réel et backend Supabase.

## 🔗 Live

**[io2310.github.io/Portfolio](https://io2310.github.io/Portfolio/)**

---

## 🛠 Stack technique

| Couche | Technologie | Usage |
|--------|-------------|-------|
| Frontend | HTML5, CSS3, JavaScript | Structure, style, interactions |
| Animations | GSAP 3 + ScrollTrigger | Révélation au scroll, transitions |
| Backend | Supabase (PostgreSQL) | Auth + suivi de progression |
| Email | EmailJS | Formulaire de contact |
| Hébergement | GitHub Pages | Déploiement statique |

---

## 📁 Structure

```
Portfolio/
├── index.html              # Accueil
├── about.html              # À propos + compétences
├── projects.html           # Projets
├── contact.html            # Formulaire de contact (EmailJS)
├── style.css               # CSS global
├── script.js               # JS global
├── supabase.js             # Connexion Supabase
├── cv-ismael-ouzani.pdf    # CV téléchargeable
├── favicon.svg
├── libs/                   # Librairies locales
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
├── live-editor/            # Éditeur HTML/CSS/JS en temps réel
└── learning-tracker/       # Suivi de formation freeCodeCamp
    ├── index.html
    ├── learning-tracker.css
    └── learning-tracker.js
```

---

## ⚙️ Fonctionnalités

### Formulaire de contact
- Envoi direct par email via EmailJS
- Aucune donnée personnelle stockée

### Suivi de formation — Learning Tracker
- Progression freeCodeCamp visible publiquement (HTML, CSS, JavaScript)
- Sections cochables uniquement par l'administrateur via Supabase Auth
- Barre de progression globale mise à jour en temps réel

### LiveCode Editor
- Éditeur HTML/CSS/JS avec prévisualisation en direct
- Sauvegarde automatique et téléchargement
- Inspiré de CodePen — développé from scratch

---

## 🗄 Base de données Supabase

### Table `progression`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| section_id | text | Identifiant de la section freeCodeCamp |
| complete | boolean | Section terminée ou non |
| updated_at | timestamp | Date de mise à jour |

### Règles de sécurité (RLS)
- Lecture publique — tout le monde voit la progression
- Écriture réservée aux utilisateurs authentifiés (admin uniquement)

---

## 📬 Contact

**ismael.ouzani@gmail.com** · [github.com/IO2310](https://github.com/IO2310)
