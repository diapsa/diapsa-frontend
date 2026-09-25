/**
 * Escena "DGA en línea": el transformador crítico, el monitor que toma
 * aceite, extrae los gases al vacío y los mide cada hora, la tendencia de
 * gases saliendo de su nivel normal, el módulo de algoritmos e IA con el
 * patrón de descarga interna, el sello del especialista y la alerta.
 *
 * Generada en Claude Diseño (docs/designs/dga-en-linea-escena.html) y
 * portada como las demás escenas: recibe THREE y el contenedor y devuelve
 * la limpieza. Compatible con r128 (ajusta luces y color por revisión).
 * Ajuste propio: en pantallas angostas los rótulos y los textos de la
 * columna derecha crecen, y la densidad de píxeles sigue a la escala.
 */
/* eslint-disable */
export function montarEscenaDga(THREE, container) {
  const W = 720, H = 540, CYCLE = 16, Y0 = 0.14;
  const REV = parseInt(THREE.REVISION, 10);
  const LK = REV >= 155 ? Math.PI : 1; // r128: intensidades sin π
  const C = { navy: '#002e46', mid: '#2b5671', grey: '#d9e2e8', orange: '#fc9f01', amber: '#e8a126' };
  const FONT = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const col = (h) => { const c = new THREE.Color(h); if (REV < 152 && c.convertSRGBToLinear) c.convertSRGBToLinear(); return c; };
  const E = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const ramp = (t, a, b) => E((t - a) / (b - a));
  const OUT_A = 15.1, OUT_B = 15.7;
  const win = (t, a, b, c = OUT_A, d = OUT_B) => ramp(t, a, b) * (1 - ramp(t, c, d));

  // ---------- DOM ----------
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  const stage = document.createElement('div');
  stage.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;overflow:hidden;background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%);font-family:${FONT};color:${C.navy};-webkit-font-smoothing:antialiased;`;
  container.appendChild(stage);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(W, H, false);
  renderer.domElement.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;`;
  if (REV >= 152) renderer.outputColorSpace = THREE.SRGBColorSpace; else renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  const overlay = document.createElement('div');
  overlay.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none;`;
  stage.appendChild(overlay);

  // ---------- Escena ----------
  const scene = new THREE.Scene();
  const halfH = H / 2 / 75, halfW = W / 2 / 75;
  const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 100);
  const r = new THREE.Vector3(1, 0, -1).normalize(), u = new THREE.Vector3(-1, 2, -1).normalize();
  const target = r.clone().multiplyScalar(1.85).add(u.clone().multiplyScalar(0.62));
  camera.position.copy(target).add(new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(30));
  camera.lookAt(target);
  camera.updateMatrixWorld();

  scene.add(new THREE.HemisphereLight(0xffffff, col(C.grey), 0.62 * LK));
  scene.add(new THREE.AmbientLight(0xffffff, 0.12 * LK));
  const sun = new THREE.DirectionalLight(0xffffff, 0.95 * LK);
  sun.position.set(-2.5, 12, 6.5);
  sun.target.position.set(1.2, 0, 0.1);
  scene.add(sun, sun.target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 0.5, far: 40 });
  sun.shadow.bias = -0.0006;

  const std = (name, hex, rough, metal, extra = {}) => { const m = new THREE.MeshStandardMaterial(Object.assign({ color: col(hex), roughness: rough, metalness: metal }, extra)); m.name = name; return m; };
  const M = {
    navy: std('azul_marino', C.navy, 0.55, 0.25),
    mid: std('azul_medio', C.mid, 0.5, 0.3),
    grey: std('gris_claro', C.grey, 0.7, 0.05),
    slab: std('losa', '#e4eaee', 0.95, 0),
    glass: std('vidrio_puerta', '#ffffff', 0.08, 0, { transparent: true, opacity: 0.2, depthWrite: false }),
    glassIn: std('vidrio', '#eef6fa', 0.1, 0, { transparent: true, opacity: 0.35, depthWrite: false }),
    shell: std('tubo', C.mid, 0.35, 0.2, { transparent: true, opacity: 0.32, depthWrite: false }),
    oil: std('aceite', C.amber, 0.25, 0, { transparent: true, opacity: 0.8, emissive: col(C.amber), emissiveIntensity: 0.2, depthWrite: false }),
    oilV: std('aceite_vaso', C.amber, 0.25, 0, { transparent: true, opacity: 0, emissive: col(C.amber), emissiveIntensity: 0.2, depthWrite: false }),
    bead: std('flujo', '#ffd27a', 0.3, 0, { transparent: true, opacity: 0, emissive: col('#ffc24d'), emissiveIntensity: 0.5 }),
    gas: std('gas', C.orange, 0.4, 0, { emissive: col(C.orange), emissiveIntensity: 0.55 }),
    led: std('led', C.orange, 0.4, 0, { emissive: col(C.orange), emissiveIntensity: 0 }),
  };
  M.tank = std('tanque', C.navy, 0.55, 0.25, { emissive: col(C.orange), emissiveIntensity: 0 });
  const beamMat = new THREE.MeshBasicMaterial({ color: col('#ffc24d'), transparent: true, opacity: 0, depthWrite: false });
  beamMat.name = 'haz';

  const shadowed = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
  function box(p, name, w, h, d, mat, x, y, z) { const m = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)); m.name = name; m.position.set(x, y, z); p.add(m); return m; }
  function cyl(p, name, rt, rb, h, mat, x, y, z, seg = 32, rotZ = 0) { const m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat)); m.name = name; m.position.set(x, y, z); m.rotation.z = rotZ; p.add(m); return m; }
  function roundedPath(pts, rad) {
    const path = new THREE.CurvePath(); let prev = pts[0].clone();
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1], p = pts[i], b = pts[i + 1];
      const rr = Math.min(rad, a.distanceTo(p) / 2, p.distanceTo(b) / 2);
      const s = p.clone().addScaledVector(p.clone().sub(a).normalize(), -rr);
      const e = p.clone().addScaledVector(b.clone().sub(p).normalize(), rr);
      path.add(new THREE.LineCurve3(prev, s)); path.add(new THREE.QuadraticBezierCurve3(s, p.clone(), e)); prev = e;
    }
    path.add(new THREE.LineCurve3(prev, pts[pts.length - 1].clone()));
    return path;
  }
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // Piso
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.name = 'sombra'; scene.add(ground);
  const slab = box(scene, 'losa', 6.0, Y0, 3.2, M.slab, 1.15, Y0 / 2, 0.2); slab.castShadow = false;

  // Transformador
  const tr = new THREE.Group(); tr.name = 'transformador'; scene.add(tr);
  const TT = Y0 + 2.28;
  box(tr, 'base', 3.2, 0.18, 1.7, M.mid, 0, Y0 + 0.09, 0);
  box(tr, 'tanque', 3.0, 2.1, 1.5, M.tank, 0, Y0 + 1.23, 0);
  box(tr, 'tapa', 3.12, 0.08, 1.62, M.mid, 0, TT + 0.04, 0);
  [-0.5, 0.5].forEach((z, i) => box(tr, 'refuerzo_' + i, 0.06, 1.9, 0.1, M.navy, 1.53, Y0 + 1.23, z));
  for (let i = 0; i < 7; i++) box(tr, 'radiador_' + i, 0.05, 1.5, 0.5, M.mid, -1.2 + i * 0.4, Y0 + 1.2, 1.08);
  [Y0 + 1.9, Y0 + 0.5].forEach((y, i) => cyl(tr, 'colector_' + i, 0.05, 0.05, 2.7, M.mid, 0, y, 0.83, 16, Math.PI / 2));
  function bushing(name, x, z, h, rS, n) {
    cyl(tr, name + '_base', rS * 1.1, rS * 1.25, 0.14, M.mid, x, TT + 0.15, z);
    cyl(tr, name + '_nucleo', rS * 0.5, rS * 0.5, h, M.grey, x, TT + 0.22 + h / 2, z);
    for (let k = 0; k < n; k++) cyl(tr, name + '_faldon_' + k, rS, rS, 0.045, M.grey, x, TT + 0.32 + k * (h - 0.2) / (n - 1), z);
    cyl(tr, name + '_tapa', rS * 0.6, rS * 0.6, 0.08, M.mid, x, TT + 0.26 + h, z);
    cyl(tr, name + '_borne', 0.022, 0.022, 0.12, M.navy, x, TT + 0.36 + h, z, 12);
  }
  [-0.9, 0, 0.9].forEach((x, i) => bushing('boquilla_at_' + i, x, 0.02, 0.95, 0.15, 6));
  [-0.9, 0, 0.9].forEach((x, i) => bushing('boquilla_bt_' + i, x, 0.55, 0.42, 0.1, 3));
  cyl(tr, 'conservador', 0.32, 0.32, 2.0, M.navy, -0.35, TT + 1.0, -0.55, 40, Math.PI / 2);
  [-1.35, 0.65].forEach((x, i) => cyl(tr, 'conservador_tapa_' + i, 0.335, 0.335, 0.05, M.mid, x, TT + 1.0, -0.55, 40, Math.PI / 2));
  [-1.05, 0.35].forEach((x, i) => box(tr, 'soporte_' + i, 0.08, 0.72, 0.08, M.mid, x, TT + 0.44, -0.55));

  // Destello interno (sutil)
  const gc = document.createElement('canvas'); gc.width = gc.height = 128;
  const gx = gc.getContext('2d'); const gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(252,159,1,1)'); gr.addColorStop(0.35, 'rgba(252,159,1,.45)'); gr.addColorStop(1, 'rgba(252,159,1,0)');
  gx.fillStyle = gr; gx.fillRect(0, 0, 128, 128);
  const gtex = new THREE.CanvasTexture(gc);
  if (REV >= 152) gtex.colorSpace = THREE.SRGBColorSpace; else gtex.encoding = THREE.sRGBEncoding;
  const glowMat = new THREE.MeshBasicMaterial({ map: gtex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  glowMat.name = 'destello';
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), glowMat);
  glow.name = 'destello'; glow.position.set(1.503, Y0 + 1.45, 0); glow.rotation.y = Math.PI / 2; tr.add(glow);

  // Monitor DGA
  const mon = new THREE.Group(); mon.name = 'monitor_dga'; mon.position.set(3.3, Y0, 0.35); scene.add(mon);
  box(mon, 'pedestal', 0.6, 0.36, 0.45, M.mid, 0, 0.18, 0);
  const cab = new THREE.Group(); cab.name = 'gabinete'; cab.position.set(0, 0.91, 0); mon.add(cab);
  box(cab, 'fondo', 0.9, 1.1, 0.03, M.grey, 0, 0, -0.26);
  [-0.435, 0.435].forEach((x, i) => box(cab, 'lateral_' + i, 0.03, 1.1, 0.55, M.grey, x, 0, 0));
  box(cab, 'piso', 0.9, 0.03, 0.55, M.grey, 0, -0.535, 0);
  box(cab, 'techo', 0.98, 0.05, 0.63, M.grey, 0, 0.575, 0.01);
  const door = box(cab, 'puerta', 0.84, 1.04, 0.01, M.glass, 0, 0, 0.272); door.castShadow = false;
  [0.53, -0.53].forEach((y, i) => box(cab, 'marco_h_' + i, 0.9, 0.04, 0.02, M.grey, 0, y, 0.276));
  [0.43, -0.43].forEach((x, i) => box(cab, 'marco_v_' + i, 0.04, 1.1, 0.02, M.grey, x, 0, 0.276));
  box(cab, 'manija', 0.03, 0.16, 0.03, M.mid, 0.36, 0, 0.3);
  cyl(cab, 'vaso', 0.13, 0.13, 0.46, M.glassIn, -0.2, -0.18, 0).castShadow = false;
  cyl(cab, 'aceite_vaso', 0.11, 0.11, 0.42, M.oilV, -0.2, -0.18, 0).castShadow = false;
  [0.05, -0.41].forEach((y, i) => cyl(cab, 'vaso_tapa_' + i, 0.14, 0.14, 0.04, M.navy, -0.2, y, 0));
  cyl(cab, 'vaso_soporte', 0.05, 0.08, 0.1, M.mid, -0.2, -0.47, 0);
  box(cab, 'camara', 0.38, 0.12, 0.14, M.glassIn, 0.1, 0.3, 0).castShadow = false;
  [-0.11, 0.31].forEach((x, i) => box(cab, 'camara_extremo_' + i, 0.05, 0.15, 0.17, M.navy, x, 0.3, 0));
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.37, 16), beamMat);
  beam.name = 'haz'; beam.rotation.z = Math.PI / 2; beam.position.set(0.1, 0.3, 0); cab.add(beam);
  const linkPath = roundedPath([V(-0.2, 0.07, 0), V(-0.2, 0.3, 0), V(-0.13, 0.3, 0)], 0.05);
  const link = new THREE.Mesh(new THREE.TubeGeometry(linkPath, 24, 0.018, 12, false), M.glassIn); link.name = 'conducto_gas'; cab.add(link);
  box(cab, 'tarjeta', 0.3, 0.26, 0.02, M.navy, 0.15, -0.22, -0.235);
  [[0.06, -0.17], [0.16, -0.27], [0.24, -0.17]].forEach(([x, y], i) => box(cab, 'componente_' + i, 0.06, 0.05, 0.03, M.mid, x, y, -0.215));
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 12), M.led); led.name = 'led'; led.position.set(0.25, -0.3, -0.215); cab.add(led);

  // Burbujas (extracción al vacío)
  const bub = [], NB = 12;
  const bGeo = new THREE.SphereGeometry(0.022, 16, 12);
  for (let i = 0; i < NB; i++) {
    const m = new THREE.Mesh(bGeo, M.gas); m.name = 'burbuja_' + i; cab.add(m);
    const jx = ((i * 7919) % 13) / 13 - 0.5;
    const pts = [V(-0.2 + jx * 0.12, -0.36, jx * 0.06), V(-0.2 + jx * 0.04, 0.03, 0), V(-0.2, 0.3, 0), V(-0.11, 0.3, 0), V(0.28, 0.3, 0)];
    const lens = [0]; for (let k = 1; k < pts.length; k++) lens.push(lens[k - 1] + pts[k].distanceTo(pts[k - 1]));
    bub.push({ m, pts, lens, total: lens[lens.length - 1], ph: i / NB });
  }
  const bp = new THREE.Vector3();
  function bubblePos(b, uu) {
    const d = uu * b.total; let k = 1; while (k < b.lens.length - 1 && b.lens[k] < d) k++;
    const f = (d - b.lens[k - 1]) / (b.lens[k] - b.lens[k - 1]);
    return bp.copy(b.pts[k - 1]).lerp(b.pts[k], f);
  }

  // Tuberías: ida y regreso
  function pipe(name, pts) {
    const path = roundedPath(pts, 0.14);
    const seg = 160, rs = 16;
    const s = new THREE.Mesh(new THREE.TubeGeometry(path, seg, 0.055, rs, false), M.shell); s.name = name + '_tubo'; scene.add(s);
    const oilGeo = new THREE.TubeGeometry(path, seg, 0.034, 12, false);
    const o = new THREE.Mesh(oilGeo, M.oil); o.name = name + '_aceite'; o.renderOrder = 1; scene.add(o);
    oilGeo.setDrawRange(0, 0);
    const beads = [];
    for (let i = 0; i < 7; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), M.bead); b.name = name + '_flujo_' + i; b.renderOrder = 2; scene.add(b); beads.push(b); }
    return { path, oilGeo, count: oilGeo.index.count, beads, len: path.getLength() };
  }
  const ida = pipe('ida', [V(1.5, Y0 + 0.5, 0.35), V(1.9, Y0 + 0.5, 0.35), V(1.9, Y0 + 0.12, 0.35), V(2.6, Y0 + 0.12, 0.35), V(2.6, Y0 + 0.62, 0.35), V(2.99, Y0 + 0.62, 0.35)]);
  const reg = pipe('regreso', [V(2.99, Y0 + 0.86, 0.35), V(2.45, Y0 + 0.86, 0.35), V(2.45, Y0 + 0.86, -0.2), V(1.5, Y0 + 0.86, -0.2)]);
  [[Y0 + 0.5, 0.35], [Y0 + 0.86, -0.2]].forEach(([y, z], i) => box(tr, 'valvula_' + i, 0.12, 0.15, 0.15, M.mid, 1.56, y, z));

  // ---------- Capa HTML ----------
  const proj = (x, y, z) => { const v = V(x, y, z).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; };
  function tag(text, kind, dir, [x, y], icon = '') {
    const w = document.createElement('div');
    w.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;opacity:0;`;
    const lineCss = { up: 'left:-0.5px;top:-17px;width:1px;height:13px;', down: 'left:-0.5px;top:4px;width:1px;height:13px;', right: 'left:4px;top:-0.5px;width:13px;height:1px;' }[dir];
    const labCss = { up: 'left:0;top:-17px;transform:translate(-50%,-100%);', down: 'left:0;top:17px;transform:translate(-50%,0);', right: 'left:17px;top:0;transform:translate(0,-50%);' }[dir];
    const skin = kind === 'crit'
      ? `background:${C.navy};color:#fff;border:1px solid ${C.navy};`
      : `background:rgba(255,255,255,.95);color:${C.navy};border:1px solid ${C.grey};box-shadow:0 4px 12px rgba(0,46,70,.08);`;
    const dotC = kind === 'crit' ? C.navy : C.mid;
    w.innerHTML = `<div style="position:absolute;left:-3.5px;top:-3.5px;width:7px;height:7px;border-radius:50%;background:${dotC};box-shadow:0 0 0 3px rgba(255,255,255,.9)"></div>
      <div style="position:absolute;${lineCss}background:${dotC};opacity:.6"></div>
      <div style="position:absolute;${labCss}white-space:nowrap;display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.01em;${skin}">${kind === 'crit' ? `<span style="width:7px;height:7px;border-radius:50%;background:${C.orange}"></span>` : ''}${icon}${text}</div>`;
    overlay.appendChild(w); return w;
  }
  const clock = `<svg width="12" height="12" viewBox="0 0 12 12" style="display:block"><circle cx="6" cy="6" r="5" fill="none" stroke="${C.mid}" stroke-width="1.3"/><path d="M6 3.2V6l2 1.3" fill="none" stroke="${C.mid}" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  const aCab = proj(3.3, Y0 + 1.5, 0.35);
  const T = {
    crit: tag('Equipo crítico', 'crit', 'down', proj(-0.2, Y0 + 0.06, 1.34)),
    mon: tag('Monitor en línea', '', 'up', aCab),
    toma: tag('Toma aceite', '', 'down', proj(2.25, Y0 + 0.12, 0.35)),
    mide: tag('Mide cada hora', '', 'right', proj(3.75, Y0 + 1.05, 0.35), clock),
  };

  const panel = document.createElement('div');
  panel.style.cssText = `position:absolute;left:418px;top:22px;width:284px;height:186px;box-sizing:border-box;background:rgba(255,255,255,.95);border:1px solid ${C.grey};border-radius:10px;box-shadow:0 10px 28px rgba(0,46,70,.08);opacity:0;`;
  const sw = (css) => `<span style="display:block;width:12px;${css}"></span>`;
  panel.innerHTML = `
    <div style="position:absolute;left:12px;right:12px;top:10px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;font-weight:700;color:${C.navy}">Tendencia de gases</span>
      <span style="display:flex;gap:9px;align-items:center;font-size:11px;color:${C.mid}">
        <span style="display:flex;gap:4px;align-items:center">${sw(`height:2.5px;background:${C.orange}`)}H₂</span>
        <span style="display:flex;gap:4px;align-items:center">${sw(`height:0;border-top:2px dashed ${C.orange}`)}C₂H₂</span>
        <span style="display:flex;gap:4px;align-items:center">${sw(`height:1.5px;background:${C.mid};opacity:.55`)}Otros</span>
      </span>
    </div>
    <svg style="position:absolute;left:12px;top:36px;overflow:visible" width="260" height="120" viewBox="0 0 260 120">
      <defs>
        <clipPath id="dga-rev"><rect x="0" y="-10" width="0" height="140"/></clipPath>
        <clipPath id="dga-hi"><rect x="0" y="-10" width="270" height="68"/></clipPath>
      </defs>
      <rect x="0" y="58" width="252" height="46" rx="3" fill="${C.grey}" opacity=".7"/>
      <text x="7" y="98" font-size="11" fill="${C.mid}" font-family="${FONT}">Nivel normal</text>
      <line x1="0" y1="110.5" x2="252" y2="110.5" stroke="${C.grey}" stroke-width="1"/>
      <g clip-path="url(#dga-rev)" fill="none" stroke-linecap="round">
        <path d="M0 88 C 40 85, 70 90, 110 86 S 190 84, 252 87" stroke="${C.mid}" stroke-width="1.4" opacity=".5"/>
        <path d="M0 72 C 50 70, 90 75, 140 71 S 210 73, 252 70" stroke="${C.mid}" stroke-width="1.4" opacity=".5"/>
        <path d="M0 98 C 50 97, 100 99, 150 96 S 220 97, 252 95" stroke="${C.mid}" stroke-width="1.4" opacity=".5"/>
        <path d="M140 110 C 175 108, 215 88, 252 44" stroke="${C.mid}" stroke-width="1.8" stroke-dasharray="4 3"/>
        <path d="M0 80 C 40 79, 90 81, 140 78 C 185 74, 215 55, 252 12" stroke="${C.navy}" stroke-width="2"/>
        <g clip-path="url(#dga-hi)">
          <path d="M140 110 C 175 108, 215 88, 252 44" stroke="${C.orange}" stroke-width="2" stroke-dasharray="4 3"/>
          <path d="M0 80 C 40 79, 90 81, 140 78 C 185 74, 215 55, 252 12" stroke="${C.orange}" stroke-width="2.6"/>
        </g>
      </g>
      <circle id="dga-dot" cx="252" cy="12" r="4" fill="${C.orange}" stroke="#fff" stroke-width="1.5" opacity="0"/>
    </svg>
    <div style="position:absolute;left:12px;top:160px;font-size:11px;color:${C.mid}">Últimas 8 semanas</div>`;
  overlay.appendChild(panel);
  const revRect = panel.querySelector('#dga-rev rect'), hDot = panel.querySelector('#dga-dot');

  const ppm = document.createElement('div');
  ppm.style.cssText = `position:absolute;right:52px;top:50px;padding:3px 9px;border-radius:999px;background:${C.orange};color:${C.navy};font-size:11px;font-weight:700;white-space:nowrap;opacity:0;box-shadow:0 4px 10px rgba(252,159,1,.25);`;
  ppm.textContent = '+40 ppm por día';
  overlay.appendChild(ppm);

  const links = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  links.setAttribute('width', W); links.setAttribute('height', H);
  links.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;';
  const [cx0, cy0] = aCab;
  links.innerHTML = `
    <path id="dga-data" d="M${cx0} ${cy0 - 6} C ${cx0 + 10} ${cy0 - 70}, 448 262, 448 209" fill="none" stroke="${C.mid}" stroke-width="1.3" stroke-dasharray="3 4" opacity="0"/>
    <circle id="dga-ddot" r="3" fill="${C.mid}" opacity="0"/>
    <path id="dga-ai" d="M682 76 L682 221" pathLength="1" fill="none" stroke="${C.orange}" stroke-width="1.6" stroke-dasharray="1 1" stroke-dashoffset="1"/>
    <circle id="dga-adot" r="3" fill="${C.orange}" opacity="0"/>`;
  overlay.appendChild(links);
  const dataPath = links.querySelector('#dga-data'), dDot = links.querySelector('#dga-ddot');
  const aiPath = links.querySelector('#dga-ai'), aDot = links.querySelector('#dga-adot');
  const dataLen = dataPath.getTotalLength();

  const chip = document.createElement('div');
  chip.style.cssText = 'position:absolute;left:660px;top:222px;width:44px;height:44px;opacity:0;';
  const pins = [15, 22, 29].map(p => `<line x1="1" y1="${p}" x2="7" y2="${p}"/><line x1="37" y1="${p}" x2="43" y2="${p}"/><line x1="${p}" y1="1" x2="${p}" y2="7"/><line x1="${p}" y1="37" x2="${p}" y2="43"/>`).join('');
  chip.innerHTML = `<div data-halo style="position:absolute;left:4px;top:4px;width:36px;height:36px;border-radius:9px;box-shadow:0 0 0 0 rgba(252,159,1,.35)"></div>
    <svg width="44" height="44" viewBox="0 0 44 44" style="position:absolute;left:0;top:0">
      <g stroke="${C.mid}" stroke-width="2" stroke-linecap="round">${pins}</g>
      <rect x="7" y="7" width="30" height="30" rx="6" fill="${C.orange}"/>
      <g stroke="${C.navy}" stroke-width="1.6"><line x1="15" y1="16" x2="29" y2="16"/><line x1="15" y1="16" x2="22" y2="29"/><line x1="29" y1="16" x2="22" y2="29"/></g>
      <g fill="${C.navy}"><circle cx="15" cy="16" r="2.8"/><circle cx="29" cy="16" r="2.8"/><circle cx="22" cy="29" r="2.8"/></g>
    </svg>`;
  overlay.appendChild(chip);
  const halo = chip.querySelector('[data-halo]');
  const aiTxt = document.createElement('div');
  aiTxt.style.cssText = `position:absolute;right:70px;top:226px;font-size:13px;font-weight:700;color:${C.navy};white-space:nowrap;opacity:0;`;
  aiTxt.textContent = 'Algoritmos e IA';
  overlay.appendChild(aiTxt);
  const patt = document.createElement('div');
  patt.style.cssText = `position:absolute;right:70px;top:246px;padding:3px 9px;border-radius:999px;background:#fff3dc;border:1px solid ${C.orange};color:${C.navy};font-size:11px;font-weight:600;white-space:nowrap;opacity:0;`;
  patt.textContent = 'Patrón: descarga interna';
  overlay.appendChild(patt);
  const stamp = document.createElement('div');
  stamp.style.cssText = `position:absolute;right:70px;top:278px;display:flex;align-items:center;gap:6px;padding:5px 10px;border:2px solid ${C.orange};border-radius:8px;background:#fff;color:${C.navy};font-size:12px;font-weight:700;white-space:nowrap;transform:rotate(-3deg);opacity:0;`;
  stamp.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6.2" fill="${C.orange}"/><path d="M4 7.2l2 2 4-4.2" fill="none" stroke="${C.navy}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>Revisado por especialista`;
  overlay.appendChild(stamp);

  const phone = document.createElement('div');
  phone.style.cssText = `position:absolute;right:22px;top:318px;width:140px;height:208px;box-sizing:border-box;padding:6px;border-radius:22px;background:${C.navy};box-shadow:0 16px 32px rgba(0,46,70,.2);opacity:0;`;
  phone.innerHTML = `<div style="position:relative;width:100%;height:100%;border-radius:17px;background:linear-gradient(180deg,#fbfcfd,#eef1f4);overflow:hidden">
    <div style="position:absolute;left:50%;top:6px;width:34px;height:5px;border-radius:3px;background:${C.navy};transform:translateX(-50%)"></div>
    <div data-notif style="position:absolute;left:6px;right:6px;top:22px;box-sizing:border-box;padding:8px 9px;background:#fff;border:1px solid ${C.grey};border-radius:11px;box-shadow:0 6px 14px rgba(0,46,70,.1);opacity:0">
      <div style="display:flex;gap:5px;align-items:center;font-size:11px;color:${C.mid}"><span style="width:10px;height:10px;border-radius:3px;background:${C.navy}"></span>DGA en línea</div>
      <div style="display:flex;margin-top:7px"><span style="background:${C.orange};color:${C.navy};font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px">Crítico</span></div>
      <div style="margin-top:6px;font-size:12px;font-weight:700;line-height:1.25;color:${C.navy}">Transformador principal</div>
      <div style="margin-top:3px;font-size:11px;line-height:1.3;color:${C.navy}">Acetileno en aumento</div>
    </div></div>`;
  overlay.appendChild(phone);
  const notif = phone.querySelector('[data-notif]');

  const show = (el, v, dy = 6) => { el.style.opacity = v.toFixed(3); el.style.translate = `0 ${(dy * (1 - v)).toFixed(2)}px`; };

  // ---------- Animación ----------
  function update(t) {
    const calm = 1 - ramp(t, OUT_A, OUT_B);
    show(T.crit, win(t, 0.3, 0.9));
    show(T.mon, ramp(t, 0.9, 1.5) * (1 - ramp(t, 2.5, 2.9)));
    show(T.toma, win(t, 2.9, 3.4));
    show(T.mide, win(t, 4.3, 4.8));

    // Aceite
    const fI = ramp(t, 2.6, 3.6), fR = ramp(t, 4.4, 5.2);
    M.oil.opacity = 0.8 * calm; M.oilV.opacity = 0.75 * ramp(t, 3.3, 3.8) * calm;
    [[ida, fI], [reg, fR]].forEach(([p, f]) => {
      const step = 12 * 6; p.oilGeo.setDrawRange(0, Math.floor(p.count * f / step) * step);
      p.beads.forEach((b, i) => {
        const uu = ((t * 0.32) + i / p.beads.length) % 1;
        b.position.copy(p.path.getPointAt(uu));
        b.visible = uu < f - 0.02 && calm > 0.01;
      });
    });
    M.bead.opacity = 0.9 * ramp(t, 3.6, 4.0) * calm;

    // Burbujas y haz
    const bOn = ramp(t, 3.6, 4.1) * calm;
    bub.forEach((b) => {
      const uu = (t * 0.42 + b.ph) % 1;
      b.m.position.copy(bubblePos(b, uu));
      const edge = uu < 0.06 ? uu / 0.06 : uu > 0.9 ? (1 - uu) / 0.1 : 1;
      const s = Math.max(0.0001, bOn * edge * (0.8 + 0.3 * Math.sin(b.ph * 20)));
      b.m.scale.setScalar(s); b.m.visible = s > 0.01;
    });
    beamMat.opacity = (0.35 + 0.3 * (0.5 + 0.5 * Math.sin(t * 5))) * ramp(t, 4.0, 4.5) * calm;
    M.led.emissiveIntensity = ramp(t, 4.0, 4.5) * calm * (Math.sin(t * Math.PI) > 0.6 ? 0.9 : 0.1);

    // Enlace de datos y panel
    const dl = win(t, 5.3, 5.8);
    dataPath.setAttribute('opacity', (0.7 * dl).toFixed(3));
    const dp = dataPath.getPointAtLength(((t * 0.55) % 1) * dataLen);
    dDot.setAttribute('cx', dp.x); dDot.setAttribute('cy', dp.y); dDot.setAttribute('opacity', dl.toFixed(3));
    show(panel, win(t, 5.8, 6.4), 8);
    revRect.setAttribute('width', (140 * ramp(t, 6.2, 7.4) + 125 * ramp(t, 7.4, 8.8)).toFixed(1));
    const dotOn = win(t, 8.6, 8.9);
    hDot.setAttribute('opacity', dotOn.toFixed(3));
    hDot.setAttribute('r', (4 + 1.2 * Math.max(0, Math.sin(t * 5))).toFixed(2));
    show(ppm, win(t, 8.7, 9.2), 4);

    // Destello interno
    const flick = 0.4 + 0.6 * Math.pow(Math.max(0, Math.sin(t * 17) * Math.sin(t * 5.3 + 1)), 1.4);
    const fl = ramp(t, 7.6, 8.2) * (1 - ramp(t, 12.4, 13.4)) * flick;
    glowMat.opacity = 0.55 * fl; M.tank.emissiveIntensity = 0.07 * fl;

    // Algoritmos e IA
    show(chip, win(t, 9.5, 10.0), 6); show(aiTxt, win(t, 9.6, 10.1), 6);
    const ai = ramp(t, 9.9, 10.6);
    aiPath.setAttribute('stroke-dashoffset', (1 - ai).toFixed(3));
    aiPath.setAttribute('opacity', calm.toFixed(3));
    const ay = 76 + 145 * ((t * 0.6) % 1);
    aDot.setAttribute('cx', 682); aDot.setAttribute('cy', ay.toFixed(1));
    aDot.setAttribute('opacity', (ramp(t, 10.6, 10.9) * calm).toFixed(3));
    const pOn = win(t, 10.7, 11.2);
    show(patt, pOn, 5);
    halo.style.boxShadow = `0 0 0 ${(pOn * (4 + 3 * (0.5 + 0.5 * Math.sin(t * 4)))).toFixed(1)}px rgba(252,159,1,.22)`;
    const st = win(t, 11.4, 11.8);
    stamp.style.opacity = st.toFixed(3); stamp.style.scale = ((1.25 - 0.25 * st) * Math.min(kR, 1.2)).toFixed(3);

    // Teléfono
    const ph = win(t, 12.4, 13.0);
    phone.style.opacity = Math.min(1, ph * 1.5).toFixed(3);
    // En teléfono el sello quedaría bajo el teléfono: se desvanece al entrar.
    if (kR > 1) stamp.style.opacity = (st * (1 - Math.min(1, ph * 1.5))).toFixed(3);
    phone.style.translate = `0 ${(40 * (1 - ph)).toFixed(1)}px`;
    const bz = t > 13.4 && t < 13.9 ? Math.sin((t - 13.4) * 60) * 2.2 * (1 - (t - 13.4) / 0.5) : 0;
    phone.style.rotate = `${bz.toFixed(2)}deg`;
    show(notif, win(t, 13.1, 13.5), -10);
  }

  // ---------- Escalado y bucle ----------
  let scale = 1, raf = 0, t0 = performance.now(), kR = 1;
  function fit() {
    const cw = container.clientWidth, ch = container.clientHeight;
    if (!cw || !ch) { requestAnimationFrame(fit); return; }
    scale = Math.min(cw / W, ch / H);
    stage.style.transform = `translate(${(cw - W * scale) / 2}px,${(ch - H * scale) / 2}px) scale(${scale})`;
    renderer.setPixelRatio(Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * scale)));
    // En teléfono la escena se reduce a menos de la mitad: los rótulos y los
    // textos de la columna derecha crecen hacia adentro para seguir legibles.
    kR = scale < 0.75 ? Math.min(2, 0.8 / scale) : 1;
    const kT = Math.min(kR, 1.6), kC = Math.min(kR, 1.2);
    Object.values(T).forEach((w) => { w.style.scale = kT; });
    [chip, aiTxt, patt, ppm].forEach((e) => { e.style.transformOrigin = '100% 0'; e.style.scale = kC; });
    phone.style.transformOrigin = '100% 100%'; phone.style.scale = Math.min(kR, 1.15);
    stamp.style.transformOrigin = '100% 0';
    renderer.setSize(W, H, false);
    if (reduce.matches) renderStill();
  }
  function renderStill() { update(11.95); renderer.render(scene, camera); }
  function frame(now) {
    update(((now - t0) / 1000) % CYCLE);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function start() { cancelAnimationFrame(raf); if (reduce.matches) renderStill(); else { t0 = performance.now(); raf = requestAnimationFrame(frame); } }
  const ro = new ResizeObserver(fit); ro.observe(container);
  window.addEventListener('resize', fit);
  document.addEventListener('visibilitychange', fit);
  const onMotion = () => start();
  reduce.addEventListener ? reduce.addEventListener('change', onMotion) : reduce.addListener(onMotion);
  fit(); start();

  function cleanup() {
    cancelAnimationFrame(raf); ro.disconnect();
    window.removeEventListener('resize', fit); document.removeEventListener('visibilitychange', fit);
    reduce.removeEventListener ? reduce.removeEventListener('change', onMotion) : reduce.removeListener(onMotion);
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    Object.values(M).concat([beamMat, glowMat, ground.material]).forEach((m) => m.dispose());
    gtex.dispose(); renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    stage.remove();
  }
  cleanup.seek = (t) => { cancelAnimationFrame(raf); update(t); renderer.render(scene, camera); };
  return cleanup;
}
