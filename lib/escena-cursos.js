/**
 * Escena "Cursos DIAPSA": del aula a la planta y a la certificación. Casos
 * reales en la pantalla del aula, los participantes midiendo un motor con
 * vibraciones, termografía y ultrasonido, la falla del rodamiento y las
 * credenciales de categoría con el sello de especialistas capacitados.
 *
 * Generada en Claude Diseño (docs/designs/cursos-escena.html) y portada
 * como las demás escenas: recibe THREE y el contenedor y devuelve la
 * limpieza, con limpiar.irA(segundo). Trae su propio acomodo compacto para
 * pantallas angostas.
 */
/* eslint-disable */
export function montarEscenaCursos(THREE, container) {
  var REV = parseInt(String(THREE.REVISION), 10) || 128;
  var W = 720, H = 540, CICLO = 16, PI = Math.PI;
  var FONT = '"Segoe UI", "Helvetica Neue", Helvetica, system-ui, -apple-system, sans-serif';
  var LUZ = REV >= 155 ? PI : 1; // luces físicas por defecto desde r155
  var TITULOS = ['En el aula, con casos reales', 'En planta, con el equipo en la mano', 'Encontrar la falla', 'Certificación'];

  /* ---------- estilos ---------- */
  var CSS = [
    '.ecur-root{position:relative;width:100%;font-family:' + FONT + ';color:#002e46;-webkit-font-smoothing:antialiased;line-height:1.25}',
    '.ecur-root *{box-sizing:border-box}',
    '.ecur-frame{position:relative;width:100%;height:0;padding-top:75%;overflow:hidden;border-radius:6px;background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%)}',
    '.ecur-stage{position:absolute;left:0;top:0;width:720px;height:540px;transform-origin:0 0}',
    '.ecur-canvas{position:absolute;left:0;top:0;display:block}',
    '.ecur-lines{position:absolute;left:0;top:0;width:720px;height:540px;pointer-events:none;overflow:visible}',
    '.ecur-head{position:absolute;left:28px;top:24px;max-width:340px;pointer-events:none}',
    '.ecur-title{margin:0;font-size:23px;line-height:1.2;font-weight:700;letter-spacing:-.01em;color:#002e46;text-wrap:balance}',
    '.ecur-bars{display:flex;gap:6px;margin-top:12px}',
    '.ecur-bar{width:46px;height:4px;border-radius:2px;background:#d9e2e8}',
    '.ecur-bar.ecur-past{background:#002e46}.ecur-bar.ecur-now{background:#fc9f01}',
    '.ecur-tag{position:absolute;left:0;top:0;display:flex;align-items:center;gap:7px;padding:6px 10px;background:#fff;border:1px solid #d9e2e8;border-radius:4px;box-shadow:0 4px 14px rgba(0,46,70,.12);font-size:13px;font-weight:600;white-space:nowrap;color:#002e46;opacity:0;visibility:hidden}',
    '.ecur-tag i{display:block;width:7px;height:7px;border-radius:50%;background:#fc9f01;flex:none}',
    '.ecur-stem{position:absolute;left:0;top:0;width:1.5px;background:#2b5671;opacity:0;visibility:hidden}',
    '.ecur-pin{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:#fff;border:2px solid #002e46;opacity:0;visibility:hidden}',
    '.ecur-panel{position:absolute;right:24px;top:26px;width:244px;display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:#fff;border-top:3px solid #fc9f01;border-radius:4px;box-shadow:0 10px 30px rgba(0,46,70,.16);opacity:0;visibility:hidden}',
    '.ecur-panel svg{flex:none;display:block}',
    '.ecur-plabel{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#2b5671}',
    '.ecur-pval{margin-top:3px;font-size:17px;font-weight:700;color:#002e46;line-height:1.2}',
    '.ecur-cred{position:absolute;left:0;top:0;width:96px;height:62px;perspective:420px;opacity:0;visibility:hidden}',
    '.ecur-cred-in{position:relative;width:100%;height:100%;transform-style:preserve-3d}',
    '.ecur-cred-f,.ecur-cred-b{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:5px;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:0 6px 16px rgba(0,46,70,.16)}',
    '.ecur-cred-f{background:#fff;border:1px solid #d9e2e8;border-top:4px solid #2b5671;padding:7px 9px;display:flex;flex-direction:column;justify-content:center}',
    '.ecur-cred-f.ecur-alt{border-top-color:#fc9f01}',
    '.ecur-cred-f b{font-size:14px;font-weight:700;color:#002e46;white-space:nowrap}',
    '.ecur-cred-f span{margin-top:3px;font-size:11px;font-weight:600;color:#2b5671;letter-spacing:.04em}',
    '.ecur-cred-b{background:#002e46;transform:rotateY(180deg);display:flex;align-items:center;justify-content:center}',
    '.ecur-cred-b i{display:block;width:22px;height:22px;border-radius:50%;border:3px solid #fc9f01}',
    '.ecur-stamp{position:absolute;left:560px;top:26px;width:136px;height:136px;border-radius:50%;background:#fff;border:3px solid #fc9f01;box-shadow:0 10px 26px rgba(0,46,70,.16);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0;visibility:hidden}',
    '.ecur-stamp:after{content:"";position:absolute;left:7px;top:7px;right:7px;bottom:7px;border:1px dashed #2b5671;border-radius:50%}',
    '.ecur-stamp b{font-size:30px;font-weight:800;line-height:1;color:#002e46;letter-spacing:-.02em}',
    '.ecur-stamp span{margin-top:5px;max-width:92px;font-size:12px;font-weight:600;line-height:1.2;color:#2b5671}',
    '.ecur-note{position:absolute;right:16px;bottom:12px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#2b5671}',
    '.ecur-veil{position:absolute;left:0;top:0;width:720px;height:540px;background:#f3f5f7;opacity:0;pointer-events:none}',
    '.ecur-col{display:none}',
    '.ecur-compact .ecur-head,.ecur-compact .ecur-tag,.ecur-compact .ecur-stem,.ecur-compact .ecur-pin,.ecur-compact .ecur-panel,.ecur-compact .ecur-cred,.ecur-compact .ecur-stamp,.ecur-compact .ecur-lines,.ecur-compact .ecur-note{display:none}',
    '.ecur-compact .ecur-col{display:block;padding:14px 2px 0}',
    '.ecur-col-title{margin:0;font-size:20px;font-weight:700;line-height:1.2;color:#002e46}',
    '.ecur-col .ecur-bar{flex:1;width:auto}',
    '.ecur-col-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;min-height:80px;align-content:flex-start}',
    '.ecur-chip{display:none;align-items:center;gap:8px;padding:7px 11px;font-size:15px;font-weight:600;white-space:nowrap;color:#002e46;background:#fff;border:1px solid #d9e2e8;border-radius:4px}',
    '.ecur-chip i{display:block;width:8px;height:8px;border-radius:50%;background:#fc9f01}',
    '.ecur-chip.ecur-on{display:flex}',
    '.ecur-chip.ecur-strong{border:2px solid #fc9f01}',
    '.ecur-col-note{margin-top:10px;font-size:12px;color:#2b5671}'
  ].join('\n');
  var styleEl = document.getElementById('ecur-styles');
  if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'ecur-styles'; styleEl.textContent = CSS; document.head.appendChild(styleEl); styleEl._ecurRefs = 0; }
  styleEl._ecurRefs = (styleEl._ecurRefs || 0) + 1;

  /* ---------- DOM ---------- */
  function el(tag, cls, parent, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  var root = el('div', 'ecur-root', container);
  var frame = el('div', 'ecur-frame', root);
  var stage = el('div', 'ecur-stage', frame);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  if (REV >= 152) { if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace; }
  else if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.domElement.className = 'ecur-canvas';
  stage.appendChild(renderer.domElement);

  var SVGNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'ecur-lines'); svg.setAttribute('viewBox', '0 0 720 540'); stage.appendChild(svg);
  var leader = document.createElementNS(SVGNS, 'line'); leader.setAttribute('stroke', '#2b5671'); leader.setAttribute('stroke-width', '1.5'); leader.setAttribute('stroke-dasharray', '4 4'); svg.appendChild(leader);
  var ring = document.createElementNS(SVGNS, 'circle'); ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', '#fc9f01'); ring.setAttribute('stroke-width', '2'); svg.appendChild(ring);

  var head = el('div', 'ecur-head', stage);
  var titleEl = el('h3', 'ecur-title', head, TITULOS[0]);
  var barsBox = el('div', 'ecur-bars', head);
  var bars = [0, 1, 2, 3].map(function () { return el('span', 'ecur-bar', barsBox); });

  function mkTag(text) {
    return { el: el('div', 'ecur-tag', stage, '<i></i>' + text), stem: el('div', 'ecur-stem', stage), pin: el('div', 'ecur-pin', stage), w: 0, h: 0, op: 0, ax: 0, ay: 0, lift: 30 };
  }
  var tagCaso = mkTag('Casos de equipos inspeccionados');
  var tagVib = mkTag('Vibraciones'), tagTer = mkTag('Termografía'), tagUlt = mkTag('Ultrasonido');

  var panel = el('div', 'ecur-panel', stage,
    '<svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="16" fill="#fc9f01"/><path class="ecur-check" d="M10 17.5l4.6 4.6L24.5 12" fill="none" stroke="#002e46" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="22" stroke-dashoffset="22"/></svg>' +
    '<div><div class="ecur-plabel">Diagnóstico:</div><div class="ecur-pval">rodamiento, pista externa</div></div>');
  var checkPath = panel.querySelector('.ecur-check');

  var CATS = ['Categoría I', 'Categoría II', 'Categoría I'];
  var creds = CATS.map(function (c, i) {
    var d = el('div', 'ecur-cred', stage,
      '<div class="ecur-cred-in"><div class="ecur-cred-f' + (i === 1 ? ' ecur-alt' : '') + '"><b>' + c + '</b><span>ISO 18436</span></div><div class="ecur-cred-b"><i></i></div></div>');
    return { el: d, inner: d.firstChild, f: d.querySelector('.ecur-cred-f'), b: d.querySelector('.ecur-cred-b') };
  });
  var stamp = el('div', 'ecur-stamp', stage, '<b>+3,000</b><span>especialistas capacitados</span>');
  el('div', 'ecur-note', stage, 'Datos simulados');
  var veil = el('div', 'ecur-veil', stage);

  var col = el('div', 'ecur-col', root);
  var colTitle = el('h3', 'ecur-col-title', col, TITULOS[0]);
  var colBarsBox = el('div', 'ecur-bars', col);
  var colBars = [0, 1, 2, 3].map(function () { return el('span', 'ecur-bar', colBarsBox); });
  var colList = el('div', 'ecur-col-list', col);
  function chip(t, strong) { return el('span', 'ecur-chip' + (strong ? ' ecur-strong' : ''), colList, '<i></i>' + t); }
  var chips = {
    caso: chip('Casos de equipos inspeccionados'),
    vib: chip('Vibraciones'), ter: chip('Termografía'), ult: chip('Ultrasonido'),
    diag: chip('Diagnóstico: rodamiento, pista externa', true),
    c0: chip('Categoría I'), c1: chip('Categoría II'), c2: chip('Categoría I'), iso: chip('ISO 18436'),
    sello: chip('+3,000 especialistas capacitados', true)
  };
  el('div', 'ecur-col-note', col, 'Datos simulados');

  /* ---------- escena ---------- */
  var scene = new THREE.Scene();
  function C(hex) { var c = new THREE.Color(hex); if (REV < 152 && c.convertSRGBToLinear) c.convertSRGBToLinear(); return c; }
  function mat(name, hex, rough, metal) { var m = new THREE.MeshStandardMaterial({ color: C(hex), roughness: rough, metalness: metal || 0 }); m.name = name; return m; }
  var M = {
    marino: mat('azul_marino', '#002e46', 0.6, 0.1),
    medio: mat('azul_medio', '#2b5671', 0.5, 0.15),
    gris: mat('gris', '#d9e2e8', 0.7, 0.05),
    piso: mat('piso', '#dbe3e8', 0.9),
    aula: mat('piso_aula', '#eef2f5', 0.9),
    blanco: mat('blanco', '#fbfcfd', 0.6),
    casco: mat('casco_blanco', '#ffffff', 0.35),
    naranja: mat('naranja', '#fc9f01', 0.4),
    acero: mat('acero', '#8a9eac', 0.45, 0.4),
    rostro: mat('rostro', '#e2d4c6', 0.8),
    rodamiento: mat('rodamiento', '#8a9eac', 0.4, 0.4)
  };
  var ORANGE = C('#fc9f01'), STEEL = C('#8a9eac');

  function add(mesh, parent, name, x, y, z) { mesh.name = name || ''; mesh.position.set(x || 0, y || 0, z || 0); mesh.castShadow = true; mesh.receiveShadow = true; (parent || scene).add(mesh); return mesh; }
  function box(w, h, d, m, parent, name, x, y, z) { return add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m), parent, name, x, y, z); }
  function cyl(rt, rb, h, seg, m, parent, name, x, y, z) { return add(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m), parent, name, x, y, z); }
  function cylX(r, len, seg, m, parent, name, x, y, z) { var c = cyl(r, r, len, seg, m, parent, name, x, y, z); c.rotation.z = PI / 2; return c; }
  function sph(r, m, parent, name, x, y, z) { return add(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m), parent, name, x, y, z); }

  // piso continuo
  var floor = add(new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.3, 6.4), [M.gris, M.gris, M.piso, M.gris, M.gris, M.gris]), scene, 'piso', 0, -0.15, -0.1);
  floor.castShadow = false;
  box(5.9, 0.004, 5.9, M.aula, scene, 'piso_aula', -4.2, 0.002, -0.2).castShadow = false;
  // línea de zona alrededor del equipo
  [[5.0, 0.04, 4.35, -1.45], [5.0, 0.04, 4.35, 0.2]].forEach(function (a, i) { box(a[0], 0.004, a[1], M.marino, scene, 'linea_zona_' + i, a[2], 0.004, a[3]).castShadow = false; });
  [[1.85], [6.85]].forEach(function (a, i) { box(0.04, 0.004, 1.69, M.marino, scene, 'linea_zona_l' + i, a[0], 0.004, -0.625).castShadow = false; });

  // aula
  box(5.9, 2.9, 0.16, M.blanco, scene, 'muro_aula', -4.2, 1.45, -3.14);
  box(0.16, 2.9, 3.4, M.blanco, scene, 'muro_lateral', -7.07, 1.45, -1.52);
  box(3.36, 1.98, 0.08, M.marino, scene, 'marco_pantalla', -4.3, 1.72, -3.02);
  var scr = document.createElement('canvas'); scr.width = 640; scr.height = 360;
  var tmp = document.createElement('canvas'); tmp.width = 640; tmp.height = 360;
  var sctx = scr.getContext('2d'), tctx = tmp.getContext('2d');
  var tex = new THREE.CanvasTexture(scr);
  if (REV >= 152 && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace; else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  tex.anisotropy = 4;
  var screenMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }); screenMat.name = 'pantalla';
  var screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), screenMat); screenMesh.name = 'pantalla'; screenMesh.position.set(-4.3, 1.72, -2.975); scene.add(screenMesh);

  [-5.6, -4.2, -2.8].forEach(function (x, i) {
    var g = new THREE.Group(); g.name = 'mesa_' + (i + 1); g.position.set(x, 0, -0.62); scene.add(g);
    box(1.15, 0.05, 0.6, M.gris, g, 'cubierta', 0, 0.74, 0);
    [[-0.52, -0.25], [0.52, -0.25], [-0.52, 0.25], [0.52, 0.25]].forEach(function (p, k) { box(0.04, 0.72, 0.04, M.marino, g, 'pata_' + k, p[0], 0.36, p[1]); });
    box(0.36, 0.02, 0.25, M.marino, g, 'laptop_base', 0, 0.775, 0.05);
    var s = box(0.36, 0.23, 0.015, M.marino, g, 'laptop_pantalla', 0, 0.89, -0.09); s.rotation.x = -0.25;
  });

  // planta: motor + bomba
  var eq = new THREE.Group(); eq.name = 'motor_bomba'; scene.add(eq);
  var AX = 0.82, ZE = -0.5;
  box(4.0, 0.22, 1.3, M.acero, eq, 'base', 4.1, 0.11, ZE);
  box(0.26, 0.24, 0.95, M.marino, eq, 'pata_motor_1', 2.55, 0.34, ZE);
  box(0.26, 0.24, 0.95, M.marino, eq, 'pata_motor_2', 3.35, 0.34, ZE);
  cylX(0.44, 1.2, 40, M.medio, eq, 'carcasa_motor', 2.95, AX, ZE);
  for (var k = 0; k < 16; k++) {
    var a = k / 16 * PI * 2; var rib = box(1.08, 0.07, 0.035, M.medio, eq, 'aleta_' + k, 2.95, AX + Math.cos(a) * 0.46, ZE + Math.sin(a) * 0.46); rib.rotation.x = a;
  }
  cylX(0.41, 0.12, 40, M.medio, eq, 'tapa_lado_libre', 2.3, AX, ZE);
  cylX(0.43, 0.3, 40, M.gris, eq, 'cubierta_ventilador', 2.11, AX, ZE);
  cylX(0.41, 0.1, 40, M.medio, eq, 'tapa_lado_acoplado', 3.6, AX, ZE);
  var bearing = cylX(0.24, 0.18, 40, M.rodamiento, eq, 'rodamiento_lado_acoplado', 3.72, AX, ZE);
  box(0.34, 0.22, 0.34, M.marino, eq, 'caja_conexiones', 2.95, AX + 0.52, ZE);
  cylX(0.06, 0.4, 16, M.acero, eq, 'flecha', 3.98, AX, ZE);
  cylX(0.15, 0.18, 32, M.acero, eq, 'cople', 4.0, AX, ZE);
  box(0.42, 0.42, 0.42, M.gris, eq, 'guarda_cople', 4.0, AX + 0.02, ZE).material = M.gris;
  cylX(0.17, 0.46, 32, M.marino, eq, 'soporte_rodamientos_bomba', 4.44, AX, ZE);
  box(0.34, 0.5, 0.5, M.marino, eq, 'pedestal_bomba', 4.44, 0.47, ZE);
  cylX(0.5, 0.34, 48, M.marino, eq, 'voluta', 4.92, AX, ZE);
  box(0.3, 0.12, 0.5, M.marino, eq, 'pata_voluta', 4.92, 0.28, ZE);
  cylX(0.15, 1.3, 32, M.gris, eq, 'tubo_succion', 5.75, AX, ZE);
  cylX(0.22, 0.05, 32, M.gris, eq, 'brida_succion', 5.2, AX, ZE);
  sph(0.15, M.gris, eq, 'codo_succion', 6.4, AX, ZE);
  cyl(0.15, 0.15, AX, 32, M.gris, eq, 'tubo_succion_v', 6.4, AX / 2, ZE);
  cyl(0.12, 0.12, 1.2, 32, M.gris, eq, 'tubo_descarga', 4.92, 1.9, ZE);
  cyl(0.19, 0.19, 0.05, 32, M.gris, eq, 'brida_descarga', 4.92, 1.34, ZE);
  sph(0.12, M.gris, eq, 'codo_descarga_1', 4.92, 2.5, ZE);
  var pd = cyl(0.12, 0.12, 2.4, 32, M.gris, eq, 'tubo_descarga_h', 4.92, 2.5, -1.7); pd.rotation.x = PI / 2;
  sph(0.12, M.gris, eq, 'codo_descarga_2', 4.92, 2.5, -2.9);
  cylX(0.12, 2.3, 32, M.gris, eq, 'tubo_cabezal', 6.07, 2.5, -2.9);
  box(0.2, 3.1, 0.2, M.gris, scene, 'columna_1', 1.4, 1.55, -3.0);
  box(0.2, 3.1, 0.2, M.gris, scene, 'columna_2', 7.0, 1.55, -3.0);
  box(5.8, 0.16, 0.2, M.gris, scene, 'viga', 4.2, 3.02, -3.0);
  var halo = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.028, 12, 56), new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, depthWrite: false }));
  halo.name = 'halo_rodamiento'; halo.material.name = 'halo'; halo.rotation.y = PI / 2; halo.position.set(3.74, AX, ZE); scene.add(halo);

  /* ---------- personas ---------- */
  function persona(nombre, cuerpo, casco) {
    var g = new THREE.Group(); g.name = nombre; scene.add(g);
    var body = new THREE.Group(); g.add(body);
    var legs = [-1, 1].map(function (s, i) {
      var lg = new THREE.Group(); lg.position.set(s * 0.085, 0.82, 0); body.add(lg);
      cyl(0.07, 0.06, 0.8, 12, M.marino, lg, 'pierna_' + i, 0, -0.4, 0);
      box(0.12, 0.06, 0.2, M.marino, lg, 'bota_' + i, 0, -0.79, 0.04);
      return lg;
    });
    cyl(0.2, 0.17, 0.64, 24, cuerpo, body, 'torso', 0, 1.14, 0);
    cyl(0.203, 0.203, 0.04, 24, M.blanco, body, 'franja', 0, 1.04, 0);
    var arms = [-1, 1].map(function (s, i) {
      var ag = new THREE.Group(); ag.position.set(s * 0.25, 1.4, 0); body.add(ag);
      cyl(0.055, 0.05, 0.58, 12, cuerpo, ag, 'brazo_' + i, 0, -0.29, 0);
      sph(0.055, M.rostro, ag, 'mano_' + i, 0, -0.6, 0);
      return ag;
    });
    sph(0.12, M.rostro, body, 'cabeza', 0, 1.6, 0);
    add(new THREE.Mesh(new THREE.SphereGeometry(0.145, 28, 12, 0, PI * 2, 0, PI / 2), casco), body, 'casco', 0, 1.64, 0);
    cyl(0.19, 0.19, 0.02, 28, casco, body, 'ala_casco', 0, 1.645, 0.01);
    return { g: g, body: body, legs: legs, arms: arms };
  }
  function ang(fx, fz, tx, tz) { return Math.atan2(tx - fx, tz - fz); }
  var SCR = [-4.3, -3.0];
  var MOTOR = [2.95, ZE];
  // 0 termografía, 1 vibraciones (Cat II), 2 ultrasonido
  var P = [
    { H: [-5.6, 0.05], S: [1.7, 1.3], C: [-2.5, 1.45], d: 0.0, tgt: [3.2, ZE] },
    { H: [-4.2, 0.05], S: [3.64, 0.45], C: [0.0, 1.55], d: 0.1, tgt: [3.64, -2] },
    { H: [-2.8, 0.05], S: [5.75, 0.75], C: [2.5, 1.45], d: 0.2, tgt: [4.44, ZE] }
  ].map(function (p, i) {
    var o = persona('participante_' + (i + 1), M.medio, M.casco);
    o.H = p.H; o.S = p.S; o.C = p.C; o.d = p.d;
    var fH = ang(p.H[0], p.H[1], SCR[0], SCR[1]), fS = ang(p.S[0], p.S[1], p.tgt[0], p.tgt[1]), fC = 0.36;
    o.fS = fS;
    o.segs = [{ t0: 4 + p.d, t1: 6 + p.d, A: p.H, B: p.S, fa: fH, fb: fS }, { t0: 12 + p.d * 0.6, t1: 13.4 + p.d * 0.6, A: p.S, B: p.C, fa: fS, fb: fC }];
    o.arrive = 6 + p.d;
    return o;
  });
  var I = persona('instructor', M.marino, M.naranja);
  (function () {
    var Hh = [-1.9, -1.75], Ss = [0.3, 0.95], Cc = [-4.2, 1.2];
    var fH = ang(Hh[0], Hh[1], -4.2, 0.05), fS = ang(Ss[0], Ss[1], MOTOR[0], MOTOR[1]), fC = PI / 2 - 0.1;
    I.segs = [{ t0: 4.3, t1: 6.3, A: Hh, B: Ss, fa: fH, fb: fS }, { t0: 12.1, t1: 13.5, A: Ss, B: Cc, fa: fS, fb: fC }];
  })();

  function fwd(o, dist, y) { return new THREE.Vector3(o.S[0] + Math.sin(o.fS) * dist, y, o.S[1] + Math.cos(o.fS) * dist); }
  // instrumentos (en coordenadas del mundo, en su pose final)
  var inst = [];
  // termografía
  (function () {
    var g = new THREE.Group(); g.name = 'camara_termica'; scene.add(g);
    var p = fwd(P[0], 0.5, 1.3); g.position.copy(p); g.rotation.y = P[0].fS;
    box(0.16, 0.13, 0.2, M.marino, g, 'cuerpo_camara', 0, 0, 0);
    var l = cyl(0.045, 0.05, 0.06, 20, M.acero, g, 'lente', 0, 0, 0.12); l.rotation.x = PI / 2;
    box(0.05, 0.12, 0.06, M.marino, g, 'empunadura', 0, -0.11, -0.02);
    var target = new THREE.Vector3(3.3, AX + 0.05, ZE);
    var len = p.distanceTo(target) - 0.15;
    var cg = new THREE.ConeGeometry(0.42, len, 40, 1, true); cg.translate(0, -len / 2, 0); cg.rotateX(-PI / 2);
    var cm = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }); cm.name = 'haz_termico';
    var cone = new THREE.Mesh(cg, cm); cone.name = 'haz_termico'; cone.position.copy(p).add(new THREE.Vector3(Math.sin(P[0].fS) * 0.15, 0, Math.cos(P[0].fS) * 0.15)); cone.lookAt(target); scene.add(cone);
    inst.push({ g: g, who: 0, extra: cm, anchor: p.clone().add(new THREE.Vector3(0, 0.62, 0)) });
  })();
  // vibraciones
  (function () {
    var g = new THREE.Group(); g.name = 'sensor_vibraciones'; scene.add(g);
    g.position.set(3.62, AX + 0.12, ZE + 0.41);
    var s = cyl(0.055, 0.055, 0.08, 24, M.marino, g, 'sensor', 0, 0, 0); s.rotation.x = PI / 2;
    var c = cyl(0.056, 0.056, 0.02, 24, M.naranja, g, 'sensor_tapa', 0, 0, 0.05); c.rotation.x = PI / 2;
    var h = fwd(P[1], 0.36, 0.98);
    var col = new THREE.Group(); col.name = 'colector'; col.position.copy(h); col.rotation.y = P[1].fS; scene.add(col);
    box(0.14, 0.2, 0.05, M.marino, col, 'colector_cuerpo', -0.18, 0.05, -0.1);
    inst.push({ g: g, who: 1, g2: col, anchor: new THREE.Vector3(3.62, AX + 0.62, ZE + 0.41) });
  })();
  // ultrasonido
  (function () {
    var g = new THREE.Group(); g.name = 'sonda_ultrasonido'; scene.add(g);
    var hand = fwd(P[2], 0.44, 1.1);
    var tip = new THREE.Vector3(4.44, AX + 0.1, ZE + 0.17);
    g.position.copy(hand);
    box(0.08, 0.16, 0.08, M.marino, g, 'mango', 0, 0, 0);
    var dir = tip.clone().sub(hand); var len = dir.length();
    var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, len, 10), M.acero); rod.name = 'varilla'; rod.castShadow = true;
    rod.position.copy(dir.clone().multiplyScalar(0.5)); rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()); g.add(rod);
    var rings = [0, 1].map(function (k) {
      var rm = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, depthWrite: false }); rm.name = 'onda_' + k;
      var r = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 40), rm); r.name = 'onda_' + k; r.position.copy(tip); r.lookAt(hand); scene.add(r); return r;
    });
    inst.push({ g: g, who: 2, rings: rings, anchor: hand.clone().add(new THREE.Vector3(0, 0.55, 0)) });
  })();

  /* ---------- luces y cámara ---------- */
  var hemi = new THREE.HemisphereLight(C('#ffffff'), C('#d9e2e8'), 0.68 * LUZ); scene.add(hemi);
  var sun = new THREE.DirectionalLight(C('#ffffff'), 0.85 * LUZ);
  sun.position.set(-3, 12, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -10; sc.right = 10; sc.top = 8; sc.bottom = -8; sc.near = 1; sc.far = 40;
  sun.shadow.radius = 4; sun.shadow.bias = -0.0006; if ('normalBias' in sun.shadow) sun.shadow.normalBias = 0.02;
  scene.add(sun); scene.add(sun.target);
  var fill = new THREE.DirectionalLight(C('#eef4f8'), 0.3 * LUZ); fill.position.set(8, 5, 6); scene.add(fill);

  var HW = 8.3, HH = HW * 0.75;
  var camera = new THREE.OrthographicCamera(-HW, HW, HH, -HH, 0.1, 100);
  (function () {
    var yaw = 20 * PI / 180, pitch = 30 * PI / 180, T = new THREE.Vector3(0.75, 2.2, 0.2);
    camera.position.set(T.x + Math.sin(yaw) * Math.cos(pitch) * 40, T.y + Math.sin(pitch) * 40, T.z + Math.cos(yaw) * Math.cos(pitch) * 40);
    camera.lookAt(T); camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
  })();
  var pv = new THREE.Vector3();
  function proj(v3) { pv.copy(v3).project(camera); return [(pv.x + 1) * W / 2, (1 - pv.y) * H / 2]; }

  /* ---------- pantalla del aula ---------- */
  var noise = []; var seed = 7; for (var n = 0; n < 400; n++) { seed = (seed * 16807) % 2147483647; noise.push(seed / 2147483647); }
  function g1(x, m, s) { return Math.exp(-((x - m) * (x - m)) / (2 * s * s)); }
  function paint(c, kind, t, reveal) {
    c.fillStyle = '#002e46'; c.fillRect(0, 0, 640, 360);
    var x0 = 44, x1 = 604, y0 = 70, y1 = 318;
    c.strokeStyle = 'rgba(217,226,232,0.13)'; c.lineWidth = 1;
    for (var i = 0; i <= 4; i++) { var yy = y0 + (y1 - y0) * i / 4; c.beginPath(); c.moveTo(x0, yy); c.lineTo(x1, yy); c.stroke(); }
    c.fillStyle = '#d9e2e8'; c.font = '600 22px ' + FONT; c.textBaseline = 'alphabetic';
    var T = ['Espectro de vibración', 'Termograma · motor', 'Ultrasonido · 38 kHz'][kind];
    c.fillText(T, x0, 44);
    c.font = '500 15px ' + FONT; c.textAlign = 'right'; c.fillText(['mm/s', '°C', 'dBµV'][kind], x1, 44); c.textAlign = 'left';
    if (kind === 0) {
      var N = 300, xr = x0 + (x1 - x0) * reveal;
      c.save(); c.beginPath(); c.rect(0, 0, xr, 360); c.clip();
      c.beginPath();
      for (var j = 0; j <= N; j++) {
        var f = j / N;
        var a = noise[j] * 0.05 + g1(f, 0.07, 0.006) * 0.55 + g1(f, 0.14, 0.006) * 0.22 + g1(f, 0.27, 0.005) * 0.78 + g1(f, 0.54, 0.005) * 0.5 + g1(f, 0.81, 0.005) * 0.32 + g1(f, 0.24, 0.004) * 0.18 + g1(f, 0.30, 0.004) * 0.18;
        var px = x0 + f * (x1 - x0), py = y1 - a * (y1 - y0) * 0.95;
        if (j) c.lineTo(px, py); else c.moveTo(px, py);
      }
      c.strokeStyle = '#d9e2e8'; c.lineWidth = 2; c.stroke();
      [[0.27, 0.78], [0.54, 0.5], [0.81, 0.32]].forEach(function (p) {
        var px = x0 + p[0] * (x1 - x0), py = y1 - p[1] * (y1 - y0) * 0.95;
        c.fillStyle = '#fc9f01'; c.beginPath(); c.arc(px, py - 8, 5, 0, PI * 2); c.fill();
      });
      c.fillStyle = '#fc9f01'; c.font = '700 16px ' + FONT; c.fillText('BPFO', x0 + 0.27 * (x1 - x0) + 12, y1 - 0.78 * (y1 - y0) * 0.95 - 2);
      c.restore();
      c.fillStyle = 'rgba(217,226,232,0.7)'; c.font = '500 13px ' + FONT; c.textAlign = 'right'; c.fillText('Frecuencia (Hz)', x1, 342); c.textAlign = 'left';
    } else if (kind === 1) {
      var pulse = 1 + Math.sin(t * 5) * 0.06;
      c.save();
      c.beginPath();
      c.rect(118, 150, 40, 110); c.rect(158, 130, 300, 150); c.rect(458, 158, 40, 94); c.rect(498, 192, 60, 26); c.rect(140, 280, 360, 16);
      c.clip();
      var lg = c.createLinearGradient(118, 0, 560, 0); lg.addColorStop(0, '#1d4a66'); lg.addColorStop(0.6, '#3d6a86'); lg.addColorStop(1, '#6a8ea4');
      c.fillStyle = lg; c.fillRect(100, 120, 480, 190);
      var rg = c.createRadialGradient(470, 205, 4, 470, 205, 130 * pulse);
      rg.addColorStop(0, '#fff6dc'); rg.addColorStop(0.18, '#ffd680'); rg.addColorStop(0.45, '#fc9f01'); rg.addColorStop(1, 'rgba(252,159,1,0)');
      c.fillStyle = rg; c.fillRect(100, 120, 480, 190);
      c.restore();
      c.strokeStyle = '#ffffff'; c.lineWidth = 2; c.beginPath(); c.arc(470, 205, 16, 0, PI * 2); c.moveTo(470, 180); c.lineTo(470, 192); c.moveTo(470, 218); c.lineTo(470, 230); c.stroke();
      c.fillStyle = '#ffffff'; c.font = '700 18px ' + FONT; c.fillText('78.4 °C', 404, 118);
      var sg = c.createLinearGradient(0, y0, 0, y1); sg.addColorStop(0, '#fff6dc'); sg.addColorStop(0.25, '#ffd680'); sg.addColorStop(0.5, '#fc9f01'); sg.addColorStop(0.75, '#3d6a86'); sg.addColorStop(1, '#0f3c56');
      c.fillStyle = sg; c.fillRect(588, y0, 16, y1 - y0);
      c.fillStyle = 'rgba(217,226,232,0.8)'; c.font = '500 13px ' + FONT; c.textAlign = 'right'; c.fillText('80', 580, y0 + 12); c.fillText('30', 580, y1); c.textAlign = 'left';
    } else {
      var mid = (y0 + y1) / 2, xr2 = x0 + (x1 - x0) * reveal;
      c.save(); c.beginPath(); c.rect(0, 0, xr2, 360); c.clip();
      function env(x) { var s = 0, ph = (x - x0 + t * 60) % 150; s = 8 + 92 * g1(ph, 60, 14); return s; }
      c.beginPath();
      for (var q = x0; q <= x1; q += 1.5) { var yv = mid + Math.sin(q * 0.9 + t * 30) * env(q); if (q === x0) c.moveTo(q, yv); else c.lineTo(q, yv); }
      c.strokeStyle = '#d9e2e8'; c.lineWidth = 1.4; c.stroke();
      c.beginPath(); for (var q2 = x0; q2 <= x1; q2 += 3) { var ye = mid - env(q2) - 4; if (q2 === x0) c.moveTo(q2, ye); else c.lineTo(q2, ye); }
      c.strokeStyle = '#fc9f01'; c.lineWidth = 2.5; c.stroke();
      c.restore();
      c.fillStyle = 'rgba(217,226,232,0.7)'; c.font = '500 13px ' + FONT; c.textAlign = 'right'; c.fillText('Tiempo (ms)', x1, 342); c.textAlign = 'left';
    }
  }
  var screenKey = '';
  function drawScreen(t) {
    if (t >= 4) {
      if (screenKey !== 'fin') { paint(sctx, 0, 0, 1); tex.needsUpdate = true; screenKey = 'fin'; }
      return;
    }
    var seg = 4 / 3, k = Math.min(2, Math.floor(t / seg)), lt = t - k * seg;
    var rev = Math.min(1, lt / 0.9);
    paint(sctx, k, t, k === 1 ? 1 : rev);
    if (k > 0 && lt < 0.3) {
      paint(tctx, k - 1, t, 1);
      sctx.save(); sctx.globalAlpha = 1 - lt / 0.3; sctx.drawImage(tmp, 0, 0); sctx.restore();
    }
    tex.needsUpdate = true; screenKey = '';
  }

  /* ---------- utilidades de tiempo ---------- */
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(u) { u = clamp01(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  function easeOut(u) { u = clamp01(u); return 1 - Math.pow(1 - u, 3); }
  function easeBack(u) { u = clamp01(u); var c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }
  function win(t, a, b, c, d) { if (t <= a || t >= d) return 0; if (t < b) return ease((t - a) / (b - a)); if (t <= c) return 1; return 1 - ease((t - c) / (d - c)); }
  function lerpAng(a, b, u) { var d = ((b - a) % (2 * PI) + 3 * PI) % (2 * PI) - PI; return a + d * u; }
  function pstate(o, t) {
    var s0 = o.segs[0], x = s0.A[0], z = s0.A[1], face = s0.fa, walk = 0, stride = 0;
    for (var i = 0; i < o.segs.length; i++) {
      var s = o.segs[i];
      if (t < s.t0) break;
      if (t >= s.t1) { x = s.B[0]; z = s.B[1]; face = s.fb; continue; }
      var u = (t - s.t0) / (s.t1 - s.t0), e = ease(u);
      var dx = s.B[0] - s.A[0], dz = s.B[1] - s.A[1], dist = Math.hypot(dx, dz), mv = Math.atan2(dx, dz);
      x = s.A[0] + dx * e; z = s.A[1] + dz * e;
      face = u < 0.18 ? lerpAng(s.fa, mv, ease(u / 0.18)) : u > 0.82 ? lerpAng(mv, s.fb, ease((u - 0.82) / 0.18)) : mv;
      walk = Math.sin(PI * u); stride = e * dist * 4.6;
      break;
    }
    return { x: x, z: z, face: face, walk: walk, stride: stride };
  }
  function poseBody(o, st, armL, armR, zL, zR) {
    o.g.position.set(st.x, 0, st.z); o.g.rotation.y = st.face;
    var sw = Math.sin(st.stride) * 0.55 * st.walk;
    o.legs[0].rotation.x = sw; o.legs[1].rotation.x = -sw;
    o.body.position.y = Math.abs(Math.cos(st.stride)) * 0.035 * st.walk;
    o.arms[0].rotation.x = armL - sw * 0.8 * (armL === 0 ? 1 : 0); o.arms[1].rotation.x = armR + sw * 0.8 * (armR === 0 ? 1 : 0);
    o.arms[0].rotation.z = zL || -0.06; o.arms[1].rotation.z = zR || 0.06;
  }

  /* ---------- rótulos ---------- */
  var titleRect = null;
  function measure(tg) { if (!tg.w) { tg.w = tg.el.offsetWidth; tg.h = tg.el.offsetHeight; } }
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function setOp(e, o) { e.style.opacity = o.toFixed(3); e.style.visibility = o > 0.005 ? 'visible' : 'hidden'; }
  function layoutTags(list) {
    if (!titleRect) titleRect = { x: 0, y: 0, w: head.offsetLeft + head.offsetWidth + 14, h: head.offsetTop + head.offsetHeight + 14 };
    var act = [];
    list.forEach(function (tg) {
      setOp(tg.el, tg.op); setOp(tg.stem, tg.op); setOp(tg.pin, tg.op);
      if (tg.op <= 0.005) return;
      measure(tg);
      var r = { tg: tg, w: tg.w, h: tg.h, x: tg.ax - tg.w / 2, y: tg.ay - tg.lift - tg.h };
      r.x = Math.max(10, Math.min(W - 10 - r.w, r.x)); r.y = Math.max(10, Math.min(H - 30 - r.h, r.y));
      if (hit(r, titleRect)) { if (tg.ax - r.w / 2 > titleRect.w - 40) r.x = Math.max(r.x, titleRect.w); else r.y = titleRect.h + 4; }
      act.push(r);
    });
    act.sort(function (a, b) { return a.tg.ax - b.tg.ax; });
    for (var pass = 0; pass < 3; pass++) for (var i = 0; i < act.length; i++) for (var j = i + 1; j < act.length; j++) {
      var a = act[i], b = act[j];
      var ga = { x: a.x - 6, y: a.y - 6, w: a.w + 12, h: a.h + 12 };
      if (hit(ga, b)) { var up = a.y - b.h - 8; b.y = (up > 10 && !hit({ x: b.x, y: up, w: b.w, h: b.h }, titleRect)) ? up : a.y + a.h + 8; }
    }
    act.forEach(function (r) {
      var tg = r.tg, dy = r.tg.op < 1 ? (1 - tg.op) * 6 : 0;
      tg.el.style.transform = 'translate(' + r.x.toFixed(1) + 'px,' + (r.y + dy).toFixed(1) + 'px)';
      var sx = Math.max(r.x + 8, Math.min(r.x + r.w - 8, tg.ax));
      var top, bot; if (r.y + r.h < tg.ay) { top = r.y + r.h + dy; bot = tg.ay; } else { top = tg.ay; bot = r.y + dy; }
      tg.stem.style.transform = 'translate(' + sx.toFixed(1) + 'px,' + top.toFixed(1) + 'px)'; tg.stem.style.height = Math.max(0, bot - top).toFixed(1) + 'px';
      tg.pin.style.transform = 'translate(' + tg.ax.toFixed(1) + 'px,' + tg.ay.toFixed(1) + 'px)';
    });
  }

  /* ---------- actualización por segundo ---------- */
  var curPh = -1, frozen = false, compact = false;
  var screenAnchor = new THREE.Vector3(-2.75, 2.62, -2.98);
  function update(t) {
    var ph = Math.min(3, Math.floor(t / 4)), lt = t - ph * 4;
    if (ph !== curPh) {
      curPh = ph; titleEl.textContent = TITULOS[ph]; colTitle.textContent = TITULOS[ph]; titleRect = null;
      [bars, colBars].forEach(function (bs) { bs.forEach(function (b, i) { b.className = 'ecur-bar' + (i < ph ? ' ecur-past' : i === ph ? ' ecur-now' : ''); }); });
    }
    var tOp = (frozen || reduced) ? 1 : Math.min(clamp01(lt / 0.35), ph === 3 ? 1 : clamp01((4 - lt) / 0.2));
    head.style.opacity = tOp.toFixed(3);

    drawScreen(t);

    // personas
    P.forEach(function (o, i) {
      var st = pstate(o, t);
      var hold = win(t, o.arrive, o.arrive + 0.35, 11.8, 12.1);
      if (i === 0) poseBody(o, st, -1.25 * hold, -1.25 * hold, -0.06 + 0.3 * hold, 0.06 - 0.3 * hold);
      else if (i === 1) poseBody(o, st, -0.35 * hold, -0.95 * hold);
      else poseBody(o, st, 0, -1.15 * hold);
    });
    var sti = pstate(I, t);
    var point = win(t, 0.4, 0.8, 3.6, 4.1);
    var nod = Math.sin(t * 3) * 0.08 * point;
    poseBody(I, sti, 0, (-1.35 + nod) * point, -0.06, 0.06 + 0.35 * point);

    // instrumentos
    inst.forEach(function (it) {
      var a = P[it.who].arrive;
      var s = win(t, a + 0.15, a + 0.45, 11.75, 12.05);
      var vis = s > 0.002;
      it.g.visible = vis; it.g.scale.setScalar(Math.max(0.001, s));
      if (it.g2) { it.g2.visible = vis; it.g2.scale.setScalar(Math.max(0.001, s)); }
      if (it.extra) { it.extra.opacity = 0.16 * s * (0.8 + 0.2 * Math.sin(t * 4)); }
      if (it.rings) it.rings.forEach(function (r, k) {
        var p = (t * 1.1 + k * 0.5) % 1; r.visible = vis; r.scale.setScalar(0.4 + p * 1.6); r.material.opacity = (1 - p) * 0.85 * s;
      });
    });

    // falla
    var hl = win(t, 8.2, 8.6, 11.8, 12.2), pulse = 0.5 + 0.5 * Math.sin(t * 6);
    M.rodamiento.color.copy(STEEL).lerp(ORANGE, hl);
    M.rodamiento.emissive.copy(ORANGE).multiplyScalar(hl * (0.25 + 0.35 * pulse));
    halo.material.opacity = hl * (0.45 + 0.45 * pulse); halo.scale.setScalar(1 + 0.12 * pulse);
    halo.visible = hl > 0.002;

    // rótulos 3D -> 2D
    var cOp = win(t, 0.5, 0.9, 3.7, 3.95);
    var tOps = inst.map(function (it) { var a = P[it.who].arrive; return win(t, a + 0.4, a + 0.7, 7.75, 7.98); });
    chips.caso.classList.toggle('ecur-on', cOp > 0.01);
    chips.ter.classList.toggle('ecur-on', tOps[0] > 0.01); chips.vib.classList.toggle('ecur-on', tOps[1] > 0.01); chips.ult.classList.toggle('ecur-on', tOps[2] > 0.01);
    var pOp = win(t, 8.7, 9.1, 11.7, 11.98);
    chips.diag.classList.toggle('ecur-on', pOp > 0.01);
    var credT = [0, 1, 2].map(function (i) { return 13.5 + i * 0.28; });
    credT.forEach(function (s0, i) { chips['c' + i].classList.toggle('ecur-on', t > s0); });
    chips.iso.classList.toggle('ecur-on', t > credT[0]);
    var su = clamp01((t - 14.75) / 0.65);
    chips.sello.classList.toggle('ecur-on', su > 0);

    if (!compact) {
      var q;
      q = proj(screenAnchor); tagCaso.ax = q[0]; tagCaso.ay = q[1]; tagCaso.op = cOp; tagCaso.lift = 22;
      var map = [tagTer, tagVib, tagUlt];
      inst.forEach(function (it, i) { var p = proj(it.anchor); map[i].ax = p[0]; map[i].ay = p[1]; map[i].op = tOps[i]; map[i].lift = 26; });
      layoutTags([tagCaso, tagTer, tagVib, tagUlt]);

      setOp(panel, pOp); panel.style.transform = 'translateY(' + ((1 - pOp) * 8).toFixed(1) + 'px)';
      checkPath.setAttribute('stroke-dashoffset', (22 * (1 - easeOut((t - 9.3) / 0.45))).toFixed(2));
      var b = proj(bearing.getWorldPosition(pv.clone()));
      var px = W - 24 - panel.offsetWidth + 22, py = 26 + panel.offsetHeight;
      leader.setAttribute('x1', px); leader.setAttribute('y1', py + (1 - pOp) * 8); leader.setAttribute('x2', b[0].toFixed(1)); leader.setAttribute('y2', (b[1] - 20).toFixed(1));
      leader.style.opacity = pOp;
      ring.setAttribute('cx', b[0].toFixed(1)); ring.setAttribute('cy', b[1].toFixed(1)); ring.setAttribute('r', (18 + 4 * pulse).toFixed(1)); ring.style.opacity = (pOp * 0.9).toFixed(3);

      creds.forEach(function (cr, i) {
        var s0 = credT[i], u = clamp01((t - s0) / 1.1), op = clamp01((t - s0) / 0.2);
        var o = P[i]; var hp = proj(new THREE.Vector3(o.C[0], 1.95, o.C[1]));
        var x = Math.max(10, Math.min(W - 106, hp[0] - 48)), y = hp[1] - 62 - 14;
        setOp(cr.el, op);
        cr.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y + (1 - easeOut(u * 2)) * 10).toFixed(1) + 'px)';
        var deg = (1 - easeOut(u)) * 540, m = deg % 360, back = m > 90 && m < 270;
        cr.inner.style.transform = 'rotateY(' + deg.toFixed(1) + 'deg)';
        cr.f.style.visibility = back ? 'hidden' : ''; cr.b.style.visibility = back ? '' : 'hidden';
      });
      setOp(stamp, clamp01(su * 3));
      stamp.style.transform = 'scale(' + Math.max(0.01, easeBack(su)).toFixed(3) + ') rotate(-8deg)';
    }

    var vOp = (frozen || reduced) ? 0 : Math.max(clamp01((t - 15.55) / 0.45), 1 - clamp01(t / 0.35));
    veil.style.opacity = vOp.toFixed(3);
  }

  /* ---------- bucle, pausa, escala ---------- */
  var elapsed = 0, last = null, raf = 0, onScreen = true, pageVisible = !document.hidden;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = !!(mq && mq.matches);
  var FINAL = 15.4;
  function draw(t) { update(t); renderer.render(scene, camera); }
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (last === null) last = now;
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    elapsed = (elapsed + dt) % CICLO; draw(elapsed);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function sync() {
    if (frozen || reduced || !onScreen || !pageVisible) { stop(); if (reduced && !frozen) draw(FINAL); return; }
    if (!raf) { last = null; raf = requestAnimationFrame(tick); }
  }
  var scale = 0;
  function resize() {
    var w = root.clientWidth || W; var s = w / W;
    var nowCompact = w < 520;
    if (nowCompact !== compact) { compact = nowCompact; root.classList.toggle('ecur-compact', compact); [tagCaso, tagVib, tagTer, tagUlt].forEach(function (tg) { tg.w = 0; }); titleRect = null; }
    stage.style.transform = 'scale(' + s + ')';
    if (Math.abs(s - scale) > 0.02) { scale = s; renderer.setPixelRatio(Math.min(2.5, Math.max(1, (window.devicePixelRatio || 1) * s))); renderer.setSize(W, H); }
    if (!raf) draw(frozen ? elapsed : reduced ? FINAL : elapsed);
  }
  var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(root); else window.addEventListener('resize', resize);
  var io = window.IntersectionObserver ? new IntersectionObserver(function (es) { onScreen = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0.01 }) : null;
  if (io) io.observe(root);
  function onVis() { pageVisible = !document.hidden; sync(); }
  document.addEventListener('visibilitychange', onVis);
  function onMq() { reduced = mq.matches; sync(); if (!reduced) sync(); }
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); }

  resize();
  sync();

  function limpiar() {
    stop();
    if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
    if (io) io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', onMq); else if (mq.removeListener) mq.removeListener(onMq); }
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
    });
    tex.dispose();
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (root.parentNode) root.parentNode.removeChild(root);
    styleEl._ecurRefs--; if (styleEl._ecurRefs <= 0 && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
  }
  limpiar.irA = function (segundo) {
    frozen = true; stop();
    elapsed = ((Number(segundo) || 0) % CICLO + CICLO) % CICLO;
    resize(); draw(elapsed); return limpiar;
  };
  limpiar.reanudar = function () { frozen = false; sync(); return limpiar; };
  return limpiar;
}
