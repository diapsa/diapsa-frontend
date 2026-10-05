/**
 * Gemelo digital de las landings por industria (2026-10-04).
 * Emiliano pidió el mismo gemelo de la central de energía para las otras
 * siete industrias. Este archivo generaliza lib/escena-gemelo-energia.js:
 * el motor (plataforma, cámara, pasos, ruta, sensores, indicadores) es el
 * mismo y cada industria aporta su planta en PLANTAS[slug], armada con un
 * vocabulario de piezas (tanque, bomba, compresor, columna, molino, horno,
 * prensa, clarificador, etc.). Bucle de 22 s en cuatro pasos:
 *   1. Criticidad: cada equipo se pinta A (rojo), B (ámbar) o C (azul).
 *   2. Técnicas recomendadas: iconos sobre cada equipo.
 *   3. Rutas y sensores: la ruta recorre los equipos B y C y los A quedan
 *      con sensores que laten.
 *   4. Indicadores de confiabilidad: mejoran y la planta pasa a verde.
 * Recibe THREE (r128), el contenedor y opciones ({ planta, fuente,
 * reducirMovimiento }) y devuelve la limpieza. Cifras de ejemplo.
 */
/* eslint-disable */
var CSS = [
  '.ge-raiz{position:relative;width:100%;height:100%;overflow:hidden;color:#e8f1ff;-webkit-font-smoothing:antialiased;touch-action:pan-y;}',
  '.ge-raiz canvas{position:absolute;inset:0;width:100%;height:100%;display:block;}',
  '.ge-raiz canvas{-webkit-mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);}',
  '.ge-ov{position:absolute;inset:0;pointer-events:none;}',
  '.ge-abs{position:absolute;left:0;top:0;will-change:transform,opacity;opacity:0;}',
  '.ge-pasos{position:absolute;left:24px;top:22px;display:flex;gap:8px;flex-wrap:wrap;max-width:calc(100% - 48px);}',
  '.ge-paso{display:flex;align-items:center;gap:8px;padding:7px 13px 7px 8px;border-radius:999px;background:rgba(13,26,56,.72);border:1px solid rgba(92,200,255,.25);color:#8fa9cc;font-size:13px;font-weight:700;white-space:nowrap;transition:all .35s;}',
  '.ge-paso b{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:rgba(92,200,255,.18);color:#bfe9ff;font-size:12px;font-weight:800;transition:all .35s;}',
  '.ge-paso.on{background:#ffc34d;border-color:#ffc34d;color:#0d1a38;}',
  '.ge-paso.on b{background:#0d1a38;color:#ffc34d;}',
  '.ge-paso.hecho b{background:#22c55e;color:#0d1a38;}',
  '.ge-mk{width:0;height:0;}',
  '.ge-letra{position:absolute;left:-15px;top:-15px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:15px;font-weight:800;color:#0d1a38;box-shadow:0 0 0 3px rgba(13,26,56,.85),0 0 16px var(--c);background:var(--c);}',
  '.ge-tec{position:absolute;left:0;top:0;transform:translate(-50%,-50%);display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(13,26,56,.85);border:1px solid rgba(92,200,255,.45);}',
  '.ge-tec i{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#16324f;}',
  '.ge-tec svg{width:16px;height:16px;fill:none;stroke:#5cc8ff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
  '.ge-kpi{right:22px;top:50%;width:286px;box-sizing:border-box;padding:16px 18px;border-radius:14px;background:rgba(13,26,56,.9);border:1px solid rgba(92,200,255,.4);box-shadow:0 18px 40px rgba(0,0,0,.35);backdrop-filter:blur(6px);left:auto;}',
  '.ge-kpi h4{margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#bfe9ff;}',
  '.ge-fila{display:flex;align-items:baseline;justify-content:space-between;padding:9px 0;border-top:1px solid rgba(92,200,255,.14);}',
  '.ge-fila span{font-size:13px;color:#a9bfdc;}',
  '.ge-fila b{font-size:22px;font-weight:800;color:#fff;font-variant-numeric:tabular-nums;}',
  '.ge-fila small{margin-left:6px;font-size:13px;font-weight:800;color:#22c55e;}',
  '.narrow .ge-pasos{left:10px;top:10px;gap:5px;max-width:calc(100% - 20px);}',
  '.narrow .ge-paso{font-size:0;padding:4px;gap:0;}',
  '.narrow .ge-paso.on{font-size:12px;padding:4px 10px 4px 4px;gap:6px;}',
  '.narrow .ge-kpi{left:10px;right:10px;top:auto;bottom:10px;width:auto;padding:10px 14px;display:grid;grid-template-columns:1fr 1fr;column-gap:16px;}',
  '.narrow .ge-kpi h4{grid-column:1/-1;margin-bottom:4px;}',
  '.narrow .ge-fila{padding:5px 0;flex-direction:column;align-items:flex-start;gap:1px;}',
  '.narrow .ge-fila span{font-size:11.5px;}',
  '.narrow .ge-fila b{font-size:17px;}',
  '.narrow .ge-tec i{width:20px;height:20px;}',
  '.narrow .ge-tec svg{width:12px;height:12px;}',
  '.narrow .ge-letra{width:22px;height:22px;left:-11px;top:-11px;font-size:12px;}'
].join('\n');

// Iconos de las técnicas (trazos simples, sin texto)
var ICONO = {
  vib: '<svg viewBox="0 0 24 24"><path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5"/></svg>',
  termo: '<svg viewBox="0 0 24 24"><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/></svg>',
  ultra: '<svg viewBox="0 0 24 24"><path d="M8 8a5.5 5.5 0 0 0 0 8M5 5a10 10 0 0 0 0 14M16 8a5.5 5.5 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/><circle cx="12" cy="12" r="1.5"/></svg>',
  aceite: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
  gas: '<svg viewBox="0 0 24 24"><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-6 1-9z"/></svg>'
};

var PASOS = ['Criticidad', 'Técnicas recomendadas', 'Rutas y sensores', 'Indicadores de confiabilidad'];

/* ------------------------------------------------------------------ */
/* Las plantas. Cada una recibe el constructor P y devuelve equipos,    */
/* ruta, sensores, piezas que giran y el título de los indicadores.      */
/* Plataforma de 18.4 x 12.4: x de -9.2 a 9.2, z de -6.2 a 6.2.          */
/* ------------------------------------------------------------------ */
var PLANTAS = {};

PLANTAS['generacion-de-energia'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  function gasUnit(n, z) {
    part('tg' + n + '_patin', box(4.2, 0.35, 1.6), 'dark', -5.6, 0.175, z, null, 'A');
    part('tg' + n + '_filtro', box(1.3, 2.0, 1.8), 'light', -8.2, 1.0, z, null, 'A');
    part('tg' + n + '_turbina', cyl(0.6, 0.6, 3.4, 16), 'body', -5.6, 1.0, z, [0, 0, H], 'A');
    part('tg' + n + '_difusor', cyl(0.85, 0.6, 0.8, 16), 'light', -3.5, 1.0, z, [0, 0, -H], 'A');
    part('hrsg' + n, box(3.0, 2.6, 1.7), 'body', -1.6, 1.3, z, null, 'B');
    part('hrsg' + n + '_domo', cyl(0.22, 0.22, 1.6, 16), 'light', -1.6, 2.82, z, [H, 0, 0], 'B');
    part('chimenea' + n, cyl(0.34, 0.42, 5.6, 24), 'light', 0.55, 2.8, z, null, 'C');
    part('chimenea' + n + '_anillo', new T.TorusGeometry(0.4, 0.07, 8, 32), 'gold', 0.55, 5.0, z, [H, 0, 0], 'C');
  }
  gasUnit(1, -3.8); gasUnit(2, -1.2);
  part('vapor_alta', cyl(0.12, 0.12, 3.4, 12), 'light', 1.2, 2.2, -2.5, [H, 0, 0], 'B');
  part('vapor_baja', cyl(0.12, 0.12, 3.4, 12), 'dark', 1.2, 0.6, -2.5, [H, 0, 0], 'B');
  P.nave(3.3, -2.5, 3.8, 2.6, 3.6, 'A');
  P.torreEnfriamiento(4.6, 2.9, [2.5, 4.6, 6.7], 'B');
  ['A', 'B', 'C'].forEach(function (id, i) { P.bomba('bomba' + id, -5.2 + i * 1.6, 3.2, 'A'); });
  part('cabezal', cyl(0.13, 0.13, 4.6, 12), 'light', -3.6, 1.4, 3.2, [0, 0, H], 'A');
  P.tanque('tanque1', -7.4, 1.8, 0.85, 2.4, 'C'); P.tanque('tanque2', -7.4, 4.3, 0.7, 1.8, 'C');
  [-4.3, -2.9, -1.5].forEach(function (z, i) { P.transformador('trafo' + (i + 1), 7.1, z, 'A'); });
  P.portico(8.7, -2.9, 'C');
  return {
    kpi: 'Confiabilidad de la central',
    equipos: [
      { pos: [-5.6, 2.1, -2.5], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [-1.6, 3.5, -2.5], clase: 'B', tec: ['termo', 'ultra'] },
      { pos: [3.3, 3.8, -2.5], clase: 'A', tec: ['vib', 'aceite'] },
      { pos: [7.1, 1.7, -2.9], clase: 'A', tec: ['aceite', 'termo', 'ultra'] },
      { pos: [4.6, 2.5, 2.9], clase: 'B', tec: ['vib', 'aceite'] },
      { pos: [-3.6, 1.9, 3.2], clase: 'A', tec: ['vib', 'ultra'] },
      { pos: [-7.4, 3.2, 3.0], clase: 'C', tec: ['ultra'] },
      { pos: [8.7, 3.3, -2.9], clase: 'C', tec: ['termo'] }
    ],
    ruta: [[-7.4, 5.4], [-7.4, 0.4], [-1.6, 0.2], [0.6, 1.2], [2.0, 4.6], [7.2, 4.6], [8.2, 0.6], [8.2, -5.4]],
    sensores: [[-5.6, 1.65, -3.8], [-5.6, 1.65, -1.2], [3.3, 2.75, -1.2], [-5.2, 0.85, 3.6], [-3.6, 0.85, 3.6], [-2.0, 0.85, 3.6], [7.1, 1.15, -4.3], [7.1, 1.15, -2.9], [7.1, 1.15, -1.5]]
  };
};

PLANTAS['petroleo-y-gas'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Dos patines de compresión con motor y compresor reciprocante
  [-4.2, -1.6].forEach(function (z, i) {
    var n = 'comp' + (i + 1);
    part(n + '_patin', box(4.6, 0.3, 1.7), 'dark', -5.6, 0.15, z, null, 'A');
    part(n + '_motor', cyl(0.62, 0.62, 2.0, 16), 'light', -6.8, 0.95, z, [0, 0, H], 'A');
    part(n + '_cuerpo', box(1.8, 1.2, 1.3), 'body', -4.4, 0.9, z, null, 'A');
    part(n + '_cil1', cyl(0.3, 0.3, 1.0, 12), 'light', -4.8, 0.9, z - 1.1, [H, 0, 0], 'A');
    part(n + '_cil2', cyl(0.3, 0.3, 1.0, 12), 'light', -4.0, 0.9, z + 1.1, [H, 0, 0], 'A');
    part(n + '_botella', cyl(0.3, 0.3, 1.9, 14), 'dark', -4.4, 1.85, z, [0, 0, H], 'A');
  });
  // Separadores verticales y enfriador
  [-7.6, -6.4].forEach(function (x, i) { part('separador' + (i + 1), cyl(0.5, 0.5, 2.8, 18), 'body', x, 1.4, 1.4, null, 'B'); part('separador' + (i + 1) + '_tapa', new T.SphereGeometry(0.5, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'light', x, 2.8, 1.4, null, 'B'); });
  part('enfriador', box(3.2, 0.9, 1.6), 'body', -3.2, 1.6, 1.6, null, 'B');
  [-4.0, -3.2, -2.4].forEach(function (x, i) { part('enfriador_vent' + (i + 1), cyl(0.36, 0.34, 0.25, 16, true), 'light', x, 2.15, 1.6, null, 'B', { double: true }); });
  part('enfriador_patas', box(3.0, 1.1, 0.12), 'dark', -3.2, 0.55, 1.6, null, 'B');
  // Patín de regulación y medición (cabezal con válvulas)
  part('regulacion_base', box(3.6, 0.2, 1.4), 'dark', 1.8, 0.1, 3.6, null, 'B');
  part('regulacion_cabezal', cyl(0.16, 0.16, 3.4, 12), 'light', 1.8, 0.7, 3.6, [0, 0, H], 'B');
  [0.6, 1.8, 3.0].forEach(function (x, i) { part('valvula' + (i + 1), box(0.34, 0.5, 0.34), 'body', x, 1.05, 3.6, null, 'B'); part('valvula' + (i + 1) + '_volante', new T.TorusGeometry(0.2, 0.04, 8, 20), 'gold', x, 1.45, 3.6, [H, 0, 0], 'B'); });
  // Ducto que sale de la planta, sobre soportes, con marcadores del derecho de vía
  part('ducto', cyl(0.22, 0.22, 7.8, 14), 'light', 5.2, 0.6, 4.4, [0, 0, H], 'C');
  [2.2, 4.2, 6.2, 8.2].forEach(function (x, i) { part('ducto_soporte' + (i + 1), box(0.2, 0.5, 0.5), 'dark', x, 0.25, 4.4, null, 'C'); });
  [3.4, 7.0].forEach(function (x, i) { part('ducto_marcador' + (i + 1), box(0.12, 1.3, 0.12), 'gold', x, 0.65, 5.5, null, 'C'); });
  // Quemador de campo
  part('quemador', cyl(0.14, 0.2, 6.0, 12), 'light', 7.8, 3.0, -4.6, null, 'C');
  part('quemador_punta', cyl(0.3, 0.14, 0.5, 12), 'gold', 7.8, 6.25, -4.6, null, 'C');
  part('quemador_tirante1', cyl(0.03, 0.03, 5.2, 6), 'dark', 7.1, 2.5, -4.6, [0, 0, 0.26], 'C');
  part('quemador_tirante2', cyl(0.03, 0.03, 5.2, 6), 'dark', 8.5, 2.5, -4.6, [0, 0, -0.26], 'C');
  // Tanques de almacenamiento
  P.tanque('tanque1', 3.0, -3.6, 1.3, 1.6, 'C'); P.tanque('tanque2', 5.6, -1.6, 1.0, 1.4, 'C');
  // Cuarto eléctrico y transformador
  P.cuartoElectrico(1.4, -0.4, 'A');
  P.transformador('trafo', 4.6, 1.2, 'A');
  return {
    kpi: 'Confiabilidad de la estación',
    equipos: [
      { pos: [-5.6, 2.9, -4.2], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [-5.6, 2.9, -1.6], clase: 'A', tec: ['vib', 'aceite', 'ultra'] },
      { pos: [-7.0, 3.6, 1.4], clase: 'B', tec: ['termo', 'ultra'] },
      { pos: [-3.2, 2.9, 1.6], clase: 'B', tec: ['vib', 'termo'] },
      { pos: [1.8, 2.2, 3.6], clase: 'B', tec: ['gas', 'ultra'] },
      { pos: [5.2, 1.6, 4.4], clase: 'C', tec: ['gas'] },
      { pos: [1.4, 3.1, -0.4], clase: 'A', tec: ['termo', 'ultra'] },
      { pos: [3.0, 2.6, -3.6], clase: 'C', tec: ['termo'] }
    ],
    ruta: [[-8.2, 5.4], [-8.2, 3.0], [-5.6, 0.0], [-1.4, 0.2], [-0.4, 2.6], [1.8, 5.4], [6.0, 5.6], [8.6, 2.6], [8.6, -2.4], [6.0, -3.0]],
    sensores: [[-6.8, 1.6, -4.2], [-4.4, 1.55, -4.2], [-6.8, 1.6, -1.6], [-4.4, 1.55, -1.6], [1.4, 2.4, -0.4], [4.6, 1.15, 1.2]]
  };
};

PLANTAS['petroquimica'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Dos columnas de destilación con plataformas
  [[-7.2, -3.6, 6.4, 0.7], [-4.8, -3.6, 5.2, 0.6]].forEach(function (c, i) {
    var n = 'columna' + (i + 1);
    part(n, cyl(c[3], c[3], c[2], 20), 'body', c[0], c[2] / 2, c[1], null, 'B');
    part(n + '_domo', new T.SphereGeometry(c[3], 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'light', c[0], c[2], c[1], null, 'B');
    [0.33, 0.66].forEach(function (f, k) { part(n + '_plataforma' + (k + 1), new T.TorusGeometry(c[3] + 0.25, 0.05, 6, 24), 'dark', c[0], c[2] * f, c[1], [H, 0, 0], 'B'); });
  });
  part('columnas_tuberia', cyl(0.1, 0.1, 2.4, 10), 'light', -6.0, 4.6, -3.6, [0, 0, H], 'B');
  // Reactor con agitador
  part('reactor', cyl(1.0, 1.0, 2.2, 20), 'body', -1.6, 1.4, -3.4, null, 'A');
  part('reactor_fondo', new T.SphereGeometry(1.0, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), 'light', -1.6, 0.3, -3.4, null, 'A');
  part('reactor_patas', box(2.2, 0.3, 0.18), 'dark', -1.6, 0.15, -3.4, null, 'A');
  part('reactor_motor', cyl(0.32, 0.32, 0.8, 14), 'light', -1.6, 2.9, -3.4, null, 'A');
  part('reactor_reductor', box(0.7, 0.4, 0.7), 'dark', -1.6, 2.7, -3.4, null, 'A');
  // Intercambiadores horizontales en rack
  [[1.6, -4.2], [1.6, -2.8]].forEach(function (p, i) { part('intercambiador' + (i + 1), cyl(0.42, 0.42, 3.2, 16), 'light', p[0], 1.1, p[1], [0, 0, H], 'B'); part('intercambiador' + (i + 1) + '_silla1', box(0.3, 0.9, 1.0), 'dark', p[0] - 1.0, 0.45, p[1], null, 'B'); part('intercambiador' + (i + 1) + '_silla2', box(0.3, 0.9, 1.0), 'dark', p[0] + 1.0, 0.45, p[1], null, 'B'); });
  // Compresor de gas de proceso en caseta abierta
  part('compresor_patin', box(3.2, 0.3, 1.6), 'dark', 5.6, 0.15, -3.6, null, 'A');
  part('compresor_motor', cyl(0.55, 0.55, 1.5, 16), 'light', 4.8, 0.85, -3.6, [0, 0, H], 'A');
  part('compresor_cuerpo', cyl(0.5, 0.65, 1.3, 16), 'body', 6.4, 0.85, -3.6, [0, 0, H], 'A');
  part('compresor_techo', box(3.8, 0.12, 2.2), 'light', 5.6, 2.6, -3.6, null, 'A');
  [[3.9, -4.6], [7.3, -4.6], [3.9, -2.6], [7.3, -2.6]].forEach(function (p, i) { part('compresor_poste' + (i + 1), box(0.12, 2.6, 0.12), 'dark', p[0], 1.3, p[1], null, 'A'); });
  // Fila de bombas de proceso
  [-6.4, -4.8, -3.2, -1.6].forEach(function (x, i) { P.bomba('bomba' + (i + 1), x, 1.2, 'A'); });
  part('bombas_cabezal', cyl(0.13, 0.13, 6.0, 12), 'light', -4.0, 1.4, 1.2, [0, 0, H], 'A');
  // Rack de tuberías cruzando la planta
  part('rack_tubo1', cyl(0.1, 0.1, 12.0, 10), 'light', 0.0, 2.3, 0.0, [0, 0, H], 'C');
  part('rack_tubo2', cyl(0.1, 0.1, 12.0, 10), 'dark', 0.0, 2.6, 0.3, [0, 0, H], 'C');
  [-5.0, -1.0, 3.0].forEach(function (x, i) { part('rack_poste' + (i + 1), box(0.12, 2.8, 0.12), 'dark', x, 1.4, -0.3, null, 'C'); part('rack_viga' + (i + 1), box(0.12, 0.12, 1.0), 'dark', x, 2.8, 0.15, null, 'C'); });
  // Torre de enfriamiento y servicios
  P.torreEnfriamiento(4.6, 3.4, [3.2, 4.6, 6.0], 'B');
  part('trampa_vapor', cyl(0.12, 0.12, 4.0, 10), 'light', -4.0, 0.5, 4.4, [0, 0, H], 'C');
  [-5.4, -4.0, -2.6].forEach(function (x, i) { part('trampa' + (i + 1), box(0.3, 0.3, 0.3), 'gold', x, 0.5, 4.4, null, 'C'); });
  P.cuartoElectrico(7.4, 0.6, 'A');
  return {
    kpi: 'Confiabilidad de la planta',
    equipos: [
      { pos: [-6.0, 7.2, -3.6], clase: 'B', tec: ['termo', 'ultra'] },
      { pos: [-1.6, 3.8, -3.4], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [1.6, 2.3, -3.5], clase: 'B', tec: ['termo'] },
      { pos: [5.6, 3.4, -3.6], clase: 'A', tec: ['vib', 'aceite', 'ultra'] },
      { pos: [-4.0, 2.2, 1.2], clase: 'A', tec: ['vib', 'ultra'] },
      { pos: [4.6, 2.6, 3.4], clase: 'B', tec: ['vib', 'aceite'] },
      { pos: [-4.0, 1.4, 4.4], clase: 'C', tec: ['ultra'] },
      { pos: [7.4, 3.1, 0.6], clase: 'A', tec: ['termo', 'ultra'] }
    ],
    ruta: [[-8.4, 5.4], [-8.4, -1.0], [-3.0, -1.4], [0.0, -1.6], [3.0, -1.0], [2.0, 2.0], [1.6, 5.4], [7.6, 5.4], [8.6, 2.4], [8.6, -1.2]],
    sensores: [[-1.6, 3.4, -3.4], [4.8, 1.45, -3.6], [6.4, 1.45, -3.6], [-6.4, 0.85, 1.6], [-4.8, 0.85, 1.6], [-3.2, 0.85, 1.6], [-1.6, 0.85, 1.6], [7.4, 2.4, 0.6]]
  };
};

PLANTAS['alimentos-y-bebidas'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Nave de producción abierta con la línea de envasado
  part('nave_piso', box(9.4, 0.12, 4.6), 'dark', -3.6, 0.06, -3.2, null, 'B');
  [[-8.2, -5.4], [0.8, -5.4], [-8.2, -1.0], [0.8, -1.0]].forEach(function (p, i) { part('nave_poste' + (i + 1), box(0.14, 3.2, 0.14), 'light', p[0], 1.6, p[1], null, 'B'); });
  part('nave_techo', box(9.6, 0.12, 4.8), 'light', -3.6, 3.2, -3.2, null, 'B');
  part('banda', box(8.0, 0.2, 0.7), 'light', -3.8, 0.9, -3.2, null, 'B');
  [-7.0, -4.6, -2.2, 0.2].forEach(function (x, i) { part('banda_pata' + (i + 1), box(0.1, 0.8, 0.5), 'dark', x, 0.4, -3.2, null, 'B'); });
  // Tres máquinas de la línea: llenadora, etiquetadora, empacadora
  part('llenadora', box(1.6, 1.4, 1.4), 'body', -6.4, 1.6, -3.2, null, 'A');
  part('llenadora_torreta', cyl(0.5, 0.5, 0.5, 16), 'light', -6.4, 2.55, -3.2, null, 'A');
  part('etiquetadora', box(1.2, 1.1, 1.0), 'body', -3.6, 1.45, -3.2, null, 'B');
  part('empacadora', box(1.8, 1.3, 1.5), 'body', -0.6, 1.55, -3.2, null, 'B');
  part('empacadora_motor', cyl(0.26, 0.26, 0.6, 12), 'light', -0.6, 0.5, -4.4, [0, 0, H], 'B');
  // Silos de materia prima
  [-7.8, -6.3].forEach(function (x, i) { part('silo' + (i + 1), cyl(0.6, 0.6, 2.6, 18), 'body', x, 2.1, 2.0, null, 'C'); part('silo' + (i + 1) + '_cono', new T.ConeGeometry(0.6, 0.8, 18), 'light', x, 0.8, 2.0, [Math.PI, 0, 0], 'C'); part('silo' + (i + 1) + '_tapa', new T.ConeGeometry(0.6, 0.3, 18), 'light', x, 3.55, 2.0, null, 'C'); [0, 1, 2].forEach(function (k) { part('silo' + (i + 1) + '_pata' + k, box(0.08, 1.0, 0.08), 'dark', x + Math.cos(k * 2.1) * 0.5, 0.5, 2.0 + Math.sin(k * 2.1) * 0.5, null, 'C'); }); });
  // Cuarto de máquinas de refrigeración: dos compresores de amoniaco y condensador
  part('frio_piso', box(4.4, 0.2, 2.6), 'dark', -3.2, 0.1, 4.0, null, 'A');
  [-4.2, -2.2].forEach(function (x, i) { part('amoniaco' + (i + 1) + '_motor', cyl(0.4, 0.4, 1.1, 14), 'light', x - 0.5, 0.65, 4.0, [0, 0, H], 'A'); part('amoniaco' + (i + 1) + '_cuerpo', box(1.0, 0.8, 0.9), 'body', x + 0.5, 0.6, 4.0, null, 'A'); part('amoniaco' + (i + 1) + '_separador', cyl(0.25, 0.25, 1.1, 12), 'dark', x + 0.5, 1.55, 4.0, [0, 0, H], 'A'); });
  part('condensador', box(2.6, 1.0, 1.4), 'body', 0.6, 2.0, 4.2, null, 'B');
  [0.0, 1.2].forEach(function (x, i) { part('condensador_vent' + (i + 1), cyl(0.46, 0.44, 0.25, 16, true), 'light', x, 2.6, 4.2, null, 'B', { double: true }); });
  [[-0.6, 3.6], [1.8, 3.6], [-0.6, 4.8], [1.8, 4.8]].forEach(function (p, i) { part('condensador_pata' + (i + 1), box(0.1, 1.5, 0.1), 'dark', p[0], 0.75, p[1], null, 'B'); });
  // Caldera con chimenea y compresores de aire
  part('caldera', cyl(0.9, 0.9, 3.0, 18), 'body', 5.4, 1.1, -3.6, [0, 0, H], 'B');
  part('caldera_silla1', box(0.3, 0.7, 1.6), 'dark', 4.4, 0.35, -3.6, null, 'B');
  part('caldera_silla2', box(0.3, 0.7, 1.6), 'dark', 6.4, 0.35, -3.6, null, 'B');
  part('caldera_chimenea', cyl(0.22, 0.26, 4.4, 16), 'light', 6.6, 3.2, -3.6, null, 'C');
  [4.4, 5.6].forEach(function (x, i) { part('aire' + (i + 1), box(1.0, 1.1, 0.9), 'body', x, 0.55, 0.4, null, 'B'); part('aire' + (i + 1) + '_tanque', cyl(0.3, 0.3, 1.2, 12), 'light', x, 1.5, 0.4, null, 'B'); });
  part('aire_linea', cyl(0.08, 0.08, 6.0, 8), 'dark', 3.0, 2.0, 1.4, [0, 0, H], 'C');
  P.cuartoElectrico(7.6, 2.6, 'A');
  P.transformador('trafo', 7.6, 5.0, 'A');
  return {
    kpi: 'Confiabilidad de la planta',
    equipos: [
      { pos: [-6.4, 3.9, -3.2], clase: 'A', tec: ['vib', 'termo'] },
      { pos: [-0.6, 3.7, -3.2], clase: 'B', tec: ['vib', 'termo'] },
      { pos: [-3.2, 2.9, 4.0], clase: 'A', tec: ['vib', 'aceite', 'ultra'] },
      { pos: [0.6, 3.5, 4.2], clase: 'B', tec: ['vib'] },
      { pos: [5.4, 2.6, -3.6], clase: 'B', tec: ['termo', 'ultra'] },
      { pos: [5.0, 2.9, 0.4], clase: 'B', tec: ['ultra', 'aceite'] },
      { pos: [-7.0, 4.3, 2.0], clase: 'C', tec: ['termo'] },
      { pos: [7.6, 3.1, 2.6], clase: 'A', tec: ['termo'] }
    ],
    ruta: [[-8.6, 5.6], [-8.6, 0.4], [-4.0, -0.4], [1.4, -0.4], [2.6, -2.4], [3.4, -5.4], [7.8, -5.2], [8.6, -1.0], [8.6, 1.4], [3.0, 2.2], [2.4, 5.6]],
    sensores: [[-6.4, 2.4, -2.4], [-4.7, 1.1, 4.0], [-2.7, 1.1, 4.0], [-1.7, 1.1, 4.0], [7.6, 2.4, 2.6], [7.6, 1.15, 5.0]]
  };
};

PLANTAS['automotriz'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Línea de prensas: tres prensas grandes en fila
  [-7.0, -4.4, -1.8].forEach(function (x, i) {
    var n = 'prensa' + (i + 1);
    part(n + '_base', box(2.0, 0.6, 1.8), 'dark', x, 0.3, -3.6, null, 'A');
    part(n + '_columna1', box(0.35, 3.2, 0.35), 'body', x - 0.75, 2.2, -4.3, null, 'A');
    part(n + '_columna2', box(0.35, 3.2, 0.35), 'body', x + 0.75, 2.2, -4.3, null, 'A');
    part(n + '_columna3', box(0.35, 3.2, 0.35), 'body', x - 0.75, 2.2, -2.9, null, 'A');
    part(n + '_columna4', box(0.35, 3.2, 0.35), 'body', x + 0.75, 2.2, -2.9, null, 'A');
    part(n + '_corona', box(2.1, 0.9, 1.9), 'body', x, 4.2, -3.6, null, 'A');
    part(n + '_carro', box(1.5, 0.5, 1.4), 'light', x, 1.5, -3.6, null, 'A', { anima: 'prensa' });
    part(n + '_motor', cyl(0.32, 0.32, 0.9, 12), 'light', x, 4.95, -3.6, [0, 0, H], 'A');
  });
  part('prensas_banda', box(7.4, 0.15, 0.5), 'light', -4.4, 0.75, -1.9, null, 'B');
  // Celda de robots de ensamble: cuatro brazos
  part('celda_piso', box(4.0, 0.1, 3.4), 'dark', 2.4, 0.05, -3.4, null, 'B');
  [[1.4, -4.4], [3.4, -4.4], [1.4, -2.4], [3.4, -2.4]].forEach(function (p, i) {
    var n = 'robot' + (i + 1);
    part(n + '_base', cyl(0.3, 0.36, 0.4, 12), 'dark', p[0], 0.3, p[1], null, 'B');
    part(n + '_hombro', box(0.3, 1.2, 0.3), 'body', p[0], 1.1, p[1], [0, 0, 0.3 * (i % 2 ? 1 : -1)], 'B');
    part(n + '_brazo', box(1.0, 0.22, 0.22), 'light', p[0] + 0.45, 1.75, p[1], [0, 0, 0.5], 'B');
  });
  part('celda_banda', box(0.5, 0.15, 3.6), 'light', 2.4, 0.75, -3.4, null, 'B');
  // Transportador aéreo en lazo hacia pintura
  part('aereo_viga', box(7.0, 0.14, 0.14), 'light', 2.0, 3.0, -0.4, null, 'B');
  [-1.0, 1.0, 3.0, 5.0].forEach(function (x, i) { part('aereo_poste' + (i + 1), box(0.12, 3.0, 0.12), 'dark', x, 1.5, -0.4, null, 'B'); part('aereo_carro' + (i + 1), box(0.6, 0.9, 0.3), 'body', x + 0.4, 2.4, -0.4, null, 'B'); });
  // Cabina de pintura y horno de curado
  part('cabina', box(5.0, 2.4, 2.0), 'body', 1.0, 1.2, 2.2, null, 'B');
  part('cabina_extraccion', box(0.9, 0.9, 0.9), 'light', 1.0, 2.85, 2.2, null, 'B');
  part('cabina_vent', cyl(0.4, 0.38, 0.25, 16, true), 'dark', 1.0, 3.45, 2.2, null, 'B', { double: true });
  part('horno', box(3.8, 2.0, 1.8), 'body', 6.0, 1.0, 2.2, null, 'B');
  part('horno_quemador', cyl(0.3, 0.3, 1.0, 12), 'light', 6.0, 2.5, 2.2, null, 'B');
  part('horno_vent', cyl(0.42, 0.4, 0.25, 16, true), 'dark', 7.2, 2.2, 2.2, null, 'B', { double: true });
  // Cuarto de compresores de aire
  [-7.6, -6.2, -4.8].forEach(function (x, i) { part('aire' + (i + 1), box(1.0, 1.1, 0.9), 'body', x, 0.55, 3.2, null, 'B'); part('aire' + (i + 1) + '_motor', cyl(0.26, 0.26, 0.6, 12), 'light', x, 1.4, 3.2, [0, 0, H], 'B'); });
  part('aire_tanque', cyl(0.5, 0.5, 2.0, 14), 'light', -6.2, 1.0, 5.0, null, 'B');
  part('aire_linea', cyl(0.08, 0.08, 9.0, 8), 'dark', -1.6, 2.2, 4.6, [0, 0, H], 'C');
  P.cuartoElectrico(7.6, -2.8, 'A');
  P.transformador('trafo', 7.6, -5.0, 'A');
  return {
    kpi: 'Confiabilidad de la planta',
    equipos: [
      { pos: [-4.4, 6.0, -3.6], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [2.4, 2.8, -3.4], clase: 'B', tec: ['vib', 'termo'] },
      { pos: [2.0, 3.9, -0.4], clase: 'B', tec: ['vib'] },
      { pos: [1.0, 4.3, 2.2], clase: 'B', tec: ['vib', 'termo'] },
      { pos: [6.0, 3.6, 2.2], clase: 'B', tec: ['termo'] },
      { pos: [-6.2, 2.6, 3.2], clase: 'B', tec: ['ultra', 'aceite'] },
      { pos: [-1.6, 2.8, 4.6], clase: 'C', tec: ['ultra'] },
      { pos: [7.6, 3.1, -2.8], clase: 'A', tec: ['termo'] }
    ],
    ruta: [[-8.6, 5.6], [-8.6, 1.4], [-4.4, 0.6], [0.4, 0.6], [4.6, -1.4], [4.6, 0.6], [8.6, 0.6], [8.6, 4.4], [3.2, 4.6], [-2.4, 5.6]],
    sensores: [[-7.0, 5.4, -3.6], [-4.4, 5.4, -3.6], [-1.8, 5.4, -3.6], [-7.0, 1.0, -2.7], [-4.4, 1.0, -2.7], [-1.8, 1.0, -2.7], [7.6, 2.4, -2.8], [7.6, 1.15, -5.0]]
  };
};

PLANTAS['manufactura'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Nave con techo a dos aguas y bahía de motores
  part('nave_piso', box(8.6, 0.12, 5.0), 'dark', -4.4, 0.06, -3.0, null, 'B');
  [[-8.6, -5.4], [-0.2, -5.4], [-8.6, -0.6], [-0.2, -0.6]].forEach(function (p, i) { part('nave_poste' + (i + 1), box(0.14, 3.0, 0.14), 'light', p[0], 1.5, p[1], null, 'B'); });
  P.techoDosAguas(-4.4, -3.0, 8.8, 5.2, 3.0, 'B');
  // Fila de motor y bomba, motor y ventilador, motor y reductor
  [-7.4, -5.4, -3.4, -1.4].forEach(function (x, i) { P.bomba('mb' + (i + 1), x, -4.2, 'A'); });
  [-7.0, -4.6].forEach(function (x, i) { part('vent' + (i + 1) + '_motor', cyl(0.3, 0.3, 0.8, 14), 'light', x - 0.5, 0.55, -2.0, [0, 0, H], 'B'); part('vent' + (i + 1) + '_caracol', cyl(0.6, 0.6, 0.5, 20), 'body', x + 0.5, 0.75, -2.0, [0, 0, H], 'B'); part('vent' + (i + 1) + '_descarga', box(0.5, 0.5, 0.5), 'dark', x + 0.5, 1.4, -2.0, null, 'B'); });
  part('reductor_motor', cyl(0.36, 0.36, 1.0, 14), 'light', -2.0, 0.6, -2.0, [0, 0, H], 'A');
  part('reductor_caja', box(1.0, 0.9, 0.9), 'body', -0.9, 0.55, -2.0, null, 'A');
  part('reductor_salida', cyl(0.14, 0.14, 1.0, 10), 'dark', 0.0, 0.55, -2.0, [0, 0, H], 'A');
  // Unidad hidráulica y compresores
  part('hidraulica_tanque', box(1.6, 0.8, 1.0), 'body', 2.6, 0.4, -4.2, null, 'B');
  part('hidraulica_motor', cyl(0.3, 0.3, 0.7, 12), 'light', 2.6, 1.15, -4.2, null, 'B');
  part('hidraulica_acumulador', cyl(0.2, 0.2, 1.1, 12), 'dark', 3.6, 0.95, -4.2, null, 'B');
  [2.2, 3.6].forEach(function (x, i) { part('aire' + (i + 1), box(1.0, 1.1, 0.9), 'body', x, 0.55, -1.8, null, 'B'); part('aire' + (i + 1) + '_motor', cyl(0.26, 0.26, 0.6, 12), 'light', x, 1.4, -1.8, [0, 0, H], 'B'); });
  part('aire_tanque', cyl(0.5, 0.5, 2.0, 14), 'light', 5.2, 1.0, -3.0, null, 'B');
  // Chiller y torre
  part('chiller', box(2.6, 1.2, 1.2), 'body', 5.6, 0.6, 0.8, null, 'B');
  part('chiller_compresor', cyl(0.3, 0.3, 1.4, 12), 'light', 5.6, 1.5, 0.8, [0, 0, H], 'B');
  P.torreEnfriamiento(4.4, 3.8, [3.2, 5.6], 'B');
  // Tanques de servicios
  P.tanque('tanque1', -7.6, 3.4, 0.7, 1.8, 'C'); P.tanque('tanque2', -5.8, 3.4, 0.7, 1.8, 'C');
  part('tanques_linea', cyl(0.08, 0.08, 5.0, 8), 'dark', -3.6, 1.0, 3.4, [0, 0, H], 'C');
  P.cuartoElectrico(0.2, 3.6, 'A');
  P.transformador('trafo', 2.6, 5.0, 'A');
  P.portico(8.4, 4.4, 'C');
  return {
    kpi: 'Confiabilidad de la planta',
    equipos: [
      { pos: [-4.4, 1.9, -4.2], clase: 'A', tec: ['vib', 'termo', 'ultra'] },
      { pos: [-5.8, 2.2, -2.0], clase: 'B', tec: ['vib'] },
      { pos: [-1.0, 1.9, -2.0], clase: 'A', tec: ['vib', 'aceite'] },
      { pos: [2.6, 2.1, -4.2], clase: 'B', tec: ['aceite', 'termo'] },
      { pos: [2.9, 2.4, -1.8], clase: 'B', tec: ['ultra', 'aceite'] },
      { pos: [5.6, 2.5, 0.8], clase: 'B', tec: ['vib', 'termo'] },
      { pos: [4.4, 2.5, 3.8], clase: 'B', tec: ['vib'] },
      { pos: [0.2, 3.1, 3.6], clase: 'A', tec: ['termo', 'ultra'] },
      { pos: [-6.7, 2.7, 3.4], clase: 'C', tec: ['ultra'] }
    ],
    ruta: [[-8.6, 5.6], [-8.6, 1.4], [-6.0, 0.4], [-0.6, 0.0], [1.4, -0.4], [4.4, -0.6], [7.6, -0.6], [8.6, 1.6], [7.2, 5.6], [2.0, 2.0], [-1.6, 5.6]],
    sensores: [[-7.4, 0.85, -3.8], [-5.4, 0.85, -3.8], [-3.4, 0.85, -3.8], [-1.4, 0.85, -3.8], [-0.9, 1.1, -2.0], [0.2, 2.4, 3.6], [2.6, 1.15, 5.0]]
  };
};

PLANTAS['cemento-y-materiales'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Torre de precalentamiento con ciclones
  part('torre', box(2.0, 6.4, 2.0), 'body', -7.2, 3.2, -3.8, null, 'C');
  [1.6, 3.2, 4.8].forEach(function (y, i) { part('ciclon' + (i + 1), cyl(0.5, 0.2, 1.1, 14), 'light', -5.7, y, -3.8, null, 'C'); });
  part('torre_chimenea', cyl(0.3, 0.34, 3.0, 16), 'light', -7.6, 7.9, -3.8, null, 'C');
  // Horno rotatorio inclinado sobre dos estaciones de rodillos
  var hornoGeo = cyl(0.75, 0.75, 9.0, 20); hornoGeo.rotateZ(H); hornoGeo.rotateY(0);
  part('horno', hornoGeo, 'body', -0.8, 1.9, -3.9, [0, 0, 0.06], 'A');
  [[-3.6, 1.6], [2.2, 2.2]].forEach(function (p, i) { part('horno_rodillo' + (i + 1) + '_base', box(1.2, 0.5, 2.2), 'dark', p[0], 0.25, -3.9, null, 'A'); part('horno_rodillo' + (i + 1) + 'a', cyl(0.3, 0.3, 0.7, 12), 'light', p[0], p[1] - 1.0, -4.8, [H, 0, 0], 'A'); part('horno_rodillo' + (i + 1) + 'b', cyl(0.3, 0.3, 0.7, 12), 'light', p[0], p[1] - 1.0, -3.0, [H, 0, 0], 'A'); });
  part('horno_corona', new T.TorusGeometry(0.95, 0.12, 8, 32), 'gold', -0.4, 1.9, -3.9, [0, H, 0], 'A');
  part('horno_motor', cyl(0.36, 0.36, 1.0, 14), 'light', -0.4, 0.6, -5.4, [0, 0, H], 'A');
  part('horno_reductor', box(0.9, 0.8, 0.8), 'body', 0.6, 0.5, -5.4, null, 'A');
  // Enfriador de clínker y ventiladores
  part('enfriador', box(3.4, 1.2, 1.6), 'body', 5.6, 0.6, -3.6, null, 'B');
  [4.6, 5.6, 6.6].forEach(function (x, i) { part('enfriador_vent' + (i + 1) + '_caracol', cyl(0.42, 0.42, 0.4, 16), 'light', x, 0.5, -5.0, [0, 0, H], 'B'); part('enfriador_vent' + (i + 1) + '_motor', cyl(0.2, 0.2, 0.5, 10), 'dark', x, 0.5, -5.6, [H, 0, 0], 'B'); });
  // Molino de bolas con motor y reductor
  part('molino', cyl(1.0, 1.0, 4.2, 20), 'body', -5.2, 1.3, 1.6, [0, 0, H], 'A');
  part('molino_munon1', cyl(0.5, 0.5, 0.6, 14), 'light', -7.6, 1.3, 1.6, [0, 0, H], 'A');
  part('molino_munon2', cyl(0.5, 0.5, 0.6, 14), 'light', -2.8, 1.3, 1.6, [0, 0, H], 'A');
  part('molino_base1', box(0.8, 0.8, 1.6), 'dark', -7.6, 0.4, 1.6, null, 'A');
  part('molino_base2', box(0.8, 0.8, 1.6), 'dark', -2.8, 0.4, 1.6, null, 'A');
  part('molino_corona', new T.TorusGeometry(1.15, 0.1, 8, 32), 'gold', -3.4, 1.3, 1.6, [0, H, 0], 'A');
  part('molino_motor', cyl(0.42, 0.42, 1.4, 14), 'light', -3.4, 0.6, 3.6, [0, 0, H], 'A');
  part('molino_reductor', box(1.0, 0.9, 0.9), 'body', -3.4, 0.5, 2.7, null, 'A');
  // Silos de cemento y banda de alimentación
  [2.4, 4.0].forEach(function (x, i) { part('silo' + (i + 1), cyl(0.75, 0.75, 4.4, 18), 'body', x, 2.2, 1.8, null, 'C'); part('silo' + (i + 1) + '_tapa', new T.ConeGeometry(0.75, 0.4, 18), 'light', x, 4.6, 1.8, null, 'C'); });
  part('banda', box(0.6, 0.14, 7.6), 'light', 6.6, 1.0, 1.2, [0, 0, 0], 'B');
  part('banda_inclinada', box(0.6, 0.14, 3.0), 'light', 6.6, 2.4, -1.6, [-0.5, 0, 0], 'B');
  [-1.6, 0.4, 2.4, 4.4].forEach(function (z, i) { part('banda_pata' + (i + 1), box(0.1, 0.9, 0.5), 'dark', 6.6, 0.45, z, null, 'B'); });
  part('banda_motor', cyl(0.26, 0.26, 0.7, 12), 'dark', 7.3, 1.0, 4.8, [0, 0, H], 'B');
  part('trituradora', box(1.8, 1.6, 1.8), 'body', 7.4, 0.8, 5.0, null, 'B');
  part('trituradora_tolva', cyl(1.1, 0.5, 0.9, 4), 'light', 7.4, 2.05, 5.0, [0, Math.PI / 4, 0], 'B', { double: true });
  P.cuartoElectrico(1.4, 4.8, 'A');
  P.transformador('trafo', -0.8, 4.8, 'A');
  return {
    kpi: 'Confiabilidad de la planta',
    equipos: [
      { pos: [-5.2, 3.4, 1.6], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [-0.8, 3.9, -3.9], clase: 'A', tec: ['vib', 'termo', 'aceite'] },
      { pos: [-6.4, 7.4, -3.8], clase: 'C', tec: ['termo'] },
      { pos: [5.6, 2.4, -3.6], clase: 'B', tec: ['vib'] },
      { pos: [3.2, 5.6, 1.8], clase: 'C', tec: ['ultra'] },
      { pos: [6.6, 3.6, 0.4], clase: 'B', tec: ['vib', 'ultra'] },
      { pos: [7.4, 3.3, 5.0], clase: 'B', tec: ['vib', 'termo'] },
      { pos: [1.4, 3.1, 4.8], clase: 'A', tec: ['termo', 'ultra'] }
    ],
    ruta: [[-8.8, 5.6], [-8.8, 3.6], [-6.0, 4.6], [-1.6, 2.4], [-1.2, -0.4], [2.6, -1.4], [5.8, -1.6], [8.6, -1.6], [8.6, 2.0], [5.2, 3.4], [4.6, 5.8]],
    sensores: [[-7.6, 1.9, 1.6], [-2.8, 1.9, 1.6], [-3.4, 1.1, 3.6], [-3.6, 2.2, -3.9], [2.2, 2.8, -3.9], [-0.4, 1.1, -5.4], [1.4, 2.4, 4.8], [-0.8, 1.15, 4.8]]
  };
};

PLANTAS['tratamiento-de-agua'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Cárcamo de bombeo con tres bombas verticales
  part('carcamo', box(4.6, 1.0, 2.4), 'dark', -6.6, 0.5, -3.8, null, 'A');
  part('carcamo_agua', box(4.2, 0.1, 2.0), 'light', -6.6, 1.0, -3.8, null, 'A', { agua: true });
  [-8.0, -6.6, -5.2].forEach(function (x, i) { part('bombav' + (i + 1) + '_motor', cyl(0.36, 0.36, 1.1, 14), 'light', x, 2.1, -3.8, null, 'A'); part('bombav' + (i + 1) + '_cabezal', box(0.7, 0.4, 0.7), 'body', x, 1.3, -3.8, null, 'A'); part('bombav' + (i + 1) + '_descarga', cyl(0.14, 0.14, 1.6, 10), 'dark', x, 1.3, -2.5, [H, 0, 0], 'A'); });
  part('carcamo_cabezal', cyl(0.18, 0.18, 4.4, 12), 'light', -6.6, 1.3, -1.7, [0, 0, H], 'A');
  // Pretratamiento: rejilla y desarenador
  part('rejilla', box(0.9, 1.6, 1.4), 'body', -2.4, 0.8, -4.2, [0, 0, -0.35], 'C');
  part('desarenador', box(2.4, 0.7, 1.4), 'dark', -0.4, 0.35, -4.2, null, 'C');
  // Tanques de aireación con aireadores y sopladores
  part('aireacion', box(5.6, 0.9, 2.8), 'dark', 2.6, 0.45, -0.4, null, 'B');
  part('aireacion_agua', box(5.3, 0.08, 2.5), 'light', 2.6, 0.9, -0.4, null, 'B', { agua: true });
  part('aireacion_division', box(5.3, 0.9, 0.1), 'body', 2.6, 0.5, -0.4, null, 'B');
  [[0.8, -1.1], [2.6, -1.1], [4.4, -1.1], [0.8, 0.3], [2.6, 0.3], [4.4, 0.3]].forEach(function (p, i) { part('aireador' + (i + 1), cyl(0.3, 0.3, 0.3, 12), 'light', p[0], 1.1, p[1], null, 'B'); part('aireador' + (i + 1) + '_aspas', box(0.9, 0.06, 0.12), 'dark', p[0], 1.28, p[1], null, 'B', { anima: 'gira' }); });
  part('sopladores_piso', box(3.4, 0.2, 1.4), 'dark', -1.0, 0.1, 2.2, null, 'A');
  [-2.0, -1.0, 0.0].forEach(function (x, i) { part('soplador' + (i + 1) + '_motor', cyl(0.28, 0.28, 0.7, 12), 'light', x, 0.55, 2.6, [H, 0, 0], 'A'); part('soplador' + (i + 1), cyl(0.36, 0.36, 0.5, 14), 'body', x, 0.55, 1.8, [H, 0, 0], 'A'); });
  part('sopladores_cabezal', cyl(0.14, 0.14, 3.4, 10), 'dark', -1.0, 1.1, 1.4, [0, 0, H], 'A');
  // Clarificador circular con puente giratorio
  part('clarificador', cyl(2.3, 2.3, 0.8, 32, true), 'dark', -5.4, 0.4, 2.8, null, 'B', { double: true });
  part('clarificador_agua', cyl(2.2, 2.2, 0.06, 32), 'light', -5.4, 0.78, 2.8, null, 'B', { agua: true });
  part('clarificador_centro', cyl(0.3, 0.3, 1.4, 12), 'body', -5.4, 1.0, 2.8, null, 'B');
  part('clarificador_puente', box(4.6, 0.12, 0.4), 'light', -5.4, 1.45, 2.8, null, 'B', { anima: 'gira-lento' });
  part('clarificador_motor', cyl(0.22, 0.22, 0.5, 10), 'dark', -5.4, 1.75, 2.8, null, 'B');
  // Digestor y espesador
  part('digestor', cyl(1.3, 1.3, 2.6, 20), 'body', 6.4, 1.3, 3.6, null, 'C');
  part('digestor_domo', new T.SphereGeometry(1.3, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'light', 6.4, 2.6, 3.6, null, 'C');
  part('espesador', cyl(1.1, 1.1, 1.2, 20), 'body', 3.2, 0.6, 3.8, null, 'C');
  part('espesador_cono', new T.ConeGeometry(1.1, 0.6, 20), 'light', 3.2, 1.5, 3.8, null, 'C');
  // Caseta eléctrica y transformador
  P.cuartoElectrico(7.0, -3.4, 'A');
  P.transformador('trafo', 7.0, -5.3, 'A');
  return {
    kpi: 'Confiabilidad de la planta',
    equipos: [
      { pos: [-6.6, 3.4, -3.8], clase: 'A', tec: ['vib', 'termo', 'ultra'] },
      { pos: [-0.4, 2.0, -4.2], clase: 'C', tec: ['termo'] },
      { pos: [2.6, 2.4, -0.4], clase: 'B', tec: ['vib', 'termo'] },
      { pos: [-1.0, 2.0, 2.2], clase: 'A', tec: ['vib', 'aceite', 'ultra'] },
      { pos: [-5.4, 2.6, 2.8], clase: 'B', tec: ['vib', 'aceite'] },
      { pos: [6.4, 4.4, 3.6], clase: 'C', tec: ['ultra'] },
      { pos: [7.0, 3.1, -3.4], clase: 'A', tec: ['termo', 'ultra'] }
    ],
    ruta: [[-8.8, -0.6], [-3.6, -1.4], [-1.6, -2.4], [1.0, -2.6], [5.6, -2.4], [8.8, -1.0], [8.8, 1.0], [5.6, 1.6], [1.4, 1.6], [1.0, 5.6], [-2.4, 5.6], [-2.8, 0.6]],
    sensores: [[-8.0, 2.75, -3.8], [-6.6, 2.75, -3.8], [-5.2, 2.75, -3.8], [-2.0, 1.0, 2.6], [-1.0, 1.0, 2.6], [0.0, 1.0, 2.6], [7.0, 2.4, -3.4], [7.0, 1.15, -5.3]]
  };
};

PLANTAS['energias-renovables'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Campo solar: tres filas de paneles inclinados con sus inversores
  for (var f = 0; f < 3; f++) {
    for (var k = 0; k < 4; k++) {
      part('panel_' + f + '_' + k, box(1.5, 0.06, 0.9), 'light', -8.0 + k * 1.65, 0.75, -5.0 + f * 1.3, [-0.5, 0, 0], 'C');
      part('panel_' + f + '_' + k + '_poste', box(0.08, 0.6, 0.08), 'dark', -8.0 + k * 1.65, 0.3, -5.0 + f * 1.3, null, 'C');
    }
  }
  part('inversor1', box(0.9, 1.0, 0.5), 'body', -1.4, 0.5, -4.8, null, 'B');
  part('inversor2', box(0.9, 1.0, 0.5), 'body', -1.4, 0.5, -3.6, null, 'B');
  part('inversor_trafo', box(0.9, 0.9, 0.8), 'body', -1.4, 0.45, -2.2, null, 'B');
  part('inversor_trafo_radiador', box(0.18, 0.7, 0.7), 'dark', -0.85, 0.45, -2.2, null, 'B');
  // Tres aerogeneradores con las aspas girando
  [[2.2, -4.6, 5.2], [5.4, -3.4, 5.8], [8.2, -5.0, 5.0]].forEach(function (a, i) {
    var n = 'aero' + (i + 1);
    part(n + '_torre', cyl(0.14, 0.26, a[2], 14), 'light', a[0], a[2] / 2, a[1], null, 'A');
    part(n + '_gondola', box(0.9, 0.42, 0.42), 'body', a[0], a[2] + 0.1, a[1], null, 'A');
    part(n + '_buje', cyl(0.14, 0.18, 0.3, 10), 'light', a[0] - 0.55, a[2] + 0.1, a[1], [0, 0, H], 'A');
    var r = part(n + '_rotor', box(0.06, 4.0, 0.3), 'light', a[0] - 0.72, a[2] + 0.1, a[1], null, 'A', { anima: 'rotor' });
    var g2 = box(0.06, 4.0, 0.3), g3 = box(0.06, 4.0, 0.3);
    var b2 = new T.Mesh(g2, r.mat); b2.rotation.x = 2.094; b2.add(new T.LineSegments(new T.EdgesGeometry(g2, 25), r.lmat));
    var b3 = new T.Mesh(g3, r.mat); b3.rotation.x = -2.094; b3.add(new T.LineSegments(new T.EdgesGeometry(g3, 25), r.lmat));
    r.mesh.add(b2); r.mesh.add(b3);
  });
  // Pequeña hidroeléctrica: presa, tubería forzada y casa de máquinas
  part('presa', box(3.4, 1.6, 0.5), 'body', -6.4, 0.8, 1.6, null, 'C');
  part('presa_agua', box(3.2, 0.12, 2.0), 'light', -6.4, 1.5, 0.3, null, 'C', { agua: true });
  part('presa_vertedor', box(1.0, 0.4, 0.5), 'light', -6.4, 1.8, 1.6, null, 'C');
  part('tuberia_forzada', cyl(0.24, 0.24, 3.4, 12), 'light', -5.2, 0.9, 3.2, [0.55, 0, 0.3], 'B');
  part('casa_maquinas', box(2.6, 1.6, 2.0), 'body', -3.8, 0.8, 4.6, null, 'A');
  P.techoDosAguas(-3.8, 4.6, 2.8, 2.2, 1.6, 'A');
  part('turbina_hidra', cyl(0.55, 0.55, 0.5, 16), 'light', -3.8, 2.0, 4.6, null, 'A');
  part('generador_hidra', cyl(0.4, 0.4, 0.7, 16), 'dark', -3.8, 2.6, 4.6, null, 'A');
  part('canal_salida', box(1.6, 0.3, 1.0), 'dark', -1.6, 0.15, 4.8, null, 'C');
  part('canal_agua', box(1.5, 0.06, 0.9), 'light', -1.6, 0.31, 4.8, null, 'C', { agua: true });
  // Planta de biogás: digestor con domo, motogenerador, soplador y antorcha
  part('digestor', cyl(1.3, 1.3, 1.6, 20), 'body', 3.0, 0.8, 2.4, null, 'B');
  part('digestor_domo', new T.SphereGeometry(1.3, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'light', 3.0, 1.6, 2.4, null, 'B');
  part('digestor_agitador', cyl(0.22, 0.22, 0.6, 10), 'dark', 3.0, 3.1, 2.4, null, 'B');
  part('gas_linea', cyl(0.08, 0.08, 3.6, 8), 'dark', 5.0, 2.2, 2.4, [0, 0, H], 'B');
  part('motogenerador_patin', box(2.6, 0.25, 1.3), 'dark', 6.6, 0.125, 4.6, null, 'A');
  part('motogenerador_motor', box(1.3, 0.9, 0.9), 'body', 6.1, 0.7, 4.6, null, 'A');
  part('motogenerador_generador', cyl(0.4, 0.4, 1.0, 14), 'light', 7.4, 0.65, 4.6, [0, 0, H], 'A');
  part('motogenerador_escape', cyl(0.1, 0.1, 1.4, 8), 'dark', 6.0, 1.8, 4.6, null, 'A');
  part('soplador', cyl(0.3, 0.3, 0.5, 12), 'body', 5.0, 0.4, 3.4, [H, 0, 0], 'B');
  part('antorcha', cyl(0.12, 0.16, 3.6, 10), 'light', 8.4, 1.8, 1.4, null, 'C');
  part('antorcha_punta', cyl(0.26, 0.12, 0.4, 10), 'gold', 8.4, 3.8, 1.4, null, 'C');
  // Subestación colectora en el centro
  P.transformador('trafo_colector', 2.2, 0.0, 'A');
  P.cuartoElectrico(0.0, 1.4, 'A');
  P.portico(4.6, -0.6, 'C');
  return {
    kpi: 'Disponibilidad del parque',
    equipos: [
      { pos: [-5.5, 2.0, -3.7], clase: 'C', tec: ['termo'] },
      { pos: [-1.4, 2.2, -3.6], clase: 'B', tec: ['termo', 'ultra'] },
      { pos: [5.4, 7.6, -3.4], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [-3.8, 4.0, 4.6], clase: 'A', tec: ['vib', 'aceite'] },
      { pos: [3.0, 4.1, 2.4], clase: 'B', tec: ['gas', 'vib'] },
      { pos: [6.6, 2.6, 4.6], clase: 'A', tec: ['aceite', 'vib', 'gas'] },
      { pos: [2.2, 1.7, 0.0], clase: 'A', tec: ['aceite', 'termo', 'ultra'] },
      { pos: [8.4, 4.8, 1.4], clase: 'C', tec: ['gas'] }
    ],
    ruta: [[-8.8, -5.8], [-8.8, -1.4], [-2.6, -1.0], [0.6, -5.4], [3.8, -5.6], [7.0, -5.8], [8.8, -3.0], [8.8, 0.2], [6.2, 1.2], [4.8, 3.2], [1.4, 3.4], [-1.0, 5.6], [-6.0, 5.6]],
    sensores: [[2.2, 5.3, -4.6], [5.4, 5.9, -3.4], [8.2, 5.1, -5.0], [-3.8, 2.3, 4.6], [6.1, 1.2, 4.6], [7.4, 1.1, 4.6], [2.2, 1.15, 0.0], [0.0, 2.4, 1.4]]
  };
};

PLANTAS['mineria'] = function (P) {
  var H = P.H, part = P.part, box = P.box, cyl = P.cyl, T = P.THREE;
  // Chancador primario con tolva y banda que sube al acopio
  part('chancador_base', box(2.2, 1.2, 2.0), 'body', -7.4, 0.6, -4.2, null, 'A');
  part('chancador_tolva', cyl(1.5, 0.6, 1.2, 4), 'light', -7.4, 1.8, -4.2, [0, Math.PI / 4, 0], 'A', { double: true });
  part('chancador_motor', cyl(0.4, 0.4, 1.1, 14), 'light', -5.8, 0.7, -4.2, [0, 0, H], 'A');
  part('banda1', box(0.6, 0.12, 4.0), 'light', -7.4, 1.4, -1.4, [-0.32, 0, 0], 'B');
  [-2.6, -1.2, 0.2].forEach(function (z, i) { part('banda1_pata' + (i + 1), box(0.1, 1.0 + i * 0.5, 0.4), 'dark', -7.4, 0.5 + i * 0.25, z, null, 'B'); });
  part('acopio', new T.ConeGeometry(1.5, 1.6, 20), 'dark', -7.4, 0.8, 1.6, null, 'C');
  part('acopio_banda', box(0.6, 0.12, 3.4), 'light', -5.4, 1.1, 1.6, [0, H, 0], 'B');
  // Molino SAG y molino de bolas con motores y reductores
  [[-3.2, -3.6, 1.15, 3.4, 'sag'], [1.2, -3.6, 0.9, 4.0, 'bolas']].forEach(function (m) {
    var x = m[0], z = m[1], r = m[2], l = m[3], n = 'molino_' + m[4];
    part(n, cyl(r, r, l, 20), 'body', x, r + 0.3, z, [0, 0, H], 'A');
    part(n + '_munon1', cyl(r * 0.45, r * 0.45, 0.6, 14), 'light', x - l / 2 - 0.3, r + 0.3, z, [0, 0, H], 'A');
    part(n + '_munon2', cyl(r * 0.45, r * 0.45, 0.6, 14), 'light', x + l / 2 + 0.3, r + 0.3, z, [0, 0, H], 'A');
    part(n + '_base1', box(0.8, r + 0.3, 1.6), 'dark', x - l / 2 - 0.3, (r + 0.3) / 2, z, null, 'A');
    part(n + '_base2', box(0.8, r + 0.3, 1.6), 'dark', x + l / 2 + 0.3, (r + 0.3) / 2, z, null, 'A');
    part(n + '_corona', new T.TorusGeometry(r + 0.15, 0.1, 8, 32), 'gold', x + l / 2 - 0.5, r + 0.3, z, [0, H, 0], 'A');
    part(n + '_motor', cyl(0.42, 0.42, 1.4, 14), 'light', x + l / 2 - 0.5, 0.6, z + 2.0, [0, 0, H], 'A');
    part(n + '_reductor', box(1.0, 0.9, 0.9), 'body', x + l / 2 - 0.5, 0.5, z + 1.2, null, 'A');
  });
  // Celdas de flotación en fila con agitadores, y espesador
  [-3.4, -2.2, -1.0, 0.2].forEach(function (x, i) {
    part('celda' + (i + 1), box(1.1, 1.1, 1.1), 'body', x, 0.55, 1.6, null, 'B');
    part('celda' + (i + 1) + '_pulpa', box(1.0, 0.06, 1.0), 'light', x, 1.1, 1.6, null, 'B', { agua: true });
    part('celda' + (i + 1) + '_motor', cyl(0.18, 0.18, 0.5, 10), 'light', x, 1.75, 1.6, null, 'B');
    part('celda' + (i + 1) + '_eje', cyl(0.05, 0.05, 0.9, 6), 'dark', x, 1.25, 1.6, null, 'B');
  });
  part('espesador', cyl(1.6, 1.6, 0.8, 28, true), 'dark', 3.6, 0.4, 1.8, null, 'B', { double: true });
  part('espesador_pulpa', cyl(1.5, 1.5, 0.06, 28), 'light', 3.6, 0.78, 1.8, null, 'B', { agua: true });
  part('espesador_centro', cyl(0.25, 0.25, 1.3, 12), 'body', 3.6, 0.9, 1.8, null, 'B');
  part('espesador_puente', box(3.2, 0.12, 0.36), 'light', 3.6, 1.4, 1.8, null, 'B', { anima: 'gira-lento' });
  // Bombas de pulpa
  [-3.0, -1.4, 0.2].forEach(function (x, i) { P.bomba('pulpa' + (i + 1), x, 4.2, 'A'); });
  part('pulpa_cabezal', cyl(0.14, 0.14, 4.4, 12), 'light', -1.4, 1.4, 4.2, [0, 0, H], 'A');
  // Portal de mina con ventilador principal y bomba de desagüe
  part('portal_cerro', box(3.4, 2.4, 2.4), 'dark', 7.2, 1.2, -3.8, null, 'C');
  part('portal_boca', box(1.4, 1.6, 0.3), 'body', 7.2, 0.8, -2.5, null, 'C');
  part('ventilador_caracol', cyl(0.9, 0.9, 0.7, 20), 'body', 5.0, 1.0, -2.2, [0, 0, H], 'A');
  part('ventilador_motor', cyl(0.4, 0.4, 1.1, 14), 'light', 3.9, 1.0, -2.2, [0, 0, H], 'A');
  part('ventilador_ducto', cyl(0.5, 0.5, 1.8, 14), 'dark', 5.9, 1.4, -2.2, [0, 0, H], 'A');
  P.bomba('desague', 7.0, 0.4, 'B');
  part('desague_tanque', cyl(0.7, 0.7, 1.4, 16), 'light', 8.4, 0.7, 1.6, null, 'C');
  // Subestación
  P.transformador('trafo1', 6.2, 3.6, 'A');
  P.transformador('trafo2', 6.2, 5.0, 'A');
  P.portico(8.6, 4.3, 'C');
  P.cuartoElectrico(3.4, 4.6, 'A');
  return {
    kpi: 'Confiabilidad de la planta',
    equipos: [
      { pos: [-7.4, 3.1, -4.2], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [-3.2, 3.3, -3.6], clase: 'A', tec: ['vib', 'aceite', 'termo'] },
      { pos: [1.2, 3.0, -3.6], clase: 'A', tec: ['vib', 'aceite'] },
      { pos: [-7.4, 2.9, -1.4], clase: 'B', tec: ['ultra', 'termo'] },
      { pos: [-1.6, 2.6, 1.6], clase: 'B', tec: ['vib'] },
      { pos: [3.6, 2.4, 1.8], clase: 'B', tec: ['vib', 'aceite'] },
      { pos: [-1.4, 2.0, 4.2], clase: 'A', tec: ['vib', 'ultra'] },
      { pos: [5.0, 2.6, -2.2], clase: 'A', tec: ['vib', 'termo'] },
      { pos: [6.2, 1.9, 4.3], clase: 'A', tec: ['aceite', 'termo', 'ultra'] }
    ],
    ruta: [[-8.8, -5.6], [-8.8, 3.6], [-5.6, 3.2], [-5.4, -0.2], [-1.0, -1.0], [3.4, -0.6], [3.0, -4.8], [5.6, -5.4], [8.8, -4.6], [8.8, -0.4], [5.4, 0.6], [5.0, 2.6], [1.6, 3.4], [1.6, 5.6]],
    sensores: [[-7.4, 1.3, -3.1], [-4.95, 1.75, -3.6], [-1.45, 1.75, -3.6], [-0.85, 1.5, -3.6], [3.25, 1.5, -3.6], [-3.0, 0.85, 4.6], [-1.4, 0.85, 4.6], [0.2, 0.85, 4.6], [3.9, 1.6, -2.2], [6.2, 1.15, 3.6], [6.2, 1.15, 5.0]]
  };
};

/* ------------------------------------------------------------------ */

export function montarEscenaGemelo(THREE, container, opciones) {
  opciones = opciones || {};
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = opciones.reducirMovimiento != null ? !!opciones.reducirMovimiento : !!(mq && mq.matches);
  var planta = PLANTAS[opciones.planta] || PLANTAS['manufactura'];

  var estilo = document.createElement('style');
  estilo.textContent = CSS;
  var root = document.createElement('div');
  root.className = 'ge-raiz';
  if (opciones.fuente) root.style.fontFamily = opciones.fuente;
  root.innerHTML =
    '<div class="ge-ov">' +
    '<div data-r="marcas"></div>' +
    '<div class="ge-pasos" data-r="pasos">' +
    PASOS.map(function (p, i) { return '<div class="ge-paso" data-r="p' + i + '"><b>' + (i + 1) + '</b>' + p + '</div>'; }).join('') +
    '</div>' +
    '<div class="ge-abs ge-kpi" data-r="kpi">' +
    '<h4 data-r="kt">Confiabilidad de la planta</h4>' +
    '<div class="ge-fila"><span>Disponibilidad</span><div><b data-r="k1">96.1 %</b><small>▲</small></div></div>' +
    '<div class="ge-fila"><span>MTBF</span><div><b data-r="k2">410 h</b><small>▲</small></div></div>' +
    '<div class="ge-fila"><span>MTTR</span><div><b data-r="k3">9.5 h</b><small>▼</small></div></div>' +
    '<div class="ge-fila"><span>Condiciones críticas</span><div><b data-r="k4">12</b><small>▼</small></div></div>' +
    '</div>' +
    '</div>';
  container.appendChild(estilo);
  container.appendChild(root);
  function $(r) { return root.querySelector('[data-r="' + r + '"]'); }

  var LOOP = 22;
  var T = { arma: 0.2, crit: 3.0, tec: 7.5, ruta: 12.0, kpi: 16.5, fin: 20.6 };
  var C = { b1: 0x16324f, b2: 0x22476f, b3: 0x0f243d, cyan: 0x5cc8ff, gold: 0xffc34d, green: 0x22c55e, amber: 0xf59e0b, red: 0xef4444, blue: 0x3b82f6, agua: 0x2a6fb0 };
  var HEX = { A: '#ef4444', B: '#f59e0b', C: '#5cc8ff' };

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (t, a, b) { return clamp01((t - a) / (b - a)); };
  var ease = function (x) { return x * x * (3 - 2 * x); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  root.prepend(renderer.domElement);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(28, 1, 0.5, 400);
  scene.add(new THREE.HemisphereLight(0xa8dcff, 0x0d1a38, 0.8));
  var sun = new THREE.DirectionalLight(0xffffff, 0.7); sun.position.set(-6, 14, 9); scene.add(sun);
  var rim = new THREE.DirectionalLight(0x5cc8ff, 0.3); rim.position.set(10, 6, -8); scene.add(rim);

  var std = function (name, color, o) {
    return Object.assign(new THREE.MeshStandardMaterial(Object.assign({ color: color, roughness: 0.75, metalness: 0.12, flatShading: true, emissive: color, emissiveIntensity: 0.28 }, o || {})), { name: name });
  };
  var M = { body: std('azul_estructura', C.b1), light: std('azul_claro', C.b2), dark: std('azul_oscuro', C.b3), gold: std('dorado', C.gold, { roughness: 0.35, metalness: 0.55, emissiveIntensity: 0.55 }), agua: std('agua', C.agua, { roughness: 0.2, metalness: 0.3, emissiveIntensity: 0.45 }) };
  var cCol = { A: new THREE.Color(C.red), B: new THREE.Color(C.amber), C: new THREE.Color(C.blue) };
  var green = new THREE.Color(C.green);

  // Plataforma y retícula
  var platGeo = new THREE.BoxGeometry(18.4, 0.3, 12.4);
  var platform = new THREE.Mesh(platGeo, std('plataforma', C.b3, { emissiveIntensity: 0.1, roughness: 0.95 }));
  platform.position.y = -0.15; scene.add(platform);
  platform.add(new THREE.LineSegments(new THREE.EdgesGeometry(platGeo), new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.5 })));
  var gp = [];
  for (var gx = -9; gx <= 9.001; gx += 1) gp.push(gx, 0.003, -6, gx, 0.003, 6);
  for (var gz = -6; gz <= 6.001; gz += 1) gp.push(-9, 0.003, gz, 9, 0.003, gz);
  var gridGeo = new THREE.BufferGeometry(); gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gp, 3));
  scene.add(new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.1 })));

  // Piezas, cada una con su clase de criticidad
  var plant = new THREE.Group(); scene.add(plant);
  var lineBase = new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0 });
  var pieces = [], animadas = [];
  function part(name, geo, key, x, y, z, rot, clase, opt) {
    var mat = M[opt && opt.agua ? 'agua' : key].clone(); mat.transparent = true; mat.opacity = 0;
    if (opt && opt.double) mat.side = THREE.DoubleSide;
    var mesh = new THREE.Mesh(geo, mat); mesh.name = name; mesh.position.set(x, y, z);
    if (rot) mesh.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    var lmat = lineBase.clone();
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), lmat));
    plant.add(mesh);
    var p = { mesh: mesh, mat: mat, lmat: lmat, y: y, cx: x, clase: clase, emi0: mat.emissive.clone(), anima: opt && opt.anima }; pieces.push(p);
    if (p.anima) animadas.push(p);
    return p;
  }
  var H = Math.PI / 2;
  var box = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
  var cyl = function (rt, rb, h, s, open) { return new THREE.CylinderGeometry(rt, rb, h, s || 16, 1, !!open); };

  // Vocabulario de equipos compartido por las plantas
  var P = {
    THREE: THREE, H: H, part: part, box: box, cyl: cyl,
    bomba: function (n, x, z, clase) {
      part(n + '_base', box(1.5, 0.2, 0.7), 'dark', x, 0.1, z, null, clase);
      part(n + '_motor', cyl(0.3, 0.3, 0.75, 16), 'light', x - 0.28, 0.5, z, [0, 0, H], clase);
      part(n + '_carcasa', cyl(0.36, 0.36, 0.28, 16), 'body', x + 0.35, 0.5, z, [0, 0, H], clase);
      part(n + '_descarga', cyl(0.08, 0.08, 0.9, 10), 'dark', x + 0.35, 0.95, z, null, clase);
    },
    tanque: function (n, x, z, r, h, clase) {
      part(n, cyl(r, r, h, 24), 'body', x, h / 2, z, null, clase);
      part(n + '_techo', new THREE.ConeGeometry(r, r * 0.42, 24), 'light', x, h + r * 0.21, z, null, clase);
    },
    transformador: function (n, x, z, clase) {
      part(n, box(1.1, 1.1, 0.9), 'body', x, 0.55, z, null, clase);
      part(n + '_radiador', box(0.22, 0.8, 0.8), 'dark', x + 0.68, 0.5, z, null, clase);
    },
    portico: function (x, z, clase) {
      part('portico_poste1', box(0.14, 2.8, 0.14), 'light', x, 1.4, z - 2.0, null, clase);
      part('portico_poste2', box(0.14, 2.8, 0.14), 'light', x, 1.4, z + 2.0, null, clase);
      part('portico_viga', box(0.14, 0.14, 4.14), 'light', x, 2.8, z, null, clase);
    },
    cuartoElectrico: function (x, z, clase) {
      part('cuarto_electrico', box(2.0, 1.8, 1.6), 'body', x, 0.9, z, null, clase);
      part('cuarto_electrico_techo', box(2.2, 0.12, 1.8), 'light', x, 1.86, z, null, clase);
      [-0.55, 0.0, 0.55].forEach(function (dx, i) { part('cuarto_electrico_tablero' + (i + 1), box(0.44, 1.2, 0.08), 'dark', x + dx, 0.75, z + 0.84, null, clase); });
    },
    torreEnfriamiento: function (x, z, celdas, clase) {
      var w = (celdas[celdas.length - 1] - celdas[0]) + 2.4;
      part('torre_enfriamiento', box(w, 1.5, 2.2), 'body', x, 0.75, z, null, clase);
      celdas.forEach(function (cx, i) {
        part('torre_celda' + (i + 1) + '_campana', cyl(0.85, 0.8, 0.5, 24, true), 'light', cx, 1.75, z, null, clase, { double: true });
        var bladeGeo = box(1.45, 0.05, 0.18);
        var f = part('torre_celda' + (i + 1) + '_ventilador', bladeGeo, 'dark', cx, 1.62, z, null, clase, { anima: 'gira' });
        var b2 = new THREE.Mesh(bladeGeo, f.mat); b2.rotation.y = H;
        b2.add(new THREE.LineSegments(new THREE.EdgesGeometry(bladeGeo, 25), f.lmat));
        f.mesh.add(b2);
      });
    },
    nave: function (x, z, w, h, d, clase) {
      part('nave', box(w, h, d), 'body', x, h / 2, z, null, clase);
      P.techoDosAguas(x, z, w, d, h, clase);
    },
    techoDosAguas: function (x, z, w, d, h, clase) {
      var s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, w * 0.18); s.lineTo(-w / 2, 0);
      var g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2);
      part('nave_techo_' + x.toFixed(0), g, 'light', x, h + 0.001, z, null, clase);
    }
  };

  var def = planta(P);
  $('kt').textContent = def.kpi || 'Confiabilidad de la planta';

  // Equipos con su letra y sus técnicas recomendadas
  var EQUIPOS = def.equipos;
  var marcasEl = $('marcas');
  EQUIPOS.forEach(function (e) {
    e.v = new THREE.Vector3(e.pos[0], e.pos[1], e.pos[2]);
    var el = document.createElement('div'); el.className = 'ge-abs ge-mk';
    el.innerHTML = '<div class="ge-letra" style="--c:' + HEX[e.clase] + '">' + e.clase + '</div>' +
      '<div class="ge-tec">' + e.tec.map(function (k) { return '<i>' + ICONO[k] + '</i>'; }).join('') + '</div>';
    marcasEl.appendChild(el);
    e.el = el; e.letra = el.firstChild; e.tecEl = el.lastChild;
  });

  // Ruta de inspección a ras de piso
  var rutaPts = def.ruta.map(function (p) { return new THREE.Vector3(p[0], 0.06, p[1]); });
  var rutaCurva = new THREE.CatmullRomCurve3(rutaPts, false, 'catmullrom', 0.2);
  var rutaGeo = new THREE.BufferGeometry().setFromPoints(rutaCurva.getPoints(220));
  var rutaMat = new THREE.LineDashedMaterial({ color: C.gold, dashSize: 0.35, gapSize: 0.22, transparent: true, opacity: 0 });
  var ruta = new THREE.Line(rutaGeo, rutaMat); ruta.computeLineDistances(); scene.add(ruta);
  var rutaTubo = new THREE.Mesh(new THREE.TubeGeometry(rutaCurva, 220, 0.09, 6, false), new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0, depthWrite: false }));
  scene.add(rutaTubo);
  var tuboN = rutaTubo.geometry.index.count;
  var rutaN = rutaGeo.attributes.position.count;
  var caminante = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), new THREE.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0 }));
  scene.add(caminante);

  // Sensores en los equipos A
  var sensorMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0 });
  var haloMat = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, depthWrite: false });
  var sensores = def.sensores.map(function (p, i) {
    var s = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), sensorMat); s.position.set(p[0], p[1], p[2]); scene.add(s);
    var h = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), haloMat.clone()); h.position.copy(s.position); scene.add(h);
    return { s: s, h: h, f: i * 0.37 };
  });

  var pasosEl = [0, 1, 2, 3].map(function (i) { return $('p' + i); });
  var kpi = $('kpi'), k1 = $('k1'), k2 = $('k2'), k3 = $('k3'), k4 = $('k4');

  var W = 1, Hh = 1, dO = 30, narrow = false;
  var FOV = 28, tanH = Math.tan(FOV * Math.PI / 360);
  var running = false, raf = 0, last = 0, inView = true, vivo = true;
  function resize() {
    W = Math.max(1, root.clientWidth); Hh = Math.max(1, root.clientHeight);
    renderer.setSize(W, Hh, false); camera.aspect = W / Hh; camera.updateProjectionMatrix();
    narrow = W < 720; root.classList.toggle('narrow', narrow);
    dO = Math.max(9 / tanH, 12.4 / (tanH * camera.aspect)) * (narrow ? 0.98 : 0.86);
    if (!running) frame(0);
  }

  var mx = 0, my = 0, sx = 0, sy = 0;
  function alMover(e) {
    var r = root.getBoundingClientRect();
    mx = clamp01((e.clientX - r.left) / r.width) * 2 - 1; my = clamp01((e.clientY - r.top) / r.height) * 2 - 1;
  }
  function alSalir() { mx = 0; my = 0; }
  root.addEventListener('pointermove', alMover);
  root.addEventListener('pointerleave', alSalir);

  var tmp = new THREE.Vector3(), tgt = new THREE.Vector3(0, 0.6, 0.8);
  function proj(v) { tmp.copy(v).project(camera); return { x: (tmp.x + 1) / 2 * W, y: (1 - tmp.y) / 2 * Hh, ok: tmp.z < 1 }; }
  function place(el, x, y, a) { el.style.opacity = a.toFixed(3); el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; }

  var elapsed = 0, pasoKey = -2;
  function frame(dt) {
    if (!vivo) return;
    elapsed += dt;
    var t = reduced ? 18.5 : elapsed % LOOP;
    var still = reduced;
    sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;

    var kp = still ? 1 : ease(seg(t, T.kpi - 0.2, T.kpi + 0.8)) * (1 - ease(seg(t, T.fin, T.fin + 0.8)));
    var az = Math.PI / 4 + (still ? 0 : 0.12 * Math.sin(2 * Math.PI * t / LOOP)) + (still ? 0 : sx * 0.1);
    var el = 0.62 + (still ? 0 : -sy * 0.05);
    var off = narrow ? 0 : 0.18 * dO * tanH * camera.aspect * kp;
    var cx = Math.cos(az) * off, cz = -Math.sin(az) * off;
    var dist = dO * (narrow ? 1 + 0.12 * kp : 1);
    camera.position.set(tgt.x + cx + dist * Math.cos(el) * Math.sin(az), tgt.y + dist * Math.sin(el) - (narrow ? 1.2 * kp : 0), tgt.z + cz + dist * Math.cos(el) * Math.cos(az));
    camera.lookAt(tgt.x + cx, tgt.y - (narrow ? 1.2 * kp : 0), tgt.z + cz);

    var fCrit = still ? 0 : ease(seg(t, T.crit, T.crit + 0.6)) * (1 - ease(seg(t, T.tec + 0.2, T.tec + 0.9)));
    var fVerde = still ? 1 : ease(seg(t, T.kpi + 0.4, T.kpi + 1.6)) * (1 - ease(seg(t, T.fin, T.fin + 0.6)));

    var N = pieces.length;
    pieces.forEach(function (p, i) {
      var t0 = T.arma + i * 2.2 / N;
      var a = still ? 1 : ease(seg(t, t0, t0 + 0.35)), s2 = still ? 1 : ease(seg(t, t0 + 0.45, t0 + 0.95));
      var d0 = T.fin + 0.4 + (N - 1 - i) / N * 0.4;
      var ds = still ? 0 : ease(seg(t, d0, d0 + 0.3)), dl = still ? 0 : ease(seg(t, d0 + 0.2, d0 + 0.5));
      p.mesh.position.y = p.y + (1 - a) * 0.8 + dl * 0.4 + (p.anima === 'prensa' && !still ? 0.35 * (0.5 + 0.5 * Math.sin(elapsed * 2.4 + i)) : 0);
      var solid = s2 * (1 - ds);
      var line = a * (1 - dl) * (0.95 - 0.4 * solid);
      p.lmat.color.setHex(C.cyan);
      if (fCrit > 0) p.lmat.color.lerp(cCol[p.clase], fCrit);
      if (fVerde > 0) p.lmat.color.lerp(green, fVerde * 0.8);
      p.lmat.opacity = Math.min(1, line + fCrit * 0.5 * (line > 0 ? 1 : 0));
      p.mat.emissive.copy(p.emi0); p.mat.emissiveIntensity = p.mat.name === 'agua' ? 0.45 : 0.28;
      if (fCrit > 0) { p.mat.emissive.lerp(cCol[p.clase], 0.75 * fCrit); p.mat.emissiveIntensity = 0.28 + 0.35 * fCrit; }
      if (fVerde > 0) { p.mat.emissive.lerp(green, 0.45 * fVerde); p.mat.emissiveIntensity = 0.28 + 0.12 * fVerde; }
      p.mat.opacity = solid;
      p.mat.visible = solid > 0.004; p.lmat.visible = p.lmat.opacity > 0.004;
    });
    animadas.forEach(function (p, i) {
      if (p.anima === 'gira') p.mesh.rotation.y = still ? i * 0.4 : elapsed * 0.9 + i * 0.7;
      else if (p.anima === 'gira-lento') p.mesh.rotation.y = still ? 0.6 : elapsed * 0.25;
      else if (p.anima === 'rotor') p.mesh.rotation.x = still ? i * 0.7 : elapsed * 1.1 + i * 0.7;
    });

    var fRuta = still ? 1 : ease(seg(t, T.ruta, T.ruta + 0.8)) * (1 - ease(seg(t, T.fin, T.fin + 0.5)));
    var traz = still ? 1 : ease(seg(t, T.ruta, T.ruta + 2.2));
    rutaGeo.setDrawRange(0, Math.max(2, Math.floor(rutaN * traz)));
    rutaMat.opacity = 0.95 * fRuta; ruta.visible = fRuta > 0.01;
    rutaTubo.geometry.setDrawRange(0, Math.floor(tuboN * traz / 6) * 6);
    rutaTubo.material.opacity = 0.35 * fRuta; rutaTubo.visible = fRuta > 0.01;
    var u = still ? 0.6 : ((t - T.ruta) * 0.16) % 1;
    caminante.position.copy(rutaCurva.getPointAt(clamp01(u < 0 ? 0 : u)));
    caminante.position.y = 0.22;
    caminante.material.opacity = fRuta * seg(t, T.ruta + 0.6, T.ruta + 1.0) * (still ? 0 : 1);
    var fSens = still ? 1 : ease(seg(t, T.ruta + 1.2, T.ruta + 1.8)) * (1 - ease(seg(t, T.fin, T.fin + 0.5)));
    sensorMat.opacity = fSens;
    sensores.forEach(function (s) {
      var ph = still ? 0.5 : ((elapsed * 0.9 + s.f) % 1);
      s.h.scale.setScalar(1 + 2.4 * ph);
      s.h.material.opacity = fSens * 0.55 * (1 - ph);
      s.s.visible = s.h.visible = fSens > 0.01;
    });

    renderer.render(scene, camera);

    var paso = still ? 3 : t < T.crit - 0.2 ? -1 : t < T.tec ? 0 : t < T.ruta ? 1 : t < T.kpi ? 2 : t < T.fin + 0.4 ? 3 : -1;
    if (paso !== pasoKey) {
      pasoKey = paso;
      pasosEl.forEach(function (p, i) { p.classList.toggle('on', i === paso); p.classList.toggle('hecho', paso > i); });
    }
    var fPasos = still ? 1 : ease(seg(t, T.crit - 0.4, T.crit)) * (1 - ease(seg(t, T.fin + 0.3, T.fin + 0.8)));
    $('pasos').style.opacity = fPasos.toFixed(3);

    var fLetra = still ? 0 : ease(seg(t, T.crit + 0.3, T.crit + 0.8)) * (1 - ease(seg(t, T.tec - 0.2, T.tec + 0.2)));
    var fTec = still ? 0 : ease(seg(t, T.tec + 0.3, T.tec + 0.8)) * (1 - ease(seg(t, T.ruta - 0.2, T.ruta + 0.2)));
    EQUIPOS.forEach(function (e, i) {
      var q = proj(e.v);
      var d = i * 0.08;
      var a1 = still ? 0 : ease(seg(t, T.crit + 0.3 + d, T.crit + 0.8 + d)) * (fLetra > 0 ? 1 : 0) * fLetra;
      var a2 = still ? 0 : ease(seg(t, T.tec + 0.3 + d, T.tec + 0.8 + d)) * (fTec > 0 ? 1 : 0) * fTec;
      e.letra.style.opacity = a1.toFixed(3);
      e.tecEl.style.opacity = a2.toFixed(3);
      place(e.el, q.x, q.y, q.ok && (a1 > 0.001 || a2 > 0.001) ? 1 : 0);
    });

    var fK = still ? 1 : ease(seg(t, T.kpi, T.kpi + 0.6)) * (1 - ease(seg(t, T.fin, T.fin + 0.6)));
    var nk = still ? 1 : ease(seg(t, T.kpi + 0.4, T.kpi + 2.6));
    k1.textContent = lerp(96.1, 98.7, nk).toFixed(1) + ' %';
    k2.textContent = Math.round(lerp(410, 620, nk)) + ' h';
    k3.textContent = lerp(9.5, 4.2, nk).toFixed(1) + ' h';
    k4.textContent = Math.round(lerp(12, 2, nk));
    kpi.style.opacity = fK.toFixed(3);
    kpi.style.transform = narrow ? 'translateY(' + ((1 - fK) * 14).toFixed(1) + 'px)' : 'translate(' + ((1 - fK) * 18).toFixed(1) + 'px,-50%)';
  }

  function loop(now) { var dt = Math.min(0.1, (now - last) / 1000); last = now; frame(dt); raf = requestAnimationFrame(loop); }
  function sync() {
    var run = vivo && inView && !document.hidden && !reduced;
    if (run && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!run && running) { running = false; cancelAnimationFrame(raf); }
  }
  var io = new IntersectionObserver(function (es) { inView = es[0].isIntersecting; sync(); }, { threshold: 0.01 });
  io.observe(root);
  document.addEventListener('visibilitychange', sync);
  var ro = new ResizeObserver(resize);
  ro.observe(root);
  // para revisar un instante fijo desde la consola: raiz.seek(segundos)
  root.seek = function (s) { elapsed = s; frame(0); };
  resize(); frame(0); sync();
  if (document.fonts) document.fonts.ready.then(function () { if (!running && vivo) frame(0); });

  return function limpiar() {
    vivo = false;
    cancelAnimationFrame(raf); running = false;
    io.disconnect(); ro.disconnect();
    document.removeEventListener('visibilitychange', sync);
    root.removeEventListener('pointermove', alMover);
    root.removeEventListener('pointerleave', alSalir);
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
    });
    renderer.dispose();
    root.remove(); estilo.remove();
  };
}
