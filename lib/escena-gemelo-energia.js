/**
 * Gemelo digital de la landing de generación de energía (2026-10-01).
 * Emiliano pidió cambiar el video con mucho texto por un gemelo digital
 * donde se vea el programa que arma DIAPSA en una central, con muy poco
 * texto. Reutiliza la central de ciclo combinado de escena-idap-gemelo.js
 * y la recorre en cuatro pasos, en un bucle de 22 s:
 *   1. Criticidad: cada equipo se pinta A (rojo), B (ámbar) o C (azul).
 *   2. Técnicas recomendadas: iconos sobre cada equipo (vibración,
 *      termografía, ultrasonido, aceite).
 *   3. Rutas y sensores: una ruta de inspección recorre los equipos B y C
 *      y los equipos A quedan con sensores que laten.
 *   4. Indicadores de confiabilidad: disponibilidad, MTBF, MTTR y
 *      condiciones críticas mejorando; la central pasa a verde.
 * Recibe THREE (r128), el contenedor y opciones ({ fuente,
 * reducirMovimiento }) y devuelve la limpieza. Fondo transparente: el azul
 * lo pone la sección. Cifras de ejemplo, sin clientes.
 */
/* eslint-disable */
var CSS = [
  '.ge-raiz{position:relative;width:100%;height:100%;overflow:hidden;color:#e8f1ff;-webkit-font-smoothing:antialiased;touch-action:pan-y;}',
  '.ge-raiz canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}',
  '.ge-raiz canvas{-webkit-mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);}',
  '.ge-ov{position:absolute;inset:0;pointer-events:none;}',
  '.ge-abs{position:absolute;left:0;top:0;will-change:transform,opacity;opacity:0;}',
  '.ge-pasos{position:absolute;left:24px;top:22px;display:flex;gap:8px;flex-wrap:wrap;max-width:calc(100% - 48px);}',
  '.ge-paso{display:flex;align-items:center;gap:8px;padding:7px 13px 7px 8px;border-radius:999px;background:rgba(13,26,56,.72);border:1px solid rgba(92,200,255,.25);color:#8fa9cc;font-size:13px;font-weight:700;white-space:nowrap;transition:all .35s;}',
  '.ge-paso b{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:rgba(92,200,255,.18);color:#bfe9ff;font-size:12px;font-weight:800;transition:all .35s;}',
  '.ge-paso.on{background:#ffc34d;border-color:#ffc34d;color:#0d1a38;}',
  '.ge-paso.on b{background:#0d1a38;color:#ffc34d;}',
  '.ge-paso.hecho b{background:#22c55e;color:#0d1a38;}',
  '.ge-mk{width:0;height:0;}',
  '.ge-letra{position:absolute;left:-15px;top:-15px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:15px;font-weight:800;color:#0d1a38;box-shadow:0 0 0 3px rgba(13,26,56,.85),0 0 16px var(--c);background:var(--c);}',
  '.ge-tec{position:absolute;left:0;top:0;transform:translate(-50%,-50%);display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(13,26,56,.85);border:1px solid rgba(92,200,255,.45);}',
  '.ge-tec i{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#16324f;}',
  '.ge-tec svg{width:16px;height:16px;fill:none;stroke:#5cc8ff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
  '.ge-kpi{right:22px;top:50%;width:286px;box-sizing:border-box;padding:16px 18px;border-radius:14px;background:rgba(13,26,56,.9);border:1px solid rgba(92,200,255,.4);box-shadow:0 18px 40px rgba(0,0,0,.35);backdrop-filter:blur(6px);left:auto;}',
  '.ge-kpi h4{margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#bfe9ff;}',
  '.ge-fila{display:flex;align-items:baseline;justify-content:space-between;padding:9px 0;border-top:1px solid rgba(92,200,255,.14);}',
  '.ge-fila span{font-size:13px;color:#a9bfdc;}',
  '.ge-fila b{font-size:22px;font-weight:800;color:#fff;font-variant-numeric:tabular-nums;}',
  '.ge-fila small{margin-left:6px;font-size:13px;font-weight:800;color:#22c55e;}',
  '.narrow .ge-pasos{left:10px;top:10px;gap:5px;max-width:calc(100% - 20px);}',
  '.narrow .ge-paso{font-size:0;padding:4px;gap:0;}',
  '.narrow .ge-paso.on{font-size:12px;padding:4px 10px 4px 4px;gap:6px;}',
  '.narrow .ge-kpi{left:10px;right:10px;top:auto;bottom:10px;width:auto;padding:10px 14px;display:grid;grid-template-columns:1fr 1fr;column-gap:16px;}',
  '.narrow .ge-kpi h4{grid-column:1/-1;margin-bottom:4px;}',
  '.narrow .ge-fila{padding:5px 0;flex-direction:column;align-items:flex-start;gap:1px;}',
  '.narrow .ge-fila span{font-size:11.5px;}',
  '.narrow .ge-fila b{font-size:17px;}',
  '.narrow .ge-tec i{width:20px;height:20px;}',
  '.narrow .ge-tec svg{width:12px;height:12px;}',
  '.narrow .ge-letra{width:22px;height:22px;left:-11px;top:-11px;font-size:12px;}'
].join('\n');

// Iconos de las técnicas (trazos simples, sin texto)
var ICONO = {
  vib: '<svg viewBox="0 0 24 24"><path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5"/></svg>',
  termo: '<svg viewBox="0 0 24 24"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/></svg>',
  ultra: '<svg viewBox="0 0 24 24"><path d="M8 8a5.5 5.5 0 0 0 0 8M5 5a10 10 0 0 0 0 14M16 8a5.5 5.5 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/><circle cx="12" cy="12" r="1.5"/></svg>',
  aceite: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>'
};

var PASOS = ['Criticidad', 'Técnicas recomendadas', 'Rutas y sensores', 'Indicadores de confiabilidad'];

var HTML =
  '<div class="ge-ov">' +
  '<div data-r="marcas"></div>' +
  '<div class="ge-pasos" data-r="pasos">' +
  PASOS.map(function (p, i) { return '<div class="ge-paso" data-r="p' + i + '"><b>' + (i + 1) + '</b>' + p + '</div>'; }).join('') +
  '</div>' +
  '<div class="ge-abs ge-kpi" data-r="kpi">' +
  '<h4>Confiabilidad de la central</h4>' +
  '<div class="ge-fila"><span>Disponibilidad</span><div><b data-r="k1">96.1 %</b><small>▲</small></div></div>' +
  '<div class="ge-fila"><span>MTBF</span><div><b data-r="k2">410 h</b><small>▲</small></div></div>' +
  '<div class="ge-fila"><span>MTTR</span><div><b data-r="k3">9.5 h</b><small>▼</small></div></div>' +
  '<div class="ge-fila"><span>Condiciones críticas</span><div><b data-r="k4">12</b><small>▼</small></div></div>' +
  '</div>' +
  '</div>';

export function montarEscenaGemeloEnergia(THREE, container, opciones) {
  opciones = opciones || {};
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = opciones.reducirMovimiento != null ? !!opciones.reducirMovimiento : !!(mq && mq.matches);

  var estilo = document.createElement('style');
  estilo.textContent = CSS;
  var root = document.createElement('div');
  root.className = 'ge-raiz';
  if (opciones.fuente) root.style.fontFamily = opciones.fuente;
  root.innerHTML = HTML;
  container.appendChild(estilo);
  container.appendChild(root);
  function $(r) { return root.querySelector('[data-r="' + r + '"]'); }

  var LOOP = 22;
  // Tiempos de cada paso
  var T = { arma: 0.2, crit: 3.0, tec: 7.5, ruta: 12.0, kpi: 16.5, fin: 20.6 };
  var C = { b1: 0x16324f, b2: 0x22476f, b3: 0x0f243d, cyan: 0x5cc8ff, gold: 0xffc34d, green: 0x22c55e, amber: 0xf59e0b, red: 0xef4444, blue: 0x3b82f6 };
  var HEX = { A: '#ef4444', B: '#f59e0b', C: '#5cc8ff' };

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (t, a, b) { return clamp01((t - a) / (b - a)); };
  var ease = function (x) { return x * x * (3 - 2 * x); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  root.prepend(renderer.domElement);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(28, 1, 0.5, 400);
  scene.add(new THREE.HemisphereLight(0xa8dcff, 0x0d1a38, 0.8));
  var sun = new THREE.DirectionalLight(0xffffff, 0.7); sun.position.set(-6, 14, 9); scene.add(sun);
  var rim = new THREE.DirectionalLight(0x5cc8ff, 0.3); rim.position.set(10, 6, -8); scene.add(rim);

  var std = function (name, color, o) {
    return Object.assign(new THREE.MeshStandardMaterial(Object.assign({ color: color, roughness: 0.75, metalness: 0.12, flatShading: true, emissive: color, emissiveIntensity: 0.28 }, o || {})), { name: name });
  };
  var M = { body: std('azul_estructura', C.b1), light: std('azul_claro', C.b2), dark: std('azul_oscuro', C.b3), gold: std('dorado', C.gold, { roughness: 0.35, metalness: 0.55, emissiveIntensity: 0.55 }) };
  var cCol = { A: new THREE.Color(C.red), B: new THREE.Color(C.amber), C: new THREE.Color(C.blue) };
  var green = new THREE.Color(C.green);

  // Plataforma y retícula
  var platGeo = new THREE.BoxGeometry(18.4, 0.3, 12.4);
  var platform = new THREE.Mesh(platGeo, std('plataforma', C.b3, { emissiveIntensity: 0.1, roughness: 0.95 }));
  platform.position.y = -0.15; scene.add(platform);
  platform.add(new THREE.LineSegments(new THREE.EdgesGeometry(platGeo), new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.5 })));
  var gp = [];
  for (var gx = -9; gx <= 9.001; gx += 1) gp.push(gx, 0.003, -6, gx, 0.003, 6);
  for (var gz = -6; gz <= 6.001; gz += 1) gp.push(-9, 0.003, gz, 9, 0.003, gz);
  var gridGeo = new THREE.BufferGeometry(); gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gp, 3));
  scene.add(new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.1 })));

  // Piezas, cada una con su clase de criticidad
  var plant = new THREE.Group(); scene.add(plant);
  var lineBase = new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0 });
  var pieces = [];
  function part(name, geo, key, x, y, z, rot, clase, opt) {
    var mat = M[key].clone(); mat.transparent = true; mat.opacity = 0;
    if (opt && opt.double) mat.side = THREE.DoubleSide;
    var mesh = new THREE.Mesh(geo, mat); mesh.name = name; mesh.position.set(x, y, z);
    if (rot) mesh.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    var lmat = lineBase.clone();
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), lmat));
    plant.add(mesh);
    var p = { mesh: mesh, mat: mat, lmat: lmat, y: y, cx: x, clase: clase, emi0: mat.emissive.clone() }; pieces.push(p); return p;
  }
  var H = Math.PI / 2;
  var box = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
  var cyl = function (rt, rb, h, s, open) { return new THREE.CylinderGeometry(rt, rb, h, s || 16, 1, !!open); };

  function gasUnit(n, z) {
    part('tg' + n + '_patin', box(4.2, 0.35, 1.6), 'dark', -5.6, 0.175, z, null, 'A');
    part('tg' + n + '_filtro_admision', box(1.3, 2.0, 1.8), 'light', -8.2, 1.0, z, null, 'A');
    part('tg' + n + '_turbina', cyl(0.6, 0.6, 3.4, 16), 'body', -5.6, 1.0, z, [0, 0, H], 'A');
    part('tg' + n + '_difusor', cyl(0.85, 0.6, 0.8, 16), 'light', -3.5, 1.0, z, [0, 0, -H], 'A');
    part('hrsg' + n, box(3.0, 2.6, 1.7), 'body', -1.6, 1.3, z, null, 'B');
    part('hrsg' + n + '_domo', cyl(0.22, 0.22, 1.6, 16), 'light', -1.6, 2.82, z, [H, 0, 0], 'B');
    part('chimenea' + n, cyl(0.34, 0.42, 5.6, 24), 'light', 0.55, 2.8, z, null, 'C');
    part('chimenea' + n + '_anillo', new THREE.TorusGeometry(0.4, 0.07, 8, 32), 'gold', 0.55, 5.0, z, [H, 0, 0], 'C');
  }
  gasUnit(1, -3.8);
  gasUnit(2, -1.2);
  part('tuberia_vapor_alta', cyl(0.12, 0.12, 3.4, 12), 'light', 1.2, 2.2, -2.5, [H, 0, 0], 'B');
  part('tuberia_vapor_baja', cyl(0.12, 0.12, 3.4, 12), 'dark', 1.2, 0.6, -2.5, [H, 0, 0], 'B');
  part('nave_turbina_vapor', box(3.8, 2.6, 3.6), 'body', 3.3, 1.3, -2.5, null, 'A');
  var roofShape = new THREE.Shape(); roofShape.moveTo(-1.8, 0); roofShape.lineTo(1.8, 0); roofShape.lineTo(0, 0.7); roofShape.lineTo(-1.8, 0);
  var roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 3.8, bevelEnabled: false }); roofGeo.rotateY(H); roofGeo.translate(-1.9, 0, 0);
  part('nave_techo', roofGeo, 'light', 3.3, 2.601, -2.5, null, 'A');

  part('torre_enfriamiento', box(6.6, 1.5, 2.2), 'body', 4.6, 0.75, 2.9, null, 'B');
  var fans = [];
  [2.5, 4.6, 6.7].forEach(function (x, i) {
    part('torre_celda' + (i + 1) + '_campana', cyl(0.85, 0.8, 0.5, 24, true), 'light', x, 1.75, 2.9, null, 'B', { double: true });
    var bladeGeo = box(1.45, 0.05, 0.18);
    var f = part('torre_celda' + (i + 1) + '_ventilador', bladeGeo, 'dark', x, 1.62, 2.9, null, 'B');
    var b2 = new THREE.Mesh(bladeGeo, f.mat); b2.rotation.y = H;
    b2.add(new THREE.LineSegments(new THREE.EdgesGeometry(bladeGeo, 25), f.lmat));
    f.mesh.add(b2); fans.push(f);
  });

  ['A', 'B', 'C'].forEach(function (id, i) {
    var x = -5.2 + i * 1.6, z = 3.2;
    part('bomba' + id + '_base', box(1.5, 0.2, 0.7), 'dark', x, 0.1, z, null, 'A');
    part('bomba' + id + '_motor', cyl(0.3, 0.3, 0.75, 16), 'light', x - 0.28, 0.5, z, [0, 0, H], 'A');
    part('bomba' + id + '_carcasa', cyl(0.36, 0.36, 0.28, 16), 'body', x + 0.35, 0.5, z, [0, 0, H], 'A');
    part('bomba' + id + '_descarga', cyl(0.08, 0.08, 0.9, 10), 'dark', x + 0.35, 0.95, z, null, 'A');
  });
  part('cabezal_alimentacion', cyl(0.13, 0.13, 4.6, 12), 'light', -3.6, 1.4, 3.2, [0, 0, H], 'A');

  part('tanque1', cyl(0.85, 0.85, 2.4, 24), 'body', -7.4, 1.2, 1.8, null, 'C');
  part('tanque1_techo', new THREE.ConeGeometry(0.85, 0.35, 24), 'light', -7.4, 2.575, 1.8, null, 'C');
  part('tanque2', cyl(0.7, 0.7, 1.8, 24), 'body', -7.4, 0.9, 4.3, null, 'C');
  part('tanque2_techo', new THREE.ConeGeometry(0.7, 0.3, 24), 'light', -7.4, 1.95, 4.3, null, 'C');

  [-4.3, -2.9, -1.5].forEach(function (z, i) {
    part('transformador' + (i + 1), box(1.1, 1.1, 0.9), 'body', 7.1, 0.55, z, null, 'A');
    part('transformador' + (i + 1) + '_radiador', box(0.22, 0.8, 0.8), 'dark', 7.78, 0.5, z, null, 'A');
  });
  part('portico_poste1', box(0.14, 2.8, 0.14), 'light', 8.7, 1.4, -4.9, null, 'C');
  part('portico_poste2', box(0.14, 2.8, 0.14), 'light', 8.7, 1.4, -0.9, null, 'C');
  part('portico_viga', box(0.14, 0.14, 4.14), 'light', 8.7, 2.8, -2.9, null, 'C');

  // Equipos con su letra y sus técnicas recomendadas
  var EQUIPOS = [
    { pos: [-5.6, 2.1, -2.5], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
    { pos: [-1.6, 3.5, -2.5], clase: 'B', tec: ['termo', 'ultra'] },
    { pos: [3.3, 3.8, -2.5], clase: 'A', tec: ['vib', 'aceite'] },
    { pos: [7.1, 1.7, -2.9], clase: 'A', tec: ['aceite', 'termo', 'ultra'] },
    { pos: [4.6, 2.5, 2.9], clase: 'B', tec: ['vib', 'aceite'] },
    { pos: [-3.6, 1.9, 3.2], clase: 'A', tec: ['vib', 'ultra'] },
    { pos: [-7.4, 3.2, 3.0], clase: 'C', tec: ['ultra'] },
    { pos: [8.7, 3.3, -2.9], clase: 'C', tec: ['termo'] }
  ];
  var marcasEl = $('marcas');
  EQUIPOS.forEach(function (e) {
    e.v = new THREE.Vector3(e.pos[0], e.pos[1], e.pos[2]);
    var el = document.createElement('div'); el.className = 'ge-abs ge-mk';
    el.innerHTML = '<div class="ge-letra" style="--c:' + HEX[e.clase] + '">' + e.clase + '</div>' +
      '<div class="ge-tec">' + e.tec.map(function (k) { return '<i>' + ICONO[k] + '</i>'; }).join('') + '</div>';
    marcasEl.appendChild(el);
    e.el = el; e.letra = el.firstChild; e.tecEl = el.lastChild;
  });

  // Ruta de inspección por los equipos B y C, a ras de piso
  var rutaPts = [[-7.4, 5.4], [-7.4, 0.4], [-1.6, 0.2], [0.6, 1.2], [2.0, 4.6], [7.2, 4.6], [8.2, 0.6], [8.2, -5.4]]
    .map(function (p) { return new THREE.Vector3(p[0], 0.06, p[1]); });
  var rutaCurva = new THREE.CatmullRomCurve3(rutaPts, false, 'catmullrom', 0.2);
  var rutaGeo = new THREE.BufferGeometry().setFromPoints(rutaCurva.getPoints(220));
  var rutaMat = new THREE.LineDashedMaterial({ color: C.gold, dashSize: 0.35, gapSize: 0.22, transparent: true, opacity: 0 });
  var ruta = new THREE.Line(rutaGeo, rutaMat); ruta.computeLineDistances(); scene.add(ruta);
  // franja luminosa bajo la línea punteada, para que la ruta se lea de lejos
  var rutaTubo = new THREE.Mesh(new THREE.TubeGeometry(rutaCurva, 220, 0.09, 6, false), new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0, depthWrite: false }));
  scene.add(rutaTubo);
  var tuboN = rutaTubo.geometry.index.count;
  var rutaN = rutaGeo.attributes.position.count;
  var caminante = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0 }));
  scene.add(caminante);

  // Sensores en los equipos A
  var sensorPos = [[-5.6, 1.65, -3.8], [-5.6, 1.65, -1.2], [3.3, 2.75, -1.2], [-5.2, 0.85, 3.6], [-3.6, 0.85, 3.6], [-2.0, 0.85, 3.6], [7.1, 1.15, -4.3], [7.1, 1.15, -2.9], [7.1, 1.15, -1.5]];
  var sensorMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0 });
  var haloMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, depthWrite: false });
  var sensores = sensorPos.map(function (p, i) {
    var s = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), sensorMat); s.position.set(p[0], p[1], p[2]); scene.add(s);
    var h = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), haloMat.clone()); h.position.copy(s.position); scene.add(h);
    return { s: s, h: h, f: i * 0.37 };
  });

  var pasosEl = [0, 1, 2, 3].map(function (i) { return $('p' + i); });
  var kpi = $('kpi'), k1 = $('k1'), k2 = $('k2'), k3 = $('k3'), k4 = $('k4');

  var W = 1, Hh = 1, dO = 30, narrow = false;
  var FOV = 28, tanH = Math.tan(FOV * Math.PI / 360);
  var running = false, raf = 0, last = 0, inView = true, vivo = true;
  function resize() {
    W = Math.max(1, root.clientWidth); Hh = Math.max(1, root.clientHeight);
    renderer.setSize(W, Hh, false); camera.aspect = W / Hh; camera.updateProjectionMatrix();
    narrow = W < 720; root.classList.toggle('narrow', narrow);
    dO = Math.max(9 / tanH, 12.4 / (tanH * camera.aspect)) * (narrow ? 0.98 : 0.86);
    if (!running) frame(0);
  }

  var mx = 0, my = 0, sx = 0, sy = 0;
  function alMover(e) {
    var r = root.getBoundingClientRect();
    mx = clamp01((e.clientX - r.left) / r.width) * 2 - 1; my = clamp01((e.clientY - r.top) / r.height) * 2 - 1;
  }
  function alSalir() { mx = 0; my = 0; }
  root.addEventListener('pointermove', alMover);
  root.addEventListener('pointerleave', alSalir);

  var tmp = new THREE.Vector3(), tgt = new THREE.Vector3(0, 0.6, 0.8);
  function proj(v) { tmp.copy(v).project(camera); return { x: (tmp.x + 1) / 2 * W, y: (1 - tmp.y) / 2 * Hh, ok: tmp.z < 1 }; }
  function place(el, x, y, a) { el.style.opacity = a.toFixed(3); el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; }

  var elapsed = 0, pasoKey = -2;
  function frame(dt) {
    if (!vivo) return;
    elapsed += dt;
    var t = reduced ? 18.5 : elapsed % LOOP;
    var still = reduced;
    sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;

    // Cámara: órbita lenta, con el panel de indicadores la central se corre a la izquierda
    var kp = still ? 1 : ease(seg(t, T.kpi - 0.2, T.kpi + 0.8)) * (1 - ease(seg(t, T.fin, T.fin + 0.8)));
    var az = Math.PI / 4 + (still ? 0 : 0.12 * Math.sin(2 * Math.PI * t / LOOP)) + (still ? 0 : sx * 0.1);
    var el = 0.62 + (still ? 0 : -sy * 0.05);
    var off = narrow ? 0 : 0.18 * dO * tanH * camera.aspect * kp;
    var cx = Math.cos(az) * off, cz = -Math.sin(az) * off;
    var dist = dO * (narrow ? 1 + 0.12 * kp : 1);
    camera.position.set(tgt.x + cx + dist * Math.cos(el) * Math.sin(az), tgt.y + dist * Math.sin(el) - (narrow ? 1.2 * kp : 0), tgt.z + cz + dist * Math.cos(el) * Math.cos(az));
    camera.lookAt(tgt.x + cx, tgt.y - (narrow ? 1.2 * kp : 0), tgt.z + cz);

    // Fases
    var fCrit = still ? 0 : ease(seg(t, T.crit, T.crit + 0.6)) * (1 - ease(seg(t, T.tec + 0.2, T.tec + 0.9)));
    var fVerde = still ? 1 : ease(seg(t, T.kpi + 0.4, T.kpi + 1.6)) * (1 - ease(seg(t, T.fin, T.fin + 0.6)));

    var N = pieces.length;
    pieces.forEach(function (p, i) {
      var t0 = T.arma + i * 2.2 / N;
      var a = still ? 1 : ease(seg(t, t0, t0 + 0.35)), s2 = still ? 1 : ease(seg(t, t0 + 0.45, t0 + 0.95));
      var d0 = T.fin + 0.4 + (N - 1 - i) / N * 0.4;
      var ds = still ? 0 : ease(seg(t, d0, d0 + 0.3)), dl = still ? 0 : ease(seg(t, d0 + 0.2, d0 + 0.5));
      p.mesh.position.y = p.y + (1 - a) * 0.8 + dl * 0.4;
      var solid = s2 * (1 - ds);
      var line = a * (1 - dl) * (0.95 - 0.4 * solid);
      p.lmat.color.setHex(C.cyan);
      if (fCrit > 0) p.lmat.color.lerp(cCol[p.clase], fCrit);
      if (fVerde > 0) p.lmat.color.lerp(green, fVerde * 0.8);
      p.lmat.opacity = Math.min(1, line + fCrit * 0.5 * (line > 0 ? 1 : 0));
      p.mat.emissive.copy(p.emi0); p.mat.emissiveIntensity = 0.28;
      if (fCrit > 0) { p.mat.emissive.lerp(cCol[p.clase], 0.75 * fCrit); p.mat.emissiveIntensity = 0.28 + 0.35 * fCrit; }
      if (fVerde > 0) { p.mat.emissive.lerp(green, 0.45 * fVerde); p.mat.emissiveIntensity = 0.28 + 0.12 * fVerde; }
      p.mat.opacity = solid;
      p.mat.visible = solid > 0.004; p.lmat.visible = p.lmat.opacity > 0.004;
    });
    fans.forEach(function (f, i) { f.mesh.rotation.y = still ? i * 0.4 : elapsed * 0.9 + i * 0.7; });

    // Ruta y sensores
    var fRuta = still ? 1 : ease(seg(t, T.ruta, T.ruta + 0.8)) * (1 - ease(seg(t, T.fin, T.fin + 0.5)));
    var traz = still ? 1 : ease(seg(t, T.ruta, T.ruta + 2.2));
    rutaGeo.setDrawRange(0, Math.max(2, Math.floor(rutaN * traz)));
    rutaMat.opacity = 0.95 * fRuta; ruta.visible = fRuta > 0.01;
    rutaTubo.geometry.setDrawRange(0, Math.floor(tuboN * traz / 6) * 6);
    rutaTubo.material.opacity = 0.35 * fRuta; rutaTubo.visible = fRuta > 0.01;
    var u = still ? 0.6 : ((t - T.ruta) * 0.16) % 1;
    caminante.position.copy(rutaCurva.getPointAt(clamp01(u < 0 ? 0 : u)));
    caminante.position.y = 0.22;
    caminante.material.opacity = fRuta * seg(t, T.ruta + 0.6, T.ruta + 1.0) * (still ? 0 : 1);
    var fSens = still ? 1 : ease(seg(t, T.ruta + 1.2, T.ruta + 1.8)) * (1 - ease(seg(t, T.fin, T.fin + 0.5)));
    sensorMat.opacity = fSens;
    sensores.forEach(function (s) {
      var ph = still ? 0.5 : ((elapsed * 0.9 + s.f) % 1);
      s.h.scale.setScalar(1 + 2.4 * ph);
      s.h.material.opacity = fSens * 0.55 * (1 - ph);
      s.s.visible = s.h.visible = fSens > 0.01;
    });

    renderer.render(scene, camera);

    // Pasos (arriba a la izquierda)
    var paso = still ? 3 : t < T.crit - 0.2 ? -1 : t < T.tec ? 0 : t < T.ruta ? 1 : t < T.kpi ? 2 : t < T.fin + 0.4 ? 3 : -1;
    if (paso !== pasoKey) {
      pasoKey = paso;
      pasosEl.forEach(function (p, i) { p.classList.toggle('on', i === paso); p.classList.toggle('hecho', paso > i); });
    }
    var fPasos = still ? 1 : ease(seg(t, T.crit - 0.4, T.crit)) * (1 - ease(seg(t, T.fin + 0.3, T.fin + 0.8)));
    $('pasos').style.opacity = fPasos.toFixed(3);

    // Letras (criticidad) y técnicas (iconos)
    var fLetra = still ? 0 : ease(seg(t, T.crit + 0.3, T.crit + 0.8)) * (1 - ease(seg(t, T.tec - 0.2, T.tec + 0.2)));
    var fTec = still ? 0 : ease(seg(t, T.tec + 0.3, T.tec + 0.8)) * (1 - ease(seg(t, T.ruta - 0.2, T.ruta + 0.2)));
    EQUIPOS.forEach(function (e, i) {
      var q = proj(e.v);
      var d = i * 0.08;
      var a1 = still ? 0 : ease(seg(t, T.crit + 0.3 + d, T.crit + 0.8 + d)) * (fLetra > 0 ? 1 : 0) * fLetra;
      var a2 = still ? 0 : ease(seg(t, T.tec + 0.3 + d, T.tec + 0.8 + d)) * (fTec > 0 ? 1 : 0) * fTec;
      e.letra.style.opacity = a1.toFixed(3);
      e.tecEl.style.opacity = a2.toFixed(3);
      place(e.el, q.x, q.y, q.ok && (a1 > 0.001 || a2 > 0.001) ? 1 : 0);
    });

    // Indicadores
    var fK = still ? 1 : ease(seg(t, T.kpi, T.kpi + 0.6)) * (1 - ease(seg(t, T.fin, T.fin + 0.6)));
    var nk = still ? 1 : ease(seg(t, T.kpi + 0.4, T.kpi + 2.6));
    k1.textContent = lerp(96.1, 98.7, nk).toFixed(1) + ' %';
    k2.textContent = Math.round(lerp(410, 620, nk)) + ' h';
    k3.textContent = lerp(9.5, 4.2, nk).toFixed(1) + ' h';
    k4.textContent = Math.round(lerp(12, 2, nk));
    kpi.style.opacity = fK.toFixed(3);
    kpi.style.transform = narrow ? 'translateY(' + ((1 - fK) * 14).toFixed(1) + 'px)' : 'translate(' + ((1 - fK) * 18).toFixed(1) + 'px,-50%)';
  }

  function loop(now) { var dt = Math.min(0.1, (now - last) / 1000); last = now; frame(dt); raf = requestAnimationFrame(loop); }
  function sync() {
    var run = vivo && inView && !document.hidden && !reduced;
    if (run && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!run && running) { running = false; cancelAnimationFrame(raf); }
  }
  var io = new IntersectionObserver(function (es) { inView = es[0].isIntersecting; sync(); }, { threshold: 0.01 });
  io.observe(root);
  document.addEventListener('visibilitychange', sync);
  var ro = new ResizeObserver(resize);
  ro.observe(root);
  // para revisar un instante fijo desde la consola: raiz.seek(segundos)
  root.seek = function (s) { elapsed = s; frame(0); };
  resize(); frame(0); sync();
  if (document.fonts) document.fonts.ready.then(function () { if (!running && vivo) frame(0); });

  return function limpiar() {
    vivo = false;
    cancelAnimationFrame(raf); running = false;
    io.disconnect(); ro.disconnect();
    document.removeEventListener('visibilitychange', sync);
    root.removeEventListener('pointermove', alMover);
    root.removeEventListener('pointerleave', alSalir);
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
    });
    renderer.dispose();
    root.remove(); estilo.remove();
  };
}
