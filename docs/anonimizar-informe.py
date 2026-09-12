# -*- coding: utf-8 -*-
"""
Anonimiza el informe resumido de IDAP para usarlo como material público.

Usa tachado real (apply_redactions): el texto original se ELIMINA del archivo,
no se tapa. Un recuadro encima dejaría el texto seleccionable y copiable.
"""
import pymupdf, os, sys

ORIGEN = r"C:\Users\emili\OneDrive\Desktop\Diapsa\Area comercial\Recursos comerciales\IDAP\Reportes IDAP\Informe_Integral_Resumido_19MAG25AN203.pdf"
DESTINO = "informe-ejemplo-diapsa.pdf"

# Lo que identifica al cliente y con qué se sustituye.
# La ubicación (Aerocondensadores) y la fecha se conservan: son genéricas,
# no identifican una planta concreta y aportan credibilidad técnica.
# (reemplazo, alineación) — los valores del panel van alineados a la derecha,
# igual que "Dinámico" o "Aerocondensadores"; el nombre del equipo, a la izquierda.
SUSTITUCIONES = {
    "Central Anahuac": ("Central eléctrica", pymupdf.TEXT_ALIGN_RIGHT),
    "19MAG25AN203": ("XXXXX00XX000", pymupdf.TEXT_ALIGN_RIGHT),
    "Ventilador 3 Calle 2": ("Ventilador de ACC", pymupdf.TEXT_ALIGN_LEFT),
}

# Fondo real del panel, muestreado del original. Rellenar en blanco dejaba
# recuadros visibles sobre el gris azulado de la ficha.
FONDO = (247 / 255, 250 / 255, 251 / 255)

doc = pymupdf.open(ORIGEN)
total = 0

for pagina in doc:
    for original, (reemplazo, alineacion) in SUSTITUCIONES.items():
        for rect in pagina.search_for(original):
            # Se extiende hacia la IZQUIERDA: los valores van alineados a la
            # derecha, así que el aire sobrante debe quedar antes del texto.
            if alineacion == pymupdf.TEXT_ALIGN_RIGHT:
                caja = pymupdf.Rect(rect.x0 - 22, rect.y0 - 1, rect.x1 + 1, rect.y1 + 1)
            else:
                caja = pymupdf.Rect(rect.x0 - 1, rect.y0 - 1, rect.x1 + 16, rect.y1 + 1)
            # Tamaño que garantiza que el reemplazo quepa en el ancho disponible.
            tam = min(rect.height * 1.02, caja.width / (0.5 * max(len(reemplazo), 1)))
            pagina.add_redact_annot(
                caja,
                text=reemplazo,
                fontsize=round(tam, 1),
                fontname="helv",
                align=alineacion,
                fill=FONDO,
                text_color=(0, 0, 0),
            )
            total += 1
    pagina.apply_redactions()

doc.scrub()  # elimina metadatos residuales, javascript y campos ocultos

# Metadatos DESPUÉS del scrub, que borra todo lo que encuentra.
doc.set_metadata({
    "title": "Informe de ejemplo de monitoreo de condición",
    "author": "Grupo DIAPSA",
    "subject": "Ejemplo del entregable de monitoreo de condición. Datos del cliente omitidos.",
    "keywords": "monitoreo de condicion, analisis de vibraciones, termografia, ultrasonido",
    "creator": "Grupo DIAPSA",
    "producer": "Grupo DIAPSA",
})
doc.save(DESTINO, garbage=4, deflate=True, clean=True)
doc.close()
print("tachados aplicados:", total)

# --- Verificación: releer el resultado y confirmar que no quedó nada ---
v = pymupdf.open(DESTINO)
texto = "\n".join(p.get_text() for p in v)
print("paginas:", v.page_count, "| tamaño:", os.path.getsize(DESTINO) // 1024, "KB")
fugas = []
for termino in ["Anahuac", "19MAG25AN203", "Calle 2", "MAG25"]:
    n = texto.count(termino)
    print(f"  fuga '{termino}': {n}")
    if n:
        fugas.append(termino)
print("metadatos:", {k: v.metadata.get(k) for k in ("title", "author", "subject")})
print()
print("--- texto resultante, pagina 1 ---")
print(v[0].get_text()[:700])
v.close()
sys.exit(1 if fugas else 0)
