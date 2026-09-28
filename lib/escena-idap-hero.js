/**
 * Escena del inicio de /servicios/idap: de la planta a la decisión.
 *
 * A la izquierda, un motor con su bomba sobre una base, con tres sensores
 * que laten. De cada sensor salen pulsos de datos por curvas hacia el
 * núcleo de IDAP (una esfera de malla con los anillos dorados del logo y
 * las seis técnicas en órbita). Del núcleo sale otro flujo hacia un panel
 * flotante con el semáforo de los equipos, que se va actualizando.
 *
 * Mismo contrato que las demás escenas: recibe THREE (0.128), el
 * contenedor y opciones, y devuelve la función de limpieza. Con
 * prefers-reduced-motion se dibuja un solo cuadro quieto. Fondo
 * transparente: el azul lo pone la sección (FONDO_IDAP).
 */
/* eslint-disable */
export function montarEscenaIdapHero(THREE, container, opciones) {
  opciones = opciones || {};
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var quieto = !!(mq && mq.matches);
  var recursos = [];
  var track = function (x) { recursos.push(x); return x; };

  var ORO = 0xffc34d, AZUL = 0x38bdf8, VERDE = 0x22c55e, AMARILLO = 0xfacc15, ROJO = 0xef4444, NARANJA = 0xfc9f01;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.6, 11);

  scene.add(new THREE.AmbientLight(0x8fb4ff, 0.55));
  var luz = new THREE.DirectionalLight(0xffffff, 0.9);
  luz.position.set(4, 6, 6);
  scene.add(luz);
  var luzOro = new THREE.PointLight(ORO, 1.2, 12);
  luzOro.position.set(0.6, 0.6, 2);
  scene.add(luzOro);

  var mundo = new THREE.Group();
  scene.add(mundo);

  function mat(color, extra) {
    var o = { color: color, roughness: 0.55, metalness: 0.35 };
    for (var k in extra || {}) o[k] = extra[k];
    return track(new THREE.MeshStandardMaterial(o));
  }
  function malla(geo, material) { track(geo); return new THREE.Mesh(geo, material); }

  // ---------- el motor y la bomba ----------
  var planta = new THREE.Group();
  planta.position.set(-2.75, -0.95, 0.3);
  planta.rotation.y = 0.6;
  planta.scale.setScalar(0.9);
  mundo.add(planta);

  var metal = mat(0x2b3a55), metalClaro = mat(0x44587c), acento = mat(0x1a4fd8, { metalness: 0.5 });
  var base = malla(new THREE.BoxGeometry(3.4, 0.22, 1.5), metal);
  base.position.y = -0.62;
  planta.add(base);

  var cuerpo = malla(new THREE.CylinderGeometry(0.55, 0.55, 1.5, 32), acento);
  cuerpo.rotation.z = Math.PI / 2;
  cuerpo.position.set(-0.6, 0.05, 0);
  planta.add(cuerpo);
  for (var a = 0; a < 9; a++) { // aletas
    var aleta = malla(new THREE.TorusGeometry(0.57, 0.035, 6, 32), metalClaro);
    aleta.rotation.y = Math.PI / 2;
    aleta.position.set(-1.2 + a * 0.15, 0.05, 0);
    planta.add(aleta);
  }
  var tapa = malla(new THREE.CylinderGeometry(0.5, 0.5, 0.18, 32), metalClaro);
  tapa.rotation.z = Math.PI / 2;
  tapa.position.set(-1.43, 0.05, 0);
  planta.add(tapa);
  var patas = malla(new THREE.BoxGeometry(1.2, 0.35, 0.9), metal);
  patas.position.set(-0.6, -0.4, 0);
  planta.add(patas);

  var flecha = malla(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16), metalClaro);
  flecha.rotation.z = Math.PI / 2;
  flecha.position.set(0.45, 0.05, 0);
  planta.add(flecha);
  var cople = malla(new THREE.CylinderGeometry(0.17, 0.17, 0.2, 20), mat(0xfc9f01, { metalness: 0.6 }));
  cople.rotation.z = Math.PI / 2;
  cople.position.set(0.45, 0.05, 0);
  planta.add(cople);

  var bomba = malla(new THREE.SphereGeometry(0.5, 28, 20), metal);
  bomba.scale.set(0.9, 1, 0.75);
  bomba.position.set(1.25, 0.05, 0);
  planta.add(bomba);
  var salida = malla(new THREE.CylinderGeometry(0.16, 0.16, 0.8, 16), metalClaro);
  salida.position.set(1.25, 0.6, 0);
  planta.add(salida);
  var soporte = malla(new THREE.BoxGeometry(0.8, 0.35, 0.8), metal);
  soporte.position.set(1.25, -0.4, 0);
  planta.add(soporte);

  // sensores: pequeños cubos con un halo que late
  var sensores = [];
  [[-0.6, 0.62, 0], [0.45, 0.28, 0], [1.25, 0.56, 0.2]].forEach(function (p, i) {
    var s = malla(new THREE.BoxGeometry(0.16, 0.16, 0.16), mat(NARANJA, { emissive: NARANJA, emissiveIntensity: 0.6 }));
    s.position.set(p[0], p[1], p[2]);
    planta.add(s);
    var halo = malla(new THREE.RingGeometry(0.12, 0.16, 32), track(new THREE.MeshBasicMaterial({ color: NARANJA, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })));
    halo.position.copy(s.position);
    planta.add(halo);
    sensores.push({ cubo: s, halo: halo, fase: i * 0.7 });
  });

  // ---------- el núcleo de IDAP ----------
  var nucleo = new THREE.Group();
  nucleo.position.set(0.2, 0.5, 0);
  mundo.add(nucleo);
  var esfera = malla(new THREE.IcosahedronGeometry(0.75, 2), track(new THREE.MeshBasicMaterial({ color: AZUL, wireframe: true, transparent: true, opacity: 0.35 })));
  nucleo.add(esfera);
  var centro = malla(new THREE.IcosahedronGeometry(0.42, 3), mat(0x0f1f40, { emissive: 0x1a3a7a, emissiveIntensity: 0.8, metalness: 0.2 }));
  nucleo.add(centro);
  var anillos = [];
  [1.0, 1.28, 1.56].forEach(function (r, i) {
    var an = malla(new THREE.TorusGeometry(r, 0.022, 8, 96, Math.PI * 1.35), track(new THREE.MeshBasicMaterial({ color: ORO, transparent: true, opacity: 0.9 - i * 0.2 })));
    an.rotation.x = Math.PI / 2 - 0.35;
    an.rotation.z = i * 0.9;
    nucleo.add(an);
    anillos.push(an);
  });

  // las seis técnicas en órbita, como etiquetas
  function etiqueta(texto, color) {
    var c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    var x = c.getContext('2d');
    x.fillStyle = 'rgba(10,20,46,0.85)';
    // píldora: dos semicírculos unidos
    x.beginPath();
    x.moveTo(64, 8); x.lineTo(448, 8);
    x.arc(448, 64, 56, -Math.PI / 2, Math.PI / 2);
    x.lineTo(64, 120);
    x.arc(64, 64, 56, Math.PI / 2, Math.PI * 1.5);
    x.closePath(); x.fill();
    x.strokeStyle = color; x.lineWidth = 5; x.stroke();
    x.fillStyle = color; x.beginPath(); x.arc(56, 64, 14, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffffff'; x.font = 'bold 46px system-ui, Segoe UI, sans-serif'; x.textBaseline = 'middle';
    x.fillText(texto, 88, 66);
    var t = track(new THREE.CanvasTexture(c));
    var sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false })));
    sp.scale.set(1.35, 0.34, 1);
    return sp;
  }
  var tecnicas = [['Termografía', '#ef4444'], ['Vibraciones', '#a78bfa'], ['Ultrasonido', '#38bdf8'], ['Aceite', '#facc15'], ['Eléctrico', '#fc9f01'], ['Integrales', '#22c55e']];
  var orbitas = tecnicas.map(function (t, i) {
    var sp = etiqueta(t[0], t[1]);
    nucleo.add(sp);
    return { sp: sp, ang: (i / tecnicas.length) * Math.PI * 2 };
  });

  // ---------- el panel con el semáforo ----------
  var panelCanvas = document.createElement('canvas');
  panelCanvas.width = 640; panelCanvas.height = 420;
  var pctx = panelCanvas.getContext('2d');
  var panelTex = track(new THREE.CanvasTexture(panelCanvas));
  var panel = malla(new THREE.PlaneGeometry(3.0, 1.97), track(new THREE.MeshBasicMaterial({ map: panelTex, transparent: true, side: THREE.DoubleSide })));
  panel.position.set(3.05, 0.95, -0.4);
  panel.scale.setScalar(0.82);
  panel.rotation.y = -0.45;
  mundo.add(panel);
  var marco = malla(new THREE.PlaneGeometry(3.12, 2.09), track(new THREE.MeshBasicMaterial({ color: ORO, transparent: true, opacity: 0.25, side: THREE.DoubleSide })));
  marco.position.copy(panel.position); marco.rotation.copy(panel.rotation); marco.scale.copy(panel.scale); marco.position.z -= 0.02;
  mundo.add(marco);

  var estados = [
    { n: 'Bueno', c: '#22c55e', v: 0.62, o: 0.62 },
    { n: 'Observación', c: '#facc15', v: 0.24, o: 0.24 },
    { n: 'Precaución', c: '#fc9f01', v: 0.09, o: 0.09 },
    { n: 'Alarma', c: '#ef4444', v: 0.05, o: 0.05 },
  ];
  function dibujarPanel(t) {
    var W = panelCanvas.width, H = panelCanvas.height;
    pctx.clearRect(0, 0, W, H);
    pctx.fillStyle = 'rgba(8,16,40,0.92)';
    pctx.fillRect(0, 0, W, H);
    pctx.fillStyle = '#ffc34d'; pctx.font = 'bold 30px system-ui, Segoe UI, sans-serif';
    pctx.fillText('Estado de los equipos', 32, 54);
    pctx.fillStyle = 'rgba(255,255,255,0.5)'; pctx.font = '22px system-ui, Segoe UI, sans-serif';
    pctx.fillText('Última ruta', 32, 86);
    estados.forEach(function (e, i) {
      var y = 130 + i * 70;
      pctx.fillStyle = 'rgba(255,255,255,0.85)'; pctx.font = 'bold 24px system-ui, Segoe UI, sans-serif';
      pctx.fillText(e.n, 32, y + 22);
      pctx.fillStyle = 'rgba(255,255,255,0.08)';
      pctx.fillRect(220, y, 340, 30);
      pctx.fillStyle = e.c;
      pctx.fillRect(220, y, 340 * e.v, 30);
      pctx.fillStyle = 'rgba(255,255,255,0.8)'; pctx.font = 'bold 22px system-ui, Segoe UI, sans-serif';
      pctx.fillText(Math.round(e.v * 100) + '%', 572, y + 23);
    });
    panelTex.needsUpdate = true;
  }

  // ---------- flujos de datos ----------
  function mundoDe(obj) { var v = new THREE.Vector3(); obj.getWorldPosition(v); return v; }
  mundo.updateMatrixWorld(true);
  var destinoNucleo = nucleo.position.clone();
  var curvas = sensores.map(function (s, i) {
    var a = mundoDe(s.cubo);
    var m = a.clone().lerp(destinoNucleo, 0.5); m.y += 1.4 + i * 0.25; m.z += 0.6;
    return new THREE.QuadraticBezierCurve3(a, m, destinoNucleo.clone());
  });
  var alPanel = new THREE.QuadraticBezierCurve3(destinoNucleo.clone(), new THREE.Vector3(2.2, 1.9, 0.6), panel.position.clone().add(new THREE.Vector3(-1.05, 0, 0.3)));
  curvas.concat([alPanel]).forEach(function (c, i) {
    var g = track(new THREE.BufferGeometry().setFromPoints(c.getPoints(48)));
    var l = new THREE.Line(g, track(new THREE.LineBasicMaterial({ color: i === 3 ? ORO : AZUL, transparent: true, opacity: 0.22 })));
    mundo.add(l);
  });
  var pulsos = [];
  var geoPulso = track(new THREE.SphereGeometry(0.06, 12, 10));
  for (var p = 0; p < 18; p++) {
    var ci = p % 4;
    var m2 = track(new THREE.MeshBasicMaterial({ color: ci === 3 ? ORO : (p % 3 === 0 ? NARANJA : AZUL), transparent: true }));
    var bola = new THREE.Mesh(geoPulso, m2);
    mundo.add(bola);
    pulsos.push({ bola: bola, curva: ci === 3 ? alPanel : curvas[ci], t: Math.random(), vel: 0.18 + Math.random() * 0.12 });
  }

  // partículas de fondo
  var nP = 260, pos = new Float32Array(nP * 3);
  for (var q = 0; q < nP; q++) { pos[q * 3] = (Math.random() - 0.5) * 18; pos[q * 3 + 1] = (Math.random() - 0.5) * 9; pos[q * 3 + 2] = -3 - Math.random() * 6; }
  var gP = track(new THREE.BufferGeometry());
  gP.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var polvo = new THREE.Points(gP, track(new THREE.PointsMaterial({ color: 0x8fb4ff, size: 0.04, transparent: true, opacity: 0.55 })));
  scene.add(polvo);

  // ---------- tamaño, ratón y bucle ----------
  var ancho = 1, alto = 1;
  function ajustar() {
    var r = container.getBoundingClientRect();
    ancho = Math.max(1, r.width); alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camera.aspect = ancho / alto;
    // en pantallas angostas se aleja la cámara para que quepa todo
    // la distancia justa para que quepa el ancho de la composición (unas 9.4 unidades)
    var mitad = Math.tan((camera.fov * Math.PI) / 360);
    camera.position.z = Math.max(4.7 / (mitad * camera.aspect), 2.6 / mitad);
    camera.updateProjectionMatrix();
  }
  var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(ajustar) : null;
  if (ro) ro.observe(container); else window.addEventListener('resize', ajustar);
  ajustar();

  var raton = { x: 0, y: 0 }, suave = { x: 0, y: 0 };
  function mover(e) {
    var r = container.getBoundingClientRect();
    raton.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    raton.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }
  window.addEventListener('pointermove', mover, { passive: true });

  var visible = true;
  var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (e) { visible = e.some(function (x) { return x.isIntersecting; }); }) : null;
  if (io) io.observe(container);

  var inicio = performance.now(), ultimoCambio = 0, raf = 0;
  function cuadro() {
    raf = requestAnimationFrame(cuadro);
    if (!visible) return;
    var t = (performance.now() - inicio) / 1000;
    pintar(t);
  }
  function pintar(t) {
    suave.x += (raton.x - suave.x) * 0.05; suave.y += (raton.y - suave.y) * 0.05;
    mundo.rotation.y = Math.sin(t * 0.18) * 0.12 + suave.x * 0.18;
    mundo.rotation.x = suave.y * 0.06;
    esfera.rotation.y = t * 0.3; esfera.rotation.x = t * 0.12;
    centro.rotation.y = -t * 0.4;
    anillos.forEach(function (an, i) { an.rotation.z = i * 0.9 + t * (0.35 + i * 0.12) * (i % 2 ? -1 : 1); });
    orbitas.forEach(function (o, i) {
      var ang = o.ang + t * 0.25;
      o.sp.position.set(Math.cos(ang) * 1.9, Math.sin(ang * 2 + i) * 0.35 + 0.1, Math.sin(ang) * 1.1);
      o.sp.material.opacity = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(ang));
    });
    nucleo.position.y = 0.5 + Math.sin(t * 1.1) * 0.08;
    panel.position.y = 0.9 + Math.sin(t * 0.9 + 1) * 0.07; marco.position.y = panel.position.y;
    sensores.forEach(function (s) {
      var k = ((t * 0.9 + s.fase) % 1);
      s.halo.scale.setScalar(1 + k * 3.5);
      s.halo.material.opacity = 0.8 * (1 - k);
      s.halo.lookAt(camera.position);
    });
    pulsos.forEach(function (p) {
      p.t = (p.t + p.vel * 0.016) % 1;
      p.bola.position.copy(p.curva.getPoint(p.t));
      p.bola.material.opacity = Math.sin(p.t * Math.PI);
    });
    polvo.rotation.y = t * 0.01;
    // cada 3 s cambia un poco el semáforo: llegan resultados nuevos
    if (t - ultimoCambio > 3) {
      ultimoCambio = t;
      var a = Math.random() * 0.1 - 0.05, b = Math.random() * 0.06 - 0.03;
      estados[0].o = Math.min(0.72, Math.max(0.5, estados[0].o + a));
      estados[1].o = Math.min(0.32, Math.max(0.16, estados[1].o - a / 2 + b));
      estados[3].o = Math.min(0.09, Math.max(0.02, estados[3].o - b / 2));
      estados[2].o = Math.max(0.03, 1 - estados[0].o - estados[1].o - estados[3].o);
    }
    estados.forEach(function (e) { e.v += (e.o - e.v) * 0.04; });
    dibujarPanel(t);
    renderer.render(scene, camera);
  }

  if (quieto) { pintar(2); } else { cuadro(); }

  function limpiar() {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', mover);
    if (ro) ro.disconnect(); else window.removeEventListener('resize', ajustar);
    if (io) io.disconnect();
    recursos.forEach(function (r) { if (r && r.dispose) r.dispose(); });
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
  return limpiar;
}
