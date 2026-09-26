/**
 * Escena "Proceso LDAR": el programa completo sobre un plano técnico de la
 * instalación. Inventario, taxonomía por familia de componentes, detección
 * con cámara OGI o con cámara acústica con láser TDLAS, priorización y
 * reparación, reinspección y el expediente para la ASEA; el anillo final
 * dice que se repite cada trimestre.
 *
 * Generada en Claude Diseño (docs/designs/proceso-ldar-escena.html) y
 * portada como las demás escenas: recibe THREE y el contenedor y devuelve
 * la limpieza, con limpiar.irA(segundo). Trae su propio acomodo para
 * pantallas angostas (la columna del panel baja debajo del plano).
 */
/* eslint-disable */
export function montarEscenaLdar(THREE, container) {
  var REV = parseInt(String(THREE.REVISION).replace(/\D/g, ''), 10) || 128;
  var LK = REV >= 155 ? Math.PI : 1;
  var LEGACY = REV < 152;
  function C(hex) { var c = new THREE.Color(hex); if (LEGACY && c.convertSRGBToLinear) c.convertSRGBToLinear(); return c; }
  var CYC = 18, PH = [0, 3, 6, 9, 12, 15, 18], FIN = 17.35;
  var TITULOS = ['Inventario', 'Taxonomía', 'Detección', 'Priorización y reparación', 'Reinspección', 'Cumplimiento ante la ASEA'];
  var ORANGE = '#fc9f01', GREEN = '#10b981', EDGE = '#cfe3f0';
  var FAM = [
    { k: 'val', n: 'Válvulas', c: '#5b9cf0', q: 62 },
    { k: 'bri', n: 'Bridas', c: '#dfe7ec', q: 96 },
    { k: 'sel', n: 'Sellos', c: '#b394f2', q: 8 },
    { k: 'con', n: 'Conexiones', c: '#56d1dc', q: 74 },
    { k: 'ven', n: 'Venteos', c: '#f07fae', q: 8 }
  ];
  var FI = {}; FAM.forEach(function (f, i) { FI[f.k] = i; });
  var cl = function (v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.min(b, Math.max(a, v)); };
  var sm = function (a, b, t) { var x = cl((t - a) / (b - a)); return x * x * (3 - 2 * x); };
  var lerp = function (a, b, x) { return a + (b - a) * x; };
  var win = function (t, a, b, f) { f = f || 0.3; return sm(a, a + f, t) * (1 - sm(b - f, b, t)); };
  var pulse = function (t, at, w) { var d = (t - at) / (w || 0.25); return d < 0 || d > 1 ? 0 : Math.sin(Math.PI * d); };
  var back = function (p) { var c1 = 1.9, c3 = c1 + 1; return p <= 0 ? 0 : 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

  // ---------- estilos ----------
  var css = document.createElement('style');
  css.textContent = [
    '.pldar-root{position:relative;width:100%;overflow:hidden;font-family:"IBM Plex Sans","Segoe UI",system-ui,sans-serif;color:#e6edf2;-webkit-font-smoothing:antialiased;line-height:1.3;background:#00202f}',
    '.pldar-root *{box-sizing:border-box}',
    '.pldar-mono{font-family:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace}',
    '.pldar-stage{position:absolute;left:0;top:0;width:720px;height:540px;transform-origin:0 0;pointer-events:none;background-color:#00202f;background-image:linear-gradient(rgba(143,184,212,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(143,184,212,.07) 1px,transparent 1px);background-size:24px 24px}',
    '.pldar-sw{position:absolute;left:0;top:0;width:460px;height:540px}',
    '.pldar-scene{position:absolute;left:0;top:0;width:460px;height:540px;transform-origin:0 0}',
    '.pldar-scene canvas{display:block;width:460px!important;height:540px!important}',
    '.pldar-title{position:absolute;left:24px;top:22px;width:410px}',
    '.pldar-title h2{margin:0;font-size:20px;line-height:1.25;font-weight:700;letter-spacing:-.01em;color:#fff}',
    '.pldar-bars{display:flex;gap:6px;margin-top:12px}',
    '.pldar-bars span{width:34px;height:4px;border-radius:2px;background:#3b5566}',
    '.pldar-tags{position:absolute;left:0;top:0;width:460px;height:540px}',
    '.pldar-tag{position:absolute;left:0;top:0;width:0;height:0}',
    '.pldar-dot{position:absolute;left:-3.5px;top:-3.5px;width:7px;height:7px;border-radius:50%;background:#e6edf2;box-shadow:0 0 0 2px rgba(0,32,47,.9)}',
    '.pldar-lead{position:absolute;left:0;bottom:0;width:1px}',
    '.pldar-chip{position:absolute;left:0;white-space:nowrap;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;font-weight:600;padding:2px 6px;border-radius:3px;border:1px solid;background:rgba(0,32,47,.9);color:#e6edf2;display:flex;gap:4px;align-items:center;line-height:14px}',
    '.pldar-chip svg{display:none}',
    '.pldar-ring{position:absolute;left:0;top:0;white-space:nowrap;display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:999px;background:#10b981;color:#00202f}',
    '.pldar-col{position:absolute;left:476px;top:24px;width:220px;height:492px;display:grid;grid-template-columns:minmax(0,1fr);align-content:start}',
    '.pldar-g{grid-area:1/1;display:flex;flex-direction:column;gap:10px;min-width:0}',
    '.pldar-p{background:rgba(6,43,61,.94);border:1px solid #1d4b63;border-radius:6px;padding:10px 12px}',
    '.pldar-lbl{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#8fb0c3}',
    '.pldar-cnt{display:flex;align-items:baseline;gap:8px;margin-top:4px}',
    '.pldar-cnt b{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:30px;font-weight:600;color:#fff;min-width:58px}',
    '.pldar-cnt span{font-size:14px;color:#cfdbe3}',
    '.pldar-inv{display:grid;grid-template-columns:10px 72px minmax(0,1fr) 22px;gap:8px 8px;align-items:center;font-size:12px;margin-top:8px}',
    '.pldar-sq{display:block;width:10px;height:10px;border-radius:2px;border:2px solid}',
    '.pldar-track{display:block;height:6px;border-radius:3px;background:#133b50;overflow:hidden}',
    '.pldar-fill{display:block;height:100%;width:0;border-radius:3px}',
    '.pldar-n{font-size:11px;text-align:right;color:#cfdbe3}',
    '.pldar-meth{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:6px;align-items:center;margin-top:8px}',
    '.pldar-m{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;font-size:11.5px;line-height:1.25;color:#e6edf2}',
    '.pldar-m i{display:flex;width:44px;height:44px;border-radius:50%;border:1px solid #2f5a71;align-items:center;justify-content:center}',
    '.pldar-o{font-size:12px;font-weight:600;color:#8fb0c3;padding-bottom:26px}',
    '.pldar-hd{display:grid;margin-top:4px}',
    '.pldar-hd>div{grid-area:1/1;font-size:14px;font-weight:600;color:#fff}',
    '.pldar-list{position:relative;height:114px;margin-top:8px}',
    '.pldar-r{position:absolute;left:0;right:0;top:0;height:34px;display:flex;align-items:center;gap:9px;padding:0 8px;border-radius:4px;border:1px solid #16435a;background:rgba(0,32,47,.55)}',
    '.pldar-ic{position:relative;width:20px;height:20px;flex:none}',
    '.pldar-ic>*{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0}',
    '.pldar-ic .d i{width:9px;height:9px;border-radius:50%;background:#fc9f01}',
    '.pldar-ic .k{border-radius:50%;background:#10b981}',
    '.pldar-code{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12.5px;font-weight:600}',
    '.pldar-fam{font-size:11px;color:#8fb0c3;flex:1;min-width:0}',
    '.pldar-pr{font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:999px;border:1px solid #fc9f01;color:#fc9f01}',
    '.pldar-pr.a{background:#fc9f01;color:#00202f}',
    '.pldar-pr.b{border-color:#5d7b8c;color:#a9c0ce}',
    '.pldar-ck{width:20px;height:20px;border-radius:50%;border:1.5px solid #2f5a71;display:flex;align-items:center;justify-content:center;flex:none}',
    '.pldar-ck svg{opacity:0}',
    '.pldar-ck.on{background:#10b981;border-color:#10b981}',
    '.pldar-ck.on svg{opacity:1}',
    '.pldar-ct{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:15px;font-weight:600;margin:5px 0 6px;color:#fff}',
    '.pldar-cl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
    '.pldar-cl li{display:flex;align-items:center;gap:10px;font-size:13px;padding:6px 0;border-top:1px solid #16435a}',
    '.pldar-ev{font-size:12px;color:#a9c0ce;border-top:1px solid #16435a;padding-top:8px}',
    '.pldar-sw2{display:flex;justify-content:center;padding-top:4px}',
    '.pldar-stamp{width:120px;height:120px;border-radius:50%;border:3px solid #10b981;background:rgba(0,32,47,.92);display:flex;align-items:center;justify-content:center;position:relative}',
    '.pldar-stamp:before{content:"";position:absolute;inset:6px;border-radius:50%;border:1.5px dashed #10b981}',
    '.pldar-stamp span{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;text-align:center;line-height:1.25;padding:0 18px;color:#fff}',
    '.pldar-foot{position:absolute;right:0;bottom:0;font-size:10px;color:#6f8d9f}',
    '.pldar-narrow .pldar-stage{position:relative;width:100%;height:auto;transform:none!important}',
    '.pldar-narrow .pldar-sw{position:relative;width:100%}',
    '.pldar-narrow .pldar-col{position:relative;left:auto;top:auto;width:auto;height:auto;padding:6px 14px 14px}',
    '.pldar-narrow .pldar-foot{position:static;grid-area:2/1;margin-top:10px;text-align:right}',
    '.pldar-narrow .pldar-p{padding:12px 14px}'
  ].join('\n');
  document.head.appendChild(css);

  var CHECK = '<svg width="11" height="11" viewBox="0 0 12 12"><path d="M2.5 6.3l2.4 2.4 4.6-5" fill="none" stroke="#00202f" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var WRENCH = function (c, s) { return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24"><path d="M14.5 5.5a4.5 4.5 0 0 0-5.9 5.9L3.5 16.5a1.4 1.4 0 0 0 2 2l5.1-5.1a4.5 4.5 0 0 0 5.9-5.9l-2.6 2.6-2-.5-.5-2z" fill="none" stroke="' + c + '" stroke-width="1.8" stroke-linejoin="round"/></svg>'; };
  var IC_OGI = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#e6edf2" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="9" width="14" height="11" rx="2"/><circle cx="10" cy="14.5" r="3"/><path d="M17 12l5-2.5v10L17 17"/><path d="M6 6c1-1.5 2.6-1.5 3.6 0s2.6 1.5 3.6 0" stroke="#fc9f01"/></svg>';
  var IC_ACU = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#e6edf2" stroke-width="1.5" stroke-linejoin="round"><rect x="2.5" y="6" width="14" height="14" rx="2"/><g fill="#e6edf2" stroke="none"><circle cx="6.5" cy="10" r="1.1"/><circle cx="9.5" cy="10" r="1.1"/><circle cx="12.5" cy="10" r="1.1"/><circle cx="6.5" cy="13" r="1.1"/><circle cx="9.5" cy="13" r="1.1"/><circle cx="12.5" cy="13" r="1.1"/><circle cx="6.5" cy="16" r="1.1"/><circle cx="9.5" cy="16" r="1.1"/><circle cx="12.5" cy="16" r="1.1"/></g><path d="M17.5 13h7" stroke="#fc9f01" stroke-dasharray="1.6 1.6"/></svg>';
  var LOOP = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#00202f" stroke-width="1.6" stroke-linecap="round"><path d="M10 6a4 4 0 1 1-1.2-2.85"/><path d="M9.2 1.3v2.2H7"/></svg>';

  var LEAKS = [
    { id: 'S-004', fam: 'Sello', pr: 'Media', pc: 'm', det: 0, pri: 1 },
    { id: 'C-118', fam: 'Conexión', pr: 'Baja', pc: 'b', det: 1, pri: 2 },
    { id: 'B-031', fam: 'Brida', pr: 'Alta', pc: 'a', det: 2, pri: 0 }
  ];
  var root = document.createElement('div');
  root.className = 'pldar-root';
  root.setAttribute('role', 'img');
  root.setAttribute('aria-label', 'Animación del proceso de un programa LDAR: inventario, taxonomía, detección, priorización y reparación, reinspección y cumplimiento ante la ASEA. Se repite cada trimestre. Datos simulados.');
  root.innerHTML =
    '<div class="pldar-stage">' +
      '<div class="pldar-sw"><div class="pldar-scene">' +
        '<div class="pldar-tags"></div>' +
        '<div class="pldar-title"><h2></h2><div class="pldar-bars"><span></span><span></span><span></span><span></span><span></span><span></span></div></div>' +
      '</div></div>' +
      '<div class="pldar-col">' +
        '<div class="pldar-g" data-g="a">' +
          '<div class="pldar-p"><div class="pldar-lbl">Inventario</div><div class="pldar-cnt"><b data-cnt>0</b><span>componentes</span></div></div>' +
          '<div class="pldar-p" data-p="tax"><div class="pldar-lbl">Taxonomía por familia</div><div class="pldar-inv">' + FAM.map(function (f) {
            return '<span class="pldar-sq" style="border-color:' + f.c + '"></span><span>' + f.n + '</span><span class="pldar-track"><span class="pldar-fill" style="background:' + f.c + '"></span></span><span class="pldar-n pldar-mono">0</span>';
          }).join('') + '</div></div>' +
        '</div>' +
        '<div class="pldar-g" data-g="b">' +
          '<div class="pldar-p" data-p="met"><div class="pldar-lbl">Métodos de detección</div><div class="pldar-meth">' +
            '<div class="pldar-m"><i>' + IC_OGI + '</i>Cámara OGI</div><div class="pldar-o">o</div>' +
            '<div class="pldar-m"><i>' + IC_ACU + '</i>Cámara acústica con láser TDLAS</div></div></div>' +
          '<div class="pldar-p" data-p="fug"><div class="pldar-lbl" data-lh>Fugas</div>' +
            '<div class="pldar-hd"><div data-h="1"><span class="pldar-mono" data-nf>0</span> fugas detectadas</div><div data-h="2">Orden por prioridad</div><div data-h="3"><span class="pldar-mono" data-nc>0 de 3</span> cerradas</div></div>' +
            '<div class="pldar-list">' + LEAKS.map(function (l) {
              return '<div class="pldar-r"><span class="pldar-ic"><span class="d"><i></i></span><span class="w">' + WRENCH(ORANGE, 16) + '</span><span class="k">' + CHECK + '</span></span>' +
                '<span class="pldar-code">' + l.id + '</span><span class="pldar-fam">' + l.fam + '</span><span class="pldar-pr ' + l.pc + '">' + l.pr + '</span></div>';
            }).join('') + '</div></div>' +
        '</div>' +
        '<div class="pldar-g" data-g="c">' +
          '<div class="pldar-p"><div class="pldar-lbl">Expediente</div><div class="pldar-ct">PPCIEM · Trimestre 1</div>' +
            '<ul class="pldar-cl">' + ['Inventario', 'Taxonomía', 'Detección', 'Reparación', 'Reinspección'].map(function (s) { return '<li><span class="pldar-ck">' + CHECK + '</span>' + s + '</li>'; }).join('') + '</ul>' +
            '<div class="pldar-ev">Evidencia por fuga</div></div>' +
          '<div class="pldar-sw2"><div class="pldar-stamp"><span>Listo para la ASEA</span></div></div>' +
        '</div>' +
        '<div class="pldar-foot pldar-mono">Datos simulados</div>' +
      '</div>' +
    '</div>';
  container.appendChild(root);
  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return root.querySelectorAll(s); };
  var el = {
    stage: q('.pldar-stage'), sw: q('.pldar-sw'), scene: q('.pldar-scene'), tags: q('.pldar-tags'), h2: q('.pldar-title h2'),
    bars: qa('.pldar-bars span'), gA: q('[data-g=a]'), gB: q('[data-g=b]'), gC: q('[data-g=c]'),
    cnt: q('[data-cnt]'), tax: q('[data-p=tax]'), fills: qa('.pldar-fill'), nums: qa('.pldar-n'),
    met: q('[data-p=met]'), fug: q('[data-p=fug]'), lh: q('[data-lh]'), h: [q('[data-h="1"]'), q('[data-h="2"]'), q('[data-h="3"]')],
    nf: q('[data-nf]'), nc: q('[data-nc]'), rows: qa('.pldar-r'), prs: qa('.pldar-pr'),
    cks: qa('.pldar-cl .pldar-ck'), ev: q('.pldar-ev'), card: q('[data-g=c] .pldar-p'), stamp: q('.pldar-stamp')
  };
  LEAKS.forEach(function (l, i) { var ic = el.rows[i].querySelector('.pldar-ic'); l.row = el.rows[i]; l.icD = ic.children[0]; l.icW = ic.children[1]; l.icK = ic.children[2]; });

  // ---------- renderer ----------
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  if (LEGACY && THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
  el.scene.insertBefore(renderer.domElement, el.tags);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  // ---------- materiales ----------
  var scene = new THREE.Scene();
  var world = new THREE.Group(); world.name = 'patin_gas_plano'; scene.add(world);
  function fillMat(name, op) {
    var m = new THREE.MeshStandardMaterial({ color: C(0x2b5671), roughness: 0.7, metalness: 0.1, transparent: true, opacity: op, depthWrite: false, emissive: C(0x2b5671), emissiveIntensity: 0.25 });
    m.name = name; m.userData.base = op; return m;
  }
  function lineMat(name, hex, op) { var m = new THREE.LineBasicMaterial({ color: C(hex), transparent: true, opacity: op }); m.name = name; m.userData.base = op; return m; }
  var sFill = fillMat('volumen', 0.3), sEdge = lineMat('arista', 0x8fb8d4, 0.55);
  var gridMat = lineMat('reticula_plataforma', 0x2b5671, 0.7);

  var PY = 0.75, PR = 0.085, TOP = 0.18, ZF = 0.9, ZB = -0.9, PMY = 0.44;
  var gPipe = new THREE.CylinderGeometry(PR, PR, 1, 28);
  var gFl = new THREE.CylinderGeometry(0.15, 0.15, 0.035, 28);
  function mesh(name, geo, m, parent, x, y, z) { var o = new THREE.Mesh(geo, m); o.name = name; o.position.set(x || 0, y || 0, z || 0); parent.add(o); return o; }

  var struct = new THREE.Group(); struct.name = 'estructura'; world.add(struct);
  var COMPS = [];
  function comp(id, k, label, off) {
    var g = new THREE.Group(); g.name = id; world.add(g);
    var c = { id: id, k: k, g: g, fill: fillMat('vol_' + id, 0.42), edge: lineMat('ar_' + id, 0xe6edf2, 0.9), label: label, off: off || 0, col: '' };
    COMPS.push(c); return c;
  }
  function pipeX(x0, x1, z) { var o = mesh('tubo', gPipe, sFill, struct, (x0 + x1) / 2, PY, z); o.scale.y = x1 - x0; o.rotation.z = Math.PI / 2; }
  function flangeM(parent, m, x, y, z) { var d = mesh('brida', gFl, m, parent, x, y, z); d.rotation.z = Math.PI / 2; return d; }
  function flangePair(c, x, z) { flangeM(c.g, c.fill, x - 0.02, PY, z); flangeM(c.g, c.fill, x + 0.02, PY, z); }
  function support(x, z) {
    mesh('soporte', new THREE.BoxGeometry(0.06, PY - PR - TOP, 0.06), sFill, struct, x, TOP + (PY - PR - TOP) / 2, z);
    mesh('silleta', new THREE.BoxGeometry(0.12, 0.03, 0.22), sFill, struct, x, PY - PR - 0.015, z);
  }
  function valve(c, x, z) {
    var g = c.g;
    mesh('cuerpo', new THREE.BoxGeometry(0.24, 0.28, 0.24), c.fill, g, x, PY, z);
    flangeM(g, c.fill, x - 0.15, PY, z); flangeM(g, c.fill, x + 0.15, PY, z);
    mesh('bonete', new THREE.CylinderGeometry(0.06, 0.08, 0.3, 20), c.fill, g, x, PY + 0.29, z);
    var w = mesh('volante', new THREE.CylinderGeometry(0.13, 0.13, 0.02, 28), c.fill, g, x, PY + 0.55, z);
  }

  // plataforma
  mesh('plataforma', new THREE.BoxGeometry(6.7, TOP, 3.3), sFill, struct, 0, TOP / 2, 0);
  (function () {
    var p = [], y = TOP + 0.002;
    for (var x = -3.35; x <= 3.36; x += 0.5) p.push(x, y, -1.65, x, y, 1.65);
    for (var z = -1.65; z <= 1.66; z += 0.55) p.push(-3.35, y, z, 3.35, y, z);
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    var ls = new THREE.LineSegments(g, gridMat); ls.name = 'reticula'; world.add(ls);
  })();

  // bomba + sello S-004 + brida B-018
  mesh('base_bomba', new THREE.BoxGeometry(1.05, 0.06, 0.5), sFill, struct, -2.78, TOP + 0.03, ZF);
  var mot = mesh('motor_bomba', new THREE.CylinderGeometry(0.16, 0.16, 0.46, 28), sFill, struct, -3.0, PMY, ZF); mot.rotation.z = Math.PI / 2;
  mesh('patas_motor', new THREE.BoxGeometry(0.34, PMY - TOP - 0.16, 0.26), sFill, struct, -3.0, TOP + 0.06 + (PMY - TOP - 0.16) / 2, ZF);
  mesh('guarda_cople', new THREE.BoxGeometry(0.12, 0.16, 0.18), sFill, struct, -2.705, PMY, ZF);
  var vol = mesh('voluta', new THREE.CylinderGeometry(0.21, 0.21, 0.18, 32), sFill, struct, -2.42, PMY, ZF); vol.rotation.z = Math.PI / 2;
  mesh('pedestal', new THREE.BoxGeometry(0.2, PMY - TOP - 0.18, 0.2), sFill, struct, -2.42, TOP + 0.06 + (PMY - TOP - 0.18) / 2, ZF);
  var suc = mesh('succion', new THREE.CylinderGeometry(0.065, 0.065, 0.16, 20), sFill, struct, -2.25, PMY, ZF); suc.rotation.z = Math.PI / 2;
  mesh('descarga', new THREE.CylinderGeometry(PR, PR, PY - PMY - 0.1, 28), sFill, struct, -2.42, PMY + 0.1 + (PY - PMY - 0.1) / 2, ZF);
  var cS4 = comp('S-004', 'sel', true, 20);
  var sh = mesh('sello', new THREE.CylinderGeometry(0.1, 0.1, 0.1, 28), cS4.fill, cS4.g, -2.595, PMY, ZF); sh.rotation.z = Math.PI / 2;
  var cB18 = comp('B-018', 'bri');
  var f18 = mesh('brida', new THREE.CylinderGeometry(0.1, 0.1, 0.035, 24), cB18.fill, cB18.g, -2.16, PMY, ZF); f18.rotation.z = Math.PI / 2;

  // líneas
  pipeX(-2.42, 2.1, ZF);
  mesh('ascendente', new THREE.CylinderGeometry(PR, PR, PY - TOP, 28), sFill, struct, -2.95, TOP + (PY - TOP) / 2, ZB);
  pipeX(-2.95, 2.1, ZB);
  support(-1.6, ZF); support(0.8, ZF); support(-2.6, ZB); support(-0.9, ZB); support(0.9, ZB);
  var cV12 = comp('V-012', 'val', true, 14); valve(cV12, -0.95, ZF);
  var cV20 = comp('V-020', 'val'); valve(cV20, -0.45, ZB);
  var cB27 = comp('B-027', 'bri'); flangePair(cB27, -2.3, ZB);
  var cB44 = comp('B-044', 'bri'); flangePair(cB44, 1.9, ZB);
  var cB31 = comp('B-031', 'bri', true, 30); flangePair(cB31, 1.68, ZF);
  function instrument(c, x, z) {
    mesh('niple', new THREE.CylinderGeometry(0.022, 0.022, 0.3, 10), c.fill, c.g, x, PY + PR + 0.13, z);
    mesh('tuerca', new THREE.CylinderGeometry(0.04, 0.04, 0.05, 6), c.fill, c.g, x, PY + PR + 0.06, z);
    mesh('transmisor', new THREE.BoxGeometry(0.12, 0.1, 0.1), c.fill, c.g, x, PY + PR + 0.33, z);
    mesh('cabezal', new THREE.CylinderGeometry(0.06, 0.06, 0.08, 20), c.fill, c.g, x, PY + PR + 0.42, z);
  }
  var cC118 = comp('C-118', 'con', true, 24); instrument(cC118, 0.25, ZF);
  var cC121 = comp('C-121', 'con'); instrument(cC121, -1.3, ZB);
  var cVT = comp('VT-002', 'ven', true, 20);
  mesh('tubo_venteo', new THREE.CylinderGeometry(0.04, 0.04, 0.9, 14), cVT.fill, cVT.g, -1.95, PY + 0.45, ZB);
  mesh('valvula_venteo', new THREE.BoxGeometry(0.1, 0.1, 0.1), cVT.fill, cVT.g, -1.95, PY + 0.45, ZB);
  mesh('tapa_venteo', new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16), cVT.fill, cVT.g, -1.95, PY + 0.93, ZB);

  // compresor + sello S-009
  mesh('patin_comp', new THREE.BoxGeometry(1.0, 0.1, 2.3), sFill, struct, 2.48, TOP + 0.05, 0);
  var ves = mesh('recipiente', new THREE.CylinderGeometry(0.36, 0.36, 2.1, 36), sFill, struct, 2.48, 0.72, 0); ves.rotation.x = Math.PI / 2;
  mesh('motor', new THREE.BoxGeometry(0.46, 0.3, 0.8), sFill, struct, 2.48, 1.2, -0.1);
  mesh('base_motor', new THREE.BoxGeometry(0.34, 0.06, 0.6), sFill, struct, 2.48, 1.05, -0.1);
  var cS9 = comp('S-009', 'sel');
  var s9 = mesh('sello', new THREE.CylinderGeometry(0.1, 0.1, 0.08, 24), cS9.fill, cS9.g, 2.48, 0.72, 1.1); s9.rotation.x = Math.PI / 2;

  // aristas
  function addEdges(rootObj, m) {
    var list = []; rootObj.traverse(function (o) { if (o.isMesh) list.push(o); });
    list.forEach(function (o) { var e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 25), m); e.name = 'arista'; o.add(e); });
  }
  addEdges(struct, sEdge);
  COMPS.forEach(function (c) { addEdges(c.g, c.edge); });

  // anclas de rótulos
  world.updateMatrixWorld(true);
  var box = new THREE.Box3(), V = THREE.Vector3;
  COMPS.forEach(function (c) {
    box.setFromObject(c.g);
    c.center = box.getCenter(new V());
    c.anchor = new V(c.center.x, box.max.y + 0.02, c.center.z);
    c.fi = FI[c.k];
    c.tx = 0.3 + (c.center.x + 3.4) / 6.8 * 2.3;
    var d = document.createElement('div'); d.className = 'pldar-tag';
    d.innerHTML = c.label
      ? '<span class="pldar-lead" style="height:' + c.off + 'px"></span><span class="pldar-dot"></span><span class="pldar-chip" style="bottom:' + c.off + 'px">' + WRENCH('#00202f', 11) + '<span>' + c.id + '</span>' + CHECK + '</span>'
      : '<span class="pldar-dot"></span>';
    el.tags.appendChild(d);
    c.el = d; c.dot = d.querySelector('.pldar-dot'); c.lead = d.querySelector('.pldar-lead'); c.chip = d.querySelector('.pldar-chip');
    if (c.chip) { c.wr = c.chip.children[0]; c.ck = c.chip.children[2]; }
    c.w = 0; c.state = '';
  });
  var byId = {}; COMPS.forEach(function (c) { byId[c.id] = c; });
  // fugas: tiempos de detección, reparación y reinspección
  var pathA = COMPS.slice().sort(function (a, b) { return a.center.x - b.center.x || a.center.z - b.center.z; });
  var T0 = 6.35, T1 = 8.7, DA = (T1 - T0) / (pathA.length - 1);
  pathA.forEach(function (c, i) { c.ta = T0 + i * DA; });
  var REP = { 'B-031': 9.9, 'S-004': 10.55, 'C-118': 11.2 }, RE = { 'S-004': 12.7, 'C-118': 13.4, 'B-031': 14.1 };
  LEAKS.forEach(function (l) { var c = byId[l.id]; c.leak = true; c.td = c.ta; c.tr = REP[l.id]; c.tk = RE[l.id]; l.c = c; });
  var pathB = [new V(-3.25, PY + 0.2, ZF), byId['S-004'].center, byId['C-118'].center, byId['B-031'].center];
  var pathBT = [12.25, RE['S-004'], RE['C-118'], RE['B-031']];

  // barrido
  var scanMat = new THREE.MeshBasicMaterial({ color: C(0x8fc3e6), transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }); scanMat.name = 'barrido';
  var scanEdge = lineMat('barrido_borde', 0xbfe0f5, 0.9);
  var scan = new THREE.Group(); scan.name = 'barrido'; scene.add(scan);
  var sp = mesh('plano', new THREE.PlaneGeometry(3.5, 1.9), scanMat, scan, 0, TOP + 0.95, 0); sp.rotation.y = Math.PI / 2;
  sp.add(new THREE.LineSegments(new THREE.EdgesGeometry(sp.geometry), scanEdge));

  // pulso
  var pulseG = new THREE.Group(); pulseG.name = 'pulso'; scene.add(pulseG);
  var pCore = new THREE.MeshBasicMaterial({ color: C(0xffffff), transparent: true }); pCore.name = 'pulso';
  mesh('nucleo', new THREE.SphereGeometry(0.05, 16, 12), pCore, pulseG, 0, 0, 0);
  var pHalo = new THREE.MeshBasicMaterial({ color: C(0x8fc3e6), transparent: true, opacity: 0.25, depthWrite: false }); pHalo.name = 'halo';
  var halo = mesh('halo', new THREE.SphereGeometry(0.14, 20, 14), pHalo, pulseG, 0, 0, 0);
  var trail = [], trailMat = new THREE.MeshBasicMaterial({ color: C(0xcfe3f0), transparent: true, opacity: 0.5, depthWrite: false }); trailMat.name = 'estela';
  var gTr = new THREE.SphereGeometry(0.025, 10, 8);
  for (var i = 0; i < 6; i++) { var tr = new THREE.Mesh(gTr, trailMat); scene.add(tr); trail.push(tr); }

  // anillo de trimestre
  var RX = 4.05, RZ = 2.35, RN = 180, ringPts = [];
  for (i = 0; i <= RN; i++) { var a = Math.PI / 2 + i / RN * Math.PI * 2; ringPts.push(Math.cos(a) * RX, 0.03, Math.sin(a) * RZ); }
  var ringGeo = new THREE.BufferGeometry(); ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringPts, 3));
  var ringMat = lineMat('anillo', 0x10b981, 1);
  var ring = new THREE.Line(ringGeo, ringMat); ring.name = 'anillo_trimestre'; world.add(ring);
  var ringGhost = new THREE.Line(ringGeo, lineMat('anillo_guia', 0x10b981, 0.18)); world.add(ringGhost);
  var headMat = new THREE.MeshBasicMaterial({ color: C(0x10b981) }); headMat.name = 'anillo_cabeza';
  var head = mesh('cabeza', new THREE.ConeGeometry(0.09, 0.26, 18), headMat, world, 0, 0.03, RZ);
  var ringTag = document.createElement('div'); ringTag.className = 'pldar-ring'; ringTag.innerHTML = LOOP + '<span>Siguiente trimestre</span>';
  el.tags.appendChild(ringTag);

  // luces
  scene.add(new THREE.HemisphereLight(C(0xe3edf4), C(0x0b2735), 0.9 * LK));
  var sun = new THREE.DirectionalLight(C(0xffffff), 0.9 * LK); sun.position.set(-4, 9, 6); scene.add(sun);

  // cámara
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 60);
  var tgt = new V(0.1, 0.5, 0), OFF = new V(3.4, 5.6, 8.9), OR = Math.hypot(OFF.x, OFF.z), OA = Math.atan2(OFF.x, OFF.z);
  function camAz(az) { cam.position.set(tgt.x + Math.sin(OA + az) * OR, tgt.y + OFF.y, tgt.z + Math.cos(OA + az) * OR); cam.lookAt(tgt); cam.updateMatrixWorld(true); }
  camAz(0);
  (function fit() {
    var pts = [];
    [-3.35, 3.35].forEach(function (x) { [-1.65, 1.65].forEach(function (z) { pts.push(new V(x, 0, z)); }); });
    for (var k = 0; k < 24; k++) { var a = k / 24 * Math.PI * 2; pts.push(new V(Math.cos(a) * RX, 0, Math.sin(a) * RZ)); }
    pts.push(new V(-1.95, 1.75, ZB), new V(2.48, 1.36, -0.5));
    var inv = cam.matrixWorldInverse, mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
    pts.forEach(function (p) { p.applyMatrix4(inv); mnx = Math.min(mnx, p.x); mxx = Math.max(mxx, p.x); mny = Math.min(mny, p.y); mxy = Math.max(mxy, p.y); });
    var R = { x0: 26, x1: 434, y0: 176, y1: 488 };
    var k2 = Math.min((R.x1 - R.x0) / (mxx - mnx), (R.y1 - R.y0) / (mxy - mny));
    var ccx = (mnx + mxx) / 2, ccy = (mny + mxy) / 2, px = (R.x0 + R.x1) / 2, py = (R.y0 + R.y1) / 2;
    cam.left = ccx - px / k2; cam.right = ccx + (460 - px) / k2;
    cam.top = ccy + py / k2; cam.bottom = ccy - (540 - py) / k2;
    cam.updateProjectionMatrix();
  })();

  // ---------- animación ----------
  var tmp = new V(), lastTitle = -1, lastN = {}, colTmp = new THREE.Color();
  function phaseOf(t) { for (var p = 0; p < 6; p++) if (t < PH[p + 1]) return p; return 5; }
  function setText(node, key, v) { if (lastN[key] !== v) { node.textContent = v; lastN[key] = v; } }
  function famT(fi) { return 3.3 + fi * 0.42; }
  function compColor(c, t) {
    if (c.leak && t >= c.tk) return GREEN;
    if (c.leak && t >= c.td) return ORANGE;
    if (t >= famT(c.fi) && t < 17.7) return FAM[c.fi].c;
    return EDGE;
  }
  function project(v) { tmp.copy(v).project(cam); return [(tmp.x + 1) * 230, (1 - tmp.y) * 270]; }
  function pathPos(pts, times, t, out) {
    if (t <= times[0]) return out.copy(pts[0]);
    for (var i = 1; i < pts.length; i++) if (t <= times[i]) { var u = sm(times[i - 1], times[i], t); return out.lerpVectors(pts[i - 1], pts[i], u); }
    return out.copy(pts[pts.length - 1]);
  }
  var ptsA = pathA.map(function (c) { return c.center; }), timesA = pathA.map(function (c) { return c.ta; });
  var pv = new V(), pv2 = new V();

  function update(t) {
    camAz(0.085 * Math.sin(t / CYC * Math.PI * 2));
    var dim = sm(15.0, 15.5, t) * (1 - sm(17.65, 18, t));
    var dimK = lerp(1, 0.35, dim);
    sFill.opacity = sFill.userData.base * dimK; sEdge.opacity = sEdge.userData.base * dimK; gridMat.opacity = gridMat.userData.base * dimK;

    // barrido
    var sv = win(t, 0.2, 2.75, 0.2);
    scan.visible = sv > 0.01;
    scan.position.x = lerp(-3.4, 3.4, cl((t - 0.3) / 2.3));
    scanMat.opacity = 0.12 * sv; scanEdge.opacity = 0.9 * sv;

    // pulsos
    var pa = win(t, 6.2, 8.85, 0.15), pb = win(t, 12.1, 14.3, 0.15);
    pulseG.visible = pa + pb > 0.01;
    if (pa > 0.01) pathPos(ptsA, timesA, t, pv); else pathPos(pathB, pathBT, t, pv);
    pulseG.position.copy(pv); pCore.opacity = Math.max(pa, pb);
    pHalo.opacity = 0.25 * Math.max(pa, pb); halo.scale.setScalar(1 + 0.3 * Math.sin(t * 12));
    for (var i = 0; i < trail.length; i++) {
      var tt = t - (i + 1) * 0.05;
      if (pa > 0.01) pathPos(ptsA, timesA, tt, pv2); else pathPos(pathB, pathBT, tt, pv2);
      trail[i].position.copy(pv2); trail[i].visible = pulseG.visible; trail[i].scale.setScalar(1 - i * 0.13);
    }
    trailMat.opacity = 0.5 * Math.max(pa, pb);

    // componentes
    var inv = 0;
    for (i = 0; i < COMPS.length; i++) {
      var c = COMPS[i];
      var seen = sm(c.tx, c.tx + 0.2, t);
      var col = compColor(c, t);
      if (col !== c.col) { c.edge.color.copy(C(col)); c.col = col; }
      var fl = pulse(t, c.tx, 0.35) + pulse(t, famT(c.fi), 0.42) * 0.8 + pulse(t, c.ta, 0.3) +
        (c.leak ? win(t, c.tr, c.tr + 0.6, 0.1) * (0.5 + 0.5 * Math.sin(t * 16)) + pulse(t, c.tk, 0.35) : 0);
      c.fill.emissive.copy(C(col === EDGE ? '#2b5671' : col));
      c.fill.emissiveIntensity = 0.25 + (col === EDGE ? 0 : 0.35) + fl * 0.9;
      var restart = 1 - sm(17.65, 18, t);
      c.fill.opacity = c.fill.userData.base * lerp(1, 0.4, dim) * (0.55 + 0.45 * (t < 3 ? seen : 1));
      c.edge.opacity = c.edge.userData.base * lerp(1, 0.35, dim) * (0.35 + 0.65 * (t < 3 ? seen : 1));
      // rótulo
      var vis = seen * restart * (1 - dim);
      c.el.style.opacity = vis.toFixed(3);
      var p = project(c.anchor);
      c.el.style.transform = 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px)';
      c.dot.style.background = col;
      if (c.chip) {
        var st = col === GREEN ? 'ok' : col === ORANGE ? 'alert' : col === EDGE ? 'base' : 'fam';
        if (st !== c.state) {
          c.state = st;
          var fill = st === 'ok' || st === 'alert';
          c.chip.style.borderColor = col; c.lead.style.background = col;
          c.chip.style.background = fill ? col : 'rgba(0,32,47,.9)';
          c.chip.style.color = fill ? '#00202f' : '#e6edf2';
          c.ck.style.display = st === 'ok' ? 'block' : 'none';
        }
        var rep = c.leak && t >= c.tr && t < c.tk;
        c.wr.style.display = rep ? 'block' : 'none';
        if (!c.w) c.w = c.chip.offsetWidth;
        var shift = c.w ? cl(p[0] - c.w / 2, 6, 454 - c.w) - (p[0] - c.w / 2) : 0;
        c.chip.style.transform = 'translateX(calc(-50% + ' + shift.toFixed(1) + 'px)) translateY(' + ((1 - seen) * 4).toFixed(1) + 'px)';
      }
    }

    // anillo
    var rp = sm(15.4, 17.05, t), rv = 1 - sm(17.65, 18, t);
    ring.visible = rp > 0.002 && rv > 0.01; ringGhost.visible = sm(15.2, 15.5, t) * rv > 0.01;
    ring.geometry.setDrawRange(0, Math.max(2, Math.round(rp * RN) + 1));
    ringMat.opacity = rv; ringGhost.material.opacity = 0.18 * sm(15.2, 15.5, t) * rv;
    var ha = Math.PI / 2 + rp * Math.PI * 2;
    head.visible = ring.visible;
    head.position.set(Math.cos(ha) * RX, 0.03, Math.sin(ha) * RZ);
    var tx = -Math.sin(ha) * RX, tz = Math.cos(ha) * RZ;
    head.rotation.set(0, 0, 0); head.lookAt(head.position.x + tx, 0.03, head.position.z + tz); head.rotateX(Math.PI / 2);
    headMat.opacity = rv; headMat.transparent = true;
    var rt = sm(16.95, 17.2, t) * rv;
    ringTag.style.opacity = rt.toFixed(3);
    var rpP = project(new V(0, 0.03, RZ).applyMatrix4(world.matrixWorld));
    ringTag.style.transform = 'translate(' + rpP[0].toFixed(1) + 'px,' + (rpP[1] + 10).toFixed(1) + 'px) translateX(-50%)';

    // ---- título ----
    var ph = phaseOf(t);
    if (ph !== lastTitle) { el.h2.textContent = TITULOS[ph]; lastTitle = ph; }
    var tf = ph === 0 ? 1 : sm(PH[ph], PH[ph] + 0.35, t);
    el.h2.style.opacity = tf; el.h2.style.transform = 'translateY(' + ((1 - tf) * 4).toFixed(2) + 'px)';
    for (i = 0; i < 6; i++) el.bars[i].style.background = i === ph ? ORANGE : (i < ph ? '#ffffff' : '#3b5566');

    // ---- panel A ----
    var ga = win(t, 0.2, 6.15, 0.3);
    el.gA.style.opacity = ga; el.gA.style.transform = 'translateY(' + (-(sm(5.85, 6.15, t)) * 10).toFixed(1) + 'px)';
    setText(el.cnt, 'cnt', String(Math.round(248 * sm(0.3, 2.7, t))));
    var tx2 = sm(3.05, 3.35, t);
    el.tax.style.opacity = tx2; el.tax.style.transform = 'translateY(' + ((1 - tx2) * 8).toFixed(1) + 'px)';
    for (i = 0; i < 5; i++) {
      var f = sm(famT(i), famT(i) + 0.55, t);
      el.fills[i].style.width = (f * 100 * FAM[i].q / 96).toFixed(1) + '%';
      setText(el.nums[i], 'n' + i, String(Math.round(FAM[i].q * f)));
    }

    // ---- panel B ----
    var gb = win(t, 6.0, 15.1, 0.3);
    el.gB.style.opacity = gb; el.gB.style.transform = 'translateY(' + (-(sm(14.8, 15.1, t)) * 10).toFixed(1) + 'px)';
    var me = sm(6.0, 6.3, t);
    el.met.style.opacity = me * lerp(1, 0.45, sm(9, 9.3, t));
    var fu = sm(6.3, 6.6, t);
    el.fug.style.opacity = fu; el.fug.style.transform = 'translateY(' + ((1 - fu) * 8).toFixed(1) + 'px)';
    var hs = [1 - sm(9.0, 9.2, t), sm(9.1, 9.3, t) * (1 - sm(12.0, 12.2, t)), sm(12.1, 12.3, t)];
    for (i = 0; i < 3; i++) el.h[i].style.opacity = hs[i];
    setText(el.lh, 'lh', t < 9.1 ? 'Detección' : t < 12.1 ? 'Reparación' : 'Reinspección');
    var nf = 0, nc = 0;
    var ord = sm(9.2, 9.8, t);
    LEAKS.forEach(function (l, i) {
      var c = l.c;
      if (t >= c.td) nf++; if (t >= c.tk) nc++;
      var ap = sm(c.td, c.td + 0.25, t);
      var y = lerp(l.det, l.pri, ord) * 40;
      l.row.style.opacity = ap;
      l.row.style.transform = 'translate(' + ((1 - ap) * 10).toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      el.prs[i].style.opacity = sm(9.4 + l.pri * 0.1, 9.7 + l.pri * 0.1, t);
      var rep = win(t, c.tr, c.tr + 0.6, 0.1);
      var sD = t < c.tr ? 1 : 0, sW = t >= c.tr && t < c.tk ? 1 : 0, sK = t >= c.tk ? 1 : 0;
      l.icD.style.opacity = sD; l.icW.style.opacity = sW; l.icK.style.opacity = sK;
      l.icW.style.transform = 'rotate(' + (rep * 25 * Math.sin(t * 14)).toFixed(1) + 'deg)';
      l.row.style.borderColor = rep > 0.05 ? ORANGE : (sK ? GREEN : '#16435a');
    });
    setText(el.nf, 'nf', String(nf)); setText(el.nc, 'nc', nc + ' de 3');

    // ---- panel C ----
    var gc = win(t, 15.1, 18, 0.35);
    el.gC.style.opacity = gc; el.card.style.transform = 'translateY(' + ((1 - sm(15.1, 15.5, t)) * 12).toFixed(1) + 'px)';
    for (i = 0; i < 5; i++) el.cks[i].classList.toggle('on', t >= 15.5 + i * 0.22);
    el.ev.style.opacity = sm(16.6, 16.85, t);
    var spr = cl((t - 16.35) / 0.55), ss = back(spr);
    el.stamp.style.opacity = cl(spr * 4) * (1 - sm(17.65, 18, t));
    el.stamp.style.transform = 'rotate(-10deg) scale(' + Math.max(0, ss).toFixed(3) + ')';
  }
  function draw(t) { update(t); renderer.render(scene, cam); }

  // ---------- layout ----------
  var lastW = -1;
  function layout() {
    var W = container.clientWidth || 720; lastW = container.clientWidth;
    var dpr = window.devicePixelRatio || 1, s, narrow = W < 520;
    root.classList.toggle('pldar-narrow', narrow);
    if (!narrow) {
      s = W / 720;
      el.stage.style.transform = 'scale(' + s + ')'; root.style.height = (540 * s) + 'px';
      el.sw.style.height = ''; el.scene.style.transform = '';
    } else {
      s = W / 460;
      el.stage.style.transform = ''; root.style.height = '';
      el.sw.style.height = (540 * s) + 'px'; el.scene.style.transform = 'scale(' + s + ')';
    }
    renderer.setPixelRatio(Math.min(3, dpr * s));
    renderer.setSize(460, 540, false);
    COMPS.forEach(function (c) { c.w = 0; });
  }

  // ---------- bucle ----------
  var raf = 0, roRaf = 0, last = 0, tAcc = 0, frozen = false, frozenT = 0, onScreen = true, docVis = !document.hidden, alive = true;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(mq && mq.matches);
  function now() { return frozen ? frozenT : (reduce ? FIN : tAcc); }
  function shouldRun() { return alive && onScreen && docVis && !frozen && !reduce; }
  function frame(ts) {
    raf = 0; if (!shouldRun()) return;
    tAcc = (tAcc + Math.min(0.1, (ts - last) / 1000)) % CYC; last = ts;
    draw(tAcc); raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (!alive) return;
    if (shouldRun()) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    else { if (raf) { cancelAnimationFrame(raf); raf = 0; } draw(now()); }
  }
  function relayout() { roRaf = 0; if (!alive || container.clientWidth === lastW) return; layout(); if (!raf) draw(now()); }
  var ro = window.ResizeObserver ? new ResizeObserver(function () { if (container.clientWidth !== lastW && !roRaf) roRaf = requestAnimationFrame(relayout); }) : null;
  if (ro) ro.observe(container);
  var onWinResize = function () { if (!roRaf) roRaf = requestAnimationFrame(relayout); };
  window.addEventListener('resize', onWinResize);
  var io = window.IntersectionObserver ? new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; kick(); }) : null;
  if (io) io.observe(root);
  var onVis = function () { docVis = !document.hidden; kick(); };
  document.addEventListener('visibilitychange', onVis);
  var onMq = function () { reduce = mq.matches; kick(); };
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!alive) return; COMPS.forEach(function (c) { c.w = 0; }); if (!raf) draw(now()); });

  layout(); draw(now()); kick();
  roRaf = requestAnimationFrame(function () { roRaf = 0; lastW = -1; relayout(); });

  function limpiar() {
    alive = false;
    if (raf) cancelAnimationFrame(raf); if (roRaf) cancelAnimationFrame(roRaf); raf = roRaf = 0;
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
    renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (root.parentNode) root.parentNode.removeChild(root);
    if (css.parentNode) css.parentNode.removeChild(css);
  }
  // congela en un segundo del ciclo (0–18); irA(null) reanuda
  limpiar.irA = function (segundo) {
    if (segundo == null) frozen = false;
    else { frozen = true; frozenT = ((Number(segundo) % CYC) + CYC) % CYC; }
    kick();
  };
  return limpiar;
}
