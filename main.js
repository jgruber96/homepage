/* main.js — theme toggle, clock, project cards, card glow, nav highlight and the starfield.
   Project content lives in projects.js; you shouldn't need to edit this file to change it. */
(function(){

  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k){try{return localStorage.getItem(k)}catch(e){return null}}, set(k,v){try{localStorage.setItem(k,v)}catch(e){}} };

  /* theme */
  const btn = document.getElementById('mode'), icon = document.getElementById('modeIcon');
  const MOON = 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
  const SUN = 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z';
  const dark = () => root.dataset.theme ? root.dataset.theme==='dark' : !matchMedia('(prefers-color-scheme: light)').matches;
  function paint(){ icon.setAttribute('d', dark()? MOON : SUN); btn.setAttribute('aria-label', dark()? 'Switch to light mode':'Switch to dark mode'); drawStars(); }
  const saved = store.get('ds2-mode'); if(saved) root.dataset.theme = saved;
  btn.addEventListener('click', () => { const m = dark()? 'light':'dark'; root.dataset.theme=m; store.set('ds2-mode', m); paint(); });
  matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', paint);

  /* clock + year */
  const fmt = new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/Los_Angeles'});
  const clock = document.getElementById('clock');
  function tick(){
    clock.textContent = 'Pacific Time · ' + fmt.format(new Date());
    const n=new Date(), y=n.getFullYear(), p=(n-new Date(y,0,1))/(new Date(y+1,0,1)-new Date(y,0,1))*100;
    document.getElementById('yrpct').textContent = p.toFixed(1)+'%';
    document.getElementById('yrbar').style.width = p+'%';
    document.getElementById('yrn').textContent = y; document.getElementById('yr').textContent = y;
  }
  tick(); setInterval(tick, 15000);

  /* ---------- project cards (data lives in projects.js) ---------- */
  const ICONS = {
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
    phone:    '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    camera:   '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    code:     '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    server:   '<rect x="4" y="4" width="16" height="7" rx="2"/><rect x="4" y="13" width="16" height="7" rx="2"/><path d="M8 7.5h.01M8 16.5h.01"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M12 15h5"/>',
    edit:     '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
    star:     '<path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1.1 6.1L12 17l-5.5 2.8 1.1-6.1-4.4-4.3 6.1-.8z"/>'
  };
  const SIZES = { wide:'b-wide', tall:'b-tall', small:'b-half' };
  const COLORS = { orange:'h-orange', rose:'h-rose', ice:'h-ice', green:'h-ok' };
  const svg = (inner, sw) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  function el(tag, cls, text){ const n = document.createElement(tag); if(cls) n.className = cls; if(text != null) n.textContent = text; return n; }
  function renderProjects(){
    const grid = document.getElementById('projects-grid');
    if(!grid || !Array.isArray(window.PROJECTS)) return;
    window.PROJECTS.forEach(p => {
      const a = el('a', ['card', SIZES[p.size] || 'b-half', COLORS[p.color] || 'h-orange', p.current ? '' : 'has-arrow'].join(' ').trim());
      a.href = p.current ? '#top' : (p.link || '#');
      if(/^https?:/.test(a.getAttribute('href'))){ a.target = '_blank'; a.rel = 'noopener'; }
      a.appendChild(el('span', 'shine'));
      if(!p.current){
        const ar = el('span', 'arrow'); ar.setAttribute('aria-hidden', 'true');
        ar.innerHTML = svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2); a.appendChild(ar);
      }
      const top = el('div', 'p-top');
      const ic = el('span', 'icon'); ic.innerHTML = svg(ICONS[p.icon] || ICONS.star, 1.8); top.appendChild(ic);
      if(p.current) top.appendChild(el('span', 'badge here', '● You are here'));
      else if(p.badge){
        // each "·"-separated part stays on one line, so long badges wrap only at the dots
        const bd = el('span', 'badge');
        String(p.badge).split(' · ').forEach((part, i) => {
          if(i) bd.appendChild(document.createTextNode(' · '));
          bd.appendChild(el('span', 'seg', part));
        });
        top.appendChild(bd);
      }
      a.appendChild(top);
      a.appendChild(el('h3', null, p.title || 'Untitled project'));
      if(p.description) a.appendChild(el('p', null, p.description));
      if(p.extra === 'calendar'){
        const m = el('div', 'mini'); m.setAttribute('aria-hidden', 'true');
        ['','c1','','c2','','c3','','c4','','c1 today','','c2','c3',''].forEach(c => m.appendChild(el('i', c || null)));
        a.appendChild(m);
      } else if(p.extra === 'photos'){
        const f = el('div', 'film'); f.setAttribute('aria-hidden', 'true');
        for(let i = 0; i < 3; i++) f.appendChild(el('i')); a.appendChild(f);
      }
      if(Array.isArray(p.tags) && p.tags.length){
        const t = el('div', 'tags'); p.tags.forEach(x => t.appendChild(el('span', null, x))); a.appendChild(t);
      }
      grid.appendChild(a);
    });
  }
  renderProjects();

  /* spotlight + gentle tilt on cards */
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', x+'px'); card.style.setProperty('--my', y+'px');
      if(fine && !reduce){
        const rx = ((y / r.height) - .5) * -4, ry = ((x / r.width) - .5) * 5;
        card.style.transform = `translateY(-8px) scale(1.012) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  /* active nav link */
  const links = [...document.querySelectorAll('.links a')];
  const secs = links.map(a => document.querySelector(a.getAttribute('href')));
  function onScroll(){ let k=-1; secs.forEach((s,i)=>{ if(s.getBoundingClientRect().top < innerHeight*.45) k=i; }); links.forEach((a,i)=>a.classList.toggle('on', i===k)); }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* starfield */
  const cv = document.getElementById('stars'), ctx = cv.getContext('2d');
  let stars = [], raf;
  function size(){
    const d = Math.min(devicePixelRatio||1, 2);
    cv.width = innerWidth*d; cv.height = innerHeight*d; ctx.setTransform(d,0,0,d,0,0);
    const n = Math.round(innerWidth*innerHeight/5200);
    stars = Array.from({length:n}, () => ({x:Math.random()*innerWidth, y:Math.random()*innerHeight, r:Math.random()*1.2+.2, t:Math.random()*6.28, s:Math.random()*.02+.004}));
  }
  function drawStars(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    const base = dark()? '255,255,255' : '40,40,90', k = dark()? 1 : .35;
    for(const s of stars){
      const a = (.35 + .45*Math.sin(s.t)) * k;
      ctx.fillStyle = `rgba(${base},${a})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.283); ctx.fill();
    }
  }
  function loop(){ for(const s of stars) s.t += s.s; drawStars(); raf = requestAnimationFrame(loop); }
  size(); paint();
  if(!reduce) loop();
  addEventListener('resize', () => { size(); drawStars(); });
  document.addEventListener('visibilitychange', () => { if(document.hidden) cancelAnimationFrame(raf); else if(!reduce) loop(); });

  // shared with astronaut.js and blackhole.js
  window.DS = { root, reduce, dark };
})();
