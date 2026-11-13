(() => {
  const S = window.SITE, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const store = { get: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const AVATAR = `https://github.com/${S.github}.png?size=200`;
  const ORDER = ['about', 'work', 'contact', 'skills', 'journey', 'coffee', 'qda'];
  const ICON = { about: `<img src="${AVATAR}" alt="" onerror="this.replaceWith('👋')">`, work: '🧩', contact: '💬', skills: '⚡', journey: '🕒', coffee: '☕', qda: '🔬' };
  const COLOR = { about: 'var(--blue)', work: 'var(--violet)', contact: 'var(--cyan)', skills: 'var(--blue)', journey: 'var(--amber)', coffee: 'var(--pink)', qda: 'var(--green)' };
  let lang = new URLSearchParams(location.search).get('lang') || store.get('lang') || 'th';
  let current = null, lastFocus = null;
  const T = () => S.t[lang];
  const projectTotal = S.projects.reduce((n, [, l]) => n + l.length, 0) + S.featured.length;

  /* ---------- static text ---------- */
  function applyText() {
    document.documentElement.lang = lang;
    $$('[data-t]').forEach(el => { el.textContent = T()[el.dataset.t] ?? ''; });
    $$('.langs button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
    renderCards();
    if (current) open(current, true);
  }

  /* ---------- floating cards ---------- */
  function mini(k) {
    const t = T();
    if (k === 'about') return `<div class="mini"><div class="stats"><div><strong>10+</strong><small>${t.yrs}</small></div><div><strong>50+</strong><small>${t.systems}</small></div></div>
      <div class="row" style="justify-content:center"><b style="--rc:var(--green);width:8px;height:8px;border-radius:50%"></b>${t.sayHello} · f · gh</div></div>`;
    if (k === 'skills') return `<div class="mini">${[['🖥️', 'Frontend', '#2f6bff'], ['🗄️', 'Backend', '#7b4dff'], ['💾', 'Database', '#13a37a'], ['🛠️', 'DevOps & Tools', '#e2553a']]
      .map(([e, n, c]) => `<div class="row"><b style="--rc:${c}">${e}</b>${n}</div>`).join('')}</div>`;
    if (k === 'journey') return `<div class="mini"><div class="tl"><span>2015<small>WU</small></span><span>2020<small>Freelance</small></span><span>${lang === 'th' ? 'ตอนนี้' : 'Now'}<small>SA</small></span></div></div>`;
    if (k === 'contact') return `<div class="mini"><div class="row"><b style="--rc:#1f8f4e">📞</b>093-146-4976</div><div class="row"><b style="--rc:#1877f2">f</b>Facebook</div><div class="row"><b style="--rc:#30363d">⌥</b>GitHub</div></div>`;
    if (k === 'coffee') return `<div class="mini"><div class="qrmini"><i>▦</i><span>${t.coffeeMini}</span></div></div>`;
    if (k === 'qda') return `<div class="mini"><div class="row" style="justify-content:center"><b style="--rc:#13a37a">🔗</b>${t.qda.mini} ↗</div></div>`;
    if (k === 'work') return `<p style="margin-top:8px;font-weight:600;color:#fff">${projectTotal} ${t.projectsCount}</p>`;
    return '';
  }
  function renderCards() {
    const t = T();
    $('#cards').innerHTML = ORDER.map((k, i) => `
      <button class="card" data-k="${k}" aria-haspopup="dialog" aria-label="${esc(t.cards[k][0])}">
        <span class="num">${i + 1}</span>
        <div class="ic">${ICON[k]}</div>
        <h2>${esc(t.cards[k][0])}</h2>
        ${t.cards[k][1] ? `<p>${esc(t.cards[k][1])}</p>` : ''}
        ${mini(k)}
      </button>`).join('');
  }

  /* ---------- panels ---------- */
  const head = (k, h) => `<div class="p-head"><div class="ic">${ICON[k]}</div><div><div class="eyebrow">${h.eyebrow}</div><h3 id="pTitle">${h.title}</h3></div></div>`;
  const lvl = n => `<span class="lvl l${n}">${T().levels[n - 1]}</span>`;
  const contactBtns = () => `<div class="btns">
      <a class="btn primary" href="tel:${S.phone}">📞 093-146-4976</a>
      <a class="btn" href="${S.links.facebook}" target="_blank" rel="noopener">Facebook ↗</a>
      <a class="btn" href="${S.links.github}" target="_blank" rel="noopener">GitHub ↗</a>
      <a class="btn" href="${S.links.appkm}" target="_blank" rel="noopener">appkm.com ↗</a></div>`;

  const PANELS = {
    about() { const a = T().about; return head('about', a) + `
      <p>${a.p1}</p>
      <div class="pstats">${a.stats.map(([v, l]) => `<div><strong>${v}</strong><small>${l}</small></div>`).join('')}</div>
      <p>${a.p2}</p>
      <h4>${a.stack}</h4><div class="chips">${S.core.map(c => `<span class="chip">${c}</span>`).join('')}</div>
      <h4>Start a conversation</h4><p style="font-size:19px;font-weight:700;color:#fff;margin-bottom:6px">${a.cta} <span style="color:var(--blue)">${a.ctaHi}</span></p>
      <p>${a.ctaP}</p>${contactBtns()}`; },
    work() { const w = T().work; return head('work', w) + `
      <h4>${w.featured}</h4><div class="feat">${S.featured.map(([n, d]) => `<div><b>${n}</b><small>${d}</small></div>`).join('')}</div>
      <h4>${w.all} · ${projectTotal} ${T().projectsCount}</h4>
      ${S.projects.map(([g, l]) => `<div class="wgroup"><h5>${g}</h5><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}`; },
    skills() { const s = T().skills; return head('skills', s) + `
      <div class="sk-grid">${S.skills.map(([g, e, items]) => `<div class="sk-group"><h5>${e} ${g}</h5>
        ${items.map(([n, v]) => `<div class="sk">${n}${lvl(v)}</div>`).join('')}</div>`).join('')}</div>`; },
    journey() { const j = T().journey; return head('journey', j) + `
      <div class="timeline">${S.journey[lang].map(([w, b, l]) => `<div class="t"><div class="when">${w}</div><b>${b}</b><ul>${l.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`; },
    qda() { const q = T().qda; return head('qda', q) + `<p>${q.p}</p>
      <div class="btns"><a class="btn primary" href="${S.links.qda}" target="_blank" rel="noopener">🔬 ${q.open} ↗</a></div>
      <p style="margin-top:10px;font-size:13px;color:var(--muted)">${S.links.qda.replace('https://', '')}</p>`; },
    contact() { const c = T().contact; return head('contact', c) + `<p>${c.p}</p>${contactBtns()}`; },
    coffee() { const c = T().coffee; return head('coffee', c) + `<p>${c.p}</p>
      <div class="coffee"><div>
        <div class="cups">${[[1, '☕'], [2, '☕☕'], [3, '🍰'], [5, '🚀']].map(([n, e], i) =>
          `<button type="button" class="cup" data-n="${n}"><span class="e">${e}</span><b>${n} ${c.cups}</b><small>${c.opts[i]} · ${n * S.coffeePrice}฿</small></button>`).join('')}</div>
        <div class="stepper"><span>${c.custom}</span><div class="box"><button type="button" data-step="-1" aria-label="-">−</button>
          <input id="qty" type="number" min="1" max="99" value="1" aria-label="${c.cups}"><button type="button" data-step="1" aria-label="+">+</button></div>
          <span>${c.cups} × ${S.coffeePrice} ${c.baht}</span></div>
        <div class="ctotal"><span>${c.total}</span><b id="ctotal"></b></div></div>
        <div class="qrcard"><div class="pp">PromptPay · พร้อมเพย์</div><div class="qr" id="qr"></div>
        <div class="amt" id="qamt"></div><small>${c.scan}<br>093-146-4976</small></div></div>`; },
  };

  /* ---------- PromptPay ---------- */
  const f = (id, v) => id + String(v.length).padStart(2, '0') + v;
  function crc16(str) { let c = 0xFFFF; for (const b of new TextEncoder().encode(str)) { c ^= b << 8; for (let i = 0; i < 8; i++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF; } return c.toString(16).toUpperCase().padStart(4, '0'); }
  function promptpay(amount) {
    const p = f('00', '01') + f('01', '12') + f('29', f('00', 'A000000677010111') + f('01', '0066' + S.phone.replace(/^0/, '')))
      + f('53', '764') + f('54', amount.toFixed(2)) + f('58', 'TH') + '6304';
    return p + crc16(p);
  }
  window.__promptpay = promptpay;
  function wireCoffee() {
    const qty = $('#qty'); if (!qty) return;
    const render = () => {
      const n = Math.max(1, Math.min(99, parseInt(qty.value) || 1)); qty.value = n;
      const amt = n * S.coffeePrice;
      $$('.cup').forEach(c => c.classList.toggle('on', +c.dataset.n === n));
      $('#ctotal').textContent = amt.toLocaleString('th-TH') + ' ฿';
      $('#qamt').textContent = '฿ ' + amt.toLocaleString('th-TH', { minimumFractionDigits: 2 });
      if (window.qrcode) { const q = qrcode(0, 'M'); q.addData(promptpay(amt)); q.make(); $('#qr').innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }
    };
    $('#panelInner').addEventListener('click', e => {
      const cup = e.target.closest('.cup'), st = e.target.closest('[data-step]');
      if (cup) { qty.value = cup.dataset.n; render(); }
      if (st) { qty.value = (+qty.value || 1) + (+st.dataset.step); render(); }
    });
    qty.addEventListener('input', render); render();
  }

  /* ---------- overlay ---------- */
  function open(k, keep) {
    if (!keep) lastFocus = document.activeElement;
    current = k;
    const panel = $('#panel');
    panel.style.setProperty('--c', COLOR[k]);
    const inner = $('#panelInner'); const fresh = inner.cloneNode(false); inner.replaceWith(fresh);
    fresh.innerHTML = PANELS[k]();
    if (k === 'coffee') wireCoffee();
    $('#overlay').classList.add('open'); $('#overlay').setAttribute('aria-hidden', 'false');
    if (!keep) { panel.scrollTop = 0; setTimeout(() => panel.querySelector('.close').focus(), 50); }
    history.replaceState(null, '', '#' + k);
  }
  function close() {
    current = null;
    $('#overlay').classList.remove('open'); $('#overlay').setAttribute('aria-hidden', 'true');
    history.replaceState(null, '', location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus();
  }

  /* ---------- events ---------- */
  $('#cards').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) open(c.dataset.k); });
  $('#overlay').addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  $$('.langs button').forEach(b => b.onclick = () => { lang = b.dataset.lang; store.set('lang', lang); applyText(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && current) return close();
    if (e.target.matches('input,textarea')) return;
    const i = parseInt(e.key); if (i >= 1 && i <= ORDER.length) open(ORDER[i - 1]);
  });

  /* parallax + spotlight (desktop pointer only) */
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const st = $('#stage');
    addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      st.style.setProperty('--mx', e.clientX + 'px'); st.style.setProperty('--my', e.clientY + 'px');
      $('#bg').style.setProperty('--px', (-x * 18) + 'px'); $('#bg').style.setProperty('--py', (-y * 12) + 'px');
      $('#person').style.setProperty('--px2', (x * 10) + 'px'); $('#person').style.setProperty('--py2', (y * 6) + 'px');
      $$('.card').forEach((c, i) => { const d = (i % 3 + 1) * 6; c.style.setProperty('--cx', (x * d) + 'px'); c.style.setProperty('--cy', (y * d) + 'px'); });
    });
  }

  /* optional images: use them when present */
  const bgImg = new Image(); bgImg.onload = () => { $('#bg').style.backgroundImage = `url(${bgImg.src})`; $('#bg').classList.add('has-img'); }; bgImg.src = 'assets/img/office-bg.webp';
  const pImg = $('#personImg'); const usePerson = () => pImg.naturalWidth && $('#person').classList.add('has-img');
  pImg.complete ? usePerson() : pImg.addEventListener('load', usePerson);

  $('#year').textContent = new Date().getFullYear();
  applyText();
  requestAnimationFrame(() => $('#stage').classList.add('ready'));
  const h = location.hash.slice(1); if (ORDER.includes(h)) open(h);
})();
