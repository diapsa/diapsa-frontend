import { ImageResponse } from "next/og";

/**
 * Generador de imágenes Open Graph con la marca DIAPSA.
 *
 * Por qué existe: 18 de las 26 páginas del sitio heredaban la misma imagen
 * genérica. Cuando alguien comparte un enlace en WhatsApp o LinkedIn, la
 * miniatura no dice nada de la página concreta y se pierden clics. En vez de
 * mantener 18 archivos estáticos, cada página genera la suya con su título.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const AZUL = "#002E46";
const AMBAR = "#F5A31A";

type Opciones = {
  titulo: string;
  /** Línea superior pequeña: la sección a la que pertenece la página. */
  seccion?: string;
  /** Línea inferior opcional: una frase corta de apoyo. */
  pie?: string;
};

export function renderOgImage({ titulo, seccion, pie }: Opciones) {
  // Los títulos largos se recortan: más de ~90 caracteres deja de ser legible
  // en la miniatura que muestran WhatsApp y LinkedIn.
  const tituloVisible = titulo.length > 90 ? `${titulo.slice(0, 87)}…` : titulo;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: AZUL,
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {seccion && (
            <div
              style={{
                color: AMBAR,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              {seccion}
            </div>
          )}
          <div
            style={{
              color: "white",
              fontSize: tituloVisible.length > 55 ? 58 : 72,
              fontWeight: 800,
              lineHeight: 1.15,
              display: "flex",
            }}
          >
            {tituloVisible}
          </div>
          {pie && (
            <div style={{ color: "#C9D6DE", fontSize: 30, marginTop: 28, display: "flex" }}>
              {pie}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "white", fontSize: 34, fontWeight: 800, display: "flex" }}>
            GRUPO <span style={{ color: AMBAR, marginLeft: 10 }}>DIAPSA</span>
          </div>
          <div style={{ color: "#8FA6B4", fontSize: 24, display: "flex" }}>
            grupodiapsa.com.mx
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 12,
            backgroundColor: AMBAR,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...OG_SIZE }
  );
}
