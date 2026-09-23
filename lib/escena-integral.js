/**
 * Lógica de la escena del diagnóstico integral: el motor de 250 HP con el
 * mismo estilo que la escena de vibraciones, y las cuatro técnicas como
 * instrumentos sobre el mismo rodamiento (válvula y frasco de aceite,
 * detector de ultrasonido, sensor de vibración, cámara térmica). Cada una
 * se activa en el orden en que detecta la falla, despliega su panel y se
 * compacta; al final los cuatro hilos convergen en el rodamiento con el
 * diagnóstico integrado. Bucle de 14 segundos.
 *
 * Portada casi verbatim del diseño hecho en Claude Diseño
 * (docs/designs/diagnostico-integral-instrumentos.html). Se queda en
 * JavaScript plano, como lib/idap-escena.js; el componente de React
 * (Escena360) solo la monta y la limpia.
 *
 * Cambios respecto al original: Three.js llega por parámetro; el marco, la
 * capa de la escena y el SVG de los hilos llegan del componente en lugar de
 * buscarse en `document`; los textos de los paneles y del diagnóstico
 * vienen del JSON del servicio (y se escapan); se quitaron los ganchos de
 * revisión (?t= y window.fijarTiempo) y preserveDrawingBuffer; y la función
 * devuelve una limpieza que detiene el bucle, quita oyentes y libera la GPU.
 * Las intensidades de luz se dejan igual que en la escena de vibraciones,
 * que corre en la misma versión de Three.js del sitio, para que las dos se
 * vean hermanas.
 */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/**
 * @param {typeof import("three")} THREE
 * @param {HTMLElement} marco      cuadro 4:3 que define el tamaño
 * @param {HTMLElement} escenaEl   capa interna de 720 × 540 que se escala
 * @param {SVGSVGElement} svgHilos SVG de los hilos, dentro de escenaEl
 * @param {{ satelites?: { titulo?: string; pildora?: string; valor?: string; detalle?: string }[]; resultado?: { titulo?: string; coinciden?: string; texto?: string } }} datos
 * @returns {() => void} limpieza
 */
export function montarEscenaIntegral(THREE, marco, escenaEl, svgHilos, datos) {
  /* =====================================================================
     CONSTANTES EDITABLES: tiempo, colores y textos
     ===================================================================== */

  // --- Tiempo (segundos). Un solo reloj: transcurrido módulo CICLO ---
  const CICLO        = 14;     // duración total del bucle
  const INICIO       = [1, 3.5, 6, 8.5]; // arranque de aceite, ultrasonido, vibraciones, termografía
  const DURACION     = 2.5;    // tiempo que cada técnica permanece activa
  const T_FINAL      = 11;     // arranque del diagnóstico integrado
  const T_FUNDIDO    = 13.5;   // arranque del fundido de salida
  const T_REDUCIDO   = 12.9;   // cuadro fijo que se muestra con prefers-reduced-motion
  const GIRO_EJE     = 0.7;    // velocidad del eje en rad/s (despacio y constante)
  const INCLINACION  = 2;      // grados máximos de inclinación con el cursor

  // --- Colores ---
  const COL = {
    metalClaro:  '#d9e2e8',
    metalMedio:  '#b7c6d0',
    metalOscuro: '#8fa4b2',
    marino:      '#2b5671',   // caja de conexiones y base
    profundo:    '#1c4560',   // patas
    naranja:     '#fc9f01',   // solo lo activo
    ambar:       '#c8912f',   // aceite
    textoGris:   '#6b7280',
    panel:       '#002e46',
    hiloGris:    '#b7c6d0',
    sueloHemi:   '#d9e0e6'
  };

  // --- Textos de los paneles (orden fijo: el orden en que cada técnica detecta la falla) ---
  const TEXTOS_BASE = [
    { titulo: 'Análisis de aceite',     pildora: 'Alarma',     valor: '27,288 part/ml', detalle: '' },
    { titulo: 'Ultrasonido',            pildora: 'Precaución', valor: '38 dB',          detalle: '+16 sobre línea base' },
    { titulo: 'Espectro de vibración',  pildora: 'Precaución', valor: '7.4 mm/s',       detalle: '' },
    { titulo: 'Termografía',            pildora: 'Precaución', valor: '62 °C',          detalle: '+21 sobre el lado libre' }
  ];
  const DIAGNOSTICO_BASE = {
    titulo: 'Diagnóstico integrado',
    coinciden: '4 de 4 coinciden',
    texto: 'Rodamiento lado acoplamiento, daño en pista externa, etapa 3 de 4. Cambiar en la siguiente ventana.'
  };

  /* =====================================================================
     UTILIDADES
     ===================================================================== */
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const suave = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const salidaRebote = x => { x = clamp(x); const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const rad = g => g * Math.PI / 180;
  // Generador pseudoaleatorio con semilla (para que las gráficas sean estables)
  function azar(semilla) { let s = semilla; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  const TEXTOS = TEXTOS_BASE.map((t, i) => ({ ...t, ...(datos.satelites?.[i] ?? {}) }));
  const DIAGNOSTICO = { ...DIAGNOSTICO_BASE, ...(datos.resultado ?? {}) };

  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================================
     MOTOR GRÁFICO: renderizador, cámara ortográfica isométrica, luces
     ===================================================================== */
  const ANCHO = 720, ALTO = 540;
  const escena3D = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);          // canvas transparente sobre el degradado CSS
  escenaEl.prepend(renderer.domElement);

  const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
  camara.position.set(4, 3.1, 5);
  camara.lookAt(0, 0, 0);
  camara.updateMatrixWorld();

  escena3D.add(new THREE.HemisphereLight(0xffffff, COL.sueloHemi, 0.95));
  const direccional = new THREE.DirectionalLight(0xffffff, 0.55);
  direccional.position.set(3, 5, 2);
  escena3D.add(direccional);

  // Materiales mates compartidos
  const mate = (nombre, color) => new THREE.MeshStandardMaterial({ name: nombre, color, roughness: 0.9, metalness: 0.05 });
  const M = {
    claro:   mate('metal_claro', COL.metalClaro),
    medio:   mate('metal_medio', COL.metalMedio),
    oscuro:  mate('metal_oscuro', COL.metalOscuro),
    marino:  mate('azul_marino', COL.marino),
    profundo:mate('azul_profundo', COL.profundo)
  };
  const mateDoble = (m) => { const c = m.clone(); c.side = THREE.DoubleSide; return c; };
  // Material de acento por instrumento: gris en reposo, naranja cuando mide
  const acento = (n) => mate('acento_' + n, COL.metalOscuro);

  const GRIS_ACENTO = new THREE.Color(COL.metalOscuro);
  const NARANJA = new THREE.Color(COL.naranja);

  /* =====================================================================
     GEOMETRÍA AUXILIAR (el eje del motor es +X)
     ===================================================================== */
  const EJE_Y = 0.9;   // altura del eje sobre la base

  function malla(geo, mat, nombre) { const m = new THREE.Mesh(geo, mat); m.name = nombre; return m; }

  // Cilindro a lo largo de X, de x0 a x1 (rTop queda del lado de x1)
  function cilX(rIni, rFin, x0, x1, mat, nombre, opc = {}) {
    const g = new THREE.CylinderGeometry(rFin, rIni, x1 - x0, opc.seg || 48, 1, !!opc.abierto,
                                         opc.theta0 || 0, opc.thetaL || Math.PI * 2).rotateZ(-Math.PI / 2);
    const m = malla(g, mat, nombre);
    m.position.set((x0 + x1) / 2, opc.y ?? EJE_Y, 0);
    return m;
  }
  // Anillo macizo (perfil rectangular revolucionado) con eje en X
  function anillo(rIn, rOut, ancho, mat, nombre) {
    const p = [[rIn, -ancho / 2], [rOut, -ancho / 2], [rOut, ancho / 2], [rIn, ancho / 2], [rIn, -ancho / 2]]
              .map(([r, y]) => new THREE.Vector2(r, y));
    return malla(new THREE.LatheGeometry(p, 56).rotateZ(-Math.PI / 2), mat, nombre);
  }

  /* =====================================================================
     LA MÁQUINA: motor eléctrico de 250 HP
     ===================================================================== */
  const pivote = new THREE.Group();          // recibe la inclinación del cursor
  const raiz = new THREE.Group();            // desplaza todo para centrar el motor en el origen
  pivote.add(raiz); escena3D.add(pivote);
  const motor = new THREE.Group(); motor.name = 'motor'; raiz.add(motor);

  // Base y patas
  const base = malla(new THREE.BoxGeometry(2.55, 0.1, 1.15), M.marino, 'base');
  base.position.set(-0.12, 0.05, 0); motor.add(base);
  [-0.62, 0.58].forEach((x, i) => {
    const pata = malla(new THREE.BoxGeometry(0.36, 0.5, 0.98), M.profundo, 'pata_' + (i + 1));
    pata.position.set(x, 0.35, 0); motor.add(pata);
  });

  // Carcasa cilíndrica con aletas longitudinales
  motor.add(cilX(0.55, 0.55, -0.9, 0.9, M.claro, 'carcasa'));
  for (let k = 0; k < 32; k++) {
    const phi = (k / 32) * Math.PI * 2;                       // elevación medida desde +Z hacia +Y
    const dAbajo = Math.abs(Math.atan2(Math.sin(phi + Math.PI / 2), Math.cos(phi + Math.PI / 2)));
    if (dAbajo < rad(34)) continue;                          // sin aletas donde apoyan las patas
    const aleta = malla(new THREE.BoxGeometry(1.7, 0.1, 0.018), M.medio, 'aleta');
    aleta.position.set(0, EJE_Y + 0.59 * Math.sin(phi), 0.59 * Math.cos(phi));
    aleta.rotation.x = Math.PI / 2 - phi;
    motor.add(aleta);
  }
  motor.add(cilX(0.61, 0.61, 0.88, 0.93, M.medio, 'brida_la'));
  motor.add(cilX(0.61, 0.61, -0.93, -0.88, M.medio, 'brida_lv'));

  // Tapa lado acoplamiento (campana)
  motor.add(cilX(0.56, 0.42, 0.93, 1.08, M.medio, 'tapa_acoplamiento'));

  // Alojamiento del rodamiento, abierto un cuarto (cuña de -60° a +30° de elevación, hacia la cámara)
  const T0 = Math.PI / 3, TL = Math.PI * 1.5;
  motor.add(cilX(0.3, 0.3, 1.08, 1.30, mateDoble(M.oscuro), 'alojamiento', { abierto: true, theta0: T0, thetaL: TL }));
  motor.add(cilX(0.228, 0.228, 1.08, 1.30, mateDoble(M.medio), 'alojamiento_interior', { abierto: true, theta0: T0, thetaL: TL }));
  const cara = malla(new THREE.RingGeometry(0.09, 0.3, 56, 1, Math.PI * 4 / 3, TL).rotateY(Math.PI / 2), mateDoble(M.oscuro), 'alojamiento_cara');
  cara.position.set(1.301, EJE_Y, 0); motor.add(cara);
  [rad(-60), rad(30)].forEach((phi, i) => {                 // caras del corte
    const c = malla(new THREE.PlaneGeometry(0.22, 0.072), mateDoble(M.oscuro), 'corte_' + (i + 1));
    c.position.set(1.19, EJE_Y + 0.264 * Math.sin(phi), 0.264 * Math.cos(phi));
    c.rotation.x = Math.PI / 2 - phi;
    motor.add(c);
  });

  // Rodamiento: anillo exterior fijo (pulsa en el diagnóstico)
  const matAnilloExt = mate('anillo_exterior', COL.metalClaro);
  const anilloExt = anillo(0.185, 0.226, 0.09, matAnilloExt, 'anillo_exterior');
  anilloExt.position.set(1.19, EJE_Y, 0); motor.add(anilloExt);

  // Eje giratorio con cuña y anillo interior
  const eje = new THREE.Group(); eje.name = 'eje'; eje.position.set(0, EJE_Y, 0); motor.add(eje);
  eje.add(cilX(0.075, 0.075, 0.95, 1.86, M.claro, 'flecha', { y: 0, seg: 40 }));
  const cuna = malla(new THREE.BoxGeometry(0.34, 0.03, 0.036), M.oscuro, 'cuna');
  cuna.position.set(1.64, 0.074, 0); eje.add(cuna);
  const matAnilloInt = mate('anillo_interior', COL.metalClaro);
  const anilloInt = anillo(0.076, 0.12, 0.09, matAnilloInt, 'anillo_interior');
  anilloInt.position.set(1.19, 0, 0); eje.add(anilloInt);

  // Ocho bolas en su jaula (giran a la velocidad de la jaula, ~0.4 del eje)
  const jaula = new THREE.Group(); jaula.name = 'bolas'; jaula.position.set(0, EJE_Y, 0); motor.add(jaula);
  const geoBola = new THREE.SphereGeometry(0.034, 24, 16);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    const b = malla(geoBola, M.claro, 'bola_' + (k + 1));
    b.position.set(1.19, 0.1525 * Math.sin(a), 0.1525 * Math.cos(a));
    jaula.add(b);
  }

  // Tapa del ventilador con rejilla al fondo
  motor.add(cilX(0.53, 0.53, -1.32, -0.93, M.claro, 'tapa_ventilador'));
  const fondo = malla(new THREE.CircleGeometry(0.53, 48).rotateY(-Math.PI / 2), M.oscuro, 'rejilla_fondo');
  fondo.position.set(-1.321, EJE_Y, 0); motor.add(fondo);
  [0.12, 0.24, 0.36, 0.48].forEach(r => {
    const t = malla(new THREE.TorusGeometry(r, 0.012, 8, 48).rotateY(Math.PI / 2), M.medio, 'rejilla');
    t.position.set(-1.328, EJE_Y, 0); motor.add(t);
  });
  [-1.03, -1.14, -1.25].forEach(x => {
    const t = malla(new THREE.TorusGeometry(0.535, 0.013, 8, 64).rotateY(Math.PI / 2), M.medio, 'nervio_tapa');
    t.position.set(x, EJE_Y, 0); motor.add(t);
  });

  // Caja de conexiones arriba
  const asiento = malla(new THREE.BoxGeometry(0.44, 0.12, 0.3), M.medio, 'asiento_caja');
  asiento.position.set(0.2, EJE_Y + 0.58, 0); motor.add(asiento);
  const caja = malla(new THREE.BoxGeometry(0.5, 0.3, 0.44), M.marino, 'caja_conexiones');
  caja.position.set(0.2, EJE_Y + 0.79, 0); motor.add(caja);
  const tapaCaja = malla(new THREE.BoxGeometry(0.54, 0.04, 0.48), M.marino, 'tapa_caja');
  tapaCaja.position.set(0.2, EJE_Y + 0.96, 0); motor.add(tapaCaja);
  const conduit = malla(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 24).rotateX(Math.PI / 2), M.oscuro, 'entrada_cable');
  conduit.position.set(0.2, EJE_Y + 0.76, 0.27); motor.add(conduit);

  // Sombra de contacto: elipse suave generada en un canvas (sin texturas externas)
  {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128;
    const cx = cv.getContext('2d');
    const g = cx.createRadialGradient(128, 64, 0, 128, 64, 128);
    g.addColorStop(0, 'rgba(120,136,150,0.30)'); g.addColorStop(0.55, 'rgba(120,136,150,0.14)'); g.addColorStop(1, 'rgba(120,136,150,0)');
    cx.fillStyle = g; cx.fillRect(0, 0, 256, 128);
    const tex = new THREE.CanvasTexture(cv);
    const sombra = malla(new THREE.PlaneGeometry(3.9, 1.95).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }), 'sombra_contacto');
    sombra.position.set(-0.05, 0.001, 0); sombra.renderOrder = -1; raiz.add(sombra);
  }

  /* =====================================================================
     LOS CUATRO INSTRUMENTOS
     ===================================================================== */
  const Z = new THREE.Vector3(0, 0, 1);
  const instrumentos = [];   // { grupo, ancla, acento }

  // Anillos de pulso (arcos que salen del punto de contacto)
  const geoPulso = new THREE.RingGeometry(0.93, 1, 64);
  function pulsos(padre, n, nombre) {
    const lista = [];
    for (let j = 0; j < n; j++) {
      const m = new THREE.Mesh(geoPulso, new THREE.MeshBasicMaterial({ color: COL.naranja, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
      m.name = nombre + '_' + (j + 1); padre.add(m); lista.push(m);
    }
    return lista;
  }

  // 1. ACEITE: válvula de muestreo abajo del alojamiento + frasco de vidrio
  const aceite = new THREE.Group(); aceite.name = 'instrumento_aceite';
  aceite.position.set(1.19, EJE_Y - 0.3, 0);
  const acAceite = acento('aceite');
  {
    const tubo1 = malla(new THREE.CylinderGeometry(0.022, 0.022, 0.1, 20), M.oscuro, 'valvula_tubo'); tubo1.position.y = -0.05; aceite.add(tubo1);
    const tubo2 = malla(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 20).rotateX(Math.PI / 2), M.oscuro, 'valvula_codo'); tubo2.position.set(0, -0.1, 0.1); aceite.add(tubo2);
    const cuerpo = malla(new THREE.BoxGeometry(0.065, 0.065, 0.065), acAceite, 'valvula_cuerpo'); cuerpo.position.set(0, -0.1, 0.12); aceite.add(cuerpo);
    const manija = malla(new THREE.BoxGeometry(0.13, 0.016, 0.022), acAceite, 'valvula_manija'); manija.position.set(0.03, -0.055, 0.12); aceite.add(manija);
    const tubo3 = malla(new THREE.CylinderGeometry(0.014, 0.014, 0.06, 16), M.oscuro, 'valvula_salida'); tubo3.position.set(0, -0.14, 0.2); aceite.add(tubo3);
    const tapa = malla(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 32), M.oscuro, 'frasco_tapa'); tapa.position.set(0, -0.172, 0.2); aceite.add(tapa);
  }
  const llenado = malla(new THREE.CylinderGeometry(0.066, 0.066, 0.22, 32).translate(0, 0.11, 0),
    mate('aceite_ambar', COL.ambar), 'aceite');
  llenado.position.set(0, -0.407, 0.2); aceite.add(llenado);
  const particulas = [];
  [[0.02, 0.04, 0.01], [-0.025, 0.08, -0.02], [0.015, 0.13, 0.025], [-0.01, 0.17, -0.005]].forEach(([x, y, z], i) => {
    const p = malla(new THREE.BoxGeometry(0.016, 0.01, 0.012), mate('particula', '#5d6b75'), 'particula_' + (i + 1));
    p.position.set(x, -0.407 + y, 0.2 + z); p.userData.y = y; p.userData.x = x; p.visible = false;
    aceite.add(p); particulas.push(p);
  });
  const vidrio = malla(new THREE.CylinderGeometry(0.075, 0.075, 0.24, 40, 1, true),
    new THREE.MeshStandardMaterial({ name: 'vidrio', color: '#eef4f7', roughness: 0.4, metalness: 0, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }), 'frasco');
  vidrio.position.set(0, -0.297, 0.2); vidrio.renderOrder = 2; aceite.add(vidrio);
  const fondoFrasco = malla(new THREE.CircleGeometry(0.075, 32).rotateX(-Math.PI / 2), vidrio.material, 'frasco_fondo');
  fondoFrasco.position.set(0, -0.416, 0.2); aceite.add(fondoFrasco);
  const anclaAceite = new THREE.Object3D(); anclaAceite.position.set(0, -0.3, 0.2); aceite.add(anclaAceite);
  raiz.add(aceite);
  instrumentos.push({ grupo: aceite, ancla: anclaAceite, acento: acAceite });

  // 2. ULTRASONIDO: detector de contacto (cilindro con punta cónica) sobre el alojamiento
  const ultra = new THREE.Group(); ultra.name = 'instrumento_ultrasonido';
  {
    const phi = rad(55);
    ultra.position.set(1.245, EJE_Y + 0.3 * Math.sin(phi), 0.3 * Math.cos(phi));
    const n = new THREE.Vector3(0.28, Math.sin(phi), Math.cos(phi)).normalize();
    ultra.quaternion.setFromUnitVectors(Z, n);
  }
  const acUltra = acento('ultrasonido');
  {
    const punta = malla(new THREE.ConeGeometry(0.03, 0.075, 28).rotateX(-Math.PI / 2), M.oscuro, 'detector_punta'); punta.position.z = 0.0375; ultra.add(punta);
    const cuerpo = malla(new THREE.CylinderGeometry(0.036, 0.036, 0.26, 28).rotateX(Math.PI / 2), M.claro, 'detector_cuerpo'); cuerpo.position.z = 0.205; ultra.add(cuerpo);
    const banda = malla(new THREE.CylinderGeometry(0.039, 0.039, 0.05, 28).rotateX(Math.PI / 2), acUltra, 'detector_banda'); banda.position.z = 0.2; ultra.add(banda);
    const tapa = malla(new THREE.CylinderGeometry(0.022, 0.03, 0.03, 20).rotateX(Math.PI / 2), M.oscuro, 'detector_tapa'); tapa.position.z = 0.35; ultra.add(tapa);
  }
  const arcosUltra = pulsos(ultra, 3, 'arco_ultrasonido');
  arcosUltra.forEach(a => a.position.z = 0.006);
  const anclaUltra = new THREE.Object3D(); anclaUltra.position.z = 0.33; ultra.add(anclaUltra);
  raiz.add(ultra);
  instrumentos.push({ grupo: ultra, ancla: anclaUltra, acento: acUltra });

  // 3. VIBRACIONES: sensor cúbico con cable, montado arriba del alojamiento
  const vib = new THREE.Group(); vib.name = 'instrumento_vibraciones';
  vib.position.set(1.13, EJE_Y + 0.3, 0);
  const acVib = acento('vibraciones');
  {
    const asientoS = malla(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 28), M.oscuro, 'sensor_base'); asientoS.position.y = 0.006; vib.add(asientoS);
    const cubo = malla(new THREE.BoxGeometry(0.1, 0.1, 0.1), acVib, 'sensor_cubo'); cubo.position.y = 0.062; vib.add(cubo);
    const conector = malla(new THREE.CylinderGeometry(0.018, 0.018, 0.04, 16).rotateX(Math.PI / 2), M.oscuro, 'sensor_conector'); conector.position.set(0, 0.062, -0.07); vib.add(conector);
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.062, -0.09), new THREE.Vector3(-0.02, 0.07, -0.22), new THREE.Vector3(-0.12, -0.05, -0.44),
      new THREE.Vector3(-0.22, -0.5, -0.64), new THREE.Vector3(-0.26, -1.08, -0.66)]);
    vib.add(malla(new THREE.TubeGeometry(curva, 48, 0.011, 10), mate('cable', '#4a5a66'), 'sensor_cable'));
  }
  const pulsosVib = pulsos(vib, 3, 'pulso_vibracion');
  pulsosVib.forEach(p => { p.rotation.x = -Math.PI / 2; p.position.y = 0.014; });
  const anclaVib = new THREE.Object3D(); anclaVib.position.set(0, 0.09, 0); vib.add(anclaVib);
  raiz.add(vib);
  instrumentos.push({ grupo: vib, ancla: anclaVib, acento: acVib });

  // 4. TERMOGRAFÍA: cámara térmica de mano apuntando al alojamiento desde arriba a la derecha
  const termo = new THREE.Group(); termo.name = 'instrumento_termografia';
  {
    const pos = new THREE.Vector3(1.5, 2.0, 0.3), objetivo = new THREE.Vector3(1.19, EJE_Y + 0.3, 0);
    termo.position.copy(pos);
    termo.quaternion.setFromUnitVectors(Z, objetivo.clone().sub(pos).normalize());
  }
  const acTermo = acento('termografia');
  {
    const cuerpo = malla(new THREE.BoxGeometry(0.15, 0.13, 0.2), M.marino, 'camara_cuerpo'); termo.add(cuerpo);
    const lente = malla(new THREE.CylinderGeometry(0.046, 0.046, 0.07, 28).rotateX(Math.PI / 2), M.oscuro, 'camara_lente'); lente.position.z = 0.135; termo.add(lente);
    const aro = malla(new THREE.CylinderGeometry(0.052, 0.052, 0.022, 28).rotateX(Math.PI / 2), acTermo, 'camara_aro'); aro.position.z = 0.172; termo.add(aro);
    const mango = malla(new THREE.BoxGeometry(0.055, 0.17, 0.065), M.profundo, 'camara_mango'); mango.position.set(0, -0.13, -0.035); mango.rotation.x = 0.28; termo.add(mango);
    const pantalla = malla(new THREE.PlaneGeometry(0.11, 0.08).rotateY(Math.PI), mate('pantalla', '#3b5566'), 'camara_pantalla'); pantalla.position.z = -0.101; termo.add(pantalla);
  }
  const anclaTermo = new THREE.Object3D(); anclaTermo.position.set(0, 0.07, 0); termo.add(anclaTermo);
  raiz.add(termo);
  instrumentos.push({ grupo: termo, ancla: anclaTermo, acento: acTermo });

  // Halo de calor: amarillo → naranja → rojo, solo sobre el alojamiento
  const halo = (() => {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128;
    const cx = cv.getContext('2d');
    cx.translate(128, 64); cx.scale(2, 1);
    const g = cx.createRadialGradient(0, 0, 0, 0, 0, 64);
    g.addColorStop(0, 'rgba(214,45,32,0.9)'); g.addColorStop(0.3, 'rgba(252,120,1,0.8)');
    g.addColorStop(0.62, 'rgba(250,210,60,0.55)'); g.addColorStop(1, 'rgba(250,220,80,0)');
    cx.fillStyle = g; cx.fillRect(-64, -64, 128, 128);
    const mat = new THREE.MeshBasicMaterial({ name: 'halo_calor', map: new THREE.CanvasTexture(cv), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    const m = malla(new THREE.CylinderGeometry(0.312, 0.312, 0.3, 48, 1, true, rad(-168), rad(136)).rotateZ(-Math.PI / 2), mat, 'halo_calor');
    m.position.set(1.19, EJE_Y, 0); m.renderOrder = 1; raiz.add(m);
    return m;
  })();

  // Punto del rodamiento (donde convergen los hilos al final)
  const puntoRodamiento = new THREE.Object3D(); puntoRodamiento.position.set(1.19, EJE_Y + 0.12, 0.12); raiz.add(puntoRodamiento);

  /* =====================================================================
     ENCUADRE: el motor ocupa ~55 % del ancho, ligeramente a la izquierda
     ===================================================================== */
  {
    const caja = new THREE.Box3().setFromObject(motor);
    const centro = caja.getCenter(new THREE.Vector3());
    raiz.position.copy(centro).negate();                 // motor centrado en el origen
    raiz.updateMatrixWorld(true);
    const cajaM = new THREE.Box3().setFromObject(motor);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i < 8; i++) {
      const v = new THREE.Vector3(i & 1 ? cajaM.max.x : cajaM.min.x, i & 2 ? cajaM.max.y : cajaM.min.y, i & 4 ? cajaM.max.z : cajaM.min.z)
        .applyMatrix4(camara.matrixWorldInverse);
      x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
    }
    // La caja envolvente sobreestima un poco el ancho visible; se compensa con 0.82
    const W = (x1 - x0) * 0.82 / 0.55, H = W * ALTO / ANCHO;
    const izq = x0 + (x1 - x0) * 0.05 - W * 0.05;
    camara.left = izq; camara.right = izq + W;
    const cy = (y0 + y1) / 2;
    camara.top = cy + H * 0.47; camara.bottom = cy - H * 0.53;
    camara.updateProjectionMatrix();
  }

  /* =====================================================================
     CAPA HTML: paneles, diagnóstico e hilos
     ===================================================================== */
  const NS = 'http://www.w3.org/2000/svg';

  // Gráficas SVG de cada panel (se actualizan cada cuadro con el progreso p ∈ [0,1])
  const graficas = [
    // Aceite: histórico gris + barra actual que rebasa la línea de alarma
    () => {
      const hist = [10, 12, 11, 15, 19];
      let s = hist.map((h, i) => `<rect x="${8 + i * 28}" y="${56 - h}" width="18" height="${h}" rx="1.5" fill="${COL.metalOscuro}"/>`).join('');
      s += `<rect data-barra x="148" y="52" width="22" height="4" rx="1.5" fill="${COL.metalMedio}"/>`;
      s += `<line x1="0" y1="24" x2="204" y2="24" stroke="#eef1f4" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>`;
      s += `<line x1="0" y1="56.5" x2="204" y2="56.5" stroke="${COL.metalOscuro}" stroke-width="1"/>`;
      return s;
    },
    // Ultrasonido: forma de onda con picos que crecen
    () => `<line x1="0" y1="22" x2="204" y2="22" stroke="#eef1f4" stroke-dasharray="3 3" opacity=".45"/>
           <line x1="0" y1="36" x2="204" y2="36" stroke="#eef1f4" stroke-dasharray="3 3" opacity=".45"/>
           <path data-onda fill="none" stroke="${COL.metalClaro}" stroke-width="1.2" stroke-linejoin="round"/>`,
    // Vibraciones: espectro con una barra naranja sobre la alarma
    () => {
      const r = azar(7); let s = '';
      for (let j = 0; j < 18; j++) {
        const h = j === 7 ? 6 : 3 + r() * 10 + (j === 14 ? 6 : 0);
        s += `<rect ${j === 7 ? 'data-pico' : ''} x="${3 + j * 11.2}" y="${56 - h}" width="7" height="${h}" rx="1" fill="${j === 7 ? COL.naranja : COL.metalOscuro}"/>`;
      }
      s += `<line x1="0" y1="22" x2="204" y2="22" stroke="#eef1f4" stroke-dasharray="3 3" opacity=".7"/>`;
      s += `<line x1="0" y1="56.5" x2="204" y2="56.5" stroke="${COL.metalOscuro}"/>`;
      return s;
    },
    // Termografía: mini termograma con cruz de medición
    () => `<defs>
             <linearGradient id="tg-base" x1="0" x2="1"><stop offset="0" stop-color="#1f3f8f"/><stop offset=".55" stop-color="#2f7fb4"/><stop offset="1" stop-color="#6a4aa0"/></linearGradient>
             <radialGradient id="tg-calor" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d62d20"/><stop offset=".35" stop-color="#fc7801"/><stop offset=".7" stop-color="#f5d23c"/><stop offset="1" stop-color="#f5d23c" stop-opacity="0"/></radialGradient>
           </defs>
           <rect x="0" y="0" width="204" height="58" rx="3" fill="url(#tg-base)"/>
           <ellipse data-calor cx="128" cy="30" rx="62" ry="34" fill="url(#tg-calor)" opacity="0"/>
           <g data-cruz stroke="#ffffff" stroke-width="1" fill="none" opacity="0">
             <line x1="128" y1="16" x2="128" y2="25"/><line x1="128" y1="35" x2="128" y2="44"/>
             <line x1="114" y1="30" x2="123" y2="30"/><line x1="133" y1="30" x2="142" y2="30"/>
             <circle cx="128" cy="30" r="4"/>
           </g>`
  ];

  const paneles = TEXTOS.map((tx, i) => {
    const el = document.createElement('div');
    el.className = 'panel';
    el.innerHTML = `<div class="cab"><span class="tit">${esc(tx.titulo)}</span><span class="pildora">${esc(tx.pildora)}</span></div>
      <div class="cuerpo"><svg viewBox="0 0 204 58">${graficas[i]()}</svg>
      <div class="dato"><b>${esc(tx.valor)}</b>${tx.detalle ? `<span>${esc(tx.detalle)}</span>` : ''}</div></div>`;
    escenaEl.appendChild(el);
    const hilo = document.createElementNS(NS, 'path'); hilo.setAttribute('fill', 'none'); svgHilos.appendChild(hilo);
    const punto = document.createElementNS(NS, 'circle'); punto.setAttribute('r', '2.8'); punto.setAttribute('fill', COL.naranja); svgHilos.appendChild(punto);
    return {
      el, hilo, punto,
      pildora: el.querySelector('.pildora'), dato: el.querySelector('.dato'),
      barra: el.querySelector('[data-barra]'), onda: el.querySelector('[data-onda]'), pico: el.querySelector('[data-pico]'),
      calor: el.querySelector('[data-calor]'), cruz: el.querySelector('[data-cruz]'),
      cuerpoAlto: 0
    };
  });
  paneles.forEach(p => p.cuerpoAlto = p.el.querySelector('.cuerpo').offsetHeight);

  const diag = document.createElement('div');
  diag.className = 'diag';
  diag.innerHTML = `<div class="tit">${esc(DIAGNOSTICO.titulo)} · <b>${esc(DIAGNOSTICO.coinciden)}</b></div><p>${esc(DIAGNOSTICO.texto)}</p>`;
  escenaEl.appendChild(diag);

  // Datos fijos de la onda de ultrasonido
  const ruido = (() => { const r = azar(3); return Array.from({ length: 120 }, () => r()); })();
  function trazoOnda(p) {
    let d = '';
    for (let i = 0; i < 120; i++) {
      const x = (i * 204 / 119).toFixed(1);
      const loc = i % 24;
      const env = loc < 9 ? Math.exp(-loc * 0.45) : 0;
      const amp = 1.5 + ruido[i] * 2.5 + env * (3 + 22 * p) * (0.6 + 0.4 * ruido[(i * 7) % 120]);
      const y = (29 + (i % 2 ? 1 : -1) * amp).toFixed(1);
      d += (i ? 'L' : 'M') + x + ' ' + y;
    }
    return d;
  }

  // Proyección de un punto del mundo a coordenadas de la escena HTML (720×540)
  const tmp = new THREE.Vector3();
  function aPantalla(obj, destino) {
    obj.getWorldPosition(tmp).project(camara);
    destino.x = (tmp.x + 1) / 2 * ANCHO; destino.y = (1 - tmp.y) / 2 * ALTO;
    return destino;
  }

  /* =====================================================================
     LÍNEA DE TIEMPO: todo se deriva de t (segundos, módulo CICLO)
     ===================================================================== */
  const CAB = 28, HUECO = 6, ARRIBA = 20, MARGEN_DER = 22;
  const pA = { x: 0, y: 0 }, pR = { x: 0, y: 0 }, pE = { x: 0, y: 0 };

  function actualizar(t, tiempoAbs) {
    const fundido = 1 - suave((t - T_FUNDIDO) / 0.45);
    const cFinal = suave((t - T_FINAL) / 0.6);

    // Giro constante del eje y de la jaula de bolas
    const ang = reducido ? 0.6 : tiempoAbs * GIRO_EJE;
    eje.rotation.x = ang; jaula.rotation.x = ang * 0.4;

    // Pulso naranja del rodamiento en el diagnóstico
    const pulso = t >= T_FINAL ? (0.55 + 0.45 * Math.sin((t - T_FINAL) * 6)) * cFinal * fundido : 0;
    matAnilloExt.color.lerpColors(new THREE.Color(COL.metalClaro), NARANJA, pulso);
    matAnilloInt.color.lerpColors(new THREE.Color(COL.metalClaro), NARANJA, pulso * 0.8);

    aPantalla(puntoRodamiento, pR);
    aPantalla(eje.children[0], pE);
    const derecha = Math.min(ANCHO - MARGEN_DER, Math.max(ANCHO - 60, pE.x + 300));
    const colX = derecha - 224;
    let y = ARRIBA;

    instrumentos.forEach((ins, i) => {
      const s = INICIO[i];
      const aparece = t >= s ? salidaRebote((t - s) / 0.45) : 0;
      const activo = suave((t - s) / 0.3) * (1 - suave((t - s - DURACION) / 0.3));
      const progreso = clamp((t - s - 0.8) / 1.4);
      const revela = suave((t - s - 0.5) / 0.4);
      const expande = suave((t - s - 0.7) / 0.45) * (1 - suave((t - s - DURACION) / 0.45));

      // Instrumento 3D
      const esc = Math.max(0.0001, aparece * fundido);
      ins.grupo.scale.setScalar(esc);
      ins.grupo.visible = aparece > 0.001 && fundido > 0.001;
      ins.acento.color.lerpColors(GRIS_ACENTO, NARANJA, activo);

      // Efectos propios
      if (i === 0) {
        const lleno = suave((t - s - 0.35) / 1.3);
        llenado.scale.y = Math.max(0.001, lleno); llenado.visible = lleno > 0.01;
        particulas.forEach((p, k) => {
          p.visible = lleno * 0.22 > p.userData.y + 0.01;
          p.rotation.y = tiempoAbs * (0.6 + k * 0.2); p.position.x = p.userData.x + Math.sin(tiempoAbs * 0.9 + k) * 0.006;
        });
      }
      if (i === 1) arcosUltra.forEach((a, j) => {
        const q = ((t * 0.9) + j / 3) % 1;
        a.scale.setScalar(0.05 + q * 0.19); a.material.opacity = (1 - q) * activo * 0.9;
      });
      if (i === 2) pulsosVib.forEach((a, j) => {
        const q = ((t * 1.1) + j / 3) % 1;
        a.scale.setScalar(0.07 + q * 0.2); a.material.opacity = (1 - q) * activo * 0.85;
      });
      if (i === 3) {
        const h = suave((t - s - 0.6) / 0.8);
        halo.material.opacity = h * (0.55 + 0.45 * Math.max(activo, cFinal)) * fundido * (0.92 + 0.08 * Math.sin(t * 5));
      }

      // Panel HTML
      const P = paneles[i];
      const visible = revela * fundido;
      const alto = CAB + expande * P.cuerpoAlto;
      P.el.style.opacity = visible.toFixed(3);
      P.el.style.height = alto.toFixed(1) + 'px';
      P.el.style.transform = `translate(${colX.toFixed(1)}px, ${y.toFixed(1)}px)`;
      const datoVis = clamp((progreso - 0.55) / 0.3);
      P.pildora.style.opacity = datoVis.toFixed(3);
      P.dato.style.opacity = datoVis.toFixed(3);
      if (P.barra) { const h = 4 + progreso * 42; P.barra.setAttribute('y', (56 - h).toFixed(1)); P.barra.setAttribute('height', h.toFixed(1)); P.barra.setAttribute('fill', h > 32 ? COL.naranja : COL.metalMedio); }
      if (P.onda) P.onda.setAttribute('d', trazoOnda(progreso));
      if (P.pico) { const h = 6 + progreso * 42; P.pico.setAttribute('y', (56 - h).toFixed(1)); P.pico.setAttribute('height', h.toFixed(1)); }
      if (P.calor) { P.calor.setAttribute('opacity', (0.2 + 0.8 * progreso).toFixed(3)); P.cruz.setAttribute('opacity', datoVis.toFixed(3)); }

      // Hilo: del instrumento (o del rodamiento, al final) al borde izquierdo del panel
      aPantalla(ins.ancla, pA);
      const sx = pA.x + (pR.x - pA.x) * cFinal, sy = pA.y + (pR.y - pA.y) * cFinal;
      const ex = colX, ey = y + CAB / 2;
      const dx = ex - sx;
      P.hilo.setAttribute('d', `M${sx.toFixed(1)} ${sy.toFixed(1)} C${(sx + dx * 0.5).toFixed(1)} ${sy.toFixed(1)} ${(ex - dx * 0.45).toFixed(1)} ${ey.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
      const naranja = Math.max(activo, cFinal);
      P.hilo.setAttribute('stroke', naranja > 0.5 ? COL.naranja : COL.hiloGris);
      P.hilo.setAttribute('stroke-width', naranja > 0.5 ? '1.5' : '1');
      P.hilo.style.opacity = (revela > 0 ? fundido : 0).toFixed(3);
      const largo = P.hilo.getTotalLength();
      P.hilo.setAttribute('stroke-dasharray', `${largo.toFixed(1)} ${(largo + 10).toFixed(1)}`);
      P.hilo.setAttribute('stroke-dashoffset', (largo * (1 - revela)).toFixed(1));
      // Punto que recorre del instrumento al panel mientras la técnica está activa
      if (activo > 0.5 && revela >= 1 && !reducido) {
        const pt = P.hilo.getPointAtLength((((t - s) * 0.9) % 1) * largo);
        P.punto.setAttribute('cx', pt.x.toFixed(1)); P.punto.setAttribute('cy', pt.y.toFixed(1));
        P.punto.style.opacity = '1';
      } else P.punto.style.opacity = '0';

      y += (alto + HUECO) * visible;
    });

    // Panel de diagnóstico integrado, bajo la pila
    const d = suave((t - T_FINAL - 0.5) / 0.5) * fundido;
    diag.style.opacity = d.toFixed(3);
    diag.style.transform = `translate(${(derecha - 250).toFixed(1)}px, ${(y + 6 + (1 - d) * 8).toFixed(1)}px)`;
  }

  /* =====================================================================
     TAMAÑO, CURSOR Y BUCLE
     ===================================================================== */
  function redimensionar() {
    const k = marco.clientWidth / ANCHO;
    escenaEl.style.transform = `scale(${k})`;
    renderer.setPixelRatio(Math.max(0.5, Math.min(2, window.devicePixelRatio || 1) * k));
    renderer.setSize(ANCHO, ALTO, false);
    if (reducido) dibujar(performance.now() / 1000);
  }
  const observador = new ResizeObserver(redimensionar);
  observador.observe(marco);

  // Inclinación máxima de 2° siguiendo al cursor (opcional, sin interacción obligatoria)
  const incl = { x: 0, y: 0, ox: 0, oy: 0 };
  const alMover = e => {
    const r = marco.getBoundingClientRect();
    incl.ox = ((e.clientX - r.left) / r.width) * 2 - 1;
    incl.oy = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  const alSalir = () => { incl.ox = 0; incl.oy = 0; };
  if (!reducido) {
    marco.addEventListener('pointermove', alMover);
    marco.addEventListener('pointerleave', alSalir);
  }

  const inicioReloj = performance.now();
  function dibujar(ahora) {
    const tAbs = (ahora - inicioReloj) / 1000;
    const t = reducido ? T_REDUCIDO : tAbs % CICLO;
    incl.x += (incl.ox - incl.x) * 0.06; incl.y += (incl.oy - incl.y) * 0.06;
    pivote.rotation.z = -incl.x * rad(INCLINACION);
    pivote.rotation.x = incl.y * rad(INCLINACION);
    pivote.updateMatrixWorld(true);
    actualizar(t, tAbs);
    renderer.render(escena3D, camara);
  }

  redimensionar();
  if (reducido) dibujar(performance.now());
  else renderer.setAnimationLoop(() => dibujar(performance.now()));

  return () => {
    renderer.setAnimationLoop(null);
    observador.disconnect();
    marco.removeEventListener('pointermove', alMover);
    marco.removeEventListener('pointerleave', alSalir);
    escena3D.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      mats.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
    });
    renderer.dispose();
    renderer.domElement.remove();
    escenaEl.querySelectorAll('.panel, .diag').forEach(n => n.remove());
    svgHilos.replaceChildren();
  };
}
