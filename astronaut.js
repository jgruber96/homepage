/* astronaut.js — the floating astronaut, his tether, speech bubbles,
   and getting pulled into the black hole.

   EDIT HIS LINES HERE. Each line is text in "double quotes" followed by a comma.
   Add or remove lines freely; keep them short so the bubble stays small. */
const SPEECH = {
  // Things he says at random while drifting around
  random: [
      "Mission control? Hello?",
      "My tether! It was right here...",
      "Who unplugged the data cable?",
      "On the bright side, great views.",
      "Is it warm behind that black hole?",
      "Tried turning the rocket off and on.",
      "Have you seen the chore calendar?",
      "Houston, the homepage is up.",
      "Anyone got a spare link?",
      "Just orbiting. Don't mind me.",
      "Hey! That tickles.",
      "No tracking up here. Just me."
  ],
  // Said once when the black hole starts pulling him in
  falling: [
      "Uh oh. Is that thing pulling me?",
      "Mission control, I'm drifting in!",
      "It's getting really warm over here.",
      "Tell my tether I loved it!",
      "Spaghettification is NOT in my contract!",
      "Is this the event horizon? Asking for a friend."
  ],
  // Said when someone clicks him to rescue him mid-fall
  rescued: [
    "Phew! Thanks for the save!",
    "That was way too close.",
    "Remind me to stay away from that thing."
  ]
};

/* How often he gets pulled in (seconds). The first pull happens sooner so visitors see it. */
const FIRST_PULL = [14, 22];      // [earliest, latest] seconds after the page loads
const NEXT_PULL  = [24, 44];      // [earliest, latest] seconds between pulls after that

(function(){
  if(!window.DS) return;
  const { root, reduce } = window.DS;

  /* ---------- drifting astronaut ---------- */
  const astro = document.getElementById('astro'), tc = document.getElementById('tether'), tx = tc.getContext('2d');
  const eclipse = document.querySelector('.eclipse');
  let AW = innerWidth, AH = innerHeight, scale = 1;
  let tetherCol = '#ff8a4c', nightCol = '#0b0d17';
  function readColors(){
    const cs = getComputedStyle(root);
    tetherCol = cs.getPropertyValue('--corona').trim() || tetherCol;
    nightCol = cs.getPropertyValue('--night').trim() || nightCol;
  }
  new MutationObserver(readColors).observe(root, {attributes:true, attributeFilter:['data-theme']});
  matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', readColors);
  readColors();

  function sizeTether(){
    const d = Math.min(devicePixelRatio||1, 2);
    AW = innerWidth; AH = innerHeight; scale = AW <= 640 ? .76 : 1;
    tc.width = AW*d; tc.height = AH*d; tx.setTransform(d,0,0,d,0,0);
  }
  sizeTether();

  // start just off the left edge so he drifts in
  let pos = {x:-80, y:AH*.42}, vel = {x:26, y:-4}, target = {x:AW*.5, y:AH*.4};
  let ang = -18, angVel = 5, retarget = 0, spin = 0, boost = 0;
  // 'drift' | 'fall' (spiralling into the black hole) | 'gone' (waiting to respawn)
  let mode = 'drift', sc = 1, fallT = FIRST_PULL[0] + Math.random()*(FIRST_PULL[1]-FIRST_PULL[0]), goneT = 0;
  const fall = {d:0, d0:0, th:0, dir:1};
  function eclipseRect(){ const r = eclipse.getBoundingClientRect(); return (r.bottom > 0 && r.top < AH && r.width) ? r : null; }
  function pickTarget(){
    const e = eclipseRect();
    if(e && Math.random() < .5){
      // aim through the eclipse so he passes behind it
      target = {x: e.left + e.width*(.2 + Math.random()*.6), y: e.top + e.height*(.2 + Math.random()*.6)};
    } else {
      const m = 70; target = {x: m + Math.random()*Math.max(1, AW-2*m), y: m + Math.random()*Math.max(1, AH-2*m)};
    }
    retarget = 7 + Math.random()*6;
  }
  pickTarget(); target = (()=>{ const e = eclipseRect(); return e ? {x:e.left+e.width*.5, y:e.top+e.height*.5} : target; })();

  const N = 18, rope = []; let L = 11;
  function anchor(){
    const a = ang*Math.PI/180, ox = -33*scale*sc, oy = 2*scale*sc;
    return {x: pos.x + ox*Math.cos(a) - oy*Math.sin(a), y: pos.y + ox*Math.sin(a) + oy*Math.cos(a)};
  }
  (function initRope(){ const an = anchor(); for(let i=0;i<N;i++) rope.push({x:an.x-i*L, y:an.y+i*2, px:an.x-i*L, py:an.y+i*2}); })();
  function stepRope(){
    const an = anchor();
    rope[0].x = rope[0].px = an.x; rope[0].y = rope[0].py = an.y;
    for(let i=1;i<N;i++){
      const p = rope[i], vx = (p.x-p.px)*.985, vy = (p.y-p.py)*.985;
      p.px = p.x; p.py = p.y; p.x += vx + (Math.random()-.5)*.15; p.y += vy + (Math.random()-.5)*.15;
    }
    for(let k=0;k<6;k++) for(let j=0;j<N-1;j++){
      const a = rope[j], b = rope[j+1], dx = b.x-a.x, dy = b.y-a.y, d = Math.hypot(dx,dy) || .001, diff = (d-L)/d;
      if(j === 0){ b.x -= dx*diff; b.y -= dy*diff; }
      else { a.x += dx*diff*.5; a.y += dy*diff*.5; b.x -= dx*diff*.5; b.y -= dy*diff*.5; }
    }
  }
  function drawRope(){
    tx.clearRect(0,0,AW,AH);
    tx.lineCap = 'round'; tx.lineJoin = 'round';
    tx.globalAlpha = .7; tx.strokeStyle = tetherCol; tx.lineWidth = Math.max(.6, 2.2*sc); tx.setLineDash([Math.max(1.5, 7*sc), Math.max(1, 5*sc)]); tx.globalAlpha = .7 * (.4 + .6*sc);
    tx.beginPath(); tx.moveTo(rope[0].x, rope[0].y);
    for(let i=1;i<N-1;i++){ const mx = (rope[i].x+rope[i+1].x)/2, my = (rope[i].y+rope[i+1].y)/2; tx.quadraticCurveTo(rope[i].x, rope[i].y, mx, my); }
    tx.lineTo(rope[N-1].x, rope[N-1].y); tx.stroke(); tx.setLineDash([]); tx.globalAlpha = 1;
    const e = rope[N-1], p = rope[N-2];
    tx.save(); tx.translate(e.x, e.y); tx.rotate(Math.atan2(e.y-p.y, e.x-p.x)); tx.scale(sc, sc);
    tx.fillStyle = tetherCol; tx.fillRect(-2,-5,10,10);
    tx.fillStyle = nightCol; tx.fillRect(4,-3,3,2); tx.fillRect(4,1,3,2);
    tx.restore();
  }
  function placeAstro(){
    const hw = 46*scale, hh = 55*scale;
    astro.style.transform = `translate(${pos.x-hw}px, ${pos.y-hh}px) rotate(${ang}deg) scale(${sc})`;
    astro.style.opacity = mode === 'gone' ? 0 : (.35 + .65*sc);
    placeBubble();
  }
  function holeCenter(){ const e = eclipseRect(); return e ? {x: e.left + e.width/2, y: e.top + e.height/2, R: e.width/2} : null; }
  function resetRope(){ const an = anchor(); rope.forEach((p,i) => { p.x = p.px = an.x - i*L*.6; p.y = p.py = an.y + i; }); }
  function startFall(){
    const c = holeCenter(); if(!c || !onScreen()){ fallT = 4; return; }
    const dx = pos.x - c.x, dy = pos.y - c.y;
    fall.d = fall.d0 = Math.max(Math.hypot(dx, dy), c.R*1.6);
    fall.th = Math.atan2(dy, dx); fall.dir = Math.random() < .5 ? -1 : 1;
    mode = 'fall'; say(pick(fallLines));
  }
  function respawn(){
    // a fresh astronaut drifts in from a random edge
    const side = Math.floor(Math.random()*4), m = 90;
    pos = side === 0 ? {x:-m, y:AH*(.2+Math.random()*.6)} : side === 1 ? {x:AW+m, y:AH*(.2+Math.random()*.6)}
        : side === 2 ? {x:AW*(.15+Math.random()*.7), y:-m} : {x:AW*(.15+Math.random()*.7), y:AH+m};
    vel = {x:(AW/2-pos.x)*.08, y:(AH/2-pos.y)*.08};
    const mm = 70; target = {x: mm + Math.random()*Math.max(1, AW-2*mm), y: mm + Math.random()*Math.max(1, AH-2*mm)}; retarget = 9;
    sc = 1; spin = 0; mode = 'drift'; fallT = NEXT_PULL[0] + Math.random()*(NEXT_PULL[1]-NEXT_PULL[0]);
    L = 11; resetRope();
  }
  function stepAstro(dt){
    if(mode === 'gone'){
      goneT -= dt; bubbleTick(dt);
      if(goneT <= 0) respawn(); else { tx.clearRect(0,0,AW,AH); placeAstro(); return; }
    }
    if(mode === 'fall'){
      const c = holeCenter();
      if(!c){ mode = 'drift'; }
      else {
        // spiral in: the pull and the orbit both speed up as he gets closer
        const rel = fall.d / c.R;
        const vin = Math.min(320, 9 + 120 / Math.pow(Math.max(rel, 1), 1.5)) * scale;
        fall.d -= vin*dt;
        const w = Math.min(5.5, .45 * Math.pow(fall.d0 / Math.max(fall.d, 1), 1.1));
        fall.th += fall.dir * w * dt;
        const nx = c.x + fall.d*Math.cos(fall.th), ny = c.y + fall.d*Math.sin(fall.th);
        if(dt > 0){ vel.x = (nx - pos.x)/dt; vel.y = (ny - pos.y)/dt; }
        pos.x = nx; pos.y = ny;
        // shrink with distance (he's falling away from us, down the gravity well)
        const span = Math.min(fall.d0, c.R*4.5) - c.R*.85;
        sc = Math.max(.04, Math.min(1, Math.pow((fall.d - c.R*.85) / Math.max(span, 1), .85)));
        spin += fall.dir * 90 * (1 - sc) * dt;
        if(fall.d < c.R*.86){ mode = 'gone'; goneT = 3.5 + Math.random()*2.5; sc = .04; tx.clearRect(0,0,AW,AH); placeAstro(); return; }
      }
    }
    if(mode === 'drift'){
      retarget -= dt;
      const dx = target.x-pos.x, dy = target.y-pos.y;
      if(retarget <= 0 || Math.hypot(dx,dy) < 40) pickTarget();
      // gentle steering + space-like damping, capped to a slow drift
      vel.x += dx*.035*dt; vel.y += dy*.035*dt;
      const damp = Math.pow(.6, dt); vel.x *= damp; vel.y *= damp;
      boost *= Math.pow(.35, dt);
      const sp = Math.hypot(vel.x, vel.y), max = (42 + boost)*scale;
      if(sp > max){ vel.x *= max/sp; vel.y *= max/sp; }
      pos.x += vel.x*dt; pos.y += vel.y*dt;
      sc += (1 - sc) * Math.min(1, dt*.9);          // regrow after a rescue
      fallT -= dt; if(fallT <= 0) startFall();
    }
    L = 11 * Math.max(sc, .15);
    angVel += (Math.random()-.5)*4*dt; angVel = Math.max(-12, Math.min(12, angVel));
    spin *= Math.pow(mode === 'fall' ? .8 : .45, dt);
    ang += (angVel + spin)*dt;
    bubbleTick(dt);
    stepRope(); drawRope(); placeAstro();
  }
  function stillAstro(){
    const e = eclipseRect();
    pos = e ? {x: e.left + e.width*.12, y: e.top + e.height*.82} : {x: AW*.8, y: AH*.3};
    ang = -14;
    for(let s=0;s<120;s++) stepRope();
    drawRope(); placeAstro();
  }
  /* speech bubbles + poking */
  const bubble = document.getElementById('bubble');
  const lines = SPEECH.random;
  const fallLines = SPEECH.falling;
  const saveLines = SPEECH.rescued;
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  let bubbleTimer = 3, bubbleHide = 0, lastLine = -1;
  function onScreen(){ return pos.x > 20 && pos.x < AW-20 && pos.y > 20 && pos.y < AH-20; }
  function say(text){
    if(text){ bubble.textContent = text; }
    else {
      let i; do { i = Math.floor(Math.random()*lines.length); } while(i === lastLine && lines.length > 1);
      lastLine = i; bubble.textContent = lines[i];
    }
    bubble.classList.add('show'); bubbleHide = 3; bubbleTimer = 8 + Math.random()*6;
    placeBubble();
  }
  function bubbleTick(dt){
    if(bubbleHide > 0){ bubbleHide -= dt; if(bubbleHide <= 0) bubble.classList.remove('show'); }
    bubbleTimer -= dt;
    if(bubbleTimer <= 0){ if(mode === 'drift' && onScreen()) say(); else bubbleTimer = 2; }
  }
  function placeBubble(){
    if(!bubble) return;
    const bw = bubble.offsetWidth || 200, bh = bubble.offsetHeight || 40;
    const bx = Math.max(8, Math.min(AW - bw - 8, pos.x + 28*scale*sc));
    const by = Math.max(70, Math.min(AH - bh - 8, pos.y - 70*scale*sc - bh));
    bubble.style.transform = `translate(${bx}px, ${by}px)`;
  }
  function poke(){
    if(mode === 'fall'){
      // yank him free: fling outward, away from the hole
      const c = holeCenter();
      mode = 'drift'; fallT = NEXT_PULL[0] + Math.random()*(NEXT_PULL[1]-NEXT_PULL[0]); say(pick(saveLines));
      if(c){ const ox = pos.x - c.x, oy = pos.y - c.y, d = Math.hypot(ox, oy) || 1; vel.x = ox/d*170; vel.y = oy/d*170; }
      boost = 170; spin += (Math.random() < .5 ? -1 : 1) * 200;
      const mm = 70; target = {x: mm + Math.random()*Math.max(1, AW-2*mm), y: mm + Math.random()*Math.max(1, AH-2*mm)}; retarget = 8;
      return;
    }
    say();
    if(reduce){ setTimeout(() => bubble.classList.remove('show'), 3000); return; }
    spin += (Math.random() < .5 ? -1 : 1) * (160 + Math.random()*120);
    boost = 110;
    vel.x += (Math.random()-.5)*160; vel.y += (Math.random()-.5)*160;
  }
  // He sits behind the page, so clicks land on the content above him.
  // Hit-test his position instead, skipping anything interactive or the eclipse disc in front of him.
  function overAstro(x, y, el){
    if(el && el.closest && el.closest('a, button, input, .card, .nav-in, .bubble')) return false;
    if(mode === 'gone' || Math.hypot(x - pos.x, y - pos.y) > Math.max(22, 50*scale*sc)) return false;
    const r = eclipseRect();
    if(r && Math.hypot(x - (r.left + r.width/2), y - (r.top + r.height/2)) < r.width/2) return false;
    return true;
  }
  document.addEventListener('click', e => { if(overAstro(e.clientX, e.clientY, e.target)) poke(); });
  document.addEventListener('pointermove', e => {
    document.body.classList.toggle('astro-hover', e.pointerType === 'mouse' && overAstro(e.clientX, e.clientY, e.target));
  }, {passive:true});
  astro.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); poke(); } });

  let aRaf, last = 0;
  function aLoop(t){
    const dt = last ? Math.min((t-last)/1000, .05) : 0; last = t;
    stepAstro(dt); aRaf = requestAnimationFrame(aLoop);
  }
  if(reduce) stillAstro(); else aRaf = requestAnimationFrame(aLoop);
  addEventListener('resize', () => { sizeTether(); if(reduce) stillAstro(); });
  document.addEventListener('visibilitychange', () => {
    if(reduce) return;
    if(document.hidden){ cancelAnimationFrame(aRaf); }
    else { last = 0; aRaf = requestAnimationFrame(aLoop); }
  });
})();
