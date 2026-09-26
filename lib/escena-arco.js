/**
 * Escena "Estudio de arco eléctrico": el tablero principal, el diagrama
 * unifilar, la energía incidente calculada conforme a IEEE 1584, las tres
 * fronteras de aproximación, el técnico con su categoría de protección, el
 * arco y su onda, y la etiqueta de advertencia según la NOM-029-STPS.
 *
 * Generada en Claude Diseño (docs/designs/arco-electrico-escena.html) y
 * portada como las demás escenas: recibe THREE y el contenedor y devuelve
 * la limpieza. Ajusta luces y color por revisión de Three.js.
 * Ajuste propio: en pantallas angostas el título, los rótulos, el unifilar
 * y la etiqueta crecen, y la densidad de píxeles sigue a la escala.
 */
/* eslint-disable */
export function montarEscenaArco(THREE, container) {
  var W = 720, H = 540, T = 16;
  var NAVY = '#002e46', BLUE = '#2b5671', GRAY = '#d9e2e8', ORANGE = '#fc9f01';
  var rev = parseInt(THREE.REVISION, 10) || 128;
  var K = rev >= 155 ? Math.PI : 1;
  var cm = THREE.ColorManagement;
  var legacyColor = !cm || (cm.enabled === undefined ? cm.legacyMode !== false : !cm.enabled);
  function col(h) { var c = new THREE.Color(h); if (legacyColor) c.convertSRGBToLinear(); return c; }
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(mq && mq.matches);
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ramp(t, a, b) { return clamp((t - a) / (b - a)); }
  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function eOut(x) { return 1 - Math.pow(1 - x, 3); }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function win(t, a, b, f) { f = f || 0.3; return ramp(t, a, a + f) * (1 - ramp(t, b - f, b)); }
  function setTex(tex) { if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace; else if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding; }

  /* ---------- DOM ---------- */
  var wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;width:100%;height:0;padding-top:75%;overflow:hidden;';
  var stage = document.createElement('div');
  stage.style.cssText = 'position:absolute;left:0;top:0;width:720px;height:540px;transform-origin:0 0;overflow:hidden;background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%);color:#002e46;font-family:"Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;user-select:none;';
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', 'Estudio de arco eléctrico: cálculo de energía incidente, fronteras de aproximación, equipo de protección y etiqueta de advertencia en el tablero principal.');
  wrap.appendChild(stage);
  container.appendChild(wrap);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = rev >= 180 ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  else if (THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.domElement.style.cssText = 'position:absolute;left:0;top:0;width:720px;height:540px;display:block;';
  stage.appendChild(renderer.domElement);

  var tag = 'position:absolute;left:0;top:0;opacity:0;pointer-events:none;will-change:transform,opacity;white-space:nowrap;';
  var ov = document.createElement('div');
  ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  ov.innerHTML =
    '<svg data-k="leader" width="720" height="540" style="position:absolute;left:0;top:0;opacity:0;overflow:visible"><polyline data-k="leaderLine" fill="none" stroke="#002e46" stroke-width="1.25" stroke-dasharray="3 3" points="0,0 0,0"></polyline><circle data-k="leaderDot" r="3.5" fill="#fc9f01" stroke="#002e46" stroke-width="1.25"></circle></svg>' +
    '<div data-k="head" style="position:absolute;left:28px;top:24px;max-width:340px;transform-origin:0 0">' +
      '<div data-k="cap" style="font-size:22px;font-weight:700;line-height:1.2;letter-spacing:-0.01em;color:#002e46;text-wrap:balance"></div>' +
      '<div style="display:flex;gap:4px;margin-top:10px"><span data-k="bar"></span><span data-k="bar"></span><span data-k="bar"></span><span data-k="bar"></span><span data-k="bar"></span></div>' +
    '</div>' +
    '<div data-k="uni" style="position:absolute;right:24px;top:22px;width:178px;box-sizing:border-box;padding:10px 12px 8px;background:rgba(255,255,255,0.94);border:1px solid #d9e2e8;border-radius:8px;box-shadow:0 8px 20px rgba(0,46,70,0.08);opacity:0">' +
      '<div style="font-size:12px;font-weight:600;color:#2b5671;letter-spacing:0.04em;margin-bottom:4px">Diagrama unifilar</div>' +
      '<svg width="154" height="150" viewBox="0 0 154 150" style="display:block;overflow:visible">' +
        '<rect data-k="uniHi" x="-4" y="112" width="160" height="34" rx="5" fill="rgba(252,159,1,0.16)" stroke="#fc9f01" stroke-width="1.5" opacity="0"></rect>' +
        '<g fill="none" stroke="#002e46" stroke-width="2" stroke-linecap="round">' +
          '<path data-k="uniP" pathLength="1" d="M10 6 L18 16 L26 6 M18 16 V36"></path>' +
          '<path data-k="uniP" pathLength="1" d="M18 36 A11 11 0 1 1 17.99 36 M18 54 A11 11 0 1 1 17.99 54"></path>' +
          '<path data-k="uniP" pathLength="1" d="M18 76 V96 M12 96 H24 V108 H12 Z M18 108 V128 M4 129 H32"></path>' +
        '</g>' +
        '<g fill="#002e46" font-size="12">' +
          '<text data-k="uniT" x="44" y="18" opacity="0">Acometida</text>' +
          '<text data-k="uniT" x="44" y="60" opacity="0">Transformador</text>' +
          '<text data-k="uniT" x="44" y="133" opacity="0" font-weight="700">Tablero principal</text>' +
        '</g>' +
      '</svg>' +
    '</div>' +
    '<div data-k="main" style="' + tag + 'display:flex;flex-direction:column;align-items:center">' +
      '<div style="font-size:12px;font-weight:600;color:#002e46;background:rgba(255,255,255,0.95);border:1px solid #d9e2e8;border-radius:4px;padding:3px 8px">Tablero principal</div>' +
      '<div style="width:1px;height:10px;background:#002e46"></div>' +
    '</div>' +
    '<div data-k="energy" style="' + tag + '">' +
      '<div style="display:flex;align-items:baseline;gap:5px;background:#002e46;color:#ffffff;border-radius:6px;padding:6px 11px;box-shadow:0 6px 16px rgba(0,46,70,0.18)">' +
        '<span data-k="eVal" style="font-size:22px;font-weight:700;color:#fc9f01;font-variant-numeric:tabular-nums">0.0</span><span style="font-size:14px;font-weight:600">cal/cm²</span>' +
      '</div>' +
    '</div>' +
    '<div data-k="bl" style="' + tag + 'display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.9);border-radius:4px;padding:3px 7px"><i style="width:9px;height:9px;border-radius:50%;background:#fed783;border:1px solid #e7b24a"></i>Frontera de arco</div>' +
    '<div data-k="bl" style="' + tag + 'display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.9);border-radius:4px;padding:3px 7px"><i style="width:9px;height:9px;border-radius:50%;background:#fdba45;border:1px solid #e39a1d"></i>Aproximación limitada</div>' +
    '<div data-k="bl" style="' + tag + 'display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.9);border-radius:4px;padding:3px 7px"><i style="width:9px;height:9px;border-radius:50%;background:#fc9f01;border:1px solid #d98700"></i>Aproximación restringida</div>' +
    '<div data-k="cat" style="' + tag + '"><div style="font-size:13px;font-weight:700;color:#002e46;background:#fc9f01;border-radius:999px;padding:4px 10px;box-shadow:0 4px 10px rgba(0,46,70,0.15)">Categoría 2</div></div>' +
    '<div data-k="card" style="position:absolute;left:486px;top:318px;width:214px;opacity:0;background:#ffffff;border:1.5px solid #002e46;border-radius:6px;overflow:hidden;box-shadow:0 10px 24px rgba(0,46,70,0.14)">' +
      '<div style="display:flex;gap:8px;align-items:flex-start;background:#fc9f01;color:#002e46;padding:8px 10px;font-size:13px;font-weight:800;line-height:1.25">' +
        '<svg width="16" height="15" viewBox="0 0 16 15" style="flex:none;margin-top:1px"><path d="M8 1 L15 14 H1 Z" fill="none" stroke="#002e46" stroke-width="1.8" stroke-linejoin="round"></path><path d="M8 6 V9.5" stroke="#002e46" stroke-width="1.8" stroke-linecap="round"></path><circle cx="8" cy="11.8" r="1" fill="#002e46"></circle></svg>' +
        '<span>ADVERTENCIA · Riesgo de arco eléctrico</span>' +
      '</div>' +
      '<div style="font-size:12px;line-height:1.3;color:#002e46">' +
        '<div style="padding:6px 10px">Energía incidente <b>5.9 cal/cm²</b></div>' +
        '<div style="padding:6px 10px;border-top:1px solid #d9e2e8">EPP <b>Categoría 2</b></div>' +
        '<div style="padding:6px 10px;border-top:1px solid #d9e2e8">Frontera de arco</div>' +
        '<div style="padding:6px 10px;border-top:1px solid #d9e2e8"><b>480 V</b></div>' +
      '</div>' +
    '</div>' +
    '<div data-k="seal" style="position:absolute;left:452px;top:478px;opacity:0;transform-origin:50% 50%">' +
      '<div style="display:flex;align-items:center;gap:6px;background:#ffffff;border:2px solid #fc9f01;border-radius:999px;padding:5px 11px 5px 6px;font-size:12px;font-weight:700;color:#002e46;box-shadow:0 6px 14px rgba(0,46,70,0.12)">' +
        '<span style="width:18px;height:18px;border-radius:50%;background:#fc9f01;display:flex;align-items:center;justify-content:center"><svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4 L4 7 L9 1" fill="none" stroke="#002e46" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>' +
        'Etiquetado y documentado' +
      '</div>' +
    '</div>';
  stage.appendChild(ov);
  function q(k) { return ov.querySelector('[data-k="' + k + '"]'); }
  function qa(k) { return ov.querySelectorAll('[data-k="' + k + '"]'); }
  var el = {
    head: q('head'), cap: q('cap'), bars: qa('bar'), uni: q('uni'), uniHi: q('uniHi'), uniP: qa('uniP'), uniT: qa('uniT'),
    main: q('main'), energy: q('energy'), eVal: q('eVal'), bl: qa('bl'), cat: q('cat'),
    card: q('card'), seal: q('seal'), leader: q('leader'), leaderLine: q('leaderLine'), leaderDot: q('leaderDot')
  };
  for (var bi = 0; bi < el.bars.length; bi++) el.bars[bi].style.cssText = 'width:22px;height:3px;border-radius:2px;background:#d9e2e8';
  for (var pi = 0; pi < el.uniP.length; pi++) { el.uniP[pi].setAttribute('stroke-dasharray', '1 1'); el.uniP[pi].setAttribute('stroke-dashoffset', '1'); }

  /* ---------- Escena ---------- */
  var scene = new THREE.Scene();
  var FH = 3.9;
  var camera = new THREE.OrthographicCamera(-FH * 4 / 3, FH * 4 / 3, FH, -FH, 0.1, 100);
  var target = new THREE.Vector3(0.1, 0.75, 0.95);
  var dir = new THREE.Vector3(0.62, 0.72, 1.2).normalize();
  camera.position.copy(target).addScaledVector(dir, 30);
  camera.lookAt(target);

  scene.add(new THREE.HemisphereLight(0xffffff, col('#b9c6cf'), 0.55 * K));
  var sun = new THREE.DirectionalLight(0xffffff, 0.62 * K);
  sun.position.set(-3.5, 9, 5.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  var sc = sun.shadow.camera; sc.left = -6; sc.right = 6; sc.top = 6; sc.bottom = -6; sc.near = 1; sc.far = 25;
  sun.shadow.bias = -0.0006;
  if ('normalBias' in sun.shadow) sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  scene.add(sun);
  var fill = new THREE.DirectionalLight(0xffffff, 0.3 * K);
  fill.position.set(6, 3, 4);
  scene.add(fill);
  var arcLight = new THREE.PointLight(col(ORANGE), 0, 0, 0);
  arcLight.position.set(0.1, 1.2, -0.2);
  scene.add(arcLight);

  function mat(name, hex, r, m, extra) {
    var o = { color: col(hex), roughness: r, metalness: m || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    var mm = new THREE.MeshStandardMaterial(o); mm.name = name; return mm;
  }
  var M = {
    navy: mat('azul_marino', NAVY, 0.55, 0.15),
    door: mat('puerta', '#0b3a54', 0.5, 0.15),
    blue: mat('azul_medio', BLUE, 0.5, 0.25),
    floor: mat('piso', GRAY, 0.9),
    wall: mat('muro', '#e7ecf0', 0.95),
    white: mat('blanco', '#f6f8fa', 0.6),
    orange: mat('naranja', ORANGE, 0.5),
    glass: mat('mirilla', '#7f9db0', 0.2, 0.3)
  };
  function mesh(geo, m, x, y, z, name, parent, shadow) {
    var me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.name = name;
    if (shadow !== false) { me.castShadow = true; me.receiveShadow = true; }
    (parent || scene).add(me); return me;
  }
  function box(w, h, d, m, x, y, z, name, parent, shadow) { return mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, name, parent, shadow); }

  var room = new THREE.Group(); room.name = 'cuarto_electrico'; scene.add(room);
  var floor = box(7, 0.16, 5.2, M.floor, 0, -0.08, 1.1, 'piso', room); floor.castShadow = false;
  box(7, 2.8, 0.14, M.wall, 0, 1.4, -1.57, 'muro_fondo', room);
  box(0.14, 2.8, 2.2, M.wall, -3.57, 1.4, -0.4, 'muro_izquierdo', room);
  box(3.5, 0.08, 0.32, M.blue, 0, 2.62, -1.3, 'charola', room);

  var ZC = -0.6, mainDoor = null;
  [{ x: -1.1, h: 2.05, n: 'tablero_izquierdo' }, { x: 0, h: 2.3, n: 'tablero_principal', main: true }, { x: 1.1, h: 2.05, n: 'tablero_derecho' }].forEach(function (c) {
    var g = new THREE.Group(); g.name = c.n; g.position.set(c.x, 0, -0.95); room.add(g);
    box(1.0, 0.1, 0.7, M.blue, 0, 0.05, 0, c.n + '_zoclo', g);
    box(1.0, c.h - 0.1, 0.7, M.navy, 0, 0.1 + (c.h - 0.1) / 2, 0, c.n + '_gabinete', g);
    box(1.04, 0.05, 0.74, M.blue, 0, c.h + 0.025, 0, c.n + '_tapa', g);
    box(0.16, 2.58 - c.h, 0.16, M.blue, 0, c.h + (2.58 - c.h) / 2, -0.2, c.n + '_ducto', g);
    var piv = new THREE.Group(); piv.name = c.n + '_bisagra'; piv.position.set(-0.47, 0, 0.351); g.add(piv);
    var dh = c.h - 0.26, dy = 0.1 + (c.h - 0.1) / 2;
    box(0.94, dh, 0.03, M.door, 0.47, dy, 0.015, c.n + '_puerta', piv);
    box(0.035, 0.2, 0.04, M.blue, 0.86, dy - 0.05, 0.045, c.n + '_manija', piv);
    for (var i = 0; i < 3; i++) box(0.42, 0.022, 0.01, M.blue, 0.47, 0.34 + i * 0.07, 0.035, c.n + '_rejilla', piv, false);
    if (c.main) {
      box(0.46, 0.3, 0.01, M.glass, 0.47, 1.78, 0.035, c.n + '_mirilla', piv, false);
      box(0.08, 0.12, 0.03, M.white, 0.47, 1.78, 0.045, c.n + '_interruptor', piv, false);
      mainDoor = piv;
    } else {
      box(0.3, 0.2, 0.01, M.blue, 0.47, 1.55, 0.035, c.n + '_placa', piv, false);
    }
  });

  var doorLabel = new THREE.Group(); doorLabel.name = 'etiqueta_puerta';
  doorLabel.position.set(0.47, 1.2, 0.034); mainDoor.add(doorLabel);
  box(0.38, 0.28, 0.006, M.white, 0, 0, 0, 'etiqueta_fondo', doorLabel, false);
  box(0.38, 0.075, 0.008, M.orange, 0, 0.1025, 0.001, 'etiqueta_encabezado', doorLabel, false);
  for (var li = 0; li < 3; li++) box(0.26 - li * 0.05, 0.014, 0.008, M.navy, -0.04 - li * 0.025, 0.03 - li * 0.05, 0.001, 'etiqueta_renglon', doorLabel, false);
  doorLabel.scale.setScalar(0.001);

  /* fronteras */
  var R = [2.55, 1.75, 0.95], BC = ['#fed783', '#fdba45', '#fc9f01'], BE = ['#f2bf55', '#f5a623', '#e98f00'];
  var FILL_OP = [0.34, 0.32, 0.36], SEG = 96;
  var bounds = R.map(function (r, i) {
    var fm = new THREE.MeshBasicMaterial({ color: col(BC[i]), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    fm.name = 'frontera_' + i;
    var f = mesh(new THREE.CircleGeometry(r, SEG, 0, Math.PI), fm, 0, 0.004 + i * 0.002, ZC, 'frontera_relleno_' + i, room, false);
    f.rotation.x = Math.PI / 2; f.renderOrder = 2 + i;
    var em = new THREE.MeshBasicMaterial({ color: col(BE[i]), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    em.name = 'frontera_borde_' + i;
    var e = mesh(new THREE.RingGeometry(r - 0.028, r, SEG, 1, 0, Math.PI), em, 0, 0.012 + i * 0.002, ZC, 'frontera_borde_' + i, room, false);
    e.rotation.x = Math.PI / 2; e.renderOrder = 6 + i;
    return { f: f, e: e, fc: f.geometry.index.count, ec: e.geometry.index.count };
  });

  /* onda y destello */
  function gradCanvas(w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c; }
  var alphaTex = new THREE.CanvasTexture(gradCanvas(4, 64, function (x, w, h) { var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#000'); g.addColorStop(1, '#fff'); x.fillStyle = g; x.fillRect(0, 0, w, h); }));
  var waveGeo = new THREE.CylinderGeometry(1, 1, 1, SEG, 1, true, -Math.PI / 2, Math.PI); waveGeo.translate(0, 0.5, 0);
  var waveMat = new THREE.MeshBasicMaterial({ color: col(ORANGE), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, alphaMap: alphaTex });
  waveMat.name = 'onda_calor';
  var wave = mesh(waveGeo, waveMat, 0, 0.01, ZC, 'onda_calor', scene, false); wave.renderOrder = 10; wave.visible = false;
  var waveFloorMat = new THREE.MeshBasicMaterial({ color: col(ORANGE), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  var waveFloor = mesh(new THREE.CircleGeometry(1, SEG, 0, Math.PI), waveFloorMat, 0, 0.018, ZC, 'onda_piso', scene, false);
  waveFloor.rotation.x = Math.PI / 2; waveFloor.renderOrder = 9; waveFloor.visible = false;
  var flashTex = new THREE.CanvasTexture(gradCanvas(128, 128, function (x, w) {
    var g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.2, 'rgba(255,240,205,0.95)');
    g.addColorStop(0.5, 'rgba(252,159,1,0.45)'); g.addColorStop(1, 'rgba(252,159,1,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, w);
  }));
  setTex(flashTex);
  var flashMat = new THREE.SpriteMaterial({ map: flashTex, transparent: true, opacity: 0, depthWrite: false });
  var flash = new THREE.Sprite(flashMat); flash.name = 'destello'; flash.position.set(0.15, 1.25, -0.45); flash.renderOrder = 12; flash.visible = false;
  scene.add(flash);

  /* técnico */
  var clipN = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
  var clipS = new THREE.Plane(new THREE.Vector3(0, -1, 0), -1);
  function tmat(name, hex, r, m, suit) { var mm = mat(name, hex, r, m, { clippingPlanes: [suit ? clipS : clipN], clipShadows: true }); techMats.push(mm); return mm; }
  var techMats = [];
  var tm = {
    shirt: tmat('tecnico_camisa', BLUE, 0.8), pants: tmat('tecnico_pantalon', NAVY, 0.8), skin: tmat('tecnico_cabeza', '#c3ced6', 0.7),
    helmet: tmat('tecnico_casco', '#f6f8fa', 0.45),
    suit: tmat('traje_arco', '#b8b19c', 0.85, 0, true), stripe: tmat('traje_franja', ORANGE, 0.5, 0, true),
    visor: tmat('traje_careta', '#1d3949', 0.15, 0.35, true), glove: tmat('traje_guantes', NAVY, 0.8, 0, true)
  };
  var tech = new THREE.Group(); tech.name = 'tecnico'; scene.add(tech);
  function tpart(geo, m, x, y, z, name, parent) { return mesh(geo, m, x, y, z, name, parent || tech); }
  var legs = [], arms = [];
  [-1, 1].forEach(function (s) {
    var lp = new THREE.Group(); lp.position.set(s * 0.095, 0.86, 0); tech.add(lp); legs.push(lp);
    tpart(new THREE.BoxGeometry(0.13, 0.8, 0.15), tm.pants, 0, -0.42, 0, 'pierna', lp);
    tpart(new THREE.BoxGeometry(0.14, 0.07, 0.22), tm.pants, 0, -0.825, 0.03, 'zapato', lp);
    tpart(new THREE.BoxGeometry(0.165, 0.8, 0.185), tm.suit, 0, -0.42, 0, 'traje_pierna', lp);
    tpart(new THREE.BoxGeometry(0.17, 0.08, 0.24), tm.glove, 0, -0.82, 0.03, 'traje_bota', lp);
    var ap = new THREE.Group(); ap.position.set(s * 0.255, 1.45, 0); ap.rotation.z = s * 0.07; tech.add(ap); arms.push(ap);
    tpart(new THREE.CylinderGeometry(0.055, 0.05, 0.58, 16), tm.shirt, 0, -0.29, 0, 'brazo', ap);
    tpart(new THREE.SphereGeometry(0.055, 16, 10), tm.skin, 0, -0.6, 0, 'mano', ap);
    tpart(new THREE.CylinderGeometry(0.078, 0.072, 0.58, 20), tm.suit, 0, -0.29, 0, 'traje_manga', ap);
    tpart(new THREE.CylinderGeometry(0.081, 0.08, 0.045, 20), tm.stripe, 0, -0.36, 0, 'traje_franja_manga', ap);
    tpart(new THREE.SphereGeometry(0.07, 16, 10), tm.glove, 0, -0.62, 0, 'traje_guante', ap);
  });
  tpart(new THREE.BoxGeometry(0.31, 0.14, 0.2), tm.pants, 0, 0.9, 0, 'cadera');
  tpart(new THREE.CylinderGeometry(0.2, 0.16, 0.6, 28), tm.shirt, 0, 1.17, 0, 'torso');
  var sh = tpart(new THREE.SphereGeometry(0.2, 28, 14), tm.shirt, 0, 1.47, 0, 'hombros'); sh.scale.y = 0.42;
  tpart(new THREE.CylinderGeometry(0.055, 0.06, 0.12, 16), tm.skin, 0, 1.56, 0, 'cuello');
  tpart(new THREE.SphereGeometry(0.115, 32, 16), tm.skin, 0, 1.69, 0, 'cabeza');
  tpart(new THREE.SphereGeometry(0.132, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), tm.helmet, 0, 1.72, 0, 'casco');
  tpart(new THREE.CylinderGeometry(0.165, 0.165, 0.02, 32), tm.helmet, 0, 1.72, 0.012, 'casco_ala');
  tpart(new THREE.CylinderGeometry(0.235, 0.25, 0.95, 32), tm.suit, 0, 1.0, 0, 'traje_saco');
  var ssh = tpart(new THREE.SphereGeometry(0.235, 32, 14), tm.suit, 0, 1.475, 0, 'traje_hombros'); ssh.scale.y = 0.42;
  tpart(new THREE.CylinderGeometry(0.252, 0.252, 0.05, 32), tm.stripe, 0, 0.78, 0, 'traje_franja_1');
  tpart(new THREE.CylinderGeometry(0.245, 0.245, 0.05, 32), tm.stripe, 0, 1.2, 0, 'traje_franja_2');
  tpart(new THREE.CylinderGeometry(0.16, 0.25, 0.18, 32), tm.suit, 0, 1.56, 0, 'traje_capucha_cuello');
  var hood = new THREE.Group(); hood.position.set(0, 1.7, 0); hood.scale.set(1, 1.12, 1); tech.add(hood);
  tpart(new THREE.SphereGeometry(0.165, 32, 16), tm.suit, 0, 0, 0, 'traje_capucha', hood);
  tpart(new THREE.SphereGeometry(0.17, 32, 12, Math.PI / 2 - 0.75, 1.5, Math.PI / 2 - 0.42, 0.72), tm.visor, 0, 0, 0, 'traje_careta', hood);
  var ringMat = new THREE.MeshBasicMaterial({ color: col(ORANGE), transparent: true, opacity: 0 }); ringMat.name = 'anillo_cambio';
  var ring = mesh(new THREE.TorusGeometry(0.34, 0.012, 8, 64), ringMat, 0, 0, 0, 'anillo_cambio', tech, false); ring.rotation.x = Math.PI / 2;
  var TX = -0.42;
  tech.position.set(TX, 0, 3.4); tech.rotation.y = Math.PI;
  var techTransparent = false;
  function techOpacity(o) {
    var tr = o < 0.999;
    for (var i = 0; i < techMats.length; i++) { var m = techMats[i]; m.opacity = o; if (tr !== techTransparent) { m.transparent = tr; m.needsUpdate = true; } }
    techTransparent = tr;
    tech.visible = o > 0.001;
  }

  /* ---------- Proyección ---------- */
  var pv = new THREE.Vector3();
  function proj(v3) { pv.copy(v3).project(camera); return [(pv.x + 1) * W / 2, (1 - pv.y) * H / 2]; }
  function place(node, x, y, o, dy) {
    node.style.transformOrigin = '50% 100%';
    node.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y + (dy || 0)).toFixed(1) + 'px) translate(-50%,-100%) scale(' + kL + ')';
    node.style.opacity = o.toFixed(3);
  }
  var TOP_MAIN = new THREE.Vector3(0, 2.36, -0.6);
  var BL_ANG = 0.3;
  var blPts = R.map(function (r) { return new THREE.Vector3(Math.cos(BL_ANG) * r, 0.02, ZC + Math.sin(BL_ANG) * r); });
  var tmpV = new THREE.Vector3();

  var CAPS = ['¿Cuánta energía liberaría?', 'Cálculo IEEE 1584', 'Fronteras de aproximación', 'Protección antes de cruzar', 'Etiqueta según NOM-029-STPS'];
  var P = [0, 3, 6.2, 9.4, 12.8, 16];
  var lastPh = -1;

  function update(t, still) {
    var ph = t < P[1] ? 0 : t < P[2] ? 1 : t < P[3] ? 2 : t < P[4] ? 3 : 4;
    if (ph !== lastPh) {
      el.cap.textContent = CAPS[ph];
      for (var b = 0; b < 5; b++) el.bars[b].style.background = b === ph ? ORANGE : b < ph ? NAVY : GRAY;
      lastPh = ph;
    }
    el.cap.style.opacity = still ? 1 : Math.min(ramp(t, P[ph], P[ph] + 0.4), 1 - ramp(t, P[ph + 1] - 0.35, P[ph + 1]));
    var gEnd = 1 - ramp(t, 15.2, 15.9);

    // unifilar y cálculo
    el.uni.style.opacity = ramp(t, 3.05, 3.5) * (1 - ramp(t, 6.3, 6.8));
    el.uni.style.transform = 'translateY(' + ((1 - ramp(t, 3.05, 3.5)) * -6).toFixed(1) + 'px)';
    var dr = [ramp(t, 3.3, 3.7), ramp(t, 3.65, 4.1), ramp(t, 4.05, 4.45)];
    for (var i = 0; i < 3; i++) { el.uniP[i].setAttribute('stroke-dashoffset', (1 - dr[i]).toFixed(3)); el.uniT[i].setAttribute('opacity', ramp(t, 3.5 + i * 0.38, 3.8 + i * 0.38).toFixed(3)); }
    el.uniHi.setAttribute('opacity', ramp(t, 4.5, 4.8).toFixed(3));
    var top = proj(TOP_MAIN);
    place(el.main, top[0], top[1], ramp(t, 0.3, 0.9) * (1 - ramp(t, 6.3, 6.8)));
    var eo = ramp(t, 4.3, 4.7) * (1 - ramp(t, 6.3, 6.8));
    place(el.energy, top[0], top[1], eo, -40 + (1 - ramp(t, 4.3, 4.7)) * 6);
    el.eVal.textContent = (5.9 * eOut(ramp(t, 4.4, 5.6))).toFixed(1);

    // fronteras
    var arcEmph = Math.max(win(t, 8.8, 9.7, 0.3), win(t, 12.4, 13.4, 0.3));
    for (i = 0; i < 3; i++) {
      var d = eOut(ramp(t, 6.3 + i * 0.28, 7.1 + i * 0.28));
      var B = bounds[i];
      B.f.geometry.setDrawRange(0, Math.round(d * SEG) * 3);
      B.e.geometry.setDrawRange(0, Math.round(d * SEG) * 6);
      var vis = d > 0 && gEnd > 0;
      B.f.visible = B.e.visible = vis;
      B.f.material.opacity = FILL_OP[i] * gEnd * (i === 0 ? 1 + arcEmph * 0.5 : 1);
      B.e.material.opacity = 0.95 * gEnd;
      var lp = proj(blPts[i]);
      var lo = ramp(t, 7.0 + i * 0.28, 7.35 + i * 0.28) * (1 - ramp(t, 13.1, 13.45));
      el.bl[i].style.transform = 'translate(' + lp[0].toFixed(1) + 'px,' + lp[1].toFixed(1) + 'px) translate(0,-50%) translateX(8px) scale(' + ((i === 0 ? 1 + arcEmph * 0.06 : 1) * kL).toFixed(3) + ')';
      el.bl[i].style.transformOrigin = '0 50%';
      el.bl[i].style.opacity = lo.toFixed(3);
      if (i === 0) el.bl[i].style.boxShadow = arcEmph > 0.01 ? '0 0 0 ' + (1.5 * arcEmph).toFixed(2) + 'px #fc9f01' : 'none';
    }

    // técnico
    var z, walk = 0, wp;
    if (t < 7.2) z = 3.4;
    else if (t < 8.8) { wp = ramp(t, 7.2, 8.8); z = lerp(3.4, 2.25, ease(wp)); walk = Math.min(1, wp * 5, (1 - wp) * 5); }
    else if (t < 10.4) z = 2.25;
    else if (t < 11.3) { wp = ramp(t, 10.4, 11.3); z = lerp(2.25, 0.69, ease(wp)); walk = Math.min(1, wp * 5, (1 - wp) * 5); }
    else if (t < 13.4) z = 0.69;
    else if (t < 14.7) { wp = ramp(t, 13.4, 14.7); z = lerp(0.69, 2.5, ease(wp)); walk = Math.min(1, wp * 5, (1 - wp) * 5); }
    else z = 2.5;
    tech.position.z = z;
    var stride = t * Math.PI * 2 * 1.5;
    var sw = Math.sin(stride) * 0.42 * walk;
    legs[0].rotation.x = sw; legs[1].rotation.x = -sw;
    arms[0].rotation.x = -sw * 0.8; arms[1].rotation.x = sw * 0.8;
    tech.position.y = Math.abs(Math.sin(stride)) * 0.025 * walk;
    tech.rotation.y = lerp(Math.PI, Math.PI * 2, ease(ramp(t, 13.05, 13.45)));
    techOpacity(ramp(t, 6.9, 7.3) * gEnd);
    var h = t < 9.5 ? -1 : lerp(-0.05, 2.05, ease(ramp(t, 9.5, 10.25)));
    clipN.constant = -h; clipS.constant = h;
    ring.position.y = Math.max(0, h);
    ringMat.opacity = win(t, 9.45, 10.3, 0.15);
    ring.visible = ringMat.opacity > 0.001;
    tmpV.set(tech.position.x, 2.05, tech.position.z);
    var cp = proj(tmpV);
    place(el.cat, cp[0], cp[1], ramp(t, 10.1, 10.4) * (1 - ramp(t, 13.1, 13.4)), (1 - ramp(t, 10.1, 10.4)) * 6);

    // puerta, arco y onda
    mainDoor.rotation.y = -1.05 * ease(ramp(t, 11.3, 11.7)) * (1 - ease(ramp(t, 12.9, 13.3)));
    var fl = 0;
    if (t > 11.85 && t < 12.4) { var fp = ramp(t, 11.85, 12.4); fl = fp < 0.18 ? fp / 0.18 : Math.pow(1 - (fp - 0.18) / 0.82, 1.6); }
    flash.visible = fl > 0.001;
    flashMat.opacity = fl * 0.95;
    flash.scale.setScalar(0.5 + 1.3 * fl);
    arcLight.intensity = 0.3 * K * fl;
    var wv = eOut(ramp(t, 11.9, 12.55));
    var wo = t >= 11.9 ? (1 - ramp(t, 12.55, 13.25)) : 0;
    var wr = 0.25 + (R[0] - 0.25) * wv;
    wave.visible = waveFloor.visible = wo > 0.001;
    wave.scale.set(wr, 0.55 - 0.25 * wv, wr);
    waveMat.opacity = 0.5 * wo;
    waveFloor.scale.set(wr, wr, 1);
    waveFloorMat.opacity = 0.16 * wo;

    // etiqueta
    var ls = eOut(ramp(t, 13.35, 13.65)) * gEnd;
    doorLabel.scale.setScalar(Math.max(0.001, ls));
    var co = ramp(t, 13.5, 13.9) * gEnd;
    el.card.style.opacity = co.toFixed(3);
    el.card.style.transform = 'translateY(' + ((1 - ramp(t, 13.5, 13.9)) * 8).toFixed(1) + 'px)';
    var so = ramp(t, 14.0, 14.25);
    el.seal.style.opacity = (so * gEnd).toFixed(3);
    el.seal.style.transform = 'rotate(-6deg) scale(' + (1.25 - 0.25 * eOut(so)).toFixed(3) + ')';
    doorLabel.getWorldPosition(tmpV);
    var dp = proj(tmpV);
    var ax = 700 - 214 * kC, ay = 494 - 164 * kC;
    el.leader.style.opacity = (ramp(t, 13.7, 14.0) * gEnd).toFixed(3);
    el.leaderLine.setAttribute('points', ax + ',' + ay + ' ' + (ax - 16) + ',' + ay + ' ' + dp[0].toFixed(1) + ',' + dp[1].toFixed(1));
    el.leaderDot.setAttribute('cx', dp[0].toFixed(1)); el.leaderDot.setAttribute('cy', dp[1].toFixed(1));

    renderer.render(scene, camera);
  }

  /* ---------- Tamaño, ciclo y limpieza ---------- */
  var scale = 1, kL = '1', kC = 1;
  function resize() {
    var w = wrap.getBoundingClientRect().width;
    if (!w) return;
    scale = w / W;
    stage.style.transform = 'scale(' + scale + ')';
    renderer.setPixelRatio(Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * scale)));
    // En teléfono los rótulos crecen para seguir legibles
    var kR = scale < 0.75 ? Math.min(1.7, 0.8 / scale) : 1;
    kL = Math.min(kR, 1.6).toFixed(3); kC = Math.min(kR, 1.4);
    var kT = Math.min(kR, 1.45);
    el.head.style.scale = kT; el.head.style.maxWidth = (kR > 1 ? Math.round(420 / kT) : 340) + 'px';
    el.uni.style.transformOrigin = '100% 0'; el.uni.style.scale = Math.min(kR, 1.3);
    el.card.style.transformOrigin = '100% 100%'; el.card.style.scale = kC;
    el.seal.style.scale = Math.min(kR, 1.35); el.seal.style.left = (kR > 1 ? 400 : 452) + 'px';
    renderer.setSize(W, H, false);
    if (reduce) update(14.8, true);
  }
  var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(wrap);
  window.addEventListener('resize', resize);

  var visible = true;
  var io = window.IntersectionObserver ? new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }) : null;
  if (io) io.observe(wrap);

  var raf = 0, clock = 0, last = 0, paused = false;
  function loop(now) {
    raf = requestAnimationFrame(loop);
  var raf0 = requestAnimationFrame(resize);
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (!visible || reduce || paused) return;
    clock = (clock + dt) % T;
    update(clock, false);
  }
  function onMotion() { reduce = !!(mq && mq.matches); if (reduce) update(14.8, true); }
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', onMotion); else if (mq.addListener) mq.addListener(onMotion); }

  resize();
  if (reduce) update(14.8, true); else update(0, false);
  raf = requestAnimationFrame(loop);
  var raf0 = requestAnimationFrame(resize);

  function limpiar() {
    cancelAnimationFrame(raf);
    if (ro) ro.disconnect();
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(raf0);
    if (io) io.disconnect();
    if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', onMotion); else if (mq.removeListener) mq.removeListener(onMotion); }
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { var ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(function (m) { if (m.map) m.map.dispose(); if (m.alphaMap) m.alphaMap.dispose(); m.dispose(); }); }
    });
    renderer.dispose();
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
  }
  limpiar.irA = function (s) { paused = s != null; if (paused) { clock = s; update(s, false); } };
  return limpiar;
}
