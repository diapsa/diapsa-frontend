"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStorageUrl } from "@/lib/api/config";
import type { ProductoCatalogo } from "@/lib/productos-locales";
import type { Brand } from "@/types/category";

/**
 * TiendaProductos
 * El catálogo de /productos con estructura de tienda, como la referencia
 * que pasó Emiliano (2026-09-28): filtros a la izquierda, banner de la
 * marca, título con el conteo, búsqueda, rejilla o lista, orden,
 * categorías destacadas con foto y tarjetas con la marca en la esquina.
 *
 * Sin precios ni existencias: DIAPSA cotiza cada equipo, así que en lugar
 * de esos filtros van los que sirven para elegir una cámara (serie,
 * resolución térmica y temperatura máxima) y una caja de asesoría.
 *
 * Mezcla los productos del CMS con las cámaras HIKMICRO del sitio
 * (lib/productos-locales.ts). Acepta ?marca= y ?categoria= en la URL para
 * llegar ya filtrado desde otras páginas.
 */

type Props = { productos: ProductoCatalogo[]; marcas: Brand[] };
type Orden = "relevancia" | "modelo" | "resolucion";

const POR_PAGINA = 24;

// Banner por marca: fondo y fotos. HIKMICRO usa su rojo; las demás, el azul de DIAPSA.
const FONDO_MARCA: Record<string, string> = {
  hikmicro: "linear-gradient(120deg, #5a0010 0%, #a3001e 45%, #d4002a 100%)",
};
const FONDO_DIAPSA = "linear-gradient(120deg, #001526 0%, #002e46 50%, #0a4a78 100%)";
const LINEA_MARCA: Record<string, string> = {
  hikmicro: "Cámaras termográficas de mano para inspección eléctrica, mecánica y de proceso.",
  hertzinno: "Cámaras acústicas de mano y fijas para fugas de gas y aire y descargas eléctricas.",
  "kcf-technologies": "Sensores de vibración inalámbricos y estaciones base para monitoreo en línea.",
};

const RESOLUCIONES = [
  { id: "basica", nombre: "Hasta 256 × 192", prueba: (px: number) => px <= 49152 },
  { id: "media", nombre: "384 × 288 a 480 × 360", prueba: (px: number) => px > 49152 && px <= 172800 },
  { id: "alta", nombre: "640 × 480 o más", prueba: (px: number) => px > 172800 },
];
const TEMPERATURAS = [
  { id: "normal", nombre: "Hasta 650 °C", prueba: (t: number) => t <= 650 },
  { id: "alta", nombre: "Alta temperatura, 2000 °C o más", prueba: (t: number) => t >= 2000 },
];

// La URL solo se lee en el navegador; en el servidor el catálogo sale completo.
const suscribir = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};
const leerUrl = () => window.location.search;
const leerUrlServidor = () => "";

function alternar(lista: string[], id: string) {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
}

function Flecha() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function Casilla({ marcada, onClick, nombre, n }: { marcada: boolean; onClick: () => void; nombre: string; n: number }) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-primary hover:text-secondary">
        <input type="checkbox" checked={marcada} onChange={onClick} className="h-4 w-4 shrink-0 rounded-xs accent-[#fc9f01]" />
        <span className="flex-1">{nombre}</span>
        <span className="text-xs text-tertiary">{n}</span>
      </label>
    </li>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <details open className="group border-b border-gray-200 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-extrabold uppercase tracking-wide text-primary">
        {titulo}
        <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <ul className="mt-2">{children}</ul>
    </details>
  );
}

export default function TiendaProductos({ productos, marcas }: Props) {
  const url = useSyncExternalStore(suscribir, leerUrl, leerUrlServidor);
  const params = new URLSearchParams(url);

  // null = todavía no tocan el filtro; entonces manda lo que traiga la URL
  const [selMarcas, setSelMarcas] = useState<string[] | null>(null);
  const [selCategorias, setSelCategorias] = useState<string[] | null>(null);
  const [selSeries, setSelSeries] = useState<string[]>([]);
  const [selResol, setSelResol] = useState<string[]>([]);
  const [selTemp, setSelTemp] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("relevancia");
  const [vista, setVista] = useState<"rejilla" | "lista">("rejilla");
  const [pagina, setPagina] = useState(1);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [slide, setSlide] = useState(0);

  const fMarcas = selMarcas ?? params.getAll("marca");
  const fCategorias = selCategorias ?? params.getAll("categoria");

  // Marcas y categorías que existen en el catálogo, con su conteo
  const listaMarcas = useMemo(() => {
    const m = new Map<string, { slug: string; name: string; n: number; logo: string | null }>();
    for (const p of productos) {
      const b = p.brand;
      if (!b) continue;
      const e = m.get(b.slug) ?? { slug: b.slug, name: b.name, n: 0, logo: getStorageUrl(marcas.find((x) => x.slug === b.slug)?.logo) };
      e.n++;
      m.set(b.slug, e);
    }
    return [...m.values()].sort((a, b) => b.n - a.n);
  }, [productos, marcas]);

  const listaCategorias = useMemo(() => {
    const m = new Map<string, { slug: string; name: string; n: number; foto: string | null }>();
    for (const p of productos) {
      const c = p.category;
      if (!c) continue;
      const e = m.get(c.slug) ?? { slug: c.slug, name: c.name, n: 0, foto: getStorageUrl(p.main_image) };
      e.n++;
      m.set(c.slug, e);
    }
    return [...m.values()];
  }, [productos]);

  const series = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of productos) if (p.serie) m.set(p.serie, (m.get(p.serie) ?? 0) + 1);
    return [...m.entries()];
  }, [productos]);

  const q = busqueda.trim().toLowerCase();
  const filtrados = productos.filter((p) => {
    if (fMarcas.length && !fMarcas.includes(p.brand?.slug)) return false;
    if (fCategorias.length && !fCategorias.includes(p.category?.slug)) return false;
    if (selSeries.length && !(p.serie && selSeries.includes(p.serie))) return false;
    if (selResol.length && !(p.pixeles && RESOLUCIONES.some((r) => selResol.includes(r.id) && r.prueba(p.pixeles!)))) return false;
    if (selTemp.length && !(p.temp_max && TEMPERATURAS.some((t) => selTemp.includes(t.id) && t.prueba(p.temp_max!)))) return false;
    if (q && !`${p.model} ${p.name} ${p.brand?.name} ${p.category?.name} ${p.serie ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const ordenados =
    orden === "modelo"
      ? [...filtrados].sort((a, b) => a.model.localeCompare(b.model, "es", { numeric: true }))
      : orden === "resolucion"
        ? [...filtrados].sort((a, b) => (b.pixeles ?? -1) - (a.pixeles ?? -1))
        : filtrados;

  const total = ordenados.length;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const pag = Math.min(pagina, paginas);
  const visibles = ordenados.slice((pag - 1) * POR_PAGINA, pag * POR_PAGINA);
  const hayFiltros = fMarcas.length + fCategorias.length + selSeries.length + selResol.length + selTemp.length > 0 || q !== "";

  // Cualquier cambio de filtro regresa a la primera página
  const conPagina1 =
    <T,>(fn: (v: T) => void) =>
    (v: T) => {
      fn(v);
      setPagina(1);
    };
  const ponMarcas = conPagina1(setSelMarcas);
  const ponCategorias = conPagina1(setSelCategorias);
  const ponSeries = conPagina1(setSelSeries);
  const ponResol = conPagina1(setSelResol);
  const ponTemp = conPagina1(setSelTemp);

  const limpiar = () => {
    setSelMarcas([]);
    setSelCategorias([]);
    setSelSeries([]);
    setSelResol([]);
    setSelTemp([]);
    setBusqueda("");
    setPagina(1);
  };

  // El banner: la marca elegida, o todas rotando
  const marcaUnica = fMarcas.length === 1 ? listaMarcas.find((m) => m.slug === fMarcas[0]) : undefined;
  const banners = marcaUnica ? [marcaUnica] : listaMarcas;
  const banner = banners[slide % banners.length];
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setSlide((s) => s + 1), 6000);
    return () => clearInterval(t);
  }, [banners.length]);
  const fotosBanner = banner ? productos.filter((p) => p.brand?.slug === banner.slug && p.main_image).slice(0, 4) : [];
  const fotosHik = banner?.slug === "hikmicro" ? ["sp60", "g61", "m30", "b20s"].map((m) => `/images/productos/hikmicro/${m}.webp`) : null;

  const titulo = marcaUnica?.name ?? (fCategorias.length === 1 ? listaCategorias.find((c) => c.slug === fCategorias[0])?.name : undefined) ?? "Todos los equipos";

  const filtros = (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <p className="text-base font-extrabold text-primary">Filtros</p>
        {hayFiltros && (
          <button type="button" onClick={limpiar} className="text-xs font-bold text-secondary hover:text-primary">
            Limpiar todo
          </button>
        )}
      </div>
      <Grupo titulo="Marca">
        {listaMarcas.map((m) => (
          <Casilla key={m.slug} nombre={m.name} n={m.n} marcada={fMarcas.includes(m.slug)} onClick={() => ponMarcas(alternar(fMarcas, m.slug))} />
        ))}
      </Grupo>
      <Grupo titulo="Categoría">
        {listaCategorias.map((c) => (
          <Casilla key={c.slug} nombre={c.name} n={c.n} marcada={fCategorias.includes(c.slug)} onClick={() => ponCategorias(alternar(fCategorias, c.slug))} />
        ))}
      </Grupo>
      {series.length > 0 && (
        <Grupo titulo="Serie de cámara térmica">
          {series.map(([s, n]) => (
            <Casilla key={s} nombre={s} n={n} marcada={selSeries.includes(s)} onClick={() => ponSeries(alternar(selSeries, s))} />
          ))}
        </Grupo>
      )}
      <Grupo titulo="Resolución térmica">
        {RESOLUCIONES.map((r) => (
          <Casilla
            key={r.id}
            nombre={r.nombre}
            n={productos.filter((p) => p.pixeles && r.prueba(p.pixeles)).length}
            marcada={selResol.includes(r.id)}
            onClick={() => ponResol(alternar(selResol, r.id))}
          />
        ))}
      </Grupo>
      <Grupo titulo="Temperatura máxima">
        {TEMPERATURAS.map((t) => (
          <Casilla
            key={t.id}
            nombre={t.nombre}
            n={productos.filter((p) => p.temp_max && t.prueba(p.temp_max)).length}
            marcada={selTemp.includes(t.id)}
            onClick={() => ponTemp(alternar(selTemp, t.id))}
          />
        ))}
      </Grupo>
      <div className="mt-6 rounded-sm bg-primary p-5 text-white">
        <p className="font-extrabold leading-snug">¿No sabes cuál elegir?</p>
        <p className="mt-2 text-justify text-sm leading-relaxed text-white/75">
          Dinos qué equipos quieres revisar y te recomendamos el modelo que tu planta necesita, sin pagar de más.
        </p>
        <Link href="/contacto" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-white">
          Pedir asesoría <Flecha />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Filtros: columna fija en escritorio, panel desplegable en celular */}
      <aside className="hidden self-start lg:sticky lg:top-24 lg:block">{filtros}</aside>

      <div className="min-w-0">
        {/* Banner de la marca */}
        {banner && (
          <div className="relative overflow-hidden rounded-sm text-white" style={{ background: FONDO_MARCA[banner.slug] ?? FONDO_DIAPSA }}>
            <div className="grid min-h-[200px] grid-cols-1 items-center gap-4 p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:p-8">
              <div>
                {banner.logo && banner.slug !== "hikmicro" ? (
                  <div className="relative mb-3 h-10 w-40 rounded-xs bg-white/95 p-1.5">
                    <Image src={banner.logo} alt={banner.name} fill sizes="160px" className="object-contain p-1" />
                  </div>
                ) : (
                  <p className="mb-2 text-3xl font-black tracking-wide">{banner.name}</p>
                )}
                <p className="text-justify text-sm leading-relaxed text-white/85 sm:text-base">{LINEA_MARCA[banner.slug] ?? ""}</p>
                {!marcaUnica && (
                  <button
                    type="button"
                    onClick={() => ponMarcas([banner.slug])}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-primary transition-colors hover:bg-secondary"
                  >
                    Ver {banner.n} {banner.n === 1 ? "equipo" : "equipos"} <Flecha />
                  </button>
                )}
              </div>
              <div className="flex h-36 items-end justify-center gap-2 sm:h-44">
                {(fotosHik ?? fotosBanner.map((p) => getStorageUrl(p.main_image)!)).map((src, i) => (
                  <div key={src} className={`relative h-full flex-1 ${i > 1 ? "hidden sm:block" : ""}`}>
                    <Image src={src} alt="" fill sizes="160px" className="object-contain drop-shadow-2xl" />
                  </div>
                ))}
              </div>
            </div>
            {banners.length > 1 && (
              <div className="absolute bottom-3 left-6 flex gap-1.5 sm:left-8">
                {banners.map((b, i) => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => setSlide(i)}
                    aria-label={`Ver ${b.name}`}
                    className={`h-1.5 rounded-full transition-all ${i === slide % banners.length ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Título, conteo y controles */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-primary">{titulo}</h2>
            <p className="mt-1 text-sm text-tertiary">
              {total === 0
                ? "Sin resultados"
                : `Mostrando ${(pag - 1) * POR_PAGINA + 1}-${Math.min(pag * POR_PAGINA, total)} de ${total} ${total === 1 ? "producto" : "productos"}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltrosAbiertos((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xs border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-primary lg:hidden"
              aria-expanded={filtrosAbiertos}
            >
              Filtros
            </button>
            <label className="relative flex-1 sm:flex-none">
              <span className="sr-only">Buscar productos</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar producto o modelo"
                className="w-full rounded-xs border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-primary outline-none focus:ring-2 focus:ring-secondary sm:w-60"
              />
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
              </svg>
            </label>
            <div className="flex overflow-hidden rounded-xs border border-gray-300" role="group" aria-label="Vista">
              {(["rejilla", "lista"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVista(v)}
                  aria-pressed={vista === v}
                  aria-label={v === "rejilla" ? "Ver en rejilla" : "Ver en lista"}
                  className={`px-2.5 py-2 ${vista === v ? "bg-primary text-white" : "bg-white text-primary hover:text-secondary"}`}
                >
                  {v === "rejilla" ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="3" rx="1" />
                      <rect x="3" y="10.5" width="18" height="3" rx="1" />
                      <rect x="3" y="17" width="18" height="3" rx="1" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-tertiary">
              Ordenar por
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                className="rounded-xs border border-gray-300 bg-white px-2 py-2 text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="relevancia">Relevancia</option>
                <option value="modelo">Modelo, de la A a la Z</option>
                <option value="resolucion">Mayor resolución térmica</option>
              </select>
            </label>
          </div>
        </div>

        {filtrosAbiertos && <div className="mt-4 rounded-sm bg-white p-5 ring-1 ring-black/5 lg:hidden">{filtros}</div>}

        {/* Categorías destacadas */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-extrabold text-primary">Categorías destacadas</p>
          <ul className="flex flex-wrap gap-3">
            {listaCategorias.map((c) => {
              const sel = fCategorias.length === 1 && fCategorias[0] === c.slug;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => ponCategorias(sel ? [] : [c.slug])}
                    aria-pressed={sel}
                    className={`flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5 text-sm font-bold transition-colors ${
                      sel ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-gray-200 hover:ring-secondary"
                    }`}
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                      {c.foto && <Image src={c.foto} alt="" fill sizes="40px" className="object-contain p-1" />}
                    </span>
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Productos */}
        {total === 0 ? (
          <div className="mt-8 rounded-sm bg-white p-10 text-center ring-1 ring-black/5">
            <p className="font-bold text-primary">No hay equipos con esos filtros.</p>
            <button type="button" onClick={limpiar} className="mt-3 text-sm font-bold text-secondary hover:text-primary">
              Limpiar filtros
            </button>
          </div>
        ) : vista === "rejilla" ? (
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visibles.map((p) => {
              const ruta = `/productos/${p.category?.slug}/${p.slug}`;
              const foto = getStorageUrl(p.main_image);
              return (
                <li key={p.slug}>
                  <Link href={ruta} className="group flex h-full flex-col overflow-hidden rounded-sm bg-white ring-1 ring-black/5 transition-shadow hover:shadow-xl">
                    <div className="relative h-44 bg-white sm:h-52">
                      {foto && (
                        <Image
                          src={foto}
                          alt={`${p.name} ${p.brand?.name} ${p.model}`}
                          fill
                          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
                          className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span
                        className={`absolute right-2 top-2 rounded-xs px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white ${
                          p.brand?.slug === "hikmicro" ? "bg-[#c8102e]" : "bg-primary"
                        }`}
                      >
                        {p.brand?.name}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col border-t border-gray-100 p-4">
                      <p className="text-sm leading-snug text-tertiary">
                        {p.name}
                        {p.serie ? `, ${p.serie}` : ""}
                      </p>
                      <p className="mt-1 font-extrabold leading-snug text-primary group-hover:text-secondary">{p.model}</p>
                      {p.featured_specs?.[0] && (
                        <p className="mt-auto pt-3 text-xs text-tertiary">
                          {p.featured_specs[0].label}:{" "}
                          <span className="font-semibold text-primary">
                            {p.featured_specs[0].value}
                            {p.featured_specs[0].unit ? ` ${p.featured_specs[0].unit}` : ""}
                          </span>
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {visibles.map((p) => {
              const ruta = `/productos/${p.category?.slug}/${p.slug}`;
              const foto = getStorageUrl(p.main_image);
              return (
                <li key={p.slug} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 overflow-hidden rounded-sm bg-white p-4 ring-1 ring-black/5 sm:grid-cols-[170px_minmax(0,1fr)_auto] sm:items-center">
                  <Link href={ruta} className="relative h-28 sm:h-36">
                    {foto && <Image src={foto} alt={`${p.name} ${p.brand?.name} ${p.model}`} fill sizes="170px" className="object-contain" />}
                  </Link>
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-wider text-secondary">
                      {p.brand?.name}
                      {p.serie ? ` · ${p.serie}` : ""}
                    </p>
                    <Link href={ruta} className="mt-0.5 block text-lg font-extrabold text-primary hover:text-secondary">
                      {p.model}
                    </Link>
                    <p className="text-sm text-tertiary">{p.name}</p>
                    {p.featured_specs?.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-tertiary">
                        {p.featured_specs.slice(0, 3).map((s) => (
                          <li key={s.label}>
                            {s.label}:{" "}
                            <span className="font-semibold text-primary">
                              {s.value}
                              {s.unit ? ` ${s.unit}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-span-2 flex gap-2 sm:col-span-1 sm:flex-col">
                    <Link href={ruta} className="flex-1 rounded-xs bg-primary px-5 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-secondary hover:text-primary">
                      Ver ficha
                    </Link>
                    <Link
                      href={`${ruta}#contacto`}
                      className="flex-1 rounded-xs border border-primary/20 px-5 py-2.5 text-center text-sm font-bold text-primary transition-colors hover:border-secondary hover:text-secondary"
                    >
                      Cotizar
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Páginas */}
        {paginas > 1 && (
          <nav className="mt-10 flex justify-center gap-2" aria-label="Páginas del catálogo">
            {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setPagina(n);
                  document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                }}
                aria-current={n === pag ? "page" : undefined}
                className={`h-10 w-10 rounded-xs text-sm font-bold ${n === pag ? "bg-primary text-white" : "bg-white text-primary ring-1 ring-gray-200 hover:ring-secondary"}`}
              >
                {n}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
