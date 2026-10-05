import mapa from "@/data/diplomado-mapa.json";
import Bandera from "../atoms/Bandera";

/**
 * MapaDiplomado
 * Mapa de puntos de América y Europa con un marcador por país del claustro
 * (Emiliano, 2026-10-04: en lugar de la lista de nombres, los países en el
 * mapa y con bandera). Los puntos de tierra vienen de data/diplomado-mapa.json
 * (generado sobre Natural Earth 110m); las coordenadas de cada país están
 * en el mismo archivo, así que un país nuevo en la lista de ponentes aparece
 * solo si ya tiene coordenadas. Los marcadores laten con SMIL, sin CSS.
 */

type Lado = "izq" | "der" | "arriba" | "abajo";
const LADO: Record<string, Lado> = { "México": "izq", Cuba: "arriba", "República Dominicana": "der", Venezuela: "der", "España": "arriba", Italia: "der", Ecuador: "izq", Argentina: "der", "Panamá": "abajo" };
const AZUL = "#04358f";

export default function MapaDiplomado({ paises }: { paises: string[] }) {
  const coords = mapa.paises as unknown as Record<string, [number, number]>;
  const marcados = paises.filter((p) => coords[p]);
  return (
    <figure className="relative overflow-hidden rounded-sm bg-[#eef3ff] ring-1 ring-black/5">
      <svg viewBox={`0 0 ${mapa.ancho} ${mapa.alto}`} className="block h-auto w-full" role="img" aria-label={`Mapa con los países de los especialistas del diplomado: ${marcados.join(", ")}`}>
        {/* Tierra */}
        {(mapa.puntos as unknown as [number, number][]).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={mapa.radio} fill="rgba(4,53,143,0.18)" />
        ))}
        {/* Países del claustro */}
        {marcados.map((p) => {
          const [x, y] = coords[p];
          const lado = LADO[p] ?? "der";
          const tx = lado === "izq" ? x - 16 : lado === "der" ? x + 16 : x;
          const ty = lado === "arriba" ? y - 18 : lado === "abajo" ? y + 30 : y + 6;
          const anchor = lado === "izq" ? "end" : lado === "der" ? "start" : "middle";
          return (
            <g key={p}>
              <circle cx={x} cy={y} r={9} fill="none" stroke={AZUL} strokeWidth={2}>
                <animate attributeName="r" values="9;26" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={8} fill={AZUL} stroke="#fff" strokeWidth={3} />
              <text x={tx} y={ty} textAnchor={anchor} fontSize={17} fontWeight={800} fill="#0d1a38" stroke="#eef3ff" strokeWidth={5} paintOrder="stroke" style={{ fontFamily: "inherit" }}>
                {p}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {marcados.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-primary shadow-sm">
            <Bandera pais={p} />
            {p}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
