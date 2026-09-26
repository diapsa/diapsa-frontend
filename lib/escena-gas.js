/**
 * Escena "Detección de fugas de gas": la fuga que no se ve, la cámara OGI
 * que la hace visible, el láser TDLAS que confirma que es metano, la
 * reparación con su reinspección y el registro listo para la ASEA.
 *
 * Generada en Claude Diseño (docs/designs/deteccion-gas-escena.html) y
 * portada como las demás escenas: recibe THREE y el contenedor y devuelve
 * la limpieza, con limpiar.irA(segundo). Trae su propio acomodo para
 * pantallas angostas (la columna de paneles baja debajo de la escena).
 * Ajuste propio: el láser TDLAS se nombra en el título y en su panel, con
 * la línea de absorción del metano, y el detector es más grande.
 */
/* eslint-disable */
export function montarEscenaGas(THREE, container) {
  var REV = parseInt(String(THREE.REVISION).replace(/\D/g, ''), 10) || 128;
  var LK = REV >= 155 ? Math.PI : 1;           // unidades físicas de luz desde r155
  var CYC = 16, PH = [0, 3, 6.5, 9.5, 12.5, 16];
  var TITULOS = ['Una fuga que no se ve', 'La cámara OGI la hace visible', 'El láser TDLAS confirma que es metano', 'Se repara y se vuelve a revisar', 'Cerrada y documentada'];
  var FIN = 15.5;
  var cl = function (v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.min(b, Math.max(a, v)); };
  var sm = function (a, b, t) { var x = cl((t - a) / (b - a)); return x * x * (3 - 2 * x); };
  var lerp = function (a, b, x) { return a + (b - a) * x; };
  var win = function (t, a, b, f) { f = f || 0.3; return sm(a, a + f, t) * (1 - sm(b - f, b, t)); };
  var frac = function (v) { return v - Math.floor(v); };
  var back = function (p) { var c1 = 1.9, c3 = c1 + 1; return p <= 0 ? 0 : 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

  // ---------- DOM ----------
  var css = document.createElement('style');
  css.textContent = [
    '.dgas-root{position:relative;width:100%;overflow:hidden;font-family:"IBM Plex Sans","Segoe UI",system-ui,sans-serif;color:#002e46;-webkit-font-smoothing:antialiased;line-height:1.3}',
    '.dgas-root *{box-sizing:border-box}',
    '.dgas-stage{position:absolute;left:0;top:0;width:720px;height:540px;transform-origin:0 0;background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%);pointer-events:none}',
    '.dgas-sw{position:absolute;left:0;top:0;width:460px;height:540px}',
    '.dgas-scene{position:absolute;left:0;top:0;width:460px;height:540px;transform-origin:0 0}',
    '.dgas-scene canvas{display:block;width:460px!important;height:540px!important}',
    '.dgas-title{position:absolute;left:24px;top:22px;width:410px}',
    '.dgas-title h2{margin:0;font-size:20px;line-height:1.25;font-weight:700;letter-spacing:-.01em;color:#002e46}',
    '.dgas-bars{display:flex;gap:6px;margin-top:12px}',
    '.dgas-bars span{width:40px;height:4px;border-radius:2px;background:#d9e2e8}',
    '.dgas-col{position:absolute;left:476px;top:24px;width:220px;height:492px;display:grid;grid-template-columns:minmax(0,1fr);align-content:start}',
    '.dgas-g{grid-area:1/1;display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.dgas-p{background:#fff;border:1px solid #d9e2e8;border-radius:8px;box-shadow:0 6px 18px rgba(0,46,70,.07);padding:10px 12px}',
    '.dgas-lbl{font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#2b5671}',
    '.dgas-row{display:flex;justify-content:space-between;align-items:center;gap:8px}',
    '.dgas-rec{display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:600;letter-spacing:.06em;color:#002e46}',
    '.dgas-rec i{width:7px;height:7px;border-radius:50%;background:#fc9f01;display:block}',
    '.dgas-view{position:relative;margin-top:8px;border-radius:4px;overflow:hidden;aspect-ratio:4/3;background:#b8c0c6}',
    '.dgas-view canvas{display:block;width:100%!important;height:100%!important;filter:grayscale(1) contrast(1.2) brightness(1.04)}',
    '.dgas-tgt{position:absolute;width:34%;aspect-ratio:1;transform:translate(-50%,-50%)}',
    '.dgas-tgt b{position:absolute;width:12px;height:12px;border-color:#fc9f01;border-style:solid;border-width:0}',
    '.dgas-tgt b:nth-child(1){left:0;top:0;border-left-width:2px;border-top-width:2px}',
    '.dgas-tgt b:nth-child(2){right:0;top:0;border-right-width:2px;border-top-width:2px}',
    '.dgas-tgt b:nth-child(3){left:0;bottom:0;border-left-width:2px;border-bottom-width:2px}',
    '.dgas-tgt b:nth-child(4){right:0;bottom:0;border-right-width:2px;border-bottom-width:2px}',
    '.dgas-vtag{position:absolute;left:6px;bottom:5px;font-size:10px;font-weight:600;letter-spacing:.06em;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)}',
    '.dgas-swap{display:grid;margin-top:6px}',
    '.dgas-swap>div{grid-area:1/1}',
    '.dgas-val{font-size:16px;font-weight:700;color:#002e46;margin-top:3px}',
    '.dgas-chip{display:inline-block;margin-top:8px;padding:3px 9px;border-radius:999px;background:#fc9f01;color:#002e46;font-size:12px;font-weight:700}',
    '.dgas-ok{display:flex;align-items:center;gap:8px;margin-top:3px}',
    '.dgas-nada{display:flex;align-items:center;gap:8px;font-size:13px;color:#2b5671;border-top:1px solid #d9e2e8;padding-top:9px}',
    '.dgas-ct{font-size:15px;font-weight:700;margin:4px 0 8px}',
    '.dgas-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
    '.dgas-list li{display:flex;align-items:center;gap:10px;font-size:13.5px;padding:7px 0;border-top:1px solid #eef1f4}',
    '.dgas-ck{width:20px;height:20px;border-radius:50%;border:1.5px solid #d9e2e8;display:flex;align-items:center;justify-content:center;flex:none}',
    '.dgas-ck svg{opacity:0}',
    '.dgas-ck.on{background:#002e46;border-color:#002e46}',
    '.dgas-ck.on svg{opacity:1}',
    '.dgas-ev{font-size:12px;color:#2b5671;border-top:1px solid #d9e2e8;padding-top:8px;margin-top:2px}',
    '.dgas-sw2{display:flex;justify-content:center;padding-top:8px}',
    '.dgas-stamp{width:124px;height:124px;border-radius:50%;border:3px solid #fc9f01;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;position:relative}',
    '.dgas-stamp:before{content:"";position:absolute;inset:6px;border-radius:50%;border:1.5px dashed #fc9f01}',
    '.dgas-stamp span{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;text-align:center;line-height:1.25;padding:0 18px;color:#002e46}',
    '.dgas-foot{position:absolute;right:0;bottom:0;font-size:10.5px;color:#2b5671}',
    '.dgas-narrow .dgas-stage{position:relative;width:100%;height:auto;transform:none!important}',
    '.dgas-narrow .dgas-sw{position:relative;width:100%}',
    '.dgas-narrow .dgas-col{position:relative;left:auto;top:auto;width:auto;height:auto;padding:6px 14px 14px}',
    '.dgas-narrow .dgas-foot{position:static;grid-area:2/1;margin-top:10px}',
    '.dgas-narrow .dgas-p{padding:12px 14px}'
  ].join('\n');
  document.head.appendChild(css);

  var CHECK = '<svg width="11" height="11" viewBox="0 0 12 12"><path d="M2.5 6.3l2.4 2.4 4.6-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var root = document.createElement('div');
  root.className = 'dgas-root';
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', 'Animación: detección de una fuga de gas con cámara OGI y láser TDLAS, reparación, reinspección y registro. Datos simulados.');
  root.innerHTML =
    '<div class="dgas-stage">' +
      '<div class="dgas-sw"><div class="dgas-scene">' +
        '<div class="dgas-title"><h2></h2><div class="dgas-bars"><span></span><span></span><span></span><span></span><span></span></div></div>' +
      '</div></div>' +
      '<div class="dgas-col">' +
        '<div class="dgas-g" data-g="a"><div class="dgas-nada"><svg width="18" height="12" viewBox="0 0 18 12"><path d="M1 6c2.2-3.3 4.9-5 8-5s5.8 1.7 8 5c-2.2 3.3-4.9 5-8 5S3.2 9.3 1 6z" fill="none" stroke="#2b5671" stroke-width="1.3"/><circle cx="9" cy="6" r="2.2" fill="none" stroke="#2b5671" stroke-width="1.3"/></svg>A simple vista: nada</div></div>' +
        '<div class="dgas-g" data-g="b">' +
          '<div class="dgas-p" data-p="ogi"><div class="dgas-row"><span class="dgas-lbl">Vista cámara OGI</span><span class="dgas-rec"><i></i>REC</span></div>' +
            '<div class="dgas-view"><div class="dgas-tgt"><b></b><b></b><b></b><b></b></div></div></div>' +
          '<div class="dgas-p" data-p="las"><div class="dgas-swap">' +
            '<div data-s="1"><div class="dgas-lbl">Láser TDLAS</div><div class="dgas-val">Metano · 1,250 ppm·m</div><svg viewBox="0 0 196 44" style="display:block;width:100%;height:40px;margin-top:8px"><path d="M0 10 H70 C80 10 84 38 92 38 S104 10 114 10 H196" fill="none" stroke="#002e46" stroke-width="1.6"/><line x1="92" y1="2" x2="92" y2="42" stroke="#fc9f01" stroke-width="1" stroke-dasharray="2 2"/><text x="98" y="30" font-size="9" font-weight="700" fill="#2b5671">CH₄</text></svg><span class="dgas-chip">Confirmado: es metano</span></div>' +
            '<div data-s="2"><div class="dgas-lbl">Estado</div><div class="dgas-ok"><span class="dgas-ck on">' + CHECK + '</span><span class="dgas-val" style="margin:0">Reinspección: sin fuga</span></div></div>' +
          '</div></div>' +
        '</div>' +
        '<div class="dgas-g" data-g="c">' +
          '<div class="dgas-p"><div class="dgas-lbl">Registro</div><div class="dgas-ct">Fuga 014 · brida de succión</div>' +
            '<ul class="dgas-list">' + ['Detectada', 'Reparada', 'Reinspeccionada', 'Cerrada'].map(function (s) { return '<li><span class="dgas-ck">' + CHECK + '</span>' + s + '</li>'; }).join('') + '</ul>' +
            '<div class="dgas-ev">Evidencia: video OGI, lectura TDLAS, foto</div></div>' +
          '<div class="dgas-sw2"><div class="dgas-stamp"><span>Lista para la ASEA</span></div></div>' +
        '</div>' +
        '<div class="dgas-foot">Datos simulados</div>' +
      '</div>' +
    '</div>';
  container.appendChild(root);
  var q = function (s) { return root.querySelector(s); };
  var el = {
    stage: q('.dgas-stage'), sw: q('.dgas-sw'), scene: q('.dgas-scene'), h2: q('.dgas-title h2'), title: q('.dgas-title'),
    bars: root.querySelectorAll('.dgas-bars span'), gA: q('[data-g=a]'), gB: q('[data-g=b]'), gC: q('[data-g=c]'),
    ogi: q('[data-p=ogi]'), las: q('[data-p=las]'), s1: q('[data-s="1"]'), s2: q('[data-s="2"]'), chip: q('.dgas-chip'),
    view: q('.dgas-view'), tgt: q('.dgas-tgt'), rec: q('.dgas-rec i'), cks: root.querySelectorAll('.dgas-list .dgas-ck'),
    ev: q('.dgas-ev'), card: q('[data-g=c] .dgas-p'), stamp: q('.dgas-stamp')
  };

  // ---------- Renderers ----------
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  el.scene.insertBefore(renderer.domElement, el.title);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  var rOgi = new THREE.WebGLRenderer({ antialias: true });
  rOgi.setClearColor(0xb8c0c6, 1);
  rOgi.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  rOgi.setSize(360, 270, false);
  el.view.insertBefore(rOgi.domElement, el.tgt);

  // ---------- Escena ----------
  var scene = new THREE.Scene();
  var world = new THREE.Group(); world.name = 'patin_gas'; scene.add(world);

  function M(name, color, rough, metal, extra) {
    var m = new THREE.MeshStandardMaterial(Object.assign({ color: color, roughness: rough, metalness: metal }, extra || {}));
    m.name = name; return m;
  }
  var mat = {
    plat: M('plataforma', 0xd9e2e8, 0.9, 0.0),
    pipe: M('tuberia', 0x2b5671, 0.42, 0.35),
    navy: M('acero_marino', 0x002e46, 0.45, 0.4),
    light: M('carcasa_clara', 0xf2f5f7, 0.5, 0.15),
    grayM: M('gris_metal', 0xc3ced6, 0.5, 0.3),
    fuga: M('brida_succion', 0x002e46, 0.45, 0.4, { emissive: 0xfc9f01, emissiveIntensity: 0 }),
    vest: M('chaleco', 0xfc9f01, 0.8, 0.0),
    shirt: M('camisa', 0x2b5671, 0.85, 0.0),
    pants: M('pantalon', 0x002e46, 0.85, 0.0),
    skin: M('piel', 0xd7b596, 0.8, 0.0),
    helmet: M('casco', 0xfbfcfd, 0.4, 0.0),
    dark: M('equipo', 0x1d2a33, 0.5, 0.2),
    strip: M('reflejante', 0xeef1f4, 0.35, 0.1)
  };
  var basicO = new THREE.MeshBasicMaterial({ color: 0xfc9f01 }); basicO.name = 'marcador';

  function mesh(name, geo, m, parent, x, y, z) {
    var o = new THREE.Mesh(geo, m); o.name = name;
    o.position.set(x || 0, y || 0, z || 0);
    o.castShadow = true; o.receiveShadow = true;
    parent.add(o); return o;
  }
  var PY = 0.75, PR = 0.085, TOP = 0.18;
  var gPipe = new THREE.CylinderGeometry(PR, PR, 1, 32);
  var gFl = new THREE.CylinderGeometry(0.15, 0.15, 0.035, 36);
  var gBolt = new THREE.CylinderGeometry(0.014, 0.014, 0.075, 8);

  // plataforma y sombra al piso
  mesh('plataforma', new THREE.BoxGeometry(6.3, TOP, 3.3), mat.plat, world, 0.05, TOP / 2, 0);
  mesh('borde_frontal', new THREE.BoxGeometry(6.3, 0.03, 0.02), mat.pipe, world, 0.05, TOP - 0.015, 1.651);
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.name = 'piso_sombra'; ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  function pipeX(x0, x1, z) {
    var o = mesh('tubo', gPipe, mat.pipe, world, (x0 + x1) / 2, PY, z);
    o.scale.y = x1 - x0; o.rotation.z = Math.PI / 2; return o;
  }
  function flange(parent, x, y, z, m) {
    var d = mesh('brida', gFl, m, parent, x, y, z); d.rotation.z = Math.PI / 2; return d;
  }
  function bolts(parent, x, y, z) {
    var g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      var b = mesh('perno', gBolt, mat.grayM, g, 0, Math.cos(a) * 0.118, Math.sin(a) * 0.118);
      b.rotation.z = Math.PI / 2;
    }
    return g;
  }
  function flangePair(x, z) { flange(world, x - 0.02, PY, z, mat.navy); flange(world, x + 0.02, PY, z, mat.navy); bolts(world, x, PY, z); }
  function support(x, z) {
    mesh('soporte', new THREE.CylinderGeometry(0.035, 0.035, PY - PR - TOP, 16), mat.navy, world, x, TOP + (PY - PR - TOP) / 2, z);
    mesh('silleta', new THREE.BoxGeometry(0.12, 0.03, 0.22), mat.navy, world, x, PY - PR - 0.015, z);
    mesh('placa', new THREE.BoxGeometry(0.2, 0.02, 0.2), mat.navy, world, x, TOP + 0.01, z);
  }
  function valve(x, z) {
    var g = new THREE.Group(); g.name = 'valvula'; g.position.set(x, PY, z); world.add(g);
    mesh('cuerpo', new THREE.BoxGeometry(0.24, 0.28, 0.24), mat.navy, g, 0, 0, 0);
    flange(g, -0.15, 0, 0, mat.navy); flange(g, 0.15, 0, 0, mat.navy);
    mesh('bonete', new THREE.CylinderGeometry(0.06, 0.08, 0.3, 24), mat.navy, g, 0, 0.29, 0);
    mesh('vastago', new THREE.CylinderGeometry(0.014, 0.014, 0.16, 8), mat.grayM, g, 0, 0.51, 0);
    var w = mesh('volante', new THREE.TorusGeometry(0.13, 0.016, 10, 40), mat.grayM, g, 0, 0.58, 0); w.rotation.x = Math.PI / 2;
    var s = mesh('radio', new THREE.BoxGeometry(0.26, 0.012, 0.012), mat.grayM, g, 0, 0.58, 0); s.rotation.y = 0.5;
    var s2 = mesh('radio', new THREE.BoxGeometry(0.26, 0.012, 0.012), mat.grayM, g, 0, 0.58, 0); s2.rotation.y = 0.5 + Math.PI / 2;
  }
  [0.9, -0.9].forEach(function (z) {
    mesh('ascendente', new THREE.CylinderGeometry(PR, PR, PY - TOP, 32), mat.pipe, world, -2.75, TOP + (PY - TOP) / 2, z);
    mesh('codo', new THREE.SphereGeometry(PR * 1.02, 32, 16), mat.pipe, world, -2.75, PY, z);
    mesh('brida_base', gFl, mat.navy, world, -2.75, TOP + 0.02, z);
    pipeX(-2.75, 2.05, z);
    support(-2.1, z); support(-0.3, z);
  });
  flangePair(-1.75, 0.9); flangePair(-1.4, -0.9); flangePair(1.55, -0.9);
  valve(-0.95, 0.9); valve(0.3, -0.9);
  // manómetro
  mesh('toma', new THREE.CylinderGeometry(0.02, 0.02, 0.28, 12), mat.grayM, world, 0.45, PY + 0.14, 0.9);
  var dial = mesh('manometro', new THREE.CylinderGeometry(0.075, 0.075, 0.03, 32), mat.light, world, 0.45, PY + 0.34, 0.9); dial.rotation.x = Math.PI / 2;
  var rim = mesh('aro', new THREE.TorusGeometry(0.075, 0.012, 8, 32), mat.navy, world, 0.45, PY + 0.34, 0.917);
  // brida de succión (la de la fuga)
  var FL = new THREE.Vector3(1.68, PY, 0.9);
  var fugaG = new THREE.Group(); fugaG.name = 'brida_succion'; fugaG.position.copy(FL); world.add(fugaG);
  flange(fugaG, -0.02, 0, 0, mat.fuga); flange(fugaG, 0.02, 0, 0, mat.fuga);
  var fugaBolts = bolts(fugaG, 0, 0, 0);
  // compresor
  var comp = new THREE.Group(); comp.name = 'compresor'; comp.position.set(2.38, 0, 0); world.add(comp);
  mesh('patin', new THREE.BoxGeometry(1.0, 0.1, 2.3), mat.navy, comp, 0, TOP + 0.05, 0);
  [-0.7, 0.7].forEach(function (z) { mesh('cuna', new THREE.BoxGeometry(0.5, 0.2, 0.16), mat.navy, comp, 0, TOP + 0.2, z); });
  var ves = mesh('recipiente', new THREE.CylinderGeometry(0.36, 0.36, 2.1, 48), mat.light, comp, 0, 0.72, 0); ves.rotation.x = Math.PI / 2;
  [-1.06, 1.06].forEach(function (z) { var c = mesh('tapa', new THREE.CylinderGeometry(0.37, 0.37, 0.04, 48), mat.navy, comp, 0, 0.72, z); c.rotation.x = Math.PI / 2; });
  mesh('motor', new THREE.BoxGeometry(0.46, 0.3, 0.8), mat.navy, comp, 0, 1.2, -0.1);
  var fan = mesh('ventilador', new THREE.CylinderGeometry(0.13, 0.13, 0.08, 32), mat.grayM, comp, 0, 1.2, 0.34); fan.rotation.x = Math.PI / 2;
  mesh('base_motor', new THREE.BoxGeometry(0.34, 0.06, 0.6), mat.navy, comp, 0, 1.05, -0.1);
  // barandal trasero
  for (var rx = -2.95; rx <= 3.1; rx += 1.5) mesh('poste', new THREE.CylinderGeometry(0.02, 0.02, 0.92, 10), mat.pipe, world, rx, TOP + 0.46, -1.58);
  [TOP + 0.92, TOP + 0.5].forEach(function (y) { var r = mesh('pasamanos', new THREE.CylinderGeometry(0.018, 0.018, 6.05, 12), mat.pipe, world, 0.05, y, -1.58); r.rotation.z = Math.PI / 2; });

  // ---------- Técnico ----------
  var tech = new THREE.Group(); tech.name = 'tecnico'; tech.position.y = TOP; world.add(tech);
  var body = new THREE.Group(); tech.add(body);
  function leg(x) {
    var g = new THREE.Group(); g.position.set(x, 0.86, 0); body.add(g);
    mesh('pierna', new THREE.BoxGeometry(0.14, 0.78, 0.16), mat.pants, g, 0, -0.39, 0);
    mesh('bota', new THREE.BoxGeometry(0.15, 0.09, 0.26), mat.dark, g, 0, -0.815, 0.04);
    return g;
  }
  var legL = leg(0.1), legR = leg(-0.1);
  mesh('torso', new THREE.BoxGeometry(0.4, 0.56, 0.24), mat.shirt, body, 0, 1.14, 0);
  mesh('chaleco', new THREE.BoxGeometry(0.42, 0.42, 0.26), mat.vest, body, 0, 1.11, 0);
  [1.0, 1.19].forEach(function (y) { mesh('franja', new THREE.BoxGeometry(0.424, 0.03, 0.264), mat.strip, body, 0, y, 0); });
  mesh('cuello', new THREE.CylinderGeometry(0.05, 0.05, 0.08, 12), mat.skin, body, 0, 1.45, 0);
  mesh('cabeza', new THREE.SphereGeometry(0.105, 32, 20), mat.skin, body, 0, 1.55, 0);
  mesh('casco', new THREE.SphereGeometry(0.122, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat.helmet, body, 0, 1.575, 0);
  mesh('ala_casco', new THREE.CylinderGeometry(0.15, 0.15, 0.015, 32), mat.helmet, body, 0, 1.58, 0.02);
  function arm(x) {
    var g = new THREE.Group(); g.position.set(x, 1.38, 0); g.rotation.z = x > 0 ? 0.06 : -0.06; body.add(g);
    mesh('brazo', new THREE.BoxGeometry(0.1, 0.6, 0.12), mat.shirt, g, 0, -0.3, 0);
    mesh('mano', new THREE.SphereGeometry(0.048, 16, 12), mat.skin, g, 0, -0.63, 0);
    return g;
  }
  var armR = arm(-0.27), armL = arm(0.27);
  mesh('camara_ogi', new THREE.BoxGeometry(0.13, 0.1, 0.17), mat.dark, armR, 0, -0.7, 0.02);
  mesh('lente', new THREE.CylinderGeometry(0.035, 0.035, 0.07, 20), mat.grayM, armR, 0, -0.78, 0.02);
  mesh('detector', new THREE.BoxGeometry(0.1, 0.24, 0.12), mat.navy, armL, 0, -0.72, 0.01);
  mesh('detector_pantalla', new THREE.BoxGeometry(0.102, 0.08, 0.02), basicO, armL, 0, -0.66, 0.065);
  mesh('punta', new THREE.CylinderGeometry(0.018, 0.018, 0.03, 12), basicO, armL, 0, -0.835, 0.01);
  var tip = new THREE.Object3D(); tip.position.set(0, -0.85, 0.01); armL.add(tip);
  tech.traverse(function (o) { o.layers.set(2); });

  // ---------- Marcador, láser, nube ----------
  var marker = new THREE.Group(); marker.name = 'marcador'; marker.position.copy(FL); world.add(marker);
  var ring = mesh('anillo', new THREE.TorusGeometry(0.25, 0.014, 12, 56), basicO, marker, 0, 0, 0); ring.rotation.y = Math.PI / 2; ring.castShadow = false;
  var pin = new THREE.Group(); marker.add(pin);
  var cone = mesh('pin', new THREE.ConeGeometry(0.05, 0.14, 24), basicO, pin, 0, 0, 0); cone.rotation.x = Math.PI; cone.castShadow = false;
  mesh('pin_cabeza', new THREE.SphereGeometry(0.055, 20, 14), basicO, pin, 0, 0.1, 0).castShadow = false;
  marker.traverse(function (o) { o.layers.set(2); });

  var laser = new THREE.Group(); laser.name = 'laser'; scene.add(laser);
  var gDot = new THREE.SphereGeometry(0.02, 10, 8), dots = [];
  for (var i = 0; i < 20; i++) { var d = new THREE.Mesh(gDot, basicO); d.layers.set(2); laser.add(d); dots.push(d); }
  var hit = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfc9f01, transparent: true, opacity: 0.8 }));
  hit.layers.set(2); laser.add(hit);

  var cv = document.createElement('canvas'); cv.width = cv.height = 64;
  var cx = cv.getContext('2d'), grd = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.5, 'rgba(255,255,255,.55)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  cx.fillStyle = grd; cx.fillRect(0, 0, 64, 64);
  var puffTex = new THREE.CanvasTexture(cv);
  var cloud = new THREE.Group(); cloud.name = 'nube_gas'; scene.add(cloud);
  var puffs = [];
  for (i = 0; i < 22; i++) {
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, color: 0x0d0d0d, transparent: true, depthWrite: false, opacity: 0 }));
    sp.layers.set(1); cloud.add(sp); puffs.push(sp);
  }

  // ---------- Luces ----------
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd9e2e8, 0.8 * LK); scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xffffff, 1.15 * LK);
  sun.position.set(-4, 9, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -5; sc.right = 5; sc.top = 5; sc.bottom = -5; sc.near = 1; sc.far = 25;
  sun.shadow.bias = -0.0005; if ('normalBias' in sun.shadow) sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
  scene.add(sun); scene.add(sun.target);
  var fill = new THREE.DirectionalLight(0xdfe8f0, 0.35 * LK); fill.position.set(6, 4, -3); scene.add(fill);

  // ---------- Cámaras ----------
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 60);
  cam.layers.enable(2);
  var tgt = new THREE.Vector3(0.1, 0.6, 0);
  cam.position.copy(tgt).add(new THREE.Vector3(3.4, 5.6, 8.9));
  cam.lookAt(tgt); cam.updateMatrixWorld(true);
  (function fit() {
    var pts = [], V = THREE.Vector3;
    [-3.1, 3.2].forEach(function (x) { [-1.65, 1.65].forEach(function (z) { pts.push(new V(x, 0, z)); }); });
    pts.push(new V(-2.95, 1.12, -1.6), new V(3.1, 1.12, -1.6), new V(2.38, 1.36, -0.5), new V(-2.3, 1.95, 0), new V(0.75, 1.95, 0.2), new V(1.68, 1.45, 0.9));
    var inv = cam.matrixWorldInverse, mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
    pts.forEach(function (p) { p.applyMatrix4(inv); mnx = Math.min(mnx, p.x); mxx = Math.max(mxx, p.x); mny = Math.min(mny, p.y); mxy = Math.max(mxy, p.y); });
    var R = { x0: 16, x1: 444, y0: 108, y1: 522 }; // píxeles del área de escena (título libre arriba)
    var k = Math.min((R.x1 - R.x0) / (mxx - mnx), (R.y1 - R.y0) / (mxy - mny));
    var ccx = (mnx + mxx) / 2, ccy = (mny + mxy) / 2, px = (R.x0 + R.x1) / 2, py = (R.y0 + R.y1) / 2;
    cam.left = ccx - px / k; cam.right = ccx + (460 - px) / k;
    cam.top = ccy + py / k; cam.bottom = ccy - (540 - py) / k;
    cam.updateProjectionMatrix();
  })();
  var ogiCam = new THREE.PerspectiveCamera(42, 4 / 3, 0.05, 30);
  ogiCam.layers.enable(1);
  var OGI_POS = new THREE.Vector3(0.62, 1.5, -0.2), OGI_LOOK = new THREE.Vector3(1.7, 0.98, 0.9);

  // ---------- Animación ----------
  var A = new THREE.Vector3(), B = FL.clone(), tmp = new THREE.Vector3(), lastTitle = -1;
  function phaseOf(t) { for (var p = 0; p < 5; p++) if (t < PH[p + 1]) return p; return 4; }

  function update(t) {
    // técnico
    var k1 = sm(0.2, 2.8, t), x = lerp(-2.3, 0.55, k1), z = 0.02;
    var walkPh = (x + 2.3) * 5.2, move = win(t, 0.2, 2.8, 0.35);
    var st = sm(9.7, 10.1, t) - sm(11.0, 11.4, t);
    x += 0.19 * st; z += 0.23 * st;
    walkPh += (sm(9.7, 10.1, t) + sm(11.0, 11.4, t)) * 3.1;
    move += (win(t, 9.7, 10.1, 0.15) + win(t, 11.0, 11.4, 0.15)) * 0.6;
    var yaw = lerp(Math.PI / 2, Math.atan2(FL.x - x, FL.z - z), sm(2.6, 3.3, t));
    tech.position.x = x; tech.position.z = z; tech.rotation.y = yaw;
    body.position.y = Math.abs(Math.sin(walkPh)) * 0.022 * move;
    var sw = Math.sin(walkPh);
    legL.rotation.x = sw * 0.45 * move; legR.rotation.x = -sw * 0.45 * move;
    var rR = 1.5 * (sm(3.3, 3.9, t) - sm(6.4, 6.9, t)) + 1.05 * (sm(9.9, 10.2, t) - sm(10.9, 11.2, t)) + 1.5 * (sm(11.3, 11.8, t) - sm(12.5, 13.0, t));
    rR += 0.08 * Math.sin(t * 18) * win(t, 10.2, 10.9, 0.1);
    var rL = 1.0 * (sm(6.7, 7.3, t) - sm(9.4, 9.9, t));
    armR.rotation.x = -rR - sw * 0.35 * move * (1 - cl(rR));
    armL.rotation.x = -rL + sw * 0.35 * move * (1 - cl(rL));

    // brida: brillo y apriete
    var g = win(t, 9.9, 11.1, 0.25) * (0.55 + 0.45 * Math.sin(t * 9));
    mat.fuga.emissiveIntensity = g * 0.95;
    fugaBolts.rotation.x = sm(10.1, 10.9, t) * 0.8;

    // nube (solo en vista OGI)
    var leak = 1 - sm(10.3, 11.0, t);
    for (var i = 0; i < puffs.length; i++) {
      var a = frac(t * 0.42 + i / puffs.length), s = puffs[i];
      var wob = Math.sin(i * 2.3 + t * 1.7) * 0.07 * a;
      s.position.set(FL.x + 0.02 + a * 0.28 + wob, FL.y + 0.05 + a * 0.85, FL.z + a * 0.2 + Math.cos(i * 1.7 + t) * 0.05 * a);
      var sc2 = 0.1 + a * 0.55; s.scale.set(sc2, sc2, 1);
      s.material.opacity = Math.pow(Math.sin(Math.PI * a), 1.2) * 0.55 * leak;
    }
    cloud.visible = leak > 0.001;

    // marcador
    var m = win(t, 3.9, 12.2, 0.35);
    marker.visible = m > 0.01;
    var ms = Math.max(0.001, m * (1 + 0.07 * Math.sin(t * 5)));
    ring.scale.set(ms, ms, ms);
    pin.position.y = 0.42 + 0.04 * Math.sin(t * 3.2); pin.scale.setScalar(Math.max(0.001, m));

    // láser
    var lv = win(t, 7.25, 9.45, 0.2), rev = sm(7.25, 7.75, t);
    laser.visible = lv > 0.01;
    if (laser.visible) {
      tech.updateMatrixWorld(true); tip.getWorldPosition(A);
      var off = frac(t * 2.2);
      for (i = 0; i < dots.length; i++) {
        var u = (i + off) / dots.length;
        dots[i].visible = u <= rev;
        dots[i].position.lerpVectors(A, B, u);
      }
      hit.visible = rev > 0.98;
      hit.scale.setScalar(0.8 + 0.4 * Math.abs(Math.sin(t * 6)));
    }

    // cámara OGI con leve movimiento de mano
    ogiCam.position.set(OGI_POS.x + Math.sin(t * 1.3) * 0.012, OGI_POS.y + Math.sin(t * 1.9) * 0.01, OGI_POS.z);
    ogiCam.lookAt(OGI_LOOK);

    // ---- rótulos ----
    var p = phaseOf(t);
    if (p !== lastTitle) { el.h2.textContent = TITULOS[p]; lastTitle = p; }
    var tf = p === 0 ? 1 : sm(PH[p], PH[p] + 0.35, t);
    el.h2.style.opacity = tf; el.h2.style.transform = 'translateY(' + ((1 - tf) * 4).toFixed(2) + 'px)';
    for (i = 0; i < 5; i++) el.bars[i].style.background = i === p ? '#fc9f01' : (i < p ? '#002e46' : '#d9e2e8');
    var oa = win(t, 0.5, 3.0, 0.3);
    el.gA.style.opacity = oa;
    var oo = win(t, 3.6, 12.6, 0.3), ol = win(t, 7.3, 12.6, 0.3);
    el.ogi.style.opacity = oo; el.ogi.style.transform = 'translateY(' + ((1 - oo) * 8).toFixed(1) + 'px)';
    el.las.style.opacity = ol; el.las.style.transform = 'translateY(' + ((1 - ol) * 8).toFixed(1) + 'px)';
    el.s1.style.opacity = 1 - sm(11.7, 11.95, t); el.s2.style.opacity = sm(11.85, 12.1, t);
    el.chip.style.opacity = sm(8.1, 8.4, t);
    el.rec.style.opacity = Math.sin(t * 6) > 0 ? 1 : 0.3;
    var oc = win(t, 12.8, 16, 0.35);
    el.gC.style.opacity = oc; el.card.style.transform = 'translateY(' + ((1 - sm(12.8, 13.2, t)) * 10).toFixed(1) + 'px)';
    for (i = 0; i < 4; i++) el.cks[i].classList.toggle('on', t >= 13.3 + i * 0.3);
    el.ev.style.opacity = sm(14.5, 14.8, t);
    var sp2 = cl((t - 14.8) / 0.55), ss = back(sp2);
    el.stamp.style.opacity = cl(sp2 * 4) * (1 - sm(15.65, 16, t));
    el.stamp.style.transform = 'rotate(-10deg) scale(' + Math.max(0, ss).toFixed(3) + ')';
    var ogiOn = oo > 0.01;
    if (ogiOn) {
      tmp.copy(FL).project(ogiCam);
      el.tgt.style.left = ((tmp.x + 1) * 50).toFixed(2) + '%';
      el.tgt.style.top = ((1 - tmp.y) * 50).toFixed(2) + '%';
      el.tgt.style.opacity = leak;
    }
    return ogiOn;
  }

  function draw(t) {
    var ogiOn = update(t);
    renderer.render(scene, cam);
    if (ogiOn) rOgi.render(scene, ogiCam);
  }

  // ---------- Layout ----------
  function layout() {
    var W = container.clientWidth || 720, dpr = window.devicePixelRatio || 1, s;
    var narrow = W < 520;
    root.classList.toggle('dgas-narrow', narrow);
    if (!narrow) {
      s = W / 720;
      el.stage.style.transform = 'scale(' + s + ')';
      root.style.height = (540 * s) + 'px';
      el.sw.style.height = ''; el.scene.style.transform = '';
    } else {
      s = W / 460;
      el.stage.style.transform = '';
      root.style.height = '';
      el.sw.style.height = (540 * s) + 'px';
      el.scene.style.transform = 'scale(' + s + ')';
    }
    renderer.setPixelRatio(Math.min(3, dpr * s));
    renderer.setSize(460, 540, false);
  }

  // ---------- Bucle, visibilidad, movimiento reducido ----------
  var raf = 0, last = 0, tAcc = 0, frozen = false, frozenT = 0, onScreen = true, docVis = !document.hidden;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(mq && mq.matches);
  function now() { return frozen ? frozenT : (reduce ? FIN : tAcc); }
  function shouldRun() { return onScreen && docVis && !frozen && !reduce; }
  function frame(ts) {
    raf = 0;
    if (!shouldRun()) return;
    tAcc = (tAcc + Math.min(0.1, (ts - last) / 1000)) % CYC; last = ts;
    draw(tAcc);
    raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (shouldRun()) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    else { if (raf) { cancelAnimationFrame(raf); raf = 0; } draw(now()); }
  }
  var ro = window.ResizeObserver ? new ResizeObserver(function () { layout(); if (!raf) draw(now()); }) : null;
  if (ro) ro.observe(container);
  var onWinResize = function () { layout(); if (!raf) draw(now()); };
  if (!ro) window.addEventListener('resize', onWinResize);
  var io = window.IntersectionObserver ? new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; kick(); }) : null;
  if (io) io.observe(root);
  var onVis = function () { docVis = !document.hidden; kick(); };
  document.addEventListener('visibilitychange', onVis);
  var onMq = function () { reduce = mq.matches; kick(); };
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); }

  layout();
  draw(now());
  kick();

  function limpiar() {
    if (raf) cancelAnimationFrame(raf); raf = 0; frozen = true;
    if (ro) ro.disconnect(); if (io) io.disconnect();
    window.removeEventListener('resize', onWinResize);
    document.removeEventListener('visibilitychange', onVis);
    if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', onMq); else if (mq.removeListener) mq.removeListener(onMq); }
    var seen = new Set();
    scene.traverse(function (o) {
      if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
      var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      ms.forEach(function (m) { if (seen.has(m)) return; seen.add(m); if (m.map) m.map.dispose(); m.dispose(); });
    });
    puffTex.dispose();
    if (sun.shadow.map) sun.shadow.map.dispose();
    [renderer, rOgi].forEach(function (r) { r.dispose(); if (r.forceContextLoss) r.forceContextLoss(); });
    if (root.parentNode) root.parentNode.removeChild(root);
    if (css.parentNode) css.parentNode.removeChild(css);
  }
  // congela en un segundo del ciclo (0–16); irA(null) reanuda
  limpiar.irA = function (segundo) {
    if (segundo == null) { frozen = false; }
    else { frozen = true; frozenT = ((Number(segundo) % CYC) + CYC) % CYC; }
    kick();
  };
  return limpiar;
}
