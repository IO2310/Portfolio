/* ════════════════════════════════════════
   PORTFOLIO — Ismaël Ouzani
   Script principal
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── TRANSITIONS DE PAGES ── */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      const wrap = document.querySelector('.page-wrap');
      if (wrap) wrap.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });

  /* ── FIX PAGE BLANCHE AU RETOUR ── */
  // Quand on revient via bouton retour du navigateur, retirer la classe page-exit
  window.addEventListener('pageshow', (e) => {
    const wrap = document.querySelector('.page-wrap');
    if (wrap) {
      wrap.classList.remove('page-exit');
      // Forcer l'animation pageIn à se rejouer
      wrap.style.opacity = '';
      wrap.style.animation = 'none';
      void wrap.offsetWidth; // reflow
      wrap.style.animation = '';
    }
  });

  /* ── NAV ACTIVE ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ── NAV AU SCROLL ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.borderBottomColor = window.scrollY > 8 ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.08)';
    }, { passive: true });
  }

  /* ── MENU HAMBURGER ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('open');
      hamburger.textContent = drawer.classList.contains('open') ? '✕' : '☰';
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.textContent = '☰';
      });
    });
  }

  /* ── BOUTONS MAGNÉTIQUES ── */
  document.querySelectorAll('.btn-mag').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * .2;
      const y = (e.clientY - r.top  - r.height / 2) * .2;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── ANIMATIONS GSAP ── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Révélation */
    gsap.utils.toArray('.reveal').forEach(el => {
      el.style.opacity = ''; el.style.transform = '';
      gsap.fromTo(el, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: .65, ease: 'power3.out',
        delay: parseFloat(el.dataset.d || 0),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });

    /* Zoom */
    gsap.utils.toArray('.zoom-in').forEach(el => {
      el.style.opacity = ''; el.style.transform = '';
      gsap.fromTo(el, { opacity: 0, scale: .96 }, {
        opacity: 1, scale: 1, duration: .7, ease: 'power3.out',
        delay: parseFloat(el.dataset.d || 0),
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
      });
    });

    /* Mot par mot */
    gsap.utils.toArray('[data-words]').forEach(el => {
      const words = el.innerHTML.trim().split(' ');
      el.innerHTML = words.map(w =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="wi" style="display:inline-block">${w}</span></span>`
      ).join(' ');
      gsap.fromTo(el.querySelectorAll('.wi'), { y: '110%', opacity: 0 }, {
        y: '0%', opacity: 1, duration: .6, ease: 'power3.out', stagger: .04,
        scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' }
      });
    });

    /* Compteurs */
    gsap.utils.toArray('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.4, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.floor(obj.val); },
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

  } else {
    /* Fallback CSS si GSAP pas dispo */
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal, .zoom-in').forEach(el => obs.observe(el));

    const obsCount = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          const step = target / (1200 / 16); let cur = 0;
          const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = Math.floor(cur); if (cur >= target) clearInterval(t); }, 16);
        });
        obsCount.unobserve(e.target);
      });
    }, { threshold: .3 });
    document.querySelectorAll('.stats-wrap, .stats-2x2').forEach(s => obsCount.observe(s));
  }

});

/* ── BARRES DE COMPÉTENCES ── */
const obsBarres = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.querySelectorAll('.sk-fill[data-w]').forEach(f =>
      setTimeout(() => { f.style.width = f.dataset.w + '%'; }, 150)
    );
  });
}, { threshold: .2 });
document.querySelectorAll('.sk-card').forEach(c => obsBarres.observe(c));

/* ── CERCLES SOFT SKILLS ── */
const obsCercles = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sft-item').forEach((item, i) => {
      const arc = item.querySelector('.sarc');
      const val = item.querySelector('.sft-val');
      const p   = parseInt(item.dataset.p || 100);
      if (!arc) return;
      setTimeout(() => {
        arc.style.transition = 'stroke-dasharray 1.3s cubic-bezier(.16,1,.3,1)';
        arc.style.strokeDasharray = p + ' 100';
        if (val) val.textContent = p + '%';
      }, i * 150);
    });
  });
}, { threshold: .3 });
document.querySelectorAll('.sk-card').forEach(c => obsCercles.observe(c));

/* ── Formulaire contact — EmailJS + sauvegarde Supabase ── */
async function envoyerMessage() {
  const nom     = document.getElementById('champ_nom').value.trim();
  const email   = document.getElementById('champ_email').value.trim();
  const sujet   = document.getElementById('champ_sujet').value.trim();
  const message = document.getElementById('champ_message').value.trim();
  const statut  = document.getElementById('statut_form');
  const btn     = document.getElementById('btn_envoyer');
  if (!nom || !email || !message) {
    statut.className = 'statut-form err';
    statut.textContent = '✗ Nom, email et message requis.';
    return;
  }
  btn.disabled = true; btn.textContent = 'Envoi…'; statut.className = 'statut-form';
  try {
    await emailjs.send('service_9iambjx', 'template_x5w20bd', {
      from_name: nom, from_email: email,
      subject: sujet || 'Contact via portfolio', message, to_name: 'Ismaël'
    });
    statut.className = 'statut-form ok';
    statut.textContent = '✓ Message envoyé ! Réponse sous 24h.';
    ['champ_nom','champ_email','champ_sujet','champ_message'].forEach(id => document.getElementById(id).value = '');
  } catch {
    statut.className = 'statut-form err';
    statut.textContent = '✗ Erreur. Écrivez à ismael.ouzani@gmail.com';
  }
  btn.disabled = false; btn.textContent = 'Envoyer →';
}

/* ── MODAL CONTACT ── */
function ouvrirContact() {
  document.getElementById('contactOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function fermerContact() {
  document.getElementById('contactOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('contactOverlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) fermerContact();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') fermerContact();
    });
  }
});

/* ── FORMULAIRE CONTACT — EmailJS ── */
async function envoyerMessage() {
  const nom     = document.getElementById('champ_nom')?.value.trim();
  const email   = document.getElementById('champ_email')?.value.trim();
  const sujet   = document.getElementById('champ_sujet')?.value.trim();
  const message = document.getElementById('champ_message')?.value.trim();
  const statut  = document.getElementById('statut_form');
  const btn     = document.getElementById('btn_envoyer');
  if (!nom || !email || !message) {
    statut.className = 'statut-form err';
    statut.textContent = '✗ Nom, email et message requis.';
    return;
  }
  btn.disabled = true; btn.textContent = 'Envoi…'; statut.className = 'statut-form';
  try {
    await emailjs.send('service_9iambjx', 'template_x5w20bd', {
      from_name: nom, from_email: email,
      subject: sujet || 'Contact via portfolio',
      message, to_name: 'Ismaël'
    });
    statut.className = 'statut-form ok';
    statut.textContent = '✓ Message envoyé ! Réponse sous 24h.';
    ['champ_nom','champ_email','champ_sujet','champ_message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  } catch {
    statut.className = 'statut-form err';
    statut.textContent = '✗ Erreur. Écrivez à ismael.ouzani@gmail.com';
  }
  btn.disabled = false; btn.textContent = 'Envoyer →';
}
