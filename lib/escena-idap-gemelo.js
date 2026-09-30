/**
 * Escena del inicio de /servicios/idap: "con IDAP tienes un gemelo digital
 * de tu planta, conoces el estado de todos tus equipos y sabes en qué
 * enfocar a tu equipo de mantenimiento para alargar su vida útil".
 *
 * Una central de ciclo combinado se arma en líneas cian y se vuelve
 * sólida; una onda dorada la recorre y enciende el semáforo de cada
 * equipo; la cámara se acerca a la bomba en alarma, aparece su tarjeta y
 * las prioridades de mantenimiento; la tarea se atiende, la bomba pasa a
 * verde y su vida útil se alarga. Bucle de 16 s.
 *
 * Generada en Claude Diseño por Emiliano (2026-09-29,
 * docs/designs/idap-hero-gemelo.html) y portada como las demás: recibe
 * THREE (r128), el contenedor y opciones ({ fuente, reducirMovimiento })
 * y devuelve la limpieza. Fondo transparente: el azul lo pone la sección.
 * Nombres genéricos, sin clientes.
 */
/* eslint-disable */
var CSS = [
  '.ih-raiz{position:relative;width:100%;height:100%;overflow:hidden;color:#e8f1ff;-webkit-font-smoothing:antialiased;touch-action:pan-y;}',
  '.ih-raiz canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}',
  // bordes del lienzo difuminados: al acercarse la cámara la planta no se corta en seco
  '.ih-raiz canvas{-webkit-mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent),linear-gradient(to bottom,transparent,#000 7%,#000 90%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent),linear-gradient(to bottom,transparent,#000 7%,#000 90%,transparent);mask-composite:intersect;}',
  '.ih-ov{position:absolute;inset:0;pointer-events:none;}',
  '.ih-abs{position:absolute;left:0;top:0;will-change:transform,opacity;opacity:0;}',
  '.ih-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}',
  '.ih-marker{width:0;height:0;}',
  '.ih-dot{position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:var(--c);box-shadow:0 0 0 3px rgba(13,26,56,.85),0 0 14px var(--c);transition:background .35s,box-shadow .35s;}',
  '.ih-pulse .ih-dot::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:2px solid var(--c);animation:ihp 1.1s ease-out infinite;}',
  '@keyframes ihp{from{transform:scale(.6);opacity:.95}to{transform:scale(2);opacity:0}}',
  '.ih-tag{display:flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;background:rgba(13,26,56,.72);border:1px solid rgba(92,200,255,.55);color:#bfe9ff;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;}',
  '.ih-tag i{width:6px;height:6px;border-radius:50%;background:#5cc8ff;box-shadow:0 0 8px #5cc8ff;}',
  '.ih-counter{left:28px;top:24px;display:flex;align-items:baseline;gap:8px;padding:10px 14px;border-radius:10px;background:rgba(13,26,56,.72);border:1px solid rgba(92,200,255,.3);font-size:15px;font-weight:500;color:#b9cbe4;white-space:nowrap;}',
  '.ih-counter b{color:#fff;font-weight:800;font-size:18px;font-variant-numeric:tabular-nums;}',
  '.ih-counter .g{color:#22c55e;}',
  '.ih-card{width:316px;box-sizing:border-box;padding:14px 16px 16px;border-radius:12px;background:rgba(13,26,56,.9);border:1px solid rgba(92,200,255,.4);box-shadow:0 18px 40px rgba(0,0,0,.35);backdrop-filter:blur(6px);display:flex;flex-direction:column;gap:8px;}',
  '.ih-card-h{display:flex;align-items:center;justify-content:space-between;gap:10px;}',
  '.ih-card-h strong{font-size:15px;font-weight:700;color:#fff;line-height:1.25;}',
  '.ih-pill{flex:none;font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:999px;color:#0d1a38;background:#ef4444;transition:background .35s;}',
  '.ih-diag{font-size:14px;font-weight:600;color:#e8f1ff;}',
  '.ih-act{font-size:13px;line-height:1.4;color:#a9bfdc;}',
  '.ih-life{display:flex;flex-direction:column;gap:6px;margin-top:4px;}',
  '.ih-life span{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8fa9cc;}',
  '.ih-bar{position:relative;height:8px;border-radius:4px;background:rgba(92,200,255,.14);overflow:visible;}',
  '.ih-fill{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:#ef4444;transition:background .4s;}',
  '.ih-flash{position:absolute;top:-10px;bottom:-10px;width:70px;margin-left:-35px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,195,77,.95),rgba(255,195,77,.35) 50%,rgba(255,195,77,0));opacity:0;}',
  '.ih-panel{right:24px;top:50%;width:300px;box-sizing:border-box;padding:16px;border-radius:12px;background:rgba(13,26,56,.9);border:1px solid rgba(92,200,255,.4);box-shadow:0 18px 40px rgba(0,0,0,.35);backdrop-filter:blur(6px);left:auto;}',
  '.ih-panel h4{margin:0 0 12px;font-size:13px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#bfe9ff;}',
  '.ih-list{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none;}',
  '.ih-list li{display:grid;grid-template-columns:26px minmax(0,1fr);gap:10px;align-items:center;transition:opacity .4s;}',
  '.ih-num{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:800;color:#0d1a38;transition:background .35s;}',
  '.ih-list b{display:block;font-size:14px;font-weight:700;color:#fff;}',
  '.ih-list small{display:block;font-size:12.5px;color:#a9bfdc;transition:color .35s;}',
  '.ih-list li.done small{text-decoration:line-through;}',
  '.ih-list li.done{opacity:.7;}',
  '.narrow .ih-counter{left:12px;top:12px;font-size:13px;padding:8px 11px;}',
  '.narrow .ih-counter b{font-size:15px;}',
  '.narrow .ih-card{width:min(316px,calc(100% - 24px));padding:12px 14px 14px;}',
  '.narrow .ih-panel{left:12px;right:12px;top:auto;bottom:12px;width:auto;padding:12px 14px;}',
  '.narrow .ih-panel h4{margin-bottom:8px;}',
  '.narrow .ih-list{gap:6px;}',
  '.narrow .ih-act{display:none;}',
  '@media (prefers-reduced-motion: reduce){.ih-pulse .ih-dot::after{animation:none;display:none;}}'
].join('\n');

var HTML =
  '<div class="ih-ov">' +
  '<svg class="ih-svg"><line data-r="leader" x1="0" y1="0" x2="0" y2="0" stroke="rgba(92,200,255,.75)" stroke-width="1.5" opacity="0"></line></svg>' +
  '<div data-r="markers"></div>' +
  '<div class="ih-abs ih-tag" data-r="tag"><i></i>Gemelo digital</div>' +
  '<div class="ih-abs ih-counter" data-r="counter"><b data-r="eq">124</b> equipos · <b class="g" data-r="pct">76</b> % en buen estado</div>' +
  '<div class="ih-abs ih-card" data-r="card">' +
  '<div class="ih-card-h"><strong>Bomba de alimentación B</strong><span class="ih-pill" data-r="pill">Alarma</span></div>' +
  '<div class="ih-diag">Daño en rodamiento</div>' +
  '<div class="ih-act">Acción: cambiar rodamiento en la próxima ventana</div>' +
  '<div class="ih-life"><span>Vida útil</span><div class="ih-bar"><div class="ih-fill" data-r="fill"></div><div class="ih-flash" data-r="flash"></div></div></div>' +
  '</div>' +
  '<div class="ih-abs ih-panel" data-r="panel">' +
  '<h4>Prioridades de mantenimiento</h4>' +
  '<ol class="ih-list">' +
  '<li data-r="t1"><span class="ih-num" data-r="n1" style="background:#ef4444">1</span><div><b>Bomba de alimentación B</b><small>Cambiar rodamiento</small></div></li>' +
  '<li><span class="ih-num" style="background:#facc15">2</span><div><b>Ventilador celda 2</b><small>Revisar desbalance</small></div></li>' +
  '<li><span class="ih-num" style="background:#f59e0b">3</span><div><b>Transformador T2</b><small>Análisis de aceite</small></div></li>' +
  '</ol>' +
  '</div>' +
  '</div>';

export function montarEscenaIdapGemelo(THREE, container, opciones) {
  opciones = opciones || {};
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = opciones.reducirMovimiento != null ? !!opciones.reducirMovimiento : !!(mq && mq.matches);

  // DOM propio dentro del contenedor
  var estilo = document.createElement('style');
  estilo.textContent = CSS;
  var root = document.createElement('div');
  root.className = 'ih-raiz';
  if (opciones.fuente) root.style.fontFamily = opciones.fuente;
  root.innerHTML = HTML;
  container.appendChild(estilo);
  container.appendChild(root);
  function $(r) { return root.querySelector('[data-r="' + r + '"]'); }

  var LOOP = 16;
  var C = { b1: 0x16324f, b2: 0x22476f, b3: 0x0f243d, cyan: 0x5cc8ff, gold: 0xffc34d, green: 0x22c55e, amber: 0xf59e0b, yellow: 0xfacc15, red: 0xef4444 };
  var HEX = { green: '#22c55e', amber: '#f59e0b', yellow: '#facc15', red: '#ef4444' };

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (t, a, b) { return clamp01((t - a) / (b - a)); };
  var ease = function (x) { return x * x * (3 - 2 * x); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };

  // Renderer / escena
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
  var cyan = new THREE.Color(C.cyan), gold = new THREE.Color(C.gold), red = new THREE.Color(C.red), green = new THREE.Color(C.green);

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

  // Piezas
  var plant = new THREE.Group(); scene.add(plant);
  var lineBase = new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0 });
  var pieces = [];
  function part(name, geo, key, x, y, z, rot, opt) {
    var mat = M[key].clone(); mat.transparent = true; mat.opacity = 0;
    if (opt && opt.double) mat.side = THREE.DoubleSide;
    var mesh = new THREE.Mesh(geo, mat); mesh.name = name; mesh.position.set(x, y, z);
    if (rot) mesh.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    var lmat = lineBase.clone();
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), lmat));
    plant.add(mesh);
    var p = { mesh: mesh, mat: mat, lmat: lmat, y: y, cx: x }; pieces.push(p); return p;
  }
  var H = Math.PI / 2;
  var box = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
  var cyl = function (rt, rb, h, s, open) { return new THREE.CylinderGeometry(rt, rb, h, s || 16, 1, !!open); };

  function gasUnit(n, z) {
    part('tg' + n + '_patin', box(4.2, 0.35, 1.6), 'dark', -5.6, 0.175, z);
    part('tg' + n + '_filtro_admision', box(1.3, 2.0, 1.8), 'light', -8.2, 1.0, z);
    part('tg' + n + '_turbina', cyl(0.6, 0.6, 3.4, 16), 'body', -5.6, 1.0, z, [0, 0, H]);
    part('tg' + n + '_difusor', cyl(0.85, 0.6, 0.8, 16), 'light', -3.5, 1.0, z, [0, 0, -H]);
    part('hrsg' + n, box(3.0, 2.6, 1.7), 'body', -1.6, 1.3, z);
    part('hrsg' + n + '_domo', cyl(0.22, 0.22, 1.6, 16), 'light', -1.6, 2.82, z, [H, 0, 0]);
    part('chimenea' + n, cyl(0.34, 0.42, 5.6, 24), 'light', 0.55, 2.8, z);
    part('chimenea' + n + '_anillo', new THREE.TorusGeometry(0.4, 0.07, 8, 32), 'gold', 0.55, 5.0, z, [H, 0, 0]);
  }
  gasUnit(1, -3.8);
  gasUnit(2, -1.2);
  part('tuberia_vapor_alta', cyl(0.12, 0.12, 3.4, 12), 'light', 1.2, 2.2, -2.5, [H, 0, 0]);
  part('tuberia_vapor_baja', cyl(0.12, 0.12, 3.4, 12), 'dark', 1.2, 0.6, -2.5, [H, 0, 0]);
  part('nave_turbina_vapor', box(3.8, 2.6, 3.6), 'body', 3.3, 1.3, -2.5);
  var roofShape = new THREE.Shape(); roofShape.moveTo(-1.8, 0); roofShape.lineTo(1.8, 0); roofShape.lineTo(0, 0.7); roofShape.lineTo(-1.8, 0);
  var roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 3.8, bevelEnabled: false }); roofGeo.rotateY(H); roofGeo.translate(-1.9, 0, 0);
  part('nave_techo', roofGeo, 'light', 3.3, 2.601, -2.5);

  part('torre_enfriamiento', box(6.6, 1.5, 2.2), 'body', 4.6, 0.75, 2.9);
  var fans = [];
  [2.5, 4.6, 6.7].forEach(function (x, i) {
    part('torre_celda' + (i + 1) + '_campana', cyl(0.85, 0.8, 0.5, 24, true), 'light', x, 1.75, 2.9, null, { double: true });
    var bladeGeo = box(1.45, 0.05, 0.18);
    var f = part('torre_celda' + (i + 1) + '_ventilador', bladeGeo, 'dark', x, 1.62, 2.9);
    var b2 = new THREE.Mesh(bladeGeo, f.mat); b2.rotation.y = H;
    b2.add(new THREE.LineSegments(new THREE.EdgesGeometry(bladeGeo, 25), f.lmat));
    f.mesh.add(b2); fans.push(f);
  });

  var pumpB = [];
  ['A', 'B', 'C'].forEach(function (id, i) {
    var x = -5.2 + i * 1.6, z = 3.2;
    part('bomba' + id + '_base', box(1.5, 0.2, 0.7), 'dark', x, 0.1, z);
    var mo = part('bomba' + id + '_motor', cyl(0.3, 0.3, 0.75, 16), 'light', x - 0.28, 0.5, z, [0, 0, H]);
    var vo = part('bomba' + id + '_carcasa', cyl(0.36, 0.36, 0.28, 16), 'body', x + 0.35, 0.5, z, [0, 0, H]);
    part('bomba' + id + '_descarga', cyl(0.08, 0.08, 0.9, 10), 'dark', x + 0.35, 0.95, z);
    if (id === 'B') pumpB.push(mo, vo);
  });
  part('cabezal_alimentacion', cyl(0.13, 0.13, 4.6, 12), 'light', -3.6, 1.4, 3.2, [0, 0, H]);

  part('tanque1', cyl(0.85, 0.85, 2.4, 24), 'body', -7.4, 1.2, 1.8);
  part('tanque1_techo', new THREE.ConeGeometry(0.85, 0.35, 24), 'light', -7.4, 2.575, 1.8);
  part('tanque2', cyl(0.7, 0.7, 1.8, 24), 'body', -7.4, 0.9, 4.3);
  part('tanque2_techo', new THREE.ConeGeometry(0.7, 0.3, 24), 'light', -7.4, 1.95, 4.3);

  [-4.3, -2.9, -1.5].forEach(function (z, i) {
    part('transformador' + (i + 1), box(1.1, 1.1, 0.9), 'body', 7.1, 0.55, z);
    part('transformador' + (i + 1) + '_radiador', box(0.22, 0.8, 0.8), 'dark', 7.78, 0.5, z);
  });
  part('portico_poste1', box(0.14, 2.8, 0.14), 'light', 8.7, 1.4, -4.9);
  part('portico_poste2', box(0.14, 2.8, 0.14), 'light', 8.7, 1.4, -0.9);
  part('portico_viga', box(0.14, 0.14, 4.14), 'light', 8.7, 2.8, -2.9);
  pumpB.forEach(function (p) { p.emi0 = p.mat.emissive.clone(); });

  // Onda de escaneo
  function gradTex(vertical, stops) {
    var c = document.createElement('canvas'); c.width = vertical ? 4 : 128; c.height = vertical ? 128 : 4;
    var ctx = c.getContext('2d'); var g = ctx.createLinearGradient(0, 0, vertical ? 0 : c.width, vertical ? c.height : 0);
    stops.forEach(function (s) { g.addColorStop(s[0], 'rgba(255,255,255,' + s[1] + ')'); }); ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
    return new THREE.CanvasTexture(c);
  }
  var waveMat = function (o) { return new THREE.MeshBasicMaterial(Object.assign({ color: C.gold, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: 0 }, o)); };
  var sheet = new THREE.Mesh(new THREE.PlaneGeometry(12.6, 6.6), waveMat({ map: gradTex(true, [[0, 0], [0.7, 0.25], [1, 0.8]]) }));
  sheet.rotation.y = H; sheet.position.y = 3.3; scene.add(sheet);
  var band = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 12.6), waveMat({ map: gradTex(false, [[0, 0], [0.85, 0.45], [0.97, 1], [1, 0]]) }));
  band.rotation.x = -H; band.position.y = 0.012; scene.add(band);
  var WAVE_A = 4.2, WAVE_B = 7.0, waveAt = function (x) { return WAVE_A + (x + 10) / 20 * (WAVE_B - WAVE_A); };

  // Marcadores (16 visibles de 124 monitoreados)
  var markersEl = $('markers');
  var markers = [
    ['Turbina de gas 1', -5.6, 1.95, -3.8, 'green'], ['Turbina de gas 2', -5.6, 1.95, -1.2, 'green'],
    ['Recuperador 1', -1.6, 3.4, -3.8, 'green'], ['Recuperador 2', -1.6, 3.4, -1.2, 'amber'],
    ['Turbina de vapor', 3.3, 3.75, -2.5, 'green'],
    ['Ventilador celda 1', 2.5, 2.45, 2.9, 'green'], ['Ventilador celda 2', 4.6, 2.45, 2.9, 'yellow'], ['Ventilador celda 3', 6.7, 2.45, 2.9, 'green'],
    ['Bomba de alimentación A', -5.2, 1.95, 3.2, 'green'], ['Bomba de alimentación B', -3.6, 1.95, 3.2, 'red'], ['Bomba de alimentación C', -2.0, 1.95, 3.2, 'green'],
    ['Tanque 1', -7.4, 3.2, 1.8, 'green'], ['Tanque 2', -7.4, 2.5, 4.3, 'green'],
    ['Transformador T1', 7.1, 1.6, -4.3, 'green'], ['Transformador T2', 7.1, 1.6, -2.9, 'amber'], ['Transformador T3', 7.1, 1.6, -1.5, 'green']
  ].map(function (d) {
    var el = document.createElement('div'); el.className = 'ih-abs ih-marker'; el.title = d[0];
    el.innerHTML = '<div class="ih-dot"></div>'; el.style.setProperty('--c', HEX[d[4]]);
    markersEl.appendChild(el);
    return { name: d[0], pos: new THREE.Vector3(d[1], d[2], d[3]), state: d[4], el: el, on: waveAt(d[1]), key: '' };
  });
  var mB = markers.find(function (m) { return m.state === 'red'; });
  var tagPos = new THREE.Vector3(-9.2, 0, 6.2);

  var tagEl = $('tag'), counterEl = $('counter'), eqEl = $('eq'), pctEl = $('pct');
  var card = $('card'), pill = $('pill'), fillEl = $('fill'), flashEl = $('flash');
  var panel = $('panel'), t1 = $('t1'), n1 = $('n1'), leader = $('leader');

  // Medidas
  var W = 1, Hh = 1, dO = 30, narrow = false;
  var FOV = 28, tanH = Math.tan(FOV * Math.PI / 360);
  var running = false, raf = 0, last = 0, inView = true, vivo = true;
  function resize() {
    W = Math.max(1, root.clientWidth); Hh = Math.max(1, root.clientHeight);
    renderer.setSize(W, Hh, false); camera.aspect = W / Hh; camera.updateProjectionMatrix();
    narrow = W < 720; root.classList.toggle('narrow', narrow);
    dO = Math.max(10 / tanH, 13.2 / (tanH * camera.aspect)) * 1.12;
    if (!running) frame(0);
  }

  // Puntero (inclinación limitada)
  var mx = 0, my = 0, sx = 0, sy = 0;
  function alMover(e) {
    var r = root.getBoundingClientRect();
    mx = clamp01((e.clientX - r.left) / r.width) * 2 - 1; my = clamp01((e.clientY - r.top) / r.height) * 2 - 1;
  }
  function alSalir() { mx = 0; my = 0; }
  root.addEventListener('pointermove', alMover);
  root.addEventListener('pointerleave', alSalir);

  var tmp = new THREE.Vector3(), tgt = new THREE.Vector3();
  var O_TGT = new THREE.Vector3(0, 0.6, 0.8);
  function proj(v) { tmp.copy(v).project(camera); return { x: (tmp.x + 1) / 2 * W, y: (1 - tmp.y) / 2 * Hh, ok: tmp.z < 1 }; }
  function place(el, x, y, a, extra) { el.style.opacity = a.toFixed(3); el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)' + (extra || ''); }

  var elapsed = 0, domKey = '';
  function frame(dt) {
    if (!vivo) return;
    elapsed += dt;
    var t = reduced ? 12.9 : elapsed % LOOP;
    var still = reduced;
    sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;

    // Cámara
    var k = still ? 0 : ease(seg(t, 8, 9.8)) * (1 - ease(seg(t, 13, 14.8)));
    var az = Math.PI / 4 + (still ? 0 : 0.05 * Math.sin(2 * Math.PI * t / LOOP)) + 0.28 * k + (still ? 0 : sx * 0.1);
    var el = 0.6 - 0.1 * k + (still ? 0 : -sy * 0.05);
    var dF = dO * 0.45;
    var dist = lerp(dO, dF, k);
    var fT = mB.pos.clone(); fT.y += narrow ? -0.6 : 0.5;
    if (narrow) fT.y -= 0.34 * dF * tanH / Math.cos(el);
    else { var s = 0.42 * dF * tanH * camera.aspect; fT.x += Math.cos(az) * s; fT.z -= Math.sin(az) * s; }
    tgt.copy(O_TGT).lerp(fT, k);
    camera.position.set(tgt.x + dist * Math.cos(el) * Math.sin(az), tgt.y + dist * Math.sin(el), tgt.z + dist * Math.cos(el) * Math.cos(az));
    camera.lookAt(tgt);

    // Onda
    var wk = seg(t, WAVE_A, WAVE_B), wx = lerp(-10, 10, wk), wv = (wk > 0 && wk < 1) ? Math.sin(Math.PI * wk) : 0;
    sheet.position.x = wx; band.position.x = wx - 1.3;
    sheet.material.opacity = 0.55 * wv; band.material.opacity = 0.7 * wv;
    sheet.visible = band.visible = wv > 0.001;

    // Armado y disolución
    var N = pieces.length;
    pieces.forEach(function (p, i) {
      var t0 = 0.15 + i * 2.4 / N;
      var a = ease(seg(t, t0, t0 + 0.35)), s2 = ease(seg(t, t0 + 0.45, t0 + 0.95));
      var d0 = 15 + (N - 1 - i) / N * 0.5;
      var ds = ease(seg(t, d0, d0 + 0.3)), dl = ease(seg(t, d0 + 0.2, d0 + 0.5));
      p.mesh.position.y = p.y + (1 - a) * 0.8 + dl * 0.4;
      var solid = s2 * (1 - ds);
      var line = a * (1 - dl) * (0.95 - 0.4 * solid);
      var g = wv > 0 ? Math.max(0, 1 - Math.abs(p.cx - wx) / 1.4) : 0;
      p.lmat.color.copy(cyan).lerp(gold, g);
      p.lmat.opacity = Math.min(1, line + g * 0.6 * (line > 0 ? 1 : 0));
      p.mat.opacity = solid;
      p.mat.visible = solid > 0.004; p.lmat.visible = p.lmat.opacity > 0.004;
    });
    fans.forEach(function (f, i) { f.mesh.rotation.y = still ? i * 0.4 : elapsed * 0.9 + i * 0.7; });

    // Bomba B: late en rojo y pasa a verde al atenderse
    var fixed = t >= 11.4;
    pumpB.forEach(function (p) {
      p.mat.emissive.copy(p.emi0); p.mat.emissiveIntensity = 0.28;
      if (!still && t >= mB.on && !fixed) { var pu = 0.5 + 0.5 * Math.sin(elapsed * 6.5); p.mat.emissive.lerp(red, 0.7); p.mat.emissiveIntensity = 0.3 + 0.5 * pu; }
      else if (!still && fixed && t < 12.6) { var f = 1 - seg(t, 11.4, 12.6); p.mat.emissive.lerp(green, 0.7 * f); p.mat.emissiveIntensity = 0.28 + 0.45 * f; }
    });

    renderer.render(scene, camera);

    // Capas HTML
    var outA = 1 - ease(seg(t, 14.8, 15.3));
    markers.forEach(function (m) {
      var on = seg(t, m.on, m.on + 0.35), a = ease(on) * outA;
      var pop = on < 1 ? 1 + 0.6 * Math.sin(Math.PI * on) : 1;
      var st = (m === mB && fixed) ? 'green' : m.state;
      var key = st + (st === 'red' && !still ? 'p' : '');
      if (key !== m.key) { m.key = key; m.el.style.setProperty('--c', HEX[st]); m.el.classList.toggle('ih-pulse', key === 'redp'); }
      var q = proj(m.pos);
      place(m.el, q.x, q.y, q.ok ? a : 0, ' scale(' + pop.toFixed(3) + ')');
    });

    var tq = proj(tagPos);
    place(tagEl, tq.x, tq.y - 34, still ? 0 : ease(seg(t, 0.3, 0.8)) * (1 - ease(seg(t, 7.6, 8.2))));

    var cA = still ? 1 : ease(seg(t, 6.4, 6.9)) * (1 - ease(seg(t, 14.2, 14.8)));
    var cn = still ? 1 : ease(seg(t, 6.4, 7.6));
    eqEl.textContent = Math.round(124 * cn); pctEl.textContent = Math.round(76 * cn);
    // en celular la tarjeta ocupa ese lugar: el contador se aparta mientras está
    if (narrow) cA *= 1 - ease(seg(t, 9.2, 9.6)) * (1 - ease(seg(t, 13.4, 13.9)));
    counterEl.style.opacity = cA.toFixed(3); counterEl.style.transform = 'translateY(' + ((1 - cA) * -8).toFixed(1) + 'px)';

    var cardA = still ? 0 : ease(seg(t, 9.4, 9.9)) * (1 - ease(seg(t, 13, 13.6)));
    var panA = still ? 0 : ease(seg(t, 9.8, 10.3)) * (1 - ease(seg(t, 13.1, 13.7)));
    var done = t >= 11.1;
    var dk = (fixed ? 'f' : 'a') + (done ? 'd' : 'o');
    if (dk !== domKey) {
      domKey = dk;
      pill.textContent = fixed ? 'Bueno' : 'Alarma'; pill.style.background = fixed ? HEX.green : HEX.red;
      fillEl.style.background = fixed ? HEX.green : HEX.red;
      t1.classList.toggle('done', done); n1.textContent = done ? '✓' : '1'; n1.style.background = done ? HEX.green : HEX.red;
    }
    var life = 18 + 68 * ease(seg(t, 11.4, 12.4));
    fillEl.style.width = life.toFixed(1) + '%';
    flashEl.style.left = life.toFixed(1) + '%';
    var fl = seg(t, 11.4, 12.7); flashEl.style.opacity = (fl > 0 && fl < 1 ? Math.sin(Math.PI * fl) : 0).toFixed(3);

    if (cardA > 0.001) {
      var q = proj(mB.pos), cw = card.offsetWidth, ch = card.offsetHeight;
      var cx, cy, lx, ly;
      if (narrow) { cx = Math.min(Math.max(12, q.x - cw / 2), W - cw - 12); cy = Math.max(12, Math.min(q.y + 28, panel.offsetTop - ch - 10)); lx = Math.min(Math.max(q.x, cx + 16), cx + cw - 16); ly = cy; }
      else {
        var pl = panel.offsetLeft - 16;
        cx = q.x + 30; if (cx + cw > pl) cx = q.x - 30 - cw;
        cx = Math.min(Math.max(12, cx), Math.max(12, pl - cw));
        cy = Math.min(Math.max(12, q.y - ch - 30), Hh - ch - 12);
        lx = cx + cw < q.x ? cx + cw : cx; ly = cy + ch;
      }
      place(card, cx, cy + (1 - cardA) * 10, cardA);
      leader.setAttribute('x1', q.x); leader.setAttribute('y1', q.y); leader.setAttribute('x2', lx); leader.setAttribute('y2', ly);
      leader.setAttribute('opacity', cardA.toFixed(3));
    } else { card.style.opacity = 0; leader.setAttribute('opacity', 0); }
    panel.style.opacity = panA.toFixed(3);
    panel.style.transform = narrow ? 'translateY(' + ((1 - panA) * 14).toFixed(1) + 'px)' : 'translate(' + ((1 - panA) * 18).toFixed(1) + 'px,-50%)';
  }

  // Solo corre mientras se ve
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
