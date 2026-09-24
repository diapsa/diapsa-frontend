/**
 * Lógica de la escena "del sensor a tu teléfono" de sensores de vibración:
 * una bomba con tres sensores inalámbricos que mandan su lectura a la
 * estación base; la estación la envía a la plataforma, donde la tendencia
 * sale de su banda normal; un analista la revisa y el aviso llega al
 * teléfono. Bucle de doce segundos.
 *
 * Portada casi verbatim del diseño hecho en Claude Diseño
 * (docs/designs/sensores-vibracion-escena.html), como lib/escena-integral.js.
 *
 * Cambios respecto al original: Three.js llega por parámetro; el marcado de
 * paneles se inserta dentro del cuadro que da el componente y todo se busca
 * ahí, no en `document`; los textos se pueden sobrescribir desde el JSON;
 * la escala de luces se ajusta a la versión de three del sitio (el diseño,
 * hecho en r184, multiplicaba por pi para imitar la iluminación clásica que
 * r128 ya usa); se quitaron preserveDrawingBuffer y el gancho de depuración
 * window.__verEn; y la función devuelve una limpieza completa.
 */

const MARCADO = `  <div class="escenario" id="escenario">
    <div class="capa" id="capa">
      <div class="ancla rotulo" id="rotuloLectura"></div>

      <div class="ancla panel" id="plataforma">
        <div class="cab">
          <div><div class="tit" id="pTitulo"></div><div class="sub" id="pSub"></div></div>
          <span class="pill" id="pPill"></span>
        </div>
        <div class="grafica" id="grafica">
          <svg viewBox="0 0 230 96" width="230" height="96" aria-hidden="true">
            <rect id="banda" x="0" y="0" width="230" height="0" rx="3" fill="#ffffff" fill-opacity="0.12"></rect>
            <polyline id="lineaNormal" fill="none" stroke="#d9e2e8" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" points=""></polyline>
            <polyline id="lineaCambio" fill="none" stroke="#fc9f01" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" points=""></polyline>
            <circle id="cabeza" r="3.2" fill="#d9e2e8" cx="-20" cy="-20"></circle>
          </svg>
          <div class="banda-txt" id="bandaTxt"></div>
          <div class="cambio" id="cambioTxt"></div>
        </div>
        <div class="pie"><span id="pieIni"></span><span id="pieFin"></span></div>
      </div>

      <div class="ancla panel" id="analista">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <circle cx="9" cy="9" r="9" fill="#2b5671"></circle>
          <circle cx="9" cy="7" r="2.8" fill="#d9e2e8"></circle>
          <path d="M3.8 14.6c.9-2.4 2.9-3.6 5.2-3.6s4.3 1.2 5.2 3.6" fill="#d9e2e8"></path>
        </svg>
        <span class="txt" id="aTexto"></span>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="8" fill="#fc9f01"></circle>
          <path id="palomita" d="M4.4 8.3l2.4 2.4 4.8-5" fill="none" stroke="#002e46" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="12" stroke-dashoffset="12"></path>
        </svg>
      </div>

      <div class="ancla panel" id="aviso">
        <div class="cab"><span class="tit" id="nApp"></span><span class="tit" id="nHora"></span></div>
        <div class="t1" id="nT1"></div>
        <div class="t2" id="nT2"></div>
        <span class="pill on" id="nPill"></span>
        <div class="t3" id="nT3"></div>
      </div>
    </div>
    <div class="fundido" id="fundido"></div>
  </div>`;

/**
 * @param {typeof import("three")} THREE
 * @param {HTMLElement} cuadro  marco 4:3 que da el componente (clase .escsen)
 * @param {Record<string, string>} [textos]  textos que sustituyen a los del diseño
 * @returns {() => void} limpieza
 */
export function montarEscenaSensores(THREE, cuadro, textos) {
  /* =====================================================================
     CONSTANTES — tiempos (segundos), colores y textos
     ===================================================================== */
  const CICLO = 12;                    // bucle completo
  const T = {
    lecturaFin: 3,                     // 0–3 s: pulsos de los sensores
    envioFin: 6,                       // 3–6 s: estación base → plataforma
    cambioFin: 8,                      // 6–8 s: la tendencia sale de la banda
    analistaFin: 10,                   // 8–10 s: revisión del analista
    fundidoIni: 11.55,                 // 10–12 s: aviso en teléfono y fundido
    final: 11.3                        // cuadro fijo con prefers-reduced-motion
  };
  // El diseño se hizo en three r184 y multiplicaba por pi para igualar la
  // iluminación clásica; el sitio usa r128, que ya es la clásica.
  const LUZ_ESCALA = Number(THREE.REVISION) < 155 ? 1 : Math.PI;
  const VEL_EJE = 1.4;                 // rad/s, giro lento del eje
  const INCLINACION_MAX = 2;           // grados, inclinación con el cursor

  const COLOR = {
    metalClaro: 0xd9e2e8, metalMedio: 0xb7c6d0, metalOscuro: 0x8fa4b2,
    marino: 0x2b5671, profundo: 0x1c4560, naranja: 0xfc9f01,
    suelo: 0xd9e0e6, pantallaApagada: 0x3d5566, pantallaEncendida: 0xeef1f4
  };

  const TEXTO_BASE = {
    lectura: 'Lectura cada 10 min',
    panelTitulo: 'Bomba de proceso',
    panelSub: 'Rodamiento lado acoplamiento',
    estadoNormal: 'Normal',
    estadoAlerta: 'Precaución',
    banda: 'Comportamiento normal',
    cambio: 'Cambio de tendencia',
    pieIni: 'Hace 30 días',
    pieFin: 'Hoy',
    analista: 'Revisado por especialista Cat. III',
    avisoApp: 'Aviso',
    avisoHora: 'ahora',
    aviso1: 'Bomba de proceso',
    aviso2: 'rodamiento lado acoplamiento',
    aviso3: 'Precaución',
    aviso4: 'Programar cambio en la siguiente ventana'
  };

  const TEXTO = { ...TEXTO_BASE, ...(textos ?? {}) };

  /* ---------- Textos al DOM ---------- */
  cuadro.innerHTML = MARCADO;
  const $ = id => cuadro.querySelector('#' + id);
  $('rotuloLectura').textContent = TEXTO.lectura;
  $('pTitulo').textContent = TEXTO.panelTitulo;
  $('pSub').textContent = TEXTO.panelSub;
  $('bandaTxt').textContent = TEXTO.banda;
  $('cambioTxt').textContent = TEXTO.cambio;
  $('pieIni').textContent = TEXTO.pieIni;
  $('pieFin').textContent = TEXTO.pieFin;
  $('aTexto').textContent = TEXTO.analista;
  $('nApp').textContent = TEXTO.avisoApp;
  $('nHora').textContent = TEXTO.avisoHora;
  $('nT1').textContent = TEXTO.aviso1;
  $('nT2').textContent = TEXTO.aviso2;
  $('nPill').textContent = TEXTO.aviso3;
  $('nT3').textContent = TEXTO.aviso4;

  /* ---------- Utilidades ---------- */
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const suave = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const W = 720, H = 540, PX = 108;    // 108 px por unidad (alto ortográfico = 5)

  /* ---------- Render, escena, cámara ---------- */
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escenario = $('escenario');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  escenario.insertBefore(renderer.domElement, escenario.firstChild);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-W / PX / 2, W / PX / 2, H / PX / 2, -H / PX / 2, 0.1, 100);
  const CAM_BASE = new THREE.Vector3(4, 3.1, 5);
  camera.position.copy(CAM_BASE);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  scene.add(new THREE.HemisphereLight(0xffffff, COLOR.suelo, 0.95 * LUZ_ESCALA));
  const dir = new THREE.DirectionalLight(0xffffff, 0.55 * LUZ_ESCALA);
  dir.position.set(3, 6, 4);
  scene.add(dir);

  /* Ejes de pantalla de la cámara base: para colocar objetos por coordenada de pantalla */
  const EJE_DER = new THREE.Vector3(5, 0, -4).normalize();          // derecha en pantalla (horizontal)
  const EJE_FRENTE = new THREE.Vector3(4, 0, 5).normalize();        // hacia la cámara (horizontal)
  const EJE_ARRIBA = new THREE.Vector3().crossVectors(EJE_DER, new THREE.Vector3(-4, -3.1, -5).normalize());
  const K_SUELO = -EJE_FRENTE.dot(EJE_ARRIBA);                      // cuánto sube en pantalla el suelo al alejarse
  // Punto del suelo (y = 0) que cae en el píxel (sx, sy)
  const suelo = (sx, sy) => EJE_DER.clone().multiplyScalar((sx - W / 2) / PX)
    .add(EJE_FRENTE.clone().multiplyScalar((sy - H / 2) / (PX * K_SUELO)));
  // Punto en el plano que pasa por el origen, frente a la cámara
  const plano = (sx, sy) => EJE_DER.clone().multiplyScalar((sx - W / 2) / PX)
    .add(EJE_ARRIBA.clone().multiplyScalar((H / 2 - sy) / PX));
  const YAW_CAMARA = Math.atan2(4, 5);

  /* ---------- Materiales (mates) ---------- */
  const mate = (nombre, color) => { const m = new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.05 }); m.name = nombre; return m; };
  const M = {
    claro: mate('metal_claro', COLOR.metalClaro),
    medio: mate('metal_medio', COLOR.metalMedio),
    oscuro: mate('metal_oscuro', COLOR.metalOscuro),
    marino: mate('azul_marino', COLOR.marino),
    profundo: mate('azul_profundo', COLOR.profundo)
  };
  const plano_ = (color, op = 1) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false });

  /* ---------- Constructores de primitivas ---------- */
  function malla(nombre, geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.name = nombre; m.position.set(x, y, z); return m; }
  function caja(nombre, w, h, d, mat, x, y, z) { return malla(nombre, new THREE.BoxGeometry(w, h, d), mat, x, y, z); }
  // Cilindro con eje a lo largo de X
  function cilX(nombre, r, largo, mat, x, y, z, seg = 40) { const g = new THREE.CylinderGeometry(r, r, largo, seg); g.rotateZ(Math.PI / 2); return malla(nombre, g, mat, x, y, z); }
  function cilY(nombre, r, alto, mat, x, y, z, seg = 32) { return malla(nombre, new THREE.CylinderGeometry(r, r, alto, seg), mat, x, y, z); }

  /* =====================================================================
     BOMBA + MOTOR SOBRE BASE (eje a lo largo de X)
     ===================================================================== */
  const bomba = new THREE.Group(); bomba.name = 'conjunto_bomba';
  const EJE_Y = 0.6;                   // altura del eje
  bomba.add(caja('pedestal', 2.62, 0.08, 0.92, M.claro, 0.02, 0.04, 0));
  bomba.add(caja('base', 2.5, 0.1, 0.78, M.oscuro, 0.02, 0.131, 0));
  const YB = 0.181;                    // cara superior de la base

  // Motor
  const motor = new THREE.Group(); motor.name = 'motor';
  motor.add(cilX('carcasa_motor', 0.34, 0.76, M.medio, -0.63, EJE_Y, 0, 48));
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const aleta = caja('aleta_' + k, 0.7, 0.06, 0.028, M.claro, -0.63, EJE_Y + Math.cos(a) * 0.35, Math.sin(a) * 0.35);
    aleta.rotation.x = a; motor.add(aleta);
  }
  motor.add(cilX('tapa_ventilador', 0.33, 0.22, M.claro, -1.12, EJE_Y, 0, 48));
  motor.add(cilX('rejilla', 0.25, 0.02, M.oscuro, -1.235, EJE_Y, 0, 40));
  motor.add(cilX('tapa_lado_acople', 0.3, 0.07, M.oscuro, -0.215, EJE_Y, 0, 48));
  motor.add(cilX('alojamiento_motor', 0.14, 0.08, M.oscuro, -0.145, EJE_Y, 0, 32));
  motor.add(caja('caja_bornes', 0.24, 0.14, 0.24, M.claro, -0.66, EJE_Y + 0.4, 0));
  motor.add(caja('pata_1', 0.14, EJE_Y - 0.24 - YB + 0.05, 0.6, M.oscuro, -0.93, (EJE_Y - 0.24 + YB) / 2 + 0.02, 0));
  motor.add(caja('pata_2', 0.14, EJE_Y - 0.24 - YB + 0.05, 0.6, M.oscuro, -0.33, (EJE_Y - 0.24 + YB) / 2 + 0.02, 0));
  bomba.add(motor);

  // Eje y acople (giran)
  const eje = new THREE.Group(); eje.name = 'eje_giratorio'; eje.position.set(0, EJE_Y, 0);
  eje.add(cilX('eje', 0.035, 0.62, M.claro, 0.07, 0, 0, 24));
  eje.add(cilX('maza_motor', 0.1, 0.09, M.profundo, -0.02, 0, 0, 32));
  eje.add(cilX('estrella', 0.085, 0.03, M.oscuro, 0.04, 0, 0, 32));
  eje.add(cilX('maza_bomba', 0.1, 0.09, M.profundo, 0.1, 0, 0, 32));
  eje.add(caja('marca_giro', 0.2, 0.03, 0.03, M.claro, 0.04, 0.1, 0));
  bomba.add(eje);

  // Bomba
  const cuerpo = new THREE.Group(); cuerpo.name = 'bomba';
  cuerpo.add(cilX('bastidor', 0.15, 0.5, M.oscuro, 0.45, EJE_Y, 0, 40));
  cuerpo.add(cilX('rodamiento_la', 0.2, 0.11, M.medio, 0.26, EJE_Y, 0, 40));   // lado acoplamiento
  cuerpo.add(cilX('rodamiento_loa', 0.2, 0.11, M.medio, 0.64, EJE_Y, 0, 40));  // lado opuesto
  cuerpo.add(caja('soporte_bastidor', 0.2, EJE_Y - YB, 0.34, M.oscuro, 0.45, (EJE_Y + YB) / 2, 0));
  cuerpo.add(cilX('tapa_carcasa', 0.3, 0.06, M.medio, 0.74, EJE_Y, 0, 48));
  cuerpo.add(cilX('voluta', 0.36, 0.26, M.marino, 0.9, EJE_Y, 0, 56));
  cuerpo.add(caja('pie_voluta', 0.26, 0.1, 0.4, M.oscuro, 0.9, YB + 0.05, 0));
  cuerpo.add(cilX('succion', 0.12, 0.24, M.medio, 1.14, EJE_Y, 0, 40));
  cuerpo.add(cilX('brida_succion', 0.17, 0.04, M.oscuro, 1.27, EJE_Y, 0, 40));
  cuerpo.add(cilY('descarga', 0.1, 0.34, M.medio, 0.9, EJE_Y + 0.38, -0.16, 40));
  cuerpo.add(cilY('brida_descarga', 0.15, 0.04, M.oscuro, 0.9, EJE_Y + 0.56, -0.16, 40));
  bomba.add(cuerpo);

  // Sensor inalámbrico: base hexagonal, cuerpo metálico, tapa cónica azul marino
  function crearSensor(nombre) {
    const g = new THREE.Group(); g.name = nombre;
    g.add(cilY('base_hex', 0.07, 0.035, M.oscuro, 0, 0.0175, 0, 6));
    g.add(cilY('cuerpo', 0.062, 0.15, M.claro, 0, 0.11, 0, 40));
    g.add(cilY('anillo', 0.066, 0.018, M.medio, 0, 0.16, 0, 40));
    const matTapa = M.marino.clone(); matTapa.name = 'tapa_' + nombre;
    const tapa = malla('tapa', new THREE.CylinderGeometry(0.018, 0.062, 0.1, 40), matTapa, 0, 0.219, 0);
    g.add(tapa);
    g.userData.tapa = matTapa;
    return g;
  }
  // Tres sensores sobre alojamientos de rodamiento
  const SENSORES_POS = [
    new THREE.Vector3(-0.2, EJE_Y + 0.3, 0),   // motor, lado acoplamiento
    new THREE.Vector3(0.26, EJE_Y + 0.2, 0),   // bomba, lado acoplamiento  ← el que cambia
    new THREE.Vector3(0.64, EJE_Y + 0.2, 0)    // bomba, lado opuesto
  ];
  const SENSOR_ALERTA = 1;
  const sensores = SENSORES_POS.map((p, i) => { const s = crearSensor('sensor_' + (i + 1)); s.position.copy(p); bomba.add(s); return s; });

  bomba.position.copy(suelo(176, 340));
  scene.add(bomba);

  /* =====================================================================
     ESTACIÓN BASE SOBRE POSTE
     ===================================================================== */
  const estacion = new THREE.Group(); estacion.name = 'estacion_base';
  estacion.add(cilY('placa_poste', 0.17, 0.04, M.oscuro, 0, 0.02, 0, 40));
  estacion.add(cilY('poste', 0.035, 1.26, M.medio, 0, 0.67, 0, 24));
  const caja_ = new THREE.Group(); caja_.name = 'gabinete'; caja_.position.set(0, 1.45, 0.02); caja_.rotation.y = YAW_CAMARA - 0.25;
  caja_.add(caja('abrazadera', 0.1, 0.14, 0.08, M.oscuro, 0, 0, -0.1));
  caja_.add(caja('caja', 0.46, 0.3, 0.16, M.claro, 0, 0, 0));
  caja_.add(caja('franja', 0.46, 0.05, 0.162, M.profundo, 0, -0.1, 0));
  const matLed = new THREE.MeshBasicMaterial({ color: COLOR.metalOscuro }); matLed.name = 'led';
  caja_.add(malla('led', new THREE.SphereGeometry(0.022, 20, 12), matLed, 0.16, 0.06, 0.082));
  caja_.add(cilY('antena', 0.014, 0.28, M.oscuro, 0.16, 0.29, 0, 16));
  caja_.add(malla('punta_antena', new THREE.SphereGeometry(0.026, 20, 12), M.marino, 0.16, 0.44, 0));
  estacion.add(caja_);
  estacion.position.copy(suelo(362, 392));
  scene.add(estacion);

  /* =====================================================================
     TELÉFONO (rectángulo redondeado en 3D)
     ===================================================================== */
  function rectRedondeado(w, h, r) {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  const telefono = new THREE.Group(); telefono.name = 'telefono';
  const TEL_W = 1.2, TEL_H = 1.9;
  const cuerpoGeo = new THREE.ExtrudeGeometry(rectRedondeado(TEL_W, TEL_H, 0.16), { depth: 0.07, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 14 });
  cuerpoGeo.center();
  const cuerpoTel = malla('cuerpo_telefono', cuerpoGeo, M.profundo);
  const matPantalla = new THREE.MeshBasicMaterial({ color: COLOR.pantallaApagada }); matPantalla.name = 'pantalla';
  const pantalla = malla('pantalla', new THREE.ShapeGeometry(rectRedondeado(TEL_W - 0.1, TEL_H - 0.12, 0.11), 12), matPantalla, 0, 0, 0.052);
  const altavoz = caja('altavoz', 0.18, 0.025, 0.004, M.profundo, 0, TEL_H / 2 - 0.1, 0.055);
  const movil = new THREE.Group(); movil.name = 'movil';
  movil.add(cuerpoTel, pantalla, altavoz);
  movil.position.set(0, TEL_H / 2 + 0.07, 0.02);
  movil.rotation.x = 0;                 // pantalla paralela al plano de la cámara, para que el aviso HTML coincida
  telefono.add(movil);
  telefono.add(caja('soporte', 0.8, 0.05, 0.42, M.claro, 0, 0.025, 0));
  telefono.add(caja('tope', 0.8, 0.07, 0.05, M.medio, 0, 0.085, 0.16));
  telefono.rotation.y = YAW_CAMARA;
  telefono.position.copy(suelo(622, 476));
  scene.add(telefono);

  /* =====================================================================
     ELEMENTOS ANIMADOS: pulsos, puntos viajeros y flujo
     ===================================================================== */
  const geoAnillo = new THREE.RingGeometry(0.9, 1, 56);
  const geoPunto = new THREE.SphereGeometry(0.042, 16, 10);
  const pulsos = sensores.map(() => { const m = new THREE.Mesh(geoAnillo, plano_(COLOR.marino, 0)); m.name = 'pulso'; scene.add(m); return m; });
  const viajeros = sensores.map(() => { const m = new THREE.Mesh(geoPunto, plano_(COLOR.profundo, 0)); m.name = 'lectura'; scene.add(m); return m; });
  const FLUJO_N = 7;
  const flujo = Array.from({ length: FLUJO_N }, () => { const m = new THREE.Mesh(geoPunto, plano_(COLOR.profundo, 0)); m.name = 'dato'; scene.add(m); return m; });

  scene.updateMatrixWorld(true);
  const puntaSensor = sensores.map(s => s.localToWorld(new THREE.Vector3(0, 0.29, 0)));
  const puntaAntena = caja_.localToWorld(new THREE.Vector3(0.16, 0.44, 0));
  const frenteCaja = caja_.localToWorld(new THREE.Vector3(0.2, 0, 0.1));

  /* Anclas 3D de los paneles HTML (proyectadas a pantalla en cada cuadro) */
  const ANCLA = {
    lectura: bomba.localToWorld(new THREE.Vector3(-1.2, 1.55, 0)),
    plataforma: plano(452, 128),
    analista: plano(452, 236),
    aviso: movil.localToWorld(new THREE.Vector3(0, 0.3, 0.06))
  };
  const arcos = puntaSensor.map(p => {
    const medio = p.clone().lerp(puntaAntena, 0.5); medio.y += 0.75;
    return new THREE.QuadraticBezierCurve3(p, medio, puntaAntena);
  });
  const arcoFlujo = (() => {
    const fin = ANCLA.plataforma.clone().add(EJE_DER.clone().multiplyScalar(0.12));
    const medio = frenteCaja.clone().lerp(fin, 0.5); medio.y += 0.25;
    return new THREE.QuadraticBezierCurve3(frenteCaja, medio, fin);
  })();

  /* =====================================================================
     TENDENCIA (30 días) — datos normalizados 0–1
     ===================================================================== */
  const DIAS = 30, BANDA = [0.24, 0.52];
  const datos = Array.from({ length: DIAS }, (_, i) => {
    const ruido = Math.sin(i * 2.3) * 0.045 + Math.sin(i * 5.1 + 1) * 0.03;
    const subida = i > 21 ? Math.pow((i - 21) / 8, 1.6) * 0.46 : 0;
    return 0.37 + ruido + subida;
  });
  const GX = i => 4 + i * (222 / (DIAS - 1));
  const GY = v => 90 - v * 82;
  $('banda').setAttribute('y', GY(BANDA[1]));
  $('banda').setAttribute('height', GY(BANDA[0]) - GY(BANDA[1]));
  $('bandaTxt').style.top = (GY(BANDA[0]) + 2) + 'px';

  function dibujarTendencia(n) { // n: días visibles (fraccional)
    const normal = [], cambio = [];
    let fuera = false, cx = -20, cy = -20;
    const entero = Math.floor(n);
    for (let i = 0; i < Math.min(entero, DIAS); i++) {
      const v = datos[i], p = [GX(i), GY(v)];
      if (i > 0 && datos[i - 1] <= BANDA[1] && v > BANDA[1]) { // punto de cruce exacto
        const k = (BANDA[1] - datos[i - 1]) / (v - datos[i - 1]);
        const cr = [GX(i - 1 + k), GY(BANDA[1])];
        normal.push(cr); cambio.push(cr);
      }
      (v > BANDA[1] ? cambio : normal).push(p);
    }
    // Tramo parcial hasta el día siguiente
    if (n > 0) {
      const i = Math.min(entero, DIAS - 1), f = n - entero;
      if (entero >= 1 && entero < DIAS) {
        const v = datos[i - 1] + (datos[i] - datos[i - 1]) * f;
        const p = [GX(i - 1 + f), GY(v)];
        (v > BANDA[1] ? cambio : normal).push(p);
        if (v > BANDA[1] && cambio.length === 1) { // aún no se agregó el cruce
          const k = (BANDA[1] - datos[i - 1]) / (datos[i] - datos[i - 1]);
          const cr = [GX(i - 1 + k), GY(BANDA[1])]; normal.push(cr); cambio.unshift(cr);
        }
        cx = p[0]; cy = p[1]; fuera = v > BANDA[1];
      } else {
        const j = Math.min(entero, DIAS) - 1; cx = GX(j); cy = GY(datos[j]); fuera = datos[j] > BANDA[1];
      }
    }
    $('lineaNormal').setAttribute('points', normal.map(p => p.join(',')).join(' '));
    $('lineaCambio').setAttribute('points', cambio.map(p => p.join(',')).join(' '));
    $('cabeza').setAttribute('cx', cx); $('cabeza').setAttribute('cy', cy);
    $('cabeza').setAttribute('fill', fuera ? '#fc9f01' : '#d9e2e8');
    $('cabeza').setAttribute('r', n > 0 ? 3.2 : 0);
    const c = $('cambioTxt'); c.style.left = cx + 'px'; c.style.top = cy + 'px';
    return fuera;
  }

  /* =====================================================================
     PROYECCIÓN DE PANELES
     ===================================================================== */
  const tmp = new THREE.Vector3();
  function aPantalla(v) { tmp.copy(v).project(camera); return [(tmp.x + 1) / 2 * W, (1 - tmp.y) / 2 * H]; }
  function colocar(el, v, ax, ay, op = 1, dy = 0) {
    const [x, y] = aPantalla(v);
    el.style.transform = `translate(${x.toFixed(1)}px, ${(y + dy).toFixed(1)}px) translate(${ax}%, ${ay}%)`;
    el.style.opacity = op.toFixed(3);
  }

  /* =====================================================================
     ACTUALIZACIÓN POR TIEMPO (t = transcurrido módulo CICLO)
     ===================================================================== */
  const naranja = new THREE.Color(COLOR.naranja), marino = new THREE.Color(COLOR.marino);
  const cApagada = new THREE.Color(COLOR.pantallaApagada), cEncendida = new THREE.Color(COLOR.pantallaEncendida);
  const ledOff = new THREE.Color(COLOR.metalOscuro);

  function actualizar(t, transcurrido) {
    eje.rotation.x = reducido ? 0.6 : transcurrido * VEL_EJE;

    // 0–3 s: pulso por segundo en cada sensor + lectura en arco hasta la estación
    let led = 0;
    const enLectura = t < T.lecturaFin;
    sensores.forEach((s, i) => {
      const f = t % 1, ring = pulsos[i], dot = viajeros[i];
      const fp = f - i * 0.08;
      if (enLectura && fp >= 0 && fp < 0.7) {
        const k = fp / 0.7;
        ring.visible = true; ring.position.copy(puntaSensor[i]); ring.quaternion.copy(camera.quaternion);
        ring.scale.setScalar(0.05 + k * 0.28); ring.material.opacity = (1 - k) * 0.85;
      } else ring.visible = false;
      const kd = (fp - 0.1) / 0.75;
      if (enLectura && kd >= 0 && kd <= 1) {
        dot.visible = true; arcos[i].getPoint(suelo_(kd), dot.position);
        dot.material.opacity = Math.min(1, kd * 6, (1 - kd) * 10);
      } else dot.visible = false;
      if (enLectura && kd > 0.9 && kd < 1.2) led = 1;
    });
    matLed.color.copy(ledOff).lerp(naranja, led);

    // 3–6 s: flujo de datos estación → plataforma
    const VIAJE = 0.7;
    flujo.forEach((m, j) => {
      const p = (((t - T.lecturaFin) / VIAJE + j / FLUJO_N) % 1 + 1) % 1;
      const emitido = t - p * VIAJE;
      if (t >= T.lecturaFin && emitido >= T.lecturaFin && emitido <= T.envioFin - VIAJE) {
        m.visible = true; arcoFlujo.getPoint(p, m.position); m.material.opacity = Math.min(1, p * 8, (1 - p) * 8);
      } else m.visible = false;
    });
    if (t >= T.lecturaFin && t < T.envioFin) matLed.color.copy(ledOff).lerp(naranja, (Math.sin(t * 18) > 0.3) ? 1 : 0);

    // Tendencia: días 1–22 en 3–6 s, días 22–30 en 6–8 s
    let n = 0;
    if (t >= T.lecturaFin) n = 1 + 21 * clamp((t - T.lecturaFin) / (T.envioFin - T.lecturaFin));
    if (t >= T.envioFin) n = 22 + 8 * clamp((t - T.envioFin) / (T.cambioFin - T.envioFin - 0.4));
    const fuera = dibujarTendencia(n);
    const alerta = fuera && t >= T.envioFin;

    // Sensor en alerta y píldora de estado
    sensores[SENSOR_ALERTA].userData.tapa.color.copy(alerta ? naranja : marino);
    const pill = $('pPill');
    const txt = alerta ? TEXTO.estadoAlerta : TEXTO.estadoNormal;
    if (pill.textContent !== txt) pill.textContent = txt;
    pill.classList.toggle('on', alerta);
    $('cambioTxt').style.opacity = alerta ? 1 : 0;
    if (alerta) { // pulso naranja lento sobre el sensor en alerta
      const r = pulsos[SENSOR_ALERTA], k = ((t - T.envioFin) % 1.4) / 1.4;
      r.visible = true; r.position.copy(puntaSensor[SENSOR_ALERTA]); r.quaternion.copy(camera.quaternion);
      r.scale.setScalar(0.06 + k * 0.24); r.material.color.set(COLOR.naranja); r.material.opacity = (1 - k) * 0.8;
    } else pulsos[SENSOR_ALERTA].material.color.set(COLOR.marino);

    // 8–10 s: analista
    const a = suave(T.cambioFin, T.cambioFin + 0.4, t);
    $('palomita').setAttribute('stroke-dashoffset', (12 * (1 - suave(T.cambioFin + 0.5, T.cambioFin + 0.9, t))).toFixed(2));

    // 10–12 s: teléfono
    const on = suave(T.analistaFin, T.analistaFin + 0.35, t);
    matPantalla.color.copy(cApagada).lerp(cEncendida, on);
    const nt = suave(T.analistaFin + 0.2, T.analistaFin + 0.6, t);

    // Paneles proyectados
    colocar($('rotuloLectura'), ANCLA.lectura, 0, -50, suave(0, 0.3, t) * (1 - suave(T.lecturaFin - 0.2, T.lecturaFin + 0.2, t)));
    colocar($('plataforma'), ANCLA.plataforma, 0, -50, 1);
    colocar($('analista'), ANCLA.analista, 0, 0, a, (1 - a) * 6);
    colocar($('aviso'), ANCLA.aviso, -50, -50, nt, (1 - nt) * 8);

    // Fundido corto y reinicio
    const fo = suave(T.fundidoIni, CICLO, t) + (1 - suave(0, 0.35, t));
    $('fundido').style.opacity = reducido ? 0 : clamp(fo).toFixed(3);
  }
  const suelo_ = k => k; // avance lineal por el arco (nombre corto para legibilidad)

  /* =====================================================================
     INCLINACIÓN CON EL CURSOR (≤ 2°) Y ESCALADO DEL CUADRO
     ===================================================================== */
  const inclina = { x: 0, y: 0, tx: 0, ty: 0 };
  const alMover = e => {
    const r = cuadro.getBoundingClientRect();
    inclina.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    inclina.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const alSalir = () => { inclina.tx = 0; inclina.ty = 0; };
  if (!reducido) {
    cuadro.addEventListener('pointermove', alMover);
    cuadro.addEventListener('pointerleave', alSalir);
  }
  const esf = new THREE.Spherical().setFromVector3(CAM_BASE);
  function aplicarCamara() {
    inclina.x += (inclina.tx - inclina.x) * 0.06;
    inclina.y += (inclina.ty - inclina.y) * 0.06;
    const g = THREE.MathUtils.degToRad(INCLINACION_MAX);
    const s = esf.clone(); s.theta += inclina.x * g; s.phi += inclina.y * g;
    camera.position.setFromSpherical(s); camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
  }
  // El cuadro puede ser más grande que el diseño de 720 × 540: se sube la
  // densidad del canvas con la escala para que no se vea borroso.
  function escalar() {
    const k = cuadro.clientWidth / W;
    escenario.style.transform = `scale(${k})`;
    renderer.setPixelRatio(Math.min(3, Math.max(1, (devicePixelRatio || 1) * k)));
    renderer.setSize(W, H);
  }
  const observadorTam = new ResizeObserver(escalar);
  observadorTam.observe(cuadro); escalar();

  /* =====================================================================
     BUCLE — un solo reloj
     ===================================================================== */
  let visible = true;
  const observadorVis = new IntersectionObserver(e => { visible = e[0].isIntersecting; });
  observadorVis.observe(cuadro);
  const t0 = performance.now();
  let raf = 0;
  function cuadroAnim(ahora) {
    raf = requestAnimationFrame(cuadroAnim);
    if (!visible) return;
    const transcurrido = (ahora - t0) / 1000;
    aplicarCamara();
    actualizar(transcurrido % CICLO, transcurrido);
    renderer.render(scene, camera);
  }
  if (reducido) { // cuadro final estático con la notificación visible
    const pintar = () => { aplicarCamara(); actualizar(T.final, 0); renderer.render(scene, camera); };
    pintar();
  } else raf = requestAnimationFrame(cuadroAnim);

  return () => {
    cancelAnimationFrame(raf);
    observadorTam.disconnect();
    observadorVis.disconnect();
    cuadro.removeEventListener('pointermove', alMover);
    cuadro.removeEventListener('pointerleave', alSalir);
    scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      mats.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
    });
    renderer.dispose();
    cuadro.replaceChildren();
  };
}
