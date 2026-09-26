/**
 * Escena "Análisis de calidad de energía": el analizador se conecta al
 * tablero general sin detener la planta, registra una semana, la onda de
 * corriente se deforma y los armónicos pasan la referencia de IEEE 519, la
 * línea lleva a los variadores sin filtro, y con el filtro y el banco
 * desintonizado la energía vuelve a quedar dentro de norma.
 *
 * Generada en Claude Diseño (docs/designs/calidad-energia-escena.html) y
 * portada como las demás escenas: recibe THREE y el contenedor y devuelve
 * la limpieza. Ajusta luces y color por revisión de Three.js.
 * Ajuste propio: en teléfono la escena se recorta a la parte 3D, los
 * rótulos crecen y las tarjetas del analizador bajan a una columna.
 */
/* eslint-disable */
export function montarEscenaCalidad(THREE, container) {
  var REV = parseInt(String(THREE.REVISION), 10) || 128;
  var W = 720, H = 540, CICLO = 16, PH = [0, 3.2, 6.4, 9.6, 12.8, 16];
  var NAVY = '#002e46', MID = '#2b5671', GRAY = '#d9e2e8', OR = '#fc9f01';
  var FONT = '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';
  var TITULOS = ['Conectado con todo operando', 'Una semana de registro', 'Lo que no se ve', 'La carga que lo provoca', 'Se corrige'];
  var uid = 'ce' + Math.random().toString(36).slice(2, 8);
  var PI = Math.PI;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
  function eio(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function eout(x) { return 1 - Math.pow(1 - x, 3); }
  function eback(x) { if (x <= 0) return 0; var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  /* ---------- DOM ---------- */
  var root = document.createElement('div');
  root.style.cssText = 'position:relative;width:100%;height:405px;overflow:hidden;';
  var stage = document.createElement('div');
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', 'Animación: un analizador de calidad de energía se conecta al tablero general sin detener la planta, registra una semana, detecta armónicos de variadores sin filtro y la instalación se corrige hasta quedar dentro de norma. Datos simulados.');
  stage.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;transform-origin:0 0;overflow:hidden;' +
    'background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%);font-family:' + FONT + ';color:' + NAVY + ';-webkit-font-smoothing:antialiased;user-select:none;';
  root.appendChild(stage);
  container.appendChild(root);

  /* ---------- Overlay HTML ---------- */
  var bars = '';
  for (var i = 0; i < 5; i++) bars += '<span data-r="bar' + i + '" style="width:30px;height:4px;border-radius:2px;background:' + GRAY + ';"></span>';

  var DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  var DW = 202 / 7;
  var logSvg = '<svg width="220" height="188" viewBox="0 0 220 188" style="display:block;overflow:visible">' +
    '<defs><clipPath id="' + uid + '-log"><rect data-r="logClip" x="0" y="0" width="0" height="180"></rect></clipPath></defs>';
  for (i = 0; i <= 7; i++) logSvg += '<line x1="' + (18 + i * DW).toFixed(1) + '" y1="2" x2="' + (18 + i * DW).toFixed(1) + '" y2="172" stroke="' + GRAY + '" stroke-dasharray="2 3"></line>';
  for (i = 0; i < 7; i++) logSvg += '<text data-r="dia' + i + '" x="' + (18 + (i + .5) * DW).toFixed(1) + '" y="185" text-anchor="middle" font-size="9.5" fill="' + MID + '">' + DIAS[i] + '</text>';
  var trz = trazas(), tcol = [NAVY, MID, '#6f8ea3'];
  for (i = 0; i < 3; i++) {
    logSvg += '<text x="0" y="' + (32 + i * 58) + '" font-size="9.5" font-weight="600" fill="' + MID + '">L' + (i + 1) + '</text>';
    logSvg += '<path d="' + trz[i] + '" fill="none" stroke="' + tcol[i] + '" stroke-width="1.3" stroke-linejoin="round" clip-path="url(#' + uid + '-log)"></path>';
  }
  logSvg += '<line data-r="logCur" x1="18" y1="2" x2="18" y2="172" stroke="' + OR + '" stroke-width="1.5" opacity="0"></line></svg>';

  var HB = [3.2, 14.6, 9.8, 3.4, 2.1], HG = [2.1, 3.6, 2.8, 1.6, 1.1], HREF = 5, HMAX = 16, HBASE = 82, HH = 72;
  var refY = HBASE - HREF / HMAX * HH;
  var ORD = ['3ª', '5ª', '7ª', '11ª', '13ª'];
  var histSvg = '<svg width="220" height="100" viewBox="0 0 220 100" style="display:block">' +
    '<line x1="0" y1="' + HBASE + '" x2="220" y2="' + HBASE + '" stroke="' + GRAY + '"></line>';
  for (i = 0; i < 5; i++) {
    histSvg += '<rect data-r="hb' + i + '" x="' + (22 + 44 * i - 11) + '" y="' + HBASE + '" width="22" height="0" rx="2" fill="' + MID + '"></rect>';
    histSvg += '<text x="' + (22 + 44 * i) + '" y="96" text-anchor="middle" font-size="9.5" fill="' + MID + '">' + ORD[i] + '</text>';
  }
  histSvg += '<g data-r="href" opacity="0"><line x1="0" y1="' + refY.toFixed(1) + '" x2="220" y2="' + refY.toFixed(1) + '" stroke="' + NAVY + '" stroke-width="1.2" stroke-dasharray="4 3"></line>' +
    '<text x="218" y="' + (refY - 4).toFixed(1) + '" text-anchor="end" font-size="9.5" font-weight="700" fill="' + NAVY + '">IEEE 519</text></g></svg>';

  var waveSvg = '<svg width="220" height="60" viewBox="0 0 220 60" style="display:block">' +
    '<defs><clipPath id="' + uid + '-wave"><rect data-r="waveClip" x="0" y="0" width="0" height="60"></rect></clipPath></defs>' +
    '<line x1="0" y1="30" x2="220" y2="30" stroke="' + GRAY + '"></line>' +
    '<path d="' + wavePath(0) + '" fill="none" stroke="' + GRAY + '" stroke-width="1.2" stroke-dasharray="3 3" clip-path="url(#' + uid + '-wave)"></path>' +
    '<path data-r="wave" d="' + wavePath(0) + '" fill="none" stroke="' + NAVY + '" stroke-width="1.8" stroke-linejoin="round" clip-path="url(#' + uid + '-wave)"></path></svg>';

  var lbl = 'font-size:10.5px;font-weight:600;color:' + MID + ';height:14px;line-height:14px;';
  var card = 'position:absolute;left:458px;width:244px;box-sizing:border-box;background:rgba(255,255,255,.95);border:1px solid ' + GRAY + ';border-radius:8px;box-shadow:0 6px 18px rgba(0,46,70,.08);';
  var pill = 'min-width:64px;box-sizing:border-box;text-align:center;padding:4px 8px;border-radius:12px;font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;background:' + OR + ';color:' + NAVY + ';';
  var check = '<span style="flex:none;width:16px;height:16px;border-radius:50%;background:' + NAVY + ';display:flex;align-items:center;justify-content:center;"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2 4.2 7.3 8 3" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
  function repRow(n, a, b) { return '<div data-r="rr' + n + '" style="display:flex;align-items:center;gap:8px;height:22px;font-size:11.5px;white-space:nowrap;opacity:0;">' + check + '<span><span style="color:' + MID + ';">' + a + '</span> <b style="font-weight:700;">' + b + '</b></span></div>'; }

  var ov = document.createElement('div');
  ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
  ov.innerHTML =
    '<svg data-r="lines" width="' + W + '" height="' + H + '" style="position:absolute;left:0;top:0;overflow:visible">' +
      '<line data-r="evLine" x1="0" y1="0" x2="0" y2="0" stroke="' + OR + '" stroke-width="1.6" stroke-dasharray="4 4" opacity="0"></line>' +
      '<circle data-r="evDot" r="3.5" fill="' + OR + '" opacity="0"></circle>' +
    '</svg>' +
    '<div data-r="tags" style="position:absolute;inset:0;z-index:2;"></div>' +
    '<div data-r="head" style="position:absolute;left:22px;top:20px;width:300px;transform-origin:0 0;">' +
      '<div data-r="title" style="font-size:20px;line-height:24px;height:24px;font-weight:650;letter-spacing:-.01em;white-space:nowrap;"></div>' +
      '<div style="display:flex;gap:5px;margin-top:10px;">' + bars + '</div>' +
    '</div>' +
    '<div data-r="panel" style="' + card + 'top:18px;padding:12px;opacity:0;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;height:18px;">' +
        '<span style="font-size:11px;font-weight:700;color:' + NAVY + ';">Analizador de calidad de energía</span>' +
        '<span style="width:7px;height:7px;border-radius:50%;background:' + MID + ';"></span></div>' +
      '<div style="position:relative;height:232px;margin-top:6px;">' +
        '<div data-r="secLog" style="position:absolute;left:0;top:0;right:0;bottom:0;">' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between;height:36px;">' +
            '<span style="' + lbl + '">Registro continuo · 3 fases</span>' +
            '<span data-r="dias" style="font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;">0 días</span></div>' +
          logSvg + '</div>' +
        '<div data-r="secAn" style="position:absolute;left:0;top:0;right:0;bottom:0;opacity:0;">' +
          '<div style="' + lbl + '">Forma de onda de corriente</div>' + waveSvg +
          '<div style="' + lbl + 'margin-top:6px;">Armónicos de corriente (%)</div>' + histSvg +
          '<div data-r="evt" style="position:relative;margin-top:6px;height:28px;border-radius:6px;background:#eef1f4;opacity:0;">' +
            '<div data-r="evtFlash" style="position:absolute;inset:0;border-radius:6px;background:' + OR + ';opacity:0;"></div>' +
            '<div style="position:relative;display:flex;align-items:center;gap:8px;height:28px;padding:0 8px;">' +
              '<svg width="46" height="16" viewBox="0 0 46 16"><path d="M0 5 H17 L20 12 H27 L30 5 H46" fill="none" stroke="' + NAVY + '" stroke-width="1.5" stroke-linejoin="round"></path></svg>' +
              '<span style="font-size:11px;font-weight:700;">Caída de tensión</span>' +
              '<span style="margin-left:auto;font-size:10.5px;color:' + MID + ';">Mié 07:42</span></div></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div data-r="ind" style="' + card + 'top:308px;padding:10px 12px;display:flex;flex-direction:column;gap:10px;opacity:0;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><div><div style="font-size:12px;font-weight:600;">Distorsión de corriente</div><div style="font-size:10.5px;color:' + MID + ';margin-top:2px;">ref. 8 %</div></div><span data-r="v1" style="' + pill + '">18.4 %</span></div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><div><div style="font-size:12px;font-weight:600;">Factor de potencia</div><div style="font-size:10.5px;color:' + MID + ';margin-top:2px;">mín. 0.90</div></div><span data-r="v2" style="' + pill + '">0.86</span></div>' +
    '</div>' +
    '<div data-r="rep" style="' + card + 'top:396px;padding:10px 12px;opacity:0;">' +
      '<div style="font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:' + MID + ';margin-bottom:6px;">Reporte</div>' +
      repRow(0, 'Armónicos:', 'corregido') + repRow(1, 'Factor de potencia:', '0.96') + repRow(2, 'Eventos:', 'origen identificado') +
    '</div>' +
    '<div data-r="seal" style="position:absolute;left:354px;top:10px;width:100px;height:100px;opacity:0;">' +
      '<div style="position:relative;width:100%;height:100%;border-radius:50%;background:#fff;border:2.5px solid ' + NAVY + ';box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;box-shadow:0 6px 16px rgba(0,46,70,.14);transform:rotate(-8deg);">' +
        '<div style="position:absolute;inset:5px;border-radius:50%;border:1px dashed ' + MID + ';"></div>' +
        '<span style="width:18px;height:18px;border-radius:50%;background:' + OR + ';display:flex;align-items:center;justify-content:center;"><svg width="11" height="11" viewBox="0 0 10 10"><path d="M2 5.2 4.2 7.3 8 3" fill="none" stroke="' + NAVY + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>' +
        '<div style="text-align:center;font-size:11.5px;font-weight:700;line-height:1.15;">Energía<br>dentro de<br>norma</div>' +
      '</div></div>' +
    '<div data-r="veil" style="position:absolute;inset:0;z-index:3;background:#f5f7f9;opacity:0;"></div>';

  /* ---------- Three.js ---------- */
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(W, H);
  if (REV >= 152 && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = REV >= 180 ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;';
  stage.appendChild(renderer.domElement);
  stage.appendChild(ov);

  var R = {};
  Array.prototype.forEach.call(stage.querySelectorAll('[data-r]'), function (e) { R[e.getAttribute('data-r')] = e; });

  var LF = REV >= 155 ? PI : 1; // unidades físicas de luz a partir de r155
  var scene = new THREE.Scene();
  var world = new THREE.Group(); world.name = 'planta'; scene.add(world);
  function V(x, y, z) { return new THREE.Vector3(x, y, z); }
  function mat(name, color, rough, metal, extra) {
    var m = new THREE.MeshStandardMaterial(Object.assign({ color: color, roughness: rough, metalness: metal }, extra || {}));
    m.name = name; return m;
  }
  var M = {
    gab: mat('gabinete', 0xd9e2e8, .55, .1),
    gabIn: mat('gabinete_interior', 0xc2ced7, .8, 0),
    navy: mat('azul_marino', 0x002e46, .5, .15),
    mid: mat('azul_medio', 0x2b5671, .45, .15),
    metal: mat('metal', 0x9fb0bc, .35, .55),
    light: mat('blanco_suave', 0xf3f6f8, .6, 0),
    orange: mat('naranja', 0xfc9f01, .45, 0),
    belt: mat('banda', 0x5b7486, .8, 0),
    screen: mat('pantalla', 0x0b3a52, .35, 0, { emissive: 0x6fbbe6, emissiveIntensity: .45 }),
    anScreen: mat('pantalla_analizador', 0x0b3a52, .35, 0, { emissive: 0x6fbbe6, emissiveIntensity: .15 }),
    lamp: mat('luz_operacion', 0xeaf7ff, .3, 0, { emissive: 0xa8dcff, emissiveIntensity: .9 }),
    lampB: mat('luz_motor_b', 0xeaf7ff, .3, 0, { emissive: 0xa8dcff, emissiveIntensity: .9 }),
    vfd: mat('variador', 0x2b5671, .45, .15, { emissive: 0xfc9f01, emissiveIntensity: 0 }),
    ring: mat('transductor_flexible', 0xfc9f01, .5, 0),
    cableI: mat('cable_corriente', 0x2b5671, .55, 0),
    cableV: mat('cable_tension', 0x002e46, .55, 0),
    route: mat('ruta', 0xfc9f01, .5, 0, { transparent: true, opacity: 1 }),
    pulse: mat('pulso', 0xfc9f01, .5, 0, { transparent: true, opacity: 0, depthWrite: false })
  };
  var cMid = new THREE.Color(0x2b5671), cOr = new THREE.Color(0xfc9f01);

  function mesh(name, geo, m, parent, x, y, z, noShadow) {
    var o = new THREE.Mesh(geo, m); o.name = name; o.position.set(x || 0, y || 0, z || 0);
    if (!noShadow) { o.castShadow = true; o.receiveShadow = true; }
    parent.add(o); return o;
  }
  function box(name, w, h, d, m, p, x, y, z) { return mesh(name, new THREE.BoxGeometry(w, h, d), m, p, x, y, z); }
  function cyl(name, r, h, m, p, x, y, z, s) { return mesh(name, new THREE.CylinderGeometry(r, r, h, s || 32), m, p, x, y, z); }
  function cylZ(name, r, h, m, p, x, y, z, s) { var o = cyl(name, r, h, m, p, x, y, z, s); o.rotation.x = PI / 2; return o; }
  function sph(name, r, m, p, x, y, z) { return mesh(name, new THREE.SphereGeometry(r, 16, 12), m, p, x, y, z, true); }

  var sm = new THREE.ShadowMaterial({ opacity: .16 }); sm.name = 'sombra';
  var floor = mesh('sombra_piso', new THREE.PlaneGeometry(16, 16), sm, scene, -.4, 0, -1, true);
  floor.rotation.x = -PI / 2; floor.receiveShadow = true;

  var TD = .5, TH = 2.0, Y0 = .1;
  function openCabinet(prefix, g, w) {
    box(prefix + '_zoclo', w + .02, .1, TD + .02, M.navy, g, 0, .05, 0);
    box(prefix + '_fondo', w, TH, .03, M.gab, g, 0, Y0 + TH / 2, -TD / 2 + .015);
    box(prefix + '_lado_izq', .03, TH, TD, M.gab, g, -w / 2 + .015, Y0 + TH / 2, 0);
    box(prefix + '_lado_der', .03, TH, TD, M.gab, g, w / 2 - .015, Y0 + TH / 2, 0);
    box(prefix + '_techo', w, .03, TD, M.gab, g, 0, Y0 + TH - .015, 0);
    box(prefix + '_piso', w, .03, TD, M.gab, g, 0, Y0 + .015, 0);
    box(prefix + '_frente_superior', w, .14, .03, M.gab, g, 0, Y0 + TH - .07, TD / 2 - .015);
  }

  /* Tablero general de baja tensión */
  var TW = .9;
  var tab = new THREE.Group(); tab.name = 'tablero_general'; tab.position.set(-1.55, 0, 0); world.add(tab);
  openCabinet('tablero', tab, TW);
  box('tablero_placa_montaje', TW - .1, TH - .12, .012, M.gabIn, tab, 0, Y0 + TH / 2, -TD / 2 + .037);
  for (i = 0; i < 3; i++) sph('tablero_luz_' + i, .022, M.lamp, tab, -.2 + i * .2, Y0 + TH - .07, TD / 2 + .004);
  box('interruptor_principal', .32, .26, .12, M.navy, tab, 0, 1.8, -TD / 2 + .1);
  box('interruptor_palanca', .05, .08, .04, M.gab, tab, 0, 1.8, -TD / 2 + .18);
  for (i = 0; i < 3; i++) box('barra_' + i, .72, .03, .012, M.metal, tab, 0, 1.6 - i * .05, -TD / 2 + .06);
  var CX = [-.24, -.04, .16], CZ = 0, RY = 1.02, VY = 1.36;
  for (i = 0; i < 3; i++) cyl('conductor_fase_' + 'ABC'[i], .026, 1.2, M.navy, tab, CX[i], .98, CZ, 20);
  box('canaleta', .8, .07, .07, M.light, tab, 0, .5, -.12);
  for (i = 0; i < 5; i++) box('interruptor_derivado_' + i, .12, .18, .09, M.mid, tab, -.3 + i * .15, .3, -.13);
  box('barra_neutro', .2, .03, .03, M.metal, tab, -.28, .64, -.08);
  var hinge = new THREE.Group(); hinge.name = 'puerta_bisagra'; hinge.position.set(-TW / 2, 0, TD / 2); hinge.rotation.y = -1.83; tab.add(hinge);
  box('puerta', TW, TH - .02, .025, M.gab, hinge, TW / 2, Y0 + TH / 2, .0125);
  box('puerta_refuerzo', TW - .18, TH - .34, .012, M.light, hinge, TW / 2, Y0 + TH / 2, -.006);
  box('puerta_manija', .03, .16, .03, M.navy, hinge, TW - .07, 1.1, .04);

  /* Centro de control de motores */
  var CW = 1.3;
  var ccm = new THREE.Group(); ccm.name = 'centro_control_motores'; ccm.position.set(-.4, 0, 0); world.add(ccm);
  box('ccm_zoclo', CW + .02, .1, TD + .02, M.navy, ccm, 0, .05, 0);
  box('ccm_gabinete', CW, TH, TD, M.gab, ccm, 0, Y0 + TH / 2, 0);
  box('ccm_division', .012, TH, .004, M.mid, ccm, 0, Y0 + TH / 2, TD / 2 + .002);
  box('ccm_franja_superior', CW, .012, .004, M.mid, ccm, 0, Y0 + TH - .16, TD / 2 + .002);
  sph('ccm_luz_0', .022, M.lamp, ccm, -.325, Y0 + TH - .08, TD / 2 + .006);
  sph('ccm_luz_1', .022, M.lamp, ccm, .325, Y0 + TH - .08, TD / 2 + .006);
  var VP = [[-.325, 1.42], [.325, 1.42], [-.325, .76], [.325, .76]];
  VP.forEach(function (p, n) {
    box('variador_' + n, .38, .52, .1, M.vfd, ccm, p[0], p[1], TD / 2 + .05);
    box('variador_pantalla_' + n, .17, .08, .005, M.screen, ccm, p[0], p[1] + .14, TD / 2 + .1025);
    box('variador_teclado_' + n, .12, .07, .005, M.light, ccm, p[0], p[1] + .03, TD / 2 + .1025);
    box('variador_rejilla_' + n, .26, .07, .005, M.navy, ccm, p[0], p[1] - .16, TD / 2 + .1025);
  });

  /* Filtro de armónicos (aparece en fase 5) */
  var fil = new THREE.Group(); fil.name = 'filtro_armonicos'; fil.position.set(.5, 0, 0); world.add(fil);
  box('filtro_zoclo', .47, .1, TD + .02, M.navy, fil, 0, .05, 0);
  box('filtro_gabinete', .45, 1.8, TD, M.navy, fil, 0, .1 + .9, 0);
  box('filtro_pantalla', .16, .08, .005, M.screen, fil, 0, 1.5, TD / 2 + .003);
  box('filtro_rejilla', .3, .2, .005, M.mid, fil, 0, .45, TD / 2 + .003);
  sph('filtro_luz', .022, M.lamp, fil, 0, 1.74, TD / 2 + .006);

  /* Banco de capacitores */
  var KW = .7;
  var cap = new THREE.Group(); cap.name = 'banco_capacitores'; cap.position.set(1.13, 0, 0); world.add(cap);
  openCabinet('capacitores', cap, KW);
  sph('capacitores_luz', .022, M.lamp, cap, 0, Y0 + TH - .07, TD / 2 + .004);
  [.55, 1.05, 1.55].forEach(function (y, s) {
    box('capacitores_repisa_' + s, KW - .06, .025, TD - .05, M.gabIn, cap, 0, y, 0);
    if (s < 2) for (var j = -1; j <= 1; j++) {
      var k = s * 3 + j + 1;
      cyl('capacitor_' + k, .075, .3, M.light, cap, j * .2, y + .1625, .02);
      cyl('capacitor_tapa_' + k, .077, .03, M.navy, cap, j * .2, y + .325, .02);
      cyl('capacitor_borne_' + k + 'a', .012, .04, M.metal, cap, j * .2 - .03, y + .36, .02, 12);
      cyl('capacitor_borne_' + k + 'b', .012, .04, M.metal, cap, j * .2 + .03, y + .36, .02, 12);
    }
  });
  var reac = new THREE.Group(); reac.name = 'reactores_desintonia'; reac.position.set(0, 1.5625, .02); cap.add(reac);
  for (i = -1; i <= 1; i++) {
    cyl('reactor_nucleo_' + (i + 1), .06, .2, M.mid, reac, i * .2, .1, 0);
    for (var r = 0; r < 3; r++) {
      var tor = mesh('reactor_bobina_' + (i + 1) + '_' + r, new THREE.TorusGeometry(.066, .012, 10, 32), M.navy, reac, i * .2, .04 + r * .06, 0);
      tor.rotation.x = PI / 2;
    }
  }

  /* Línea de producción */
  var lin = new THREE.Group(); lin.name = 'linea_produccion'; lin.position.set(-1.3, 0, -3.2); world.add(lin);
  var BL = 2.4, BH = .78;
  box('banda_riel_frontal', BL, .09, .04, M.navy, lin, 0, BH, .26);
  box('banda_riel_trasero', BL, .09, .04, M.navy, lin, 0, BH, -.26);
  box('banda', BL - .04, .03, .48, M.belt, lin, 0, BH + .005, 0);
  [-1.1, 0, 1.1].forEach(function (x, a) { [-.24, .24].forEach(function (z, b) { box('banda_pata_' + a + b, .05, BH - .05, .05, M.navy, lin, x, (BH - .05) / 2, z); }); });
  cylZ('rodillo_cabeza', .055, .5, M.metal, lin, BL / 2 - .02, BH - .01, 0);
  cylZ('rodillo_cola', .055, .5, M.metal, lin, -BL / 2 + .02, BH - .01, 0);
  cyl('baliza_poste', .015, .72, M.metal, lin, 0, BH + .36, -.3, 12);
  cyl('baliza_segmento_1', .045, .08, M.gab, lin, 0, BH + .76, -.3);
  cyl('baliza_segmento_2', .045, .08, M.gab, lin, 0, BH + .84, -.3);
  cyl('baliza_luz', .045, .08, M.lamp, lin, 0, BH + .92, -.3);
  cyl('baliza_tapa', .047, .02, M.navy, lin, 0, BH + .97, -.3);
  var products = [];
  for (i = 0; i < 4; i++) {
    var pg = new THREE.Group(); pg.name = 'producto_' + i; lin.add(pg);
    box('producto_caja_' + i, .26, .2, .26, M.light, pg, 0, .1, 0);
    box('producto_cinta_' + i, .265, .03, .07, M.mid, pg, 0, .2, 0);
    pg.position.y = BH + .02; products.push(pg);
  }
  function motor(name, x, z, lampMat) {
    var g = new THREE.Group(); g.name = name; g.position.set(x, 0, z); lin.add(g);
    box(name + '_base', .32, .34, .34, M.navy, g, 0, .17, 0);
    var body = new THREE.Group(); body.position.set(0, .52, 0); g.add(body);
    cylZ(name + '_carcasa', .15, .36, M.mid, body, 0, 0, 0, 40);
    for (var k = 0; k < 5; k++) cylZ(name + '_aleta_' + k, .158, .018, M.mid, body, 0, 0, -.14 + k * .07, 40);
    cylZ(name + '_tapa_ventilador', .14, .1, M.gab, body, 0, 0, -.23, 40);
    cylZ(name + '_tapa_frontal', .13, .03, M.navy, body, 0, 0, .195, 40);
    cylZ(name + '_flecha', .022, .08, M.metal, body, 0, 0, .245, 16);
    box(name + '_caja_bornes', .13, .08, .14, M.navy, body, 0, .19, 0);
    sph(name + '_luz', .022, lampMat, body, 0, .25, 0);
    var hub = new THREE.Group(); hub.name = name + '_acople'; hub.position.set(0, 0, .29); body.add(hub);
    cylZ(name + '_acople_disco', .1, .03, M.light, hub, 0, 0, 0, 40);
    box(name + '_acople_marca', .17, .03, .01, M.navy, hub, 0, 0, .02);
    return { g: g, hub: hub };
  }
  var motA = motor('motor_a', 1.05, .56, M.lamp);
  var motB = motor('motor_b', -1.05, .56, M.lampB);

  /* Analizador portátil */
  var AN0 = V(-1.35, 0, 1.15);
  var an = new THREE.Group(); an.name = 'analizador_portatil'; an.position.copy(AN0); an.rotation.y = .35; world.add(an);
  cyl('analizador_base', .17, .03, M.navy, an, 0, .015, 0);
  cyl('analizador_poste', .018, .8, M.metal, an, 0, .43, 0, 16);
  var dev = new THREE.Group(); dev.position.set(0, .95, 0); dev.rotation.x = -.3; an.add(dev);
  box('analizador_cuerpo', .36, .26, .07, M.navy, dev, 0, 0, 0);
  box('analizador_bisel', .32, .22, .004, M.gab, dev, 0, 0, .037);
  box('analizador_pantalla', .26, .12, .004, M.anScreen, dev, 0, .035, .04);
  for (i = 0; i < 4; i++) box('analizador_boton_' + i, .04, .025, .006, M.mid, dev, -.09 + i * .06, -.07, .041);
  box('analizador_protector_izq', .025, .28, .08, M.orange, dev, -.19, 0, 0);
  box('analizador_protector_der', .025, .28, .08, M.orange, dev, .19, 0, 0);
  for (i = 0; i < 7; i++) cyl('analizador_conector_' + i, .01, .025, M.metal, dev, -.15 + i * .05, .142, 0, 10);

  /* Transductores flexibles, puntas y cables */
  world.updateMatrixWorld(true);
  var rings = [];
  for (i = 0; i < 3; i++) {
    var rg = new THREE.Group(); rg.name = 'transductor_fase_' + 'ABC'[i]; rg.position.set(CX[i], RY, CZ); tab.add(rg);
    var rt = mesh('transductor_anillo_' + 'ABC'[i], new THREE.TorusGeometry(.075, .014, 12, 40), M.ring, rg, 0, 0, 0); rt.rotation.x = PI / 2;
    box('transductor_seguro_' + 'ABC'[i], .03, .04, .03, M.navy, rg, 0, 0, .078);
    rings.push(rg);
  }
  var TUB = 64, RAD = 6, cables = [];
  function cable(name, m, a, b, t0, clip) {
    var m1 = V(lerp(a.x, b.x, .3), Math.min(a.y, b.y) - .28, lerp(a.z, b.z, .4));
    var m2 = V(lerp(b.x, a.x, .12), b.y - .06, b.z + .32);
    var curve = new THREE.CatmullRomCurve3([a, a.clone().add(V(0, .06, -.03)), m1, m2, b]);
    var o = mesh(name, new THREE.TubeGeometry(curve, TUB, .009, RAD, false), m, world, 0, 0, 0);
    o.castShadow = true; cables.push({ mesh: o, t0: t0, clip: clip });
  }
  var ends = [];
  for (i = 0; i < 3; i++) ends.push({ m: M.cableI, p: tab.localToWorld(V(CX[i], RY, CZ + .092)), name: 'cable_corriente_' + 'ABC'[i], t0: 1.2 + i * .1 });
  for (i = 0; i < 3; i++) ends.push({ m: M.cableV, p: tab.localToWorld(V(CX[i], VY, CZ + .06)), name: 'cable_tension_' + 'ABC'[i], t0: 1.6 + i * .1, clipPos: V(CX[i], VY, CZ + .03) });
  ends.push({ m: M.cableV, p: tab.localToWorld(V(-.28, .64, -.04)), name: 'cable_tension_N', t0: 1.9, clipPos: V(-.28, .64, -.055) });
  ends.forEach(function (e, n) {
    var clip = null;
    if (e.clipPos) { clip = cylZ('punta_' + e.name.slice(14), .016, .06, M.navy, tab, e.clipPos.x, e.clipPos.y, e.clipPos.z, 12); }
    cable(e.name, e.m, dev.localToWorld(V(-.15 + n * .05, .15, 0)), e.p, e.t0, clip);
  });

  /* Ruta punteada y pulso */
  var route = [V(-1.55, .012, .36), V(-1.55, .012, .64), V(-.4, .012, .64), V(-.4, .012, .38)], dots = [];
  var dotGeo = new THREE.CylinderGeometry(.028, .028, .006, 20);
  for (var sI = 0; sI < route.length - 1; sI++) {
    var A = route[sI], B = route[sI + 1], len = A.distanceTo(B), nn = Math.round(len / .075);
    for (var q = (sI ? 1 : 0); q <= nn; q++) { var pp = A.clone().lerp(B, q / nn); dots.push(mesh('ruta_punto_' + dots.length, dotGeo, M.route, world, pp.x, pp.y, pp.z, true)); }
  }
  var pulse = mesh('pulso_arranque', new THREE.TorusGeometry(.3, .012, 8, 48), M.pulse, lin, -1.05, .02, .56, true);
  pulse.rotation.x = PI / 2;

  /* Luces */
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd3dce3, .85 * LF); scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xffffff, .8 * LF);
  sun.position.set(-3.4, 7, 5); sun.target.position.set(-.4, 0, -1); scene.add(sun); scene.add(sun.target);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -5; sc.right = 5; sc.top = 5; sc.bottom = -5; sc.near = .5; sc.far = 20;
  sun.shadow.bias = -.0006; sun.shadow.normalBias = .02; sun.shadow.radius = 4;

  /* Cámara ortográfica isométrica suave, encuadre automático */
  var az = 30 * PI / 180, el = 36 * PI / 180, tgt = V(-.4, .8, -1);
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 80);
  camera.position.set(tgt.x + Math.sin(az) * Math.cos(el) * 30, tgt.y + Math.sin(el) * 30, tgt.z + Math.cos(az) * Math.cos(el) * 30);
  camera.lookAt(tgt); camera.updateMatrixWorld(true);
  (function fit() {
    var bx = new THREE.Box3(), c = V(0, 0, 0), minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    world.updateMatrixWorld(true);
    world.traverse(function (o) {
      if (!o.isMesh || o === pulse) return;
      bx.setFromObject(o);
      for (var k = 0; k < 8; k++) {
        c.set(k & 1 ? bx.max.x : bx.min.x, k & 2 ? bx.max.y : bx.min.y, k & 4 ? bx.max.z : bx.min.z).applyMatrix4(camera.matrixWorldInverse);
        minX = Math.min(minX, c.x); maxX = Math.max(maxX, c.x); minY = Math.min(minY, c.y); maxY = Math.max(maxY, c.y);
      }
    });
    var X0 = 16, X1 = 446, Y0f = 104, Y1 = 530;
    var k2 = Math.min((X1 - X0) / (maxX - minX), (Y1 - Y0f) / (maxY - minY));
    camera.left = (minX + maxX) / 2 - (X0 + X1) / 2 / k2; camera.right = camera.left + W / k2;
    camera.top = (minY + maxY) / 2 + (Y0f + Y1) / 2 / k2; camera.bottom = camera.top - H / k2;
    camera.updateProjectionMatrix();
  })();
  function toPx(v) { var p = v.clone().project(camera); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H }; }

  /* Rótulos anclados a la escena */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function makeTag(html, alert, anchor, dx, dy, maxRight) {
    var el = document.createElement('div');
    el.style.cssText = 'position:absolute;left:0;top:0;opacity:0;padding:5px 9px;border-radius:12px;font-size:11px;font-weight:600;line-height:1.25;white-space:nowrap;display:flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(0,46,70,.10);' +
      (alert ? 'background:' + OR + ';color:' + NAVY + ';' : 'background:#fff;color:' + NAVY + ';border:1px solid ' + GRAY + ';');
    el.innerHTML = html; R.tags.appendChild(el);
    var line = document.createElementNS(SVGNS, 'line'), dot = document.createElementNS(SVGNS, 'circle');
    line.setAttribute('stroke', NAVY); line.setAttribute('stroke-width', '1'); line.setAttribute('opacity', '0');
    dot.setAttribute('r', '3'); dot.setAttribute('fill', alert ? OR : NAVY); dot.setAttribute('opacity', '0');
    R.lines.insertBefore(dot, R.lines.firstChild); R.lines.insertBefore(line, R.lines.firstChild);
    var tg = { el: el, line: line, dot: dot, anchor: anchor, dx: dx, dy: dy, maxRight: maxRight };
    allTags.push(tg); return tg;
  }
  var allTags = [];
  function placeTag(tg) {
    var el = tg.el, a = toPx(tg.anchor), w0 = el.offsetWidth, h0 = el.offsetHeight, w = w0 * kTag, h = h0 * kTag;
    el.style.scale = kTag;
    var cx = clamp(a.x + tg.dx, 8 + w / 2, (tg.maxRight || W - 8) - w / 2), cy = clamp(a.y + tg.dy, 8 + h / 2, H - 8 - h / 2);
    el.style.left = (cx - w0 / 2) + 'px'; el.style.top = (cy - h0 / 2) + 'px';
    tg.line.setAttribute('x1', a.x); tg.line.setAttribute('y1', a.y); tg.line.setAttribute('x2', cx); tg.line.setAttribute('y2', cy);
    tg.dot.setAttribute('cx', a.x); tg.dot.setAttribute('cy', a.y);
    tg.cx = cx; tg.cy = cy; tg.w = w; tg.h = h;
    return w > 0 && h > 0;
  }
  function setTag(tg, op) { tg.el.style.opacity = op; tg.line.setAttribute('opacity', op * .6); tg.dot.setAttribute('opacity', op); }
  var dotHtml = function (c) { return '<span style="flex:none;width:7px;height:7px;border-radius:50%;background:' + c + ';"></span>'; };
  var tagSinParo = makeTag(dotHtml(MID) + 'Sin paro', false, lin.localToWorld(V(0, BH + .98, -.3)), 64, -6, 446);
  var tagMotor = makeTag(dotHtml(OR) + 'Arranque de motor', false, lin.localToWorld(V(-1.05, .82, .56)), -70, -30, 446);
  var tagVfd = makeTag('Variadores sin filtro', true, ccm.localToWorld(V(0, 1.72, TD / 2 + .1)), 20, -70, 446);
  var tagFil = makeTag(dotHtml(NAVY) + 'Filtro de armónicos', false, fil.localToWorld(V(0, 1.9, 0)), -34, -62, 446);
  var tagCap = makeTag('<span style="display:flex;flex-direction:column;"><span style="font-size:10.5px;font-weight:500;color:' + MID + ';">Banco de capacitores</span><span>desintonizado</span></span>', false, cap.localToWorld(V(.1, 2.1, 0)), 40, -30, 446);
  tagCap.el.style.borderRadius = '8px';

  var evPos = { x: 470, y: 268 }, motorTagEdge = { x: 0, y: 0 }, laidOut = false;
  function layout() {
    var ok = true;
    allTags.forEach(function (tg) { if (!placeTag(tg)) ok = false; });
    var pr = R.panel.getBoundingClientRect(), er = R.evt.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    var sc = sr.width / W;
    if (sc > 0 && er.height > 0) { evPos = { x: (pr.left - sr.left) / sc, y: (er.top - sr.top) / sc + er.height / sc / 2 }; }
    else { evPos = { x: R.panel.offsetLeft, y: 268 }; ok = false; }
    motorTagEdge = { x: tagMotor.cx + tagMotor.w / 2, y: tagMotor.cy };
    laidOut = ok;
  }

  /* ---------- Datos simulados ---------- */
  function trazas() {
    var out = [];
    for (var f = 0; f < 3; f++) {
      var s = 1234 + f * 977, rnd = function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
      var y0 = 4 + f * 58, lh = 50, d = '';
      for (var h = 0; h <= 168; h++) {
        var day = Math.floor(h / 24), hr = h % 24, lv;
        if (day < 5) lv = hr < 6 ? .22 : hr < 8 ? .22 + .25 * (hr - 5) : hr < 22 ? .74 + .07 * Math.sin(hr * .9 + f) : .26;
        else if (day === 5) lv = hr >= 7 && hr < 15 ? .5 : .2; else lv = .18;
        lv = clamp(lv + (rnd() - .5) * .1 + f * .02, .05, .95);
        d += (h ? 'L' : 'M') + (18 + h / 168 * 202).toFixed(1) + ' ' + (y0 + lh - 4 - lv * (lh - 8)).toFixed(1);
      }
      out.push(d);
    }
    return out;
  }
  function wavePath(d) {
    var s = '';
    for (var k = 0; k <= 160; k++) {
      var th = k / 160 * 4 * PI;
      var y = Math.sin(th) + d * (-.32 * Math.sin(5 * th) - .2 * Math.sin(7 * th) + .06 * Math.sin(11 * th));
      s += (k ? 'L' : 'M') + (k / 160 * 220).toFixed(1) + ' ' + (30 - y * 19).toFixed(1);
    }
    return s;
  }

  /* ---------- Estado por tiempo ---------- */
  var curPh = -1, lastD = -1, angA = 0, angB = 0, dist = .3;
  function speedB(t) { if (t < 8.8) return 1; if (t < 9.2) return 1 - seg(t, 8.8, 9.2); if (t < 11.3) return 0; return eio(seg(t, 11.3, 12.0)); }
  function placeProducts() {
    var span = 2.2, half = span / 2;
    products.forEach(function (p, n) {
      var x = ((dist + n * span / 4) % span) - half;
      p.position.x = x; p.scale.setScalar(Math.max(.001, Math.min(1, (x + half) / .18, (half - x) / .18)));
    });
  }
  function pillState(el, ok) { el.style.background = ok ? NAVY : OR; el.style.color = ok ? '#fff' : NAVY; }

  function update(t) {
    if (!laidOut) layout();
    var ph = t < PH[1] ? 0 : t < PH[2] ? 1 : t < PH[3] ? 2 : t < PH[4] ? 3 : 4, k, e, p;
    if (ph !== curPh) {
      curPh = ph; R.title.textContent = TITULOS[ph];
      for (k = 0; k < 5; k++) R['bar' + k].style.background = k < ph ? NAVY : k === ph ? OR : GRAY;
    }
    k = seg(t - PH[ph], 0, .3); R.title.style.opacity = k; R.title.style.transform = 'translateY(' + ((1 - k) * 6).toFixed(1) + 'px)';

    /* Fase 1 */
    e = eout(seg(t, .2, 1.0)); an.visible = t >= .2; an.position.set(AN0.x, (1 - e) * .6, AN0.z + (1 - e) * .5);
    rings.forEach(function (rg, n) { var q = seg(t, .9 + n * .15, 1.35 + n * .15), qe = eout(q); rg.visible = q > 0; rg.position.y = RY + (1 - qe) * .3; rg.scale.setScalar(.6 + .4 * qe); });
    cables.forEach(function (c) { var q = seg(t, c.t0, c.t0 + .8); c.mesh.visible = q > 0; c.mesh.geometry.setDrawRange(0, Math.floor(q * TUB) * RAD * 6); if (c.clip) c.clip.visible = q >= 1; });
    M.anScreen.emissiveIntensity = t > 2.4 ? .7 : .15;
    setTag(tagSinParo, seg(t, 1.8, 2.1) * (1 - seg(t, 6.0, 6.3)));

    /* Fase 2 */
    R.panel.style.opacity = seg(t, 3.3, 3.7); R.panel.style.transform = 'translateY(' + ((1 - seg(t, 3.3, 3.7)) * 8).toFixed(1) + 'px)';
    p = seg(t, 3.7, 6.1);
    R.logClip.setAttribute('width', (18 + p * 202).toFixed(1));
    R.logCur.setAttribute('x1', 18 + p * 202); R.logCur.setAttribute('x2', 18 + p * 202); R.logCur.setAttribute('opacity', p > 0 && p < 1 ? 1 : 0);
    var nd = p <= 0 ? 0 : Math.min(7, Math.ceil(p * 7 - 1e-6));
    R.dias.textContent = nd + (nd === 1 ? ' día' : ' días');
    for (k = 0; k < 7; k++) { var done = k < nd; R['dia' + k].setAttribute('fill', done ? NAVY : MID); R['dia' + k].setAttribute('font-weight', done ? '700' : '400'); }
    R.secLog.style.opacity = 1 - seg(t, 6.4, 6.7);
    R.secAn.style.opacity = seg(t, 6.5, 6.8);

    /* Fase 3 */
    R.waveClip.setAttribute('width', (220 * seg(t, 6.6, 7.3)).toFixed(1));
    var fix = eio(seg(t, 13.5, 14.2));
    var d = eio(seg(t, 7.4, 8.3)) * (1 - fix);
    if (Math.abs(d - lastD) > .002) { R.wave.setAttribute('d', wavePath(d)); lastD = d; }
    var g = eout(seg(t, 7.6, 8.5));
    for (k = 0; k < 5; k++) {
      var v = g * lerp(HB[k], HG[k], fix), hh = v / HMAX * HH;
      R['hb' + k].setAttribute('y', (HBASE - hh).toFixed(1)); R['hb' + k].setAttribute('height', hh.toFixed(1));
      R['hb' + k].setAttribute('fill', v > HREF ? OR : fix > .5 ? NAVY : MID);
    }
    R.href.setAttribute('opacity', seg(t, 7.5, 7.8));
    k = seg(t, 8.4, 8.8); R.ind.style.opacity = k; R.ind.style.transform = 'translateY(' + ((1 - k) * 8).toFixed(1) + 'px)';
    var f2 = eio(seg(t, 13.6, 14.3)), thd = lerp(18.4, 5.1, f2), pf = lerp(.86, .96, f2);
    R.v1.textContent = thd.toFixed(1) + ' %'; R.v2.textContent = pf.toFixed(2);
    pillState(R.v1, thd <= 8); pillState(R.v2, pf >= .895);

    /* Fase 4 */
    var routeOut = 1 - seg(t, 12.9, 13.2);
    M.route.opacity = routeOut;
    dots.forEach(function (o, n) { o.visible = t >= 9.8 + n / dots.length * 1.0 && routeOut > 0; });
    var hv = seg(t, 10.6, 11.0) * (1 - seg(t, 13.0, 13.5));
    M.vfd.color.copy(cMid).lerp(cOr, hv); M.vfd.emissiveIntensity = hv * .22;
    setTag(tagVfd, seg(t, 10.8, 11.1) * (1 - seg(t, 12.8, 13.0)));
    R.evt.style.opacity = seg(t, 11.1, 11.3);
    R.evtFlash.style.opacity = Math.sin(PI * seg(t, 11.4, 11.9)).toFixed(3);
    var lo = seg(t, 11.4, 11.7) * (1 - seg(t, 12.5, 12.8)), lp = eout(seg(t, 11.4, 11.9));
    R.evLine.setAttribute('x1', evPos.x); R.evLine.setAttribute('y1', evPos.y);
    R.evLine.setAttribute('x2', lerp(evPos.x, motorTagEdge.x, lp)); R.evLine.setAttribute('y2', lerp(evPos.y, motorTagEdge.y, lp));
    if (movil) lo = 0;
    R.evLine.setAttribute('opacity', lo);
    R.evDot.setAttribute('cx', evPos.x); R.evDot.setAttribute('cy', evPos.y); R.evDot.setAttribute('opacity', lo);
    setTag(tagMotor, seg(t, 11.5, 11.8) * (1 - seg(t, 12.5, 12.8)));
    if (t > 11.3 && t < 12.5) { var s2 = ((t - 11.3) % .6) / .6; pulse.visible = true; pulse.scale.setScalar(.6 + s2 * 1.6); M.pulse.opacity = (1 - s2) * .85; }
    else { pulse.visible = false; M.pulse.opacity = 0; }
    M.lampB.emissiveIntensity = speedB(t) > .05 ? .9 : .04;

    /* Fase 5 */
    e = eback(seg(t, 12.9, 13.5)); fil.visible = e > 0; fil.scale.set(1, Math.max(.001, e), 1);
    e = eback(seg(t, 13.2, 13.7)); reac.visible = e > 0; reac.scale.setScalar(Math.max(.001, e));
    setTag(tagFil, seg(t, 13.4, 13.7));
    setTag(tagCap, seg(t, 13.6, 13.9));
    var ss = seg(t, 14.4, 14.95); R.seal.style.opacity = Math.min(1, ss * 3); R.seal.style.transform = 'scale(' + (ss > 0 ? eback(ss) : .5).toFixed(3) + ')';
    k = seg(t, 14.7, 15.0); R.rep.style.opacity = k; R.rep.style.transform = 'translateX(' + ((1 - k) * 12).toFixed(1) + 'px)';
    for (var n = 0; n < 3; n++) R['rr' + n].style.opacity = seg(t, 14.85 + n * .15, 15.1 + n * .15);

    R.veil.style.opacity = reduced ? 0 : (t < .3 ? 1 - seg(t, 0, .3) : seg(t, 15.7, 16));
  }

  /* ---------- Bucle, pausa y accesibilidad ---------- */
  var t = 0, last = null, raf = 0, running = false, onScreen = true, reduced = false, disposed = false;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  reduced = !!(mq && mq.matches);
  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = last == null ? 0 : Math.min(.05, (now - last) / 1000); last = now;
    t = (t + dt) % CICLO;
    angA += dt * 9; angB += dt * 9 * speedB(t); dist += dt * .28;
    motA.hub.rotation.z = angA; motB.hub.rotation.z = angB; placeProducts();
    update(t); renderer.render(scene, camera);
  }
  function start() { if (running || disposed || reduced || !onScreen || document.hidden) return; running = true; last = null; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  function renderStatic() { placeProducts(); update(15.6); renderer.render(scene, camera); }
  function syncMode() { if (reduced) { stop(); renderStatic(); } else start(); }

  /* Teléfono: la escena se recorta a la parte 3D (el ancho CW) y las tres
     tarjetas del analizador bajan a una columna debajo, a tamaño legible.
     A la escala completa sus textos quedaban de 5 px. */
  var CW = 458, movil = false, kTag = 1;
  var col = document.createElement('div');
  col.style.cssText = 'position:absolute;left:0;top:0;width:244px;transform-origin:0 0;display:none;color:' + NAVY + ';font-family:' + FONT + ';';
  root.appendChild(col);
  var TARJ = [R.panel, R.ind, R.rep], TOPS = ['18px', '308px', '396px'];
  function acomodar(m) {
    movil = m;
    TARJ.forEach(function (c, n) {
      if (m) { col.appendChild(c); c.style.left = '0px'; }
      else { ov.insertBefore(c, R.seal); c.style.left = '458px'; c.style.top = TOPS[n]; }
    });
    col.style.display = m ? 'block' : 'none';
    stage.style.width = (m ? CW : W) + 'px';
  }
  var lastW = -1;
  function resize(force) {
    var w = root.clientWidth || W, s = w / W;
    if (force !== true && w === lastW) return; lastW = w;
    var m = w < 600;
    if (m !== movil) acomodar(m);
    if (m) {
      s = w / CW;
      var y = 0;
      TARJ.forEach(function (c) { c.style.top = y + 'px'; y += c.offsetHeight + 8; });
      var sC = Math.min(1.15, w / 256), gap = 14;
      col.style.transform = 'scale(' + sC + ')';
      col.style.left = ((w - 244 * sC) / 2) + 'px';
      col.style.top = (H * s + gap) + 'px';
      root.style.height = (H * s + gap + (y - 8) * sC) + 'px';
    } else root.style.height = (H * s) + 'px';
    kTag = s < 0.75 ? Math.min(1.45, 0.8 / s) : 1;
    R.head.style.scale = Math.min(kTag, 1.3);
    R.seal.style.transformOrigin = '100% 0'; R.seal.style.scale = Math.min(kTag, 1.2);
    stage.style.transform = 'scale(' + s + ')';
    renderer.setPixelRatio(Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * s)));
    renderer.setSize(W, H);
    renderer.domElement.style.width = W + 'px'; renderer.domElement.style.height = H + 'px';
    layout();
    if (!running) { if (reduced) renderStatic(); else { update(t); renderer.render(scene, camera); } }
  }
  var ro = null;
  if (window.ResizeObserver) { ro = new ResizeObserver(function () { requestAnimationFrame(resize); }); ro.observe(root); } else window.addEventListener('resize', resize);
  var io = null;
  if (window.IntersectionObserver) {
    io = new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; if (onScreen) start(); else stop(); }, { threshold: 0 });
    io.observe(root);
  }
  function onVis() { if (document.hidden) stop(); else start(); }
  document.addEventListener('visibilitychange', onVis);
  function onMq(ev) { reduced = ev.matches; syncMode(); }
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); }

  resize();
  syncMode();

  function limpiar() {
    if (disposed) return; disposed = true; stop();
    if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
    if (io) io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', onMq); else if (mq.removeListener) mq.removeListener(onMq); }
    var geos = new Set(), mats = new Set();
    scene.traverse(function (o) {
      if (o.geometry) geos.add(o.geometry);
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { mats.add(m); });
    });
    geos.forEach(function (g) { g.dispose(); }); mats.forEach(function (m) { m.dispose(); });
    if (sun.shadow && sun.shadow.map) sun.shadow.map.dispose();
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (root.parentNode) root.parentNode.removeChild(root);
  }
  limpiar.irA = function (s) { resize(true); t = clamp(s, 0, CICLO - .001); curPh = -1; update(t); renderer.render(scene, camera); };
  return limpiar;
}
