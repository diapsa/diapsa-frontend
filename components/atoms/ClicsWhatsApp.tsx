"use client";

import { useEffect } from "react";

/**
 * ClicsWhatsApp
 * Avisa al CMS de cada clic en un enlace de WhatsApp del sitio.
 *
 * Por qué existe: el sitio manda a WhatsApp desde varios botones, pero nadie
 * sabía cuánta gente los pulsa ni desde qué página. El CMS lo enseña en
 * Comportamiento, junto a los clics de Google.
 *
 * Un solo oyente para todo el documento en vez de tocar cada botón: así cuenta
 * también los enlaces que se agreguen después sin acordarse de esto. El aviso
 * sale con sendBeacon y cuerpo text/plain para que el navegador lo mande aunque
 * la pestaña se vaya a WhatsApp, y sin pedir permiso CORS antes. No manda nada
 * de la persona: solo la página y el texto del botón.
 */
const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ClicsWhatsApp() {
  useEffect(() => {
    if (!API) return;

    const alHacerClic = (evento: MouseEvent) => {
      const destino = evento.target as Element | null;
      const enlace = destino?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!enlace || !/(wa\.me|api\.whatsapp\.com|whatsapp\.com\/send)/i.test(enlace.href)) return;

      const etiqueta = (enlace.getAttribute("aria-label") || enlace.textContent || "").replace(/\s+/g, " ").trim().slice(0, 140);
      const cuerpo = JSON.stringify({ pagina: window.location.pathname, etiqueta });

      try {
        const url = `${API.replace(/\/$/, "")}/eventos/whatsapp`;
        if (!navigator.sendBeacon?.(url, new Blob([cuerpo], { type: "text/plain" }))) {
          void fetch(url, { method: "POST", body: cuerpo, keepalive: true, mode: "no-cors", headers: { "Content-Type": "text/plain" } });
        }
      } catch {
        // Medir nunca debe impedir que la persona llegue a WhatsApp.
      }

      // También como evento de Clarity, para filtrar sus grabaciones por quien escribió.
      (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity?.("event", "whatsapp");
    };

    document.addEventListener("click", alHacerClic, true);
    return () => document.removeEventListener("click", alHacerClic, true);
  }, []);

  return null;
}
