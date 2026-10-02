import Link from "next/link";
import Image from "next/image";
import datos from "@/data/deteccion-gas.json";
import GraficoPunto from "@/components/atoms/GraficoPunto";
import { DibujoInstrumentos, DibujoMetodo, DibujoAuditoria, EvidenciaAcustica, EvidenciaLaser, EvidenciaReparacion, PlanoUbicacion } from "@/components/atoms/IlustracionesGas";
import ContactForm from "@/components/organisms/ContactForm";
import EscenaLdar from "@/components/organisms/EscenaLdar";
import GaleriaCampo from "@/components/organisms/GaleriaCampo";
import VideoBucle from "@/components/atoms/VideoBucle";
import ClientesLogos from "@/components/organisms/ClientesLogos";
import GuiasRelacionadas from "@/components/organisms/GuiasRelacionadas";
import { getArticulosPorServicio } from "@/lib/recursos";
import JsonLd, { createServiceSchema, createBreadcrumbSchema, createFaqSchema } from "@/components/atoms/JsonLd";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * PaginaGas
 * Detección y reparación de fugas de gas.
 *
 * Por qué no usa la plantilla de los demás servicios: es un servicio aparte,
 * con otro cliente (el sector hidrocarburos y su regulación), otra
 * tecnología y otro entregable, y la página tiene que transmitirlo desde el
 * primer vistazo. Por eso tiene su propia forma: apertura oscura con el
 * visor de la cámara acústica, los dos métodos de detección lado a lado, el ciclo LDAR
 * en su escena de plano técnico, el año regulatorio trimestre por
 * trimestre y el expediente de una fuga como entregable.
 *
 * El contenido vive en data/deteccion-gas.json. Componente de servidor; la
 * única animación (la nube de gas del visor) es CSS y se detiene con
 * movimiento reducido.
 */

const WHATSAPP = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(datos.cta.whatsapp)}`;

/* Fondo de retícula técnica para las secciones oscuras */
const RETICULA = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

function Etiqueta({ children, clara }: { children: React.ReactNode; clara?: boolean }) {
  return (
    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
      <span className={clara ? "text-white/40" : "text-primary/30"}>{"// "}</span>
      {children}
    </p>
  );
}

export default function PaginaGas() {
  const { hero, aparte, tecnologia, ciclo, anio, expediente, paraQuien, faq, cta } = datos;
  const serviceJsonLd = createServiceSchema({ name: hero.titulo, description: hero.texto, serviceType: "Detección y reparación de fugas de gas" });
  const breadcrumbJsonLd = createBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Servicios", url: "" },
    { name: hero.titulo, url: "/servicios/deteccion-gas" },
  ]);

  return (
    <main>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={createFaqSchema(faq)} />

      {/* Apertura: video de fondo con la cámara acústica en campo (Higgsfield, 2026-10-02) */}
      <section className="relative w-full overflow-hidden bg-[#00202f] pb-16 pt-36 text-white lg:min-h-[44rem] lg:pb-24 lg:pt-44">
        <VideoBucle
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          src={`${hero.video.src}.mp4`}
          poster={`${hero.video.src}.jpg`}
          descripcion={hero.video.descripcion}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00202f] via-[#00202f]/80 to-[#00202f]/20" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00202f]/80 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <nav aria-label="Migas" className="mb-6 font-mono text-[11px] text-white/45">
              <Link href="/" className="hover:text-white">Inicio</Link> / <Link href="/servicios" className="hover:text-white">Servicios</Link> / <span className="text-white/70">Detección de gas</span>
            </nav>
            <Etiqueta clara>{hero.antetitulo}</Etiqueta>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] lg:text-6xl">{hero.titulo}</h1>
            <p className="mt-5 text-justify text-lg leading-relaxed text-white/75">{hero.texto}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {hero.sellos.map((s) => (
                <li key={s} className="rounded-sm border border-white/20 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white/85">{s}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xs bg-secondary px-7 py-3.5 font-bold text-primary transition-colors hover:bg-white">
                Cotizar por WhatsApp
              </a>
              <a href="#contacto" className="inline-flex items-center justify-center rounded-xs border-2 border-white/60 px-7 py-3 font-bold text-white transition-colors hover:bg-white hover:text-primary">
                Solicitar propuesta
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Un servicio aparte */}
      <section className="w-full bg-white py-14 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <Etiqueta>{aparte.etiqueta}</Etiqueta>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{aparte.titulo}</h2>
              <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{aparte.texto}</p>
            </div>
            {/* La diferencia, renglón por renglón */}
            <div className="overflow-hidden rounded-sm ring-1 ring-black/10">
              <div className="grid grid-cols-[6.5rem_1fr_1fr] text-[11px] font-bold uppercase tracking-wider sm:grid-cols-[8rem_1fr_1fr] sm:text-xs">
                <span className="bg-gray-50 px-3 py-3" />
                <span className="bg-gray-100 px-3 py-3 text-tertiary">{aparte.contraste.columnas[0]}</span>
                <span className="bg-primary px-3 py-3 text-secondary">{aparte.contraste.columnas[1]}</span>
              </div>
              {aparte.contraste.filas.map((f) => (
                <div key={f.k} className="grid grid-cols-[6.5rem_1fr_1fr] border-t border-gray-100 text-sm sm:grid-cols-[8rem_1fr_1fr]">
                  <span className="bg-gray-50 px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-tertiary sm:text-[11px]">{f.k}</span>
                  <span className="px-3 py-3 text-tertiary">{f.a}</span>
                  <span className="bg-primary/[0.04] px-3 py-3 font-bold text-primary">{f.b}</span>
                </div>
              ))}
            </div>
          </div>
          <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-primary/10 md:grid-cols-3">
            {aparte.puntos.map((p, i) => (
              <li key={p.titulo} className="bg-white p-6 lg:p-8">
                <div className="mb-5 h-32 rounded-sm bg-gray-50 p-2 lg:h-36">
                  {i === 0 ? <DibujoInstrumentos /> : i === 1 ? <DibujoMetodo /> : <DibujoAuditoria />}
                </div>
                <span className="font-mono text-sm font-bold text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-extrabold text-primary">{p.titulo}</h3>
                <p className="mt-2 text-justify text-base leading-relaxed text-tertiary">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tecnología: los dos instrumentos */}
      <section className="w-full bg-[#00202f] py-14 text-white lg:py-24" style={RETICULA}>
        <div className="mx-auto max-w-7xl px-6">
          <Etiqueta clara>{tecnologia.etiqueta}</Etiqueta>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight lg:text-5xl">{tecnologia.titulo}</h2>
          {tecnologia.texto && <p className="mt-4 max-w-3xl text-justify text-lg leading-relaxed text-white/75">{tecnologia.texto}</p>}
          {/* Los dos métodos de detección lado a lado. Si algún día hay un
              tercero, va a lo ancho debajo. */}
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {tecnologia.items.map((t, i) => {
              const m = t as { video?: { src: string; descripcion: string }; foto?: { src: string; alt: string } };
              return (
              <article
                key={t.nombre}
                className={`overflow-hidden rounded-sm bg-white/[0.04] ring-1 ring-white/10 ${
                  i === 2 ? "lg:col-span-2 lg:grid lg:grid-cols-2 lg:items-center" : ""
                }`}
              >
                <div className="relative aspect-[4/3] bg-white">
                  {m.video ? (
                    <VideoBucle className="absolute inset-0 h-full w-full object-cover" src={`${m.video.src}.mp4`} poster={`${m.video.src}.jpg`} descripcion={m.video.descripcion} />
                  ) : m.foto ? (
                    <Image src={m.foto.src} alt={m.foto.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                  ) : (
                    <GraficoPunto clave={t.grafico} />
                  )}
                </div>
                <div className="p-6 lg:p-8">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-secondary">
                    {String(i + 1).padStart(2, "0")} · {t.verbo}
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold lg:text-3xl">{t.nombre}</h3>
                  <p className="mt-2 text-justify text-base leading-relaxed text-white/75">{t.texto}</p>
                  <ul className="mt-5 space-y-2">
                    {t.puntos.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-white/90 lg:text-base">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-secondary" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
              );
            })}
          </div>

          {/* La misma fuga con los dos métodos (video, 2026-10-02) */}
          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
            <div className="overflow-hidden rounded-2xl bg-white/[0.06] p-2 ring-1 ring-white/10 sm:p-3">
              <VideoBucle
                className="block aspect-[16/10] w-full rounded-xl object-cover"
                src={`${tecnologia.video.src}.mp4`}
                poster={`${tecnologia.video.src}.jpg`}
                descripcion={tecnologia.video.descripcion}
              />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold lg:text-3xl">{tecnologia.video.titulo}</h3>
              <p className="mt-3 text-justify text-base leading-relaxed text-white/75 lg:text-lg">{tecnologia.video.texto}</p>
            </div>
          </div>
        </div>
      </section>

      {/* El ciclo LDAR: el programa completo en la escena, y los pasos debajo */}
      <section className="w-full bg-white py-14 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Etiqueta>{ciclo.etiqueta}</Etiqueta>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{ciclo.titulo}</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{ciclo.texto}</p>
          </div>
          <div className="mx-auto mt-10 w-full max-w-5xl">
            <EscenaLdar foto={{ src: "/images/deteccion-gas/campo/inspeccion-planta.webp", alt: "Analista de DIAPSA inspeccionando líneas de gas en una planta" }} />
          </div>
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ciclo.pasos.map((p, i) => (
              <li key={p.titulo} className="border-t-2 border-secondary pt-4">
                <span className="font-mono text-sm font-bold text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 font-extrabold text-primary">{p.titulo}</p>
                <p className="mt-1 text-justify text-sm leading-relaxed text-tertiary">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Monitoreo en línea: cámaras fijas y sensores de PPM (Emiliano, 2026-10-02:
          va unificado con la detección de fugas, no como página aparte) */}
      <section id="monitoreo-en-linea" className="w-full scroll-mt-24 bg-gray-50 py-14 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Etiqueta>{datos.fijo.etiqueta}</Etiqueta>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{datos.fijo.titulo}</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{datos.fijo.texto}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
            <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_30px_70px_-35px_rgba(13,26,56,0.35)] ring-1 ring-primary/10 sm:p-3">
              <VideoBucle
                className="block aspect-[16/10] w-full rounded-xl object-cover"
                src={`${datos.fijo.video}.mp4`}
                poster={`${datos.fijo.video}.jpg`}
                descripcion={datos.fijo.descripcionVideo}
              />
            </div>
            <div className="space-y-5">
              {datos.fijo.items.map((t) => (
                <article key={t.nombre} className="grid grid-cols-1 overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-black/5 sm:grid-cols-[10rem_1fr]">
                  <div className="relative h-40 sm:h-auto">
                    <Image src={t.foto.src} alt={t.foto.alt} fill sizes="(min-width: 640px) 160px, 100vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold text-primary">{t.nombre}</h3>
                    <p className="mt-2 text-justify text-sm leading-relaxed text-tertiary">{t.texto}</p>
                    <ul className="mt-3 space-y-1.5">
                      {t.puntos.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-sm font-semibold text-primary">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-secondary" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
              <p className="border-l-4 border-secondary pl-4 text-justify text-sm leading-relaxed text-tertiary">{datos.fijo.integracion}</p>
            </div>
          </div>
        </div>
      </section>

      {/* El año regulatorio */}
      <section className="w-full bg-primary py-14 text-white lg:py-24" style={RETICULA}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <Etiqueta clara>{anio.etiqueta}</Etiqueta>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight lg:text-5xl">{anio.titulo}</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-white/75">{anio.texto}</p>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {anio.trimestres.map((q) => (
              <li key={q} className="rounded-sm bg-white/[0.06] p-5 ring-1 ring-white/10">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-secondary">{q}</p>
                <ul className="mt-4 space-y-2">
                  {anio.actividades.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-white/85">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li className="rounded-sm bg-secondary p-5 text-primary">
              <p className="font-mono text-xs font-bold uppercase tracking-widest">Cierre del año</p>
              <p className="mt-3 text-xl font-extrabold">{anio.cierre.titulo}</p>
              <p className="mt-2 text-justify text-sm leading-relaxed">{anio.cierre.texto}</p>
            </li>
          </ol>
          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {anio.obligaciones.map((o) => (
              <p key={o} className="flex items-start gap-2 text-sm leading-snug text-white/85">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {o}
              </p>
            ))}
          </div>
          <Link href="/servicios/deteccion-gas/guia-ppciem" className="mt-8 inline-flex items-center gap-2 font-bold text-secondary hover:underline">
            Lee la guía: qué exige el PPCIEM y cómo cumplirlo
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* El expediente */}
      <section className="w-full bg-gray-50 py-14 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <Etiqueta>{expediente.etiqueta}</Etiqueta>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{expediente.titulo}</h2>
            <p className="mt-4 text-justify text-lg leading-relaxed text-tertiary">{expediente.texto}</p>
            <ul className="mt-8 space-y-3">
              {expediente.incluye.map((x) => (
                <li key={x} className="flex items-start gap-3 text-base text-primary">
                  <svg className="mt-1 h-4 w-4 shrink-0 text-secondary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <article className="overflow-hidden rounded-sm bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center justify-between gap-3 bg-primary px-5 py-4 lg:px-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-secondary">Registro de fuga</p>
                <p className="text-2xl font-extrabold text-white">{expediente.registro.numero}</p>
              </div>
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">✓ {expediente.registro.estado}</span>
            </div>
            {/* De la detección al cierre */}
            <ol className="grid grid-cols-4 border-b border-gray-100 px-3 py-4 lg:px-5">
              {expediente.registro.linea.map((l, i, todos) => (
                <li key={l.t} className="relative flex flex-col items-center text-center">
                  {i < todos.length - 1 && <span className="absolute left-1/2 top-3.5 h-0.5 w-full bg-emerald-500" aria-hidden="true" />}
                  <span className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${i === todos.length - 1 ? "bg-emerald-500 text-white" : "bg-white text-emerald-700 ring-2 ring-emerald-500"}`}>
                    {i === todos.length - 1 ? "✓" : i + 1}
                  </span>
                  <span className="mt-1.5 text-[11px] font-bold leading-tight text-primary sm:text-xs">{l.t}</span>
                  <span className="text-[10px] leading-tight text-tertiary sm:text-[11px]">{l.d}</span>
                </li>
              ))}
            </ol>
            {/* Dónde está */}
            <div className="grid grid-cols-1 gap-3 border-b border-gray-100 px-5 py-4 sm:grid-cols-[8.5rem_1fr] lg:px-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-tertiary">Ubicación</p>
                <p className="mt-1 text-sm font-semibold text-primary">{expediente.registro.ubicacion}</p>
              </div>
              <div className="h-24"><PlanoUbicacion /></div>
            </div>
            <dl className="divide-y divide-gray-100">
              {expediente.registro.datos.map((d) => (
                <div key={d.k} className="grid grid-cols-[8.5rem_1fr] gap-3 px-5 py-3 lg:px-6">
                  <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-tertiary">{d.k}</dt>
                  <dd className="text-sm font-semibold text-primary">{d.v}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 lg:px-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-tertiary">Evidencia</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {expediente.registro.evidencia.map((e, i) => (
                  <figure key={e}>
                    <div className="aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-black/10">
                      {i === 0 ? <EvidenciaAcustica /> : i === 1 ? <EvidenciaLaser /> : <EvidenciaReparacion />}
                    </div>
                    <figcaption className="mt-1.5 text-[10px] font-bold leading-tight text-primary lg:text-xs">{e}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Para quién */}
      <section className="w-full bg-white py-14 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Etiqueta>{paraQuien.etiqueta}</Etiqueta>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-primary lg:text-5xl">{paraQuien.titulo}</h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {paraQuien.grupos.map((g, i) => (
              <article key={g.titulo} className={`rounded-sm p-6 lg:p-8 ${i === 0 ? "bg-primary text-white" : "bg-white ring-2 ring-primary"}`}>
                <span className={`inline-block rounded-sm px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${i === 0 ? "bg-secondary text-primary" : "bg-primary text-white"}`}>{g.sello}</span>
                <h3 className={`mt-4 text-2xl font-extrabold lg:text-3xl ${i === 0 ? "" : "text-primary"}`}>{g.titulo}</h3>
                <p className={`mt-2 text-justify text-base leading-relaxed ${i === 0 ? "text-white/75" : "text-tertiary"}`}>{g.texto}</p>
                <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {g.items.map((x) => (
                    <li key={x} className={`flex items-start gap-2 text-sm font-semibold ${i === 0 ? "text-white/90" : "text-primary"}`}>
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-secondary" aria-hidden="true" />
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          {/* Lo que suma una fuga chica en un año (video, 2026-10-02) */}
          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12">
            <div className="lg:order-2 overflow-hidden rounded-2xl bg-white p-2 shadow-[0_30px_70px_-35px_rgba(13,26,56,0.35)] ring-1 ring-primary/10 sm:p-3">
              <VideoBucle
                className="block aspect-[16/10] w-full rounded-xl object-cover"
                src={`${paraQuien.video.src}.mp4`}
                poster={`${paraQuien.video.src}.jpg`}
                descripcion={paraQuien.video.descripcion}
              />
            </div>
            <div className="lg:order-1">
              <h3 className="text-2xl font-extrabold text-primary lg:text-3xl">{paraQuien.video.titulo}</h3>
              <p className="mt-3 text-justify text-base leading-relaxed text-tertiary lg:text-lg">{paraQuien.video.texto}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fotos reales de inspecciones de fugas */}
      {datos.galeria && datos.galeria.length > 0 && <GaleriaCampo fotos={datos.galeria} />}

      {/* Quién ya confía */}
      <ClientesLogos />

      {/* Preguntas frecuentes */}
      <section className="w-full bg-gray-50 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Etiqueta>Preguntas frecuentes</Etiqueta>
          <h2 className="mt-3 mb-10 text-3xl font-extrabold leading-tight text-primary lg:text-5xl">Lo que nos preguntan</h2>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {faq.map((f) => (
              <details key={f.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-primary [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span aria-hidden="true" className="shrink-0 text-2xl font-extrabold text-secondary transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-justify text-base leading-relaxed text-tertiary lg:text-lg">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Guías del blog sobre fugas y LDAR */}
      <GuiasRelacionadas articulos={getArticulosPorServicio("/servicios/deteccion-gas")} />

      {/* Cierre */}
      <section className="w-full bg-[#00202f] py-16 text-white lg:py-24" style={RETICULA}>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold leading-tight lg:text-5xl">{cta.titulo}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-justify text-lg leading-relaxed text-white/75">{cta.texto}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xs bg-secondary px-8 py-3.5 font-bold text-primary transition-colors hover:bg-white">
              Cotizar por WhatsApp
            </a>
            <a href="#contacto" className="inline-flex items-center justify-center rounded-xs border-2 border-white/60 px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-primary">
              Prefiero el formulario
            </a>
          </div>
        </div>
      </section>

      <section id="contacto">
        <ContactForm gas />
      </section>
    </main>
  );
}
