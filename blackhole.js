/* blackhole.js — the ray-traced black hole in the hero.
   Each pixel traces light through curved spacetime (Schwarzschild metric).
   Easy tweaks inside the shader: el (camera height above the disk), rin/rout (disk size),
   and the 1.35 in the tone-map line (overall brightness). */
(function(){
  if(!window.DS) return;
  const { root, reduce, dark } = window.DS;

  /* ---------- black hole (WebGL) ---------- */
  (function blackHole(){
    const wrap = document.querySelector('.eclipse-wrap'), cv = document.getElementById('bh');
    const gl = cv.getContext('webgl', {premultipliedAlpha:true, alpha:true, antialias:false});
    if(!gl) return; // CSS fallback stays visible
    const vs = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }';
    const fs = `
precision highp float;
uniform vec2 uRes; uniform float uS, uTime, uLight;
const float TAU = 6.2831853;
// Units: Schwarzschild radius = 1. Photon sphere at 1.5, ISCO (inner disk edge) at 3.
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float pnoise(vec2 p, float per){
  vec2 i = floor(p), f = fract(p), u = f*f*(3.-2.*f);
  float a = hash(vec2(mod(i.x, per), i.y)),    b = hash(vec2(mod(i.x+1., per), i.y));
  float c = hash(vec2(mod(i.x, per), i.y+1.)), d = hash(vec2(mod(i.x+1., per), i.y+1.));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p, float per, float detail){
  float s = 0., a = .5;
  for(int i = 0; i < 3; i++){ s += a*pnoise(p, per) * (i == 0 ? 1. : detail); p *= 2.; per *= 2.; a *= .5; }
  return s + (1. - detail) * .18;
}
// gas streaks in the disk; Keplerian differential rotation with a crossfade so shear never winds up
float gas(float ang, float r, float t, float detail){
  float w = .55 * pow(r, -1.5);                 // turns per second, faster inside
  float T = 10., ph = fract(t / T);
  float a1 = fract(ang + t*.02 + ph*T*w);
  float a2 = fract(ang + .37 + t*.02 + fract(ph + .5)*T*w);
  float n1 = fbm(vec2(a1*24., r*2.6), 24., detail);
  float n2 = fbm(vec2(a2*24., r*2.6), 24., detail);
  return mix(n1, n2, abs(1. - 2.*ph));
}
vec3 blackbody(float t){            // t: 0 cool .. 1 hot
  return mix(mix(vec3(.55,.12,.03), vec3(1.,.48,.14), smoothstep(0.,.45,t)), vec3(1.,.95,.86), smoothstep(.45,1.,t));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - uRes*.5) / uS;
  float roll = -.09; uv = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * uv;

  // camera a little above the disk plane, looking at the hole
  float el = .085, D = 20.;
  vec3 cam = vec3(0., D*sin(el), -D*cos(el));
  vec3 fw = normalize(-cam), rt = normalize(cross(vec3(0.,1.,0.), fw)), up = cross(fw, rt);
  vec3 dir = normalize(fw + (uv.x*rt + uv.y*up) * .65);

  vec3 pos = cam;
  float h2 = dot(cross(pos, dir), cross(pos, dir));   // conserved angular momentum squared
  vec3 col = vec3(0.); float alpha = 0.;
  bool hole = false;
  float b = sqrt(h2), bc = 2.5981;          // impact parameter vs. the critical value
  float nearCrit = smoothstep(bc + .03, bc + .45, b);   // 0 for light that skims the photon sphere
  float planeHits = 0.;                                 // times this ray has crossed the disk plane
  float rin = 3., rout = 11.;

  for(int i = 0; i < 220; i++){
    float r2 = dot(pos, pos), r = sqrt(r2);
    if(r < 1.){ hole = true; break; }
    if(r > 26. && dot(pos, dir) > 0.) break;
    float dt = clamp(.06*r, .025, 1.1);
    vec3 acc = -1.5 * h2 * pos / (r2*r2*r);      // Schwarzschild bending
    vec3 nd = dir + acc*dt;
    vec3 np = pos + nd*dt;

    // crossed the disk plane?
    if(pos.y * np.y < 0.){
      float soften = planeHits < .5 ? 1. : nearCrit;   // first crossing is always a direct view
      planeHits += 1.;
      vec3 q = mix(pos, np, pos.y / (pos.y - np.y));
      float rr = length(q.xz);
      if(rr > rin*.92 && rr < rout){
        float ang = atan(q.z, q.x) / TAU;
        float detail = soften * smoothstep(rin*.95, rin*1.6, rr);
        float g = gas(ang, rr, uTime, detail);
        // temperature profile + soft edges
        float prof = smoothstep(rin*.92, rin*1.12, rr) * (1. - smoothstep(rout*.55, rout, rr));
        float temp = pow(rin / rr, .9);
        // relativistic Doppler beaming + gravitational redshift
        float v = sqrt(.5 / rr);
        vec3 vel = v * normalize(vec3(-q.z, 0., q.x));
        float dop = 1. / (1. + dot(vel, normalize(nd)));
        float beam = pow(dop, 3.2) * sqrt(max(1. - 1./rr, 0.));
        float dens = prof * (.3 + mix(.55, 1.2, detail)*g*g);
        vec3 c = blackbody(clamp(temp * (.55 + .5*dop) , 0., 1.)) * temp * temp * beam * dens * 4.2;
        // 3rd+ images skim the photon sphere and are sub-pixel thin: tone them down so they don't sparkle
        float far = soften;     // skimming images are sub-pixel; the smooth photon ring below stands in for them
        c *= far;
        float da = clamp(dens * 1.4 * far, 0., .97);
        col += (1. - alpha) * c;
        alpha += (1. - alpha) * da;
        if(alpha > .985) break;
      }
    }
    // faint glowing haze hugging the disk
    float haze = exp(-abs(np.y)*2.2) * smoothstep(rout, rin, length(np.xz)) * smoothstep(1.4, 3., length(np));
    col += (1. - alpha) * vec3(1., .45, .15) * haze * dt * .018;
    pos = np; dir = nd;
  }
  // Exact capture test: light falls in when its impact parameter b < 3*sqrt(3)/2.
  // Using it directly gives a smooth, anti-aliased rim instead of per-pixel guesses.
  float pw = D * .65 / uS;                       // one pixel, in impact-parameter units
  float cap = 1. - smoothstep(bc - pw, bc + pw, b);
  float ring = exp(-pow((b - bc - pw*.6) / (pw*1.3 + .01), 2.));
  float ringSide = 1. + .45 * (-uv.x / max(length(uv), .001));   // brighter on the approaching side
  col += (1. - alpha) * vec3(1., .86, .62) * ring * .55 * ringSide;
  alpha += (1. - alpha) * cap;

  col = 1. - exp(-col * 1.35);
  float a = clamp(max(alpha, max(max(col.r, col.g), col.b)), 0., 1.);
  // light mode: a dark window behind it so the glow reads on a pale page
  float portal = uLight * .96 * (1. - smoothstep(.2, .54, length(uv * vec2(.6, 1.))));
  vec3 night = vec3(.043, .051, .09);
  gl_FragColor = vec4(col + night * portal * (1. - a), a + portal * (1. - a));
}`;
    function sh(type, src){ const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){ console.warn(gl.getShaderInfoLog(s)); return null; } return s; }
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if(!v || !f) return;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(pr, 'uRes'), uS = gl.getUniformLocation(pr, 'uS'),
          uTime = gl.getUniformLocation(pr, 'uTime'), uLight = gl.getUniformLocation(pr, 'uLight');
    let S = 1, q = 1;
    function resize(){
      const d = Math.min(devicePixelRatio || 1, 1.5) * q;
      cv.width = Math.max(1, Math.round(cv.clientWidth * d));
      cv.height = Math.max(1, Math.round(cv.clientHeight * d));
      S = wrap.clientWidth * d;
      gl.viewport(0, 0, cv.width, cv.height);
    }
    function frame(t){
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uS, S);
      gl.uniform1f(uTime, t); gl.uniform1f(uLight, dark() ? 0 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    resize(); wrap.classList.add('gl');
    new ResizeObserver(() => { resize(); if(reduce) frame(20); }).observe(wrap);
    if(reduce){ frame(20); new MutationObserver(() => frame(20)).observe(root, {attributes:true, attributeFilter:['data-theme']}); return; }
    let visible = true, bRaf = 0, t0 = performance.now() - 20000;
    let lastNow = 0, slow = 0, n = 0;
    function loop(now){
      if(lastNow){
        const ms = now - lastNow;
        if(++n > 20){ slow = ms > 26 ? slow + 1 : Math.max(0, slow - 1); }
        if(slow > 40 && q > .7){ q = Math.max(.7, q - .15); slow = 0; resize(); }   // drop resolution if struggling
      }
      lastNow = now;
      frame((now - t0) / 1000); bRaf = requestAnimationFrame(loop);
    }
    function setRun(on){ cancelAnimationFrame(bRaf); lastNow = 0; if(on) bRaf = requestAnimationFrame(loop); }
    new IntersectionObserver(es => { visible = es[0].isIntersecting; setRun(visible && !document.hidden); }).observe(wrap);
    document.addEventListener('visibilitychange', () => setRun(visible && !document.hidden));
    setRun(true);
  })();
})();
