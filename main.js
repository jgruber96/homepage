/* ~/home — behaviour. Settings live in config.js. */
(function () {
  "use strict";

  const SITE = Object.assign({
    handle: "guest", links: {}, about: "", linesOfCode: 0,
    random: ["42"], randomEveryMs: 3500, defaultTheme: "amber",
  }, window.SITE || {});

  const $ = s => document.querySelector(s);
  const root = document.documentElement;
  const pad = n => String(n).padStart(2, "0");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- canvas (declared early so theme functions can use it) ---------- */
  const cv = $("#rain"), cx = cv.getContext("2d");
  const FS = 16, GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}[];=$#";
  let cols = 0, drops = [], rainBoost = false, rainColor = "#ffb454", rainFade = "rgba(27,23,19,.12)";

  /* ---------- colour theme (amber / green / cyan) ---------- */
  const THEMES = ["amber", "green", "cyan"];
  function readColours() {
    const cs = getComputedStyle(root);
    rainColor = cs.getPropertyValue("--rain").trim() || rainColor;
    rainFade = cs.getPropertyValue("--rain-fade").trim() || rainFade;
    return cs;
  }
  function setTheme(t, save = true) {
    if (!THEMES.includes(t)) t = "amber";
    if (t === "amber") delete root.dataset.theme; else root.dataset.theme = t;
    if (save) store.set("theme", t);
    readColours();
  }

  /* ---------- light / dark ---------- */
  const getMode = () => (root.dataset.mode === "light" ? "light" : "dark");
  function setMode(m, save = true) {
    if (m === "light") root.dataset.mode = "light"; else delete root.dataset.mode;
    if (save) store.set("mode", m);
    const cs = readColours();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = m === "light" ? "#f7f2e8" : "#1b1713";
    cx.fillStyle = cs.getPropertyValue("--bg").trim(); // wipe old rain trails
    cx.fillRect(0, 0, cv.width, cv.height);
  }
  $("#mode").addEventListener("click", () => setMode(getMode() === "light" ? "dark" : "light"));
  // follow live system changes until the visitor picks a mode themselves
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", e => {
    if (!store.get("mode")) setMode(e.matches ? "light" : "dark", false);
  });

  /* ---------- boot sequence, once per visit ---------- */
  (function boot() {
    const el = $("#boot");
    if (!el) return;
    let seen = null; try { seen = sessionStorage.getItem("boot"); } catch (e) {}
    if (seen || reduce) { el.remove(); return; }
    const L = [
      `[    0.000000] booting ${esc(SITE.handle)}.home ...`,
      "[    0.012040] mounting ~/projects  <span class=ok>[ OK ]</span>",
      "[    0.031337] starting shell.service  <span class=ok>[ OK ]</span>",
      "[    0.048000] starting rain.daemon  <span class=ok>[ OK ]</span>",
      "", "welcome, guest.",
    ];
    let i = 0;
    const t = setInterval(() => {
      el.innerHTML += L[i++] + "\n";
      if (i >= L.length) {
        clearInterval(t);
        setTimeout(() => { el.classList.add("gone"); setTimeout(() => el.remove(), 450); }, 250);
      }
    }, 90);
    try { sessionStorage.setItem("boot", "1"); } catch (e) {}
  })();

  /* ---------- clock + year progress ---------- */
  function tick() {
    const d = new Date();
    $("#clock").textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    const s = new Date(d.getFullYear(), 0, 1);
    const yp = (d - s) / (new Date(d.getFullYear() + 1, 0, 1) - s) * 100;
    $("#yearp").textContent = yp.toFixed(2) + "%";
    $("#ym").style.setProperty("--w", yp + "%");
  }
  tick(); setInterval(tick, 1000);
  try {
    $("#tz").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop().replace(/_/g, " ").toLowerCase();
  } catch (e) {}
  $("#yr").textContent = new Date().getFullYear();

  /* ---------- stats: lines of code + something random ---------- */
  (function loc() {
    const el = $("#loc"), m = $("#locm"), target = Number(SITE.linesOfCode) || 0;
    const t0 = performance.now(), dur = reduce ? 0 : 1800;
    const f = t => {
      const p = dur ? Math.min(1, (t - t0) / dur) : 1, e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString();
      m.style.setProperty("--w", (e * 92) + "%");
      if (p < 1) return requestAnimationFrame(f);
      let n = target;
      setInterval(() => { n += Math.random() < 0.5 ? 1 : Math.ceil(Math.random() * 12); el.textContent = n.toLocaleString(); }, 4000);
    };
    requestAnimationFrame(f);
  })();
  (function rnd() {
    const list = SITE.random && SITE.random.length ? SITE.random : ["42"];
    const el = $("#rnd"), m = $("#rndm");
    let last = -1;
    const roll = () => {
      let i; do { i = Math.random() * list.length | 0; } while (i === last && list.length > 1);
      last = i;
      el.textContent = list[i];
      m.style.setProperty("--w", (8 + Math.random() * 90) + "%");
    };
    roll(); setInterval(roll, SITE.randomEveryMs || 3500);
  })();

  /* ---------- visitor shell ---------- */
  const out = $("#out"), cmd = $("#cmd");
  const hist = []; let hi = 0;
  const H = esc(SITE.handle), L = SITE.links || {};
  const print = h => { out.insertAdjacentHTML("beforeend", h + "\n"); out.scrollTop = out.scrollHeight; };
  const ext = (u, t) => u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${t}</a>` : t;
  const handleOf = u => { try { return "@" + new URL(u).pathname.split("/").filter(Boolean).pop(); } catch (e) { return u; } };

  const C = {
    help: () => `<span class=fg>available commands</span>
  <span class=ok>about</span>      who is this
  <span class=ok>projects</span>   things I've built
  <span class=ok>contact</span>    where to find me
  <span class=ok>neofetch</span>   system info
  <span class=ok>theme</span>      light | dark | amber | green | cyan
  <span class=ok>ls</span>, <span class=ok>cat</span>, <span class=ok>whoami</span>, <span class=ok>date</span>, <span class=ok>clear</span>`,
    about: () => esc(SITE.about),
    projects: () => `<span class=hl>chore-calendar/</span>  chore calendar, web + ios app  → ${ext(L.choreCalendar, "github")}
<span class=hl>photos/</span>          favourite shots                → ${ext(L.flickr, "flickr")}
<span class=hl>homepage/</span>        this site                      → you're in it`,
    contact: () => Object.entries({ github: L.github, flickr: L.flickr, email: L.email })
      .filter(([, u]) => u)
      .map(([k, u]) => `${k.padEnd(7)} ${ext(u, esc(k === "email" ? u.replace(/^mailto:/, "") : handleOf(u)))}`).join("\n"),
    ls: () => `<span class=hl>about.md  projects/  photos/  contact.txt</span>  <span class=er>.secrets</span>`,
    cat: a => a[0] === ".secrets" ? `<span class=er>cat: .secrets: Permission denied</span>`
      : a[0] === "about.md" ? C.about() : `cat: ${esc(a[0] || "")}: no such file (try 'ls')`,
    whoami: () => "guest. but you're welcome here.",
    neofetch: () => `<span class=ok>   ___   </span>  <span class=ok>guest</span>@<span class=ok>${H}</span>
<span class=ok>  |&gt;_ |  </span>  ----------------
<span class=ok>  |___|  </span>  <span class=fg>os</span>      ${esc(navigator.platform || "web")}
<span class=ok>         </span>  <span class=fg>shell</span>   jsh 1.0
<span class=ok>         </span>  <span class=fg>uptime</span>  ${Math.round(performance.now() / 1000)}s on this page
<span class=ok>         </span>  <span class=fg>theme</span>   ${root.dataset.theme || "amber"} / ${getMode()}
<span class=ok>         </span>  <span class=fg>deps</span>    0`,
    theme: a => {
      if (a[0] === "light" || a[0] === "dark") { setMode(a[0]); return `<span class=ok>mode → ${a[0]}</span>`; }
      if (!THEMES.includes(a[0])) return "usage: theme light|dark|amber|green|cyan";
      setTheme(a[0]); return `<span class=ok>theme → ${a[0]}</span>`;
    },
    light: () => C.theme(["light"]),
    dark: () => C.theme(["dark"]),
    matrix: () => {
      rainBoost = !rainBoost; cv.classList.toggle("boost", rainBoost);
      return rainBoost ? "<span class=ok>wake up, guest…</span>" : "back to reality";
    },
    date: () => new Date().toString(),
    echo: a => esc(a.join(" ")),
    sudo: () => `<span class=er>guest is not in the sudoers file. This incident will be reported.</span>`,
    rm: () => `<span class=er>nice try.</span>`,
    exit: () => "there is no exit. only scroll.",
    clear: () => { out.innerHTML = ""; return null; },
  };

  function run(s) {
    s = s.trim(); if (!s) return;
    hist.push(s); hi = hist.length;
    print(`<span class=ok>$</span> <span class=fg>${esc(s)}</span>`);
    const [h, ...a] = s.split(/\s+/);
    const f = Object.prototype.hasOwnProperty.call(C, h.toLowerCase()) ? C[h.toLowerCase()] : null;
    const r = f ? f(a) : `<span class=er>command not found: ${esc(h)}</span> (try 'help')`;
    if (r != null) print(r);
  }
  cmd.addEventListener("keydown", e => {
    if (e.key === "Enter") { run(cmd.value); cmd.value = ""; }
    else if (e.key === "ArrowUp" && hi > 0) { cmd.value = hist[--hi]; e.preventDefault(); }
    else if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); cmd.value = hist[hi] || ""; }
    else if (e.key === "Tab") {
      const v = cmd.value.trim(); if (!v) return;
      e.preventDefault();
      const m = Object.keys(C).filter(k => k.startsWith(v));
      if (m.length === 1) cmd.value = m[0] + " "; else if (m.length) print(m.join("  "));
    }
  });
  document.querySelectorAll(".chips button").forEach(b =>
    b.addEventListener("click", () => { run(b.textContent); cmd.focus({ preventScroll: true }); }));
  document.addEventListener("keydown", e => {
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); cmd.focus(); }
  });

  /* ---------- katakana / hex rain ---------- */
  function size() {
    cv.width = innerWidth; cv.height = innerHeight;
    cols = Math.ceil(cv.width / FS);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  }
  function rain() {
    cx.fillStyle = rainFade; cx.fillRect(0, 0, cv.width, cv.height);
    cx.font = FS + "px monospace";
    const flash = getMode() === "light" ? "#2a2118" : "#fff4e0";
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * FS;
      cx.fillStyle = Math.random() < 0.04 ? flash : rainColor;
      cx.fillText(GLYPHS[Math.random() * GLYPHS.length | 0], i * FS, y);
      if (y > cv.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += rainBoost ? 1 : 0.45;
    }
  }
  size(); addEventListener("resize", size);

  /* ---------- start ---------- */
  setTheme(store.get("theme") || SITE.defaultTheme, false);
  setMode(getMode(), false);
  if (!reduce) setInterval(rain, 50);
})();
