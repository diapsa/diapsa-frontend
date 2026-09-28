/**
 * Escena "¿Te suena familiar?": la misma planta cuenta dos historias según
 * la pestaña. Con "sin" (todavía no tengo predictivo) un motor falla sin
 * aviso, la línea se para y llega el correctivo de emergencia; al cierre,
 * con predictivo, la misma falla se ve a tiempo. Con "con" (ya tengo, pero
 * no me da el tiempo) aparecen cientos de activos, dos técnicos que no
 * terminan la ruta, sistemas que acumulan datos sin decisión, y al cierre
 * el analista de DIAPSA recorre todo y deja tres hallazgos en IDAP.
 *
 * Generada en Claude Diseño (docs/designs/te-suena-familiar-escena.html) y
 * portada como las demás escenas: recibe THREE, el contenedor y
 * { modo: "sin" | "con", inicio: segundos }, y devuelve la limpieza, con
 * limpiar.modo(nuevo)
 * para cambiar de historia sin volver a montar.
 */
/* eslint-disable */
export function montarEscenaDolor(THREE, container, opciones) {
  opciones = opciones || {};
  var modo = opciones.modo === 'con' ? 'con' : 'sin';
  var PI = Math.PI;
  function durModo() { return modo === 'con' ? 21 : 16; }
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reducido = !!(mq && mq.matches);

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lin(a, b, x) { return clamp((x - a) / (b - a), 0, 1); }
  function s01(a, b, x) { var u = lin(a, b, x); return u * u * (3 - 2 * u); }
  function pop(a, x) { var u = clamp((x - a) / 0.35, 0, 1); if (u <= 0) return 0; var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }
  function mod(a, n) { return ((a % n) + n) % n; }

  /* ---------- DOM ---------- */
  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }
  var raiz = el('div', "position:relative;width:100%;font-family:'IBM Plex Sans',system-ui,sans-serif;color:#002e46;--k:1;");
  var escenario = el('div', 'position:relative;width:100%;overflow:hidden;border-radius:14px;background:#f3f6f8;border:1px solid #d9e2e8;box-sizing:border-box;');
  var capa = el('div', 'position:absolute;inset:0;pointer-events:none;');
  var destello = el('div', 'position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,rgba(239,68,68,0) 45%,rgba(239,68,68,.32) 100%);');
  var velo = el('div', 'position:absolute;inset:0;pointer-events:none;background:#f3f6f8;opacity:0;');
  var contador = el('div', 'position:absolute;left:calc(18px*var(--k));top:calc(18px*var(--k));display:flex;align-items:center;gap:.55em;background:#fff;border:1px solid #d9e2e8;border-radius:999px;padding:.45em .95em;font-weight:600;font-size:calc(15px*var(--k));white-space:nowrap;transition:opacity .3s,border-color .2s;');
  var contPunto = el('span', 'width:.62em;height:.62em;border-radius:50%;background:#10b981;flex:none;');
  var contTxt = el('span', '', 'Producción en marcha');
  contador.appendChild(contPunto); contador.appendChild(contTxt);
  var leyenda = el('div', 'transition:opacity .18s;opacity:0;font-weight:600;text-wrap:pretty;');
  raiz.setAttribute('role', 'img');
  raiz.setAttribute('aria-label', 'Maqueta de una planta industrial que muestra cómo se descubre una falla con y sin monitoreo predictivo');

  var SIS = ['SAP', 'SCADA', 'CMMS', 'Excel'];
  var ventanas = SIS.map(function (n, j) {
    var v = el('div', 'position:absolute;left:0;top:0;display:none;width:calc(150px*var(--k));background:#fff;border:1px solid #d9e2e8;border-radius:calc(7px*var(--k));box-shadow:0 8px 20px rgba(0,46,70,.12);font-size:calc(12px*var(--k));');
    var barra = el('div', 'display:flex;align-items:center;justify-content:space-between;background:#002e46;color:#fff;font-weight:700;padding:.5em .75em;border-radius:calc(6px*var(--k)) calc(6px*var(--k)) 0 0;');
    barra.appendChild(el('span', '', n));
    var pts = el('span', 'display:flex;gap:3px;');
    for (var i = 0; i < 3; i++) pts.appendChild(el('span', 'width:5px;height:5px;border-radius:50%;background:#2b5671;'));
    barra.appendChild(pts);
    var badge = el('span', 'position:absolute;right:-.7em;top:-.7em;min-width:1.9em;height:1.9em;padding:0 .4em;box-sizing:border-box;border-radius:999px;background:#ef4444;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;', '0');
    var cuerpo = el('div', 'padding:.55em .7em .65em;display:flex;flex-direction:column;gap:.4em;');
    var filas = [];
    for (i = 0; i < 4; i++) {
      var f = el('div', 'display:none;align-items:center;gap:.45em;');
      f.appendChild(el('span', 'width:.55em;height:.55em;border-radius:50%;flex:none;background:' + ['#f5c542', '#ef4444', '#9aa9b4', '#f5c542'][(i + j) % 4] + ';'));
      f.appendChild(el('span', 'height:.5em;border-radius:3px;background:#d9e2e8;flex:1;max-width:' + (60 + ((i * 17 + j * 11) % 35)) + '%;'));
      filas.push(f); cuerpo.appendChild(f);
    }
    cuerpo.appendChild(el('div', 'height:.5em;border-radius:3px;background:#eef2f5;width:70%;'));
    v.appendChild(barra); v.appendChild(cuerpo); v.appendChild(badge); capa.appendChild(v);
    return { el: v, badge: badge, filas: filas };
  });

  var HALLAZGOS = [
    ['#ef4444', '#fff', 'Bomba de proceso', 'Rodamiento dañado', 'Hoy'],
    ['#f5c542', '#002e46', 'Ventilador de extracción', 'Desbalance', 'Esta semana'],
    ['#f5c542', '#002e46', 'Compresor de aire', 'Desalineación', 'Este mes']
  ];
  var idap = el('div', 'position:absolute;right:calc(14px*var(--k));top:calc(14px*var(--k));display:none;transition:transform .3s;width:calc(270px*var(--k));background:#fff;border:1px solid #d9e2e8;border-radius:calc(9px*var(--k));box-shadow:0 12px 30px rgba(0,46,70,.16);font-size:calc(13px*var(--k));overflow:hidden;height:auto;max-height:none;');
  var idapBar = el('div', 'display:flex;align-items:center;gap:.6em;background:#002e46;color:#fff;padding:.6em .85em;');
  idapBar.appendChild(el('span', 'width:.7em;height:.7em;background:#fc9f01;border-radius:2px;flex:none;'));
  idapBar.appendChild(el('span', 'font-weight:700;font-size:1.15em;letter-spacing:.04em;', 'IDAP'));
  idapBar.appendChild(el('span', 'margin-left:auto;opacity:.85;font-size:.9em;', 'Hallazgos priorizados'));
  idap.appendChild(idapBar);
  var idapFilas = HALLAZGOS.map(function (h, r) {
    var f = el('div', 'display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:.65em;padding:.6em .85em;border-top:' + (r ? '1px solid #eef2f5' : '0') + ';opacity:0;');
    f.appendChild(el('span', 'width:1.7em;height:1.7em;border-radius:50%;background:' + h[0] + ';color:' + h[1] + ';font-weight:700;display:flex;align-items:center;justify-content:center;', String(r + 1)));
    var tx = el('span', 'display:flex;flex-direction:column;line-height:1.25;min-width:0;');
    tx.appendChild(el('strong', 'font-weight:600;', h[2]));
    tx.appendChild(el('span', 'color:#2b5671;', h[3]));
    f.appendChild(tx);
    f.appendChild(el('span', 'font-weight:600;font-size:.88em;border:1px solid #d9e2e8;border-radius:999px;padding:.2em .6em;white-space:nowrap;', h[4]));
    idap.appendChild(f); return f;
  });
  var pie = el('div', 'display:flex;align-items:center;gap:.85em;padding:.7em .85em .8em;border-top:1px solid #eef2f5;opacity:0;');
  var NSV = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NSV, 'svg'); svg.setAttribute('viewBox', '0 0 42 42'); svg.style.cssText = 'width:3.6em;height:3.6em;flex:none;transform:rotate(-90deg);';
  var circF = document.createElementNS(NSV, 'circle'); circF.setAttribute('cx', '21'); circF.setAttribute('cy', '21'); circF.setAttribute('r', '20'); circF.setAttribute('fill', '#d9e2e8');
  var circP = document.createElementNS(NSV, 'circle'); circP.setAttribute('cx', '21'); circP.setAttribute('cy', '21'); circP.setAttribute('r', '10'); circP.setAttribute('fill', 'none'); circP.setAttribute('stroke', '#10b981'); circP.setAttribute('stroke-width', '20');
  var CIRC = 2 * Math.PI * 10; circP.setAttribute('stroke-dasharray', '0 ' + CIRC.toFixed(2));
  svg.appendChild(circF); svg.appendChild(circP); pie.appendChild(svg);
  var pieTx = el('div', 'display:flex;flex-direction:column;line-height:1.2;');
  var piePct = el('strong', 'font-weight:700;font-size:1.5em;font-variant-numeric:tabular-nums;', '0%');
  pieTx.appendChild(piePct); pieTx.appendChild(el('span', 'color:#2b5671;white-space:nowrap;', 'Activos inspeccionados'));
  pie.appendChild(pieTx); idap.appendChild(pie);
  capa.appendChild(idap);

  var reloj = el('div', 'position:absolute;left:0;top:0;display:none;flex-direction:column;align-items:center;gap:6px;');
  var cara = el('div', 'position:relative;width:calc(60px*var(--k));height:calc(60px*var(--k));border-radius:50%;background:#fff;border:2px solid #002e46;box-sizing:border-box;box-shadow:0 6px 16px rgba(0,46,70,.12);');
  var arco = el('div', 'position:absolute;inset:4px;border-radius:50%;');
  var aguja = el('div', 'position:absolute;left:50%;top:16%;width:2px;height:34%;margin-left:-1px;background:#002e46;transform-origin:50% 100%;border-radius:2px;');
  cara.appendChild(arco); cara.appendChild(aguja);
  cara.appendChild(el('div', 'position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:#002e46;'));
  var relTxt = el('div', 'font-size:calc(13px*var(--k));font-weight:700;background:#fff;border:1px solid #ef4444;color:#002e46;border-radius:999px;padding:.25em .75em;white-space:nowrap;opacity:0;', 'Fin del turno');
  reloj.appendChild(cara); reloj.appendChild(relTxt); capa.appendChild(reloj);

  function chipIDAP() {
    var c = el('div', 'position:absolute;left:0;top:0;display:none;align-items:center;gap:.45em;background:#002e46;color:#fff;font-weight:700;font-size:calc(12px*var(--k));padding:.35em .7em;border-radius:6px;box-shadow:0 4px 12px rgba(0,46,70,.2);white-space:nowrap;');
    c.appendChild(el('span', 'width:.6em;height:.6em;background:#fc9f01;border-radius:2px;'));
    c.appendChild(el('span', '', 'IDAP'));
    capa.appendChild(c); return c;
  }
  var chipA = chipIDAP(), chipB = chipIDAP();
  var costo = el('div', 'position:absolute;left:0;top:0;display:none;flex-direction:column;gap:.35em;width:calc(230px*var(--k));line-height:1.3;background:#fff;border:1.5px solid #ef4444;border-radius:calc(9px*var(--k));padding:.7em .85em .8em;box-shadow:0 10px 24px rgba(239,68,68,.18);font-size:calc(13px*var(--k));box-sizing:border-box;');
  costo.appendChild(el('span', 'font-weight:600;color:#2b5671;', 'Costo del paro'));
  var costoMonto = el('strong', 'font-weight:700;font-size:1.9em;line-height:1.05;color:#ef4444;font-variant-numeric:tabular-nums;', '$0');
  costo.appendChild(costoMonto);
  var costoBarra = el('div', 'height:.45em;border-radius:99px;background:#fde2e2;overflow:hidden;');
  var costoFill = el('div', 'height:100%;width:0;background:#ef4444;border-radius:99px;');
  costoBarra.appendChild(costoFill); costo.appendChild(costoBarra);
  var costoItems = ['Producción perdida', 'Horas extra', 'Refacciones urgentes'].map(function (tx) {
    var r = el('div', 'display:flex;justify-content:space-between;gap:.5em;opacity:0;color:#002e46;white-space:nowrap;');
    r.appendChild(el('span', '', tx)); r.appendChild(el('span', 'color:#ef4444;font-weight:700;', '+'));
    costo.appendChild(r); return r;
  });
  capa.appendChild(costo);
  var aviso = el('div', 'position:absolute;left:0;top:0;display:none;flex-direction:column;gap:.15em;background:#f5c542;color:#002e46;border-radius:calc(8px*var(--k));padding:.55em .8em .6em;box-shadow:0 8px 20px rgba(0,46,70,.18);font-size:calc(13px*var(--k));white-space:nowrap;');
  var avisoT = el('div', 'display:flex;align-items:center;gap:.45em;font-weight:700;font-size:1.1em;');
  avisoT.appendChild(el('span', 'width:1.2em;height:1.2em;border-radius:50%;background:#002e46;color:#f5c542;display:flex;align-items:center;justify-content:center;font-size:.8em;', '!'));
  avisoT.appendChild(el('span', '', 'Precaución'));
  aviso.appendChild(avisoT);
  aviso.appendChild(el('span', 'font-weight:600;', 'Falla detectada'));
  aviso.appendChild(el('span', '', 'Programar mantenimiento'));
  capa.appendChild(aviso);

  escenario.appendChild(capa); escenario.appendChild(destello); escenario.appendChild(contador); escenario.appendChild(velo);
  raiz.appendChild(escenario); raiz.appendChild(leyenda);
  container.appendChild(raiz);

  /* ---------- Three ---------- */
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  var canvas = renderer.domElement;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  escenario.insertBefore(canvas, capa);

  var scene = new THREE.Scene();
  var cam = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 400);
  var rev = parseInt(THREE.REVISION, 10) || 128;
  var kL = rev >= 155 ? PI : 1;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d5dd, 0.72 * kL));
  var sol = new THREE.DirectionalLight(0xffffff, 0.5 * kL); sol.position.set(14, 26, 9); scene.add(sol);

  var M = {};
  function mat(nombre, color, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: 0.78, metalness: 0.04 });
    if (extra) for (var key in extra) m[key] = extra[key];
    m.name = nombre; return m;
  }
  M.marino = mat('marino', 0x002e46, { roughness: 0.6 });
  M.azul = mat('azul', 0x2b5671);
  M.piso = mat('piso', 0xeef2f5, { roughness: 0.95 });
  M.muro = mat('muro', 0xf0f4f7, { roughness: 0.95 });
  M.claro = mat('claro', 0xd9e2e8);
  M.acople = mat('acople', 0xd9e2e8, { flatShading: true });
  M.inst = mat('cuerpo_equipo', 0xffffff);
  M.blanco = mat('blanco', 0xffffff);
  M.naranja = mat('naranja', 0xfc9f01);
  M.rojo = mat('rojo', 0xef4444);
  M.cabeza = mat('cabeza', 0xd9e2e8);
  M.casco = mat('casco', 0xffffff, { roughness: 0.5 });

  function box(w, h, d, m, x, y, z, parent, name) { var me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); me.position.set(x, y, z); if (name) me.name = name; (parent || scene).add(me); return me; }
  function cyl(rt, rb, h, seg, m, x, y, z, parent, rx, rz, name) { var me = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); me.position.set(x, y, z); me.rotation.set(rx || 0, 0, rz || 0); if (name) me.name = name; (parent || scene).add(me); return me; }
  function rejilla(x0, x1, z0, z1, paso, y, color, op) {
    var p = [], v;
    for (v = x0; v <= x1 + 1e-6; v += paso) p.push(v, y, z0, v, y, z1);
    for (v = z0; v <= z1 + 1e-6; v += paso) p.push(x0, y, v, x1, y, v);
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    var l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: op })); scene.add(l); return l;
  }

  /* nave */
  rejilla(-70, 70, -70, 70, 2, -0.3, 0xd9e2e8, 0.9);
  var losa = box(40.6, 0.3, 24.6, M.piso, 0, -0.15, 0, scene, 'losa');
  var bordes = new THREE.LineSegments(new THREE.EdgesGeometry(losa.geometry), new THREE.LineBasicMaterial({ color: 0x002e46, transparent: true, opacity: 0.35 }));
  losa.add(bordes);
  rejilla(-20, 20, -12, 12, 2, 0.004, 0xd9e2e8, 1);
  box(40.6, 4.2, 0.3, M.muro, 0, 2.1, -12.15, scene, 'muro_fondo');
  box(0.3, 4.2, 24.6, M.muro, -20.15, 2.1, 0, scene, 'muro_izq');
  var colPos = [];
  [-20, -10, 0, 10, 20].forEach(function (x) { colPos.push([x, -12]); });
  [-4, 4, 12].forEach(function (z) { colPos.push([-20, z]); });
  var columnas = new THREE.InstancedMesh(new THREE.BoxGeometry(0.4, 7, 0.4), M.marino, colPos.length); columnas.name = 'columnas';
  var mT = new THREE.Matrix4();
  colPos.forEach(function (c, i) { mT.makeTranslation(c[0], 3.5, c[1]); columnas.setMatrixAt(i, mT); });
  scene.add(columnas);
  box(40.4, 0.34, 0.34, M.marino, 0, 7, -12, scene, 'viga_fondo');
  box(0.34, 0.34, 24.4, M.marino, -20, 7, 0, scene, 'viga_izq');

  /* banda */
  var BZ = 3, BX0 = -13, BL = 26, BY = 1.02;
  box(BL, 0.08, 1.0, M.azul, 0, BY - 0.04, BZ, scene, 'banda');
  box(BL, 0.18, 0.1, M.marino, 0, BY - 0.02, BZ - 0.56, scene, 'riel');
  box(BL, 0.18, 0.1, M.marino, 0, BY - 0.02, BZ + 0.56, scene, 'riel');
  cyl(0.14, 0.14, 1.1, 20, M.marino, BX0, BY - 0.06, BZ, scene, PI / 2, 0, 'tambor');
  cyl(0.14, 0.14, 1.1, 20, M.marino, BX0 + BL, BY - 0.06, BZ, scene, PI / 2, 0, 'tambor');
  var patas = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, BY - 0.1, 0.12), M.marino, 18); patas.name = 'patas_banda';
  for (var i = 0; i < 9; i++) for (var s = 0; s < 2; s++) { mT.makeTranslation(BX0 + 0.3 + i * (BL - 0.6) / 8, (BY - 0.1) / 2, BZ + (s ? 0.52 : -0.52)); patas.setMatrixAt(i * 2 + s, mT); }
  scene.add(patas);
  var NL = 26;
  var listones = new THREE.InstancedMesh(new THREE.BoxGeometry(0.1, 0.012, 0.96), M.marino, NL); listones.name = 'listones';
  listones.instanceMatrix.setUsage(THREE.DynamicDrawUsage); listones.frustumCulled = false; scene.add(listones);
  var NC = 12;
  var cajas = new THREE.InstancedMesh(new THREE.BoxGeometry(0.72, 0.72, 0.72), M.blanco, NC); cajas.name = 'cajas_produccion';
  cajas.instanceMatrix.setUsage(THREE.DynamicDrawUsage); cajas.frustumCulled = false; scene.add(cajas);
  var cajaJit = [];
  for (i = 0; i < NC; i++) { cajaJit.push(((i * 37) % 7 - 3) * 0.025); cajas.setColorAt(i, new THREE.Color(i % 3 ? 0xffffff : 0xe6ecf0)); }

  /* activos */
  var activos = [];
  function act(o) { o.i = activos.length; activos.push(o); return o; }
  [-9, -4, 1, 6].forEach(function (x, k) { act({ id: 'm' + k, tipo: 'mb', x: x, z: -3, top: 1.95, r: 1.9 }); });
  act({ id: 'f0', tipo: 'fan', x: 9.5, z: -9.2, top: 3.3, r: 1.5 });
  act({ id: 'f1', tipo: 'fan', x: 13.5, z: -9.2, top: 3.3, r: 1.5 });
  act({ id: 'c', tipo: 'comp', x: 16.3, z: -3.2, top: 1.75, r: 1.9 });
  act({ id: 'tab', tipo: 'tab', x: -17.4, z: -10.6, top: 2.5, r: 1.7 });
  act({ id: 'tr', tipo: 'trafo', x: -17.3, z: -2.8, top: 2.35, r: 1.6 });
  [-13, -10, -7, -4, -1, 2, 5].forEach(function (x) { act({ tipo: 'mb', x: x, z: -9.2, top: 1.95, r: 1.9, extra: true }); });
  for (i = 0; i < 11; i++) act({ tipo: 'mb', x: -16 + i * 3.2, z: 7.4, top: 1.95, r: 1.9, extra: true, esRojo: i === 5 });
  for (i = 0; i < 9; i++) act({ tipo: 'tank', x: -16 + i * 4, z: 10.4, top: 3.0, r: 1.2, extra: true });
  var nExtra = 0;
  activos.forEach(function (a) { if (a.extra) { a.ap = 0.3 + ((nExtra * 11) % 27) * 0.07; nExtra++; } a.med = null; });
  activos[0].med = 5.0; activos[1].med = 6.7; activos[7].med = 4.8;

  function L(x, y, z, rx, ry, rz) {
    var T = new THREE.Matrix4().makeTranslation(x, y, z);
    var R = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0));
    return { T: T, R: R, TR: new THREE.Matrix4().multiplyMatrices(T, R) };
  }
  function grupoInst(nombre, lista, partes) {
    var g = { lista: lista, partes: [] };
    lista.forEach(function (a, k) { a.k = k; a.g = g; });
    partes.forEach(function (p) {
      var im = new THREE.InstancedMesh(p.g, p.m, lista.length);
      im.name = nombre + '_' + p.n; im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false;
      if (p.color) for (var k = 0; k < lista.length; k++) im.setColorAt(k, new THREE.Color(0x2b5671));
      scene.add(im); p.im = im; g.partes.push(p);
      if (p.color) g.colorIm = im;
    });
    return g;
  }
  var mA = new THREE.Matrix4(), mP = new THREE.Matrix4(), mR = new THREE.Matrix4(), vS = new THREE.Vector3();
  function fijarInst(g, k, x, y, z, s, ang) {
    mA.makeRotationY(0); mA.scale(vS.set(s || 1e-4, s || 1e-4, s || 1e-4)); mA.setPosition(x, y, z);
    for (var n = 0; n < g.partes.length; n++) {
      var p = g.partes[n];
      if (p.spin) { mR.makeRotationX(ang); mP.multiplyMatrices(mA, p.l.T).multiply(mR).multiply(p.l.R); }
      else mP.multiplyMatrices(mA, p.l.TR);
      p.im.setMatrixAt(k, mP);
    }
  }
  var H2 = PI / 2;
  var GMB = grupoInst('motor_bomba', activos.filter(function (a) { return a.tipo === 'mb'; }), [
    { n: 'base', g: new THREE.BoxGeometry(3, 0.22, 1.1), m: M.marino, l: L(0, 0.11, 0) },
    { n: 'patas_motor', g: new THREE.BoxGeometry(1.1, 0.34, 0.8), m: M.marino, l: L(-0.65, 0.39, 0) },
    { n: 'motor', g: new THREE.CylinderGeometry(0.46, 0.46, 1.3, 32), m: M.inst, l: L(-0.65, 0.8, 0, 0, 0, H2), color: true },
    { n: 'tapa_ventilador', g: new THREE.CylinderGeometry(0.34, 0.46, 0.3, 32), m: M.marino, l: L(-1.45, 0.8, 0, 0, 0, H2) },
    { n: 'caja_conexiones', g: new THREE.BoxGeometry(0.36, 0.26, 0.4), m: M.marino, l: L(-0.5, 1.33, 0) },
    { n: 'acople', g: new THREE.CylinderGeometry(0.22, 0.22, 0.34, 6), m: M.acople, l: L(0.18, 0.8, 0, 0, 0, H2), spin: true },
    { n: 'soporte_bomba', g: new THREE.BoxGeometry(0.6, 0.34, 0.7), m: M.marino, l: L(0.95, 0.39, 0) },
    { n: 'bomba', g: new THREE.CylinderGeometry(0.52, 0.52, 0.44, 32), m: M.azul, l: L(0.95, 0.82, 0, 0, 0, H2) },
    { n: 'descarga', g: new THREE.CylinderGeometry(0.14, 0.14, 0.8, 16), m: M.azul, l: L(0.95, 1.55, 0) },
    { n: 'brida', g: new THREE.CylinderGeometry(0.22, 0.22, 0.06, 16), m: M.marino, l: L(0.95, 1.95, 0) },
    { n: 'succion', g: new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16), m: M.azul, l: L(1.38, 0.82, 0, 0, 0, H2) }
  ]);
  var GTK = grupoInst('tanque', activos.filter(function (a) { return a.tipo === 'tank'; }), [
    { n: 'base', g: new THREE.CylinderGeometry(0.86, 0.86, 0.2, 32), m: M.marino, l: L(0, 0.1, 0) },
    { n: 'cuerpo', g: new THREE.CylinderGeometry(0.72, 0.72, 2.1, 32), m: M.inst, l: L(0, 1.25, 0), color: true },
    { n: 'tapa', g: new THREE.SphereGeometry(0.72, 32, 10, 0, PI * 2, 0, H2), m: M.azul, l: L(0, 2.3, 0) }
  ]);

  function grupo(a, nombre) { var g = new THREE.Group(); g.name = nombre; g.position.set(a.x, 0, a.z); scene.add(g); a.mat = mat('cuerpo_' + a.id, 0x2b5671, { side: THREE.DoubleSide }); return g; }
  activos.forEach(function (a) {
    var g;
    if (a.tipo === 'fan') {
      g = grupo(a, 'ventilador_' + a.id);
      box(2.3, 0.16, 0.9, M.marino, 0, 0.08, 0, g, 'base');
      box(0.16, 1.45, 0.16, M.marino, -0.95, 0.88, 0, g, 'pata'); box(0.16, 1.45, 0.16, M.marino, 0.95, 0.88, 0, g, 'pata');
      cyl(1.1, 1.1, 0.7, 48, a.mat, 0, 2.15, 0, g, H2, 0, 'carcasa').geometry = new THREE.CylinderGeometry(1.1, 1.1, 0.7, 48, 1, true);
      var aro = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 8, 48), M.marino); aro.name = 'aro'; aro.position.set(0, 2.15, 0.35); g.add(aro);
      cyl(0.3, 0.3, 0.6, 24, M.marino, 0, 2.15, -0.2, g, H2, 0, 'motor');
      var aspas = new THREE.Group(); aspas.name = 'aspas'; aspas.position.set(0, 2.15, 0.14); g.add(aspas);
      cyl(0.2, 0.2, 0.2, 20, M.marino, 0, 0, 0, aspas, H2, 0, 'maza');
      for (var b = 0; b < 5; b++) { var pv = new THREE.Group(); pv.rotation.z = b * PI * 2 / 5; aspas.add(pv); var bl = box(0.34, 0.8, 0.04, M.claro, 0, 0.55, 0, pv, 'aspa'); bl.rotation.y = 0.4; }
      a.spin = aspas; a.spinK = -7;
    } else if (a.tipo === 'comp') {
      g = grupo(a, 'compresor');
      box(3, 0.25, 1.8, M.marino, 0, 0.125, 0, g, 'patin');
      cyl(0.5, 0.5, 2.7, 32, M.azul, 0, 0.78, -0.4, g, 0, H2, 'tanque');
      box(1.4, 1.3, 0.95, a.mat, -0.6, 0.9, 0.35, g, 'cuerpo');
      box(0.5, 0.25, 0.4, M.marino, -0.6, 1.68, 0.35, g, 'cabezal');
      var vol = new THREE.Group(); vol.name = 'volante'; vol.position.set(0.7, 0.95, 0.62); g.add(vol);
      cyl(0.48, 0.48, 0.12, 32, M.claro, 0, 0, 0, vol, H2, 0, 'disco');
      box(0.9, 0.12, 0.02, M.marino, 0, 0, 0.07, vol, 'rayo');
      a.spin = vol; a.spinK = 8;
    } else if (a.tipo === 'tab') {
      g = grupo(a, 'tablero');
      box(2.7, 0.12, 0.8, M.marino, 0, 0.06, 0, g, 'zoclo');
      box(2.6, 2.3, 0.7, a.mat, 0, 1.27, 0, g, 'gabinete');
      box(2.7, 0.08, 0.78, M.marino, 0, 2.46, 0, g, 'tapa');
      [-0.43, 0.43].forEach(function (x) { box(0.03, 2.1, 0.01, M.marino, x, 1.27, 0.356, g, 'junta'); });
      [-0.86, 0, 0.86].forEach(function (x) { box(0.06, 0.3, 0.04, M.claro, x + 0.3, 1.25, 0.37, g, 'manija'); var l2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), M.claro); l2.name = 'luz'; l2.position.set(x, 2.1, 0.37); g.add(l2); });
    } else if (a.tipo === 'trafo') {
      g = grupo(a, 'transformador');
      box(2.2, 0.2, 1.8, M.marino, 0, 0.1, 0, g, 'base');
      box(1.4, 1.5, 1.2, a.mat, 0, 0.95, 0, g, 'tanque');
      for (var f = 0; f < 6; f++) { box(0.06, 1.2, 0.34, M.marino, -0.55 + f * 0.22, 0.9, 0.77, g, 'aleta'); box(0.06, 1.2, 0.34, M.marino, -0.55 + f * 0.22, 0.9, -0.77, g, 'aleta'); }
      cyl(0.24, 0.24, 1.2, 24, M.azul, 0, 2.05, -0.35, g, 0, H2, 'conservador');
      box(0.08, 0.36, 0.08, M.marino, 0, 1.85, -0.35, g, 'soporte');
      [-0.4, 0, 0.4].forEach(function (x) { cyl(0.07, 0.12, 0.55, 16, M.claro, x, 1.97, 0.25, g, 0, 0, 'boquilla'); });
    }
  });

  var NA = activos.length;
  var anillos = new THREE.InstancedMesh(new THREE.RingGeometry(0.84, 1, 56), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false, side: THREE.DoubleSide }), NA);
  anillos.name = 'anillos_condicion'; anillos.material.name = 'anillo'; anillos.frustumCulled = false; anillos.renderOrder = 2;
  var puntos = new THREE.InstancedMesh(new THREE.SphereGeometry(0.28, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffffff }), NA);
  puntos.name = 'puntos_medicion'; puntos.material.name = 'punto'; puntos.frustumCulled = false;
  var tallos = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 8), new THREE.MeshBasicMaterial({ color: 0xfc9f01 }), NA);
  tallos.name = 'tallos_medicion'; tallos.material.name = 'tallo'; tallos.frustumCulled = false;
  var cBlanco = new THREE.Color(0xffffff);
  for (i = 0; i < NA; i++) { anillos.setColorAt(i, cBlanco); puntos.setColorAt(i, cBlanco); }
  [anillos, puntos, tallos].forEach(function (m) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); });

  var cv = document.createElement('canvas'); cv.width = cv.height = 128;
  var cx = cv.getContext('2d');
  cx.fillStyle = '#9aa9b4'; cx.beginPath(); cx.arc(64, 64, 58, 0, PI * 2); cx.fill();
  cx.fillStyle = '#ffffff'; cx.font = 'bold 86px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('?', 64, 70);
  var texQ = new THREE.CanvasTexture(cv);
  var matQ = new THREE.SpriteMaterial({ map: texQ, transparent: true, depthWrite: false }); matQ.name = 'pregunta';
  activos.forEach(function (a) { var sp = new THREE.Sprite(matQ); sp.name = 'pregunta'; sp.visible = false; scene.add(sp); a.q = sp; });

  /* destello de falla */
  var matFl = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, depthWrite: false }); matFl.name = 'destello';
  var bolaFl = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), matFl); bolaFl.name = 'destello'; bolaFl.visible = false; scene.add(bolaFl);
  var matFr = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }); matFr.name = 'onda';
  var aroFl = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 56), matFr); aroFl.name = 'onda'; aroFl.rotation.x = -H2; aroFl.visible = false; scene.add(aroFl);

  /* anaquel de refacciones */
  var anaquel = new THREE.Group(); anaquel.name = 'anaquel'; anaquel.position.set(-6.8, 0, -7.2); scene.add(anaquel);
  [[-1.25, -0.36], [1.25, -0.36], [-1.25, 0.36], [1.25, 0.36]].forEach(function (p) { box(0.08, 2.3, 0.08, M.marino, p[0], 1.15, p[1], anaquel, 'poste'); });
  [0.25, 1.0, 1.75].forEach(function (y) { box(2.6, 0.06, 0.8, M.claro, 0, y, 0, anaquel, 'repisa'); });
  var refac = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), M.blanco, 12); refac.name = 'cajas_refacciones';
  refac.instanceMatrix.setUsage(THREE.DynamicDrawUsage); refac.frustumCulled = false; anaquel.add(refac);
  for (i = 0; i < 12; i++) refac.setColorAt(i, new THREE.Color(i % 2 ? 0xffffff : 0xe6ecf0));

  /* hojas */
  var NH = 48;
  var hojas = new THREE.InstancedMesh(new THREE.BoxGeometry(0.75, 0.025, 0.95), M.blanco, NH); hojas.name = 'hojas';
  hojas.instanceMatrix.setUsage(THREE.DynamicDrawUsage); hojas.frustumCulled = false; scene.add(hojas);
  for (i = 0; i < NH; i++) hojas.setColorAt(i, new THREE.Color(i % 3 ? 0xc9d6df : 0x9fb3c1));
  var uDir = new THREE.Vector3(1, 0, -1).normalize();
  var anclaV = SIS.map(function () { return new THREE.Vector3(); });
  var anclaIDAP = new THREE.Vector3();
  function anclas(mv) {
    var y = mv ? 6.4 : 10.2, sp = mv ? 3.7 : 4.7;
    anclaV.forEach(function (v, j) { v.set(mv ? -1 : 0, y + (j % 2 ? -0.9 : 0.5), -2).addScaledVector(uDir, (j - 1.5) * sp); });
    anclaIDAP.set(mv ? -1 : 0, mv ? 2.8 : 10.4, -2);
  }
  anclas(false);
  var pilas = [-7.5, -2.5, 2.5, 7.5].map(function (x) { return new THREE.Vector3(x, 0, 4.45); });

  /* personas */
  function crearPersona(nombre, cuerpo, chaleco) {
    var g = new THREE.Group(); g.name = nombre; g.visible = false; scene.add(g);
    var r = new THREE.Group(); r.scale.setScalar(1.3); g.add(r);
    function piv(x, y) { var p = new THREE.Group(); p.position.set(x, y, 0); r.add(p); return p; }
    var pL = piv(-0.11, 0.86), pR = piv(0.11, 0.86);
    box(0.16, 0.84, 0.2, M.marino, 0, -0.42, 0, pL, 'pierna'); box(0.16, 0.84, 0.2, M.marino, 0, -0.42, 0, pR, 'pierna');
    box(0.46, 0.62, 0.28, cuerpo, 0, 1.17, 0, r, 'torso');
    if (chaleco) box(0.5, 0.44, 0.32, chaleco, 0, 1.2, 0, r, 'chaleco');
    var bL = piv(-0.3, 1.44), bR = piv(0.3, 1.44);
    box(0.12, 0.6, 0.14, cuerpo, 0, -0.3, 0, bL, 'brazo'); box(0.12, 0.6, 0.14, cuerpo, 0, -0.3, 0, bR, 'brazo');
    var cab = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), M.cabeza); cab.name = 'cabeza'; cab.position.y = 1.64; r.add(cab);
    var cas = new THREE.Mesh(new THREE.SphereGeometry(0.175, 16, 8, 0, PI * 2, 0, H2), M.casco); cas.name = 'casco'; cas.position.y = 1.68; r.add(cas);
    return { g: g, pL: pL, pR: pR, bL: bL, bR: bR };
  }
  var tec1 = crearPersona('tecnico_correctivo', M.azul);
  box(0.38, 0.24, 0.18, M.rojo, 0, -0.66, 0.02, tec1.bR, 'caja_herramientas');
  var tecA = crearPersona('tecnico_a', M.azul), tecB = crearPersona('tecnico_b', M.azul);
  box(0.2, 0.26, 0.04, M.marino, 0, -0.56, 0.1, tecA.bL, 'colector'); box(0.2, 0.26, 0.04, M.marino, 0, -0.56, 0.1, tecB.bL, 'colector');
  var analista = crearPersona('analista', M.marino, M.naranja);
  box(0.2, 0.26, 0.04, M.naranja, 0, -0.56, 0.1, analista.bL, 'colector');

  function ruta(pts) {
    var seg = [], Lt = 0;
    for (var n = 1; n < pts.length; n++) { var dx = pts[n][0] - pts[n - 1][0], dz = pts[n][1] - pts[n - 1][1], l = Math.sqrt(dx * dx + dz * dz); seg.push({ a: pts[n - 1], dx: dx, dz: dz, l: l, L0: Lt }); Lt += l; }
    return function (u) {
      var d = clamp(u, 0, 1) * Lt;
      for (var n = 0; n < seg.length; n++) { var sg = seg[n]; if (d <= sg.L0 + sg.l || n === seg.length - 1) { var f = sg.l ? (d - sg.L0) / sg.l : 0; return { x: sg.a[0] + sg.dx * f, z: sg.a[1] + sg.dz * f, h: Math.atan2(sg.dx, sg.dz) }; } }
    };
  }
  function posar(p, x, z, h, fase, amp) {
    p.g.visible = true; p.g.position.set(x, Math.abs(Math.sin(fase)) * 0.06 * amp, z); p.g.rotation.y = h;
    var sn = Math.sin(fase) * amp;
    p.pL.rotation.x = sn; p.pR.rotation.x = -sn; p.bL.rotation.x = -sn * 0.8; p.bR.rotation.x = sn * 0.8;
  }
  function caminar(p, r, t0, t1, t, frec, amp) {
    var q = r(lin(t0, t1, t)), mv = t > t0 && t < t1;
    posar(p, q.x, q.z, q.h, mv ? (t - t0) * frec : 0, mv ? amp : 0);
    return q;
  }
  var r1 = ruta([[-19.5, -0.6], [-6.4, -0.6], [-4.4, -1.8]]);
  var rA1 = ruta([[-19.5, -0.6], [-10.6, -0.6], [-9, -1.8]]), rA2 = ruta([[-9, -1.8], [-5.8, -0.6], [-4.2, -1.8]]);
  var rB1 = ruta([[-19.5, -5.8], [-17.4, -9.0]]), rB2 = ruta([[-17.4, -9.0], [-15.6, -6.4], [-12.6, -6.3]]);
  var rAn = ruta([[20.5, 5.8], [-15.3, 5.8], [-15.3, -6.3], [19.5, -6.3]]);
  var AN0 = 12.6, AN1 = 15.4;
  var AM = new THREE.Color(0xf5c542), VE = new THREE.Color(0x10b981), RO = new THREE.Color(0xef4444);
  activos.forEach(function (a) {
    var best = 1e9, bu = 0;
    for (var n = 0; n <= 400; n++) { var q = rAn(n / 400), d = (q.x - a.x) * (q.x - a.x) + (q.z - a.z) * (q.z - a.z); if (d < best) { best = d; bu = n / 400; } }
    a.rev = AN0 + bu * (AN1 - AN0) + 0.05;
    a.sem = a.esRojo ? RO : (a.id === 'f1' || a.id === 'c') ? AM : VE;
  });

  /* ---------- estado por tiempo ---------- */
  var COL = { azul: new THREE.Color(0x2b5671), gris: new THREE.Color(0x9aa9b4), rojo: RO, calido: new THREE.Color(0xf07a2e), naranja: new THREE.Color(0xfc9f01), amarillo: AM, verde: VE };
  var cT = new THREE.Color(), cA = new THREE.Color(), vA = new THREE.Vector3(), mM = new THREE.Matrix4(), qE = new THREE.Euler();
  var T_FALLA = 7, T_RESET = 12.25;

  function colorCuerpo(a, t, out) {
    out.copy(COL.azul);
    if (modo === 'sin') {
      if (a.id === 'm1' && t < T_RESET) {
        if (t < T_FALLA) out.lerp(COL.calido, 0.85 * s01(3, 7, t));
        else out.copy(COL.rojo);
      }
    } else {
      var g = s01(3.2, 3.8, t);
      if (a.med != null) g *= 1 - s01(a.med, a.med + 0.3, t);
      g *= 1 - s01(a.rev, a.rev + 0.25, t);
      out.lerp(COL.gris, g);
      if (a.esRojo) out.lerp(COL.rojo, s01(10, 12, t) * (0.82 + 0.18 * Math.sin(t * 5)));
    }
    return out;
  }
  function fijarCaja(i, p, lift, ry) {
    var sc = Math.min(s01(0, 0.5, p), s01(BL, BL - 0.5, p));
    mM.makeRotationY(ry); mM.scale(vA.set(sc || 1e-4, sc || 1e-4, sc || 1e-4)); mM.setPosition(BX0 + p, BY + 0.36 + lift, BZ + cajaJit[i]);
    cajas.setMatrixAt(i, mM);
  }

  function actualizar(t, time) {
    var sin = modo === 'sin';
    var parado = sin && t >= T_FALLA && t < T_RESET;
    var v = 2.2, tau = t - T_FALLA, sB;
    var desliz = tau < 0.35 ? tau - tau * tau / 0.7 : 0.175;
    sB = parado ? v * T_FALLA + v * desliz : v * t;
    for (var k = 0; k < NL; k++) { mM.makeTranslation(BX0 + mod(k + sB, BL), BY + 0.007, BZ); listones.setMatrixAt(k, mM); }
    listones.instanceMatrix.needsUpdate = true;
    var sp = BL / NC, stopP = 15, i;
    if (!parado) { for (i = 0; i < NC; i++) fijarCaja(i, mod(i * sp + v * t, BL), 0, 0); }
    else {
      var antes = [];
      for (i = 0; i < NC; i++) { var p0 = mod(i * sp + v * T_FALLA, BL); if (p0 >= stopP) fijarCaja(i, p0 + v * desliz, 0, 0); else antes.push({ i: i, p0: p0 }); }
      antes.sort(function (a, b) { return b.p0 - a.p0; });
      antes.forEach(function (b, n) {
        var capa2 = 0, j = 0;
        if (n > 0) { if (n % 2) j = (n + 1) / 2; else { capa2 = 1; j = n / 2 - 1; } }
        var slot = stopP - (capa2 ? 0.8 : 0.4) - j * 0.78;
        var p = Math.min(b.p0 + v * tau, slot);
        fijarCaja(b.i, p, capa2 ? s01(slot - 0.9, slot, p) * 0.72 : 0, capa2 ? (j % 2 ? 0.28 : -0.22) : (n % 3 - 1) * 0.08);
      });
    }
    cajas.instanceMatrix.needsUpdate = true;

    var w = 10;
    GMB.lista.forEach(function (a, n) {
      var s = a.extra ? (sin ? 0 : pop(a.ap, t)) : 1, dx = 0, dy = 0, dz = 0;
      if (sin && a.id === 'm1' && t >= 3 && t < T_FALLA) { var amp = 0.012 + 0.05 * s01(3, 7, t); dx = amp * Math.sin(t * 83); dy = amp * 0.6 * Math.sin(t * 67 + 1); dz = amp * Math.sin(t * 71 + 2); }
      var ang = (sin && a.id === 'm1' && t >= T_FALLA && t < T_RESET) ? w * T_FALLA + 0.3 : w * t + n;
      fijarInst(GMB, a.k, a.x + dx, dy, a.z + dz, s, ang);
      GMB.colorIm.setColorAt(a.k, colorCuerpo(a, t, cT));
    });
    GTK.lista.forEach(function (a) { fijarInst(GTK, a.k, a.x, 0, a.z, sin ? 0 : pop(a.ap, t), 0); GTK.colorIm.setColorAt(a.k, colorCuerpo(a, t, cT)); });
    [GMB, GTK].forEach(function (g) { g.partes.forEach(function (p) { p.im.instanceMatrix.needsUpdate = true; }); g.colorIm.instanceColor.needsUpdate = true; });
    activos.forEach(function (a) { if (a.mat) a.mat.color.copy(colorCuerpo(a, t, cT)); if (a.spin) a.spin.rotation.z = t * a.spinK; });

    activos.forEach(function (a) {
      var rs = 0; cA.copy(COL.verde);
      if (sin) { if (a.id === 'm1' && t >= 13.6) { rs = pop(13.6, t) * (1 + 0.07 * Math.sin(t * 5)); cA.copy(COL.amarillo); } }
      else {
        if (a.med != null && t >= a.med) rs = pop(a.med, t);
        if (t >= a.rev) { rs = Math.max(rs, pop(a.rev, t)); cA.copy(a.sem); if (a.esRojo) rs *= 1 + 0.08 * Math.sin(t * 6); }
      }
      var R = a.r * rs || 1e-4;
      mM.makeRotationX(-H2); mM.scale(vA.set(R, R, R)); mM.setPosition(a.x, 0.03, a.z);
      anillos.setMatrixAt(a.i, mM); anillos.setColorAt(a.i, cA);
      var ps = (sin && t >= T_RESET && !a.extra) ? pop(12.7 + a.i * 0.1, t) : 0;
      cA.copy(COL.naranja); if (a.id === 'm1') cA.lerp(COL.amarillo, s01(13.4, 13.7, t));
      var ph = 0.62;
      mM.makeScale(ps || 1e-4, ps || 1e-4, ps || 1e-4); mM.setPosition(a.x, a.top + ph, a.z); puntos.setMatrixAt(a.i, mM); puntos.setColorAt(a.i, cA);
      mM.makeScale(ps || 1e-4, ph * (ps || 1e-4), ps || 1e-4); mM.setPosition(a.x, a.top + ph / 2, a.z); tallos.setMatrixAt(a.i, mM);
      var q = 0;
      if (!sin && t >= 3.5 && t < a.rev && !(a.med != null && t >= a.med)) q = pop(3.5 + (a.i % 9) * 0.05, t);
      a.q.visible = q > 0.01; a.q.scale.setScalar(1.1 * q); a.q.position.set(a.x, a.top + 0.9 + 0.08 * Math.sin(time * 2 + a.i), a.z);
    });
    [anillos, puntos, tallos].forEach(function (m) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; });

    var m1 = activos[1];
    var uF = lin(T_FALLA, T_FALLA + 0.65, t), fl = sin && t >= T_FALLA && uF < 1;
    bolaFl.visible = aroFl.visible = fl;
    if (fl) {
      bolaFl.position.set(m1.x, 0.8, m1.z); bolaFl.scale.setScalar(0.6 + 3 * uF); matFl.opacity = 0.55 * (1 - uF);
      aroFl.position.set(m1.x, 0.05, m1.z); aroFl.scale.setScalar(1 + 5 * uF); matFr.opacity = 1 - uF;
    }
    destello.style.opacity = sin && t >= T_FALLA && t < T_FALLA + 0.9 ? String((1 - lin(T_FALLA, T_FALLA + 0.9, t))) : '0';

    var va = sin && t >= 8.6 && t < T_RESET;
    anaquel.visible = va;
    if (va) {
      anaquel.scale.setScalar(pop(8.6, t) || 1e-4);
      for (i = 0; i < 12; i++) { var s2 = pop(9.2 + i * 0.2, t) || 1e-4, lv = Math.floor(i / 4); mM.makeScale(s2, s2, s2); mM.setPosition(-0.9 + (i % 4) * 0.6, [0.25, 1.0, 1.75][lv] + 0.28, 0); refac.setMatrixAt(i, mM); }
      refac.instanceMatrix.needsUpdate = true;
    }

    tec1.g.visible = tecA.g.visible = tecB.g.visible = analista.g.visible = false;
    if (sin && t >= 8.4 && t < T_RESET) {
      if (t < 10.1) caminar(tec1, r1, 8.4, 10.1, t, 16, 0.75);
      else { posar(tec1, -4.4, -1.8, PI, 0, 0); tec1.bR.rotation.x = -0.9 + 0.35 * Math.sin(t * 9); tec1.bL.rotation.x = -0.5; }
    }
    if (!sin && t >= 3) {
      if (t < 4.6) caminar(tecA, rA1, 3, 4.6, t, 11, 0.6);
      else if (t < 5.2) { posar(tecA, -9, -1.8, PI, 0, 0); tecA.bL.rotation.x = -1.2; }
      else if (t < 6.3) caminar(tecA, rA2, 5.2, 6.3, t, 11, 0.6);
      else { posar(tecA, -4.2, -1.8, PI, 0, 0); tecA.bL.rotation.x = t < 7.2 ? -1.2 : -0.2; }
      if (t < 4.2) caminar(tecB, rB1, 3, 4.2, t, 11, 0.6);
      else if (t < 5.2) { posar(tecB, -17.4, -9.0, PI, 0, 0); tecB.bL.rotation.x = -1.2; }
      else if (t < 7.5) caminar(tecB, rB2, 5.2, 7.5, t, 8, 0.5);
      else posar(tecB, -12.6, -6.3, H2, 0, 0);
    }
    if (!sin && t >= AN0) caminar(analista, rAn, AN0, AN1, t, 26, 0.9);

    for (k = 0; k < NH; k++) {
      var j = Math.floor(k / 12), m = k % 12, tL = 8.2 + m * 0.28 + j * 0.07, tC = 12.9 + k * 0.018, sc = 1;
      if (sin || t < tL) { mM.makeScale(1e-4, 1e-4, 1e-4); hojas.setMatrixAt(k, mM); continue; }
      var fin = vA.copy(pilas[j]); fin.y = 0.03 + m * 0.032;
      var px, py, pz, rx = 0, ry = ((k * 29) % 13 - 6) * 0.05, u;
      if (t < tC) {
        u = s01(tL, tL + 0.9, t); var o = anclaV[j];
        px = o.x + (fin.x - o.x) * u; py = o.y + (fin.y - o.y) * u + Math.sin(u * PI) * 1.2; pz = o.z + (fin.z - o.z) * u;
        rx = Math.sin(u * PI) * 0.7; ry += (1 - u) * 5;
        sc = 0.5 + 0.5 * s01(0, 0.2, u);
      } else {
        u = s01(tC, tC + 0.7, t);
        px = fin.x + (anclaIDAP.x - fin.x) * u; py = fin.y + (anclaIDAP.y - fin.y) * u + Math.sin(u * PI) * 1.5; pz = fin.z + (anclaIDAP.z - fin.z) * u;
        rx = Math.sin(u * PI) * 0.8; sc = 1 - s01(0.55, 1, u);
      }
      qE.set(rx, ry, 0); mM.makeRotationFromEuler(qE); mM.scale(vA.set(sc || 1e-4, sc || 1e-4, sc || 1e-4)); mM.setPosition(px, py, pz);
      hojas.setMatrixAt(k, mM);
    }
    hojas.instanceMatrix.needsUpdate = true;

    var vel = 0;
    var D = durModo(); if (t > D - 0.25) vel = s01(D - 0.25, D, t); else if (t < 0.25) vel = 1 - s01(0, 0.25, t);
    if (sin && t > 11.95 && t < 12.55) vel = Math.max(vel, t < T_RESET ? s01(11.95, T_RESET, t) : 1 - s01(T_RESET, 12.55, t));
    return vel;
  }

  /* ---------- etiquetas HTML ---------- */
  var leyActual = null, leyTimer = 0;
  function fijarLeyenda(txt) {
    if (txt === leyActual) return;
    leyActual = txt; clearTimeout(leyTimer);
    if (reducido) { leyenda.textContent = txt; leyenda.style.opacity = txt ? '1' : '0'; return; }
    leyenda.style.opacity = '0';
    leyTimer = setTimeout(function () { leyenda.textContent = txt; leyenda.style.opacity = txt ? '1' : '0'; }, 180);
  }
  var vP = new THREE.Vector3(), W = 1, H = 1, movil = false;
  function colocar(e, pos, op, dy, esc) {
    if (op <= 0.01) { if (e.style.display !== 'none') e.style.display = 'none'; return; }
    vP.copy(pos).project(cam);
    var x = (vP.x + 1) / 2 * W, y = (1 - vP.y) / 2 * H + (dy || 0);
    e.style.display = 'flex';
    e.style.opacity = String(op);
    e.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-100%) scale(' + (esc == null ? 1 : esc) + ')';
  }
  var vB = new THREE.Vector3();
  function etiquetas(t, time) {
    var sin = modo === 'sin';
    var enMarcha = !sin || t < T_FALLA || t >= T_RESET;
    contador.style.opacity = sin ? '1' : '0';
    contTxt.textContent = enMarcha ? 'Producción en marcha' : 'Línea parada';
    contPunto.style.background = enMarcha ? '#10b981' : '#ef4444';
    contador.style.borderColor = enMarcha ? '#d9e2e8' : '#ef4444';
    var txt = '';
    if (sin) { if (t >= 3.2 && t < T_FALLA) txt = 'La falla ya empezó y nadie lo sabe'; else if (t >= 8.4 && t < T_RESET) txt = 'Correctivo de emergencia'; else if (t >= T_RESET) txt = 'Con predictivo, lo ves semanas antes'; }
    else { if (t < 7.5) txt = 'Cientos de activos'; else if (t < 12.5) txt = 'Muchos datos, ninguna decisión'; else txt = 'Nosotros ponemos la capacidad'; }
    fijarLeyenda(txt);

    ventanas.forEach(function (vn, j) {
      var a0 = 7.6 + j * 0.2, op = sin ? 0 : s01(a0, a0 + 0.3, t) * (1 - s01(12.6, 13.0, t));
      colocar(vn.el, anclaV[j], op, reducido ? 0 : Math.sin(time * 1.6 + j * 1.3) * 4, 0.92 + 0.08 * op);
      if (op > 0) {
        vn.el.style.display = 'block';
        var n = clamp(Math.floor((t - a0 - 0.3) * 2.4 + 1 + j), 0, 99);
        vn.badge.textContent = String(n); vn.badge.style.display = n ? 'flex' : 'none';
        var fs = Math.min(4, Math.ceil(n / 2.5));
        vn.filas.forEach(function (f, r) { f.style.display = r < fs ? 'flex' : 'none'; });
      }
    });
    var oi = sin ? 0 : s01(13.4, 13.8, t);
    if (oi <= 0.01) idap.style.display = 'none'; else { idap.style.display = 'block'; idap.style.opacity = String(oi); idap.style.transform = 'translateY(' + ((1 - oi) * -10).toFixed(1) + 'px)'; }
    if (oi > 0) { idapFilas.forEach(function (f, r) { f.style.opacity = String(s01(14 + r * 0.3, 14.25 + r * 0.3, t)); });
      var pp = lin(13.6, 15.4, t); pie.style.opacity = String(s01(13.6, 13.9, t));
      circP.setAttribute('stroke-dasharray', (pp * CIRC).toFixed(2) + ' ' + CIRC.toFixed(2)); piePct.textContent = Math.round(pp * 100) + '%'; }
    var orl = sin ? 0 : s01(3, 3.3, t) * (1 - s01(10.2, 10.6, t)), pr = lin(3, 7.5, t);
    colocar(reloj, vB.set(movil ? 9 : 15, 4.2, movil ? 3 : 1), orl);
    if (orl > 0) {
      aguja.style.transform = 'rotate(' + (pr * 360).toFixed(1) + 'deg)';
      arco.style.background = 'conic-gradient(' + (pr >= 1 ? 'rgba(239,68,68,.35)' : 'rgba(245,197,66,.5)') + ' ' + (pr * 360).toFixed(1) + 'deg, transparent 0)';
      cara.style.borderColor = pr >= 1 ? '#ef4444' : '#002e46';
      relTxt.style.opacity = pr >= 1 ? '1' : '0';
    }
    var m1a = activos[1];
    var ocs = sin ? s01(7.3, 7.6, t) * (1 - s01(11.8, 12.1, t)) : 0;
    colocar(costo, vB.set(m1a.x - 2.5, 5.2, m1a.z - 3), ocs, 0, 0.94 + 0.06 * ocs);
    if (ocs > 0) {
      var ct = lin(7.3, 11.8, t), monto = Math.round((18000 * ct + 142000 * ct * ct) / 100) * 100;
      costoMonto.textContent = '$' + monto.toLocaleString('es-MX');
      costoFill.style.width = (ct * 100).toFixed(1) + '%';
      costoItems.forEach(function (r, n) { r.style.opacity = String(s01(7.8 + n * 1.1, 8.1 + n * 1.1, t)); });
    }
    var oav = sin ? s01(13.8, 14.1, t) : 0;
    colocar(aviso, vB.set(m1a.x, m1a.top + 1.25, m1a.z), oav, 0, 0.9 + 0.1 * oav);
    var oc = sin ? 0 : s01(15, 15.3, t);
    colocar(chipA, vB.copy(tecA.g.position).setY(2.9), oc);
    colocar(chipB, vB.copy(tecB.g.position).setY(2.9), oc);
  }

  /* ---------- cámara y tamaño ---------- */
  var objetivo = new THREE.Vector3();
  function camara(time) {
    var az = (45 + (reducido ? 0 : 0.9 * Math.sin(time * 0.35))) * PI / 180;
    var elv = (33 + (reducido ? 0 : 0.35 * Math.sin(time * 0.27))) * PI / 180;
    cam.position.set(objetivo.x + Math.sin(az) * Math.cos(elv) * 120, objetivo.y + Math.sin(elv) * 120, objetivo.z + Math.cos(az) * Math.cos(elv) * 120);
    cam.lookAt(objetivo);
    cam.updateMatrixWorld();
  }
  function ajustar() {
    W = Math.max(1, Math.round(container.clientWidth));
    movil = W < 640;
    H = Math.round(movil ? W * 1.05 : W * 9 / 16);
    escenario.style.height = H + 'px';
    renderer.setSize(W, H, false);
    var hh = movil ? 10.8 : 14.6, asp = W / H;
    cam.left = -hh * asp; cam.right = hh * asp; cam.top = hh; cam.bottom = -hh; cam.updateProjectionMatrix();
    anclas(movil);
    objetivo.set(movil ? -0.5 : 0, movil ? 2.2 : 2.4, 0);
    kEsc = clamp(W / 1100, movil ? 0.72 : 0.7, 1.1);
    raiz.style.setProperty('--k', clamp(W / 1100, movil ? 0.72 : 0.7, 1.1).toFixed(3));
    if (movil) leyenda.style.cssText = 'transition:opacity .18s;font-weight:600;text-wrap:pretty;position:static;margin-top:14px;font-size:21px;line-height:1.25;min-height:2.6em;color:#002e46;opacity:' + leyenda.style.opacity + ';';
    else leyenda.style.cssText = 'transition:opacity .18s;font-weight:600;text-wrap:pretty;position:absolute;left:calc(18px*var(--k));bottom:calc(18px*var(--k));max-width:60%;font-size:calc(26px*var(--k));line-height:1.2;background:rgba(255,255,255,.94);border:1px solid #d9e2e8;padding:.45em .75em;border-radius:10px;color:#002e46;opacity:' + leyenda.style.opacity + ';';
    sucio = true;
  }

  /* ---------- bucle ---------- */
  var raf = 0, t0 = performance.now() - (opciones.inicio > 0 ? opciones.inicio * 1000 : 0), trans = null, sucio = true, enVista = true;
  var kEsc = 1, rA = new THREE.Vector3(), rB = new THREE.Vector3();
  function anclarIDAP() {
    var px = W - (14 + 135) * kEsc, py = (14 + 70) * kEsc;
    var nx = px / W * 2 - 1, ny = 1 - py / H * 2;
    rA.set(nx, ny, -1).unproject(cam); rB.set(nx, ny, 1).unproject(cam);
    var f = (8 - rA.y) / (rB.y - rA.y);
    anclaIDAP.copy(rA).lerp(rB, f);
  }
  function pintar(t, time, veloExtra) {
    camara(time);
    anclarIDAP();
    var vel = actualizar(t, time);
    renderer.render(scene, cam);
    etiquetas(t, time);
    velo.style.opacity = String(Math.max(vel, veloExtra || 0));
  }
  function cuadro(now) {
    raf = requestAnimationFrame(cuadro);
    if (reducido) { if (sucio) { sucio = false; pintar(modo === 'sin' ? 15 : 19, 0, 0); } return; }
    if (!enVista) return;
    var vx = 0;
    if (trans) { var p = (now - trans.inicio) / 250; if (p >= 1) { modo = trans.modo; t0 = now; trans = null; } else vx = s01(0, 1, p); }
    pintar(((now - t0) / 1000) % durModo(), now / 1000, vx);
  }
  var rzRaf = 0, anchoPrevio = -1;
  var ro = new ResizeObserver(function () { cancelAnimationFrame(rzRaf); rzRaf = requestAnimationFrame(function () { var w = Math.round(container.clientWidth); if (w !== anchoPrevio) { anchoPrevio = w; ajustar(); } }); });
  ro.observe(container);
  var io = window.IntersectionObserver ? new IntersectionObserver(function (e) { var u = e[e.length - 1]; enVista = u.isIntersecting || u.boundingClientRect.height === 0; }, { rootMargin: '150px' }) : null;
  if (io) io.observe(escenario);
  function alCambiarMovimiento(e) { reducido = e.matches; sucio = true; t0 = performance.now(); }
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', alCambiarMovimiento); else if (mq.addListener) mq.addListener(alCambiarMovimiento); }
  ajustar();
  raf = requestAnimationFrame(cuadro);

  function limpiar() {
    cancelAnimationFrame(raf); cancelAnimationFrame(rzRaf); ro.disconnect(); if (io) io.disconnect(); clearTimeout(leyTimer);
    if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', alCambiarMovimiento); else if (mq.removeListener) mq.removeListener(alCambiarMovimiento); }
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      if (o.isInstancedMesh && typeof o.dispose === 'function') o.dispose();
    });
    texQ.dispose(); renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (raiz.parentNode) raiz.parentNode.removeChild(raiz);
  }
  limpiar.modo = function (nuevo) {
    nuevo = nuevo === 'con' ? 'con' : 'sin';
    if (reducido) { modo = nuevo; sucio = true; return; }
    if (nuevo === modo && !trans) { return; }
    trans = { inicio: performance.now(), modo: nuevo };
  };
  return limpiar;
}
