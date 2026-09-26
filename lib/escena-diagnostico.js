/**
 * Escena "Diagnóstico integral de maquinaria": el mismo rodamiento visto
 * por las cuatro técnicas en el orden en que cada una detecta la falla
 * (aceite, ultrasonido, vibraciones y termografía) y las cuatro lecturas
 * juntas en un solo diagnóstico.
 *
 * Generada en Claude Diseño (docs/designs/diagnostico-integral-escena.html)
 * y portada como las demás escenas: recibe THREE y el contenedor y devuelve
 * la limpieza, con limpiar.irA(segundo). Ajusta luces y color por revisión.
 * En pantallas angostas el propio diseño separa la escena 3D y la columna
 * de paneles, una debajo de la otra.
 */
/* eslint-disable */
export function montarEscenaDiagnostico(THREE, container) {
  var REV = parseInt(THREE.REVISION, 10) || 128;
  var W = 720, H = 540, SW = 460, CW = 260, T = 16, DF = T / 5;
  var C = { navy: '#002e46', azul: '#2b5671', gris: '#d9e2e8', naranja: '#fc9f01' };
  var FONT = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var LF = REV >= 155 ? Math.PI : 1;

  function clamp(v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, v)); }
  function seg(u, a, b) { return clamp((u - a) / (b - a)); }
  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function backOut(x) { var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function hexRgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mixHex(a, b, k) { var x = hexRgb(a), y = hexRgb(b); return '#' + x.map(function (v, i) { return Math.round(lerp(v, y[i], k)).toString(16).padStart(2, '0'); }).join(''); }
  function el(tag, css, parent, html) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  function R(root, k) { return root.querySelector('[data-r="' + k + '"]'); }
  function V(x, y, z) { return new THREE.Vector3(x, y, z); }
  function col(hex) { var c = new THREE.Color(hex); if (REV < 152 && c.convertSRGBToLinear) c.convertSRGBToLinear(); return c; }

  /* ---------- DOM ---------- */
  var grad = 'linear-gradient(180deg,#fbfcfd,#eef1f4)';
  var raiz = el('div', 'position:relative;width:100%;overflow:hidden;background:#eef1f4;font-family:' + FONT + ';-webkit-font-smoothing:antialiased;', container);
  var bE = el('div', 'position:absolute;left:0;top:0;width:' + SW + 'px;height:' + H + 'px;transform-origin:0 0;background:' + grad + ';overflow:hidden;', raiz);
  var bC = el('div', 'position:absolute;left:0;top:0;width:' + CW + 'px;height:' + H + 'px;transform-origin:0 0;background:' + grad + ';overflow:hidden;', raiz);
  var capa = el('div', 'position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:5;', raiz);

  var EYEBROW = 'font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:' + C.azul + ';font-weight:700;';
  var TIT = 'font-size:15px;font-weight:700;color:' + C.navy + ';margin-top:6px;line-height:1.25;';

  var cab = el('div', 'position:absolute;left:24px;top:22px;width:410px;z-index:2;', bE,
    '<div style="' + EYEBROW + '">Diagnóstico integral de maquinaria</div>' +
    '<div data-r="titulo" style="font-size:23px;font-weight:700;color:' + C.navy + ';margin-top:6px;line-height:1.2;letter-spacing:-.01em;"></div>' +
    '<div data-r="barras" style="display:flex;gap:5px;margin-top:12px;"></div>');
  var titulo = R(cab, 'titulo');
  var barras = [0, 1, 2, 3, 4].map(function () { return el('div', 'width:34px;height:4px;border-radius:2px;background:' + C.gris + ';', R(cab, 'barras')); });
  el('div', 'position:absolute;left:24px;bottom:16px;font-size:10.5px;color:' + C.azul + ';', bE, 'Datos simulados');
  var TITULOS = ['Aceite: meses antes', 'Ultrasonido: semanas antes', 'Vibraciones: confirma la pieza', 'Termografía: todavía sin calentar', 'Un solo diagnóstico'];

  // visor térmico (se posiciona tras proyectar el motor)
  var visor = el('div', 'position:absolute;opacity:0;z-index:1;', bE,
    ['left:0;top:0;border-left:2px solid;border-top:2px solid', 'right:0;top:0;border-right:2px solid;border-top:2px solid',
     'left:0;bottom:0;border-left:2px solid;border-bottom:2px solid', 'right:0;bottom:0;border-right:2px solid;border-bottom:2px solid']
      .map(function (s) { return '<div style="position:absolute;width:14px;height:14px;border-color:' + C.navy + ';' + s + ';"></div>'; }).join('') +
    '<div style="position:absolute;left:0;top:-18px;' + EYEBROW + 'color:' + C.navy + ';">Vista térmica</div>');

  // chips de lecturas
  var DATOS = [['Aceite', 'Fe al alza'], ['Ultrasonido', '+16 dB'], ['Vibraciones', 'Pista externa'], ['Termografía', 'Sin calentar']];
  var REVELA = [2.0, 1.2, 2.3, 1.2];
  var chips = DATOS.map(function (d, i) {
    var c = el('div', 'position:absolute;left:20px;top:' + (20 + i * 44) + 'px;width:220px;height:38px;box-sizing:border-box;border-radius:8px;background:#fff;border:1.5px solid ' + C.gris + ';display:flex;align-items:center;gap:10px;padding:0 12px;opacity:0;', bC,
      '<div data-r="dot" style="width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex:none;">' + (i + 1) + '</div>' +
      '<div style="font-size:12.5px;font-weight:700;color:' + C.navy + ';">' + d[0] + '</div>' +
      '<div data-r="lec" style="margin-left:auto;font-size:11px;font-weight:600;color:' + C.azul + ';opacity:0;white-space:nowrap;">' + d[1] + '</div>');
    return { el: c, dot: R(c, 'dot'), lec: R(c, 'lec') };
  });

  // líneas de unión (fase 5)
  var YC = 300;
  var svgL = '<svg width="' + CW + '" height="' + H + '" style="position:absolute;left:0;top:0;overflow:visible;">';
  for (var i = 0; i < 4; i++) {
    var y = 39 + i * 44;
    svgL += '<path data-r="l' + i + '" d="M20 ' + y + ' H13 Q8 ' + y + ' 8 ' + (y + 5) + ' V' + (YC - 5) + ' Q8 ' + YC + ' 13 ' + YC + ' H20" fill="none" stroke="' + C.azul + '" stroke-width="1.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"></path>' +
      '<circle data-r="d' + i + '" cx="20" cy="' + y + '" r="3.5" fill="' + C.naranja + '" opacity="0"></circle>';
  }
  svgL += '</svg>';
  var lineas = el('div', 'position:absolute;left:0;top:0;', bC, svgL);

  // paneles de detalle
  var PANEL = 'position:absolute;left:20px;top:214px;width:220px;height:300px;box-sizing:border-box;background:#fff;border:1px solid ' + C.gris + ';border-radius:12px;padding:16px;box-shadow:0 8px 24px rgba(0,46,70,.08);opacity:0;';
  var pts = [[10, 76], [43.6, 74], [77.2, 70], [110.8, 62], [144.4, 44], [178, 16]];
  var meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  var p1 = el('div', PANEL, bC,
    '<div style="' + EYEBROW + '">01 · Análisis de aceite</div>' +
    '<div style="' + TIT + '">Partículas de hierro</div>' +
    '<div style="position:absolute;right:16px;top:14px;width:16px;height:32px;border:1.5px dashed ' + C.gris + ';border-radius:3px 3px 7px 7px;box-sizing:border-box;"></div>' +
    '<svg width="188" height="116" viewBox="0 0 188 116" style="position:absolute;left:16px;top:72px;overflow:visible;">' +
      [16, 46, 76].map(function (y) { return '<line x1="0" x2="188" y1="' + y + '" y2="' + y + '" stroke="#eef1f4" stroke-width="1"></line>'; }).join('') +
      '<path data-r="lin" d="M' + pts.slice(0, 5).map(function (p) { return p.join(' '); }).join(' L') + '" fill="none" stroke="' + C.navy + '" stroke-width="2" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"></path>' +
      '<path data-r="ult" d="M144.4 44 L178 16" fill="none" stroke="' + C.naranja + '" stroke-width="2.5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"></path>' +
      pts.map(function (p, i) { return '<circle data-r="p' + i + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 5 ? 4.5 : 3) + '" fill="' + (i === 5 ? C.naranja : C.navy) + '" opacity="0"></circle>'; }).join('') +
      meses.map(function (m, i) { return '<text x="' + pts[i][0] + '" y="108" text-anchor="middle" font-size="9.5" fill="' + C.azul + '" font-family="' + FONT.replace(/'/g, '') + '">' + m + '</text>'; }).join('') +
    '</svg>' +
    '<div data-r="val" style="position:absolute;left:16px;right:16px;top:200px;display:flex;align-items:center;opacity:0;">' +
      '<div style="font-size:28px;font-weight:700;color:' + C.navy + ';line-height:1;">38<span style="font-size:13px;font-weight:600;margin-left:4px;">ppm</span></div>' +
      '<div data-r="alza" style="margin-left:auto;background:' + C.naranja + ';color:' + C.navy + ';font-size:11px;font-weight:700;padding:4px 9px;border-radius:11px;">▲ Al alza</div>' +
    '</div>' +
    '<div data-r="cap" style="position:absolute;left:16px;right:16px;top:242px;font-size:11px;line-height:1.4;color:' + C.azul + ';opacity:0;">Hierro en aceite de la bomba, últimos 6 meses</div>');

  var p2 = el('div', PANEL, bC,
    '<div style="' + EYEBROW + '">02 · Ultrasonido</div>' +
    '<div style="' + TIT + '">Rodamiento del lado acoplado</div>' +
    '<div style="position:absolute;left:16px;top:92px;display:flex;align-items:baseline;gap:6px;"><span data-r="db" style="font-size:46px;font-weight:700;color:' + C.navy + ';line-height:1;letter-spacing:-.02em;">+0</span><span style="font-size:20px;font-weight:700;color:' + C.navy + ';">dB</span></div>' +
    '<div data-r="sob" style="position:absolute;left:16px;top:146px;font-size:15px;font-weight:600;color:' + C.azul + ';opacity:0;">sobre su base</div>' +
    '<svg width="188" height="64" viewBox="0 0 188 64" style="position:absolute;left:16px;top:196px;overflow:visible;font-family:' + FONT.replace(/'/g, '') + ';">' +
      '<text x="64" y="10" text-anchor="middle" font-size="10" fill="' + C.azul + '">Base</text>' +
      '<text data-r="actT" x="188" y="10" text-anchor="end" font-size="10" fill="' + C.azul + '" opacity="0">Actual</text>' +
      '<rect x="0" y="20" width="188" height="12" rx="6" fill="#eef1f4"></rect>' +
      '<rect data-r="fb" x="0" y="20" width="0" height="12" rx="6" fill="' + C.navy + '"></rect>' +
      '<rect data-r="fe" x="62" y="20" width="0" height="12" rx="3" fill="' + C.naranja + '"></rect>' +
      '<line x1="64" x2="64" y1="15" y2="37" stroke="' + C.navy + '" stroke-width="1.5"></line>' +
      '<text x="64" y="52" text-anchor="middle" font-size="10.5" font-weight="600" fill="' + C.navy + '">22 dBµV</text>' +
      '<text data-r="actV" x="188" y="52" text-anchor="end" font-size="10.5" font-weight="600" fill="' + C.navy + '" opacity="0">38 dBµV</text>' +
    '</svg>');

  var BARS = [[18, 26, C.navy, 1], [38, 14, C.navy, 1], [58, 9, C.navy, 1], [88, 5, C.azul, .5], [138, 6, C.azul, .5], [118, 62, C.naranja, 1], [158, 20, C.naranja, .55], [102, 4, C.azul, .5], [174, 4, C.azul, .5]];
  var p3 = el('div', PANEL, bC,
    '<div style="' + EYEBROW + '">03 · Vibraciones</div>' +
    '<div style="' + TIT + '">Espectro en el alojamiento</div>' +
    '<svg width="188" height="100" viewBox="0 0 188 100" style="position:absolute;left:16px;top:62px;overflow:visible;font-family:' + FONT.replace(/'/g, '') + ';">' +
      '<line x1="0" x2="188" y1="84" y2="84" stroke="' + C.gris + '" stroke-width="1.5"></line>' +
      BARS.map(function (b, i) { return '<rect data-r="b' + i + '" x="' + (b[0] - 3) + '" y="84" width="6" height="0" rx="1" fill="' + b[2] + '" opacity="' + b[3] + '"></rect>'; }).join('') +
      ['1×', '2×', '3×'].map(function (t, i) { return '<text x="' + (18 + i * 20) + '" y="96" text-anchor="middle" font-size="9.5" fill="' + C.azul + '">' + t + '</text>'; }).join('') +
      '<g data-r="lbl" opacity="0"><text x="118" y="10" text-anchor="middle" font-size="11" font-weight="700" fill="' + C.navy + '">pista externa</text><line x1="118" x2="118" y1="14" y2="19" stroke="' + C.navy + '" stroke-width="1.2"></line></g>' +
    '</svg>' +
    '<div style="position:absolute;left:16px;top:170px;' + EYEBROW + '">Causa posible</div>' +
    ['Desbalance', 'Desalineación', 'Rodamiento'].map(function (t, i) {
      return '<div data-r="c' + i + '" style="position:absolute;left:10px;width:200px;top:' + (188 + i * 30) + 'px;height:26px;box-sizing:border-box;padding:0 6px;border-radius:6px;display:flex;align-items:center;gap:8px;">' +
        '<div data-r="k' + i + '" style="width:16px;height:16px;box-sizing:border-box;border-radius:50%;border:1.5px solid ' + C.gris + ';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:' + C.navy + ';flex:none;"></div>' +
        '<div style="position:relative;font-size:13px;color:' + C.navy + ';font-weight:600;">' + t +
        (i < 2 ? '<div data-r="s' + i + '" style="position:absolute;left:-2px;right:-2px;top:50%;height:1.5px;background:' + C.navy + ';transform:scaleX(0);transform-origin:0 50%;"></div>' : '') + '</div></div>';
    }).join(''));

  var TGRAD = 'linear-gradient(90deg,' + C.azul + ',' + C.gris + ' 55%,' + C.naranja + ')';
  function fila(n, v, x) { return '<div style="display:flex;align-items:center;gap:8px;height:24px;border-bottom:1px solid #eef1f4;"><div style="width:10px;height:10px;border-radius:50%;background:' + x + ';"></div><div style="font-size:13px;color:' + C.navy + ';">' + n + '</div><div style="margin-left:auto;font-size:13px;font-weight:700;color:' + C.navy + ';">' + v + '</div></div>'; }
  var p4 = el('div', PANEL, bC,
    '<div style="' + EYEBROW + '">04 · Termografía</div>' +
    '<div style="' + TIT + '">Motor en operación</div>' +
    '<div data-r="bar" style="position:absolute;left:16px;top:82px;width:188px;height:12px;border-radius:6px;background:' + TGRAD + ';transform-origin:0 50%;"></div>' +
    '<div data-r="m1" style="position:absolute;top:74px;left:' + (16 + 188 * .34 - 5) + 'px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ' + C.navy + ';opacity:0;"></div>' +
    '<div data-r="m2" style="position:absolute;top:74px;left:' + (16 + 188 * .47 - 5) + 'px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ' + C.navy + ';opacity:0;"></div>' +
    '<div style="position:absolute;left:16px;right:16px;top:98px;display:flex;font-size:10px;color:' + C.azul + ';"><span>Frío</span><span style="margin-left:auto;">Caliente</span></div>' +
    '<div data-r="filas" style="position:absolute;left:16px;right:16px;top:124px;opacity:0;">' + fila('Carcasa', '38 °C', mixHex(C.azul, C.gris, .62)) + fila('Rodamiento', '41 °C', mixHex(C.gris, C.naranja, .25)) + '</div>' +
    '<div data-r="msg" style="position:absolute;left:16px;right:16px;top:198px;background:#eef1f4;border-radius:8px;padding:10px 12px;font-size:14px;font-weight:700;color:' + C.navy + ';line-height:1.3;opacity:0;">Aún sin calentamiento: queda margen</div>');
  var paneles = [p1, p2, p3, p4];

  // tarjeta final
  var tarjeta = el('div', 'position:absolute;left:20px;top:226px;width:220px;box-sizing:border-box;background:' + C.navy + ';border-radius:12px;padding:16px;box-shadow:0 10px 28px rgba(0,46,70,.22);opacity:0;', bC,
    '<div style="' + EYEBROW + 'color:' + C.gris + ';">Diagnóstico</div>' +
    '<div style="font-size:17px;font-weight:700;color:#fff;line-height:1.25;margin-top:6px;">Rodamiento del lado acoplado</div>' +
    '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;"><div style="font-size:13px;color:' + C.gris + ';">Etapa 2 de 4</div><div style="display:flex;gap:3px;margin-left:auto;">' +
      [1, 1, 0, 0].map(function (f) { return '<div style="width:22px;height:5px;border-radius:2px;background:' + (f ? C.naranja : 'rgba(217,226,232,.28)') + ';"></div>'; }).join('') + '</div></div>' +
    '<div style="font-size:13px;color:#fff;margin-top:6px;line-height:1.35;">Cambiar en la siguiente ventana</div>');
  var lema = el('div', 'position:absolute;left:20px;top:404px;width:118px;font-size:15px;font-weight:700;color:' + C.navy + ';line-height:1.3;opacity:0;', bC, '4 técnicas,<br>1 diagnóstico');
  var sello = el('div', 'position:absolute;left:144px;top:400px;width:94px;height:94px;box-sizing:border-box;border-radius:50%;border:3px solid ' + C.naranja + ';display:flex;align-items:center;justify-content:center;opacity:0;background:rgba(255,255,255,.6);', bC,
    '<div style="position:absolute;inset:5px;border-radius:50%;border:1.5px dashed ' + C.naranja + ';"></div>' +
    '<div style="font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:' + C.navy + ';text-align:center;line-height:1.2;">Refacción<br>en mano</div>');

  // frasco volador
  var frasco = el('div', 'position:absolute;left:0;top:0;width:16px;height:32px;transform-origin:0 0;opacity:0;', capa,
    '<div style="position:absolute;left:2px;top:0;width:12px;height:6px;background:' + C.navy + ';border-radius:2px;"></div>' +
    '<div style="position:absolute;left:0;top:5px;width:16px;height:27px;box-sizing:border-box;border:1.5px solid ' + C.navy + ';border-radius:2px 2px 7px 7px;background:#fff;overflow:hidden;"><div style="position:absolute;left:0;right:0;bottom:0;height:62%;background:' + C.naranja + ';"></div></div>');

  /* ---------- Three.js ---------- */
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  if (REV >= 152) renderer.outputColorSpace = THREE.SRGBColorSpace; else renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  var cv = renderer.domElement;
  cv.style.cssText = 'position:absolute;left:0;top:0;width:' + SW + 'px;height:' + H + 'px;';
  bE.insertBefore(cv, bE.firstChild);

  var scene = new THREE.Scene();
  var geos = [], mats = [];
  function G(g) { geos.push(g); return g; }
  function M(name, hex, o) { var m = new THREE.MeshStandardMaterial(Object.assign({ color: col(hex), roughness: .55, metalness: .1 }, o || {})); m.name = name; mats.push(m); return m; }
  function B(name, hex, o) { var m = new THREE.MeshBasicMaterial(Object.assign({ color: col(hex), transparent: true, depthWrite: false, side: THREE.DoubleSide }, o || {})); m.name = name; mats.push(m); return m; }
  function mesh(name, g, m, parent, p, r) { var o = new THREE.Mesh(G(g), m); o.name = name; o.castShadow = true; o.receiveShadow = true; if (p) o.position.set(p[0], p[1], p[2]); if (r) o.rotation.set(r[0], r[1], r[2]); (parent || scene).add(o); return o; }
  function cylX(name, r, len, x, y, z, m, parent, s) { return mesh(name, new THREE.CylinderGeometry(r, r, len, s || 48), m, parent, [x, y, z], [0, 0, Math.PI / 2]); }

  var mNavy = M('azul_marino', C.navy, { roughness: .5, metalness: .15 });
  var mAzul = M('azul_medio', C.azul, { roughness: .5, metalness: .15 });
  var mGris = M('gris', C.gris, { roughness: .7, metalness: 0 });
  var mBase = M('base', mixHex(C.gris, C.navy, .28), { roughness: .85, metalness: 0 });
  var mMetal = M('metal', mixHex(C.gris, '#ffffff', .2), { roughness: .3, metalness: .65 });
  var mOsc = M('oscuro', mixHex(C.navy, '#000000', .45), { roughness: .8, metalness: 0 });
  var mNar = M('naranja', C.naranja, { roughness: .45, metalness: 0 });
  var mTraje = M('traje', C.azul, { roughness: .8, metalness: 0 });
  var mPiel = M('piel', '#d9b79c', { roughness: .8, metalness: 0 });
  var mCasco = M('casco', '#f7f9fa', { roughness: .4, metalness: 0 });

  // suelo con sombra suave
  var smat = new THREE.ShadowMaterial({ opacity: .16 }); smat.name = 'sombra'; mats.push(smat);
  if (smat.color) smat.color.copy(col(C.navy));
  var suelo = new THREE.Mesh(G(new THREE.PlaneGeometry(12, 12)), smat); suelo.name = 'suelo'; suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; scene.add(suelo);

  var maq = new THREE.Group(); maq.name = 'motobomba'; scene.add(maq);
  var AY = .72; // altura del eje
  mesh('base', new THREE.BoxGeometry(3.2, .16, 1.05), mBase, maq, [.15, .08, 0]);

  var partesMotor = [];
  partesMotor.push(cylX('carcasa_motor', .38, 1.1, -.55, AY, 0, mNavy, maq, 64));
  for (i = 0; i < 9; i++) partesMotor.push(cylX('aleta_' + i, .405, .035, -1.02 + i * .12, AY, 0, mNavy, maq, 64));
  partesMotor.push(cylX('tapa_lado_acoplado', .34, .06, .03, AY, 0, mNavy, maq, 64));
  partesMotor.push(cylX('tapa_lado_libre', .34, .05, -1.125, AY, 0, mNavy, maq, 64));
  partesMotor.push(cylX('cubierta_ventilador', .36, .2, -1.25, AY, 0, mGris, maq, 64));
  [.12, .22, .3].forEach(function (r, k) { mesh('rejilla_' + k, new THREE.TorusGeometry(r, .008, 8, 64), mMetal, maq, [-1.352, AY, 0], [0, Math.PI / 2, 0]); });
  partesMotor.push(mesh('caja_conexiones', new THREE.BoxGeometry(.32, .2, .3), mNavy, maq, [-.45, AY + .38 + .08, 0]));
  mesh('tapa_caja', new THREE.BoxGeometry(.34, .03, .32), mAzul, maq, [-.45, AY + .38 + .195, 0]);
  [-.9, -.2].forEach(function (x, k) { partesMotor.push(mesh('pata_motor_' + k, new THREE.BoxGeometry(.14, .24, .72), mNavy, maq, [x, .28, 0])); });

  // corte del rodamiento del lado acoplado
  mesh('corte_rodamiento', new THREE.CylinderGeometry(.235, .235, .004, 64), mOsc, maq, [.062, AY, 0], [0, 0, Math.PI / 2]);
  mesh('pista_externa', new THREE.TorusGeometry(.2, .018, 12, 64), mMetal, maq, [.066, AY, 0], [0, Math.PI / 2, 0]);
  var jaula = new THREE.Group(); jaula.name = 'jaula_bolas'; jaula.position.set(.066, AY, 0); maq.add(jaula);
  for (i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2; mesh('bola_' + i, new THREE.SphereGeometry(.034, 16, 12), mMetal, jaula, [0, Math.cos(a) * .158, Math.sin(a) * .158]); }

  // conjunto giratorio
  var giro = new THREE.Group(); giro.name = 'conjunto_giratorio'; giro.position.set(0, AY, 0); maq.add(giro);
  mesh('pista_interna', new THREE.TorusGeometry(.115, .015, 12, 48), mMetal, giro, [.066, 0, 0], [0, Math.PI / 2, 0]);
  cylX('flecha', .055, .61, .355, 0, 0, mMetal, giro, 32);
  cylX('cubo_acople_motor', .13, .1, .41, 0, 0, mMetal, giro, 48);
  cylX('elastomero', .1, .019, .47, 0, 0, mOsc, giro, 48);
  cylX('cubo_acople_bomba', .13, .1, .53, 0, 0, mMetal, giro, 48);
  mesh('marca_giro_1', new THREE.BoxGeometry(.1, .03, .04), mNavy, giro, [.41, .13, 0]);
  mesh('marca_giro_2', new THREE.BoxGeometry(.1, .03, .04), mNavy, giro, [.53, -.13, 0]);

  // bomba
  cylX('soporte_rodamientos_bomba', .15, .45, .88, AY, 0, mAzul, maq, 48);
  cylX('anillo_soporte', .17, .05, .69, AY, 0, mAzul, maq, 48);
  mesh('pie_bomba', new THREE.BoxGeometry(.14, .42, .5), mAzul, maq, [.9, .37, 0]);
  mesh('toma_muestra', new THREE.CylinderGeometry(.022, .022, .12, 24), mMetal, maq, [.86, AY + .19, -.07]);
  mesh('valvula_muestra', new THREE.BoxGeometry(.08, .016, .022), mNavy, maq, [.86, AY + .22, -.07]);
  cylX('voluta', .44, .26, 1.24, AY, 0, mAzul, maq, 64);
  mesh('pie_voluta', new THREE.BoxGeometry(.2, .14, .5), mAzul, maq, [1.24, .23, 0]);
  mesh('descarga', new THREE.CylinderGeometry(.1, .1, .5, 40), mAzul, maq, [1.24, 1.13, .2]);
  mesh('brida_descarga', new THREE.CylinderGeometry(.16, .16, .04, 48), mAzul, maq, [1.24, 1.4, .2]);
  cylX('succion', .12, .28, 1.51, AY, 0, mAzul, maq, 40);
  cylX('brida_succion', .18, .04, 1.66, AY, 0, mAzul, maq, 48);

  // halo del rodamiento
  var mHalo = B('halo', C.naranja, { opacity: .35 });
  var mBrillo = B('halo_brillo', C.naranja, { opacity: .12 });
  var halo = mesh('halo_rodamiento', new THREE.TorusGeometry(.36, .008, 8, 96), mHalo, maq, [.065, AY, 0], [0, Math.PI / 2, 0]); halo.castShadow = false;
  var brillo = mesh('halo_brillo', new THREE.RingGeometry(.345, .48, 96), mBrillo, maq, [.064, AY, 0], [0, Math.PI / 2, 0]); brillo.castShadow = false;

  // capa térmica
  var hx = function (h) { var c = hexRgb(h); return V(c[0] / 255, c[1] / 255, c[2] / 255); };
  var mTerm = new THREE.ShaderMaterial({
    uniforms: { cFrio: { value: hx(C.azul) }, cMedio: { value: hx(C.gris) }, cTibio: { value: hx(C.naranja) }, uCal: { value: V(.066, AY, 0) }, uOp: { value: 0 } },
    vertexShader: 'varying vec3 vW; varying vec3 vN; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }',
    fragmentShader: 'uniform vec3 cFrio; uniform vec3 cMedio; uniform vec3 cTibio; uniform vec3 uCal; uniform float uOp; varying vec3 vW; varying vec3 vN;' +
      'void main(){ float g=clamp((vW.x+1.35)/1.41,0.0,1.0); float d=distance(vW,uCal); float w=exp(-d*d/0.08);' +
      'vec3 c=mix(cFrio,cMedio,0.15+0.45*g+0.25*clamp(vW.y-0.6,0.0,1.0)); c=mix(c,cTibio,w*0.5);' +
      'float l=0.78+0.22*max(dot(normalize(vN),normalize(vec3(-0.3,0.9,0.5))),0.0); gl_FragColor=vec4(c*l,uOp); }',
    transparent: true, depthWrite: false
  });
  mTerm.name = 'termografia'; mats.push(mTerm);
  partesMotor.forEach(function (m) {
    var o = new THREE.Mesh(m.geometry, mTerm); o.name = m.name + '_termica';
    o.position.copy(m.position); o.rotation.copy(m.rotation); o.scale.copy(m.scale).multiplyScalar(1.006); o.renderOrder = 3; o.visible = false;
    m.parent.add(o); m.userData.term = o;
  });

  // técnico
  var tec = new THREE.Group(); tec.name = 'guia_herramientas'; tec.visible = false; scene.add(tec);
  var piernas = [-.1, .1].map(function (x, k) {
    var g = new THREE.CylinderGeometry(.075, .07, .95, 20); g.translate(0, -.475, 0);
    var p = mesh('pierna_' + k, g, mTraje, tec, [x, .95, 0]);
    mesh('bota_' + k, new THREE.BoxGeometry(.12, .08, .22), mNavy, p, [0, -.91, .04]);
    return p;
  });
  var torso = new THREE.Group(); torso.name = 'torso'; torso.position.y = .95; tec.add(torso);
  mesh('tronco', new THREE.CylinderGeometry(.2, .17, .6, 28), mTraje, torso, [0, .3, 0]);
  mesh('franja', new THREE.CylinderGeometry(.203, .197, .04, 28), mGris, torso, [0, .42, 0]);
  mesh('cuello', new THREE.CylinderGeometry(.05, .05, .08, 16), mPiel, torso, [0, .63, 0]);
  mesh('cabeza', new THREE.SphereGeometry(.11, 28, 20), mPiel, torso, [0, .74, 0]);
  mesh('casco', new THREE.SphereGeometry(.125, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), mCasco, torso, [0, .77, 0]);
  mesh('ala_casco', new THREE.CylinderGeometry(.15, .15, .015, 28), mCasco, torso, [0, .775, .02]);
  function brazo(lado) {
    var piv = new THREE.Group(); piv.name = 'hombro_' + lado; piv.position.set(lado === 'der' ? .24 : -.24, .52, 0); torso.add(piv);
    var g = new THREE.CylinderGeometry(.045, .04, .62, 16); g.rotateX(Math.PI / 2); g.translate(0, 0, .31);
    mesh('brazo_' + lado, g, mTraje, piv);
    mesh('mano_' + lado, new THREE.SphereGeometry(.05, 16, 12), mPiel, piv, [0, 0, .64]);
    var mk = new THREE.Object3D(); mk.position.z = .66; piv.add(mk);
    return { piv: piv, mano: mk };
  }
  var bD = brazo('der'), bI = brazo('izq');

  // herramientas
  var frasco3 = new THREE.Group(); frasco3.name = 'frasco_muestra'; scene.add(frasco3);
  var mVidrio = M('vidrio', '#ffffff', { roughness: .15, metalness: 0, transparent: true, opacity: .75 });
  var mAceite = M('aceite', mixHex(C.naranja, C.navy, .12), { roughness: .4 });
  mesh('frasco', new THREE.CylinderGeometry(.028, .028, .09, 24), mVidrio, frasco3);
  mesh('aceite', new THREE.CylinderGeometry(.025, .025, .05, 24), mAceite, frasco3, [0, -.018, 0]);
  mesh('tapa_frasco', new THREE.CylinderGeometry(.03, .03, .02, 24), mNavy, frasco3, [0, .055, 0]);

  var detector = new THREE.Group(); detector.name = 'detector_ultrasonido'; scene.add(detector);
  mesh('cuerpo_detector', new THREE.BoxGeometry(.07, .05, .14), mNavy, detector, [0, 0, -.04]);
  var gV = new THREE.CylinderGeometry(.008, .008, 1, 12); gV.rotateX(Math.PI / 2); gV.translate(0, 0, .5);
  var varilla = mesh('varilla_detector', gV, mMetal, detector);
  var punta = mesh('punta_detector', new THREE.SphereGeometry(.016, 12, 10), mNar, detector);

  var sensor = new THREE.Group(); sensor.name = 'sensor_vibracion'; scene.add(sensor);
  mesh('cuerpo_sensor', new THREE.CylinderGeometry(.035, .035, .07, 24), mMetal, sensor, [0, .035, 0]);
  var mLed = B('led', C.naranja, { opacity: 1, depthWrite: true });
  var led = mesh('led_sensor', new THREE.CylinderGeometry(.02, .02, .012, 20), mLed, sensor, [0, .076, 0]);

  var camT = new THREE.Group(); camT.name = 'camara_termica'; scene.add(camT);
  mesh('cuerpo_camara', new THREE.BoxGeometry(.16, .11, .1), mNavy, camT);
  mesh('lente_camara', new THREE.CylinderGeometry(.035, .035, .05, 24), mOsc, camT, [0, .01, .07], [Math.PI / 2, 0, 0]);
  mesh('aro_lente', new THREE.TorusGeometry(.036, .006, 8, 24), mGris, camT, [0, .01, .095]);
  mesh('mango_camara', new THREE.BoxGeometry(.04, .09, .05), mNavy, camT, [0, -.09, -.01]);

  // ondas de ultrasonido
  var gOnda = G(new THREE.RingGeometry(.055, .066, 64));
  var ondas = [0, 1, 2].map(function (k) { var o = new THREE.Mesh(gOnda, B('onda_' + k, C.azul, { opacity: 0 })); o.name = 'onda_' + k; o.renderOrder = 4; scene.add(o); return o; });

  // luces
  scene.add(new THREE.HemisphereLight(col('#ffffff'), col(C.gris), .75 * LF));
  var sol = new THREE.DirectionalLight(col('#ffffff'), 1.25 * LF);
  sol.position.set(-2.2, 6, 3.4); sol.target.position.set(.15, 0, 0); scene.add(sol, sol.target);
  sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
  var sc = sol.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sc.near = .5; sc.far = 16; sc.updateProjectionMatrix();
  sol.shadow.radius = 6; if ('blurSamples' in sol.shadow) sol.shadow.blurSamples = 16;
  sol.shadow.bias = -.0005; sol.shadow.normalBias = .02;
  var relleno = new THREE.DirectionalLight(col('#ffffff'), .45 * LF); relleno.position.set(4, 2, 5); scene.add(relleno);

  // cámara isométrica suave
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 60);
  var objetivo = V(.2, .72, -.1);
  cam.position.copy(objetivo).addScaledVector(V(.6, .62, 1).normalize(), 16);
  cam.lookAt(objetivo);
  var hh = 2.2, asp = SW / H;
  cam.left = -hh * asp; cam.right = hh * asp; cam.top = hh * 1.1; cam.bottom = -hh * .9;
  cam.updateProjectionMatrix(); cam.updateMatrixWorld();

  function proj(v) { var p = v.clone().project(cam); return { x: (p.x + 1) / 2 * SW, y: (1 - p.y) / 2 * H }; }
  (function () { // visor térmico
    var mn = { x: 1e9, y: 1e9 }, mx = { x: -1e9, y: -1e9 };
    [-1.36, .07].forEach(function (x) { [.34, 1.3].forEach(function (y) { [-.41, .41].forEach(function (z) { var p = proj(V(x, y, z)); mn.x = Math.min(mn.x, p.x); mn.y = Math.min(mn.y, p.y); mx.x = Math.max(mx.x, p.x); mx.y = Math.max(mx.y, p.y); }); }); });
    visor.style.left = (mn.x - 8) + 'px'; visor.style.top = (mn.y - 8) + 'px'; visor.style.width = (mx.x - mn.x + 16) + 'px'; visor.style.height = (mx.y - mn.y + 16) + 'px';
  })();

  /* ---------- poses ---------- */
  var PUERTO = V(.86, AY + .3, -.07), C2 = V(.03, 1.045, -.1), C3 = V(-.12, 1.073, .14), MOTOR = V(-.6, .75, 0);
  function pose(x, z, lean, f) { return { pos: V(x, 0, z), lean: lean, yaw: Math.atan2(f.x - x, f.z - z) }; }
  var POSES = [pose(.5, -.82, .34, PUERTO), pose(.2, -.74, .3, C2), pose(.02, -.72, .32, C3), pose(-.35, -1.08, .04, MOTOR), pose(.5, -.82, 0, V(.5, 0, 1))];
  var TR = [.6, .5, .4, .6, 2.4];
  var tmp = V(0, 0, 0), manoD = V(0, 0, 0);

  var layoutS = { sE: 1, sC: 1, eL: 0, eT: 0, cL: SW, cT: 0 };
  var faseTit = -1, tActual = 0;

  function aplicar(t) {
    tActual = t;
    var fase = Math.min(4, Math.floor(t / DF)), u = t - fase * DF;
    var fin = 1 - seg(t, 15.55, 15.95);

    giro.rotation.x = t * (Math.PI * 2 * 20 / T);
    jaula.rotation.x = t * (Math.PI * 2 * 8 / T);

    // técnico
    var pv = POSES[(fase + 4) % 5], pc = POSES[fase], k = ease(seg(u, 0, TR[fase]));
    tec.position.copy(pv.pos).lerp(pc.pos, k);
    var mov = pv.pos.distanceTo(pc.pos) > .05 && k > 0 && k < 1;
    var paso = Math.sin(u * 10) * (mov ? 1 : 0);
    tec.position.y = mov ? Math.abs(paso) * .015 : 0;
    piernas[0].rotation.x = paso * .3; piernas[1].rotation.x = -paso * .3;
    tec.rotation.y = lerp(pv.yaw, pc.yaw, k);
    torso.rotation.x = lerp(pv.lean, pc.lean, k);
    tec.updateMatrixWorld(true);

    var descD = torso.localToWorld(V(.27, .05, .16)), descI = torso.localToWorld(V(-.27, .05, .16));
    var sujeta = torso.localToWorld(V(0, .42, .44));
    var tD = null, wD = 0, tI = null, wI = 0;
    if (fase === 0) { wD = seg(u, .05, .4) * (1 - seg(u, .8, 1.2)); tD = PUERTO; }
    if (fase === 1) { wD = seg(u, .1, .5) * (1 - seg(u, 2.95, 3.2)); tD = C2; }
    if (fase === 2) { wD = seg(u, 0, .3) * (1 - seg(u, .65, 1.1)); tD = C3; }
    if (fase === 3) { wD = wI = seg(u, .15, .55); tD = tI = sujeta; }
    if (fase === 4) { wD = wI = 1 - seg(u, 0, .4); tD = tI = sujeta; }
    bD.piv.lookAt(tD ? tmp.copy(descD).lerp(tD, ease(wD)) : descD);
    bI.piv.lookAt(tI ? tmp.copy(descI).lerp(tI, ease(wI)) : descI);
    tec.updateMatrixWorld(true);
    bD.mano.getWorldPosition(manoD);

    // frasco 3D
    frasco3.visible = fase === 0 && u > .2 && u < .8;
    if (frasco3.visible) { frasco3.position.copy(PUERTO).add(tmp.set(0, .06 + .12 * (1 - ease(seg(u, .2, .5))), 0)); frasco3.scale.setScalar(Math.max(.001, seg(u, .2, .35))); }

    // detector
    detector.visible = false;
    var ondaOn = fase === 1 ? seg(u, .5, .7) * (1 - seg(u, 2.9, 3.15)) : 0;
    ondas.forEach(function (o, i) {
      var q = ((u - .5) / 1.1 + i / 3) % 1; if (q < 0) q += 1;
      o.visible = ondaOn > 0; o.position.copy(C2); o.quaternion.copy(cam.quaternion);
      o.scale.setScalar(1 + q * 3.6); o.material.opacity = (1 - q) * .7 * ondaOn;
    });

    // sensor
    sensor.visible = fase >= 2 && fin > 0 && !(fase === 2 && u < .02);
    sensor.rotation.set(.37, 0, 0);
    if (fase === 2 && u < .6) { var bs = ease(seg(u, .1, .6)); sensor.position.copy(C3).add(tmp.set(0, .25 * (1 - bs), .1 * (1 - bs))); } else sensor.position.copy(C3);
    led.visible = !(fase === 2 && u > .6 && Math.floor(u * 4) % 2 === 1);
    sensor.scale.setScalar(fase === 4 ? Math.max(.001, fin) : 1);

    // cámara térmica
    camT.visible = false;
    var term = fase === 3 ? seg(u, .4, .9) : fase === 4 ? 1 - seg(u, 0, .5) : 0;
    mTerm.uniforms.uOp.value = term * .92;
    partesMotor.forEach(function (m) { m.userData.term.visible = term > 0; });
    visor.style.opacity = term;

    // halo
    var pulso = .5 + .5 * Math.sin(t * 4);
    var hi = fase === 0 ? .25 : fase === 4 ? .7 : .45;
    mHalo.opacity = (hi + .25 * pulso) * (fase === 3 ? 1 - term * .6 : 1);
    mBrillo.opacity = (hi * .22 + .06 * pulso) * (fase === 3 ? 1 - term * .7 : 1);

    // título y progreso
    if (fase !== faseTit) { faseTit = fase; titulo.textContent = TITULOS[fase]; barras.forEach(function (b, i) { b.style.background = i === fase ? C.naranja : i < fase ? C.navy : C.gris; }); }
    titulo.style.opacity = reduce ? 1 : .15 + .85 * seg(u, 0, .3);

    // chips
    chips.forEach(function (c, i) {
      var vis = fase > i ? 1 : fase === i ? seg(u, .1, .4) : 0;
      if (fase === 4) vis *= fin;
      c.el.style.opacity = vis;
      c.el.style.transform = 'translateY(' + ((1 - Math.min(1, vis / Math.max(fin, .001))) * 6) + 'px)';
      var act = fase === i;
      c.el.style.borderColor = act ? C.naranja : C.gris;
      c.dot.style.background = act ? C.naranja : C.navy; c.dot.style.color = act ? C.navy : '#fff';
      c.lec.style.opacity = fase > i ? 1 : fase === i ? seg(u, REVELA[i], REVELA[i] + .3) : 0;
    });

    // paneles
    paneles.forEach(function (p, i) {
      var op = fase === i ? seg(u, .2, .5) : fase === i + 1 ? 1 - seg(u, 0, .2) : 0;
      p.style.opacity = op; p.style.transform = 'translateY(' + ((1 - op) * 8) + 'px)';
      p.style.visibility = op > 0 ? 'visible' : 'hidden';
    });
    var uu = fase === 0 ? u : fase > 0 ? 9 : 0;
    var lin = seg(uu, 1.4, 1.9), ult = seg(uu, 1.9, 2.1);
    R(p1, 'lin').setAttribute('stroke-dashoffset', 1 - lin);
    R(p1, 'ult').setAttribute('stroke-dashoffset', 1 - ult);
    for (i = 0; i < 6; i++) R(p1, 'p' + i).setAttribute('opacity', i < 5 ? (lin >= i / 4 - .01 && uu > 1.4 ? 1 : 0) : (ult >= 1 ? 1 : 0));
    R(p1, 'val').style.opacity = seg(uu, 1.9, 2.2); R(p1, 'cap').style.opacity = seg(uu, 2.0, 2.3);
    R(p1, 'alza').style.transform = 'scale(' + (uu < 2.0 ? .6 : lerp(.6, 1, backOut(seg(uu, 2.0, 2.35)))) + ')';

    uu = fase === 1 ? u : fase > 1 ? 9 : 0;
    var m2 = ease(seg(uu, .7, 1.5));
    R(p2, 'db').textContent = '+' + Math.round(16 * m2);
    R(p2, 'fb').setAttribute('width', 64 * seg(m2, 0, .35) + (m2 > 0 ? 0 : 0));
    R(p2, 'fe').setAttribute('width', Math.max(0, 126 * seg(m2, .35, 1) - (m2 > .35 ? 0 : 0)));
    R(p2, 'sob').style.opacity = seg(uu, 1.1, 1.4); R(p2, 'actT').setAttribute('opacity', seg(uu, 1.3, 1.6)); R(p2, 'actV').setAttribute('opacity', seg(uu, 1.3, 1.6));

    uu = fase === 2 ? u : fase > 2 ? 9 : 0;
    BARS.forEach(function (b, i) { var h = b[1] * ease(seg(uu, .6 + i * .04, 1.1 + i * .04)); var r = R(p3, 'b' + i); r.setAttribute('height', h); r.setAttribute('y', 84 - h); });
    R(p3, 'lbl').setAttribute('opacity', seg(uu, 1.2, 1.45));
    [0, 1].forEach(function (j) { var s = ease(seg(uu, 1.6 + j * .3, 1.85 + j * .3)); R(p3, 's' + j).style.transform = 'scaleX(' + s + ')'; R(p3, 'c' + j).style.opacity = 1 - .55 * s; });
    var ok = seg(uu, 2.3, 2.5);
    R(p3, 'c2').style.background = ok > 0 ? 'rgba(252,159,1,' + (.16 * ok) + ')' : 'transparent';
    var k2 = R(p3, 'k2'); k2.style.background = ok > 0 ? C.naranja : 'transparent'; k2.style.borderColor = ok > 0 ? C.naranja : C.gris; k2.textContent = ok > 0 ? '✓' : '';

    uu = fase === 3 ? u : fase > 3 ? 9 : 0;
    R(p4, 'bar').style.transform = 'scaleX(' + ease(seg(uu, .5, .9)) + ')';
    R(p4, 'm1').style.opacity = seg(uu, .8, 1); R(p4, 'm2').style.opacity = seg(uu, .9, 1.1);
    R(p4, 'filas').style.opacity = seg(uu, .8, 1.1); R(p4, 'msg').style.opacity = seg(uu, 1.2, 1.5);

    // fase final
    uu = fase === 4 ? u : 0;
    for (i = 0; i < 4; i++) {
      R(lineas, 'l' + i).setAttribute('stroke-dashoffset', 1 - ease(seg(uu, .1 + i * .08, .8 + i * .08)));
      R(lineas, 'd' + i).setAttribute('opacity', seg(uu, .1 + i * .08, .25 + i * .08));
    }
    lineas.style.opacity = fase === 4 ? fin : 0;
    var tc = seg(uu, .6, 1.1);
    tarjeta.style.opacity = tc * fin; tarjeta.style.transform = 'translateY(' + ((1 - ease(tc)) * 10) + 'px)';
    lema.style.opacity = seg(uu, .9, 1.2) * fin;
    var ps = seg(uu, 1.3, 1.8);
    sello.style.opacity = seg(ps, 0, .25) * fin;
    sello.style.transform = 'rotate(-12deg) scale(' + (ps > 0 ? .35 + .65 * backOut(ps) : .35) + ')';

    // frasco volador
    var vo = fase === 0 && u >= .8 ? 1 - seg(u, 3.0, 3.2) : 0;
    frasco.style.opacity = vo;
    if (vo > 0) {
      var L = layoutS, pp = proj(PUERTO.clone().add(tmp.set(0, .06, 0)));
      var f = ease(seg(u, .8, 1.5));
      var x0 = L.eL + (pp.x - 8) * L.sE, y0 = L.eT + (pp.y - 18) * L.sE;
      var x1 = L.cL + 208 * L.sC, y1 = L.cT + 228 * L.sC;
      var s = lerp(L.sE, L.sC, f);
      frasco.style.transform = 'translate(' + lerp(x0, x1, f) + 'px,' + (lerp(y0, y1, f) - Math.sin(Math.PI * f) * 70 * s) + 'px) scale(' + s + ')';
    }
  }

  function render() { renderer.render(scene, cam); }

  function layout() {
    var w = container.clientWidth || W;
    var L = layoutS;
    if (w >= 520) {
      var s = w / W; L.sE = L.sC = s; L.eL = 0; L.eT = 0; L.cL = SW * s; L.cT = 0;
      raiz.style.height = (H * s) + 'px';
    } else {
      L.sE = w / SW; L.sC = Math.min(w / CW, 1.15); L.eL = 0; L.eT = 0; L.cL = (w - CW * L.sC) / 2; L.cT = H * L.sE;
      raiz.style.height = (H * L.sE + H * L.sC) + 'px';
    }
    bE.style.transform = 'translate(' + L.eL + 'px,' + L.eT + 'px) scale(' + L.sE + ')';
    bC.style.transform = 'translate(' + L.cL + 'px,' + L.cT + 'px) scale(' + L.sC + ')';
    renderer.setPixelRatio(Math.min(4, Math.min(window.devicePixelRatio || 1, 2) * L.sE));
    renderer.setSize(SW, H, false);
    cv.style.width = SW + 'px'; cv.style.height = H + 'px';
  }

  /* ---------- bucle ---------- */
  var raf = 0, last = 0, acc = 0, visible = true, congelado = reduce, destruido = false;
  function cuadro(now) {
    raf = requestAnimationFrame(cuadro);
    var dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now;
    acc = (acc + dt) % T; aplicar(acc); render();
  }
  function iniciar() { if (raf || congelado || destruido || !visible || document.hidden) return; last = 0; raf = requestAnimationFrame(cuadro); }
  function detener() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function onVis() { if (document.hidden) detener(); else iniciar(); }
  document.addEventListener('visibilitychange', onVis);

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; if (visible) iniciar(); else detener(); });
    io.observe(raiz);
  }
  var ro = null;
  var anchoPrevio = -1, rafRO = 0;
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(function () {
      var w = container.clientWidth;
      if (w === anchoPrevio) return;
      anchoPrevio = w;
      cancelAnimationFrame(rafRO);
      rafRO = requestAnimationFrame(function () { if (destruido) return; layout(); aplicar(tActual); render(); });
    });
    ro.observe(container);
  }
  else window.addEventListener('resize', layout);

  layout();
  if (reduce) { acc = 15.2; }
  aplicar(acc); render();
  iniciar();

  function limpiar() {
    if (destruido) return; destruido = true;
    detener(); cancelAnimationFrame(rafRO);
    if (io) io.disconnect(); if (ro) ro.disconnect(); else window.removeEventListener('resize', layout);
    document.removeEventListener('visibilitychange', onVis);
    geos.forEach(function (g) { g.dispose(); });
    mats.forEach(function (m) { m.dispose(); });
    if (sol.shadow.map) sol.shadow.map.dispose();
    renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (raiz.parentNode) raiz.parentNode.removeChild(raiz);
  }
  limpiar.irA = function (segundo) { if (destruido) return; congelado = true; detener(); acc = ((segundo % T) + T) % T; aplicar(acc); render(); };
  limpiar.reanudar = function () { if (destruido || reduce) return; congelado = false; iniciar(); };
  return limpiar;
}
