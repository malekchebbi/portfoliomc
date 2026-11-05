/* Portfolio — Malek Chebbi */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Loader */
  const hideLoader = () => {
    const loader = $('#loader');
    document.body.classList.remove('loading');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 120);
  };
  window.addEventListener('load', () => setTimeout(hideLoader, 450));
  setTimeout(hideLoader, 2200);

  /* Year */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Toast */
  const toast = $('#toast');
  const toastText = $('#toastText');
  let toastTimer;
  const showToast = (msg) => {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  /* Theme */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const applyTheme = (theme, save = true) => {
    root.setAttribute('data-theme', theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f6fb' : '#05060f');
    if (themeBtn) themeBtn.setAttribute('aria-label', theme === 'light' ? 'Activer le thème sombre' : 'Activer le thème clair');
    if (save) try { localStorage.setItem('theme', theme); } catch {}
  };
  try { const saved = localStorage.getItem('theme'); if (saved === 'light' || saved === 'dark') applyTheme(saved, false); } catch {}
  themeBtn?.addEventListener('click', () => applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));

  /* Mobile menu */
  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  const setMenu = (open) => {
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn?.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn?.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  menuBtn?.addEventListener('click', () => setMenu(!nav?.classList.contains('is-open')));
  navLinks?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMenu(false); closeModal(); } });
  document.addEventListener('click', (e) => {
    if (nav?.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
  });

  /* Scroll: progress, nav, back-to-top, spy */
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');
  const sections = $$('main section[id]');
  const navAnchors = $$('#navLinks a[href^="#"]');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (progress) progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      nav?.classList.toggle('is-scrolled', y > 24);
      toTop?.classList.toggle('show', y > 500);
      let current = '';
      sections.forEach((s) => { if (y >= s.offsetTop - 140) current = s.id; });
      navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* Reveal */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  /* Counters */
  const counters = $$('[data-target]');
  const runCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target; el.dataset.suffix = suffix; return; }
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      el.dataset.suffix = suffix;
      if (t < 1) requestAnimationFrame(tick); else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  /* Typed role */
  const typedEl = $('#typedRole');
  const roles = [
    'Ingénieure en Génie Informatique Industrielle',
    'Spécialiste IoT & Systèmes embarqués',
    'Passionnée d\u2019IA & de Robotique',
    'Développeuse Web & Mobile'
  ];
  if (typedEl && !reduceMotion) {
    let ri = 0, ci = 0, del = false;
    const type = () => {
      const full = roles[ri];
      typedEl.textContent = del ? full.slice(0, --ci) : full.slice(0, ++ci);
      let wait = del ? 32 : 48;
      if (!del && ci === full.length) { wait = 1800; del = true; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 260; }
      setTimeout(type, wait);
    };
    setTimeout(type, 900);
  }

  /* Cursor glow */
  const glow = $('#cursorGlow');
  if (glow && matchMedia('(pointer:fine)').matches && !reduceMotion) {
    let gx = 0, gy = 0, tx = 0, ty = 0, raf;
    const move = () => {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(move);
    };
    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(move); }, { passive: true });
  }

  /* Tilt card */
  const card = $('#codeCard');
  const stage = $('#visualStage');
  if (card && stage && matchMedia('(pointer:fine)').matches && !reduceMotion) {
    stage.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-2px)`;
    });
    stage.addEventListener('mouseleave', () => { card.style.transform = ''; });
  }

  /* Magnetic buttons */
  if (matchMedia('(pointer:fine)').matches && !reduceMotion) {
    $$('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* Skills tabs */
  const tabs = $$('.skill-tab[data-skill]');
  const panels = $$('.skills-panel[data-panel]');
  const activateTab = (key) => {
    tabs.forEach((t) => {
      const on = t.dataset.skill === key;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => {
      const on = p.dataset.panel === key;
      p.classList.toggle('active', on);
      p.hidden = !on;
    });
  };
  tabs.forEach((t) => t.addEventListener('click', () => activateTab(t.dataset.skill)));

  /* Project filters */
  const filterBtns = $$('.filter-btn[data-filter]');
  const cards = $$('.project-card[data-category]');
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => { const on = b === btn; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    cards.forEach((card) => {
      const show = f === 'all' || (card.dataset.category || '').split(/\s+/).includes(f);
      if (show) {
        card.classList.remove('is-hidden');
        requestAnimationFrame(() => card.classList.remove('is-hiding'));
      } else {
        card.classList.add('is-hiding');
        setTimeout(() => { if (card.classList.contains('is-hiding')) card.classList.add('is-hidden'); }, 220);
      }
    });
  }));

  /* Project modal */
  const projects = {
    skincheck: { index:'01', category:'IA · Mobile', img:'assets/img/projects/skincheck.svg', alt:'Diagnostic cutané assisté par intelligence artificielle',
      desc:"Application mobile de diagnostic cutané assistée par intelligence artificielle. L'utilisateur capture une photo de peau, et un modèle de vision par ordinateur analyse l'image pour fournir une aide au pré-diagnostic.",
      highlights:["Conception et entraînement d'un réseau de neurones convolutif (CNN) pour la classification d'images dermatologiques.","Prétraitement des données, augmentation d'images et évaluation des performances du modèle.","Développement de l'interface mobile Android en Java/XML pour une prise en main simple.","Intégration du modèle TensorFlow/Keras dans le flux applicatif."],
      stack:['Python','TensorFlow','Keras','CNN','Java','XML','Android'] },
    leoni: { index:'02', category:'IoT · Mobile', context:'Stage — LEONI, Sousse', title:'IoT Monitor — LEONI', img:'assets/img/projects/leoni-iot.svg', alt:'Supervision IoT en temps réel',
      desc:"Application mobile de supervision d'appareils IoT en environnement industriel. Elle permet de visualiser l'état des équipements en temps réel et d'interagir via un assistant virtuel intelligent.",
      highlights:["Mise en place d'un environnement IoT basé sur ESP32 avec communication MQTT.","Développement d'une application React Native bilingue (FR/EN) avec i18next.","Intégration d'un assistant virtuel intelligent via l'API Groq pour faciliter l'interaction.","Authentification et synchronisation temps réel via Firebase Authentication, Realtime Database et Firestore."],
      stack:['ESP32','MQTT','React Native','Firebase','API Groq','i18next','JavaScript'] },
    robotino: { index:'03', category:'Robotique', context:'Projet académique', title:'Robotino — Navigation autonome', img:'assets/img/projects/robotino.jpg', alt:'Robot mobile autonome',
      desc:"Intégration et exploitation du robot mobile Festo Robotino dans un environnement de simulation, avec un focus sur la perception, la navigation et le contrôle.",
      highlights:["Modélisation et simulation du robot dans Gazebo pour valider les comportements avant déploiement.","Développement de nœuds ROS2 en Python pour la communication entre capteurs, contrôleurs et actionneurs.","Tests de scénarios de déplacement et d'interaction avec l'environnement simulé."],
      stack:['ROS2','Gazebo','Python','Robotino','Linux'] },
    niryo: { index:'04', category:'Robotique', context:'Projet académique', title:'Bras Niryo — Commande gestuelle', img:'assets/img/projects/niryo.jpg', alt:'Bras robotisé à commande gestuelle',
      desc:"Système de commande d'un bras robotisé Niryo à partir des gestes de la main, combinant perception, cinématique et simulation.",
      highlights:["Capture et interprétation des gestes de la main pour piloter les mouvements du bras.","Création d'un jumeau numérique sous Gazebo pour tester les trajectoires en toute sécurité.","Développement de la logique de contrôle en Python avec ROS2 pour une exécution fluide."],
      stack:['ROS2','Gazebo','Python','Niryo','Vision'] },
    ev: { index:'05', category:'IoT · Embarqué', context:'Projet académique', title:'Monitoring de véhicules électriques', img:'assets/img/projects/ev-monitoring.svg', alt:'Monitoring de véhicule électrique',
      desc:"Tableau de bord de supervision pour véhicules électriques, collectant des mesures environnementales et les affichant en temps réel sur une interface desktop.",
      highlights:["Acquisition des données capteurs : température/humidité (DHT22) et détection de pluie via Arduino.","Communication série entre la carte embarquée et l'ordinateur avec PySerial.","Développement d'une interface de monitoring claire et réactive avec PyQt5."],
      stack:['Arduino','DHT22','Capteur de pluie','Python','PyQt5','PySerial'] },
    chassis: { index:'06', category:'IoT · Mobile', context:'Projet académique', title:'Châssis intelligent', img:'assets/img/projects/chassis.svg', alt:'Châssis intelligent et électronique embarquée',
      desc:"Châssis mobile intelligent piloté à distance depuis une application Android, avec un firmware embarqué assurant le contrôle des moteurs.",
      highlights:["Programmation du microcontrôleur STM32 pour la commande des actionneurs.","Développement d'une application Android Studio en Java pour le pilotage à distance.","Communication fiable entre l'interface mobile et le système embarqué."],
      stack:['STM32','Android Studio','Java','Embarqué','C/C++'] },
    fraud: { index:'07', category:'Web · Sécurité', context:"Stage de fin d'études — OXYDEV", title:'Application web anti-fraude', img:'assets/img/projects/anti-fraude.svg', alt:'Plateforme web de sécurité anti-fraude',
      desc:"Plateforme web conçue pour aider à détecter et prévenir les comportements frauduleux, avec une interface d'administration claire et un back-end robuste.",
      highlights:["Conception de l'architecture applicative et des parcours utilisateurs orientés prévention.","Développement du back-end avec Symfony (PHP) et gestion des données.","Création d'une interface responsive et ergonomique avec Bootstrap."],
      stack:['Symfony','PHP','Bootstrap','MySQL','HTML/CSS'] }
  };
  const modal = $('#projectModal');
  const mTitle = $('#modalTitle'), mDesc = $('#modalDesc'), mCat = $('#modalCategory'), mCtx = $('#modalContext');
  const mIndex = $('#modalIndex'), mArt = $('#modalArt'), mIcon = $('#modalIcon'), mHi = $('#modalHighlights'), mStack = $('#modalStack'), mImg = $('#modalImg');
  let lastFocus = null;
  const openModal = (id) => {
    const p = projects[id];
    if (!p || !modal) return;
    lastFocus = document.activeElement;
    mTitle.textContent = p.title; mDesc.textContent = p.desc; mCat.textContent = p.category; mCtx.textContent = p.context;
    mIndex.textContent = p.index; mArt.style.setProperty('--a', p.a); mArt.style.setProperty('--b', p.b);
    mIcon.innerHTML = `<use href="#${p.icon}"></use>`;
    if (mImg) { mImg.classList.remove('is-error'); mImg.src = p.img || ''; mImg.alt = p.alt || ''; if (!p.img) mImg.classList.add('is-error'); }
    mHi.innerHTML = p.highlights.map(h => `<li>${h}</li>`).join('');
    mStack.innerHTML = p.stack.map(s => `<span>${s}</span>`).join('');
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
    $('.modal-close', modal)?.focus();
  };
  const closeModal = () => {
    if (!modal?.classList.contains('open')) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  $$('[data-project]').forEach((b) => b.addEventListener('click', () => openModal(b.dataset.project)));
  $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
  modal?.addEventListener('keydown', (e) => { if (e.key === 'Tab') {
    const f = $$('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])', modal).filter(x => !x.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }});

  /* Copy */
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const text = btn.dataset.copy || '';
    try { await navigator.clipboard.writeText(text); showToast('Copié dans le presse-papiers'); }
    catch { showToast('Copie impossible — sélectionnez le texte'); }
  }));

  /* Contact form -> mailto */
  $('#contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const subject = (fd.get('subject') || 'Contact depuis le portfolio').toString().trim();
    const message = (fd.get('message') || '').toString().trim();
    if (!name || !email || !message) { showToast('Merci de remplir les champs requis.'); return; }
    const body = `Nom : ${name}\nEmail : ${email}\n\n${message}`;
    location.href = `mailto:malek.ch101@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('Ouverture de votre client mail…');
  });
})();
