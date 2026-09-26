/**
 * Escena "Alineación y balanceo": el motor con la bomba vibrando por
 * desalineación, los cabezales láser con el desfase fuera de tolerancia,
 * la corrección con calzas, el balanceo con contrapeso y el antes y después
 * de la vibración.
 *
 * Generada en Claude Diseño (docs/designs/alineacion-balanceo-escena.html)
 * y portada como las demás: recibe THREE y el contenedor y devuelve la
 * limpieza. Escrita para r128. Ajuste propio: en teléfono las tarjetas de
 * las esquinas crecen desde su esquina, y la densidad sigue a la escala.
 */
/* eslint-disable */
export function montarEscenaAlineacion(THREE, container, opciones) {
  var fixedT = opciones && typeof opciones.tiempo === 'number' ? opciones.tiempo : null;
  var W = 720, H = 540, LOOP = 16;
  var C = { navy: 0x002e46, mid: 0x2b5671, gray: 0xd9e2e8, orange: 0xfc9f01 };
  var RED = '#c9372c', GREEN = '#1f8a4c';
  var rev = parseInt(THREE.REVISION, 10) || 128;
  var LK = rev >= 155 ? Math.PI : rev >= 152 ? 1 : 0.8;

  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var smooth = function (a, b, t) { var x = clamp((t - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
  var win = function (t, a, b, f) { f = f || 0.3; return smooth(a, a + f, t) * (1 - smooth(b - f, b, t)); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };

  // ---------- DOM ----------
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.style.overflow = 'hidden';
  if (!container.style.height && !container.style.aspectRatio && !container.clientHeight) container.style.aspectRatio = '4 / 3';

  var stage = document.createElement('div');
  stage.style.cssText = 'position:absolute;left:0;top:0;width:720px;height:540px;transform-origin:0 0;overflow:hidden;' +
    'background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%);color:#002e46;' +
    'font-family:"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;';
  container.appendChild(stage);

  var ARC = Math.PI * 48;
  var card = 'background:rgba(255,255,255,0.92);border:1px solid #d9e2e8;border-radius:10px;box-shadow:0 6px 18px rgba(0,46,70,0.08);';
  var lbl = 'position:absolute;left:0;top:0;white-space:nowrap;font-size:26px;font-weight:700;letter-spacing:-0.01em;opacity:0;';
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  overlay.innerHTML =
    '<div style="position:absolute;left:28px;top:24px;">' +
      '<div data-k="steps" style="display:flex;gap:6px;margin-bottom:12px;">' +
        '<span></span><span></span><span></span><span></span><span></span>' +
      '</div>' +
      '<div style="position:relative;height:36px;">' +
        '<div data-k="l0" style="' + lbl + '">Vibración alta</div>' +
        '<div data-k="l1" style="' + lbl + '">Alineación láser</div>' +
        '<div data-k="l2" style="' + lbl + '">Balanceo dinámico</div>' +
      '</div>' +
    '</div>' +
    '<div data-k="meter" style="position:absolute;right:22px;top:18px;width:148px;padding:10px 12px 8px;box-sizing:border-box;' + card + '">' +
      '<div style="font-size:13px;font-weight:600;color:#2b5671;">Vibración</div>' +
      '<svg width="124" height="66" viewBox="0 0 124 66" style="display:block;margin:2px auto 0;">' +
        '<path d="M 14 60 A 48 48 0 0 1 110 60" fill="none" stroke="#d9e2e8" stroke-width="9" stroke-linecap="round"></path>' +
        '<path data-k="arc" d="M 14 60 A 48 48 0 0 1 110 60" fill="none" stroke="' + RED + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + ARC + '" stroke-dashoffset="0"></path>' +
        '<line data-k="needle" x1="62" y1="60" x2="62" y2="24" stroke="#002e46" stroke-width="3" stroke-linecap="round"></line>' +
        '<circle cx="62" cy="60" r="5" fill="#002e46"></circle>' +
      '</svg>' +
      '<div style="display:flex;align-items:baseline;justify-content:center;gap:4px;">' +
        '<span data-k="mval" style="font-size:24px;font-weight:700;font-variant-numeric:tabular-nums;color:' + RED + ';">7.8</span>' +
        '<span style="font-size:13px;font-weight:600;">mm/s</span>' +
      '</div>' +
    '</div>' +
    '<div data-k="align" style="position:absolute;left:28px;bottom:26px;width:236px;padding:14px 16px;box-sizing:border-box;opacity:0;' + card + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;">' +
        '<span style="font-size:13px;font-weight:600;color:#2b5671;">Paralelo</span>' +
        '<span data-k="par" style="font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;">0.42 mm</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px;">' +
        '<span style="font-size:13px;font-weight:600;color:#2b5671;">Angular</span>' +
        '<span data-k="ang" style="font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;">0.09 mm/100</span>' +
      '</div>' +
      '<div data-k="stat" style="display:inline-block;margin-top:12px;padding:5px 11px;border-radius:999px;font-size:13px;font-weight:700;background:#fc9f01;color:#002e46;">Fuera de tolerancia</div>' +
    '</div>' +
    '<div data-k="ba" style="position:absolute;left:50%;bottom:26px;width:392px;margin-left:-196px;padding:16px 18px 16px;box-sizing:border-box;opacity:0;' + card + '">' +
      '<div style="font-size:19px;font-weight:700;margin-bottom:12px;">Vibración: 7.8 → 1.6 mm/s</div>' +
      '<div style="display:grid;grid-template-columns:62px 1fr 34px;gap:8px 10px;align-items:center;font-size:13px;font-weight:600;">' +
        '<span style="color:#2b5671;">Antes</span>' +
        '<div style="height:12px;border-radius:6px;background:#eef1f4;overflow:hidden;"><div data-k="b0" style="height:100%;width:0;border-radius:6px;background:' + RED + ';"></div></div>' +
        '<span style="font-variant-numeric:tabular-nums;color:' + RED + ';">7.8</span>' +
        '<span style="color:#2b5671;">Después</span>' +
        '<div style="height:12px;border-radius:6px;background:#eef1f4;overflow:hidden;"><div data-k="b1" style="height:100%;width:0;border-radius:6px;background:' + GREEN + ';"></div></div>' +
        '<span style="font-variant-numeric:tabular-nums;color:' + GREEN + ';">1.6</span>' +
      '</div>' +
      '<div data-k="stamp" style="position:absolute;right:-12px;top:-20px;padding:7px 12px;border-radius:6px;background:#fc9f01;color:#002e46;border:2px solid #002e46;font-size:13px;font-weight:700;white-space:nowrap;opacity:0;box-shadow:0 4px 12px rgba(0,46,70,0.15);">Medido antes y después</div>' +
    '</div>';
  var q = function (k) { return overlay.querySelector('[data-k="' + k + '"]'); };
  var el = {
    steps: q('steps').children, l: [q('l0'), q('l1'), q('l2')], meter: q('meter'), arc: q('arc'), needle: q('needle'),
    mval: q('mval'), align: q('align'), par: q('par'), ang: q('ang'), stat: q('stat'), ba: q('ba'), b0: q('b0'), b1: q('b1'), stamp: q('stamp')
  };
  var titulo = el.l[0].parentNode.parentNode;
  for (var si = 0; si < 5; si++) el.steps[si].style.cssText = 'display:block;width:22px;height:4px;border-radius:2px;background:#d9e2e8;';

  // ---------- Three ----------
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.cssText = 'position:absolute;left:0;top:0;width:720px;height:540px;';
  stage.appendChild(renderer.domElement);
  stage.appendChild(overlay);

  var scene = new THREE.Scene();
  var viewH = 3.25, aspect = W / H;
  var camera = new THREE.OrthographicCamera(-viewH * aspect / 2, viewH * aspect / 2, viewH / 2, -viewH / 2, 0.1, 60);
  var target = new THREE.Vector3(0.1, 0.42, 0);
  camera.position.copy(target).add(new THREE.Vector3(0.62, 0.56, 1).normalize().multiplyScalar(14));
  camera.lookAt(target);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9e2e8, 0.62 * LK));
  var sun = new THREE.DirectionalLight(0xffffff, 0.78 * LK);
  sun.position.set(2.2, 6, 3.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  var sc = sun.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sc.near = 0.5; sc.far = 16;
  sun.shadow.radius = 4; sun.shadow.bias = -0.0006;
  scene.add(sun);

  var mats = [];
  var mat = function (name, color, rough, metal) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough, metalness: metal });
    m.name = name; mats.push(m); return m;
  };
  var navy = mat('azul_marino', C.navy, 0.55, 0.15);
  var mid = mat('azul_medio', C.mid, 0.5, 0.15);
  var gray = mat('gris_base', C.gray, 0.9, 0.0);
  var steel = mat('acero', C.gray, 0.35, 0.2);
  var orange = mat('naranja_diapsa', C.orange, 0.45, 0.05);
  var laser = new THREE.MeshBasicMaterial({ color: C.orange }); laser.name = 'laser'; mats.push(laser);
  var glow = new THREE.MeshBasicMaterial({ color: C.orange, transparent: true, opacity: 0.28, depthWrite: false }); glow.name = 'laser_halo'; mats.push(glow);
  var shadowMat = new THREE.ShadowMaterial({ opacity: 0.1 }); mats.push(shadowMat);

  var mesh = function (geo, m, name, x, y, z, parent) {
    var o = new THREE.Mesh(geo, m); o.name = name; o.position.set(x, y, z);
    o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
  };
  var box = function (w, h, d, m, name, x, y, z, p) { return mesh(new THREE.BoxGeometry(w, h, d), m, name, x, y, z, p); };
  var cylX = function (r, len, m, name, x, y, z, p, seg) {
    var g = new THREE.CylinderGeometry(r, r, len, seg || 40); g.rotateZ(Math.PI / 2); return mesh(g, m, name, x, y, z, p);
  };
  var cylY = function (r, len, m, name, x, y, z, p) { return mesh(new THREE.CylinderGeometry(r, r, len, 36), m, name, x, y, z, p); };
  var group = function (name, parent) { var g = new THREE.Group(); g.name = name; parent.add(g); return g; };

  var ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), shadowMat);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  var B = 0.16, SHIM = 0.07, MH = 0.42, PH = SHIM + MH;
  box(3.5, 0.06, 1.3, gray, 'losa', 0.05, 0.03, 0, scene);
  box(3.2, 0.1, 1.0, gray, 'base', 0.05, 0.11, 0, scene);

  // Tren motor–bomba
  var train = group('tren_motor_bomba', scene);
  var shake = group('vibracion', train);

  var M = group('motor', shake);
  [-0.28, 0.28].forEach(function (sx) { [-0.3, 0.3].forEach(function (sz) { box(0.16, 0.06, 0.14, navy, 'pata_motor', sx, 0.03, sz, M); }); });
  [-0.27, 0.27].forEach(function (sz) { box(0.72, 0.12, 0.08, navy, 'cuna_motor', 0, 0.12, sz, M); });
  cylX(0.34, 0.8, navy, 'carcasa_motor', 0, MH, 0, M, 48);
  for (var i = 0; i < 7; i++) cylX(0.356, 0.025, navy, 'aleta_motor', -0.33 + i * 0.11, MH, 0, M, 48);
  cylX(0.29, 0.06, mid, 'tapa_motor', 0.43, MH, 0, M);
  cylX(0.3, 0.18, mid, 'cubierta_ventilador', -0.49, MH, 0, M);
  box(0.24, 0.14, 0.22, navy, 'caja_bornes', 0.05, MH + 0.39, 0, M);
  var mSpin = group('giro_motor', M); mSpin.position.set(0, MH, 0);
  cylX(0.045, 0.42, steel, 'eje_motor', 0.64, 0, 0, mSpin, 24);
  cylX(0.13, 0.1, mid, 'acople_motor', 0.8, 0, 0, mSpin);
  box(0.104, 0.04, 0.03, steel, 'marca_acople', 0.8, 0.118, 0, mSpin);

  var P = group('bomba', shake); P.position.set(0, B, 0);
  var pSpin = group('giro_bomba', P); pSpin.position.set(0, PH, 0);
  cylX(0.13, 0.1, mid, 'acople_bomba', 0.06, 0, 0, pSpin);
  box(0.104, 0.04, 0.03, steel, 'marca_acople', 0.06, 0.118, 0, pSpin);
  cylX(0.045, 0.4, steel, 'eje_bomba', 0.3, 0, 0, pSpin, 24);
  cylX(0.16, 0.46, mid, 'soporte_rodamientos', 0.72, PH, 0, P);
  box(0.34, PH - 0.08, 0.3, navy, 'pedestal_bomba', 0.72, (PH - 0.08) / 2, 0, P);
  cylX(0.36, 0.28, mid, 'voluta', 1.12, PH, 0, P, 48);
  cylX(0.26, 0.06, mid, 'tapa_voluta', 0.96, PH, 0, P);
  box(0.34, 0.14, 0.44, navy, 'pata_bomba', 1.12, 0.07, 0, P);
  cylY(0.1, 0.52, mid, 'descarga', 1.12, PH + 0.36, -0.2, P);
  cylY(0.15, 0.04, navy, 'brida_descarga', 1.12, PH + 0.62, -0.2, P);
  cylX(0.11, 0.26, mid, 'succion', 1.39, PH, 0, P);
  cylX(0.16, 0.04, navy, 'brida_succion', 1.52, PH, 0, P);

  var makeHead = function (name, parent, x, y, dir) {
    var g = group(name, parent); g.position.set(x, y, 0);
    var t = new THREE.TorusGeometry(0.058, 0.016, 12, 32); t.rotateY(Math.PI / 2);
    mesh(t, navy, 'abrazadera', 0, 0, 0, g);
    box(0.03, 0.2, 0.03, navy, 'poste', 0, 0.13, 0, g);
    box(0.11, 0.16, 0.14, orange, 'cabezal_laser', 0, 0.3, 0, g);
    cylX(0.036, 0.02, navy, 'lente', dir * 0.064, 0.3, 0, g, 24);
    var tip = new THREE.Object3D(); tip.position.set(dir * 0.075, 0.3, 0); g.add(tip);
    g.userData.baseY = y; g.userData.tip = tip; g.visible = false;
    return g;
  };
  var headM = makeHead('cabezal_motor', M, 0.55, MH, 1);
  var headP = makeHead('cabezal_bomba', P, 0.4, PH, -1);

  var beamGeo = new THREE.CylinderGeometry(1, 1, 1, 16); beamGeo.translate(0, 0.5, 0);
  var beam = mesh(beamGeo, laser, 'haz_laser', 0, 0, 0, train); beam.castShadow = false;
  var halo = mesh(beamGeo, glow, 'haz_halo', 0, 0, 0, train); halo.castShadow = false;
  beam.visible = halo.visible = false;

  var shims = [];
  [-0.28, 0.28].forEach(function (sx) {
    [-0.3, 0.3].forEach(function (sz) {
      var g = group('calzas', train);
      for (var k = 0; k < 3; k++) box(0.18, 0.022, 0.16, mid, 'calza', 0, 0.011 + k * 0.0235, 0, g);
      g.userData.x = -0.85 + sx; g.userData.z = sz; g.position.set(g.userData.x, B, sz); g.visible = false;
      shims.push(g);
    });
  });

  // Rotor
  var rotor = group('rotor_ventilador', scene); rotor.position.set(0.05, B, 0);
  var rShake = group('vibracion_rotor', rotor);
  var RY = 0.82;
  [-0.95, 0.95].forEach(function (x) {
    box(0.42, 0.04, 0.5, mid, 'placa_pedestal', x, 0.02, 0, rShake);
    box(0.28, 0.66, 0.36, navy, 'pedestal', x, 0.37, 0, rShake);
    cylX(0.17, 0.28, navy, 'chumacera', x, RY, 0, rShake);
  });
  var rSpin = group('giro_rotor', rShake); rSpin.position.set(0, RY, 0);
  cylX(0.05, 2.3, steel, 'eje_rotor', 0, 0, 0, rSpin, 24);
  cylX(0.6, 0.05, gray, 'disco_rotor', 0, 0, 0, rSpin, 64);
  cylX(0.13, 0.28, mid, 'maza', 0.05, 0, 0, rSpin);
  var ring = new THREE.TorusGeometry(0.585, 0.022, 12, 64); ring.rotateY(Math.PI / 2);
  mesh(ring, mid, 'anillo_frontal', 0.165, 0, 0, rSpin);
  for (var b = 0; b < 8; b++) {
    var piv = group('alabe_' + (b + 1), rSpin); piv.rotation.x = b * Math.PI / 4;
    box(0.14, 0.42, 0.05, mid, 'alabe', 0.095, 0.36, 0, piv);
  }
  box(0.17, 0.1, 0.17, navy, 'punto_pesado', 0, 0.65, 0, rSpin);
  var cw = box(0.16, 0.09, 0.16, orange, 'contrapeso', 0, -0.645, 0, rSpin);

  // ---------- Animación ----------
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var theta = 0, phi = 0, cache = {};
  var set = function (key, node, prop, val) { if (cache[key] !== val) { cache[key] = val; node.style[prop] = val; } };
  var txt = function (key, node, val) { if (cache[key] !== val) { cache[key] = val; node.textContent = val; } };
  var vA = new THREE.Vector3(), vB = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  function update(t, dt, still) {
    // Tren
    var trainS = smooth(0, 0.6, t) * (1 - smooth(10.0, 10.5, t));
    train.visible = trainS > 0.001; train.scale.setScalar(Math.max(trainS, 0.001));
    var wT = 4 * Math.PI * (1 - smooth(3.0, 3.5, t) + smooth(9.2, 10.0, t));
    theta += wT * dt;
    mSpin.rotation.x = pSpin.rotation.x = theta;
    var s = 1 - smooth(3.0, 3.4, t);
    shake.position.set(0.004 * s * Math.sin(2 * theta), 0.008 * s * Math.sin(2 * theta + 0.5), 0.012 * s * Math.sin(theta));

    var mis = 1 - smooth(8.0, 9.0, t);
    var lift = lerp(0, SHIM + 0.03, smooth(7.0, 7.6, t)) - 0.03 * smooth(8.0, 9.0, t);
    M.position.set(-0.85, B + lift, 0.1 * mis);
    M.rotation.set(0, -0.07 * mis, -0.03 * mis);
    var sp = smooth(7.4, 8.0, t);
    shims.forEach(function (g, k) {
      g.visible = sp > 0.001 && t < 10.6;
      g.position.set(g.userData.x, B, g.userData.z + (1 - smooth(7.4 + k * 0.05, 8.0, t)) * 0.7);
    });

    [[headM, 3.0], [headP, 3.2]].forEach(function (h) {
      var p = smooth(h[1], h[1] + 0.5, t) * (1 - smooth(9.3, 9.7, t));
      h[0].visible = p > 0.001;
      h[0].position.y = h[0].userData.baseY + (1 - p) * 0.5;
      h[0].scale.setScalar(Math.max(p, 0.001));
    });

    scene.updateMatrixWorld(true);
    var f = t < 9.3 ? smooth(3.8, 4.2, t) : 0;
    beam.visible = halo.visible = f > 0.001;
    if (f > 0.001) {
      headM.userData.tip.getWorldPosition(vA); headP.userData.tip.getWorldPosition(vB);
      train.worldToLocal(vA); train.worldToLocal(vB);
      vB.sub(vA); var len = vB.length() * f; vB.normalize();
      [[beam, 0.008], [halo, 0.022]].forEach(function (o) {
        o[0].position.copy(vA); o[0].quaternion.setFromUnitVectors(up, vB); o[0].scale.set(o[1], len, o[1]);
      });
    }

    // Rotor
    var rotorS = smooth(10.35, 10.9, t) * (1 - smooth(15.4, 15.95, t));
    rotor.visible = rotorS > 0.001; rotor.scale.setScalar(Math.max(rotorS, 0.001));
    phi += 2 * Math.PI * 0.9 * dt;
    rSpin.rotation.x = phi;
    var u = 1 - 0.93 * smooth(12.2, 12.9, t);
    rShake.position.set(0, 0.022 * u * Math.cos(phi), 0.022 * u * Math.sin(phi));
    rSpin.rotation.y = 0.035 * u * Math.sin(phi + 0.8);
    var cp = smooth(11.7, 12.0, t);
    cw.visible = cp > 0.001; cw.scale.setScalar(Math.max(cp, 0.001));
    cw.position.y = -0.645 - (1 - cp) * 0.12;

    // Capa HTML
    var stepIdx = t < 3 ? 0 : t < 7 ? 1 : t < 10.4 ? 2 : t < 13.6 ? 3 : 4;
    for (var k = 0; k < 5; k++) set('st' + k, el.steps[k], 'background', k === stepIdx ? '#fc9f01' : k < stepIdx ? '#2b5671' : '#d9e2e8');
    [[0.15, 3.0], [3.1, 10.1], [10.8, 13.6]].forEach(function (w, k) {
      var o = still && k === 2 ? 1 : win(t, w[0], w[1]);
      set('lo' + k, el.l[k], 'opacity', o.toFixed(3));
      set('lt' + k, el.l[k], 'transform', 'translateY(' + ((1 - o) * 6).toFixed(1) + 'px)');
    });

    var mo = clamp(1 - smooth(2.9, 3.2, t) + smooth(10.7, 11.0, t), 0, 1);
    set('mo', el.meter, 'opacity', mo.toFixed(3));
    var jit = still ? 0 : Math.sin(t * 11);
    var v = t < 12.2 ? 7.8 + 0.12 * jit : lerp(7.8, 1.6, smooth(12.2, 12.9, t)) + 0.05 * jit;
    var col = v > 4.5 ? RED : GREEN, fr = clamp(v / 10, 0, 1);
    el.arc.setAttribute('stroke-dashoffset', (ARC * (1 - fr)).toFixed(2));
    if (cache.col !== col) { cache.col = col; el.arc.setAttribute('stroke', col); el.mval.style.color = col; }
    el.needle.setAttribute('transform', 'rotate(' + (-90 + 180 * fr).toFixed(2) + ' 62 60)');
    txt('mv', el.mval, v.toFixed(1));

    set('ao', el.align, 'opacity', win(t, 4.0, 10.1).toFixed(3));
    var e = smooth(8.0, 9.0, t);
    txt('par', el.par, lerp(0.42, 0.02, e).toFixed(2) + ' mm');
    txt('ang', el.ang, lerp(0.09, 0.01, e).toFixed(2) + ' mm/100');
    var ok = t >= 9.0;
    if (cache.ok !== ok) {
      cache.ok = ok;
      el.stat.textContent = ok ? 'Dentro de tolerancia' : 'Fuera de tolerancia';
      el.stat.style.background = ok ? GREEN : '#fc9f01';
      el.stat.style.color = ok ? '#ffffff' : '#002e46';
    }

    set('bao', el.ba, 'opacity', win(t, 13.6, 15.9, 0.35).toFixed(3));
    set('b0', el.b0, 'width', (78 * smooth(13.8, 14.3, t)).toFixed(1) + '%');
    set('b1', el.b1, 'width', (16 * smooth(14.1, 14.6, t)).toFixed(1) + '%');
    var stp = smooth(14.5, 14.8, t);
    set('so', el.stamp, 'opacity', stp.toFixed(3));
    set('sx', el.stamp, 'transform', 'rotate(-5deg) scale(' + (1.25 - 0.25 * stp).toFixed(3) + ')');

    renderer.render(scene, camera);
  }

  var raf = 0, start = performance.now(), last = start;
  function tick(now) {
    raf = requestAnimationFrame(tick);
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    update(((now - start) / 1000) % LOOP, dt, false);
  }
  function renderStill() { theta = 0.6; phi = 0.55; update(12.9, 0, true); }
  function run() {
    cancelAnimationFrame(raf);
    if (fixedT !== null) { theta = 0.6; phi = 0.55; update(fixedT, 0, false); }
    else if (mq && mq.matches) renderStill();
    else { start = last = performance.now(); raf = requestAnimationFrame(tick); }
  }

  function fit() {
    var w = container.clientWidth, h = container.clientHeight || w * H / W;
    var k = Math.min(w / W, h / H);
    stage.style.transform = 'translate(' + ((w - W * k) / 2) + 'px,' + ((h - H * k) / 2) + 'px) scale(' + k + ')';
    renderer.setPixelRatio(Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * k)));
    renderer.setSize(W, H);
    // En teléfono la escena se reduce a menos de la mitad: las tarjetas de
    // las esquinas crecen desde su esquina para seguir legibles.
    var kR = k < 0.6 ? Math.min(1.6, 0.75 / k) : 1;
    titulo.style.transformOrigin = '0 0'; titulo.style.scale = Math.min(kR, 1.3);
    el.meter.style.transformOrigin = '100% 0'; el.meter.style.scale = Math.min(kR, 1.5);
    el.align.style.transformOrigin = '0 100%'; el.align.style.scale = Math.min(kR, 1.5);
    el.ba.style.transformOrigin = '50% 100%'; el.ba.style.scale = Math.min(kR, 1.35);
  }
  fit();
  var ro = window.ResizeObserver ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(container); else window.addEventListener('resize', fit);
  var onMq = function () { run(); };
  if (mq) { mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq); }
  run();

  return function cleanup() {
    cancelAnimationFrame(raf);
    if (ro) ro.disconnect(); else window.removeEventListener('resize', fit);
    if (mq) { mq.removeEventListener ? mq.removeEventListener('change', onMq) : mq.removeListener(onMq); }
    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    mats.forEach(function (m) { m.dispose(); });
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (stage.parentNode) stage.parentNode.removeChild(stage);
  };
}
