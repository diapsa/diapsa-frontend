/**
 * Escena de "Lo que oye el analista" en /servicios/monitoreo-condicion/
 * analisis-de-ultrasonido: un motor con bomba, el detector con audífonos y
 * las ondas que salen del punto de la falla, con el medidor de decibeles.
 * Tres modos (rodamiento, fuga, descarga) que corresponden a las pestañas
 * de la sección; cada uno pasa de sano a hallazgo en un bucle de 6 s.
 *
 * Generada en Claude Diseño por Emiliano (2026-09-28,
 * docs/designs/ultrasonido-escena.html) y portada como las demás: recibe
 * THREE (r128), el contenedor y { modo, fuente }, y devuelve la limpieza,
 * con limpiar.modo(nuevo) para cambiar de modo sin volver a montar.
 */
/* eslint-disable */
export function montarEscenaUltrasonido(THREE, container, opciones) {
  opciones = opciones || {};
  var V3 = THREE.Vector3, PI = Math.PI;
  var MODOS = {
    rodamiento: { min: 20, max: 62, final: 'Daño avanzado', hallazgo: 'Hallazgo: rodamiento', falla: new V3(0.06, 0.95, 0.22) },
    fuga:       { min: 8,  max: 52, final: 'Fuga mayor',    hallazgo: 'Hallazgo: fuga',       falla: new V3(0.25, 0.80, 0.85) },
    descarga:   { min: 6,  max: 44, final: 'Descarga parcial', hallazgo: 'Hallazgo: descarga', falla: new V3(0.25, 1.75, -0.10) }
  };
  var modo = MODOS[opciones.modo] ? opciones.modo : 'rodamiento';
  var LOOP = 6;

  // ---------- Renderer / escena ----------
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  var canvas = renderer.domElement;
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  container.appendChild(canvas);

  var scene = new THREE.Scene();
  var FOV = 28;
  var camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  var camDir = new V3(0.1, 0.3, 1).normalize();

  // Entorno para reflejos metálicos suaves
  var pmrem = new THREE.PMREMGenerator(renderer);
  var envScene = new THREE.Scene();
  var envBox = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x163246, side: THREE.BackSide }));
  envScene.add(envBox);
  function envPanel(w, h, color, pos) {
    var p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));
    p.position.copy(pos); p.lookAt(0, 0, 0); envScene.add(p);
  }
  envPanel(10, 4, 0xffffff, new V3(0, 9, 3));
  envPanel(4, 8, 0x9fd8ff, new V3(-9, 2, -2));
  envPanel(5, 5, 0xdfeaf3, new V3(8, 3, 6));
  var envRT = pmrem.fromScene(envScene, 0.04);
  scene.environment = envRT.texture;
  envScene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x0b2233, 0.55));
  var key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(3, 6, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
  key.shadow.camera.near = 1; key.shadow.camera.far = 20; key.shadow.bias = -0.0005; key.shadow.radius = 4;
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x7dd3fc, 0.8); rim.position.set(-4, 3, -4); scene.add(rim);
  var fill = new THREE.DirectionalLight(0x9fc0dd, 0.3); fill.position.set(-3, 2, 4); scene.add(fill);

  var root = new THREE.Group(); root.name = 'conjunto'; scene.add(root);
  var fx = new THREE.Group(); fx.name = 'efectos'; scene.add(fx);

  // ---------- Utilidades ----------
  function lin(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }
  function mat(list, name, hex, metal, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: lin(hex), metalness: metal, roughness: rough });
    if (extra) for (var k in extra) m[k] = extra[k];
    m.name = name; m.userData.base = m.color.clone(); m.userData.env = 1;
    if (list) list.push(m);
    return m;
  }
  function add(parent, geo, m, name, x, y, z, rx, ry, rz) {
    var o = new THREE.Mesh(geo, m); o.name = name;
    o.position.set(x || 0, y || 0, z || 0); o.rotation.set(rx || 0, ry || 0, rz || 0);
    o.castShadow = true; o.receiveShadow = true;
    parent.add(o); return o;
  }
  function rrect(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  }
  var Z = PI / 2;
  function cylX(r1, r2, len, seg) { var g = new THREE.CylinderGeometry(r1, r2, len, seg || 40); g.rotateZ(Z); return g; }
  function cylZ(r1, r2, len, seg) { var g = new THREE.CylinderGeometry(r1, r2, len, seg || 32); g.rotateX(Z); return g; }

  // ---------- Base ----------
  var baseMats = [];
  var mBase = mat(baseMats, 'base', '#27405a', 0.35, 0.55);
  var mBaseTop = mat(baseMats, 'base_superior', '#34506a', 0.4, 0.45);
  var mLinea = mat(baseMats, 'linea_cian', '#0d2233', 0, 0.5, { emissive: lin('#38bdf8'), emissiveIntensity: 0.7 });
  var base = new THREE.Group(); base.name = 'base'; root.add(base);
  add(base, new THREE.BoxGeometry(4.3, 0.24, 1.9), mBase, 'base_bloque', 0, 0.12, 0);
  add(base, new THREE.BoxGeometry(4.18, 0.03, 1.78), mBaseTop, 'base_placa', 0, 0.255, 0);
  add(base, new THREE.BoxGeometry(4.3, 0.012, 0.012), mLinea, 'base_filo', 0, 0.235, 0.951);

  // ---------- Motor + bomba ----------
  var motorMats = [];
  var mCuerpo = mat(motorMats, 'acero_azulado', '#6f8499', 0.6, 0.36);
  var mOscuro = mat(motorMats, 'acero_oscuro', '#34475a', 0.5, 0.5);
  var mClaro = mat(motorMats, 'acero_claro', '#b3c3d1', 0.75, 0.26);
  var mRod = mat(motorMats, 'rodamiento', '#95a9bb', 0.7, 0.3, { emissive: new THREE.Color(0), emissiveIntensity: 1 });
  var gMotor = new THREE.Group(); gMotor.name = 'motor_bomba'; root.add(gMotor);
  var MY = 0.95;
  add(gMotor, cylX(0.55, 0.55, 1.5, 56), mCuerpo, 'motor_carcasa', -0.8, MY, 0);
  for (var i = 0; i < 20; i++) {
    var th = i / 20 * PI * 2; if (Math.cos(th) < -0.45) continue;
    add(gMotor, new THREE.BoxGeometry(1.36, 0.09, 0.035), mCuerpo, 'motor_aleta', -0.8, MY + Math.cos(th) * 0.6, Math.sin(th) * 0.6, th);
  }
  add(gMotor, cylX(0.5, 0.5, 0.1, 48), mOscuro, 'motor_tapa_trasera', -1.6, MY, 0);
  add(gMotor, cylX(0.5, 0.5, 0.1, 48), mOscuro, 'motor_tapa_delantera', 0.0, MY, 0);
  add(gMotor, cylX(0.52, 0.5, 0.34, 48), mCuerpo, 'motor_cubreventilador', -1.8, MY, 0);
  add(gMotor, cylX(0.43, 0.43, 0.01, 48), mOscuro, 'motor_rejilla', -1.972, MY, 0);
  [0.12, 0.24, 0.36].forEach(function (r) {
    var t = new THREE.TorusGeometry(r, 0.012, 8, 56); t.rotateY(Z);
    add(gMotor, t, mClaro, 'motor_rejilla_anillo', -1.975, MY, 0);
  });
  add(gMotor, cylX(0.26, 0.3, 0.16, 48), mRod, 'rodamiento_carcasa', 0.12, MY, 0);
  var tr = new THREE.TorusGeometry(0.27, 0.018, 10, 48); tr.rotateY(Z);
  add(gMotor, tr, mClaro, 'rodamiento_anillo', 0.2, MY, 0);
  add(gMotor, cylX(0.06, 0.06, 0.4, 24), mClaro, 'flecha', 0.38, MY, 0);
  add(gMotor, cylX(0.15, 0.15, 0.22, 40), mClaro, 'acoplamiento', 0.56, MY, 0);
  add(gMotor, new THREE.BoxGeometry(0.45, 0.26, 0.45), mCuerpo, 'caja_conexiones', -0.7, 1.66, 0);
  add(gMotor, new THREE.BoxGeometry(0.49, 0.04, 0.49), mOscuro, 'caja_conexiones_tapa', -0.7, 1.81, 0);
  add(gMotor, cylZ(0.04, 0.04, 0.08, 20), mOscuro, 'prensaestopa', -0.7, 1.63, 0.26);
  add(gMotor, new THREE.TorusGeometry(0.06, 0.016, 10, 28), mClaro, 'argolla', -1.25, 1.66, 0);
  add(gMotor, new THREE.BoxGeometry(0.24, 0.3, 1.0), mOscuro, 'pata_trasera', -1.35, 0.42, 0);
  add(gMotor, new THREE.BoxGeometry(0.24, 0.3, 1.0), mOscuro, 'pata_delantera', -0.25, 0.42, 0);
  add(gMotor, new THREE.BoxGeometry(2.3, 0.06, 1.12), mOscuro, 'bastidor', -0.35, 0.3, 0);
  add(gMotor, new THREE.BoxGeometry(0.62, 0.26, 0.7), mOscuro, 'bomba_pedestal', 1.0, 0.4, 0);
  add(gMotor, cylX(0.17, 0.2, 0.28, 40), mCuerpo, 'bomba_soporte', 0.8, MY, 0);
  add(gMotor, cylX(0.45, 0.45, 0.32, 56), mCuerpo, 'bomba_voluta', 1.1, MY, 0);
  var tv = new THREE.TorusGeometry(0.43, 0.075, 18, 64); tv.rotateY(Z);
  add(gMotor, tv, mCuerpo, 'bomba_voluta_borde', 1.1, MY, 0);
  add(gMotor, cylX(0.16, 0.16, 0.4, 40), mCuerpo, 'bomba_succion', 1.45, MY, 0);
  add(gMotor, cylX(0.26, 0.26, 0.05, 40), mClaro, 'bomba_brida_succion', 1.66, MY, 0);
  add(gMotor, new THREE.CylinderGeometry(0.14, 0.14, 0.55, 40), mCuerpo, 'bomba_descarga', 1.1, 1.58, 0);
  add(gMotor, new THREE.CylinderGeometry(0.23, 0.23, 0.05, 40), mClaro, 'bomba_brida_descarga', 1.1, 1.86, 0);

  // ---------- Línea de aire comprimido ----------
  var aireMats = [];
  var aTubo = mat(aireMats, 'aire_tubo', '#8ba0b3', 0.75, 0.3);
  var aOsc = mat(aireMats, 'aire_oscuro', '#34475a', 0.5, 0.5);
  var aClaro = mat(aireMats, 'aire_acople', '#c3d1dc', 0.85, 0.22);
  var aHule = mat(aireMats, 'aire_manguera', '#1c2a37', 0.05, 0.7);
  var aCara = mat(aireMats, 'aire_manometro_cara', '#e6edf3', 0.0, 0.4);
  var gAire = new THREE.Group(); gAire.name = 'linea_aire'; root.add(gAire);
  var AY = 0.8, AZ = 0.85;
  add(gAire, cylX(0.055, 0.055, 1.95, 32), aTubo, 'aire_tubo_rigido', -0.925, AY, AZ);
  [-1.0, 1.25].forEach(function (x, j) {
    add(gAire, new THREE.BoxGeometry(0.07, 0.5, 0.07), aOsc, 'aire_soporte', x, 0.52, AZ - (j ? 0.25 : 0));
    add(gAire, new THREE.TorusGeometry(0.07, 0.018, 10, 28), aOsc, 'aire_abrazadera', x, AY - (j ? 0.18 : 0), AZ - (j ? 0.25 : 0), 0, Z, 0);
  });
  add(gAire, new THREE.BoxGeometry(0.2, 0.24, 0.2), aTubo, 'aire_regulador', -1.55, AY, AZ);
  add(gAire, new THREE.CylinderGeometry(0.075, 0.06, 0.22, 32), aClaro, 'aire_vaso', -1.55, AY - 0.23, AZ);
  add(gAire, cylZ(0.085, 0.085, 0.04, 40), aOsc, 'aire_manometro', -1.55, AY + 0.2, AZ + 0.02);
  add(gAire, new THREE.CircleGeometry(0.07, 40), aCara, 'aire_manometro_cara', -1.55, AY + 0.2, AZ + 0.042);
  add(gAire, cylX(0.1, 0.1, 0.07, 6), aClaro, 'aire_tuerca', 0.04, AY, AZ);
  add(gAire, cylX(0.085, 0.085, 0.18, 40), aClaro, 'aire_acople_hembra', 0.15, AY, AZ);
  [0.11, 0.18].forEach(function (x) { add(gAire, new THREE.TorusGeometry(0.087, 0.012, 8, 40), aTubo, 'aire_moleteado', x, AY, AZ, 0, Z, 0); });
  add(gAire, cylX(0.05, 0.05, 0.12, 32), aClaro, 'aire_acople_macho', 0.31, AY, AZ);
  add(gAire, cylX(0.06, 0.045, 0.08, 32), aTubo, 'aire_espiga', 0.4, AY, AZ);
  var curva = new THREE.CatmullRomCurve3([new V3(0.42, AY, AZ), new V3(0.9, AY - 0.02, AZ), new V3(1.4, 0.62, AZ - 0.05), new V3(1.75, 0.42, AZ - 0.2), new V3(1.9, 0.3, 0.45)]);
  add(gAire, new THREE.TubeGeometry(curva, 80, 0.045, 16), aHule, 'aire_manguera', 0, 0, 0);

  // ---------- Tablero eléctrico ----------
  var tabMats = [];
  var tCaja = mat(tabMats, 'tablero_gabinete', '#6f8499', 0.55, 0.4);
  var tInt = mat(tabMats, 'tablero_interior', '#1d2c3a', 0.3, 0.7);
  var tPlaca = mat(tabMats, 'tablero_placa', '#3a4d60', 0.4, 0.55);
  var tBarra = mat(tabMats, 'tablero_barra', '#b3c3d1', 0.8, 0.25);
  var tAisl = mat(tabMats, 'tablero_aislador', '#d6dee6', 0.0, 0.45);
  var tOsc = mat(tabMats, 'tablero_oscuro', '#26384a', 0.4, 0.55);
  var gTab = new THREE.Group(); gTab.name = 'tablero'; root.add(gTab);
  var TX = -0.1, TB = 0.35, TH = 2.0, TW = 1.5, TD = 0.6, TC = TB + TH / 2;
  add(gTab, new THREE.BoxGeometry(TW + 0.06, 0.08, TD + 0.06), tOsc, 'tablero_zoclo', TX, 0.31, 0);
  add(gTab, new THREE.BoxGeometry(TW, TH, 0.04), tCaja, 'tablero_fondo', TX, TC, -TD / 2 + 0.02);
  add(gTab, new THREE.BoxGeometry(0.04, TH, TD), tCaja, 'tablero_lateral_izq', TX - TW / 2 + 0.02, TC, 0);
  add(gTab, new THREE.BoxGeometry(0.04, TH, TD), tCaja, 'tablero_lateral_der', TX + TW / 2 - 0.02, TC, 0);
  add(gTab, new THREE.BoxGeometry(TW, 0.04, TD), tCaja, 'tablero_techo', TX, TB + TH - 0.02, 0);
  add(gTab, new THREE.BoxGeometry(TW, 0.04, TD), tCaja, 'tablero_piso', TX, TB + 0.02, 0);
  add(gTab, new THREE.BoxGeometry(TW - 0.1, TH - 0.1, 0.01), tInt, 'tablero_interior', TX, TC, -TD / 2 + 0.045);
  add(gTab, new THREE.BoxGeometry(1.26, 1.78, 0.02), tPlaca, 'tablero_placa_montaje', TX, TC, -0.24);
  var bisagra = new THREE.Group(); bisagra.name = 'tablero_bisagra';
  bisagra.position.set(TX - TW / 2, TC, TD / 2); bisagra.rotation.y = -2.55; gTab.add(bisagra);
  add(bisagra, new THREE.BoxGeometry(TW, TH, 0.035), tCaja, 'tablero_puerta', TW / 2, 0, 0);
  add(bisagra, new THREE.BoxGeometry(TW - 0.16, TH - 0.16, 0.01), tInt, 'tablero_puerta_interior', TW / 2, 0, -0.022);
  [-0.25, 0, 0.25].forEach(function (dx) {
    var x = TX + dx + 0.1;
    add(gTab, new THREE.BoxGeometry(0.07, 1.1, 0.03), tBarra, 'tablero_barra', x, 1.6, -0.12);
    [1.1, 2.1].forEach(function (y) { add(gTab, cylZ(0.045, 0.045, 0.1, 20), tAisl, 'tablero_aislador', x, y, -0.19); });
  });
  for (var b = 0; b < 4; b++) {
    var bx = TX - 0.39 + b * 0.26;
    add(gTab, new THREE.BoxGeometry(0.18, 0.3, 0.14), tOsc, 'tablero_interruptor', bx, 0.85, -0.16);
    add(gTab, new THREE.BoxGeometry(0.04, 0.08, 0.04), tBarra, 'tablero_palanca', bx, 0.87, -0.07);
  }
  add(gTab, new THREE.BoxGeometry(1.2, 0.1, 0.12), tOsc, 'tablero_canaleta', TX, 0.55, -0.18);
  var chispaLuz = new THREE.PointLight(0x60a5fa, 0, 1.8, 2); chispaLuz.name = 'luz_descarga';
  chispaLuz.position.copy(MODOS.descarga.falla).add(new V3(0, 0, 0.12)); gTab.add(chispaLuz);

  // ---------- Detector de ultrasonido + audífonos ----------
  var detMats = [];
  var dCuerpo = mat(detMats, 'detector_cuerpo', '#2b3d4f', 0.35, 0.45);
  var dGrip = mat(detMats, 'detector_empunadura', '#1a2733', 0.05, 0.75);
  var dMetal = mat(detMats, 'detector_metal', '#b3c3d1', 0.85, 0.25);
  var dSensor = mat(detMats, 'detector_sensor', '#0b1a26', 0.2, 0.4, { emissive: lin('#38bdf8'), emissiveIntensity: 0.6 });
  var dLed = mat(detMats, 'detector_led', '#0b1a26', 0.2, 0.4, { emissive: lin('#38bdf8'), emissiveIntensity: 1 });
  var dPant = mat(detMats, 'detector_pantalla', '#05121c', 0.1, 0.25, { emissive: lin('#22c55e'), emissiveIntensity: 0.5 });
  var dHpLed = mat(detMats, 'audifono_led', '#0b1a26', 0.2, 0.4, { emissive: lin('#22c55e'), emissiveIntensity: 1 });
  var flotante = new THREE.Group(); flotante.name = 'detector_flotante'; root.add(flotante);
  var gun = new THREE.Group(); gun.name = 'detector'; flotante.add(gun);
  var cuerpoGeo = new THREE.ExtrudeGeometry(rrect(0.2, 0.24, 0.06), { depth: 0.46, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 4, curveSegments: 12 });
  cuerpoGeo.center();
  add(gun, cuerpoGeo, dCuerpo, 'detector_cuerpo', 0, 0, 0);
  add(gun, cylZ(0.06, 0.075, 0.12, 32), dMetal, 'detector_cuello', 0, 0, 0.3);
  var horn = new THREE.LatheGeometry([new THREE.Vector2(0.055, 0), new THREE.Vector2(0.058, 0.04), new THREE.Vector2(0.07, 0.09), new THREE.Vector2(0.095, 0.13), new THREE.Vector2(0.125, 0.155)], 48);
  horn.rotateX(Z);
  var hornMesh = add(gun, horn, dMetal, 'detector_bocina', 0, 0, 0.36);
  hornMesh.material = dMetal; dMetal.side = THREE.DoubleSide;
  add(gun, new THREE.CircleGeometry(0.058, 40), dSensor, 'detector_sensor', 0, 0, 0.39);
  add(gun, new THREE.TorusGeometry(0.125, 0.008, 8, 56), dLed, 'detector_led', 0, 0, 0.515);
  add(gun, new THREE.BoxGeometry(0.13, 0.34, 0.15), dGrip, 'detector_empunadura', 0, -0.25, -0.12, 0.3);
  add(gun, new THREE.BoxGeometry(0.04, 0.08, 0.05), dMetal, 'detector_gatillo', 0, -0.15, 0.01);
  var pant = new THREE.PlaneGeometry(0.3, 0.11); pant.rotateY(Z);
  add(gun, pant, dPant, 'detector_pantalla', 0.117, 0.03, -0.02);

  var hp = new THREE.Group(); hp.name = 'audifonos'; hp.position.set(-0.08, 0.55, -0.12); hp.rotation.set(0, -0.35, 0.12); flotante.add(hp);
  add(hp, new THREE.TorusGeometry(0.19, 0.022, 12, 56, PI), dCuerpo, 'audifono_diadema', 0, 0, 0);
  [-1, 1].forEach(function (sx) {
    add(hp, new THREE.BoxGeometry(0.02, 0.07, 0.03), dMetal, 'audifono_horquilla', sx * 0.19, -0.02, 0);
    add(hp, cylX(0.085, 0.085, 0.07, 36), dCuerpo, 'audifono_copa', sx * 0.2, -0.1, 0);
    var cu = new THREE.TorusGeometry(0.065, 0.024, 12, 36); cu.rotateY(Z);
    add(hp, cu, dGrip, 'audifono_almohadilla', sx * 0.158, -0.1, 0);
    var ld = new THREE.TorusGeometry(0.058, 0.007, 8, 40); ld.rotateY(Z);
    add(hp, ld, dHpLed, 'audifono_led', sx * 0.237, -0.1, 0);
  });
  var cable = new THREE.CatmullRomCurve3([new V3(-0.32, 0.38, -0.1), new V3(-0.46, 0.05, -0.05), new V3(-0.25, -0.42, 0.0), new V3(0.05, -0.5, 0.0), new V3(0.08, -0.4, 0.0)]);
  add(flotante, new THREE.TubeGeometry(cable, 60, 0.008, 8), dGrip, 'audifono_cable', 0, 0, 0);

  // ---------- Efectos: ondas, partículas, destellos ----------
  var ringVS = 'varying vec2 vL; void main(){ vL = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }';
  var ringFS = [
    'uniform vec3 uColor; uniform float uOpacity, uScale, uRadius, uThick, uJag, uSeed; varying vec2 vL;',
    'void main(){ if(uOpacity < 0.002) discard;',
    ' float ang = atan(vL.y, vL.x); float r = length(vL) * uScale;',
    ' float tr = uRadius * (1.0 + uJag * (0.05*sin(7.0*ang+uSeed) + 0.03*sin(13.0*ang+uSeed*2.3) + 0.02*sin(23.0*ang-uSeed)));',
    ' float d = abs(r - tr);',
    ' float a = smoothstep(uThick, uThick*0.2, d) + exp(-d*d/(uThick*uThick*18.0))*0.35;',
    ' gl_FragColor = vec4(uColor, a * uOpacity); }'
  ].join('\n');
  var ringGeo = new THREE.PlaneGeometry(2, 2);
  var rings = [];
  for (var ri = 0; ri < 20; ri++) {
    var u = { uColor: { value: new THREE.Color('#38bdf8') }, uOpacity: { value: 0 }, uScale: { value: 1 }, uRadius: { value: 0.5 }, uThick: { value: 0.012 }, uJag: { value: 0 }, uSeed: { value: 0 } };
    var rm = new THREE.ShaderMaterial({ uniforms: u, vertexShader: ringVS, fragmentShader: ringFS, transparent: true, depthWrite: false, depthTest: false });
    rm.name = 'onda';
    var rmesh = new THREE.Mesh(ringGeo, rm); rmesh.name = 'onda'; rmesh.visible = false; rmesh.frustumCulled = false; rmesh.renderOrder = 10;
    fx.add(rmesh);
    rings.push({ m: rmesh, u: u, on: false, age: 0, life: 1, r0: 0, r1: 1, op: 1, thick: 0.012 });
  }

  var ptsVS = 'attribute float aAlpha; attribute float aSize; uniform float uScale; varying float vA; void main(){ vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }';
  var ptsFS = 'uniform vec3 uColor; uniform float uOpacity; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d); if(a*vA*uOpacity < 0.003) discard; gl_FragColor = vec4(uColor, a * vA * uOpacity); }';
  var ptsMats = [];
  function puntos(name, n, color, sizeA, sizeB) {
    var g = new THREE.BufferGeometry();
    var pos = new Float32Array(n * 3), al = new Float32Array(n), sz = new Float32Array(n);
    for (var k = 0; k < n; k++) sz[k] = sizeA + Math.random() * (sizeB - sizeA);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(al, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    var m = new THREE.ShaderMaterial({ uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 }, uScale: { value: 500 } }, vertexShader: ptsVS, fragmentShader: ptsFS, transparent: true, depthWrite: false, depthTest: false });
    m.name = name; ptsMats.push(m);
    var p = new THREE.Points(g, m); p.name = name; p.frustumCulled = false; p.renderOrder = 11; fx.add(p);
    return { p: p, pos: pos, al: al, sz: sz, n: n, m: m };
  }
  var jet = puntos('chorro_aire', 240, '#e2f4ff', 0.012, 0.03);
  var jetSeed = [];
  var jetBase = new V3(0.2, 1, 0.5).normalize();
  for (var jk = 0; jk < jet.n; jk++) {
    var dv = new V3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.55).add(jetBase).normalize();
    jetSeed.push({ d: dv, rate: 0.9 + Math.random() * 0.8, ph: Math.random(), len: 0.7 + Math.random() * 0.6 });
  }
  var senal = puntos('senal', 28, '#38bdf8', 0.03, 0.045);
  var chispas = puntos('destellos', 34, '#8fd0ff', 0.03, 0.08);
  chispas.sz[0] = 0.32;

  // ---------- Capa de texto (HTML nítido) ----------
  var capa = document.createElement('div');
  capa.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;font-family:' + (opciones.fuente || '"Albert Sans", system-ui, sans-serif') + ';';
  container.appendChild(capa);
  var medidor = document.createElement('div');
  medidor.style.cssText = 'position:absolute;left:0;top:0;width:12.5em;box-sizing:border-box;padding:0.95em 1.05em 0.9em;border-radius:0.9em;background:rgba(0,33,51,0.66);border:1px solid rgba(160,205,235,0.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 12px 32px rgba(0,10,20,0.35);color:#f1f6fa;will-change:transform;';
  medidor.innerHTML =
    '<div style="font-size:0.72em;letter-spacing:0.08em;text-transform:uppercase;color:#a9c0d1;font-weight:600">Nivel ultrasónico</div>' +
    '<div style="display:flex;align-items:baseline;gap:0.25em;margin-top:0.3em"><span data-r="num" style="font-size:2.5em;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-0.02em">20</span><span style="font-weight:600;color:#a9c0d1">dB</span></div>' +
    '<div style="position:relative;height:0.5em;margin-top:0.75em;border-radius:99px;background:rgba(160,205,235,0.14);overflow:hidden"><div data-r="fill" style="position:absolute;left:0;top:0;bottom:0;width:0%;border-radius:99px;background:#22c55e"></div><div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 2px),rgba(0,33,51,0.95) calc(10% - 2px) 10%)"></div></div>' +
    '<div style="display:flex;justify-content:space-between;margin-top:0.4em;font-size:0.72em;color:#8fa9bc;font-variant-numeric:tabular-nums"><span data-r="min"></span><span data-r="max"></span></div>' +
    '<div style="display:flex;align-items:center;gap:0.5em;margin-top:0.7em;font-size:0.9em;font-weight:600"><span data-r="dot" style="flex:none;width:0.6em;height:0.6em;border-radius:50%;background:#22c55e"></span><span data-r="txt">Condición normal</span></div>';
  capa.appendChild(medidor);
  var etiqueta = document.createElement('div');
  etiqueta.style.cssText = 'position:absolute;left:0;top:0;opacity:0;will-change:transform,opacity;';
  etiqueta.innerHTML =
    '<div data-r="in" style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center">' +
    '<div style="display:flex;align-items:center;gap:0.55em;padding:0.5em 0.95em;border-radius:99px;background:#f1f6fa;color:#002e46;font-weight:700;font-size:0.95em;white-space:nowrap;box-shadow:0 10px 28px rgba(0,10,20,0.35)"><span style="flex:none;width:0.55em;height:0.55em;border-radius:50%;background:#ef4444"></span><span data-r="t"></span></div>' +
    '<div style="width:1px;height:3em;background:linear-gradient(#f1f6fa,rgba(241,246,250,0.1))"></div>' +
    '<div style="width:0.45em;height:0.45em;border-radius:50%;border:1px solid #f1f6fa;transform:translateY(50%)"></div></div>';
  capa.appendChild(etiqueta);
  function ref(el, r) { return el.querySelector('[data-r="' + r + '"]'); }
  var eNum = ref(medidor, 'num'), eFill = ref(medidor, 'fill'), eMin = ref(medidor, 'min'), eMax = ref(medidor, 'max'), eDot = ref(medidor, 'dot'), eTxt = ref(medidor, 'txt');
  var eLabT = ref(etiqueta, 't');
  eLabT.textContent = MODOS[modo].hallazgo;

  // ---------- Colores ----------
  var C_CYAN = new THREE.Color('#38bdf8'), C_OR = new THREE.Color('#fc9f01'), C_RED = new THREE.Color('#ef4444'), C_GREEN = new THREE.Color('#22c55e');
  function onda(s, out) {
    if (s < 0.2) return out.copy(C_CYAN);
    if (s < 0.6) return out.copy(C_CYAN).lerp(C_OR, (s - 0.2) / 0.4);
    return out.copy(C_OR).lerp(C_RED, (s - 0.6) / 0.4);
  }
  function nivel(f, out) {
    if (f < 0.3) return out.copy(C_GREEN);
    if (f < 0.65) return out.copy(C_GREEN).lerp(C_OR, (f - 0.3) / 0.35);
    return out.copy(C_OR).lerp(C_RED, Math.min(1, (f - 0.65) / 0.3));
  }

  // ---------- Estado ----------
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var reduced = !!reduce.matches;
  var t = 0, clock = 0, sSm = 0, db = MODOS[modo].min, labelV = 0, impact = 0, flash = 0;
  var spawnAcc = 0.2, pending = [];
  var mw = { rodamiento: 0, fuga: 0, descarga: 0 }; mw[modo] = 1;
  var fallaL = MODOS[modo].falla.clone(), mira = fallaL.clone();
  var tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  var lay = null, W = 1, H = 1, mW = 0, mH = 0, lW = 0, lH = 0;
  var tmpC = new THREE.Color(), tmpC2 = new THREE.Color(), tmpV = new V3(), tmpV2 = new V3(), fallaW = new V3(), puntaW = new V3(), floatW = new V3();
  var last = 0, raf = 0, inView = true, destroyed = false, cache = {};

  function severidad(tt) {
    if (tt < 1.4) return 0;
    if (tt < 4.2) { var k = (tt - 1.4) / 2.8; return k * k * (3 - 2 * k); }
    if (tt < 5.5) return 1;
    var q = (tt - 5.5) / 0.5; return 1 - q * q * (3 - 2 * q);
  }

  function setOpacidad(group, mats, o, dim) {
    group.visible = o > 0.01;
    var tr = o < 0.995;
    for (var k = 0; k < mats.length; k++) {
      var m = mats[k];
      m.opacity = o; m.transparent = tr; m.depthWrite = o > 0.5;
      if (dim !== undefined) { m.color.copy(m.userData.base).multiplyScalar(1 - dim * 0.7); m.envMapIntensity = 1 - dim * 0.7; }
    }
    var cast = o > 0.5;
    if (group.userData.cast !== cast) { group.userData.cast = cast; group.traverse(function (c) { if (c.isMesh) c.castShadow = cast; }); }
  }

  function emitir(o) {
    var r = null;
    for (var k = 0; k < rings.length; k++) if (!rings[k].on) { r = rings[k]; break; }
    if (!r) { r = rings[0]; for (var j = 1; j < rings.length; j++) if (rings[j].age / rings[j].life > r.age / r.life) r = rings[j]; }
    var s = sSm;
    r.on = true; r.age = 0; r.life = o.life || 1.7;
    r.r0 = 0.08; r.r1 = (0.45 + 1.95 * s) * (o.jag ? 0.85 + Math.random() * 0.25 : 1);
    r.op = Math.min(1, (0.1 + 0.85 * s) * (o.fuerte ? 1.15 : 1));
    r.thick = 0.011 + 0.008 * s + (o.fuerte ? 0.006 : 0);
    onda(s, r.u.uColor.value);
    r.u.uJag.value = o.jag || 0; r.u.uSeed.value = Math.random() * 10;
    r.m.position.copy(fallaW);
  }
  function pintarOnda(r, R, a) {
    var S = R * 1.2 + r.thick * 6 + 0.02;
    r.m.scale.setScalar(S); r.u.uScale.value = S; r.u.uRadius.value = R; r.u.uThick.value = r.thick; r.u.uOpacity.value = a;
    r.m.visible = a > 0.002; r.m.quaternion.copy(camera.quaternion);
  }
  function pulsoChispas(rand) {
    if (sSm < 0.05) return;
    flash = 1;
    for (var k = 0; k < chispas.n; k++) {
      var a = rand() * PI * 2, rr = k === 0 ? 0 : 0.03 + rand() * 0.11;
      chispas.pos[k * 3] = fallaW.x + Math.cos(a) * rr;
      chispas.pos[k * 3 + 1] = fallaW.y + Math.sin(a) * rr * 1.4;
      chispas.pos[k * 3 + 2] = fallaW.z + 0.05 + rand() * 0.06;
      chispas.al[k] = sSm * (k === 0 ? 0.55 : 0.35 + 0.65 * rand());
    }
    chispas.p.geometry.attributes.position.needsUpdate = true;
  }

  function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }

  function project(v) { tmpV2.copy(v).project(camera); return { x: (tmpV2.x + 1) / 2 * W, y: (1 - tmpV2.y) / 2 * H }; }
  function setTxt(el, k, v) { if (cache[k] !== v) { cache[k] = v; el.textContent = v; } }

  // ---------- Cuadro ----------
  function cuadro(dt, quieto) {
    var cfg = MODOS[modo];
    var s;
    if (quieto) { t = 4.8; clock = 2.3; s = 1; sSm = 1; }
    else { clock += dt; t = (t + dt) % LOOP; s = severidad(t); sSm += (s - sSm) * (1 - Math.exp(-dt * 4)); }
    var kk = quieto ? 1 : 1 - Math.exp(-dt * 2.6);
    for (var m in mw) mw[m] += ((m === modo ? 1 : 0) - mw[m]) * kk;
    fallaL.lerp(cfg.falla, kk);
    mira.lerp(fallaL, quieto ? 1 : 1 - Math.exp(-dt * 3.5));

    // Visibilidad de equipos
    var oMotor = mw.rodamiento + mw.fuga;
    setOpacidad(gMotor, motorMats, Math.min(1, oMotor), mw.fuga);
    setOpacidad(gAire, aireMats, mw.fuga);
    gAire.position.y = -(1 - mw.fuga) * 0.12;
    setOpacidad(gTab, tabMats, mw.descarga);
    gTab.position.y = -(1 - mw.descarga) * 0.15;

    // Inclinación y flotación
    if (!quieto) { tilt.x += (tilt.tx - tilt.x) * (1 - Math.exp(-dt * 3)); tilt.y += (tilt.ty - tilt.y) * (1 - Math.exp(-dt * 3)); }
    root.rotation.set(tilt.x, tilt.y, 0);
    flotante.position.copy(lay.det);
    if (!quieto) { flotante.position.y += Math.sin(clock * 1.3) * 0.035; flotante.rotation.z = Math.sin(clock * 0.9) * 0.025; }
    // Vibración por impactos
    impact *= Math.exp(-dt * 9);
    var vib = quieto ? 0 : mw.rodamiento * (0.004 * sSm + impact * 0.012);
    gMotor.position.set((Math.random() - 0.5) * vib, (Math.random() - 0.5) * vib, 0);
    scene.updateMatrixWorld(true);

    fallaW.copy(fallaL); root.localToWorld(fallaW);
    tmpV.copy(mira); root.localToWorld(tmpV); gun.lookAt(tmpV);
    gun.updateMatrixWorld(true);
    puntaW.set(0, 0, 0.48); gun.localToWorld(puntaW);
    flotante.getWorldPosition(floatW);

    // Ondas
    if (quieto) {
      rings.forEach(function (r) { r.on = false; r.m.visible = false; });
      var jag = modo === 'rodamiento' ? 1 : modo === 'descarga' ? 0.15 : 0;
      [0.16, 0.38, 0.6, 0.82].forEach(function (k, j) {
        var r = rings[j];
        r.thick = 0.019; r.u.uJag.value = jag; r.u.uSeed.value = j * 2.1;
        onda(1, r.u.uColor.value); r.m.position.copy(fallaW);
        var R = 0.08 + 2.4 * (1 - Math.pow(1 - k, 2)) * (jag ? 0.9 + 0.08 * j % 0.2 : 1);
        pintarOnda(r, R, 0.95 * Math.pow(1 - k, 1.6));
      });
    } else {
      spawnAcc -= dt;
      if (spawnAcc <= 0) {
        if (modo === 'rodamiento') {
          emitir({ jag: 1, life: 1.5 });
          if (sSm > 0.35 && Math.random() < 0.45) { pending.push({ at: clock + 0.06 + Math.random() * 0.05, jag: 1, life: 1.5, fuerte: true }); impact = 1; }
          spawnAcc = (0.85 + (0.26 - 0.85) * sSm) * (0.55 + Math.random() * 0.9);
        } else if (modo === 'fuga') {
          emitir({ jag: 0, life: 1.8 }); spawnAcc = Math.max(0.02, spawnAcc + 0.3);
        } else {
          emitir({ jag: 0.15, life: 1.6 }); pending.push({ at: clock + 0.13, jag: 0.15, life: 1.6 });
          pulsoChispas(Math.random); spawnAcc = Math.max(0.02, spawnAcc + 0.75);
        }
      }
      for (var p = pending.length - 1; p >= 0; p--) if (clock >= pending[p].at) { emitir(pending[p]); if (pending[p].fuerte) impact = 1; pending.splice(p, 1); }
      for (var q = 0; q < rings.length; q++) {
        var r = rings[q]; if (!r.on) continue;
        r.age += dt; var k = r.age / r.life;
        if (k >= 1) { r.on = false; r.m.visible = false; continue; }
        var e = 1 - Math.pow(1 - k, 2);
        pintarOnda(r, r.r0 + (r.r1 - r.r0) * e, r.op * Math.pow(1 - k, 1.6) * Math.min(1, k / 0.06));
      }
    }

    // Chorro de aire
    jet.m.uniforms.uOpacity.value = mw.fuga * sSm;
    if (jet.m.uniforms.uOpacity.value > 0.003) {
      var L = 0.25 + 0.95 * sSm;
      for (var j = 0; j < jet.n; j++) {
        var sd = jetSeed[j], a = (clock * sd.rate + sd.ph) % 1, dd = a * L * sd.len;
        jet.pos[j * 3] = fallaW.x + sd.d.x * dd;
        jet.pos[j * 3 + 1] = fallaW.y + sd.d.y * dd - a * a * 0.05;
        jet.pos[j * 3 + 2] = fallaW.z + sd.d.z * dd;
        jet.al[j] = Math.pow(1 - a, 1.4) * Math.min(1, a * 10);
      }
      jet.p.geometry.attributes.position.needsUpdate = true; jet.p.geometry.attributes.aAlpha.needsUpdate = true;
    }

    // Señal captada por el detector
    senal.m.uniforms.uOpacity.value = 0.15 + 0.8 * sSm;
    onda(sSm, senal.m.uniforms.uColor.value);
    tmpV.copy(fallaW).lerp(puntaW, 0.5); tmpV.y += 0.45;
    for (var n = 0; n < senal.n; n++) {
      var uu = (n / senal.n + clock * 0.35) % 1, iu = 1 - uu;
      senal.pos[n * 3] = iu * iu * fallaW.x + 2 * iu * uu * tmpV.x + uu * uu * puntaW.x;
      senal.pos[n * 3 + 1] = iu * iu * fallaW.y + 2 * iu * uu * tmpV.y + uu * uu * puntaW.y;
      senal.pos[n * 3 + 2] = iu * iu * fallaW.z + 2 * iu * uu * tmpV.z + uu * uu * puntaW.z;
      senal.al[n] = Math.sin(PI * uu) * (0.35 + 0.65 * sSm);
    }
    senal.p.geometry.attributes.position.needsUpdate = true; senal.p.geometry.attributes.aAlpha.needsUpdate = true;

    // Destellos del tablero
    if (quieto) { pulsoChispas(mulberry(7)); flash = 0.8; }
    else { flash *= Math.exp(-dt * 9); for (var c = 0; c < chispas.n; c++) chispas.al[c] *= Math.exp(-dt * (c === 0 ? 8 : 12)); }
    chispas.p.geometry.attributes.aAlpha.needsUpdate = true;
    chispas.m.uniforms.uOpacity.value = mw.descarga;
    chispaLuz.intensity = flash * 3.2 * sSm * mw.descarga;

    // Rodamiento: brillo de falla
    onda(Math.max(0.6, sSm), tmpC);
    mRod.emissive.copy(tmpC).convertSRGBToLinear().multiplyScalar(mw.rodamiento * (sSm * 0.35 + impact * 0.8));

    // Medidor
    var dbT = cfg.min + (cfg.max - cfg.min) * sSm;
    db = quieto ? cfg.max : db + (dbT - db) * (1 - Math.exp(-dt * 5));
    var f = Math.max(0, Math.min(1, (db - cfg.min) / (cfg.max - cfg.min)));
    nivel(f, tmpC2);
    var hex = '#' + tmpC2.getHexString();
    setTxt(eNum, 'num', String(Math.round(db)));
    setTxt(eMin, 'min', cfg.min + ' dB'); setTxt(eMax, 'max', cfg.max + ' dB');
    setTxt(eTxt, 'txt', f < 0.3 ? 'Condición normal' : f < 0.72 ? 'Nivel en aumento' : cfg.final);
    eFill.style.width = (4 + f * 96).toFixed(1) + '%';
    if (cache.hex !== hex) { cache.hex = hex; eFill.style.background = hex; eDot.style.background = hex; eDot.style.boxShadow = '0 0 0 0.25em ' + hex + '33'; }
    dPant.emissive.copy(tmpC2).convertSRGBToLinear(); dPant.emissiveIntensity = 0.45 + 0.4 * f;
    dHpLed.emissive.copy(tmpC2).convertSRGBToLinear(); dHpLed.emissiveIntensity = 0.3 + 1.2 * f;
    onda(sSm, tmpC); dLed.emissive.copy(tmpC).convertSRGBToLinear(); dLed.emissiveIntensity = 0.5 + 1.3 * sSm;
    dSensor.emissive.copy(tmpC).convertSRGBToLinear(); dSensor.emissiveIntensity = 0.4 + 0.8 * sSm;

    renderer.render(scene, camera);

    // Posición de textos
    var pm;
    if (lay.vertical) { tmpV.copy(floatW).add(new V3(-0.5, 0.05, 0)); pm = project(tmpV); pm.x -= mW; pm.y -= mH / 2; }
    else { tmpV.copy(floatW).add(new V3(0, -0.62, 0)); pm = project(tmpV); pm.x -= mW / 2; }
    pm.x = Math.max(8, Math.min(W - mW - 8, pm.x)); pm.y = Math.max(8, Math.min(H - mH - 8, pm.y));
    medidor.style.transform = 'translate3d(' + pm.x.toFixed(1) + 'px,' + pm.y.toFixed(1) + 'px,0)';

    var lt = quieto ? 1 : (t > 4.2 && t < 5.6 ? 1 : 0);
    labelV = quieto ? 1 : labelV + (lt - labelV) * (1 - Math.exp(-dt * 7));
    if (labelV < 0.02 && eLabT.textContent !== cfg.hallazgo) { eLabT.textContent = cfg.hallazgo; lW = etiqueta.firstChild.offsetWidth; }
    var pl = project(fallaW);
    pl.x = Math.max(lW / 2 + 8, Math.min(W - lW / 2 - 8, pl.x)); pl.y = Math.max(lH + 8, pl.y);
    etiqueta.style.opacity = labelV.toFixed(3);
    etiqueta.style.transform = 'translate3d(' + pl.x.toFixed(1) + 'px,' + (pl.y + (1 - labelV) * 10).toFixed(1) + 'px,0)';
  }

  // ---------- Tamaño y encuadre ----------
  function ajustar() {
    W = Math.max(1, container.clientWidth); H = Math.max(1, container.clientHeight);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    var vertical = camera.aspect < 0.9;
    lay = vertical
      ? { vertical: true, det: new V3(1.2, 3.45, 0.45), c: new V3(0, 2.0, 0), bw: 4.8, bh: 4.5 }
      : { vertical: false, det: new V3(3.0, 1.75, 0.45), c: new V3(0.62, 1.35, 0), bw: 6.4, bh: 3.3 };
    var tanV = Math.tan(FOV / 2 * PI / 180);
    var d = Math.max(lay.bh / 2 / tanV, lay.bw / 2 / (tanV * camera.aspect)) + 1.3;
    camera.position.copy(lay.c).addScaledVector(camDir, d);
    camera.lookAt(lay.c); camera.updateProjectionMatrix();
    var sc = canvas.height / (2 * tanV);
    ptsMats.forEach(function (m) { m.uniforms.uScale.value = sc; });
    capa.style.fontSize = Math.max(11, Math.min(16, Math.min(W, H * 1.5) / 58)).toFixed(1) + 'px';
    mW = medidor.offsetWidth; mH = medidor.offsetHeight;
    lW = etiqueta.firstChild.offsetWidth; lH = etiqueta.firstChild.offsetHeight;
    if (reduced || !raf) cuadro(0, reduced);
  }

  // ---------- Bucle ----------
  function tick(now) {
    raf = requestAnimationFrame(tick);
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    cuadro(dt, false);
  }
  function sync() {
    var run = inView && !document.hidden && !reduced && !destroyed;
    if (run && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    else if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  var ro = new ResizeObserver(function () { ajustar(); });
  ro.observe(container);
  var io = new IntersectionObserver(function (en) { inView = en[0].isIntersecting; sync(); }, { threshold: 0 });
  io.observe(container);
  function onVis() { sync(); }
  document.addEventListener('visibilitychange', onVis);
  function onMove(e) {
    if (reduced) return;
    var r = container.getBoundingClientRect();
    var nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    var ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    tilt.ty = nx * 0.16; tilt.tx = ny * 0.05;
  }
  function onLeave() { tilt.tx = 0; tilt.ty = 0; }
  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  function onReduce(e) { reduced = !!e.matches; if (reduced) { tilt.x = tilt.y = tilt.tx = tilt.ty = 0; cuadro(0, true); } sync(); }
  if (reduce.addEventListener) reduce.addEventListener('change', onReduce); else if (reduce.addListener) reduce.addListener(onReduce);

  ajustar();
  sync();

  // ---------- API ----------
  function limpiar() {
    if (destroyed) return; destroyed = true;
    if (raf) cancelAnimationFrame(raf); raf = 0;
    ro.disconnect(); io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    if (reduce.removeEventListener) reduce.removeEventListener('change', onReduce); else if (reduce.removeListener) reduce.removeListener(onReduce);
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) {
        for (var k in m) { if (m[k] && m[k].isTexture) m[k].dispose(); }
        m.dispose();
      });
    });
    if (key.shadow && key.shadow.map) key.shadow.map.dispose();
    envRT.dispose(); scene.environment = null;
    renderer.dispose(); renderer.forceContextLoss();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (capa.parentNode) capa.parentNode.removeChild(capa);
  }
  limpiar.modo = function (nuevo) {
    if (destroyed || !MODOS[nuevo] || nuevo === modo) return;
    modo = nuevo; t = 0; spawnAcc = 0.25; pending = [];
    if (reduced) { eLabT.textContent = MODOS[modo].hallazgo; lW = etiqueta.firstChild.offsetWidth; cuadro(0, true); }
  };
  return limpiar;
}
