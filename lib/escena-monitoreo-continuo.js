/**
 * Escena de la página general de /servicios/monitoreo-continuo: los
 * sensores vigilan cuatro equipos de una planta (motor con bomba, ventilador
 * de torre, tablero con cámara térmica y transformador con gases disueltos y
 * sensor acústico), cada lectura viaja a la estación base y de ahí al panel
 * de IDAP, y en cada vuelta un equipo distinto se alarma con los valores de
 * su disciplina: vibración (ISO 10816-3, 4.5 y 7.1 mm/s), diferencia entre
 * fases en termografía (4 y 15 °C) y gases combustibles totales (720 y
 * 1920 ppm). El especialista revisa la evidencia y llega el aviso con qué
 * hacer. Ciclo de 12 s por vuelta. Datos de ejemplo, sin clientes.
 *
 * Generada en Claude Diseño por Emiliano (2026-09-30) para three r184 y
 * portada a r128 con scratchpad/mc3d/portar.py: salida sRGB con
 * outputEncoding, colores hex pasados a lineal y luces entre pi para que se
 * vea igual que en r184. Recibe THREE, el contenedor y opciones
 * ({ fuente, reducirMovimiento }) y devuelve la limpieza. El original está
 * en docs/designs/monitoreo-continuo-escena.html.
 */
/* eslint-disable */
var CSS = ".mc3d{position: relative; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; background: linear-gradient(180deg, #f7faff 0%, #eef3fb 45%, #dfe9f6 100%); font-family:inherit; color: #0d1a38; font-variant-numeric: tabular-nums; font-size: clamp(10px, 1.02cqw, 14px); container-type: inline-size; -webkit-font-smoothing: antialiased;}.mc3d canvas{position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: pan-y;}.mc3d .dp-ui{position: absolute; inset: 0; pointer-events: none;}.mc3d .cap{position: absolute; left: 3.2%; top: 5%; max-width: 34em; display: grid; gap: .7em; z-index: 2;}.mc3d .chip{display: inline-flex; align-items: center; gap: .5em; justify-self: start; padding: .35em .8em .35em .6em; background: #fff; border: 1px solid #d6e0ef; border-radius: 999px; font-size: .86em; font-weight: 700; color: #1d4ed8; letter-spacing: .02em;}.mc3d .live{width: .55em; height: .55em; border-radius: 50%; background: #16a34a; box-shadow: 0 0 0 .22em rgba(22,163,74,.18);}.mc3d .cap-text{font-size: 1.32em; line-height: 1.3; font-weight: 700; text-wrap: pretty; max-width: 22em;}.mc3d .cap-text.in{animation: mc3dCapIn .5s ease both;}.mc3d .steps{display: flex; gap: .3em;}.mc3d .steps i{width: 1.6em; height: .22em; border-radius: 2px; background: #c9d5e8; transition: background .3s;}.mc3d .steps i.on{background: #1d4ed8;}@keyframes mc3dCapIn{from { opacity: 0; transform: translateY(.4em); } to { opacity: 1; transform: none; }}.mc3d .idap{position: absolute; left: 0; top: 0; width: 230px; height: 270px; box-sizing: border-box; transform-origin: 0 0; background: #fff; border: 1px solid #d3deee; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 10px 30px -12px rgba(13,26,56,.25); font-size: 11px; z-index: 1; will-change: transform;}.mc3d .idap-h{display: flex; align-items: center; justify-content: space-between; height: 18px;}.mc3d .idap-logo{font-weight: 800; color: #1d4ed8; font-size: 14px; letter-spacing: .04em;}.mc3d .idap-on{display: flex; align-items: center; gap: 5px; color: #5b6b86; font-weight: 600; font-size: 10px;}.mc3d .idap-on .live{width: 6px; height: 6px; box-shadow: 0 0 0 2px rgba(22,163,74,.18);}.mc3d .card{flex: 1; background: #f4f7fc; border: 1px solid #e3eaf5; border-radius: 8px; padding: 4px 8px 3px; display: flex; flex-direction: column; gap: 1px; transition: background .25s, border-color .25s;}.mc3d .card.hit{background: #e8efff; border-color: #b9ccf5;}.mc3d .card .row{display: flex; align-items: center; gap: 6px; height: 13px;}.mc3d .card .dot{width: 7px; height: 7px; border-radius: 50%; background: #16a34a; flex: none; transition: background .3s;}.mc3d .card .nm{font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}.mc3d .card .st{font-weight: 700; color: #16a34a; font-size: 10px;}.mc3d .card .row2{display: flex; align-items: stretch; gap: 6px; flex: 1;}.mc3d .card .row2 .val{align-self: center;}.mc3d .card .gr{flex: 1; position: relative;}.mc3d .card .gr svg{position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible;}.mc3d .thl{position: absolute; right: 0; transform: translateY(-50%); font-size: 7.5px; font-weight: 700; line-height: 1;}.mc3d .card .val{font-weight: 600; color: #5b6b86; font-size: 10px; min-width: 56px; text-align: right; white-space: nowrap;}.mc3d .card.warn .dot{background: #ca8a04;}.mc3d .card.warn .st{color: #ca8a04;}.mc3d .card.warn .val{color: #ca8a04;}.mc3d .card.alarm .dot{background: #dc2626;}.mc3d .card.alarm .st{color: #dc2626;}.mc3d .card.alarm .val{color: #dc2626;}.mc3d .spec,.mc3d .alert{position: absolute; right: 3.2%; width: 27em; background: #fff; border: 1px solid #d3deee; border-radius: 12px; box-shadow: 0 14px 34px -16px rgba(13,26,56,.3); padding: 1em 1.1em; box-sizing: border-box; z-index: 2; opacity: 0; transform: translateY(.8em); transition: opacity .5s ease, transform .5s ease;}.mc3d .spec{top: 6%;}.mc3d .alert{bottom: 6%;}.mc3d .spec.show,.mc3d .alert.show{opacity: 1; transform: none;}.mc3d .eyebrow{font-size: .82em; font-weight: 700; color: #5b6b86; letter-spacing: .03em;}.mc3d .spec-t{font-size: 1.12em; font-weight: 700; margin-top: .15em;}.mc3d .spec-plot{position: relative; margin-top: .8em; height: 7.5em;}.mc3d .spec-plot svg{position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible;}.mc3d .peak{position: absolute; top: -.2em; transform: translateX(.6em); font-size: .86em; font-weight: 700; color: #ca8a04; white-space: nowrap;}.mc3d .spec-ax{display: flex; justify-content: flex-end; font-size: .8em; color: #5b6b86; margin-top: .35em;}.mc3d .al-top{display: flex; align-items: center; justify-content: space-between; gap: .8em;}.mc3d .al-t{font-size: 1.12em; font-weight: 800; line-height: 1.25; flex: 1; min-width: 0;}.mc3d .al-top .badge{flex: none;}.mc3d .badge{font-size: .84em; font-weight: 800; color: #fff; background: #ca8a04; padding: .25em .7em; border-radius: 999px; white-space: nowrap;}.mc3d .al-d{margin-top: .5em; color: #0d1a38; font-size: 1em; line-height: 1.4;}.mc3d .al-q{margin-top: .6em; padding-top: .6em; border-top: 1px solid #e3eaf5; font-weight: 600; line-height: 1.4;}.mc3d .al-q b{color: #1d4ed8;}.mc3d .badge.red{background: #dc2626;}.mc3d .termo{height: 7.5em; margin-top: .8em; border-radius: 8px; background: linear-gradient(180deg, #26306a, #0d1a38); display: grid; grid-template-columns: repeat(3, 1fr); gap: .6em; padding: .6em .8em; box-sizing: border-box;}.mc3d .fase{position: relative; display: flex; flex-direction: column; align-items: center; justify-content: space-between;}.mc3d .fase .calor{position: absolute; inset: 0 0 1.5em 0; border-radius: 6px;}.mc3d .fase.tibia .calor{background: radial-gradient(ellipse 45% 50% at 50% 45%, #fde68a 0 12%, #ca8a04 45%, rgba(202,138,4,0) 100%);}.mc3d .fase.caliente .calor{background: radial-gradient(ellipse 55% 60% at 50% 45%, #fff4e0 0 10%, #dc2626 42%, rgba(220,38,38,0) 100%);}.mc3d .fase .borne{position: relative; width: 36%; height: 52%; margin-top: 8%; border: 1px solid rgba(255,255,255,.4); border-radius: 3px;}.mc3d .fase span{position: relative; color: #fff; font-size: .8em; font-weight: 700; white-space: nowrap;}.mc3d .duval{display: flex; gap: .9em; align-items: center; margin-top: .6em;}.mc3d .tri{position: relative; height: 9em; aspect-ratio: 128 / 115; flex: none;}.mc3d .tri svg{position: absolute; inset: 0; width: 100%; height: 100%;}.mc3d .cn{position: absolute; font-size: .72em; color: #5b6b86; font-weight: 600; line-height: 1;}.mc3d .cn.t{top: 0; left: 50%; transform: translateX(-50%);}.mc3d .cn.bl{left: 0; bottom: 0;}.mc3d .cn.br{right: 0; bottom: 0;}.mc3d .tri-t{display: grid; gap: .45em; font-size: .92em; line-height: 1.3;}.mc3d .zona{display: flex; gap: .45em; font-weight: 700;}.mc3d .zona i{flex: none; width: .8em; height: .8em; margin-top: .2em; border-radius: 2px; background: rgba(202,138,4,.3); border: 1.5px solid #ca8a04;}.mc3d .gas{color: #5b6b86;}.mc3d .demo{position: absolute; left: 3.2%; bottom: 3%; font-size: .8em; font-weight: 600; color: #5b6b86;}.mc3d .tip{position: absolute; left: 0; top: 0; transform: translate(-50%, calc(-100% - 10px)); background: #fff; border: 1px solid #b9ccf5; border-radius: 10px; padding: .6em .8em; box-shadow: 0 10px 24px -12px rgba(13,26,56,.35); z-index: 3; min-width: 13em; opacity: 0; transition: opacity .15s;}.mc3d .tip.show{opacity: 1;}.mc3d .tip-n{font-weight: 800; font-size: 1.05em;}.mc3d .tip-s{color: #5b6b86; font-size: .9em; margin-top: .1em;}.mc3d .tip-v{margin-top: .45em; display: flex; justify-content: space-between; gap: 1em; font-size: .92em;}.mc3d .tip-v b{font-weight: 700;}.mc3d .tip-h{margin-top: .4em; font-size: .8em; color: #1d4ed8; font-weight: 700;}.mc3d .sheet{position: absolute; left: 3.2%; bottom: 6%; width: 25em; background: #fff; border: 1px solid #d3deee; border-radius: 12px; box-shadow: 0 18px 40px -18px rgba(13,26,56,.35); padding: 1em 1.1em; box-sizing: border-box; z-index: 4; pointer-events: auto; opacity: 0; visibility: hidden; transform: translateY(.6em); transition: opacity .25s, transform .25s, visibility .25s;}.mc3d .sheet.show{opacity: 1; visibility: visible; transform: none;}.mc3d .sh-top{display: flex; justify-content: space-between; align-items: flex-start; gap: .8em;}.mc3d .sh-n{font-weight: 800; font-size: 1.12em;}.mc3d .sh-s{color: #5b6b86; font-size: .9em; margin-top: .1em;}.mc3d .sh-x{width: 2.2em; height: 2.2em; min-width: 32px; min-height: 32px; border: 1px solid #d3deee; background: #f7faff; border-radius: 8px; color: #0d1a38; font: inherit; font-size: 1em; cursor: pointer; display: grid; place-items: center;}.mc3d .sh-x:hover{background: #e8efff;}.mc3d .sh-m{display: flex; align-items: center; justify-content: space-between; margin-top: .7em; font-size: .92em;}.mc3d .pill{font-weight: 800; font-size: .86em; padding: .2em .65em; border-radius: 999px; color: #fff; background: #16a34a;}.mc3d .pill.warn{background: #ca8a04;}.mc3d .pill.alarm{background: #dc2626;}.mc3d .sh-lbl{font-size: .82em; color: #5b6b86; font-weight: 600; margin-top: .8em;}.mc3d .sh-g{position: relative; height: 5.5em; margin-top: .3em;}.mc3d .sh-c{position: absolute; inset: 0; width: 100%; height: 100%; display: block; overflow: visible;}.mc3d .sh-g .thl{font-size: .72em;}.mc3d .sh-ax{display: flex; justify-content: space-between; font-size: .8em; color: #5b6b86; margin-top: .3em;}.mc3d.is-narrow .cap{left: 3%; top: 4%; gap: .45em; max-width: 46%;}.mc3d.is-narrow .cap-text{font-size: 1.05em;}.mc3d.is-narrow .steps{display: none;}.mc3d.is-narrow .spec{width: 52%; top: 4%; right: 3%; padding: .6em .7em;}.mc3d.is-narrow .spec-plot{height: 4.2em; margin-top: .4em;}.mc3d.is-narrow .spec-ax,.mc3d.is-narrow .spec .eyebrow{display: none;}.mc3d.is-narrow .spec-t,.mc3d.is-narrow .al-t{font-size: 1em;}.mc3d.is-narrow .alert{width: 60%; bottom: 4%; right: 3%; padding: .6em .7em;}.mc3d.is-narrow .al-d,.mc3d.is-narrow .al-q{margin-top: .3em; padding-top: .3em; font-size: .95em; line-height: 1.3;}.mc3d.is-narrow .sheet{left: 3%; right: 3%; width: auto; bottom: 3%; padding: .7em .8em;}.mc3d.is-narrow .sh-g{height: 3.6em;}.mc3d.is-narrow .termo{height: 4.4em; margin-top: .4em; padding: .4em; gap: .3em;}.mc3d.is-narrow .fase span{font-size: .7em;}.mc3d.is-narrow .duval{margin-top: .4em; gap: .5em;}.mc3d.is-narrow .tri{height: 4.6em;}.mc3d.is-narrow .gas,.mc3d.is-narrow .demo,.mc3d.is-narrow .cn{display: none;}.mc3d.is-narrow.zoomed .cap{opacity: 0;}.mc3d.focused .cap{opacity: 0;}.mc3d .sh-last{white-space: nowrap;}.mc3d .cap{transition: opacity .4s;}@media (prefers-reduced-motion: reduce){.mc3d *{transition: none !important; animation: none !important;}}";

var HTML = "<canvas aria-hidden=\"true\"></canvas>\n<div class=\"dp-ui\">\n<div class=\"cap\">\n<div class=\"chip\"><span class=\"live\"></span>Monitoreo continuo · 24/7</div>\n<div class=\"cap-text\" data-id=\"capText\" aria-live=\"polite\"></div>\n<div class=\"steps\" data-id=\"steps\"></div>\n</div>\n<div class=\"idap\" data-id=\"idap\">\n<div class=\"idap-h\"><span class=\"idap-logo\">IDAP</span><span class=\"idap-on\"><span class=\"live\"></span>En línea</span></div>\n</div>\n<div class=\"spec\" data-id=\"spec\">\n<div class=\"eyebrow\" data-id=\"evEye\">Vibración · Bomba 3 · datos de ejemplo</div>\n<div class=\"spec-t\" data-id=\"evTit\">El especialista revisa el espectro</div>\n<div class=\"ev\" data-ev=\"espectro\">\n<div class=\"spec-plot\">\n<svg viewBox=\"0 0 300 100\" preserveAspectRatio=\"none\">\n<path data-id=\"specArea\" fill=\"#1d4ed8\" fill-opacity=\".08\"></path>\n<polyline data-id=\"specLine\" fill=\"none\" stroke=\"#1d4ed8\" stroke-width=\"1.5\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\"></polyline>\n<line data-id=\"peakLine\" y1=\"100\" stroke=\"#ca8a04\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\" vector-effect=\"non-scaling-stroke\"></line>\n</svg>\n<div class=\"peak\" data-id=\"peakLbl\">Pista externa del rodamiento</div>\n</div>\n<div class=\"spec-ax\">Frecuencia →</div>\n</div>\n<div class=\"ev termo\" data-ev=\"termo\" style=\"display:none\">\n<div class=\"fase tibia\"><div class=\"calor\"></div><div class=\"borne\"></div><span>Fase A · 42 °C</span></div>\n<div class=\"fase caliente\"><div class=\"calor\"></div><div class=\"borne\"></div><span>Fase B · 91 °C</span></div>\n<div class=\"fase tibia\"><div class=\"calor\"></div><div class=\"borne\"></div><span>Fase C · 42 °C</span></div>\n</div>\n<div class=\"ev duval\" data-ev=\"duval\" style=\"display:none\">\n<div class=\"tri\"><svg data-id=\"duvalSvg\" viewBox=\"-14 -15 128 115\"></svg><span class=\"cn t\">Metano</span><span class=\"cn bl\">Acetileno</span><span class=\"cn br\">Etileno</span></div>\n<div class=\"tri-t\">\n<div class=\"zona\"><i></i><span>T2, falla térmica de 300 a 700 °C</span></div>\n<div class=\"gas\">Metano y etileno son los gases que más suben.</div>\n<div class=\"gas\">Gases combustibles totales: 850 ppm</div>\n</div>\n</div>\n</div>\n<div class=\"alert\" data-id=\"alert\" role=\"status\">\n<div class=\"al-top\"><div class=\"al-t\" data-id=\"alT\">Bomba 3 · rodamiento del motor</div><span class=\"badge\" data-id=\"alB\">Precaución</span></div>\n<div class=\"al-d\" data-id=\"alD\">Defecto en la pista externa, en etapa temprana</div>\n<div class=\"al-q\"><b>Qué hacer:</b> <span data-id=\"alQ\">cambiarlo en el paro del sábado</span></div>\n</div>\n<div class=\"tip\" data-id=\"tip\">\n<div class=\"tip-n\"></div>\n<div class=\"tip-s\"></div>\n<div class=\"tip-v\"><span data-id=\"tipVar\">Última lectura</span><b data-id=\"tipVal\"></b></div>\n<div class=\"tip-v\" data-id=\"tipMaxRow\" style=\"display:none\"><span>Temperatura máxima</span><b data-id=\"tipMax\"></b></div>\n<div class=\"tip-h\"></div>\n</div>\n<div class=\"demo\">Datos de ejemplo</div>\n<div class=\"sheet\" data-id=\"sheet\" role=\"dialog\" aria-label=\"Ficha del equipo\">\n<div class=\"sh-top\">\n<div><div class=\"sh-n\"></div><div class=\"sh-s\"></div></div>\n<button class=\"sh-x\" type=\"button\" aria-label=\"Cerrar ficha\">×</button>\n</div>\n<div class=\"sh-m\"><span class=\"pill\">Normal</span><span class=\"sh-last\"></span></div>\n<div class=\"sh-lbl\">Tendencia de los últimos 7 días · datos de ejemplo</div>\n<div class=\"sh-g\">\n<svg class=\"sh-c\" viewBox=\"0 0 240 60\" preserveAspectRatio=\"none\">\n<line data-id=\"shThA\" x1=\"0\" x2=\"190\" stroke=\"#ca8a04\" stroke-width=\"1\" stroke-dasharray=\"4 3\" vector-effect=\"non-scaling-stroke\"></line>\n<line data-id=\"shThR\" x1=\"0\" x2=\"190\" stroke=\"#dc2626\" stroke-width=\"1\" stroke-dasharray=\"4 3\" vector-effect=\"non-scaling-stroke\"></line>\n<polyline data-id=\"shLine\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"1.8\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\"></polyline>\n</svg>\n<span class=\"thl\" data-id=\"shLa\" style=\"color:#ca8a04\"></span><span class=\"thl\" data-id=\"shLr\" style=\"color:#dc2626\"></span>\n</div>\n<div class=\"sh-ax\"><span>Hace 7 días</span><span>Hoy</span></div>\n</div>\n</div>";

export function montarEscenaMonitoreo(THREE, container, opciones) {
  opciones = opciones || {};
  if (!document.getElementById("mc3d-estilos")) {
    var st = document.createElement("style");
    st.id = "mc3d-estilos";
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  var hero = document.createElement("section");
  hero.className = "mc3d";
  hero.setAttribute("aria-label", "Escena animada: los sensores vigilan los equipos de la planta y envían sus lecturas a la plataforma IDAP");
  hero.innerHTML = HTML;
  if (opciones.fuente) hero.style.fontFamily = opciones.fuente;
  container.appendChild(hero);

  var destruida = false;

  /* =====================================================================
     1. CONFIGURACIÓN GENERAL
     ===================================================================== */
  const CICLO = 12;                 // duración de cada vuelta en segundos (una falla por vuelta)
  const PERIODO_PULSO = 2;          // cada sensor envía una lectura cada 2 s (representa 10 min)
  const T_VIAJE_BASE = 1.0;         // sensor → estación base
  const T_VIAJE_IDAP = 0.75;        // estación base → panel IDAP
  const HIST = 10;                  // puntos visibles en cada tendencia del panel
  const deg = Math.PI / 180;

  const COL = { azul: 0x1d4ed8, verde: 0x16a34a, ambar: 0xca8a04, rojo: 0xdc2626 };

  // Equipos: cada uno se mide en la unidad de su disciplina (datos de ejemplo, sin marcas ni números de serie)
  // prec = umbral de precaución (ámbar) · alarma = umbral de alarma (rojo) · pico = valor al que llega en su evento
  const EQUIPOS = [
    { id: 'bomba', nombre: 'Bomba 3', corto: 'Bomba 3', sensor: 'Vibración · 2 sensores en rodamientos', variable: 'Vibración global (velocidad)',
      unidad: 'mm/s', base: 2.2, ruido: .1, min: 0, max: 9, prec: 4.5, alarma: 7.1, pico: 5.6, dec: 1 },
    { id: 'ventilador', nombre: 'Ventilador de torre', corto: 'Ventilador', sensor: 'Vibración · sensor en el motor', variable: 'Vibración global (velocidad)',
      unidad: 'mm/s', base: 1.6, ruido: .1, min: 0, max: 9, prec: 4.5, alarma: 7.1, pico: 7.8, dec: 1 },
    { id: 'tablero', nombre: 'Tablero de fuerza', corto: 'Tablero', sensor: 'Termografía · cámara fija', variable: 'Diferencia entre fases',
      unidad: '°C', pref: 'ΔT ', base: 1, ruido: .25, min: 0, max: 55, raiz: true, prec: 4, alarma: 15, pico: 49, dec: 0 },
    { id: 'transformador', nombre: 'Transformador', corto: 'Transformador', sensor: 'Gases disueltos en línea y acústico', variable: 'Gases combustibles totales',
      unidad: 'ppm', base: 180, ruido: 6, min: 0, max: 2100, prec: 720, alarma: 1920, pico: 850, dec: 0 },
  ];

  // Un evento por vuelta, en este orden; los demás equipos siguen en verde
  const EVENTOS = [
    { eq: 0, estado: 1, subida: 'La vibración de la Bomba 3 empezó a subir.',
      eyebrow: 'Vibración · Bomba 3', titulo: 'El especialista revisa el espectro', tipo: 'espectro', espectro: 'rodamiento', marca: 'Pista externa del rodamiento',
      aviso: { t: 'Bomba 3 · rodamiento del motor', nivel: 'Precaución', d: 'Defecto en la pista externa, en etapa temprana', q: 'cambiarlo en el paro del sábado' } },
    { eq: 1, estado: 2, subida: 'La vibración del ventilador de torre se disparó.',
      eyebrow: 'Vibración · Ventilador de torre', titulo: 'El especialista revisa el espectro', tipo: 'espectro', espectro: 'desbalance', marca: '1X, velocidad de giro',
      aviso: { t: 'Ventilador de torre', nivel: 'Alarma', d: 'Desbalance por acumulación de material en las aspas', q: 'limpiar las aspas y balancear en sitio' } },
    { eq: 2, estado: 2, subida: 'La fase B del tablero se está calentando.',
      eyebrow: 'Termografía · Tablero de fuerza', titulo: 'El especialista revisa el termograma', tipo: 'termo',
      aviso: { t: 'Tablero de fuerza', nivel: 'Alarma', d: 'La fase B se calienta sola: patrón de conexión floja', q: 'bajar la carga y reapretar la conexión en la próxima ventana' } },
    { eq: 3, estado: 1, subida: 'Los gases del transformador van en aumento.',
      eyebrow: 'Gases disueltos · Transformador', titulo: 'El especialista revisa los gases', tipo: 'duval',
      aviso: { t: 'Transformador', nivel: 'Precaución', d: 'Gases de sobrecalentamiento en aumento', q: 'revisar la carga y confirmar con una muestra de laboratorio' } },
  ];

  const EST_TXT = ['Normal', 'Precaución', 'Alarma'];
  const EST_COL = ['#16a34a', '#ca8a04', '#dc2626'];
  const estadoDe = (e, v) => v >= e.alarma ? 2 : v >= e.prec ? 1 : 0;

  // Textos del paso actual (inicio en segundos del ciclo); el tercero cambia según el evento de la vuelta
  const PASOS = [
    [0,    'Los sensores vigilan los equipos críticos las 24 horas.'],
    [1.2,  'Cada lectura llega sola a la plataforma IDAP, cada 10 minutos.'],
    [2.5,  EVENTOS[0].subida],
    [5.6,  'Un especialista revisa qué está pasando.'],
    [7.3,  'Te avisa qué hacer antes de que el equipo falle.'],
    [10.5, 'Se atendió a tiempo. Todo vuelve a verde.'],
  ];

  /* Utilidades */
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let semilla = 11;
  const rnd = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;

  /* =====================================================================
     2. RENDERIZADOR, ESCENA, CÁMARA Y LUCES
     ===================================================================== */
  const canvas = hero.querySelector('canvas');
  const reducido = opciones.reducirMovimiento != null ? !!opciones.reducirMovimiento : !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));   // resolución limitada a 2x
  renderer.outputEncoding = THREE.sRGBEncoding;   // r128
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1.6, 0.5, 150);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c6dc, 2.0 / Math.PI));
  const sol = new THREE.DirectionalLight(0xffffff, 1.7 / Math.PI);
  sol.position.set(5, 14, 9);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 40 });
  sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.03; sol.shadow.radius = 3;
  scene.add(sol);

  /* =====================================================================
     3. MATERIALES (mate, paleta corta)
     ===================================================================== */
  const M = (name, color, o = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: .85, metalness: .04, flatShading: true, ...o });
    m.name = name; m.color.convertSRGBToLinear(); m.emissive.convertSRGBToLinear(); return m;
  };
  const mat = {
    losa:     M('losa', 0xe7ecf3),
    zona:     M('zona', 0xdce4ef),
    concreto: M('concreto', 0xcdd6e3),
    cuerpo:   M('equipo_claro', 0xbccadd),
    medio:    M('equipo_medio', 0x8494b2),
    oscuro:   M('equipo_oscuro', 0x4e5c7a),
    blanco:   M('panel', 0xfbfcfe),
    azul:     M('acento_azul', COL.azul, { roughness: .55 }),
    verde:    M('luz_verde', COL.verde, { emissive: COL.verde, emissiveIntensity: .4 }),
    cubierta: M('cubierta', 0xbccadd, { side: THREE.DoubleSide }),
  };
  const matSensor = () => M('sensor', COL.azul, { roughness: .45, emissive: COL.azul, emissiveIntensity: .25 });
  const matSensores = EQUIPOS.map(() => matSensor());   // uno por equipo: cambia de color con su estado
  const matSensorBomba = matSensores[0];
  const matAntena = M('antena', COL.azul, { emissive: COL.azul, emissiveIntensity: .3 });
  const matContorno = new THREE.MeshBasicMaterial({ color: COL.azul, side: THREE.BackSide });
  matContorno.name = 'contorno';

  /* Ayudantes de geometría */
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const Cy = (r, h, s = 16, rb = r, open = false) => new THREE.CylinderGeometry(r, rb, h, s, 1, open);
  function malla(name, geo, material, parent, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(geo, material);
    m.name = name; m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  }
  const horizontal = m => { m.rotation.z = Math.PI / 2; return m; };   // cilindro a lo largo de X

  /* =====================================================================
     4. LA PLANTA
     ===================================================================== */
  const planta = new THREE.Group(); planta.name = 'planta'; scene.add(planta);

  // Losa y zonas
  malla('losa', B(13, .35, 9), mat.losa, planta, 0, -.175, 0).castShadow = false;
  [[-3.3, -2.1], [3.3, -2.1], [-3.3, 2.1], [3.3, 2.1]].forEach(([x, z], i) =>
    malla('zona_' + (i + 1), B(5.6, .02, 3.7), mat.zona, planta, x, .011, z).castShadow = false);

  const grupos = {};      // grupos de equipos por id
  const sensores = [];    // { mesh, eq, offset }

  /* ---- 4.1 Motor con bomba ---- */
  {
    const g = new THREE.Group(); g.name = 'motor_bomba'; g.position.set(-3.3, 0, 2.1); planta.add(g);
    malla('base_concreto', B(3.4, .28, 1.3), mat.concreto, g, 0, .14, 0);
    malla('patin', B(3.2, .1, 1.0), mat.oscuro, g, 0, .33, 0);
    const yEje = .86;
    horizontal(malla('motor', Cy(.42, 1.3, 20), mat.medio, g, -.75, yEje, 0));
    for (let i = 0; i < 5; i++) horizontal(malla('aleta_' + i, Cy(.45, .04, 20), mat.medio, g, -1.25 + i * .25, yEje, 0));
    horizontal(malla('tapa_libre', Cy(.36, .1, 20), mat.oscuro, g, -1.45, yEje, 0));
    horizontal(malla('tapa_acople', Cy(.36, .1, 20), mat.oscuro, g, -.05, yEje, 0));
    malla('pata_1', B(.3, .3, .74), mat.oscuro, g, -1.15, .52, 0);
    malla('pata_2', B(.3, .3, .74), mat.oscuro, g, -.35, .52, 0);
    malla('caja_conexiones', B(.34, .22, .3), mat.cuerpo, g, -.75, yEje + .5, 0);
    malla('guarda_acople', B(.5, .42, .5), mat.azul, g, .3, yEje, 0);
    malla('pedestal_bomba', B(.55, .36, .6), mat.oscuro, g, .95, .54, 0);
    horizontal(malla('carcasa_bomba', Cy(.52, .44, 24), mat.cuerpo, g, .95, yEje + .02, 0));
    horizontal(malla('succion', Cy(.17, .6, 16), mat.medio, g, 1.45, yEje, 0));
    horizontal(malla('brida_succion', Cy(.24, .06, 16), mat.oscuro, g, 1.72, yEje, 0));
    malla('descarga', Cy(.14, .8, 16), mat.medio, g, .95, yEje + .8, 0);
    malla('brida_descarga', Cy(.21, .06, 16), mat.oscuro, g, .95, yEje + 1.2, 0);
    // Dos sensores de vibración en los rodamientos del motor
    const s1 = malla('sensor_rodamiento_libre', Cy(.075, .17, 16), matSensorBomba, g, -1.36, yEje + .5, 0);
    const s2 = malla('sensor_rodamiento_acople', Cy(.075, .17, 16), matSensorBomba, g, -.14, yEje + .5, 0);
    sensores.push({ mesh: s1, eq: 0, offset: 0 }, { mesh: s2, eq: 0, offset: 1.0 });
    grupos.bomba = g;
  }

  /* ---- 4.2 Ventilador de torre de enfriamiento ---- */
  let aspas;
  {
    const g = new THREE.Group(); g.name = 'torre_enfriamiento'; g.position.set(-3.3, 0, -2.1); planta.add(g);
    const hD = 1.6;
    [[-1.15, -1.15], [1.15, -1.15], [-1.15, 1.15], [1.15, 1.15]].forEach(([x, z], i) =>
      malla('pata_' + i, B(.12, hD, .12), mat.oscuro, g, x, hD / 2, z));
    malla('travesano_x1', B(2.3, .08, .08), mat.oscuro, g, 0, .8, 1.15);
    malla('travesano_x2', B(2.3, .08, .08), mat.oscuro, g, 0, .8, -1.15);
    malla('travesano_z1', B(.08, .08, 2.3), mat.oscuro, g, 1.15, .8, 0);
    malla('travesano_z2', B(.08, .08, 2.3), mat.oscuro, g, -1.15, .8, 0);
    malla('plataforma', B(2.7, .12, 2.7), mat.cuerpo, g, 0, hD + .06, 0);
    const yB = hD + .12;
    // Barandal
    [[0, 1.33, 2.7, .04], [0, -1.33, 2.7, .04]].forEach(([x, z, w, d], i) => malla('barandal_x' + i, B(w, .05, d), mat.medio, g, x, yB + .5, z));
    [[1.33, 0], [-1.33, 0]].forEach(([x, z], i) => malla('barandal_z' + i, B(.04, .05, 2.7), mat.medio, g, x, yB + .5, z));
    [[1.33, 1.33], [-1.33, 1.33], [1.33, -1.33], [-1.33, -1.33]].forEach(([x, z], i) => malla('poste_' + i, B(.05, .5, .05), mat.medio, g, x, yB + .25, z));
    // Escalera
    malla('escalera_riel_1', B(.05, hD + .1, .05), mat.medio, g, 1.42, hD / 2, .35);
    malla('escalera_riel_2', B(.05, hD + .1, .05), mat.medio, g, 1.42, hD / 2, .75);
    for (let i = 0; i < 5; i++) malla('peldano_' + i, B(.04, .04, .4), mat.medio, g, 1.42, .25 + i * .3, .55);
    // Cubierta del ventilador y aspas
    const cub = malla('cubierta_ventilador', Cy(.95, .7, 28, .95, true), mat.cubierta, g, 0, yB + .35, 0);
    cub.userData.sinContorno = true;
    malla('aro_superior', new THREE.TorusGeometry(.95, .05, 6, 28), mat.medio, g, 0, yB + .7, 0).rotation.x = Math.PI / 2;
    malla('maza', Cy(.14, .22, 12), mat.oscuro, g, 0, yB + .45, 0);
    aspas = new THREE.Group(); aspas.name = 'aspas'; aspas.position.set(0, yB + .48, 0); g.add(aspas);
    for (let i = 0; i < 5; i++) {
      const piv = new THREE.Group(); piv.rotation.y = i * Math.PI * 2 / 5; aspas.add(piv);
      const a = malla('aspa_' + i, B(.78, .03, .2), mat.oscuro, piv, .5, 0, 0); a.rotation.x = .35;
    }
    // Motor del ventilador con su sensor
    horizontal(malla('motor_ventilador', Cy(.2, .5, 16), mat.medio, g, .95, yB + .22, .95)).rotation.y = Math.PI / 4;
    const s = malla('sensor_motor_ventilador', Cy(.07, .15, 16), matSensores[1], g, .95, yB + .5, .95);
    sensores.push({ mesh: s, eq: 1, offset: .33 });
    grupos.ventilador = g;
  }

  /* ---- 4.3 Tablero eléctrico con cámara térmica ---- */
  {
    const g = new THREE.Group(); g.name = 'tablero_electrico'; g.position.set(3.3, 0, -2.1); planta.add(g);
    malla('base_tablero', B(2.7, .12, 1.0), mat.concreto, g, 0, .06, -.4);
    malla('gabinete', B(2.4, 1.9, .7), mat.cuerpo, g, 0, 1.07, -.4);
    malla('techo_gabinete', B(2.5, .06, .8), mat.medio, g, 0, 2.05, -.4);
    for (let i = 0; i < 2; i++) malla('junta_' + i, B(.02, 1.7, .012), mat.medio, g, -.4 + i * .8, 1.07, -.044);
    for (let i = 0; i < 3; i++) {
      malla('manija_' + i, B(.05, .22, .04), mat.oscuro, g, -.55 + i * .8, 1.05, -.03);
      malla('indicador_' + i, Cy(.045, .03, 10), mat.verde, g, -.8 + i * .8, 1.75, -.04).rotation.x = Math.PI / 2;
    }
    // Poste y cámara térmica
    malla('poste_camara', Cy(.05, 1.8, 10), mat.oscuro, g, .9, .9, 1.2);
    const cab = new THREE.Group(); cab.name = 'camara_termica'; cab.position.set(.9, 1.92, 1.2); g.add(cab);
    const cuerpo = malla('camara_cuerpo', B(.28, .24, .46), matSensores[2], cab, 0, 0, 0);
    const lente = malla('camara_lente', Cy(.08, .08, 16), mat.oscuro, cab, 0, 0, .26); lente.rotation.x = Math.PI / 2;
    // Cono de visión (muy tenue)
    const L = 2.1;
    const conoGeo = new THREE.ConeGeometry(.75, L, 24, 1, true); conoGeo.rotateX(-Math.PI / 2); conoGeo.translate(0, 0, L / 2);
    const conoMat = new THREE.MeshBasicMaterial({ color: COL.azul, transparent: true, opacity: .07, depthWrite: false, side: THREE.DoubleSide });
    conoMat.name = 'cono_vision';
    const cono = new THREE.Mesh(conoGeo, conoMat); cono.name = 'cono_vision'; cono.position.z = .3;
    cono.userData.sinContorno = true; cono.raycast = () => {};
    cab.add(cono);
    g.userData.apuntar = () => cab.lookAt(g.localToWorld(new THREE.Vector3(0, 1.1, -.05)));
    sensores.push({ mesh: cuerpo, eq: 2, offset: .66 });
    grupos.tablero = g;
  }

  /* ---- 4.4 Transformador con sensor acústico y analizador de gases ---- */
  {
    const g = new THREE.Group(); g.name = 'transformador'; g.position.set(3.3, 0, 2.1); planta.add(g);
    malla('base_transformador', B(2.6, .15, 2.0), mat.concreto, g, 0, .075, 0);
    malla('tanque', B(1.5, 1.3, 1.0), mat.cuerpo, g, 0, .8, 0);
    malla('tapa_tanque', B(1.6, .06, 1.1), mat.medio, g, 0, 1.48, 0);
    for (let i = 0; i < 6; i++) {
      malla('radiador_f' + i, B(.04, 1.0, .42), mat.medio, g, -.6 + i * .24, .8, .72);
      malla('radiador_t' + i, B(.04, 1.0, .42), mat.medio, g, -.6 + i * .24, .8, -.72);
    }
    for (let i = 0; i < 3; i++) {
      const x = -.45 + i * .45;
      malla('boquilla_' + i, Cy(.07, .5, 12), mat.blanco, g, x, 1.76, -.15);
      for (let k = 0; k < 3; k++) malla(`disco_${i}_${k}`, Cy(.12, .03, 12), mat.blanco, g, x, 1.6 + k * .12, -.15);
      malla('terminal_' + i, Cy(.04, .08, 8), mat.oscuro, g, x, 2.05, -.15);
    }
    malla('soporte_c1', B(.05, .4, .05), mat.oscuro, g, -.4, 1.7, .3);
    malla('soporte_c2', B(.05, .4, .05), mat.oscuro, g, .4, 1.7, .3);
    horizontal(malla('tanque_conservador', Cy(.2, 1.2, 16), mat.cuerpo, g, 0, 2.0, .3));
    // Sensor acústico en la cara lateral
    horizontal(malla('sensor_acustico', Cy(.08, .14, 16), matSensores[3], g, .82, 1.0, 0));
    // Analizador de gases disueltos en línea
    malla('gabinete_gases', B(.4, .7, .35), mat.blanco, g, .98, .5, .72);
    malla('tubo_gases', B(.24, .05, .05), mat.oscuro, g, .76, .3, .6);
    const luz = malla('sensor_gases', Cy(.06, .05, 12), matSensores[3], g, .98, .88, .72);
    sensores.push({ mesh: g.getObjectByName('sensor_acustico'), eq: 3, offset: 1.33 }, { mesh: luz, eq: 3, offset: 1.66 });
    grupos.transformador = g;
  }

  /* ---- 4.5 Estación base con dos antenas ---- */
  const ANTENA = new THREE.Vector3();
  {
    const g = new THREE.Group(); g.name = 'estacion_base'; planta.add(g);
    malla('pedestal', Cy(.75, .12, 6), mat.concreto, g, 0, .06, 0);
    malla('gabinete_base', B(.6, .7, .45), mat.blanco, g, 0, .47, 0);
    malla('mastil', Cy(.06, 2.2, 10), mat.oscuro, g, 0, 1.92, 0);
    malla('brazo', B(.5, .05, .05), mat.oscuro, g, 0, 2.95, 0);
    [-.22, .22].forEach((x, i) => {
      malla('antena_' + (i + 1), Cy(.035, .8, 8), mat.medio, g, x, 3.35, 0);
      malla('punta_antena_' + (i + 1), new THREE.SphereGeometry(.075, 12, 8), matAntena, g, x, 3.78, 0);
    });
    ANTENA.set(0, 3.55, 0);
  }

  /* ---- 4.6 Panel flotante IDAP ---- */
  const AZ0 = 45 * deg;   // acimut base de la cámara
  const panel = new THREE.Group(); panel.name = 'panel_idap';
  panel.position.set(6.6, 3.1, -5.6); panel.rotation.y = AZ0; scene.add(panel);
  {
    malla('panel_marco', B(3.6, 4.2, .1), mat.blanco, panel, 0, 0, -.06).castShadow = false;
    malla('panel_canto', B(3.64, .1, .12), mat.azul, panel, 0, 2.1, -.06).castShadow = false;
  }
  const PANEL_W = 3.4, PANEL_H = 4.0;
  // Puntos de llegada de las lecturas: borde izquierdo del panel, a la altura de cada tarjeta
  const LLEGADAS = [.93, .07, -.79, -1.65].map(y => new THREE.Vector3(-1.85, y, 0));

  // Halo ámbar en el piso de la bomba
  const halo = new THREE.Mesh(new THREE.RingGeometry(1.75, 1.88, 48),
    new THREE.MeshBasicMaterial({ color: COL.ambar, transparent: true, opacity: 0, depthWrite: false }));
  halo.name = 'halo_alerta'; halo.rotation.x = -Math.PI / 2; halo.position.set(-3.3, .03, 2.1); scene.add(halo);

  scene.updateMatrixWorld(true);
  grupos.tablero.userData.apuntar();
  panel.updateMatrixWorld(true);
  LLEGADAS.forEach(v => panel.localToWorld(v));

  /* ---- Contornos para el resaltado (malla inflada con caras traseras) ---- */
  const listaGrupos = EQUIPOS.map(e => grupos[e.id]);
  listaGrupos.forEach((g, i) => {
    g.userData.eq = i;
    g.userData.contornos = [];
    const mallas = []; g.traverse(o => { if (o.isMesh && !o.userData.sinContorno) mallas.push(o); });
    mallas.forEach(m => {
      const c = new THREE.Mesh(m.geometry, matContorno);
      c.name = 'contorno'; c.scale.setScalar(1.07); c.visible = false; c.raycast = () => {};
      m.add(c); g.userData.contornos.push(c);
    });
    const caja = new THREE.Box3().setFromObject(g);
    g.userData.centro = caja.getCenter(new THREE.Vector3());
    g.userData.ancla = new THREE.Vector3((caja.min.x + caja.max.x) / 2, caja.max.y + .15, (caja.min.z + caja.max.z) / 2);
  });

  /* =====================================================================
     5. PULSOS Y PARTÍCULAS
     ===================================================================== */
  const geoPart = new THREE.SphereGeometry(.09, 12, 8);
  const geoHalo = new THREE.SphereGeometry(.2, 12, 8);
  const geoRastro = new THREE.SphereGeometry(.055, 8, 6);
  const matPart = new THREE.MeshBasicMaterial({ color: COL.azul }); matPart.name = 'pulso';
  const particulas = [];
  for (let i = 0; i < 24; i++) {
    const head = new THREE.Mesh(geoPart, matPart);
    const hal = new THREE.Mesh(geoHalo, new THREE.MeshBasicMaterial({ color: COL.azul, transparent: true, opacity: .18, depthWrite: false }));
    const rastro = [0, 1, 2].map(k => new THREE.Mesh(geoRastro,
      new THREE.MeshBasicMaterial({ color: COL.azul, transparent: true, opacity: .45 - k * .13, depthWrite: false })));
    [head, hal, ...rastro].forEach(m => { m.visible = false; m.raycast = () => {}; scene.add(m); });
    particulas.push({ on: false, head, hal, rastro, t0: 0, S: new THREE.Vector3(), C1: new THREE.Vector3(), C2: new THREE.Vector3(), P: null, eq: 0, base: false });
  }

  // Anillo que se expande en el sensor al emitir
  const geoAnillo = new THREE.RingGeometry(.12, .16, 28);
  sensores.forEach(s => {
    s.pos = s.mesh.getWorldPosition(new THREE.Vector3());
    s.anillo = new THREE.Mesh(geoAnillo, new THREE.MeshBasicMaterial({ color: COL.azul, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    s.anillo.position.copy(s.pos); s.anillo.raycast = () => {}; scene.add(s.anillo);
    s.tEmision = -99; s.ultimoK = null;
  });

  function bezier(a, c, b, t, out) {
    const u = 1 - t;
    return out.set(u * u * a.x + 2 * u * t * c.x + t * t * b.x, u * u * a.y + 2 * u * t * c.y + t * t * b.y, u * u * a.z + 2 * u * t * c.z + t * t * b.z);
  }
  function posicion(p, u, out) {
    if (u < T_VIAJE_BASE) return bezier(p.S, p.C1, ANTENA, ease(clamp(u / T_VIAJE_BASE, 0, 1)), out);
    return bezier(ANTENA, p.C2, p.P, ease(clamp((u - T_VIAJE_BASE) / T_VIAJE_IDAP, 0, 1)), out);
  }
  function emitir(s, T) {
    s.tEmision = T;
    const p = particulas.find(q => !q.on); if (!p) return;
    p.on = true; p.t0 = T; p.eq = s.eq; p.base = false; p.P = LLEGADAS[s.eq];
    p.S.copy(s.pos);
    p.C1.copy(s.pos).add(ANTENA).multiplyScalar(.5); p.C1.y += 1.4 + s.pos.distanceTo(ANTENA) * .15;
    p.C2.copy(ANTENA).add(p.P).multiplyScalar(.5); p.C2.y += 1.2;
    [p.head, p.hal, ...p.rastro].forEach(m => m.visible = true);
  }

  // Colores de los materiales básicos (contornos, pulsos, halo, anillos) a lineal, como en r184
  {
    const vistos = new Set();
    scene.traverse(o => {
      const mt = o.material;
      if (mt && mt.isMeshBasicMaterial && !vistos.has(mt)) { vistos.add(mt); mt.color.convertSRGBToLinear(); }
    });
  }

  /* =====================================================================
     6. INTERFAZ HTML (panel IDAP, tendencias, espectro)
     ===================================================================== */
  const $ = id => hero.querySelector('[data-id="' + id + '"]');
  const elIdap = $('idap'), elSpec = $('spec'), elAlert = $('alert'), elTip = $('tip'), elSheet = $('sheet'), elCap = $('capText');
  $('steps').innerHTML = PASOS.map(() => '<i></i>').join('');
  const barras = [...$('steps').children];

  // Peso del evento para el equipo i en el momento tc de la vuelta ev (0 = normal, 1 = pico)
  function factorEvento(i, tc, ev) {
    return EVENTOS[ev] && EVENTOS[ev].eq === i ? ss(2.5, 5.6, tc) * (1 - ss(10.2, 10.6, tc)) : 0;
  }
  function lectura(i, tc, ev) {
    const e = EQUIPOS[i];
    return Math.max(e.min, e.base + e.ruido * (rnd() * 2 - 1) + (e.pico - e.base) * factorEvento(i, tc, ev));
  }
  const fmtN = (e, v) => v.toFixed(e.dec);
  const fmt = (e, v) => (e.pref || '') + fmtN(e, v) + ' ' + e.unidad;

  // Escala vertical de las gráficas (raíz cuadrada en el tablero para que 1, 4 y 15 °C se distingan)
  const GH = 24;
  function norm(e, v) { const n = clamp((v - e.min) / (e.max - e.min), 0, 1); return e.raiz ? Math.sqrt(n) : n; }
  function yMap(e, v, h) { return (h - 1.5) - norm(e, v) * (h - 3); }
  const lineaUmbral = (y, x2, color) =>
    `<line x1="0" x2="${x2}" y1="${y.toFixed(2)}" y2="${y.toFixed(2)}" stroke="${color}" stroke-width="1" stroke-dasharray="3 2" vector-effect="non-scaling-stroke"/>`;

  // Tarjetas del panel: valor, unidad, tendencia y dos umbrales (ámbar y rojo)
  const tarjetas = EQUIPOS.map((e, i) => {
    const el = document.createElement('div'); el.className = 'card';
    const ya = yMap(e, e.prec, GH), yr = yMap(e, e.alarma, GH);
    el.innerHTML = `<div class="row"><span class="dot"></span><span class="nm">${e.corto}</span><span class="st">Normal</span></div>
      <div class="row2"><div class="gr"><svg viewBox="0 0 100 ${GH}" preserveAspectRatio="none">
        ${lineaUmbral(ya, 84, '#ca8a04')}${lineaUmbral(yr, 84, '#dc2626')}
        <polyline fill="none" stroke="#16a34a" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>
        <span class="thl" style="top:${(ya / GH * 100).toFixed(1)}%;color:#ca8a04">${fmtN(e, e.prec)}</span>
        <span class="thl" style="top:${(yr / GH * 100).toFixed(1)}%;color:#dc2626">${fmtN(e, e.alarma)}</span></div>
        <span class="val"></span></div>`;
    elIdap.appendChild(el);
    const hist = [];
    for (let k = 0; k < HIST; k++) hist.push(lectura(i, 2, -1));
    return { el, e, i, hist, line: el.querySelector('polyline'), val: el.querySelector('.val'), st: el.querySelector('.st'), estado: -1, hitHasta: 0, tmax: 41 };
  });
  function dibujarTarjeta(t) {
    const v = t.hist[HIST - 1];
    t.line.setAttribute('points', t.hist.map((x, k) => `${(k / (HIST - 1) * 80).toFixed(1)},${yMap(t.e, x, GH).toFixed(1)}`).join(' '));
    t.val.textContent = fmt(t.e, v);
    const est = estadoDe(t.e, v);
    if (est !== t.estado) {
      t.estado = est;
      t.el.classList.toggle('warn', est === 1); t.el.classList.toggle('alarm', est === 2);
      t.st.textContent = EST_TXT[est]; t.line.setAttribute('stroke', EST_COL[est]);
      if (fichaAbierta === t.i) abrirFicha(t.i);
    }
  }
  function nuevaLectura(i, tc, ev) {
    const t = tarjetas[i], v = lectura(i, tc, ev);
    t.hist.push(v); t.hist.shift();
    // Tablero: fase más caliente = fase más fría (41-42 °C) + diferencia entre fases
    if (t.e.id === 'tablero') t.tmax = 40 + 1.9 * factorEvento(i, tc, ev) + v;
    dibujarTarjeta(t);
    t.el.classList.add('hit'); t.hitHasta = performance.now() + 350;
  }

  // Espectro de vibración (datos de ejemplo): 'rodamiento' o 'desbalance'
  function dibujarEspectro(tipo, color) {
    const N = 150, g = (f, c, s) => Math.exp(-((f - c) ** 2) / (2 * s * s)), pts = [];
    semilla = 5;
    for (let i = 0; i < N; i++) {
      const f = i / (N - 1);
      let a = .05 + .05 * rnd();
      if (tipo === 'rodamiento') a += .32 * g(f, .07, .01) + .18 * g(f, .14, .01) + .92 * g(f, .34, .007) + .42 * g(f, .68, .008) + .2 * g(f, .9, .01);
      else a += .95 * g(f, .07, .009) + .12 * g(f, .14, .009) + .06 * g(f, .21, .009);
      pts.push([f * 300, 100 - a * 92]);
    }
    semilla = 11;
    $('specLine').setAttribute('points', pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '));
    $('specArea').setAttribute('d', 'M0,100 ' + pts.map(p => 'L' + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + ' L300,100 Z');
    const fx = tipo === 'rodamiento' ? .34 : .07;
    const pk = $('peakLine');
    pk.setAttribute('x1', fx * 300); pk.setAttribute('x2', fx * 300); pk.setAttribute('y2', 4); pk.setAttribute('stroke', color);
    const lbl = $('peakLbl'); lbl.style.left = (fx * 100) + '%'; lbl.style.color = color;
  }

  // Triángulo de Duval simplificado (vértices: metano arriba, etileno abajo a la derecha, acetileno abajo a la izquierda)
  {
    const P = (ch4, c2h4, c2h2) => [(50 * ch4 + 100 * c2h4) / 100, (86.6 * c2h4 + 86.6 * c2h2) / 100];
    const pts = arr => arr.map(p => P(...p).map(n => n.toFixed(2)).join(',')).join(' ');
    const zonas = [
      ['T1', [[100, 0, 0], [80, 20, 0], [76, 20, 4], [96, 0, 4]]],
      ['T2', [[80, 20, 0], [50, 50, 0], [46, 50, 4], [76, 20, 4]]],
      ['T3', [[50, 50, 0], [0, 100, 0], [0, 85, 15], [35, 50, 15]]],
      ['D1', [[87, 0, 13], [0, 0, 100], [0, 23, 77], [64, 23, 13]]],
    ];
    let h = `<polygon points="${pts([[100, 0, 0], [0, 100, 0], [0, 0, 100]])}" fill="#f4f7fc" stroke="#8494b2" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    zonas.forEach(([n, z]) => {
      const t2 = n === 'T2';
      h += `<polygon points="${pts(z)}" fill="${t2 ? 'rgba(202,138,4,.3)' : '#e3eaf5'}" stroke="${t2 ? '#ca8a04' : '#b9c6da'}" stroke-width="${t2 ? 1.5 : .8}" vector-effect="non-scaling-stroke"/>`;
    });
    const [px, py] = P(57, 41, 2);
    h += `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="3.6" fill="#ca8a04" stroke="#fff" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
    $('duvalSvg').innerHTML = h;
  }

  /* ---- Ficha del equipo (clic) ---- */
  let fichaAbierta = null;
  let foco = null, wf = 0;   // equipo enfocado por clic y peso del acercamiento
  function abrirFicha(i) {
    const e = EQUIPOS[i], t = tarjetas[i], est = Math.max(0, t.estado), actual = t.hist[HIST - 1];
    fichaAbierta = i; foco = i;
    elSheet.querySelector('.sh-n').textContent = e.nombre;
    elSheet.querySelector('.sh-s').textContent = e.variable + ' · ' + e.sensor;
    const pill = elSheet.querySelector('.pill');
    pill.textContent = EST_TXT[est]; pill.classList.toggle('warn', est === 1); pill.classList.toggle('alarm', est === 2);
    elSheet.querySelector('.sh-last').textContent = 'Última: ' + fmt(e, actual) + (e.id === 'tablero' ? ' · máx. ' + Math.round(t.tmax) + ' °C' : '');
    // Tendencia de 7 días: 42 puntos (uno cada 4 h)
    const n = 42, vals = [];
    for (let k = 0; k < n; k++) {
      let v = e.base + e.ruido * 1.4 * (Math.sin(k * .9 + i) * .5 + (rnd() - .5));
      if (est > 0) v += (actual - e.base) * ss(n - 9, n - 1, k);
      vals.push(Math.max(e.min, v));
    }
    const y = v => 58 - norm(e, v) * 56;
    $('shLine').setAttribute('points', vals.map((v, k) => `${(k / (n - 1) * 188).toFixed(1)},${y(v).toFixed(1)}`).join(' '));
    $('shLine').setAttribute('stroke', EST_COL[est]);
    [['shThA', 'shLa', e.prec], ['shThR', 'shLr', e.alarma]].forEach(([l, s, u]) => {
      const yy = y(u);
      $(l).setAttribute('y1', yy.toFixed(1)); $(l).setAttribute('y2', yy.toFixed(1));
      $(s).style.top = (yy / 60 * 100).toFixed(1) + '%'; $(s).textContent = fmtN(e, u) + ' ' + e.unidad;
    });
    elSheet.classList.add('show');
  }
  function cerrarFicha() { fichaAbierta = null; foco = null; elSheet.classList.remove('show'); }
  elSheet.querySelector('.sh-x').addEventListener('click', () => { cerrarFicha(); invalidar(); });

  /* =====================================================================
     7. INTERACCIÓN: RESALTADO, ETIQUETA Y TOQUES
     ===================================================================== */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const puntero = { dentro: false, tipo: 'mouse' };
  let resaltado = null;      // índice del equipo resaltado
  let fijado = false;        // en táctil, la etiqueta queda fija hasta otro toque

  function elegir() {
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(listaGrupos, true)[0];
    if (!hit) return null;
    let o = hit.object; while (o && o.userData.eq === undefined) o = o.parent;
    return o ? o.userData.eq : null;
  }
  function resaltar(i) {
    if (i === resaltado) return;
    if (resaltado !== null) listaGrupos[resaltado].userData.contornos.forEach(c => c.visible = false);
    resaltado = i;
    canvas.style.cursor = i !== null ? 'pointer' : '';
    if (i === null) { elTip.classList.remove('show'); return; }
    listaGrupos[i].userData.contornos.forEach(c => c.visible = true);
    const e = EQUIPOS[i];
    elTip.querySelector('.tip-n').textContent = e.nombre;
    elTip.querySelector('.tip-s').textContent = e.sensor;
    $('tipVar').textContent = e.variable;
    $('tipMaxRow').style.display = e.id === 'tablero' ? '' : 'none';
    elTip.querySelector('.tip-h').textContent = puntero.tipo === 'mouse' ? 'Haz clic para acercarte y ver su tendencia' : 'Toca otra vez para acercarte';
    elTip.classList.add('show');
  }
  function fijarPuntero(ev) {
    const r = canvas.getBoundingClientRect();
    ndc.set((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  }
  canvas.addEventListener('pointermove', ev => {
    if (ev.pointerType !== 'mouse') return;
    puntero.tipo = 'mouse'; puntero.dentro = true; fijarPuntero(ev); resaltar(elegir()); invalidar();
  });
  canvas.addEventListener('pointerleave', () => { puntero.dentro = false; if (!fijado) { resaltar(null); invalidar(); } });
  canvas.addEventListener('pointerdown', ev => { puntero.tipo = ev.pointerType; });
  canvas.addEventListener('click', ev => {
    fijarPuntero(ev);
    const i = elegir();
    if (puntero.tipo === 'mouse') {
      if (i !== null) abrirFicha(i); else cerrarFicha();
    } else {
      if (i !== null && i === resaltado) abrirFicha(i);
      else { resaltar(i); fijado = i !== null; if (i === null) cerrarFicha(); }
    }
    invalidar();
  });

  /* =====================================================================
     8. CÁMARA Y CICLO DE ANIMACIÓN
     ===================================================================== */
  let W = 1, H = 1, angosto = false;
  const objetivo = new THREE.Vector3(), tmp = new THREE.Vector3();
  const VISTA = { az: AZ0, el: 32 * deg, dist: 26, obj: new THREE.Vector3(1.5, .5, -1.4) };
  const centroEvento = new THREE.Vector3(-3.4, 1.0, 2.1);   // equipo del evento de la vuelta

  function colocarCamara(tc, w) {
    const amp = (angosto ? 6 : 15) * deg;                 // órbita total de ~30° (12° en celular)
    const azO = AZ0 + amp * Math.sin(tc / CICLO * Math.PI * 2);
    const azZ = AZ0 - 8 * deg, distZ = angosto ? 15 : 13.5;
    // Objetivo del acercamiento: la bomba queda a la izquierda, el espectro a la derecha
    const der = tmp.set(Math.cos(azZ), 0, -Math.sin(azZ)).multiplyScalar(angosto ? 2.8 : 1.6);
    const objZ = centroEvento.clone().add(der);
    const az = lerp(azO, azZ, w), el = lerp(VISTA.el, 26 * deg, w), dist = lerp(VISTA.dist, distZ, w);
    objetivo.lerpVectors(VISTA.obj, objZ, w);
    camera.position.set(objetivo.x + dist * Math.cos(el) * Math.sin(az), objetivo.y + dist * Math.sin(el), objetivo.z + dist * Math.cos(el) * Math.cos(az));
    // Acercamiento al equipo elegido con clic (el equipo queda a la derecha; la ficha, a la izquierda)
    if (wf > .001 && focoCam !== null) {
      const c = listaGrupos[focoCam].userData.centro;
      const azF = AZ0 - 6 * deg, elF = 27 * deg, dF = angosto ? 14 : 12.5;
      const objF = c.clone().add(new THREE.Vector3(Math.cos(azF), 0, -Math.sin(azF)).multiplyScalar(angosto ? -.6 : -1.5));
      const pF = objF.clone().add(new THREE.Vector3(dF * Math.cos(elF) * Math.sin(azF), dF * Math.sin(elF), dF * Math.cos(elF) * Math.cos(azF)));
      const k = ease(wf);
      camera.position.lerp(pF, k); objetivo.lerp(objF, k);
    }
    camera.lookAt(objetivo);
  }

  function aPantalla(v) { tmp.copy(v).project(camera); return [(tmp.x + 1) / 2 * W, (1 - tmp.y) / 2 * H]; }

  const COL3 = [COL.azul, COL.ambar, COL.rojo].map(c => new THREE.Color(c).convertSRGBToLinear());
  const esquinas = [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([x, y]) => new THREE.Vector3(x * PANEL_W / 2, y * PANEL_H / 2, 0));
  let pasoActual = -1, T = 0, ultimoGolpeBase = -99, focoCam = null, eventoActual = -1;

  // Prepara la evidencia, el aviso y el acercamiento del evento de esta vuelta
  function prepararEvento(n) {
    const ev = EVENTOS[n], c = listaGrupos[ev.eq].userData.centro, color = EST_COL[ev.estado];
    centroEvento.copy(c);
    halo.position.set(c.x, .03, c.z);
    $('evEye').textContent = ev.eyebrow + ' · datos de ejemplo';
    $('evTit').textContent = ev.titulo;
    elSpec.querySelectorAll('.ev').forEach(el => el.style.display = el.dataset.ev === ev.tipo ? '' : 'none');
    if (ev.tipo === 'espectro') { dibujarEspectro(ev.espectro, color); $('peakLbl').textContent = ev.marca; }
    $('alT').textContent = ev.aviso.t;
    const b = $('alB'); b.textContent = ev.aviso.nivel; b.classList.toggle('red', ev.estado === 2);
    $('alD').textContent = ev.aviso.d;
    $('alQ').textContent = ev.aviso.q;
    PASOS[2][1] = ev.subida; pasoActual = -1;
    // El equipo del evento anterior ya se corrigió: su tendencia vuelve a valores normales
    const prev = EVENTOS[(n + EVENTOS.length - 1) % EVENTOS.length].eq, tp = tarjetas[prev];
    tp.hist = tp.hist.map(() => lectura(prev, 2, -1)); dibujarTarjeta(tp);
  }

  function actualizar(dt) {
    const tc = reducido ? 1.5 : ((T % CICLO) + CICLO) % CICLO;
    const vuelta = reducido ? -1 : Math.floor(T / CICLO) % EVENTOS.length;   // un equipo distinto por vuelta
    if (vuelta >= 0 && vuelta !== eventoActual) { eventoActual = vuelta; prepararEvento(vuelta); }
    const evEq = vuelta >= 0 ? EVENTOS[vuelta].eq : -1;
    const w = reducido ? 0 : ss(4, 5.7, tc) * (1 - ss(9.6, 11.2, tc));   // acercamiento al equipo del evento
    // Transición suave hacia/desde el equipo enfocado por clic
    if (foco !== null && foco !== focoCam) { if (focoCam === null || wf < .02) focoCam = foco; }
    const meta = foco !== null && foco === focoCam ? 1 : 0;
    wf = reducido ? meta : clamp(wf + Math.sign(meta - wf) * dt * 1.4, 0, 1);
    if (wf === 0 && foco === null) focoCam = null;
    colocarCamara(tc, w);
    camera.updateMatrixWorld();

    if (!reducido) aspas.rotation.y += dt * 5;

    // Cada sensor toma el color del estado de su tarjeta (azul en normal, ámbar o rojo)
    const kc = reducido ? 1 : Math.min(1, dt * 5);
    matSensores.forEach((m, i) => { m.color.lerp(COL3[Math.max(0, tarjetas[i].estado)], kc); m.emissive.copy(m.color); });
    const estEv = evEq >= 0 ? Math.max(0, tarjetas[evEq].estado) : 0;
    if (estEv) halo.material.color.copy(COL3[estEv]);
    halo.material.opacity = lerp(halo.material.opacity, estEv ? .45 : 0, kc);

    // Emisión de pulsos
    if (!reducido) sensores.forEach(s => {
      const k = Math.floor((T - s.offset) / PERIODO_PULSO);
      if (s.ultimoK === null) s.ultimoK = k;
      if (k > s.ultimoK) { s.ultimoK = k; emitir(s, T); }
    });
    sensores.forEach(s => {
      const edad = T - s.tEmision;
      const mt = s.mesh.material;
      mt.emissiveIntensity = .25 + 1.1 * Math.max(0, 1 - edad / .45);
      s.anillo.quaternion.copy(camera.quaternion);
      s.anillo.scale.setScalar(1 + edad * 5);
      s.anillo.material.opacity = edad < .7 ? .8 * (1 - edad / .7) : 0;
      s.anillo.material.color.copy(mt.color);
    });

    // Partículas en vuelo
    particulas.forEach(p => {
      if (!p.on) return;
      const u = T - p.t0;
      if (u >= T_VIAJE_BASE + T_VIAJE_IDAP) {
        p.on = false; [p.head, p.hal, ...p.rastro].forEach(m => m.visible = false);
        nuevaLectura(p.eq, tc, vuelta); return;
      }
      if (!p.base && u >= T_VIAJE_BASE) { p.base = true; ultimoGolpeBase = T; }
      posicion(p, u, p.head.position); p.hal.position.copy(p.head.position);
      p.rastro.forEach((m, k) => posicion(p, Math.max(0, u - (k + 1) * .045), m.position));
    });
    matAntena.emissiveIntensity = .3 + 1.3 * Math.max(0, 1 - (T - ultimoGolpeBase) / .35);

    // Panel IDAP: se proyecta sobre el panel 3D
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    esquinas.forEach(c => { const [x, y] = aPantalla(panel.localToWorld(c.clone())); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    let s = (x1 - x0) / 230; if (angosto) s = Math.max(s, .5);
    let left = (x0 + x1) / 2 - 115 * s, top = (y0 + y1) / 2 - 135 * s;
    left = Math.min(left, W - 230 * s - 6); top = clamp(top, 6, H - 270 * s - 6);
    elIdap.style.transform = `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px) scale(${s.toFixed(4)})`;
    elIdap.style.opacity = (1 - ss(.15, .55, Math.max(w, wf))).toFixed(3);

    const ahora = performance.now();
    tarjetas.forEach(t => { if (t.hitHasta && ahora > t.hitHasta) { t.hitHasta = 0; t.el.classList.remove('hit'); } });

    // Evidencia y aviso
    const libre = wf < .2 && !reducido;
    elSpec.classList.toggle('show', libre && tc > 5.6 && tc < 10.2);
    elAlert.classList.toggle('show', libre && tc > 7.3 && tc < 10.2);
    hero.classList.toggle('zoomed', w > .4 || wf > .4);
    hero.classList.toggle('focused', wf > .4);

    // Texto del paso actual
    let paso = 0; PASOS.forEach(([t0], i) => { if (tc >= t0) paso = i; });
    if (paso !== pasoActual) {
      pasoActual = paso; elCap.textContent = PASOS[paso][1];
      elCap.classList.remove('in'); void elCap.offsetWidth; elCap.classList.add('in');
      barras.forEach((b, i) => b.classList.toggle('on', i <= paso));
    }

    // Resaltado continuo bajo el cursor y posición de la etiqueta
    if (puntero.dentro && puntero.tipo === 'mouse') resaltar(elegir());
    if (resaltado !== null) {
      const [x, y] = aPantalla(listaGrupos[resaltado].userData.ancla);
      const hw = elTip.offsetWidth / 2;
      elTip.style.left = clamp(x, hw + 6, W - hw - 6) + 'px';
      elTip.style.top = Math.max(y, elTip.offsetHeight + 16) + 'px';
      const t = tarjetas[resaltado];
      $('tipVal').textContent = fmt(t.e, t.hist[HIST - 1]);
      if (t.e.id === 'tablero') $('tipMax').textContent = Math.round(t.tmax) + ' °C';
    }
  }

  /* ---- Bucle: solo corre cuando la escena es visible ---- */
  let raf = 0, visible = true, ultimo = performance.now();
  function invalidar() { if (!raf && !destruida) raf = requestAnimationFrame(cuadro); }
  function cuadro(ahora) {
    raf = 0;
    const dt = Math.min((ahora - ultimo) / 1000, .1); ultimo = ahora;
    if (!reducido) T += dt;
    actualizar(dt);
    renderer.render(scene, camera);
    if (visible && !document.hidden && (!reducido || (wf > 0 && wf < 1))) invalidar();
  }

  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible) { ultimo = performance.now(); invalidar(); }
  }, { threshold: .05 });
  io.observe(hero);
  const alVolver = () => { if (!document.hidden) { ultimo = performance.now(); invalidar(); } };
  document.addEventListener('visibilitychange', alVolver);

  /* ---- Tamaño del contenedor ---- */
  function ajustarTamano() {
    W = hero.clientWidth || 1; H = hero.clientHeight || 1;
    angosto = W < 600;
    hero.classList.toggle('is-narrow', angosto);
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    invalidar();
  }
  ajustarTamano();
  const ro = new ResizeObserver(ajustarTamano);
  ro.observe(hero);

  /* ---- Estado inicial (con movimiento reducido: vista general fija, todo en verde) ---- */
  tarjetas.forEach(dibujarTarjeta);
  invalidar();

  return function limpiar() {
    destruida = true;
    if (raf) cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", alVolver);
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    renderer.dispose();
    hero.remove();
  };
}
