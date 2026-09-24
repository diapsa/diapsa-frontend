/**
 * Escena "Cámaras térmicas fijas": de la planta a los equipos críticos, la
 * cámara fija midiendo el tablero, la fase B que sale de su comportamiento
 * aprendido, el módulo de algoritmos e IA que reconoce el patrón, el sello
 * del termógrafo y la alerta en el teléfono.
 *
 * Generada en Claude Diseño (docs/designs/camaras-termicas-escena.html) y
 * portada como las escenas de sensores y del diagnóstico integral: recibe
 * THREE y el contenedor, y devuelve la función de limpieza. Ajuste propio:
 * la densidad de píxeles sigue a la escala, para que no se vea borrosa al
 * ocupar todo el ancho de la página.
 */
/* eslint-disable */
export function montarEscenaTermicas(THREE, container) {
  var W = 720, H = 540, CYCLE = 16;
  var NAVY = 0x002e46, MID = 0x2b5671, GRAY = 0xd9e2e8, ORANGE = 0xfc9f01;
  var FONT = '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", sans-serif';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uid = 'ct' + Math.random().toString(36).slice(2, 7);

  var ss = function (a, b, x) { var k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  var win = function (x, a, b, c, d) { return ss(a, b, x) * (1 - ss(c, d, x)); };
  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };

  // ---------- Escenario ----------
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.style.overflow = 'hidden';
  if (!container.style.aspectRatio && !container.style.height) container.style.aspectRatio = '4 / 3';
  var stage = document.createElement('div');
  stage.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;transform-origin:0 0;overflow:hidden;' +
    'background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%);font-family:' + FONT + ';color:#002e46;user-select:none;';
  container.appendChild(stage);
  var lastCW = -1, lastCH = -1;
  var renderer = null;
  var aplicarRotulos = null, kRot = 1;
  function fit() {
    var cw = container.clientWidth, ch = container.clientHeight;
    if (cw === lastCW && ch === lastCH) return;
    lastCW = cw; lastCH = ch;
    if (!cw) return;
    var s = ch > 0 ? Math.min(cw / W, ch / H) : cw / W;
    stage.style.transform = 'scale(' + s + ')';
    // En teléfono la escena se reduce a menos de la mitad y los rótulos
    // quedan ilegibles: se agrandan en proporción inversa, con tope.
    kRot = s < 0.75 ? Math.min(2.2, 0.8 / s) : 1;
    if (aplicarRotulos) aplicarRotulos();
    if (renderer) {
      renderer.setPixelRatio(Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * s)));
      renderer.setSize(W, H, false);
    }
  }
  fit();
  var ro = window.ResizeObserver ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(container);
  window.addEventListener('resize', fit);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;';
  stage.appendChild(renderer.domElement);
  lastCW = -1; fit();

  var scene = new THREE.Scene();
  var halfH = 5.8, halfW = halfH * W / H;
  var cam = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 200);
  var camOffset = new THREE.Vector3(7, 7.5, 11).normalize().multiplyScalar(40);

  // Luces (r128: sin factor π)
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d3db, 0.78));
  var sun = new THREE.DirectionalLight(0xffffff, 0.5);
  sun.position.set(5, 12, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  var sc = sun.shadow.camera; sc.left = -10; sc.right = 10; sc.top = 10; sc.bottom = -10; sc.near = 1; sc.far = 40;
  sun.shadow.bias = -0.0015;
  scene.add(sun);

  var lam = function (hex, extra) { var m = new THREE.MeshLambertMaterial({ color: hex }); if (extra) Object.assign(m, extra); return m; };
  function add(geo, mat, x, y, z, parent) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    (parent || scene).add(m); return m;
  }
  var box = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
  var cyl = function (r1, r2, h, s) { return new THREE.CylinderGeometry(r1, r2, h, s || 24); };

  var mGray = lam(GRAY), mMid = lam(MID), mNavy = lam(NAVY), mLight = lam(0xf3f6f8), mBox = lam(0xc7d2da), mOrange = lam(ORANGE), mDark = lam(0x0d2231);

  // Piso
  var shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.09 }));
  shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.position.y = -0.17; shadowFloor.receiveShadow = true; scene.add(shadowFloor);
  var slab = add(box(15.6, 0.16, 3.4), lam(0xe6ebef), 0, -0.08, 0.2); slab.castShadow = false;

  // ---------- Equipos ----------
  var TAB_X = -6;
  var critTab = lam(GRAY), critTr = lam(GRAY);
  var equipos = [];

  // 1. Tablero eléctrico principal (crítico)
  var tab = new THREE.Group(); tab.position.x = TAB_X; scene.add(tab);
  add(box(1.8, 2.6, 1.0), critTab, 0, 1.3, 0, tab);
  add(box(1.9, 0.08, 1.1), critTab, 0, 2.64, 0, tab);
  add(box(1.5, 2.2, 0.02), mLight, 0, 1.3, 0.51, tab);
  add(box(1.1, 0.46, 0.14), lam(0xffffff), 0, 1.9, 0.58, tab);
  add(box(0.14, 0.22, 0.08), mNavy, 0, 1.9, 0.68, tab);
  var terms = [], spots = [];
  var heatTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  for (var i = -1; i <= 1; i++) {
    add(box(0.1, 0.5, 0.05), mMid, i * 0.4, 1.46, 0.55, tab);
    add(box(0.08, 0.62, 0.05), mMid, i * 0.4, 0.66, 0.55, tab);
    var tm = lam(0x3a7bd5, { emissive: new THREE.Color(0x000000) });
    var t = add(cyl(0.12, 0.12, 0.1, 24), tm, i * 0.4, 1.12, 0.58, tab); t.rotation.x = Math.PI / 2;
    terms.push(tm);
    var sm = new THREE.MeshBasicMaterial({ map: heatTex, transparent: true, depthWrite: false, opacity: 0, color: 0x3a7bd5 });
    var sp = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.9), sm);
    sp.position.set(i * 0.4, 1.14, 0.64); tab.add(sp); spots.push(sp);
  }
  var hinge = new THREE.Group(); hinge.position.set(-0.9, 1.3, 0.5); hinge.rotation.y = -1.95; tab.add(hinge);
  add(box(1.76, 2.5, 0.06), critTab, 0.88, 0, 0, hinge);
  add(box(0.06, 0.3, 0.06), mMid, 1.6, 0, -0.06, hinge);
  equipos.push({ label: 'crit', anchor: new THREE.Vector3(TAB_X, 3.05, 0) });

  // 2. Motor (en ruta)
  var mot = new THREE.Group(); mot.position.x = -3; scene.add(mot);
  add(box(1.7, 0.24, 0.9), mGray, 0, 0.12, 0, mot);
  add(box(0.3, 0.3, 0.7), mGray, -0.45, 0.39, 0, mot); add(box(0.3, 0.3, 0.7), mGray, 0.45, 0.39, 0, mot);
  var mc = add(cyl(0.5, 0.5, 1.3, 32), mGray, 0, 0.82, 0, mot); mc.rotation.z = Math.PI / 2;
  var ms = add(cyl(0.07, 0.07, 0.4, 16), mMid, 0.85, 0.82, 0, mot); ms.rotation.z = Math.PI / 2;
  add(box(0.4, 0.3, 0.4), mGray, -0.1, 1.42, 0, mot);
  equipos.push({ label: 'ruta', anchor: new THREE.Vector3(-3, 1.95, 0) });

  // 3. Transformador (crítico)
  var tr = new THREE.Group(); tr.position.x = 0; scene.add(tr);
  add(box(1.4, 1.5, 1.1), critTr, 0, 0.75, 0, tr);
  for (var f = 0; f < 5; f++) {
    var z = -0.4 + f * 0.2;
    add(box(0.26, 1.15, 0.05), critTr, -0.83, 0.72, z, tr);
    add(box(0.26, 1.15, 0.05), critTr, 0.83, 0.72, z, tr);
  }
  for (var b = -1; b <= 1; b++) {
    add(cyl(0.07, 0.09, 0.42, 16), mLight, b * 0.4, 1.71, 0, tr);
    add(cyl(0.12, 0.12, 0.04, 16), mMid, b * 0.4, 1.9, 0, tr);
  }
  equipos.push({ label: 'crit', anchor: new THREE.Vector3(0, 2.35, 0) });

  // 4. Banda (en ruta)
  var bel = new THREE.Group(); bel.position.x = 3; scene.add(bel);
  add(box(2.4, 0.12, 0.8), mGray, 0, 0.76, 0, bel);
  [-1.2, 1.2].forEach(function (x) { var r = add(cyl(0.13, 0.13, 0.84, 20), mMid, x, 0.76, 0, bel); r.rotation.x = Math.PI / 2; });
  [[-1, -0.3], [-1, 0.3], [1, -0.3], [1, 0.3]].forEach(function (p) { add(box(0.07, 0.7, 0.07), mGray, p[0], 0.35, p[1], bel); });
  var pk1 = add(box(0.4, 0.3, 0.4), mBox, -0.6, 0.97, 0, bel), pk2 = add(box(0.34, 0.26, 0.4), mBox, 0.5, 0.95, 0, bel);
  equipos.push({ label: 'ruta', anchor: new THREE.Vector3(3, 1.6, 0) });

  // 5. Almacén (en ruta)
  var alm = new THREE.Group(); alm.position.x = 6; scene.add(alm);
  [[-0.78, -0.36], [-0.78, 0.36], [0.78, -0.36], [0.78, 0.36]].forEach(function (p) { add(box(0.06, 2.0, 0.06), mGray, p[0], 1.0, p[1], alm); });
  [0.35, 1.0, 1.65].forEach(function (y, k) {
    add(box(1.64, 0.06, 0.8), mGray, 0, y, 0, alm);
    add(box(0.42, 0.34, 0.5), mBox, -0.4 + k * 0.1, y + 0.2, 0, alm);
    if (k !== 1) add(box(0.36, 0.28, 0.5), mBox, 0.35, y + 0.17, 0, alm);
  });
  equipos.push({ label: 'ruta', anchor: new THREE.Vector3(6, 2.45, 0) });

  // ---------- Cámara térmica fija ----------
  var camG = new THREE.Group(); camG.position.set(TAB_X + 3.0, 0, 2.8); scene.add(camG);
  add(cyl(0.26, 0.3, 0.08, 24), mMid, 0, 0.04, 0, camG);
  add(cyl(0.05, 0.05, 2.4, 16), mMid, 0, 1.2, 0, camG);
  add(box(0.5, 0.06, 0.06), mMid, -0.25, 2.4, 0, camG);
  var head = new THREE.Group(); head.position.set(-0.5, 2.4, 0); camG.add(head);
  add(box(0.3, 0.28, 0.55), mOrange, 0, 0, 0, head);
  add(box(0.34, 0.32, 0.06), mNavy, 0, 0, 0.29, head);
  var lens = add(cyl(0.09, 0.09, 0.06, 24), mDark, 0, 0, 0.34, head); lens.rotation.x = Math.PI / 2;
  add(box(0.36, 0.03, 0.34), mMid, 0, 0.17, 0.12, head);
  var aimAt = new THREE.Vector3(TAB_X, 1.2, 0.62);
  camG.updateMatrixWorld(true); head.lookAt(aimAt); camG.updateMatrixWorld(true);
  var lensW = head.localToWorld(new THREE.Vector3(0, 0, 0.36));
  var dir = lensW.clone().sub(aimAt), dist = dir.length();
  var coneMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  var cone = new THREE.Mesh(new THREE.ConeGeometry(0.78, dist, 40, 1, true), coneMat);
  cone.position.copy(aimAt).add(lensW).multiplyScalar(0.5);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  scene.add(cone);
  var headAnchor = lensW.clone().add(new THREE.Vector3(0, 0.45, 0));

  // ---------- Datos de temperatura ----------
  var N = 60, A = [], B = [], C = [];
  for (var k = 0; k <= N; k++) {
    A.push(41 + 2.2 * Math.sin(k * 0.33) + 0.8 * Math.sin(k * 1.1));
    C.push(46 + 1.8 * Math.sin(k * 0.29 + 1.6) + 0.7 * Math.sin(k * 0.9));
    B.push(k <= 34 ? 44 + 2 * Math.sin(k * 0.27 + 3) : 44 + 2 * Math.sin(34 * 0.27 + 3) + (91 - 44 - 2 * Math.sin(34 * 0.27 + 3)) * Math.pow((k - 34) / 26, 1.7));
  }
  var exitIdx = 0; for (k = 0; k <= N; k++) if (B[k] > 54) { exitIdx = k; break; }
  var PX = 40, PW = 236, PY0 = 166, PH = 122;
  var gx = function (k) { return PX + PW * k / N; };
  var gy = function (T) { return PY0 - (T - 30) / 70 * PH; };
  var path = function (arr, a, bnd) { var s = ''; for (var k = a; k <= bnd; k++) s += (k === a ? 'M' : 'L') + gx(k).toFixed(1) + ' ' + gy(arr[k]).toFixed(1); return s; };
  var sampleB = function (p) { var f = p * N, i0 = Math.floor(f), i1 = Math.min(N, i0 + 1); return B[i0] + (B[i1] - B[i0]) * (f - i0); };

  var stops = [[0, '#2f67d8'], [0.32, '#36b4d8'], [0.55, '#f2d33a'], [0.76, '#fc9f01'], [1, '#dc2f27']].map(function (s) { return [s[0], new THREE.Color(s[1])]; });
  var thermal = function (v, out) {
    v = clamp(v);
    for (var i = 1; i < stops.length; i++) if (v <= stops[i][0]) {
      var a = stops[i - 1], b = stops[i]; return out.copy(a[1]).lerp(b[1], (v - a[0]) / (b[0] - a[0]));
    }
    return out.copy(stops[stops.length - 1][1]);
  };
  var heatOf = function (T) { return clamp((T - 34) / 58); };

  // ---------- Capa HTML / SVG ----------
  var pill = 'position:absolute;left:0;top:0;white-space:nowrap;font-size:11px;font-weight:600;letter-spacing:.2px;padding:4px 9px;border-radius:999px;opacity:0;pointer-events:none;';
  var ov = document.createElement('div');
  ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  var exX = PX + PW * exitIdx / N, exY = gy(B[exitIdx]);
  var PANEL_L = 404, PANEL_T = 40;
  ov.innerHTML =
    // conectores
    '<svg width="720" height="540" style="position:absolute;left:0;top:0;overflow:visible">' +
      '<path data-k="c1" d="M' + (PANEL_L + exX) + ' ' + (PANEL_T + exY + 6) + ' C ' + (PANEL_L + exX) + ' 290, 462 262, 462 296" fill="none" stroke="#fc9f01" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path data-k="c2" d="M492 326 L 512 326" fill="none" stroke="#fc9f01" stroke-width="1.6" stroke-linecap="round"/>' +
    '</svg>' +
    // panel de gráfica
    '<div data-k="panel" style="position:absolute;left:' + PANEL_L + 'px;top:' + PANEL_T + 'px;width:292px;height:196px;background:#ffffff;border:1px solid #d9e2e8;border-radius:10px;box-shadow:0 10px 28px rgba(0,46,70,.10),0 2px 6px rgba(0,46,70,.06);opacity:0;">' +
      '<svg width="292" height="196" style="display:block">' +
        '<defs><clipPath id="' + uid + 'clip"><rect data-k="clip" x="' + PX + '" y="0" width="0" height="196"/></clipPath></defs>' +
        '<text x="16" y="24" font-size="12" font-weight="700" fill="#002e46">Temperatura por fase</text>' +
        '<g font-size="10" font-weight="600" fill="#2b5671">' +
          '<line x1="196" y1="20" x2="206" y2="20" stroke="#8aa3b3" stroke-width="2"/><text x="209" y="24">A</text>' +
          '<line x1="224" y1="20" x2="234" y2="20" stroke="#002e46" stroke-width="2"/><text x="237" y="24">B</text>' +
          '<line x1="252" y1="20" x2="262" y2="20" stroke="#2b5671" stroke-width="2" stroke-dasharray="3 2"/><text x="265" y="24">C</text>' +
        '</g>' +
        [40, 70, 100].map(function (T) { return '<line x1="' + PX + '" x2="' + (PX + PW) + '" y1="' + gy(T) + '" y2="' + gy(T) + '" stroke="#eef1f4"/><text x="' + (PX - 6) + '" y="' + (gy(T) + 3) + '" text-anchor="end" font-size="9" fill="#2b5671">' + T + '°</text>'; }).join('') +
        '<rect x="' + PX + '" y="' + gy(54) + '" width="' + PW + '" height="' + (gy(36) - gy(54)) + '" fill="#2b5671" fill-opacity=".11" rx="3"/>' +
        '<text x="' + (PX + 4) + '" y="' + (gy(54) - 5) + '" font-size="10" font-weight="600" fill="#2b5671">Comportamiento aprendido</text>' +
        '<g clip-path="url(#' + uid + 'clip)" fill="none" stroke-linejoin="round" stroke-linecap="round">' +
          '<path d="' + path(A, 0, N) + '" stroke="#8aa3b3" stroke-width="1.8"/>' +
          '<path d="' + path(C, 0, N) + '" stroke="#2b5671" stroke-width="1.8" stroke-dasharray="4 3"/>' +
          '<path d="' + path(B, 0, exitIdx) + '" stroke="#002e46" stroke-width="2.2"/>' +
          '<path d="' + path(B, exitIdx, N) + '" stroke="#dc2f27" stroke-width="2.6"/>' +
        '</g>' +
        '<circle data-k="exit" cx="' + exX + '" cy="' + exY + '" r="5" fill="#ffffff" stroke="#fc9f01" stroke-width="2" opacity="0"/>' +
        '<text data-k="bval" x="' + (PX + PW) + '" y="' + (gy(91) - 8) + '" text-anchor="end" font-size="11" font-weight="700" fill="#dc2f27" opacity="0">91 °C</text>' +
        '<text x="' + (PX + PW) + '" y="184" text-anchor="end" font-size="9" fill="#2b5671">24 h</text>' +
      '</svg>' +
    '</div>' +
    // módulo IA
    '<div data-k="chip" style="position:absolute;left:432px;top:296px;width:60px;opacity:0;display:flex;flex-direction:column;align-items:center;gap:6px;">' +
      '<svg width="60" height="60" viewBox="0 0 60 60">' +
        '<g stroke="#fc9f01" stroke-width="2" stroke-linecap="round">' +
          [18, 26, 34, 42].map(function (p) { return '<line x1="' + p + '" y1="3" x2="' + p + '" y2="10"/><line x1="' + p + '" y1="50" x2="' + p + '" y2="57"/><line x1="3" y1="' + p + '" x2="10" y2="' + p + '"/><line x1="50" y1="' + p + '" x2="57" y2="' + p + '"/>'; }).join('') +
        '</g>' +
        '<rect x="10" y="10" width="40" height="40" rx="7" fill="#002e46"/>' +
        '<rect x="18" y="18" width="24" height="24" rx="4" fill="none" stroke="#fc9f01" stroke-width="1.6"/>' +
        '<g fill="#fc9f01"><circle cx="24" cy="25" r="2.2"/><circle cx="36" cy="25" r="2.2"/><circle cx="30" cy="35" r="2.2"/></g>' +
        '<g stroke="#fc9f01" stroke-width="1.2"><line x1="24" y1="25" x2="36" y2="25"/><line x1="24" y1="25" x2="30" y2="35"/><line x1="36" y1="25" x2="30" y2="35"/></g>' +
      '</svg>' +
      '<div data-k="chipTxt" style="font-size:11px;font-weight:700;white-space:nowrap;color:#002e46">Algoritmos e IA</div>' +
    '</div>' +
    '<div data-k="tag" style="position:absolute;left:512px;top:312px;opacity:0;display:flex;align-items:center;gap:7px;background:#ffffff;border:1.5px solid #fc9f01;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 6px 16px rgba(0,46,70,.08)">' +
      '<span style="width:8px;height:8px;border-radius:50%;background:#dc2f27"></span>Patrón: conexión floja</div>' +
    // sello
    '<div data-k="stamp" style="position:absolute;left:566px;top:372px;width:112px;height:112px;opacity:0;">' +
      '<svg width="112" height="112" viewBox="0 0 112 112">' +
        '<defs><path id="' + uid + 'arc" d="M56 56 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0"/></defs>' +
        '<circle cx="56" cy="56" r="53" fill="#ffffff" stroke="#fc9f01" stroke-width="3"/>' +
        '<circle cx="56" cy="56" r="33" fill="none" stroke="#fc9f01" stroke-width="1.4"/>' +
        '<text font-size="9.6" font-weight="700" letter-spacing="1.3" fill="#002e46"><textPath href="#' + uid + 'arc" textLength="258" lengthAdjust="spacing">REVISADO POR TERMÓGRAFO ·</textPath></text>' +
        '<circle cx="56" cy="56" r="20" fill="#fc9f01"/>' +
        '<path d="M46.5 56.5 l6.5 6.5 l12.5 -13" fill="none" stroke="#002e46" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</div>' +
    // teléfono
    '<div data-k="phoneLabel" style="position:absolute;left:470px;top:34px;width:196px;text-align:center;font-size:12px;font-weight:700;opacity:0;">Alerta en tu teléfono</div>' +
    '<div data-k="phone" style="position:absolute;left:482px;top:60px;width:172px;height:344px;box-sizing:border-box;border-radius:28px;background:#002e46;padding:7px;opacity:0;box-shadow:0 18px 40px rgba(0,46,70,.22);">' +
      '<div style="position:relative;width:100%;height:100%;border-radius:22px;background:linear-gradient(180deg,#fbfcfd,#eef1f4);overflow:hidden;">' +
        '<div style="position:absolute;left:50%;top:7px;width:46px;height:12px;margin-left:-23px;border-radius:8px;background:#002e46"></div>' +
        '<div style="position:absolute;left:14px;top:34px;font-size:10px;font-weight:700;letter-spacing:1.2px;color:#2b5671">DIAPSA</div>' +
        '<div data-k="notif" style="position:absolute;left:9px;right:9px;top:56px;background:#ffffff;border-radius:14px;padding:12px 12px 13px;box-shadow:0 6px 18px rgba(0,46,70,.12);opacity:0;display:flex;flex-direction:column;gap:6px;">' +
          '<div style="display:flex;align-items:center;gap:6px;font-size:10px;font-weight:800;letter-spacing:.8px;color:#dc2f27;text-transform:uppercase"><span data-k="dot" style="width:8px;height:8px;border-radius:50%;background:#dc2f27"></span>Crítico</div>' +
          '<div style="font-size:13px;font-weight:700;color:#002e46">Tablero principal</div>' +
          '<div style="font-size:18px;font-weight:800;color:#dc2f27;letter-spacing:-.3px;white-space:nowrap">Fase B 91 °C</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // rótulos 3D proyectados
    '<div data-k="camLabel" style="' + pill + 'background:#ffffff;border:1px solid #fc9f01;color:#002e46;display:flex;align-items:center;gap:6px;"><span data-k="rec" style="width:7px;height:7px;border-radius:50%;background:#fc9f01"></span>Mide las 24 horas</div>' +
    '<div data-k="bRead" style="' + pill + 'background:#dc2f27;color:#ffffff;">Fase B · 44 °C</div>' +
    ['A', 'B', 'C'].map(function (L) { return '<div data-k="ph' + L + '" style="position:absolute;left:0;top:0;width:18px;height:18px;border-radius:50%;background:#002e46;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;opacity:0">' + L + '</div>'; }).join('') +
    equipos.map(function (e, n) {
      return e.label === 'crit'
        ? '<div data-k="eq' + n + '" style="' + pill + 'background:#002e46;color:#ffffff;display:flex;align-items:center;gap:6px;"><span style="width:6px;height:6px;border-radius:50%;background:#fc9f01"></span>Equipo crítico</div>'
        : '<div data-k="eq' + n + '" style="' + pill + 'background:#ffffff;border:1px solid #d9e2e8;color:#2b5671;">En ruta</div>';
    }).join('') +
    // progreso
    '<div style="position:absolute;left:0;right:0;top:512px;display:flex;justify-content:center;gap:8px;">' +
      [0, 1, 2, 3, 4].map(function (n) { return '<span data-k="st' + n + '" style="width:6px;height:6px;border-radius:3px;background:#d9e2e8;transition:width .35s,background .35s"></span>'; }).join('') +
    '</div>';
  stage.appendChild(ov);
  var q = function (k) { return ov.querySelector('[data-k="' + k + '"]'); };
  var el = {};
  ['c1', 'c2', 'panel', 'clip', 'exit', 'bval', 'chip', 'tag', 'stamp', 'phone', 'phoneLabel', 'notif', 'dot', 'camLabel', 'rec', 'bRead', 'phA', 'phB', 'phC'].forEach(function (k) { el[k] = q(k); });
  var eqEls = equipos.map(function (e, n) { return q('eq' + n); });
  var chipTxt = q('chipTxt');
  aplicarRotulos = function () {
    var k = kRot, kEq = Math.min(k, 1.4);
    [el.camLabel, el.bRead].forEach(function (n) { n.style.fontSize = (11 * k).toFixed(1) + 'px'; n.style.padding = (4 * k).toFixed(1) + 'px ' + (9 * k).toFixed(1) + 'px'; });
    eqEls.forEach(function (n) { n.style.fontSize = (11 * kEq).toFixed(1) + 'px'; n.style.padding = (4 * kEq).toFixed(1) + 'px ' + (9 * kEq).toFixed(1) + 'px'; });
    el.tag.style.fontSize = (12 * k).toFixed(1) + 'px';
    el.tag.style.padding = (6 * k).toFixed(1) + 'px ' + (12 * k).toFixed(1) + 'px';
    el.tag.style.left = k > 1 ? 'auto' : '512px';
    el.tag.style.right = k > 1 ? '10px' : 'auto';
    chipTxt.style.fontSize = (11 * k).toFixed(1) + 'px';
    el.phoneLabel.style.fontSize = (12 * k).toFixed(1) + 'px';
    [el.phA, el.phB, el.phC].forEach(function (n) { var d = (18 * Math.min(k, 1.5)).toFixed(1) + 'px'; n.style.width = d; n.style.height = d; n.style.fontSize = (10 * Math.min(k, 1.5)).toFixed(1) + 'px'; });
  };
  aplicarRotulos();
  var stEls = [0, 1, 2, 3, 4].map(function (n) { return q('st' + n); });
  ['c1', 'c2'].forEach(function (k) { var L = el[k].getTotalLength(); el[k].style.strokeDasharray = L; el[k].style.strokeDashoffset = L; el[k]._L = L; });

  // ---------- Animación ----------
  var baseTarget = new THREE.Vector3(0, 0.9, 0.2), zoomTarget = new THREE.Vector3(TAB_X + 1.45, 1.35, 0.35);
  var target = new THREE.Vector3(), tmpV = new THREE.Vector3(), tmpC = new THREE.Color(), cGray = new THREE.Color(GRAY), cNavy = new THREE.Color(NAVY);
  var termPos = [-0.4, 0, 0.4].map(function (x) { return new THREE.Vector3(TAB_X + x, 1.12, 0.62); });
  function toScreen(v) { tmpV.copy(v).project(cam); return { x: (tmpV.x + 1) * 0.5 * W, y: (1 - tmpV.y) * 0.5 * H }; }
  function place(node, v, op, ox, oy, center) {
    var p = toScreen(v);
    node.style.transform = 'translate(' + (p.x + (ox || 0)) + 'px,' + (p.y + (oy || 0)) + 'px) translate(-50%,' + (center ? '-50%' : '-100%') + ')';
    node.style.opacity = op.toFixed(3);
  }
  var lastStep = -1;

  function frame(t, abs) {
    // 1 · planta
    var crit = win(t, 0.6, 1.4, 15.0, 15.8);
    critTab.color.copy(cGray).lerp(cNavy, crit);
    critTr.color.copy(cGray).lerp(cNavy, crit);
    var z = ss(2.7, 4.1, t) * (1 - ss(14.8, 15.9, t));
    target.copy(baseTarget).lerp(zoomTarget, z);
    cam.position.copy(target).add(camOffset);
    cam.lookAt(target);
    cam.zoom = 1 + 0.85 * z;
    cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    var labRuta = win(t, 0.9, 1.5, 2.5, 3.1), labCrit = win(t, 1.1, 1.7, 2.7, 3.3);
    equipos.forEach(function (e, n) { place(eqEls[n], e.anchor, e.label === 'crit' ? labCrit : labRuta, 0, -4); });

    // 2 · cámara y mapa de calor
    var arm = ss(3.6, 4.6, t) * (1 - ss(14.6, 15.4, t));
    var s = Math.max(0.0001, arm < 1 ? 1 - Math.pow(1 - arm, 3) : 1);
    camG.scale.set(s, s, s);
    coneMat.opacity = 0.13 * ss(4.4, 5.0, t) * (1 - ss(14.4, 15.0, t));
    var heatVis = ss(4.8, 5.6, t) * (1 - ss(15.0, 15.6, t));
    var p = reduce ? 1 : clamp((t - 6.9) / 3.4);
    var Tb = sampleB(p);
    Tb = B[0] + (Tb - B[0]) * (1 - ss(14.6, 15.8, t));
    var TA = A[Math.round(p * N)], TC = C[Math.round(p * N)];
    [TA, Tb, TC].forEach(function (T, i) {
      var h = heatOf(T);
      thermal(h, tmpC);
      terms[i].color.copy(cGray).lerp(tmpC, heatVis);
      terms[i].emissive.copy(tmpC).multiplyScalar(0.3 * heatVis);
      spots[i].material.color.copy(tmpC);
      spots[i].material.opacity = heatVis * (0.55 + 0.4 * h);
      var pulse = i === 1 && h > 0.6 ? 1 + 0.07 * Math.sin(abs * 6) : 1;
      var sz = (0.85 + 0.45 * h) * pulse;
      spots[i].scale.set(sz, sz, 1);
    });
    place(el.camLabel, headAnchor, win(t, 5.0, 5.5, 6.6, 7.1), 40, 80);
    el.rec.style.opacity = (0.55 + 0.45 * Math.sin(abs * 4)).toFixed(2);
    var phOp = win(t, 5.3, 5.9, 12.4, 13.0);
    [el.phA, el.phB, el.phC].forEach(function (n, i) {
      var hot = i === 1 && Tb > 56;
      n.style.background = hot ? '#dc2f27' : '#002e46';
      place(n, termPos[i], phOp, 0, -38, true);
    });
    var bOp = clamp((Tb - 54) / 6) * (1 - ss(14.6, 15.2, t));
    el.bRead.textContent = 'Fase B · ' + Math.round(Tb) + ' °C';
    place(el.bRead, termPos[1], bOp, 0, 34, true);

    // 3 · comportamiento aprendido
    var pan = win(t, 6.2, 6.8, 12.3, 12.9);
    el.panel.style.opacity = pan.toFixed(3);
    el.panel.style.transform = 'translateY(' + ((1 - ss(6.2, 6.8, t)) * 10).toFixed(1) + 'px)';
    el.clip.setAttribute('width', (PW * p).toFixed(1));
    el.exit.setAttribute('opacity', p * N >= exitIdx ? 1 : 0);
    el.bval.setAttribute('opacity', clamp((p - 0.94) / 0.06));

    // 4 · IA, patrón y termógrafo
    var out4 = 1 - ss(12.3, 12.9, t);
    var chip = ss(10.0, 10.5, t) * out4;
    el.chip.style.opacity = chip.toFixed(3);
    el.chip.style.transform = 'scale(' + (0.85 + 0.15 * ss(10.0, 10.5, t)) + ')';
    el.chip.style.filter = 'drop-shadow(0 0 ' + (6 + 4 * Math.sin(abs * 3)).toFixed(1) + 'px rgba(252,159,1,' + (0.35 * chip).toFixed(2) + '))';
    el.c1.style.strokeDashoffset = el.c1._L * (1 - ss(10.1, 10.7, t));
    el.c1.style.opacity = out4;
    el.c2.style.strokeDashoffset = el.c2._L * (1 - ss(10.6, 10.8, t));
    el.c2.style.opacity = out4;
    var tg = ss(10.75, 11.15, t);
    el.tag.style.opacity = (tg * out4).toFixed(3);
    el.tag.style.transform = 'translateX(' + ((1 - tg) * -8).toFixed(1) + 'px)';
    var st = ss(11.35, 11.7, t);
    el.stamp.style.opacity = (st * out4).toFixed(3);
    el.stamp.style.transform = 'rotate(' + (-10 + 4 * st).toFixed(1) + 'deg) scale(' + (1.35 - 0.35 * st).toFixed(3) + ')';

    // 5 · alerta
    var ph = win(t, 12.7, 13.3, 14.7, 15.3);
    el.phone.style.opacity = ph.toFixed(3);
    el.phoneLabel.style.opacity = ph.toFixed(3);
    el.phone.style.transform = 'translateY(' + ((1 - ss(12.7, 13.3, t)) * 24).toFixed(1) + 'px)';
    var nt = ss(13.2, 13.6, t);
    el.notif.style.opacity = nt.toFixed(3);
    el.notif.style.transform = 'translateY(' + ((1 - nt) * -10).toFixed(1) + 'px)';
    el.dot.style.opacity = (0.5 + 0.5 * Math.sin(abs * 5)).toFixed(2);

    // cinta en movimiento (solo ambiente)
    if (!reduce) { pk1.position.x = -1.0 + ((abs * 0.25) % 2); pk2.position.x = -1.0 + ((abs * 0.25 + 1) % 2); }

    var step = t < 3.4 ? 0 : t < 6.5 ? 1 : t < 10 ? 2 : t < 12.6 ? 3 : 4;
    if (step !== lastStep) {
      stEls.forEach(function (n, i) { n.style.width = i === step ? '18px' : '6px'; n.style.background = i === step ? '#002e46' : '#d9e2e8'; });
      lastStep = step;
    }
    renderer.render(scene, cam);
  }

  var raf = 0, start = performance.now();
  if (reduce) {
    frame(12.0, 0);
    var fitTries = 0, fitLoop = function () { fit(); if (++fitTries < 30) raf = requestAnimationFrame(fitLoop); };
    raf = requestAnimationFrame(fitLoop);
  } else {
    var loop = function (now) {
      fit();
      var abs = (now - start) / 1000;
      frame(abs % CYCLE, abs);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  return function cleanup() {
    cancelAnimationFrame(raf);
    if (ro) ro.disconnect();
    window.removeEventListener('resize', fit);
    var mats = new Set();
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { mats.add(m); });
    });
    mats.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
    heatTex.dispose();
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (stage.parentNode) stage.parentNode.removeChild(stage);
  };
}
