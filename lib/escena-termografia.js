/**
 * Escena "Termografía infrarroja": el equipo en operación, el termógrafo en
 * ruta con la cámara, el visor que pasa a infrarrojo y revela la conexión
 * caliente, el ΔT contra su vecino con la prioridad, el sello del analista
 * certificado y la hoja del informe.
 *
 * Generada en Claude Diseño (docs/designs/termografia-escena.html) y
 * portada como las demás: recibe THREE y el contenedor y devuelve la
 * limpieza. Escrita para r128. Ajuste propio: vive en una pestaña de unos
 * 470 px, así que los rótulos crecen cuando la escena se reduce, el sello
 * baja con el panel para no encimarse, y la densidad sigue a la escala.
 */
/* eslint-disable */
export function montarEscenaTermografia(THREE, container) {
  var W = 720, H = 540, CYCLE = 16;
  var NAVY = 0x002e46, MID = 0x2b5671, GRAY = 0xd9e2e8, ORANGE = 0xfc9f01;
  var FONT = '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", sans-serif';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uid = 'tg' + Math.random().toString(36).slice(2, 7);
  var LI = parseInt(THREE.REVISION, 10) >= 155 ? Math.PI : 1; // r155+ usa luces físicas

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
  var renderer = null, kR = 1, ajustarRotulos = null;
  function fit() {
    var cw = container.clientWidth, ch = container.clientHeight;
    if (cw === lastCW && ch === lastCH) return;
    lastCW = cw; lastCH = ch;
    if (!cw) return;
    var s = ch > 0 ? Math.min(cw / W, ch / H) : cw / W;
    stage.style.transform = 'scale(' + s + ')';
    // Pequeña (en la pestaña o en teléfono): los rótulos crecen hacia
    // adentro, con tope por elemento, y la densidad sigue a la escala.
    kR = s < 0.75 ? Math.min(1.8, 0.8 / s) : 1;
    if (renderer) { renderer.setPixelRatio(Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * s))); renderer.setSize(W, H, false); }
    if (ajustarRotulos) ajustarRotulos();
  }
  fit();
  var ro = window.ResizeObserver ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(container);
  window.addEventListener('resize', fit);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;';
  stage.appendChild(renderer.domElement);
  lastCW = -1; fit();

  var scene = new THREE.Scene();
  var halfH = 4.3, halfW = halfH * W / H;
  var cam = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 200);
  var camOffset = new THREE.Vector3(7, 7.5, 11).normalize().multiplyScalar(40);
  var screenRight = new THREE.Vector3(11, 0, -7).normalize();

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d3db, 0.78 * LI));
  var sun = new THREE.DirectionalLight(0xffffff, 0.5 * LI);
  sun.position.set(4, 12, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  var sc = sun.shadow.camera; sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -8; sc.near = 1; sc.far = 40;
  sun.shadow.bias = -0.0015;
  scene.add(sun);

  // Escala térmica (solo en el visor y el termograma)
  var stops = [[0, '#1a2380'], [0.25, '#3350d8'], [0.45, '#33a7d6'], [0.63, '#f2d33a'], [0.8, '#fc9f01'], [1, '#dc2f27']]
    .map(function (s) { return [s[0], new THREE.Color(s[1])]; });
  function thermal(v, out) {
    v = clamp(v);
    for (var i = 1; i < stops.length; i++) if (v <= stops[i][0]) {
      var a = stops[i - 1], b = stops[i]; return out.copy(a[1]).lerp(b[1], (v - a[0]) / (b[0] - a[0]));
    }
    return out.copy(stops[stops.length - 1][1]);
  }
  var heatOf = function (T) { return clamp((T - 20) / 72); };
  var tCache = {};
  function tmat(T) {
    if (tCache[T]) return tCache[T];
    var c = thermal(heatOf(T), new THREE.Color());
    return (tCache[T] = new THREE.MeshLambertMaterial({ color: c.clone().multiplyScalar(0.3), emissive: c.clone().multiplyScalar(0.78) }));
  }

  var lam = function (hex) { return new THREE.MeshLambertMaterial({ color: hex }); };
  function add(geo, mat, x, y, z, parent, T) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    m.userData.T = T == null ? 24 : T;
    (parent || scene).add(m); return m;
  }
  var box = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
  var cyl = function (r1, r2, h, s) { return new THREE.CylinderGeometry(r1, r2, h, s || 24); };
  var mGray = lam(GRAY), mMid = lam(MID), mNavy = lam(NAVY), mLight = lam(0xf3f6f8), mWhite = lam(0xffffff), mOrange = lam(ORANGE), mDark = lam(0x0d2231), mWall = lam(0xeef2f5);

  // ---------- Cuarto eléctrico ----------
  var shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.09 }));
  shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.position.y = -0.15; shadowFloor.receiveShadow = true; scene.add(shadowFloor);
  add(box(8.6, 0.14, 5.4), lam(0xe6ebef), 0, -0.07, 0.2, null, 23).castShadow = false;
  add(box(8.6, 2.9, 0.12), mWall, 0, 1.45, -2.5, null, 23);
  add(box(0.12, 2.9, 5.4), mWall, -4.3, 1.45, 0.2, null, 23);

  // Tablero con puerta abierta y tres interruptores
  var TAB = new THREE.Vector3(-2, 0, -1.4);
  var tab = new THREE.Group(); tab.position.copy(TAB); scene.add(tab);
  add(box(1.8, 2.6, 0.9), mNavy, 0, 1.3, 0, tab, 30);
  add(box(1.9, 0.08, 1.0), mNavy, 0, 2.64, 0, tab, 29);
  add(box(1.5, 2.25, 0.02), mLight, 0, 1.3, 0.46, tab, 32);
  var lugs = [], lugT = [38, 89, 41], brkT = [35, 58, 37], condT = [36, 70, 39];
  for (var i = -1; i <= 1; i++) {
    var n = i + 1;
    add(box(0.36, 0.56, 0.16), mWhite, i * 0.46, 1.78, 0.54, tab, brkT[n]);
    add(box(0.1, 0.18, 0.08), mNavy, i * 0.46, 1.84, 0.64, tab, brkT[n] - 2);
    add(box(0.09, 0.34, 0.05), mMid, i * 0.46, 1.34, 0.52, tab, condT[n]);
    var lg = add(cyl(0.1, 0.1, 0.08, 24), mMid, i * 0.46, 1.12, 0.55, tab, lugT[n]); lg.rotation.x = Math.PI / 2;
    add(box(0.08, 0.72, 0.05), mDark, i * 0.46, 0.68, 0.52, tab, condT[n] - 6);
    lugs.push(new THREE.Vector3(TAB.x + i * 0.46, 1.12, TAB.z + 0.6));
  }
  var hinge = new THREE.Group(); hinge.position.set(-0.9, 1.3, 0.45); hinge.rotation.y = -1.95; tab.add(hinge);
  add(box(1.76, 2.5, 0.06), mNavy, 0.88, 0, 0, hinge, 28);
  add(box(0.06, 0.3, 0.06), mMid, 1.6, 0, 0.06, hinge, 28);

  // Motor acoplado a bomba
  var mb = new THREE.Group(); mb.position.set(1.8, 0, -1.2); scene.add(mb);
  add(box(3.0, 0.2, 1.0), mGray, 0, 0.1, 0, mb, 27);
  add(box(0.3, 0.3, 0.7), mGray, -1.05, 0.35, 0, mb, 40); add(box(0.3, 0.3, 0.7), mGray, -0.25, 0.35, 0, mb, 40);
  var mc = add(cyl(0.48, 0.48, 1.3, 32), mMid, -0.65, 0.82, 0, mb, 48); mc.rotation.z = Math.PI / 2;
  for (var r = 0; r < 5; r++) { var rib = add(cyl(0.5, 0.5, 0.05, 32), mMid, -1.15 + r * 0.25, 0.82, 0, mb, 47); rib.rotation.z = Math.PI / 2; }
  add(box(0.4, 0.28, 0.4), mMid, -0.7, 1.4, 0, mb, 44);
  var shaft = new THREE.Group(); shaft.position.set(0.2, 0.82, 0); mb.add(shaft);
  var sh = add(cyl(0.07, 0.07, 0.5, 16), mNavy, 0, 0, 0, shaft, 42); sh.rotation.z = Math.PI / 2;
  var cp = add(box(0.16, 0.34, 0.34), mOrange, 0, 0, 0, shaft, 40);
  add(box(0.3, 0.46, 0.5), mGray, 0.8, 0.43, 0, mb, 30);
  var vol = add(cyl(0.44, 0.44, 0.4, 32), mGray, 0.9, 0.9, 0, mb, 31); vol.rotation.z = Math.PI / 2;
  add(cyl(0.13, 0.13, 0.8, 20), mGray, 0.9, 1.5, 0, mb, 29);
  var pipe = add(cyl(0.13, 0.13, 0.6, 20), mGray, 1.4, 0.9, 0, mb, 29); pipe.rotation.z = Math.PI / 2;

  // Termógrafo (silueta simple)
  var person = new THREE.Group(); scene.add(person);
  var pMats = [];
  var plam = function (hex) { var m = new THREE.MeshLambertMaterial({ color: hex, transparent: true }); pMats.push(m); return m; };
  var pNavy = plam(NAVY), pMid = plam(MID), pGray = plam(GRAY), pHelmet = plam(0xf6f8fa), pOrange = plam(ORANGE), pDark = plam(0x0d2231);
  var legs = [];
  [-0.12, 0.12].forEach(function (x) { legs.push(add(cyl(0.09, 0.08, 0.82, 16), pNavy, x, 0.41, 0, person, 30)); });
  add(cyl(0.2, 0.25, 0.78, 20), pMid, 0, 1.2, 0, person, 33);
  add(new THREE.SphereGeometry(0.25, 20, 12), pMid, 0, 1.56, 0, person, 33).scale.set(1, 0.35, 0.8);
  add(new THREE.SphereGeometry(0.15, 20, 14), pGray, 0, 1.82, 0, person, 34);
  add(new THREE.SphereGeometry(0.175, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), pHelmet, 0, 1.86, 0, person, 26);
  add(cyl(0.22, 0.22, 0.025, 24), pHelmet, 0, 1.86, 0.02, person, 26);
  var armsG = new THREE.Group(); armsG.position.set(0, 1.46, 0); person.add(armsG);
  [-0.2, 0.2].forEach(function (x) {
    var a = add(cyl(0.055, 0.05, 0.42, 12), pMid, x * 0.8, 0, 0.2, armsG, 33); a.rotation.x = Math.PI / 2; a.rotation.z = -x * 0.5;
  });
  var camHead = new THREE.Group(); camHead.position.set(0, 0.02, 0.44); armsG.add(camHead);
  add(box(0.26, 0.2, 0.28), pOrange, 0, 0, 0, camHead, 31);
  add(box(0.08, 0.16, 0.1), pOrange, 0, -0.16, -0.04, camHead, 31);
  var ln = add(cyl(0.075, 0.085, 0.08, 20), pDark, 0, 0, 0.17, camHead, 28); ln.rotation.x = Math.PI / 2;
  add(box(0.2, 0.14, 0.02), pDark, 0, 0.02, -0.15, camHead, 30);

  var P_END = new THREE.Vector3(0.8, 0, 0.3), P_START = new THREE.Vector3(1.9, 0, 3.0);
  var AIM = new THREE.Vector3(TAB.x, 1.35, TAB.z + 0.55);
  function facePerson() { person.lookAt(AIM.x, 0, AIM.z); }

  // Cono de visión (calculado en la posición final)
  person.position.copy(P_END); facePerson(); armsG.rotation.x = -0.22; scene.updateMatrixWorld(true);
  var lensW = camHead.localToWorld(new THREE.Vector3(0, 0, 0.22));
  var cdir = lensW.clone().sub(AIM), cdist = cdir.length();
  var coneMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  var cone = new THREE.Mesh(new THREE.ConeGeometry(1.05, cdist, 4, 1, true), coneMat);
  cone.geometry.rotateY(Math.PI / 4);
  cone.position.copy(AIM).add(lensW).multiplyScalar(0.5);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cdir.normalize());
  cone.userData.noThermal = true;
  scene.add(cone);

  // Brillo térmico (solo se ve dentro del visor)
  var glowTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  var glows = [];
  function glow(pos, T, size) {
    var m = new THREE.SpriteMaterial({ map: glowTex, color: thermal(heatOf(T), new THREE.Color()), transparent: true, depthWrite: false, depthTest: false, opacity: 0.9 });
    var s = new THREE.Sprite(m); s.position.copy(pos); s.scale.set(size, size, 1); s.layers.set(1); s.userData.base = size;
    scene.add(s); glows.push(s); return s;
  }
  glow(lugs[0], 38, 0.6); glow(lugs[2], 41, 0.62);
  glow(new THREE.Vector3(TAB.x, 1.5, TAB.z + 0.6), 66, 0.9);
  var hot = glow(lugs[1], 92, 0.7);
  var hotCore = glow(lugs[1], 80, 0.34);
  hotCore.material.color.set(0xfff1a8);

  // Materiales normal / térmico
  var meshes = [];
  scene.traverse(function (o) { if (o.isMesh && o !== shadowFloor && !o.userData.noThermal) { o.userData.nm = o.material; o.userData.tm = tmat(o.userData.T); meshes.push(o); } });
  function setThermal(on) { for (var i = 0; i < meshes.length; i++) meshes[i].material = on ? meshes[i].userData.tm : meshes[i].userData.nm; }
  var tabBox = new THREE.Box3(new THREE.Vector3(TAB.x - 0.95, 0.02, TAB.z - 0.45), new THREE.Vector3(TAB.x + 0.95, 2.7, TAB.z + 0.66));
  var corners = []; for (var c = 0; c < 8; c++) corners.push(new THREE.Vector3());

  // ---------- Capa HTML / SVG ----------
  var pill = 'position:absolute;left:0;top:0;white-space:nowrap;font-size:13px;font-weight:600;padding:5px 11px;border-radius:999px;opacity:0;pointer-events:none;';
  var sevCols = ['#3a9d5d', '#3a7bd5', '#f2b01e', '#dc2f27'];
  var ov = document.createElement('div');
  ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  var bracket = function (pos) {
    var h = pos[0] === 't' ? 'top:-2px;' : 'bottom:-2px;', v = pos[1] === 'l' ? 'left:-2px;' : 'right:-2px;';
    var bw = (pos[0] === 't' ? 'border-top' : 'border-bottom') + ':3px solid #fc9f01;' + (pos[1] === 'l' ? 'border-left' : 'border-right') + ':3px solid #fc9f01;';
    return '<div style="position:absolute;' + h + v + 'width:18px;height:18px;' + bw + '"></div>';
  };
  ov.innerHTML =
    '<svg data-k="lines" width="720" height="540" style="position:absolute;left:0;top:0;overflow:visible">' +
      [0, 1, 2].map(function (k) { return '<path data-k="ln' + k + '" fill="none" stroke="' + (k === 1 ? '#dc2f27' : '#2b5671') + '" stroke-width="1.4" opacity="0"/><circle data-k="lc' + k + '" r="3" fill="#ffffff" stroke="' + (k === 1 ? '#dc2f27' : '#2b5671') + '" stroke-width="1.4" opacity="0"/>'; }).join('') +
    '</svg>' +
    '<div data-k="visor" style="position:absolute;left:0;top:0;opacity:0;box-shadow:inset 0 0 0 1px rgba(252,159,1,.45);">' +
      bracket('tl') + bracket('tr') + bracket('bl') + bracket('br') +
      '<div data-k="wipe" style="position:absolute;top:0;bottom:0;left:0;width:2px;background:#fc9f01;opacity:0"></div>' +
      '<div style="position:absolute;right:8px;top:8px;display:flex;align-items:center;gap:5px"><span data-k="rec" style="width:7px;height:7px;border-radius:50%;background:#fc9f01"></span></div>' +
    '</div>' +
    '<div data-k="opLabel" style="' + pill + 'background:#ffffff;border:1px solid #d9e2e8;color:#002e46;display:flex;align-items:center;gap:7px;"><span data-k="opDot" style="width:7px;height:7px;border-radius:50%;background:#3a9d5d"></span>Equipo en operación</div>' +
    '<div data-k="routeLabel" style="' + pill + 'background:#ffffff;border:1px solid #fc9f01;color:#002e46;">Ruta con cámara</div>' +
    ['Fase A 38 °C', 'Fase B 89 °C', 'Fase C 41 °C'].map(function (s, k) {
      return '<div data-k="ph' + k + '" style="' + pill + (k === 1 ? 'background:#dc2f27;color:#ffffff;font-weight:700;' : 'background:#ffffff;border:1px solid #d9e2e8;color:#002e46;') + '">' + s + '</div>';
    }).join('') +
    // Panel de comparación
    '<div data-k="panel" style="position:absolute;left:494px;top:58px;width:208px;box-sizing:border-box;padding:16px 16px 18px;background:#ffffff;border:1px solid #d9e2e8;border-radius:12px;box-shadow:0 10px 28px rgba(0,46,70,.10),0 2px 6px rgba(0,46,70,.06);opacity:0;display:flex;flex-direction:column;gap:14px;">' +
      '<div style="display:flex;flex-direction:column;gap:2px">' +
        '<div style="font-size:13px;font-weight:600;color:#2b5671">ΔT contra su vecino</div>' +
        '<div data-k="dt" style="font-size:38px;font-weight:800;letter-spacing:-.5px;color:#dc2f27;line-height:1.1">+48 °C</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:7px 10px;font-size:12px;font-weight:600;color:#2b5671">' +
        '<span>Fase B</span><div style="height:10px;border-radius:5px;background:#eef1f4;overflow:hidden"><div data-k="barB" style="height:100%;width:0;background:#dc2f27;border-radius:5px"></div></div><span style="color:#002e46;font-weight:700">89 °C</span>' +
        '<span>Fase C</span><div style="height:10px;border-radius:5px;background:#eef1f4;overflow:hidden"><div data-k="barC" style="height:100%;width:0;background:#2b5671;border-radius:5px"></div></div><span style="color:#002e46;font-weight:700">41 °C</span>' +
      '</div>' +
      '<div style="position:relative;display:flex;flex-direction:column;gap:6px;padding-top:30px">' +
        '<div data-k="p1" style="position:absolute;right:0;top:0;white-space:nowrap;background:#dc2f27;color:#fff;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;opacity:0">Prioridad 1</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">' +
          sevCols.map(function (col, k) { return '<div data-k="sv' + k + '" style="height:14px;border-radius:4px;background:' + col + ';opacity:.28"></div>'; }).join('') +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;font-size:12px;font-weight:600;color:#2b5671;text-align:center"><span>P4</span><span>P3</span><span>P2</span><span data-k="p1t">P1</span></div>' +
      '</div>' +
    '</div>' +
    // Sello
    '<div data-k="stamp" style="position:absolute;left:584px;top:304px;width:114px;height:114px;opacity:0;">' +
      '<svg width="114" height="114" viewBox="0 0 112 112">' +
        '<defs><path id="' + uid + 'arc" d="M56 56 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0"/></defs>' +
        '<circle cx="56" cy="56" r="53" fill="#ffffff" stroke="#fc9f01" stroke-width="3"/>' +
        '<circle cx="56" cy="56" r="33" fill="none" stroke="#fc9f01" stroke-width="1.4"/>' +
        '<text font-size="11" font-weight="700" letter-spacing="1.2" fill="#002e46"><textPath href="#' + uid + 'arc" textLength="258" lengthAdjust="spacing">ANALISTA CERTIFICADO ·</textPath></text>' +
        '<circle cx="56" cy="56" r="20" fill="#fc9f01"/>' +
        '<path d="M46.5 56.5 l6.5 6.5 l12.5 -13" fill="none" stroke="#002e46" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
    '</div>' +
    // Informe
    '<div data-k="report" style="position:absolute;left:414px;top:48px;width:278px;box-sizing:border-box;padding:18px 20px 22px;background:#ffffff;border-radius:6px;box-shadow:0 16px 36px rgba(0,46,70,.14),0 2px 6px rgba(0,46,70,.06);opacity:0;display:flex;flex-direction:column;gap:12px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #fc9f01;padding-bottom:8px">' +
        '<span style="font-size:13px;font-weight:700">Informe termográfico</span><span style="font-size:12px;font-weight:700;letter-spacing:1px;color:#2b5671">DIAPSA</span>' +
      '</div>' +
      '<div data-k="r0"><svg width="238" height="126" viewBox="0 0 238 126" style="display:block;border-radius:4px">' +
        '<defs><radialGradient id="' + uid + 'hot"><stop offset="0" stop-color="#fff1a8"/><stop offset=".3" stop-color="#fc9f01"/><stop offset=".65" stop-color="#dc2f27"/><stop offset="1" stop-color="#dc2f27" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="' + uid + 'sc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1a2380"/><stop offset=".25" stop-color="#3350d8"/><stop offset=".45" stop-color="#33a7d6"/><stop offset=".63" stop-color="#f2d33a"/><stop offset=".8" stop-color="#fc9f01"/><stop offset="1" stop-color="#dc2f27"/></linearGradient></defs>' +
        '<rect width="238" height="126" fill="#1a2380"/>' +
        '<rect x="44" y="12" width="136" height="104" rx="3" fill="#2a3fb8"/>' +
        '<rect x="62" y="24" width="24" height="36" rx="3" fill="#33a7d6"/><rect x="100" y="24" width="24" height="36" rx="3" fill="#e8c93a"/><rect x="138" y="24" width="24" height="36" rx="3" fill="#3cb4d4"/>' +
        '<rect x="71" y="60" width="6" height="42" fill="#3073d4"/><rect x="109" y="60" width="6" height="42" fill="#f0a020"/><rect x="147" y="60" width="6" height="42" fill="#3380d4"/>' +
        '<circle cx="112" cy="76" r="22" fill="url(#' + uid + 'hot)"/>' +
        '<path d="M100 76h24M112 64v24" stroke="#ffffff" stroke-width="1.2"/>' +
        '<rect x="214" y="12" width="10" height="104" rx="2" fill="url(#' + uid + 'sc)"/>' +
      '</svg></div>' +
      '<div data-k="r1" style="font-size:14px;font-weight:700;line-height:1.35;text-wrap:pretty">Tablero principal · Conexión fase B</div>' +
      '<div data-k="r2"><span style="display:inline-block;background:#dc2f27;color:#fff;font-size:12px;font-weight:700;padding:4px 11px;border-radius:999px">Prioridad 1</span></div>' +
      '<div data-k="r3" style="display:flex;gap:9px;align-items:flex-start;background:#f3f6f8;border-radius:6px;padding:10px 12px">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" style="flex:none;margin-top:1px"><path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="#fc9f01" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span style="font-size:13px;font-weight:600;line-height:1.35">Reapretar en la próxima ventana</span>' +
      '</div>' +
    '</div>' +
    '<div style="position:absolute;left:0;right:0;top:514px;display:flex;justify-content:center;gap:8px;">' +
      [0, 1, 2, 3, 4].map(function (k) { return '<span data-k="st' + k + '" style="width:6px;height:6px;border-radius:3px;background:#d9e2e8;transition:width .35s,background .35s"></span>'; }).join('') +
    '</div>';
  stage.appendChild(ov);
  var q = function (k) { return ov.querySelector('[data-k="' + k + '"]'); };
  var el = {};
  ['visor', 'wipe', 'rec', 'opLabel', 'opDot', 'routeLabel', 'panel', 'dt', 'barB', 'barC', 'p1', 'p1t', 'stamp', 'report', 'r0', 'r1', 'r2', 'r3'].forEach(function (k) { el[k] = q(k); });
  var phEls = [0, 1, 2].map(function (k) { return q('ph' + k); });
  var lnEls = [0, 1, 2].map(function (k) { return q('ln' + k); });
  var lcEls = [0, 1, 2].map(function (k) { return q('lc' + k); });
  var svEls = [0, 1, 2, 3].map(function (k) { return q('sv' + k); });
  var stEls = [0, 1, 2, 3, 4].map(function (k) { return q('st' + k); });

  // ---------- Animación ----------
  var baseTarget = new THREE.Vector3(0.1, 0.9, -0.3);
  var zoomTarget = new THREE.Vector3(TAB.x, 1.0, TAB.z + 0.3).add(screenRight.clone().multiplyScalar(1.75));
  var target = new THREE.Vector3(), tmpV = new THREE.Vector3();
  var opAnchor = new THREE.Vector3(-0.1, 3.0, -1.3);
  function toScreen(v) { tmpV.copy(v).project(cam); return { x: (tmpV.x + 1) * 0.5 * W, y: (1 - tmpV.y) * 0.5 * H }; }
  function place(node, v, op, ox, oy) {
    var p = toScreen(v);
    node.style.transformOrigin = '50% 100%';
    node.style.transform = 'translate(' + (p.x + (ox || 0)) + 'px,' + (p.y + (oy || 0)) + 'px) translate(-50%,-100%) scale(' + Math.min(kR, 1.6) + ')';
    node.style.opacity = op.toFixed(3);
  }
  function visorRect() {
    var mn = tabBox.min, mx = tabBox.max, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (var c = 0; c < 8; c++) {
      corners[c].set(c & 1 ? mx.x : mn.x, c & 2 ? mx.y : mn.y, c & 4 ? mx.z : mn.z);
      var p = toScreen(corners[c]);
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
    }
    return { x: x0 - 12, y: y0 - 12, w: x1 - x0 + 24, h: y1 - y0 + 24 };
  }
  var lastStep = -1;
  el.panel.style.transformOrigin = '100% 0';
  el.report.style.transformOrigin = '100% 0';
  el.stamp.style.transformOrigin = '100% 0';
  ajustarRotulos = function () {
    var fondoPanel = 58 + el.panel.offsetHeight * Math.min(kR, 1.25);
    el.stamp.style.top = Math.max(304, Math.round(fondoPanel + 8)) + 'px';
  };
  ajustarRotulos();

  function frame(t, abs) {
    // cámara
    var z = ss(7.4, 8.4, t) * (1 - ss(14.8, 15.9, t));
    target.copy(baseTarget).lerp(zoomTarget, z);
    cam.position.copy(target).add(camOffset);
    cam.lookAt(target);
    cam.zoom = 1 + 0.6 * z;
    cam.updateProjectionMatrix(); cam.updateMatrixWorld();

    // 1 · equipo en operación
    if (!reduce) shaft.rotation.x = abs * 9;
    place(el.opLabel, opAnchor, win(t, 0.5, 1.0, 2.8, 3.2), 0, 0);
    el.opDot.style.opacity = (0.6 + 0.4 * Math.sin(abs * 4)).toFixed(2);

    // 2 · termógrafo en ruta
    var walk = ss(3.0, 4.5, t), leave = ss(7.0, 7.8, t) * (1 - ss(15.5, 15.6, t));
    person.position.copy(P_START).lerp(P_END, walk);
    if (leave > 0) person.position.lerp(P_START, leave);
    var moving = (walk > 0 && walk < 1) || (leave > 0 && leave < 1);
    person.position.y = moving ? Math.abs(Math.sin(abs * 7)) * 0.04 : 0;
    legs[0].rotation.x = moving ? Math.sin(abs * 7) * 0.35 : 0; legs[1].rotation.x = -legs[0].rotation.x;
    facePerson();
    var pOp = ss(3.0, 3.5, t) * (1 - ss(7.2, 7.8, t));
    for (var i = 0; i < pMats.length; i++) { pMats[i].opacity = pOp; pMats[i].depthWrite = pOp > 0.99; }
    person.visible = pOp > 0.01;
    armsG.rotation.x = 0.7 - 0.92 * ss(4.4, 4.9, t) * (1 - ss(6.9, 7.3, t));
    coneMat.opacity = 0.12 * ss(4.8, 5.3, t) * (1 - ss(6.9, 7.3, t));
    var headP = new THREE.Vector3().copy(person.position); headP.y = 2.3;
    place(el.routeLabel, headP, win(t, 4.0, 4.5, 6.3, 6.7), 0, 0);

    // visor
    var vr = visorRect();
    var vOp = ss(5.1, 5.6, t) * (1 - ss(14.9, 15.3, t));
    el.visor.style.cssText += '';
    el.visor.style.left = vr.x.toFixed(1) + 'px'; el.visor.style.top = vr.y.toFixed(1) + 'px';
    el.visor.style.width = vr.w.toFixed(1) + 'px'; el.visor.style.height = vr.h.toFixed(1) + 'px';
    el.visor.style.opacity = vOp.toFixed(3);
    el.rec.style.opacity = (0.5 + 0.5 * Math.sin(abs * 4)).toFixed(2);

    // 3 · infrarrojo
    var wipe = reduce ? 1 : ss(5.8, 6.6, t) * (1 - ss(14.3, 14.9, t));
    el.wipe.style.opacity = wipe > 0.01 && wipe < 0.99 ? 1 : 0;
    el.wipe.style.left = (wipe * vr.w - 1).toFixed(1) + 'px';
    var pulse = 1 + 0.08 * Math.sin(abs * 5);
    hot.scale.set(hot.userData.base * pulse, hot.userData.base * pulse, 1);

    var ph0 = [8.5, 9.1, 8.8];
    var lx = vr.x + vr.w + 22, offs = [-44, 0, 44];
    for (var k = 0; k < 3; k++) {
      var op = win(t, ph0[k], ph0[k] + 0.4, 12.4, 12.8);
      var lp = toScreen(lugs[k]);
      var ly = lp.y + offs[k];
      phEls[k].style.transformOrigin = '0 50%';
      phEls[k].style.transform = 'translate(' + lx.toFixed(1) + 'px,' + (ly - 14).toFixed(1) + 'px) scale(' + Math.min(kR, 1.35) + ')';
      phEls[k].style.opacity = op.toFixed(3);
      var mx = lx - 14;
      lnEls[k].setAttribute('d', 'M' + lp.x.toFixed(1) + ' ' + lp.y.toFixed(1) + ' L' + mx.toFixed(1) + ' ' + ly.toFixed(1) + ' L' + lx.toFixed(1) + ' ' + ly.toFixed(1));
      lnEls[k].setAttribute('opacity', op.toFixed(3));
      lcEls[k].setAttribute('cx', lp.x.toFixed(1)); lcEls[k].setAttribute('cy', lp.y.toFixed(1));
      lcEls[k].setAttribute('opacity', op.toFixed(3));
    }

    // 4 · severidad
    var pan = win(t, 9.4, 9.9, 12.4, 12.9);
    el.panel.style.opacity = pan.toFixed(3);
    el.panel.style.transform = 'translateY(' + ((1 - ss(9.4, 9.9, t)) * 10).toFixed(1) + 'px) scale(' + Math.min(kR, 1.25) + ')';
    var bars = ss(9.8, 10.4, t);
    el.barB.style.width = (89 * bars).toFixed(1) + '%';
    el.barC.style.width = (41 * bars).toFixed(1) + '%';
    el.dt.textContent = '+' + Math.round(48 * ss(9.8, 10.4, t)) + ' °C';
    var sev = ss(10.5, 10.9, t);
    svEls[3].style.opacity = (0.28 + 0.72 * sev).toFixed(3);
    svEls[3].style.boxShadow = '0 0 0 ' + (2 * sev).toFixed(1) + 'px rgba(220,47,39,.25)';
    el.p1t.style.color = sev > 0.5 ? '#dc2f27' : '#2b5671';
    el.p1.style.opacity = ss(10.8, 11.1, t).toFixed(3);
    var st = ss(11.2, 11.55, t), stOut = 1 - ss(12.4, 12.9, t);
    el.stamp.style.opacity = (st * stOut).toFixed(3);
    el.stamp.style.transform = 'rotate(' + (-12 + 4 * st).toFixed(1) + 'deg) scale(' + ((1.35 - 0.35 * st) * Math.min(kR, 1.2)).toFixed(3) + ')';

    // 5 · informe
    var rp = win(t, 12.9, 13.4, 15.0, 15.5);
    el.report.style.opacity = rp.toFixed(3);
    el.report.style.transform = 'translateY(' + ((1 - ss(12.9, 13.4, t)) * 18).toFixed(1) + 'px) scale(' + Math.min(kR, 1.3) + ')';
    ['r0', 'r1', 'r2', 'r3'].forEach(function (key, n) { el[key].style.opacity = ss(13.2 + n * 0.18, 13.5 + n * 0.18, t).toFixed(3); });

    var step = t < 3.0 ? 0 : t < 6.8 ? 1 : t < 9.4 ? 2 : t < 12.8 ? 3 : 4;
    if (step !== lastStep) {
      stEls.forEach(function (n, i) { n.style.width = i === step ? '18px' : '6px'; n.style.background = i === step ? '#002e46' : '#d9e2e8'; });
      lastStep = step;
    }

    // Render: pasada normal + pasada térmica recortada al visor
    renderer.setScissorTest(false);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    cam.layers.set(0);
    renderer.shadowMap.autoUpdate = true;
    renderer.render(scene, cam);
    var sw = vr.w * wipe;
    if (sw > 0.5 && vOp > 0.01) {
      renderer.shadowMap.autoUpdate = false;
      renderer.setScissorTest(true);
      renderer.setScissor(vr.x, H - vr.y - vr.h, sw, vr.h);
      renderer.setClearColor(0x1a2380, 1);
      renderer.clear(true, true, false);
      setThermal(true); shadowFloor.visible = false; cone.visible = false;
      cam.layers.enable(1);
      renderer.render(scene, cam);
      setThermal(false); shadowFloor.visible = true; cone.visible = true;
      cam.layers.set(0);
      renderer.setScissorTest(false);
    }
  }

  var raf = 0, start = performance.now();
  if (reduce) {
    frame(11.8, 0);
    var tries = 0, fitLoop = function () { fit(); if (++tries < 30) raf = requestAnimationFrame(fitLoop); };
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
    setThermal(false);
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { mats.add(m); });
    });
    Object.keys(tCache).forEach(function (k) { mats.add(tCache[k]); });
    mats.forEach(function (m) { m.dispose(); });
    glowTex.dispose();
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (stage.parentNode) stage.parentNode.removeChild(stage);
  };
}
