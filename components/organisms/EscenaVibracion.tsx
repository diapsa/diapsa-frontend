"use client";

import { useEffect, useRef } from "react";

/**
 * EscenaVibracion
 * Motor eléctrico en 3D con un sensor montado sobre el rodamiento: el eje
 * gira, el rodamiento emite pulsos, el sensor los capta y en un panel
 * flotante se dibuja el espectro (o se enciende el semáforo) hasta que la
 * barra del rodamiento rebasa la línea de alarma. Bucle de ocho segundos.
 *
 * Origen: diseño hecho en Claude Diseño a partir del brief de la página
 * (docs/designs/Animación 3D sensor vibraciones.html). Aquí se portó la
 * escena a React: el motor se construye por código con Three.js (no hay
 * modelos ni texturas), la librería se carga por import dinámico solo
 * cuando la escena se acerca al viewport, y todo se limpia al desmontar.
 *
 * Dos variantes: "espectro" para análisis de vibraciones y "semaforo" para
 * sensores en línea, donde lo que importa es el estado, no el espectro.
 *
 * Con prefers-reduced-motion activo no hay giro ni pulsos: se pinta un
 * solo cuadro con el hallazgo ya marcado. Sin cursor también cuenta la
 * historia; el puntero solo inclina el motor y acerca el panel.
 */

type Variante = "espectro" | "semaforo";

type Props = {
  variante?: Variante;
  className?: string;
};

const NAVY = 0x002e46;
const ORANGE = 0xfc9f01;
const GRAY = "#6b7280";
const ORANGE_HEX = "#fc9f01";
const NORMAL = [30, 50, 38, 24, 44, 28, 20, 26, 24, 22, 18, 14];
const BEAR = 7;
const BEAR_ALARM = 72;
const ALARM_Y = 44;
const BASE = 100;
const LOOP = 8000;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

export default function EscenaVibracion({ variante = "espectro", className = "" }: Props) {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = raiz.current;
    if (!root) return;
    let cancelado = false;
    let limpiar: (() => void) | null = null;

    // Solo se carga Three.js cuando la escena está por verse.
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        observador.disconnect();
        import("three").then((THREE) => {
          if (cancelado) return;
          limpiar = montar(THREE, root, variante);
        });
      },
      { rootMargin: "400px" }
    );
    observador.observe(root);

    return () => {
      cancelado = true;
      observador.disconnect();
      limpiar?.();
    };
  }, [variante]);

  return (
    <div
      ref={raiz}
      className={`vib-scene ${className}`}
      data-variant={variante}
      role="img"
      aria-label={
        variante === "semaforo"
          ? "Un sensor montado en un motor eléctrico capta la vibración del rodamiento y enciende la lámpara ámbar del semáforo de estado: rodamiento, lado de carga, precaución."
          : "Un sensor montado en un motor eléctrico capta la vibración del rodamiento y la convierte en un espectro donde una barra rebasa la línea de alarma: rodamiento, lado de carga, precaución."
      }
    >
      <svg className="vib-link" data-rol="link" aria-hidden="true">
        <path data-rol="linkPath" pathLength={1} fill="none" stroke={GRAY} strokeWidth={1.2} strokeDasharray={1} strokeDashoffset={1} />
        <circle data-rol="linkDot" r={2.4} fill={GRAY} opacity={0} />
      </svg>

      <div className="vib-panel" data-rol="panel" aria-hidden="true">
        {variante === "espectro" ? (
          <>
            <h3>Espectro de vibración</h3>
            <svg viewBox="0 0 200 118">
              <line x1={12} y1={20} x2={12} y2={100} stroke={GRAY} strokeWidth={0.8} />
              <line x1={12} y1={100} x2={192} y2={100} stroke={GRAY} strokeWidth={0.8} />
              <line x1={12} y1={ALARM_Y} x2={192} y2={ALARM_Y} stroke={GRAY} strokeWidth={0.8} strokeDasharray="2.5 2.5" />
              <text x={15} y={41} fontSize={5.6} fill="#c5cbd2" letterSpacing=".06em">alarma</text>
              <text x={192} y={111} fontSize={6} fill={GRAY} textAnchor="end">Frecuencia →</text>
              <g data-rol="bars" />
              <g data-rol="tag" opacity={0}>
                <text x={110} y={21} fontSize={6.6} fill="#fff" fontWeight={500}>Rodamiento, lado de carga</text>
                <rect x={132} y={28} width={42} height={11} rx={5.5} fill={ORANGE_HEX} />
                <text x={153} y={35.8} fontSize={6.2} fill="#002e46" fontWeight={600} textAnchor="middle" letterSpacing=".02em">Precaución</text>
              </g>
            </svg>
          </>
        ) : (
          <>
            <h3>Estado del equipo</h3>
            <svg viewBox="0 0 200 118">
              <rect x={22} y={6} width={44} height={106} rx={8} fill="rgba(255,255,255,.05)" stroke={GRAY} strokeWidth={0.8} />
              <circle className="lamp" cx={44} cy={26} r={12} fill="rgba(107,114,128,.25)" stroke={GRAY} strokeWidth={0.8} />
              <circle className="lamp" data-rol="lampAmber" cx={44} cy={59} r={12} fill="rgba(107,114,128,.25)" stroke={GRAY} strokeWidth={0.8} />
              <circle className="lamp" cx={44} cy={92} r={12} fill="rgba(107,114,128,.25)" stroke={GRAY} strokeWidth={0.8} />
              <text x={78} y={28.5} fontSize={7} fill="#c5cbd2">Normal</text>
              <g data-rol="semBadge" opacity={0}>
                <rect x={76} y={52} width={44} height={12} rx={6} fill={ORANGE_HEX} />
                <text x={98} y={60.4} fontSize={6.6} fill="#002e46" fontWeight={600} textAnchor="middle">Precaución</text>
                <text x={78} y={74} fontSize={6} fill="#fff" fontWeight={500}>Rodamiento, lado de carga</text>
              </g>
              <text data-rol="semLabelOff" x={78} y={61.5} fontSize={7} fill="#c5cbd2">Precaución</text>
              <text x={78} y={94.5} fontSize={7} fill="#c5cbd2">Alarma</text>
              {/* Barras invisibles: la línea de tiempo las necesita para decidir cuándo rebasa la alarma */}
              <g data-rol="bars" opacity={0} />
              <g data-rol="tag" opacity={0} />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Three = typeof import("three");

function montar(THREE: Three, root: HTMLDivElement, variante: Variante): () => void {
  const q = <T extends Element>(rol: string) => root.querySelector<T>(`[data-rol="${rol}"]`);
  const panel = q<HTMLDivElement>("panel")!;
  const link = q<SVGSVGElement>("link")!;
  const linkPath = q<SVGPathElement>("linkPath")!;
  const linkDot = q<SVGCircleElement>("linkDot")!;
  const barsG = q<SVGGElement>("bars")!;
  const tag = q<SVGGElement>("tag")!;
  const lampAmber = q<SVGCircleElement>("lampAmber");
  const semBadge = q<SVGGElement>("semBadge");
  const semLabelOff = q<SVGTextElement>("semLabelOff");

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = mq.matches;

  /* ---------- espectro: barras ---------- */
  const bars: SVGRectElement[] = [];
  for (let i = 0; i < NORMAL.length; i++) {
    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("class", "bar");
    r.setAttribute("x", String(20 + i * 14));
    r.setAttribute("width", "8");
    r.setAttribute("rx", "1");
    r.setAttribute("y", String(BASE));
    r.setAttribute("height", "0");
    r.setAttribute("fill", GRAY);
    barsG.appendChild(r);
    bars.push(r);
  }

  /* ---------- three.js ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  // El lienzo va absoluto sobre el marco. Se fija aquí, además de en el
  // CSS, porque si el lienzo entrara en el flujo el alto del contenedor
  // crecería con él y el ResizeObserver lo agrandaría sin fin.
  Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
  root.insertBefore(renderer.domElement, root.firstChild);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(4, 3.1, 5);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9e0e6, 0.95));
  const sun = new THREE.DirectionalLight(0xffffff, 0.55);
  sun.position.set(3, 6, 2);
  scene.add(sun);

  const edgeMat = new THREE.LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.85 });
  const M = (c: number) => new THREE.MeshLambertMaterial({ color: c });
  const mats = { light: M(0xd9e2e8), mid: M(0xb7c6d0), dark: M(0x8fa4b2), navy: M(0x2b5671), deep: M(0x1c4560) };
  const part = (geo: import("three").BufferGeometry, mat: import("three").Material, name: string) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), edgeMat));
    return m;
  };
  const cylX = (r: number, len: number, x: number, mat: import("three").Material, name: string, seg?: number) => {
    const m = part(new THREE.CylinderGeometry(r, r, len, seg || 40), mat, name);
    m.rotation.z = Math.PI / 2;
    m.position.x = x;
    return m;
  };
  const circleLine = (r: number, x: number) => {
    const pts = new THREE.EllipseCurve(0, 0, r, r, 0, 2 * Math.PI, false, 0).getPoints(48);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const l = new THREE.LineLoop(g, edgeMat);
    l.rotation.y = Math.PI / 2;
    l.position.x = x;
    return l;
  };

  const tilt = new THREE.Group();
  const motor = new THREE.Group();
  motor.name = "motor";
  tilt.add(motor);
  scene.add(tilt);

  motor.add(cylX(0.5, 1.6, 0, mats.light, "carcasa"));
  for (let f = 0; f < 18; f++) {
    const a = (f / 18) * Math.PI * 2;
    const fin = part(new THREE.BoxGeometry(1.3, 0.14, 0.024), mats.mid, "aleta_" + f);
    fin.position.set(0, Math.cos(a) * 0.55, Math.sin(a) * 0.55);
    fin.rotation.x = a;
    motor.add(fin);
  }
  motor.add(cylX(0.56, 0.14, 0.87, mats.mid, "tapa_carga"));
  motor.add(cylX(0.56, 0.14, -0.87, mats.mid, "tapa_ventilador"));
  motor.add(cylX(0.3, 0.12, 0.99, mats.dark, "rodamiento"));
  motor.add(cylX(0.09, 0.23, 1.165, mats.dark, "eje", 24));
  motor.add(cylX(0.24, 0.28, 1.42, mats.navy, "acoplamiento", 32));
  motor.add(cylX(0.26, 0.03, 1.42, mats.deep, "brida", 32));
  motor.add(cylX(0.09, 0.16, 1.64, mats.dark, "eje_salida", 24));
  motor.add(cylX(0.57, 0.24, -1.06, mats.mid, "cubierta_ventilador"));
  motor.add(circleLine(0.15, -1.185));
  motor.add(circleLine(0.3, -1.185));
  motor.add(circleLine(0.45, -1.185));
  const tbox = part(new THREE.BoxGeometry(0.44, 0.34, 0.4), mats.navy, "caja_conexiones");
  tbox.position.set(-0.2, 0.7, 0);
  motor.add(tbox);
  const tlid = part(new THREE.BoxGeometry(0.48, 0.05, 0.44), mats.deep, "tapa_caja");
  tlid.position.set(-0.2, 0.895, 0);
  motor.add(tlid);
  const foot1 = part(new THREE.BoxGeometry(0.34, 0.2, 1.1), mats.navy, "pata_1");
  foot1.position.set(0.5, -0.53, 0);
  motor.add(foot1);
  const foot2 = part(new THREE.BoxGeometry(0.34, 0.2, 1.1), mats.navy, "pata_2");
  foot2.position.set(-0.5, -0.53, 0);
  motor.add(foot2);
  const base = part(new THREE.BoxGeometry(2.0, 0.08, 1.25), mats.deep, "base");
  base.position.set(0, -0.67, 0);
  motor.add(base);

  const sensor = part(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 24), new THREE.MeshLambertMaterial({ color: NAVY }), "sensor");
  sensor.position.set(0.87, 0.64, 0);
  motor.add(sensor);
  const dotMat = new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0 });
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), dotMat);
  dot.name = "sensor_led";
  dot.position.set(0.87, 0.735, 0);
  motor.add(dot);

  const ring = () => {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(0.28, 0.305, 56),
      new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
    );
    m.rotation.y = Math.PI / 2;
    m.position.x = 1.06;
    m.visible = false;
    motor.add(m);
    return m;
  };
  const ring1 = ring();
  const ring2 = ring();

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1, 48),
    new THREE.MeshBasicMaterial({ color: NAVY, transparent: true, opacity: 0.07, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.72;
  shadow.scale.set(1.55, 1.15, 1);
  scene.add(shadow);

  /* ---------- tamaño ---------- */
  let W = 620;
  let H = 465;
  const resize = () => {
    const r = root.getBoundingClientRect();
    W = Math.max(1, r.width);
    // El alto sale del ancho (4:3), nunca del contenido, para que ningún
    // hijo pueda inflar el marco.
    H = Math.max(1, Math.round(W * 0.75));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    const asp = W / H;
    const s = 2.15;
    const k = 1.05;
    camera.left = -asp * s + k;
    camera.right = asp * s + k;
    camera.top = s + 0.1;
    camera.bottom = -s + 0.1;
    camera.updateProjectionMatrix();
    link.setAttribute("viewBox", `0 0 ${W} ${H}`);
    if (reduced) draw(true);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(root);
  resize();

  /* ---------- hover / puntero ---------- */
  let tX = 0, tZ = 0, cX = 0, cZ = 0, pX = 0, pY = 0, pS = 1, cpX = 0, cpY = 0, cpS = 1;
  const alMover = (e: PointerEvent) => {
    const r = root.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tX = ny * 0.22; tZ = -nx * 0.18; pX = -nx * 10; pY = -ny * 8; pS = 1.035;
  };
  const alSalir = () => { tX = 0; tZ = 0; pX = 0; pY = 0; pS = 1; };
  root.addEventListener("pointermove", alMover);
  root.addEventListener("pointerleave", alSalir);

  /* ---------- línea de tiempo (8 s) ---------- */
  const sv = new THREE.Vector3();

  function applyTimeline(t: number) {
    const fade = 1 - ramp(t, 7200, 7900);
    ([[ring1, 300, 1700], [ring2, 900, 2300]] as const).forEach(([anillo, a, b]) => {
      const p = ramp(t, a, b);
      anillo.visible = !reduced && p > 0 && p < 1;
      const s = 0.3 + ease(p) * 2.4;
      anillo.scale.set(s, s, 1);
      (anillo.material as import("three").MeshBasicMaterial).opacity = (1 - p) * 0.9;
    });
    const b = ramp(t, 1400, 2500);
    dotMat.opacity = reduced ? 0.9 : b > 0 && b < 1 ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t / 70)) : t >= 2500 ? 0.9 * fade : 0;
    const l = ease(ramp(t, 1900, 2700));
    linkPath.style.strokeDashoffset = String(1 - l);
    linkPath.style.opacity = String((l > 0 ? 1 : 0) * fade);
    linkDot.setAttribute("opacity", String((l > 0 ? 1 : 0) * fade));
    const pa = ease(ramp(t, 2400, 2900));
    panel.style.opacity = String(pa * fade);
    const lift = (1 - pa) * 12;
    panel.style.transform = `translate(${cpX.toFixed(2)}px,${(cpY + lift).toFixed(2)}px) scale(${cpS.toFixed(3)})`;
    let over = false;
    for (let i = 0; i < bars.length; i++) {
      const pi = ease(ramp(t, 2900 + i * 80, 3500 + i * 80));
      let h = NORMAL[i] * pi;
      if (i === BEAR) {
        const e = ease(ramp(t, 4300, 5100));
        h = NORMAL[i] * pi + (BEAR_ALARM - NORMAL[i]) * e;
      }
      const top = BASE - h;
      bars[i].setAttribute("y", String(top));
      bars[i].setAttribute("height", String(h));
      if (i === BEAR) {
        over = top < ALARM_Y;
        bars[i].setAttribute("fill", over ? ORANGE_HEX : GRAY);
      }
    }
    const la = ease(ramp(t, 5200, 5700));
    tag.setAttribute("opacity", String(la));
    if (variante === "semaforo" && lampAmber && semBadge && semLabelOff) {
      lampAmber.setAttribute("fill", over ? ORANGE_HEX : "rgba(107,114,128,.25)");
      lampAmber.setAttribute("stroke", over ? ORANGE_HEX : GRAY);
      semBadge.setAttribute("opacity", String(la));
      semLabelOff.setAttribute("opacity", String(1 - la));
    }
  }

  function updateLink() {
    dot.getWorldPosition(sv);
    sv.project(camera);
    const sx = ((sv.x + 1) / 2) * W;
    const sy = ((1 - sv.y) / 2) * H;
    const rr = root.getBoundingClientRect();
    const pr = panel.getBoundingClientRect();
    const px = pr.left - rr.left;
    const py = pr.top - rr.top + pr.height * 0.5;
    const mx = sx + (px - sx) * 0.55;
    linkPath.setAttribute("d", `M${sx.toFixed(1)} ${sy.toFixed(1)} C${mx.toFixed(1)} ${sy.toFixed(1)} ${mx.toFixed(1)} ${py.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`);
    linkDot.setAttribute("cx", String(sx));
    linkDot.setAttribute("cy", String(sy));
  }

  let start = performance.now();
  let raf = 0;
  let vivo = true;
  function draw(staticFrame: boolean) {
    if (!vivo) return;
    if (staticFrame) {
      motor.rotation.y = 0.35;
      tilt.rotation.set(0, 0, 0);
      cpX = 0; cpY = 0; cpS = 1;
      applyTimeline(6500);
      updateLink();
      renderer.render(scene, camera);
      return;
    }
    const now = performance.now();
    const t = (now - start) % LOOP;
    motor.rotation.y = ((now - start) / 20000) * Math.PI * 2 + 0.35;
    cX += (tX - cX) * 0.08; cZ += (tZ - cZ) * 0.08;
    tilt.rotation.x = cX; tilt.rotation.z = cZ;
    cpX += (pX - cpX) * 0.08; cpY += (pY - cpY) * 0.08; cpS += (pS - cpS) * 0.08;
    applyTimeline(t);
    updateLink();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(() => draw(false));
  }

  const boot = () => {
    cancelAnimationFrame(raf);
    if (reduced) draw(true);
    else { start = performance.now(); draw(false); }
  };
  const alCambiarMotion = (e: MediaQueryListEvent) => { reduced = e.matches; boot(); };
  mq.addEventListener("change", alCambiarMotion);
  boot();

  return () => {
    vivo = false;
    cancelAnimationFrame(raf);
    mq.removeEventListener("change", alCambiarMotion);
    root.removeEventListener("pointermove", alMover);
    root.removeEventListener("pointerleave", alSalir);
    ro.disconnect();
    scene.traverse((o) => {
      const m = o as import("three").Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as import("three").Material | import("three").Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
    bars.forEach((b) => b.remove());
  };
}
