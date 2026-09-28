/**
 * Escena del inicio de /servicios/idap: "cada medición se convierte en una
 * decisión". Un monitor flotante con el tablero de IDAP (equipos por
 * estado y una tendencia que se dibuja), los anillos dorados del logo
 * detrás, y tarjetas de medición (temperatura, ultrasonido, vibración) que
 * vuelan hacia la pantalla y actualizan el tablero; al final aparece
 * "Recomendación lista". Se inclina con el cursor.
 *
 * Generada en Claude Diseño por Emiliano (2026-09-28,
 * docs/designs/idap-hero-3d.html) y portada como las demás: recibe THREE
 * (r128), el contenedor y opciones ({ fuente, duracion,
 * reducirMovimiento, inclinacion }) y devuelve la limpieza. Fondo
 * transparente: el azul lo pone la sección. Sin nombres de clientes.
 */
/* eslint-disable */
export function montarEscenaIdapHero(THREE, container, opciones) {
  opciones = opciones || {};
  var DUR = opciones.duracion || 8;
  var FONT = opciones.fuente || "Manrope, 'Segoe UI', system-ui, sans-serif";
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reducido = opciones.reducirMovimiento != null ? !!opciones.reducirMovimiento : !!(mq && mq.matches);

  var GOLD = '#ffc34d';
  var ESTADOS = [
    { nombre: 'Buen estado', color: '#22c55e', base: 142 },
    { nombre: 'Observación', color: '#facc15', base: 18 },
    { nombre: 'Precaución',  color: '#fc9f01', base: 7 },
    { nombre: 'Alarma',      color: '#ef4444', base: 2 }
  ];
  var MEDICIONES = [
    { icono: 'temp', titulo: 'Temperatura', valor: '68.4 °C',   estado: 0, lado: -1, y: -0.55 },
    { icono: 'ultra', titulo: 'Ultrasonido', valor: '32 dBµV',  estado: 1, lado:  1, y:  0.55 },
    { icono: 'vib',  titulo: 'Vibración',   valor: '6.8 mm/s',  estado: 2, lado: -1, y:  0.45 },
    { icono: 'vib',  titulo: 'Vibración',   valor: '11.2 mm/s', estado: 3, lado:  1, y: -0.7 }
  ];
  var VUELO = 1.7, INICIOS = [0.5, 1.6, 2.7, 3.8], T_LABEL = 6.0;

  // ---------- utilidades ----------
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function lienzo(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function texturaDe(canvas) {
    var t = new THREE.CanvasTexture(canvas);
    t.encoding = THREE.sRGBEncoding;
    return t;
  }

  // ---------- renderer / escena ----------
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  var cv = renderer.domElement;
  cv.style.cssText = 'display:block;width:100%;height:100%;outline:none;';
  cv.setAttribute('aria-label', 'Monitor con el tablero de IDAP: cada medición se convierte en una decisión');
  cv.setAttribute('role', 'img');
  container.appendChild(cv);
  var aniso = renderer.capabilities.getMaxAnisotropy();

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  var CENTRO_Y = 0.05;

  scene.add(new THREE.HemisphereLight(0x9db4e0, 0x0a1224, 0.7));
  var key = new THREE.DirectionalLight(0xffffff, 0.8); key.position.set(3, 4, 5); scene.add(key);
  var rim = new THREE.DirectionalLight(0xffc34d, 1.3); rim.position.set(-4, 2.5, -3); scene.add(rim);
  var fill = new THREE.DirectionalLight(0x5b8bd6, 0.6); fill.position.set(4, -2, 2); scene.add(fill);

  var conjunto = new THREE.Group(); conjunto.name = 'conjunto'; scene.add(conjunto);
  var BASE_RY = -0.26, BASE_RX = 0.04;

  // halo
  var haloC = lienzo(256, 256), hx = haloC.getContext('2d');
  var hg = hx.createRadialGradient(128, 128, 0, 128, 128, 128);
  hg.addColorStop(0, 'rgba(255,195,77,0.30)'); hg.addColorStop(0.45, 'rgba(60,110,190,0.14)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
  hx.fillStyle = hg; hx.fillRect(0, 0, 256, 256);
  var haloTex = texturaDe(haloC);
  var halo = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 5.2),
    new THREE.MeshBasicMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 }));
  halo.name = 'halo'; halo.position.z = -1.0; conjunto.add(halo);

  // anillos del logo
  var anillos = [];
  [{ r: 1.55, arc: 1.35, tubo: 0.010, op: 0.22, vel: 0.07, rot: 0.3 },
   { r: 1.85, arc: 1.05, tubo: 0.009, op: 0.15, vel: -0.045, rot: 2.1 },
   { r: 2.15, arc: 0.75, tubo: 0.008, op: 0.09, vel: 0.03, rot: 4.0 }].forEach(function (a, i) {
    var m = new THREE.Mesh(new THREE.TorusGeometry(a.r, a.tubo, 8, 160, a.arc * Math.PI),
      new THREE.MeshBasicMaterial({ color: 0xffc34d, transparent: true, opacity: a.op, depthWrite: false }));
    m.name = 'anillo_' + (i + 1); m.position.z = -0.7; m.rotation.z = a.rot;
    m.userData = a; conjunto.add(m); anillos.push(m);
  });

  // monitor
  var SW = 3.04, SH = 1.9, BW = SW + 0.14, BH = SH + 0.14, BD = 0.07;
  var forma = new THREE.Shape(), r = 0.08, x0 = -BW / 2, y0 = -BH / 2;
  forma.moveTo(x0 + r, y0); forma.lineTo(x0 + BW - r, y0); forma.quadraticCurveTo(x0 + BW, y0, x0 + BW, y0 + r);
  forma.lineTo(x0 + BW, y0 + BH - r); forma.quadraticCurveTo(x0 + BW, y0 + BH, x0 + BW - r, y0 + BH);
  forma.lineTo(x0 + r, y0 + BH); forma.quadraticCurveTo(x0, y0 + BH, x0, y0 + BH - r);
  forma.lineTo(x0, y0 + r); forma.quadraticCurveTo(x0, y0, x0 + r, y0);
  var bezelGeo = new THREE.ExtrudeGeometry(forma, { depth: BD, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 4, curveSegments: 12 });
  bezelGeo.translate(0, 0, -BD / 2);
  var monitor = new THREE.Group(); monitor.name = 'monitor'; conjunto.add(monitor);
  var bezel = new THREE.Mesh(bezelGeo, new THREE.MeshStandardMaterial({ name: 'aluminio_oscuro', color: 0x1b2438, metalness: 0.65, roughness: 0.32 }));
  bezel.name = 'marco'; monitor.add(bezel);
  var led = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.008, 0.004), new THREE.MeshBasicMaterial({ color: 0xffc34d, transparent: true, opacity: 0.85 }));
  led.name = 'acento'; led.position.set(0, -BH / 2 + 0.035, BD / 2 + 0.017); monitor.add(led);

  // pantalla (canvas)
  var PW = 1600, PH = 1000;
  var pantC = lienzo(PW, PH), px = pantC.getContext('2d');
  var pantTex = texturaDe(pantC); pantTex.anisotropy = aniso;
  var pantalla = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: pantTex, toneMapped: false }));
  pantalla.name = 'pantalla'; pantalla.position.z = BD / 2 + 0.017; monitor.add(pantalla);

  // sombra
  var sombC = lienzo(256, 64), sx = sombC.getContext('2d');
  var sg = sx.createRadialGradient(128, 32, 0, 128, 32, 128);
  sg.addColorStop(0, 'rgba(0,0,0,0.5)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
  sx.setTransform(1, 0, 0, 0.25, 0, 0); sx.fillStyle = sg; sx.fillRect(0, -200, 256, 800);
  var sombTex = texturaDe(sombC);
  var sombra = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), new THREE.MeshBasicMaterial({ map: sombTex, transparent: true, depthWrite: false }));
  sombra.name = 'sombra'; sombra.position.set(0, -1.5, -0.2); scene.add(sombra);

  // ---------- geometría del tablero ----------
  var TILE = { x: 60, y: 140, w: (PW - 120 - 90) / 4, h: 240, gap: 30 };
  var CH = { x: 120, y: 520, w: 1370, h: 370, max: 12 };
  var UMBRAL_PREC = 7.1, UMBRAL_ALAR = 10;
  function dato(x) { return 1.9 + 3.9 * Math.pow(x, 1.9) + 0.32 * Math.sin(x * 17) + 0.16 * Math.sin(x * 43 + 1.3); }
  function tileCentro(i) { return { x: TILE.x + i * (TILE.w + TILE.gap) + TILE.w / 2, y: TILE.y + TILE.h / 2 }; }

  function logoIDAP(ctx, cx, cy, s) {
    ctx.save(); ctx.strokeStyle = GOLD; ctx.lineCap = 'round';
    [0.35, 0.65, 0.95].forEach(function (k, i) {
      ctx.lineWidth = s * 0.11; ctx.globalAlpha = 1 - i * 0.2;
      ctx.beginPath(); ctx.arc(cx, cy, s * k, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke();
    });
    ctx.globalAlpha = 1; ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(cx, cy, s * 0.11, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function dibujarPantalla(t, animado) {
    var ctx = px;
    var dim = 0;
    if (animado) dim = t > 7.4 ? smooth(7.4, 7.95, t) : (t < 0.35 ? 1 - smooth(0, 0.35, t) : 0);
    var bg = ctx.createLinearGradient(0, 0, 0, PH);
    bg.addColorStop(0, '#11223f'); bg.addColorStop(1, '#0a142b');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, PW, PH);

    // encabezado
    logoIDAP(ctx, 88, 74, 38);
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    ctx.fillStyle = GOLD; ctx.font = '800 40px ' + FONT; ctx.fillText('IDAP', 140, 78);
    ctx.fillStyle = '#8ea3c7'; ctx.font = '500 26px ' + FONT; ctx.fillText('Monitoreo de condición', 262, 76);
    var pulso = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 / 2);
    ctx.fillStyle = hexA('#22c55e', 0.18 + 0.2 * pulso); ctx.beginPath(); ctx.arc(1420, 68, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(1420, 68, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c9d5ea'; ctx.font = '600 26px ' + FONT; ctx.textAlign = 'right'; ctx.fillText('En vivo', 1540, 77);
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(60, 114, PW - 120, 2);

    // tarjetas de estado
    for (var i = 0; i < 4; i++) {
      var e = ESTADOS[i], x = TILE.x + i * (TILE.w + TILE.gap), y = TILE.y;
      var edad = t - (INICIOS[i] + VUELO);
      var hit = edad >= 0;
      var g = hit ? (0.22 + 0.78 * Math.exp(-edad * 1.7)) * (1 - dim) : 0;
      var n = e.base + (hit ? 1 : 0);
      ctx.save();
      rr(ctx, x, y, TILE.w, TILE.h, 22);
      ctx.fillStyle = 'rgba(255,255,255,0.035)'; ctx.fill();
      if (g > 0) { ctx.fillStyle = hexA(e.color, 0.14 * g); ctx.fill(); }
      ctx.shadowColor = hexA(e.color, 0.9); ctx.shadowBlur = 36 * g;
      ctx.lineWidth = 2; ctx.strokeStyle = hexA(e.color, 0.14 + 0.72 * g); ctx.stroke();
      ctx.restore();
      // ondas del impacto
      if (hit && edad < 1.1) {
        ctx.save(); rr(ctx, x, y, TILE.w, TILE.h, 22); ctx.clip();
        var c = tileCentro(i), k = easeOutCubic(edad / 1.1);
        ctx.strokeStyle = hexA(e.color, 0.55 * (1 - k)); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(c.x, c.y, 20 + 220 * k, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = e.color; ctx.beginPath(); ctx.arc(x + 36, y + 46, 9, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'left'; ctx.fillStyle = '#b8c6de'; ctx.font = '600 26px ' + FONT; ctx.fillText(e.nombre, x + 58, y + 55);
      // número
      var pop = hit ? 1 + 0.1 * Math.exp(-edad * 4) * Math.min(1, edad * 12) : 1;
      ctx.save(); ctx.globalAlpha = 1 - 0.65 * dim;
      ctx.translate(x + 32, y + 168); ctx.scale(pop, pop);
      ctx.fillStyle = '#f4f7fc'; ctx.font = '800 92px ' + FONT; ctx.fillText(String(n), 0, 0);
      ctx.restore();
      ctx.fillStyle = '#7087ad'; ctx.font = '500 22px ' + FONT; ctx.fillText('equipos', x + 34, y + 212);
      if (hit && edad < 1.6) {
        ctx.save(); ctx.globalAlpha = (1 - smooth(0.6, 1.6, edad)) * Math.min(1, edad * 6);
        ctx.fillStyle = e.color; ctx.font = '700 30px ' + FONT; ctx.textAlign = 'right';
        ctx.fillText('+1', x + TILE.w - 28, y + 168 - 18 * easeOutCubic(Math.min(1, edad / 0.8)));
        ctx.restore();
      }
    }

    // panel de tendencia
    ctx.save(); rr(ctx, 60, 410, PW - 120, 540, 22); ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fill(); ctx.restore();
    ctx.textAlign = 'left'; ctx.fillStyle = '#e6edf8'; ctx.font = '700 30px ' + FONT; ctx.fillText('Tendencia de vibración', 96, 470);
    ctx.textAlign = 'right'; ctx.fillStyle = '#7087ad'; ctx.font = '500 22px ' + FONT; ctx.fillText('mm/s · últimos 30 días', PW - 96, 468);
    function yv(v) { return CH.y + CH.h - (v / CH.max) * CH.h; }
    ctx.font = '500 20px ' + FONT; ctx.textAlign = 'right';
    for (var gv = 0; gv <= 12; gv += 4) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(CH.x, yv(gv), CH.w, 1.5);
      ctx.fillStyle = '#5d7299'; ctx.fillText(String(gv), CH.x - 16, yv(gv) + 7);
    }
    [[UMBRAL_PREC, '#fc9f01', 'Precaución'], [UMBRAL_ALAR, '#ef4444', 'Alarma']].forEach(function (u) {
      ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = hexA(u[1], 0.55); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(CH.x, yv(u[0])); ctx.lineTo(CH.x + CH.w, yv(u[0])); ctx.stroke(); ctx.restore();
      ctx.fillStyle = hexA(u[1], 0.9); ctx.font = '600 20px ' + FONT; ctx.textAlign = 'right';
      ctx.fillText(u[2], CH.x + CH.w, yv(u[0]) - 10);
    });
    var prog = animado ? easeInOutCubic(clamp((t - 0.3) / 5.4, 0, 1)) : 1;
    var alfa = 1 - dim;
    if (prog > 0.002 && alfa > 0.01) {
      var N = 140, M = Math.max(2, Math.round(N * prog)), pts = [];
      for (var j = 0; j <= M; j++) { var xx = (j / N); pts.push([CH.x + xx * CH.w, yv(dato(xx))]); }
      var last = pts[pts.length - 1];
      ctx.save(); ctx.globalAlpha = alfa;
      var fg = ctx.createLinearGradient(0, CH.y, 0, CH.y + CH.h);
      fg.addColorStop(0, 'rgba(255,195,77,0.22)'); fg.addColorStop(1, 'rgba(255,195,77,0)');
      ctx.beginPath(); ctx.moveTo(pts[0][0], CH.y + CH.h);
      pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
      ctx.lineTo(last[0], CH.y + CH.h); ctx.closePath(); ctx.fillStyle = fg; ctx.fill();
      ctx.beginPath(); pts.forEach(function (p, k) { k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
      ctx.strokeStyle = GOLD; ctx.lineWidth = 4.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(255,195,77,0.6)'; ctx.shadowBlur = 14; ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,195,77,0.22)'; ctx.beginPath(); ctx.arc(last[0], last[1], 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.arc(last[0], last[1], 7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    pantTex.needsUpdate = true;
  }

  // ---------- tarjetas de medición ----------
  function icono(ctx, tipo, cx, cy, color) {
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (tipo === 'temp') {
      rr(ctx, cx - 10, cy - 36, 20, 50, 10); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy + 22, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx - 3, cy - 12, 6, 30);
      ctx.lineWidth = 4; [-24, -12].forEach(function (d) { ctx.beginPath(); ctx.moveTo(cx + 20, cy + d); ctx.lineTo(cx + 30, cy + d); ctx.stroke(); });
    } else if (tipo === 'vib') {
      var a = [0, -12, 22, -32, 32, -22, 12, 0];
      ctx.beginPath(); a.forEach(function (v, i) { var x = cx - 35 + i * 10; i ? ctx.lineTo(x, cy + v) : ctx.moveTo(x, cy + v); }); ctx.stroke();
    } else {
      ctx.lineWidth = 5; ctx.beginPath();
      for (var i = 0; i <= 80; i++) {
        var u = i / 80, x = cx - 38 + u * 76, env = Math.exp(-Math.pow((u - 0.5) / 0.22, 2));
        var y = cy + Math.sin(u * Math.PI * 14) * 30 * env; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  var CW = 640, CHh = 250;
  var tarjetas = MEDICIONES.map(function (m, i) {
    var c = lienzo(CW, CHh), tex = texturaDe(c); tex.anisotropy = aniso;
    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.36), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    mesh.name = 'medicion_' + (i + 1); mesh.renderOrder = 10; mesh.visible = false; scene.add(mesh);
    return { m: m, c: c, tex: tex, mesh: mesh, ini: new THREE.Vector3(), ctl: new THREE.Vector3(), fin: new THREE.Vector3() };
  });
  function pintarTarjeta(tj) {
    var ctx = tj.c.getContext('2d'), m = tj.m, col = ESTADOS[m.estado].color;
    ctx.clearRect(0, 0, CW, CHh);
    rr(ctx, 14, 14, CW - 28, CHh - 28, 40);
    ctx.fillStyle = 'rgba(12,24,50,0.94)'; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,195,77,0.35)'; ctx.stroke();
    ctx.fillStyle = hexA(col, 0.14); ctx.beginPath(); ctx.arc(110, 125, 60, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = hexA(col, 0.6); ctx.stroke();
    icono(ctx, m.icono, 110, 125, col);
    ctx.textAlign = 'left'; ctx.fillStyle = '#9fb2d3'; ctx.font = '600 34px ' + FONT; ctx.fillText(m.titulo, 200, 108);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 56px ' + FONT; ctx.fillText(m.valor, 200, 172);
    tj.tex.needsUpdate = true;
  }

  // etiqueta final
  var LW = 960, LH = 220;
  var labC = lienzo(LW, LH), labTex = texturaDe(labC); labTex.anisotropy = aniso;
  var etiqueta = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.55 * LH / LW),
    new THREE.MeshBasicMaterial({ map: labTex, transparent: true, depthWrite: false, toneMapped: false }));
  etiqueta.name = 'recomendacion'; etiqueta.renderOrder = 11; etiqueta.visible = false; scene.add(etiqueta);
  var ETQ_LOCAL = new THREE.Vector3(1.02, 1.22, 0.5);
  function pintarEtiqueta() {
    var ctx = labC.getContext('2d'); ctx.clearRect(0, 0, LW, LH);
    ctx.save(); rr(ctx, 30, 40, LW - 60, LH - 80, (LH - 80) / 2);
    ctx.shadowColor = 'rgba(255,195,77,0.45)'; ctx.shadowBlur = 30;
    ctx.fillStyle = 'rgba(13,26,56,0.96)'; ctx.fill(); ctx.shadowBlur = 0;
    ctx.lineWidth = 3; ctx.strokeStyle = GOLD; ctx.stroke(); ctx.restore();
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(120, LH / 2, 38, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0d1a38'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(102, LH / 2 + 1); ctx.lineTo(116, LH / 2 + 15); ctx.lineTo(140, LH / 2 - 12); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = '700 58px ' + FONT; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('Recomendación lista', 190, LH / 2 + 3);
    labTex.needsUpdate = true;
  }
  function pintarEstaticos() { tarjetas.forEach(pintarTarjeta); pintarEtiqueta(); }
  pintarEstaticos();

  // ---------- ajuste al contenedor ----------
  var FOV = 30, HALF_W = 2.25, HALF_H = 1.85, sideX = 3;
  function ajustar() {
    var w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    var asp = w / h, tn = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    var dist = Math.max(HALF_H / tn, HALF_W / (tn * asp));
    camera.aspect = asp; camera.position.set(0, CENTRO_Y, dist); camera.lookAt(0, CENTRO_Y, 0); camera.updateProjectionMatrix();
    var visX = tn * (dist - 1.0) * asp;
    sideX = clamp(visX * 0.92 - 0.46, 1.9, 3.4);
    if (!corriendo) render(tiempo);
  }

  // ---------- interacción ----------
  var tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  function onMove(e) {
    var rc = container.getBoundingClientRect();
    if (!rc.width) return;
    tgt.x = clamp(((e.clientX - rc.left) / rc.width - 0.5) * 2, -1, 1);
    tgt.y = clamp(((e.clientY - rc.top) / rc.height - 0.5) * 2, -1, 1);
  }
  function onLeave() { tgt.x = 0; tgt.y = 0; }
  if (!reducido && opciones.inclinacion !== false) {
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
  }

  // ---------- render ----------
  var v3 = new THREE.Vector3();
  function render(total) {
    var t = reducido ? 6.9 : (total % DUR) * 8 / DUR;
    var animado = !reducido;
    conjunto.rotation.set(BASE_RX + cur.y * 0.07, BASE_RY + cur.x * 0.14, 0);
    var bob = animado ? Math.sin(t / 8 * Math.PI * 2) * 0.045 : 0;
    conjunto.position.y = bob;
    sombra.scale.set(1 - bob * 1.5, 1, 1);
    sombra.material.opacity = 0.9 - bob * 3;

    var pulsoAnillo = 0;
    INICIOS.forEach(function (s) { var a = t - (s + VUELO); if (a >= 0) pulsoAnillo += Math.exp(-a * 2.2); });
    anillos.forEach(function (a) {
      a.rotation.z = a.userData.rot + (animado ? total * a.userData.vel : 0);
      a.material.opacity = a.userData.op * (1 + 0.6 * Math.min(1, pulsoAnillo));
    });
    conjunto.updateMatrixWorld(true);

    tarjetas.forEach(function (tj, i) {
      var p = (t - INICIOS[i]) / VUELO;
      if (!animado || p < 0 || p > 1) { tj.mesh.visible = false; return; }
      var m = tj.m, c = tileCentro(m.estado);
      tj.fin.set((c.x / PW - 0.5) * SW, (0.5 - c.y / PH) * SH, 0.03); pantalla.localToWorld(tj.fin);
      tj.ini.set(m.lado * sideX, m.y + CENTRO_Y, 1.0);
      tj.ctl.set(m.lado * sideX * 0.5, m.y * 0.35 + 0.6, 1.6);
      var u = easeInOutCubic(p), a = 1 - u;
      v3.set(0, 0, 0).addScaledVector(tj.ini, a * a).addScaledVector(tj.ctl, 2 * a * u).addScaledVector(tj.fin, u * u);
      tj.mesh.position.copy(v3);
      tj.mesh.quaternion.copy(camera.quaternion);
      tj.mesh.rotateZ(Math.sin(p * Math.PI) * 0.05 * m.lado);
      var s = (0.86 + 0.14 * smooth(0, 0.25, p)) * (1 - 0.72 * Math.pow(smooth(0.5, 1, p), 2));
      tj.mesh.scale.setScalar(s);
      tj.mesh.material.opacity = smooth(0, 0.12, p) * (1 - smooth(0.84, 1, p));
      tj.mesh.visible = true;
    });

    var la = animado ? smooth(T_LABEL, T_LABEL + 0.7, t) * (1 - smooth(7.25, 7.8, t)) : 1;
    etiqueta.visible = la > 0.001;
    if (etiqueta.visible) {
      var k = animado ? easeOutCubic(clamp((t - T_LABEL) / 0.9, 0, 1)) : 1;
      v3.copy(ETQ_LOCAL); v3.y += -0.12 * (1 - k) + (animado ? Math.sin(t * 2.2) * 0.012 : 0);
      conjunto.localToWorld(v3); etiqueta.position.copy(v3);
      etiqueta.quaternion.copy(camera.quaternion);
      etiqueta.scale.setScalar(0.92 + 0.08 * k);
      etiqueta.material.opacity = la;
    }

    dibujarPantalla(t, animado);
    renderer.render(scene, camera);
  }

  // ---------- ciclo y visibilidad ----------
  var raf = 0, corriendo = false, tiempo = 0, previo = 0, enVista = true;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - previo) / 1000); previo = now;
    tiempo += dt;
    var k = 1 - Math.exp(-dt * 3.5);
    cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k;
    render(tiempo);
  }
  function actualizarCiclo() {
    var debe = !reducido && enVista && !document.hidden;
    if (debe && !corriendo) { corriendo = true; previo = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!debe && corriendo) { corriendo = false; cancelAnimationFrame(raf); }
  }
  var io = new IntersectionObserver(function (en) { enVista = en[0].isIntersecting; actualizarCiclo(); }, { threshold: 0 });
  io.observe(container);
  document.addEventListener('visibilitychange', actualizarCiclo);
  var ro = new ResizeObserver(ajustar); ro.observe(container);
  function onMQ(e) {
    if (opciones.reducirMovimiento != null) return;
    reducido = e.matches; actualizarCiclo(); if (reducido) render(tiempo);
  }
  if (mq) (mq.addEventListener ? mq.addEventListener('change', onMQ) : mq.addListener(onMQ));

  var vivo = true;
  if (document.fonts && document.fonts.load) {
    Promise.all(['500', '600', '700', '800'].map(function (w) { return document.fonts.load(w + ' 40px Manrope'); }))
      .then(function () { if (!vivo) return; pintarEstaticos(); if (!corriendo) render(tiempo); }).catch(function () {});
  }
  ajustar();
  render(tiempo);
  actualizarCiclo();

  // ---------- limpieza ----------
  return function limpiar() {
    vivo = false; corriendo = false; cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    document.removeEventListener('visibilitychange', actualizarCiclo);
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    if (mq) (mq.removeEventListener ? mq.removeEventListener('change', onMQ) : mq.removeListener(onMQ));
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) [].concat(o.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
    });
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
    if (cv.parentNode) cv.parentNode.removeChild(cv);
  };
}

