/**
 * Escena "Sensores de huella acústica": el transformador crítico, el sensor
 * con base magnética en el tanque escuchando las 24 horas, la huella
 * aprendida en el espectro, el patrón de descarga parcial en la boquilla de
 * la fase C, el módulo de algoritmos e IA, el sello del especialista y la
 * alerta en el teléfono.
 *
 * Generada en Claude Diseño (docs/designs/huella-acustica-escena.html) y
 * portada como las de sensores y cámaras térmicas: recibe THREE y el
 * contenedor y devuelve la limpieza. Escrita para r128 y compatible con
 * versiones nuevas (ajusta la intensidad de las luces según la revisión).
 * Ajuste propio: en pantallas angostas los rótulos crecen para seguir
 * legibles, y la densidad de píxeles sigue a la escala.
 */
/* eslint-disable */
export function montarHuellaAcustica(THREE, contenedor) {
  const W = 720, H = 540, CICLO = 16, T_FIJO = 11.8;
  const LUZ = parseInt(THREE.REVISION, 10) >= 155 ? Math.PI : 1; // intensidades escritas como r128
  const uid = 'ha' + Math.random().toString(36).slice(2, 7);
  const clamp = v => Math.max(0, Math.min(1, v));
  const suave = v => { v = clamp(v); return v * v * (3 - 2 * v); };
  const rampa = (t, a, d) => suave((t - a) / d);
  const ventana = (t, a, b, f = 0.4) => Math.min(rampa(t, a, f), 1 - rampa(t, b - f, f));
  const rebote = v => { v = clamp(v); const c = 1.70158; return 1 + (c + 1) * Math.pow(v - 1, 3) + c * Math.pow(v - 1, 2); };
  const frac = v => ((v % 1) + 1) % 1;
  let kR = 1;

  // ---------- Escenario HTML ----------
  if (getComputedStyle(contenedor).position === 'static') contenedor.style.position = 'relative';
  const crear = (tag, css, padre, html) => { const e = document.createElement(tag); if (css) e.style.cssText = css; if (html) e.innerHTML = html; if (padre) padre.appendChild(e); return e; };
  const stage = crear('div', `position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;overflow:hidden;background:linear-gradient(180deg,#fbfcfd 0%,#eef1f4 100%);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#002e46;-webkit-font-smoothing:antialiased;`, contenedor);
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', 'Un sensor de huella acústica fijado al tanque escucha un transformador de potencia; los algoritmos detectan una descarga parcial en la fase C, un especialista la confirma y la alerta llega al teléfono.');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px`;
  stage.appendChild(renderer.domElement);
  const capa = crear('div', 'position:absolute;inset:0;pointer-events:none', stage);

  // ---------- Escena 3D ----------
  const escena = new THREE.Scene();
  const fr = 5.4;
  const camara = new THREE.OrthographicCamera(-fr * W / H, fr * W / H, fr, -fr, 0.1, 100);
  const objetivo = new THREE.Vector3(0, 1.0, -0.4);
  camara.position.copy(objetivo).add(new THREE.Vector3(12, 12, 12));
  camara.lookAt(objetivo);
  camara.updateMatrixWorld();

  escena.add(new THREE.HemisphereLight(0xffffff, 0xd9e2e8, 0.62 * LUZ));
  const sol = new THREE.DirectionalLight(0xffffff, 0.72 * LUZ);
  sol.position.set(4, 11, 5);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  sol.shadow.bias = -0.0005;
  sol.shadow.normalBias = 0.02;
  sol.shadow.radius = 4;
  escena.add(sol);
  const relleno = new THREE.DirectionalLight(0xffffff, 0.18 * LUZ);
  relleno.position.set(-6, 4, 8);
  escena.add(relleno);

  const mat = (nombre, color, r, m, extra) => { const x = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: r, metalness: m }, extra || {})); x.name = nombre; return x; };
  const M = {
    navy: mat('azul_marino', 0x002e46, 0.55, 0.25),
    mid: mat('azul_medio', 0x2b5671, 0.5, 0.3),
    gris: mat('gris_claro', 0xd9e2e8, 0.85, 0),
    porcelana: mat('porcelana', 0xeef1f4, 0.3, 0),
    base: mat('hormigon', 0xc6d1d9, 0.95, 0),
    naranja: mat('naranja_diapsa', 0xfc9f01, 0.4, 0.1, { emissive: 0xfc9f01, emissiveIntensity: 0 }),
  };
  M.porcelanaC = mat('porcelana_fase_c', 0xeef1f4, 0.3, 0, { emissive: 0xfc9f01, emissiveIntensity: 0 });

  const malla = (geo, material, nombre, padre, x = 0, y = 0, z = 0, sombra = true) => {
    const m = new THREE.Mesh(geo, material); m.name = nombre; m.position.set(x, y, z);
    m.castShadow = sombra; m.receiveShadow = sombra; padre.add(m); return m;
  };
  const caja = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const cilY = (r, l, s = 32) => new THREE.CylinderGeometry(r, r, l, s);
  const cilX = (r, l, s = 32) => new THREE.CylinderGeometry(r, r, l, s).rotateZ(Math.PI / 2);
  const cilZ = (r, l, s = 32) => new THREE.CylinderGeometry(r, r, l, s).rotateX(Math.PI / 2);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  const planta = new THREE.Group(); planta.name = 'subestacion'; escena.add(planta);
  const piso = malla(caja(8.0, 0.2, 6.2), M.gris, 'plataforma', planta, 0.2, -0.101, -0.3, false); piso.receiveShadow = true;

  // Transformador de potencia
  const trafo = new THREE.Group(); trafo.name = 'transformador'; trafo.position.set(-0.9, 0, 0.4); planta.add(trafo);
  malla(caja(3.2, 0.16, 2.3), M.base, 'trafo_base', trafo, 0, 0.08, 0);
  malla(caja(2.6, 1.8, 1.5), M.navy, 'trafo_tanque', trafo, 0, 1.06, 0);
  malla(caja(2.7, 0.07, 1.6), M.mid, 'trafo_tapa', trafo, 0, 1.995, 0);
  for (let i = 0; i < 8; i++) malla(caja(0.05, 1.3, 0.45), M.mid, 'radiador_' + i, trafo, -1.05 + i * 0.3, 1.15, 1.0);
  malla(cilX(0.05, 2.3, 16), M.mid, 'radiador_colector_sup', trafo, 0, 1.72, 0.82);
  malla(cilX(0.05, 2.3, 16), M.mid, 'radiador_colector_inf', trafo, 0, 0.58, 0.82);
  const aspas = [];
  [-0.6, 0.6].forEach((x, i) => {
    malla(cilZ(0.25, 0.08, 40), M.mid, 'ventilador_aro_' + i, trafo, x, 0.84, 1.27);
    malla(cilZ(0.2, 0.01, 40), M.navy, 'ventilador_fondo_' + i, trafo, x, 0.84, 1.25, false);
    const rotor = new THREE.Group(); rotor.name = 'ventilador_rotor_' + i; rotor.position.set(x, 0.84, 1.3); trafo.add(rotor);
    malla(cilZ(0.05, 0.05, 20), M.navy, 'ventilador_cubo_' + i, rotor);
    for (let k = 0; k < 3; k++) { const a = malla(caja(0.07, 0.18, 0.012), M.navy, `ventilador_aspa_${i}_${k}`, rotor, 0, 0, 0, false); a.geometry.translate(0, 0.1, 0); a.rotation.z = k * Math.PI * 2 / 3; }
    aspas.push(rotor);
  });
  [-0.75, 0, 0.75].forEach((x, i) => {
    const f = 'ABC'[i], pm = i === 2 ? M.porcelanaC : M.porcelana;
    malla(cilY(0.14, 0.14), M.mid, 'boquilla_base_' + f, trafo, x, 2.1, 0.15);
    malla(cilY(0.06, 0.85), pm, 'boquilla_nucleo_' + f, trafo, x, 2.6, 0.15);
    for (let k = 0; k < 8; k++) malla(cilY(0.14, 0.035), pm, `boquilla_campana_${f}_${k}`, trafo, x, 2.25 + k * 0.1, 0.15);
    malla(cilY(0.075, 0.09), M.mid, 'boquilla_terminal_' + f, trafo, x, 3.07, 0.15);
  });
  malla(cilX(0.24, 1.7), M.mid, 'conservador', trafo, 0, 2.45, -0.5);
  [-0.6, 0.6].forEach((x, i) => malla(caja(0.07, 0.42, 0.07), M.mid, 'conservador_soporte_' + i, trafo, x, 2.2, -0.5));

  // Sensor con base magnética (en la pared +x del tanque)
  const sensor = new THREE.Group(); sensor.name = 'sensor_huella_acustica'; trafo.add(sensor);
  const SENSOR_POS = V(1.3, 1.1, -0.2);
  malla(caja(0.03, 0.28, 0.28), M.mid, 'sensor_base_magnetica', sensor, 0.016, 0, 0);
  malla(caja(0.13, 0.22, 0.22), M.naranja, 'sensor_cuerpo', sensor, 0.097, 0, 0);
  malla(caja(0.01, 0.12, 0.12), M.navy, 'sensor_placa', sensor, 0.168, 0.02, 0, false);
  malla(cilY(0.028, 0.08, 16), M.navy, 'sensor_prensaestopa', sensor, 0.097, -0.15, 0);
  sensor.position.copy(SENSOR_POS);

  // Celda / subestación encapsulada (equipo secundario)
  const gis = new THREE.Group(); gis.name = 'subestacion_encapsulada'; gis.position.set(2.5, 0, -1.9); planta.add(gis);
  malla(caja(2.6, 0.1, 1.3), M.base, 'celda_base', gis, 0, 0.05, 0);
  [-0.85, 0, 0.85].forEach((x, i) => {
    malla(caja(0.78, 1.55, 1.0), M.gris, 'celda_' + i, gis, x, 0.875, 0);
    malla(caja(0.6, 1.2, 0.012), M.gris, 'celda_puerta_' + i, gis, x, 0.85, 0.506);
    malla(caja(0.2, 0.12, 0.014), M.mid, 'celda_mirilla_' + i, gis, x - 0.1, 1.25, 0.514, false);
    malla(caja(0.04, 0.16, 0.02), M.mid, 'celda_manija_' + i, gis, x + 0.22, 0.85, 0.516, false);
    malla(cilY(0.16, 0.35), M.gris, 'celda_domo_' + i, gis, x, 1.83, -0.15);
  });
  malla(cilX(0.12, 2.5), M.gris, 'celda_barra', gis, 0, 2.02, -0.15);
  malla(caja(2.62, 0.05, 1.02), M.mid, 'celda_remate', gis, 0, 1.675, 0);

  // Ondas: normales (azul medio) desde el tanque; falla (naranja) desde la boquilla C
  planta.updateMatrixWorld(true);
  const efectos = new THREE.Group(); efectos.name = 'efectos'; escena.add(efectos);
  const centroTanque = trafo.localToWorld(V(0, 1.1, 0));
  const boquillaC = trafo.localToWorld(V(0.75, 2.75, 0.15));
  const aroGeo = new THREE.RingGeometry(0.95, 1, 80);
  const aroMat = color => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const arosNormales = [0, 1, 2].map(k => { const m = new THREE.Mesh(aroGeo, aroMat(0x2b5671)); m.position.copy(centroTanque); m.quaternion.copy(camara.quaternion); m.renderOrder = 4; m.userData.k = k; efectos.add(m); return m; });
  const arosFalla = [0, 1, 2, 3].map(k => { const m = new THREE.Mesh(aroGeo, aroMat(0xfc9f01)); m.position.copy(boquillaC); m.quaternion.copy(camara.quaternion); m.renderOrder = 6; m.userData.k = k; efectos.add(m); return m; });

  // Módulo Algoritmos e IA
  const chip = new THREE.Group(); chip.name = 'modulo_ia'; const chipBase = V(0.4, 5.1, -1.98); chip.position.copy(chipBase); escena.add(chip);
  malla(caja(0.9, 0.14, 0.9), M.naranja, 'chip_cuerpo', chip, 0, 0, 0, false);
  malla(caja(0.5, 0.02, 0.5), M.navy, 'chip_nucleo', chip, 0, 0.08, 0, false);
  for (let k = 0; k < 5; k++) {
    const o = -0.3 + k * 0.15;
    malla(caja(0.06, 0.03, 0.14), M.mid, 'chip_pin_n' + k, chip, o, 0, -0.51, false);
    malla(caja(0.06, 0.03, 0.14), M.mid, 'chip_pin_s' + k, chip, o, 0, 0.51, false);
    malla(caja(0.14, 0.03, 0.06), M.mid, 'chip_pin_e' + k, chip, 0.51, 0, o, false);
    malla(caja(0.14, 0.03, 0.06), M.mid, 'chip_pin_o' + k, chip, -0.51, 0, o, false);
  }

  // ---------- Capa de rótulos ----------
  const vt = new THREE.Vector3();
  const aPantalla = v => { vt.copy(v).project(camara); return { x: (vt.x + 1) * W / 2, y: (1 - vt.y) * H / 2 }; };
  const todosCentros = [];
  const rotulo = html => {
    const raiz = crear('div', 'position:absolute;left:0;top:0;opacity:0;visibility:hidden;will-change:transform,opacity', capa);
    const centro = crear('div', 'position:absolute;left:0;top:0;transform:translate(-50%,-100%);transform-origin:50% 100%', raiz);
    todosCentros.push(centro);
    const anim = crear('div', 'transform-origin:50% 100%;display:flex;flex-direction:column;align-items:center', centro, html);
    return { raiz, anim };
  };
  const colocar = (r, p, a) => {
    r.raiz.style.visibility = a > 0.002 ? 'visible' : 'hidden';
    r.raiz.style.opacity = a.toFixed(3);
    r.raiz.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
    r.anim.style.transform = `translateY(${((1 - a) * 6).toFixed(2)}px)`;
  };
  const punto = c => `<span style="width:7px;height:7px;border-radius:50%;background:${c};flex:none"></span>`;
  const tallo = c => `<div style="width:1px;height:12px;background:${c};opacity:.55"></div>`;
  const pillOscura = txt => `<div style="display:flex;align-items:center;gap:6px;background:#002e46;color:#fff;font-size:12px;font-weight:600;padding:5px 11px 5px 9px;border-radius:999px;white-space:nowrap;box-shadow:0 3px 10px rgba(0,46,70,.18)">${punto('#fc9f01')}${txt}</div>${tallo('#002e46')}`;
  const pillClara = txt => `<div style="display:flex;align-items:center;gap:6px;background:#fff;color:#002e46;font-size:12px;font-weight:600;padding:5px 11px 5px 9px;border-radius:999px;white-space:nowrap;border:1px solid #d9e2e8;box-shadow:0 3px 10px rgba(0,46,70,.10)">${punto('#fc9f01')}${txt}</div>${tallo('#2b5671')}`;
  const pillNaranja = txt => `<div style="background:#fc9f01;color:#002e46;font-size:12px;font-weight:700;padding:5px 11px;border-radius:999px;white-space:nowrap;box-shadow:0 3px 10px rgba(0,46,70,.15)">${txt}</div>${tallo('#fc9f01')}`;

  crear('div', 'position:absolute;inset:0', capa, `
    <svg width="${W}" height="${H}" style="position:absolute;left:0;top:0;overflow:visible">
      <line data-k="guia" stroke="#2b5671" stroke-width="1" stroke-dasharray="3 3" opacity="0"></line>
      <path data-k="lineaIA" fill="none" stroke="#fc9f01" stroke-width="1.75" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"></path>
      <path data-k="lineaPatron" fill="none" stroke="#fc9f01" stroke-width="1.75" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"></path>
      <circle data-k="nodoA" r="3.5" fill="#fc9f01" opacity="0"></circle>
    </svg>`);
  const q = k => capa.querySelector(`[data-k="${k}"]`);

  const rotCritico = rotulo(pillOscura('Equipo crítico'));
  const anclaCritico = aPantalla(trafo.localToWorld(V(0, 3.3, 0)));
  const rotSensor = rotulo(pillClara('Sensor de huella acústica'));
  const anclaSensor = aPantalla(trafo.localToWorld(SENSOR_POS.clone().add(V(0.1, 0.22, 0))));
  const rotFase = rotulo(pillNaranja('Boquilla fase C'));
  const anclaFase = aPantalla(trafo.localToWorld(V(0.75, 3.2, 0.15)));
  const rotIA = rotulo(pillOscura('Algoritmos e IA'));
  const titulo = crear('div', 'transform-origin:0 0;position:absolute;left:28px;top:24px;font-size:22px;font-weight:650;letter-spacing:-0.01em;opacity:0', capa, 'Escucha las 24 horas');

  // Panel de espectro
  const NB = 34, BW = 4, PASO = 212 / NB, BASE_Y = 66;
  const envolvente = i => 30 - 14 * Math.exp(-Math.pow((i - 8) / 5, 2)) - 8 * Math.exp(-Math.pow((i - 17) / 4, 2)) + i * 0.25; // y superior de la banda
  const nivel = i => BASE_Y - (BASE_Y - envolvente(i)) * 0.72;
  const picos = { 21: 1, 22: 0.7, 25: 1, 26: 0.8, 29: 0.9, 30: 0.6 };
  let bandaD = `M0 ${BASE_Y}`;
  for (let i = 0; i <= NB; i++) bandaD += `L${(i * PASO).toFixed(1)} ${envolvente(Math.min(i, NB - 1)).toFixed(1)}`;
  bandaD += `L212 ${BASE_Y}Z`;
  let bordeD = '';
  for (let i = 0; i <= NB; i++) bordeD += `${i ? 'L' : 'M'}${(i * PASO).toFixed(1)} ${envolvente(Math.min(i, NB - 1)).toFixed(1)}`;
  let barrasSVG = '';
  for (let i = 0; i < NB; i++) barrasSVG += `<rect data-b="${i}" x="${(i * PASO + (PASO - BW) / 2).toFixed(1)}" y="${BASE_Y}" width="${BW}" height="0" rx="1" fill="#002e46"></rect>`;
  const panel = crear('div', 'transform-origin:0 0;position:absolute;left:24px;top:24px;width:212px;padding:10px 12px 8px;background:rgba(255,255,255,.94);border:1px solid #d9e2e8;border-radius:10px;box-shadow:0 8px 22px rgba(0,46,70,.08);opacity:0', capa, `
    <div style="font-size:11px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:#2b5671;margin-bottom:6px">Transformador</div>
    <svg width="212" height="72" viewBox="0 0 212 72" style="display:block;overflow:visible">
      <path d="${bandaD}" fill="rgba(43,86,113,.12)"></path>
      <path d="${bordeD}" fill="none" stroke="#2b5671" stroke-width="1" stroke-dasharray="3 3"></path>
      <text x="2" y="11" font-size="11" font-weight="600" fill="#2b5671" font-family="system-ui,-apple-system,Segoe UI,sans-serif">Huella aprendida</text>
      <rect data-k="zona" x="${(21 * PASO - 2).toFixed(1)}" y="0" width="${(10 * PASO + 4).toFixed(1)}" height="${BASE_Y + 2}" rx="4" fill="rgba(252,159,1,.14)" opacity="0"></rect>
      <g>${barrasSVG}</g>
      <line x1="0" x2="212" y1="${BASE_Y + 0.5}" y2="${BASE_Y + 0.5}" stroke="#2b5671" stroke-width="1"></line>
    </svg>`);
  const barras = Array.from(panel.querySelectorAll('[data-b]'));
  const PANEL_SALIDA = { x: 24 + 12 + 212 + 13, y: 24 + 10 + 17 + 30 };
  const PANEL_BASE = { x: 96, y: 136 };

  const patron = crear('div', 'transform-origin:0 0;position:absolute;left:0;top:0;opacity:0;white-space:nowrap;background:#fff;border:1.5px solid #fc9f01;color:#002e46;font-size:13px;font-weight:650;padding:6px 12px;border-radius:8px;box-shadow:0 4px 12px rgba(0,46,70,.10)', capa, 'Patrón: descarga parcial');
  const sello = crear('div', 'position:absolute;left:0;top:0;opacity:0;display:flex;align-items:center;gap:7px;white-space:nowrap;background:#fff;border:2px solid #fc9f01;color:#002e46;font-size:12px;font-weight:700;letter-spacing:.02em;padding:5px 11px 5px 6px;border-radius:999px;transform-origin:20% 50%;box-shadow:0 4px 12px rgba(0,46,70,.10)', capa,
    `<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="#fc9f01"></circle><path d="M5 9.4l2.6 2.5L13 6.6" fill="none" stroke="#002e46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Revisado por especialista`);

  const telefono = crear('div', 'transform-origin:100% 50%;position:absolute;left:566px;top:132px;width:132px;height:252px;opacity:0;box-sizing:border-box;padding:7px;border-radius:24px;background:#002e46;box-shadow:0 18px 36px rgba(0,46,70,.22)', capa, `
    <div style="position:relative;width:100%;height:100%;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#fbfcfd,#eef1f4)">
      <div style="width:36px;height:5px;border-radius:3px;background:#002e46;margin:7px auto 0"></div>
      <div data-k="notif" style="position:absolute;left:6px;right:6px;top:30px;background:#fff;border-radius:10px;padding:8px 9px;box-shadow:0 4px 12px rgba(0,46,70,.14);opacity:0">
        <div style="display:flex;align-items:center;gap:5px;font-size:12px;font-weight:750;color:#002e46">
          <svg width="14" height="13" viewBox="0 0 14 13"><path d="M7 1L13 12H1Z" fill="#fc9f01" stroke="#fc9f01" stroke-width="1.5" stroke-linejoin="round"></path><rect x="6.3" y="4.5" width="1.4" height="4" rx=".7" fill="#002e46"></rect><circle cx="7" cy="10.1" r=".8" fill="#002e46"></circle></svg>Precaución
        </div>
        <div style="font-size:11px;line-height:1.35;color:#002e46;margin-top:4px">Transformador ·<br>Descarga parcial fase C</div>
      </div>
    </div>`);
  const notif = q('notif'), guia = q('guia'), lineaIA = q('lineaIA'), lineaPatron = q('lineaPatron'), nodoA = q('nodoA'), zona = q('zona');
  const pSensor = aPantalla(trafo.localToWorld(SENSOR_POS.clone().add(V(0.17, 0, 0))));
  guia.setAttribute('x1', PANEL_BASE.x); guia.setAttribute('y1', PANEL_BASE.y);
  guia.setAttribute('x2', pSensor.x); guia.setAttribute('y2', pSensor.y);
  nodoA.setAttribute('cx', PANEL_SALIDA.x); nodoA.setAttribute('cy', PANEL_SALIDA.y);

  // ---------- Tiempo ----------
  function actualizar(t) {
    // 1 · Equipo crítico
    colocar(rotCritico, anclaCritico, ventana(t, 0.4, 3.4));
    // 2 · Sensor y escucha
    const llega = clamp((t - 3.2) / 0.7), sale = rampa(t, 15.0, 0.6);
    const vis = Math.max(0.0001, suave(llega * 2.2) * (1 - sale));
    sensor.scale.setScalar(vis);
    sensor.position.x = SENSOR_POS.x + 0.55 * (1 - rebote(llega)) + 0.55 * sale;
    colocar(rotSensor, anclaSensor, ventana(t, 3.9, 6.4));
    const tt = ventana(t, 3.8, 6.6);
    titulo.style.opacity = tt; titulo.style.transform = `translateY(${(1 - tt) * 6}px) scale(${Math.min(kR, 1.4)})`;
    const oidos = ventana(t, 4.0, 15.3, 0.8);
    arosNormales.forEach(m => {
      const p = frac(t * 0.42 + m.userData.k / 3);
      m.scale.setScalar(1.25 + p * 1.6);
      m.material.opacity = oidos * 0.38 * Math.pow(1 - p, 1.4) * clamp(p / 0.12);
    });
    M.naranja.emissiveIntensity = oidos * 0.12;
    aspas.forEach((r, i) => { r.rotation.z = t * 1.6 + i; });
    // 3 · Huella y patrón nuevo
    const pa = ventana(t, 6.6, 12.7);
    panel.style.opacity = pa; panel.style.transform = `translateY(${(1 - pa) * 8}px) scale(${Math.min(kR, 1.35)})`;
    guia.setAttribute('opacity', (pa * 0.7).toFixed(3));
    const crece = rampa(t, 6.8, 0.9), anom = rampa(t, 8.2, 0.9);
    barras.forEach((b, i) => {
      const vib = 1 + 0.06 * Math.sin(t * 5 + i * 1.7);
      let y = BASE_Y - (BASE_Y - nivel(i)) * crece * vib;
      const pk = picos[i];
      if (pk) y -= anom * pk * (BASE_Y - envolvente(i) + 4 - (BASE_Y - nivel(i))) * (1.25 + 0.08 * Math.sin(t * 9 + i));
      y = Math.max(y, 2);
      b.setAttribute('y', y.toFixed(1)); b.setAttribute('height', (BASE_Y - y).toFixed(1));
      b.setAttribute('fill', pk && anom > 0.35 ? '#fc9f01' : '#002e46');
    });
    zona.setAttribute('opacity', anom.toFixed(3));
    const falla = ventana(t, 8.4, 15.2, 0.6);
    arosFalla.forEach(m => {
      const k = m.userData.k;
      const p = frac(t * 0.95 + k / 4 + 0.12 * Math.sin(t * 3.7 + k * 1.9));
      const s = 0.25 + p * 1.15, w = 0.1 * Math.sin(t * 6.1 + k * 2.3);
      m.scale.set(s * (1 + w), s * (1 - w), 1);
      m.rotation.z = k * 0.9;
      m.material.opacity = falla * 0.7 * Math.pow(1 - p, 1.2) * clamp(p / 0.1) * (0.55 + 0.45 * Math.abs(Math.sin(t * 5.3 + k * 2)));
      m.quaternion.copy(camara.quaternion); m.rotateZ(k * 0.9);
    });
    M.porcelanaC.emissiveIntensity = falla * (0.22 + 0.14 * Math.sin(t * 7));
    colocar(rotFase, anclaFase, ventana(t, 8.7, 12.6));
    // 4 · Algoritmos e IA
    chip.scale.setScalar(Math.max(0.0001, rebote((t - 9.4) / 0.6) * (1 - rampa(t, 12.4, 0.5))));
    chip.rotation.y = t * 0.5;
    chip.position.y = chipBase.y + Math.sin(t * 2) * 0.05;
    const cp = aPantalla(chip.position);
    colocar(rotIA, { x: cp.x, y: cp.y - 20 }, ventana(t, 9.7, 12.8));
    const li = rampa(t, 9.9, 0.6), lv = ventana(t, 9.9, 12.8);
    lineaIA.setAttribute('d', `M${PANEL_SALIDA.x} ${PANEL_SALIDA.y} C${PANEL_SALIDA.x + 60} ${PANEL_SALIDA.y} ${cp.x - 80} ${cp.y + 6} ${cp.x - 30} ${cp.y + 6}`);
    lineaIA.setAttribute('stroke-dashoffset', (1 - li).toFixed(3)); lineaIA.setAttribute('opacity', lv.toFixed(3));
    nodoA.setAttribute('opacity', (lv * suave(li * 4)).toFixed(3));
    const lp = rampa(t, 10.5, 0.4);
    const px = cp.x + 44, py = cp.y + 22;
    lineaPatron.setAttribute('d', `M${cp.x + 30} ${cp.y + 6} L${px} ${py + 15}`);
    lineaPatron.setAttribute('stroke-dashoffset', (1 - lp).toFixed(3)); lineaPatron.setAttribute('opacity', lv.toFixed(3));
    const pp = ventana(t, 10.7, 12.8);
    patron.style.opacity = pp; patron.style.transform = `translate(${px}px,${py + (1 - pp) * 6}px) scale(${kR})`;
    const se = ventana(t, 11.3, 12.8, 0.3);
    sello.style.opacity = se;
    sello.style.transform = `translate(${px}px,${py + 42 * kR}px) rotate(-3deg) scale(${(1 + 0.35 * (1 - rampa(t, 11.3, 0.3))) * kR})`;
    // 5 · Alerta
    const tel = ventana(t, 12.7, 15.4, 0.5);
    telefono.style.opacity = tel; telefono.style.transform = `translateY(${(1 - tel) * 24}px) scale(${Math.min(kR, 1.45)})`;
    const no = ventana(t, 13.2, 15.4, 0.4);
    notif.style.opacity = no; notif.style.transform = `translateY(${-(1 - no) * 10}px)`;
  }

  // ---------- Bucle, escala y reducir movimiento ----------
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  const t0 = performance.now();
  function cuadro(ahora) {
    const t = reducir.matches ? T_FIJO : (((ahora || performance.now()) - t0) / 1000) % CICLO;
    actualizar(t);
    renderer.render(escena, camara);
    raf = reducir.matches ? 0 : requestAnimationFrame(cuadro);
  }
  function ajustar() {
    const cw = contenedor.clientWidth || W, ch = contenedor.clientHeight || H;
    const s = Math.min(cw / W, ch / H);
    stage.style.transform = `translate(${(cw - W * s) / 2}px,${(ch - H * s) / 2}px) scale(${s})`;
    renderer.setPixelRatio(Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * s)));
    // En teléfono la escena se reduce a menos de la mitad: los rótulos se
    // agrandan en proporción inversa, con tope, para seguir legibles.
    kR = s < 0.75 ? Math.min(2, 0.8 / s) : 1;
    todosCentros.forEach(c => { c.style.transform = `translate(-50%,-100%) scale(${Math.min(kR, 1.5)})`; });
    renderer.setSize(W, H, false);
    if (!raf) cuadro();
  }
  const alCambiar = () => { cancelAnimationFrame(raf); raf = 0; cuadro(); };
  if (reducir.addEventListener) reducir.addEventListener('change', alCambiar); else reducir.addListener(alCambiar);
  const ro = new ResizeObserver(ajustar); ro.observe(contenedor);
  ajustar();

  return function limpiar() {
    cancelAnimationFrame(raf); raf = 0;
    ro.disconnect();
    if (reducir.removeEventListener) reducir.removeEventListener('change', alCambiar); else reducir.removeListener(alCambiar);
    const vistos = new Set();
    escena.traverse(o => {
      if (o.geometry && !vistos.has(o.geometry)) { vistos.add(o.geometry); o.geometry.dispose(); }
      if (o.material && !vistos.has(o.material)) { vistos.add(o.material); o.material.dispose(); }
    });
    renderer.dispose();
    stage.remove();
  };
}
