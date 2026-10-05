/**
 * Bandera
 * Banderas en SVG simplificado para los países del claustro del diplomado
 * (Emiliano, 2026-10-04: sin nombres de especialistas, con banderas y mapa).
 * Se dibujan a mano y no con emoji porque en Windows los emoji de bandera se
 * ven como dos letras. Si llega un país sin dibujo, no se pinta nada.
 */

const W = 28;
const H = 19;

function Estrella({ cx, cy, r, fill = "#fff" }: { cx: number; cy: number; r: number; fill?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} />;
}

const DIBUJOS: Record<string, React.ReactNode> = {
  "México": (
    <>
      <rect width={W / 3} height={H} fill="#006847" />
      <rect x={W / 3} width={W / 3} height={H} fill="#fff" />
      <rect x={(2 * W) / 3} width={W / 3} height={H} fill="#ce1126" />
      <circle cx={W / 2} cy={H / 2} r={2.4} fill="#8a5a2b" />
    </>
  ),
  Italia: (
    <>
      <rect width={W / 3} height={H} fill="#009246" />
      <rect x={W / 3} width={W / 3} height={H} fill="#fff" />
      <rect x={(2 * W) / 3} width={W / 3} height={H} fill="#ce2b37" />
    </>
  ),
  "España": (
    <>
      <rect width={W} height={H} fill="#aa151b" />
      <rect y={H / 4} width={W} height={H / 2} fill="#f1bf00" />
    </>
  ),
  Venezuela: (
    <>
      <rect width={W} height={H / 3} fill="#ffcc00" />
      <rect y={H / 3} width={W} height={H / 3} fill="#00247d" />
      <rect y={(2 * H) / 3} width={W} height={H / 3} fill="#cf142b" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = Math.PI * (1 + i / 7);
        return <Estrella key={i} cx={W / 2 + Math.cos(a) * 5.5} cy={H / 2 + 2.2 + Math.sin(a) * 3.2} r={0.7} />;
      })}
    </>
  ),
  Cuba: (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} y={(i * H) / 5} width={W} height={H / 5} fill={i % 2 ? "#fff" : "#002a8f"} />
      ))}
      <polygon points={`0,0 ${W * 0.42},${H / 2} 0,${H}`} fill="#cf142b" />
      <Estrella cx={W * 0.13} cy={H / 2} r={1.6} />
    </>
  ),
  "República Dominicana": (
    <>
      <rect width={W / 2} height={H / 2} fill="#002d62" />
      <rect x={W / 2} width={W / 2} height={H / 2} fill="#ce1126" />
      <rect y={H / 2} width={W / 2} height={H / 2} fill="#ce1126" />
      <rect x={W / 2} y={H / 2} width={W / 2} height={H / 2} fill="#002d62" />
      <rect x={W / 2 - 2} width={4} height={H} fill="#fff" />
      <rect y={H / 2 - 2} width={W} height={4} fill="#fff" />
    </>
  ),
  Ecuador: (
    <>
      <rect width={W} height={H / 2} fill="#ffdd00" />
      <rect y={H / 2} width={W} height={H / 4} fill="#034ea2" />
      <rect y={(3 * H) / 4} width={W} height={H / 4} fill="#ed1c24" />
    </>
  ),
  Argentina: (
    <>
      <rect width={W} height={H} fill="#74acdf" />
      <rect y={H / 3} width={W} height={H / 3} fill="#fff" />
      <Estrella cx={W / 2} cy={H / 2} r={1.8} fill="#f6b40e" />
    </>
  ),
  "Panamá": (
    <>
      <rect width={W / 2} height={H / 2} fill="#fff" />
      <rect x={W / 2} width={W / 2} height={H / 2} fill="#da121a" />
      <rect y={H / 2} width={W / 2} height={H / 2} fill="#005293" />
      <rect x={W / 2} y={H / 2} width={W / 2} height={H / 2} fill="#fff" />
      <Estrella cx={W / 4} cy={H / 4} r={1.6} fill="#005293" />
      <Estrella cx={(3 * W) / 4} cy={(3 * H) / 4} r={1.6} fill="#da121a" />
    </>
  ),
};

export function tieneBandera(pais: string) {
  return pais in DIBUJOS;
}

export default function Bandera({ pais, className = "" }: { pais: string; className?: string }) {
  const d = DIBUJOS[pais];
  if (!d) return null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className={`shrink-0 rounded-[2px] ring-1 ring-black/10 ${className}`} aria-hidden="true">
      {d}
    </svg>
  );
}
