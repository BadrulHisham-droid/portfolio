// ===================================================================
// Cat House Portal — Shared Core (data, auth, sound, cursor FX)
// + LIVE MALAYSIA CLOCK added at bottom
// ===================================================================
(function(){
  const TOTAL_JOBS = 24;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function seed(){
    if (!localStorage.getItem('users')){
      localStorage.setItem('users', JSON.stringify({
        sasha:  { password:'sasha',  role:'student', name:'Sasha'  },
        badrul: { password:'badrul', role:'student', name:'Badrul' },
        admin:  { password:'admin123', role:'admin', name:'Mohd Shukri Bin Muhamad Husin' }
      }));
    }
    if (!localStorage.getItem('pendingRequests')) localStorage.setItem('pendingRequests', '[]');
    if (!localStorage.getItem('libraryEntries')) localStorage.setItem('libraryEntries', '[]');
    ['sasha','badrul'].forEach(u => {
      if (!localStorage.getItem('jobsheet_status_' + u)) localStorage.setItem('jobsheet_status_' + u, JSON.stringify(new Array(TOTAL_JOBS).fill(false)));
      if (!localStorage.getItem('jobsheet_submissions_' + u)) localStorage.setItem('jobsheet_submissions_' + u, JSON.stringify(new Array(TOTAL_JOBS).fill(null).map(() => ({ pdf:null, dueDate:null }))));
    });
  }
  seed();

  try{
    const u = JSON.parse(localStorage.getItem('users') || 'null');
    if (u && u.admin && u.admin.name !== 'Mohd Shukri Bin Muhamad Husin'){
      u.admin.name = 'Mohd Shukri Bin Muhamad Husin';
      localStorage.setItem('users', JSON.stringify(u));
    }
  }catch(e){}

  window.CatData = {
    TOTAL_JOBS,
    getUsers(){ return JSON.parse(localStorage.getItem('users') || '{}'); },
    saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); },
    getPending(){ return JSON.parse(localStorage.getItem('pendingRequests') || '[]'); },
    savePending(p){ localStorage.setItem('pendingRequests', JSON.stringify(p)); },
    getLibrary(){ return JSON.parse(localStorage.getItem('libraryEntries') || '[]'); },
    saveLibrary(l){ localStorage.setItem('libraryEntries', JSON.stringify(l)); },
    getStatus(u){ return JSON.parse(localStorage.getItem('jobsheet_status_' + u) || 'null') || new Array(TOTAL_JOBS).fill(false); },
    saveStatus(u, arr){ localStorage.setItem('jobsheet_status_' + u, JSON.stringify(arr)); },
    getSubs(u){ return JSON.parse(localStorage.getItem('jobsheet_submissions_' + u) || 'null') || new Array(TOTAL_JOBS).fill(null).map(() => ({ pdf:null, dueDate:null })); },
    saveSubs(u, arr){ localStorage.setItem('jobsheet_submissions_' + u, JSON.stringify(arr)); },
    getSession(){ return localStorage.getItem('loggedInUser'); },
    setSession(u){ localStorage.setItem('loggedInUser', u); },
    clearSession(){ localStorage.removeItem('loggedInUser'); }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.id = 'cat-cursor';
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

    const CLICKABLE = 'a, button, input[type="submit"], .home-btn, .btn, .module-card, .step-card, ' +
      '.job-check, .tab-btn, .filter-btn, .add-file-btn, .upload-label, [data-tilt], [data-hover-card], ' +
      '.sound-toggle, .enter-btn, .skip-intro';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(CLICKABLE)) cursor.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(CLICKABLE)) cursor.classList.remove('hovering');
    });
    document.addEventListener('mousedown', () => cursor.classList.add('pressed'));
    document.addEventListener('mouseup', () => cursor.classList.remove('pressed'));
  });

  function renderAuthSlot(){
    const slot = document.getElementById('authNavSlot');
    if (!slot) return;
    const uname = CatData.getSession();
    const users = CatData.getUsers();
    if (uname && users[uname]){
      const u = users[uname];
      slot.innerHTML = `
        <span class="auth-hi">Hi, ${u.name} 👋</span>
        <button type="button" class="auth-link auth-logout" id="logoutBtn">Log out</button>
      `;
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.addEventListener('click', () => {
        CatData.clearSession();
        window.location.href = 'index.html';
      });
    } else {
      slot.innerHTML = `
        <a href="login.html" class="auth-link">Log in</a>
        <a href="register.html" class="auth-link auth-link-primary">Register</a>
      `;
    }
  }
  document.addEventListener('DOMContentLoaded', renderAuthSlot);

  const SOUND_KEY = 'catSoundEnabled';
  let soundOn = localStorage.getItem(SOUND_KEY) !== 'off';
  const meowAudio = new Audio('meow.mp3');
  meowAudio.preload = 'auto';
  let meowStopTimer = null;
  const MEOW_MAX_MS = 1000;
  function playMeowSound(){
    if (!soundOn) return;
    if (meowStopTimer) clearTimeout(meowStopTimer);
    meowAudio.pause();
    meowAudio.currentTime = 0;
    meowAudio.play().catch(()=>{});
    meowStopTimer = setTimeout(() => { meowAudio.pause(); meowAudio.currentTime = 0; }, MEOW_MAX_MS);
  }
  window.catPlayMeow = playMeowSound;
  window.catPlayMew = playMeowSound;
  window.catPlayScratch = playMeowSound;
  window.catPlayPurr = function(){ if (soundOn) playMeowSound(); };
  window.catPlayRandom = playMeowSound;

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('soundToggle');
    if (toggle){
      toggle.textContent = soundOn ? '🔊' : '🔇';
      toggle.setAttribute('aria-pressed', String(soundOn));
      toggle.addEventListener('click', () => {
        soundOn = !soundOn;
        localStorage.setItem(SOUND_KEY, soundOn ? 'on' : 'off');
        toggle.textContent = soundOn ? '🔊' : '🔇';
        toggle.setAttribute('aria-pressed', String(soundOn));
        if (soundOn) playMeowSound();
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('input, textarea, .sound-toggle')) return;
    const mark = document.createElement('span');
    mark.className = 'scratch-mark';
    mark.innerHTML = '🐾';
    mark.style.left = (e.clientX - 14) + 'px';
    mark.style.top = (e.clientY - 14) + 'px';
    mark.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
    document.body.appendChild(mark);
    setTimeout(() => mark.remove(), 900);
    playMeowSound();
  });

  if (!reduceMotion){
    const kitten = document.createElement('div');
    kitten.id = 'roamKitten';
    kitten.textContent = '🐈';
    document.body.appendChild(kitten);

    function startWalk(){
      kitten.classList.remove('walking');
      void kitten.offsetWidth;
      
      // ✅ Random direction: cat ALWAYS faces the way it moves!
      const walkRight = Math.random() > 0.5;
      kitten.style.transform = walkRight ? 'scaleX(1)' : 'scaleX(-1)';
      
      kitten.classList.add('walking');
    }

    setTimeout(startWalk, 4000);
    kitten.addEventListener('animationend', () => {
      kitten.classList.remove('walking');
      const nextDelay = 18000 + Math.random() * 20000;
      setTimeout(startWalk, nextDelay);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const enter = document.getElementById('pageEnter');
    if (!enter) return;
    if (reduceMotion){ enter.remove(); return; }
    const ring = document.createElement('div');
    ring.className = 'paw-ring';
    const steps = 14;
    for (let i = 0; i < steps; i++){
      const ang = (i / steps) * 360;
      const rad = ang * Math.PI / 180;
      const r = 78;
      const x = Math.cos(rad) * r, y = Math.sin(rad) * r;
      const paw = document.createElement('span');
      paw.textContent = '🐾';
      paw.style.transform = `translate(${x}px, ${y}px) rotate(${ang + 90}deg)`;
      paw.style.animationDelay = (i / steps) * 0.9 + 's';
      ring.appendChild(paw);
    }
    enter.appendChild(ring);
    setTimeout(() => enter.remove(), 1500);
  });

  /* =========================================================
     🕐 LIVE MALAYSIA CLOCK — Added ONLY this part!
     Format: HH:MM:SS MYT · Day, DD Month YYYY
     Time Zone: Asia/Kuala_Lumpur (MYT = UTC+8)
     ========================================================= */
  document.addEventListener('DOMContentLoaded', function initMalaysiaClock(){
    const stampArea = document.querySelector('.stamp');
    if (!stampArea) return;

    if (!document.getElementById('malaysiaClockWrap')){
      stampArea.innerHTML = `
        <span class="dot"></span>
        <span id="malaysiaClockWrap" style="display:inline-flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="
            background:#fff; color:#2E7D5B; padding:4px 14px; border-radius:20px;
            font-weight:700; font-size:13px; border:1px solid #BFE9DA; white-space:nowrap;
          ">
            <span id="malaysiaTime">--:--:--</span> MYT
          </span>
          <span id="malaysiaDate" style="font-size:13px; color:#6c6180; white-space:nowrap;">Loading...</span>
        </span>
        <span class="dot"></span>
        <span>DFD40143 • Cat House Portal • Sasha & Badrul</span>
      `;
    }

    const timeEl = document.getElementById('malaysiaTime');
    const dateEl = document.getElementById('malaysiaDate');
    if (!timeEl || !dateEl) return;

    const TZ = 'Asia/Kuala_Lumpur';

    const timeFormatter = new Intl.DateTimeFormat('en-MY', {
      timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    const dateFormatter = new Intl.DateTimeFormat('en-MY', {
      timeZone: TZ, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });

    function updateClock(){
      const now = new Date();
      timeEl.textContent = timeFormatter.format(now);
      dateEl.textContent = dateFormatter.format(now);
    }
    updateClock();
    setInterval(updateClock, 1000);
  });

})();