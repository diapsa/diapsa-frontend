"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import NavLink from "@/components/atoms/NavLink";
import MegaMenu, { type ColumnaMenu } from "./MegaMenu";
import Link from "next/link";
import services from '@/data/servicios.json'
import menuCursos from '@/data/menu-cursos.json'

// Menú de 5 entradas (2026-08-25). Antes había 7, con "Monitoreo" y "Detección
// de Gas" sueltos arriba y un cajón de sastre llamado "Más servicios". Ahora
// todos los servicios viven bajo una sola entrada: Servicios.

// Servicios se despliega en un panel a lo ancho (2026-09-12), al estilo de
// Dynamox y Fracttal: tres columnas con todos los servicios a la vista, cada
// uno con ícono y una línea que dice qué es. Antes era una lista angosta con
// un subpanel lateral que escondía las disciplinas detrás de dos niveles.
const [monitoreoCondicion, monitoreoContinuo, ...sueltos] = services;
// Foto de cada servicio suelto para las tarjetas del menú. Son fotos que ya
// están publicadas en sus páginas, sin datos de cliente.
const fotosSueltos: Record<string, string> = {
    "/servicios/diapsa-start": "/images/diapsa-start/medicion-tableros.webp",
    "/servicios/idap": "/images/idap/capturas/inspeccion-vibraciones.jpg",
    "/servicios/deteccion-gas": "/images/deteccion-gas/campo/inspeccion-planta.webp",
    "/servicios/seguridad-de-ductos": "/images/servicios/seguridad-de-ductos/centinela.webp",
    "/servicios/diagnostico-situacional": "/images/diagnostico-situacional/levantamiento-campo-tarjeta.webp",
};
// Monitoreo continuo también en tarjetas con foto (2026-09-28, Emiliano: "que
// se vean igual que Más servicios").
const fotosContinuo: Record<string, string> = {
    "/servicios/monitoreo-continuo/camaras-termicas": "/images/servicios/termografia-infrarroja/campo-02.webp",
    "/servicios/monitoreo-continuo/sensores-vibracion": "/images/servicios/sensores-vibracion/sensor-motor.webp",
    "/servicios/monitoreo-continuo/sensores-acusticos": "/images/servicios/sensores-acusticos/campo-00.webp",
    "/servicios/monitoreo-continuo/dga-en-linea": "/images/servicios/analisis-de-aceite/dga-transformador.webp",
};
const columnasServicios: ColumnaMenu[] = [
    {
        titulo: monitoreoCondicion.label,
        href: monitoreoCondicion.href,
        // El diagnóstico integral reúne a todas las técnicas: va al final, a lo
        // ancho, como base del mosaico (Emiliano, 2026-10-09).
        items: [...(monitoreoCondicion.children ?? [])].sort(
            (a, b) => Number(a.href.endsWith("/diagnostico-de-maquinaria")) - Number(b.href.endsWith("/diagnostico-de-maquinaria")),
        ),
        ancho: 2,
        formato: "mosaico",
    },
    {
        titulo: monitoreoContinuo.label,
        href: monitoreoContinuo.href,
        items: (monitoreoContinuo.children ?? []).map((s) => ({ ...s, imagen: fotosContinuo[s.href] })),
        formato: "tarjetas",
    },
    {
        titulo: "Más servicios",
        items: sueltos.map((s) => ({ ...s, imagen: fotosSueltos[s.href] })),
        formato: "tarjetas",
    },
];

// Cursos se despliega igual que Servicios: los quince cursos del catálogo
// por técnica, en el mismo orden que la página /cursos (vibraciones,
// termografía, ultrasonido, confiabilidad y gestión); dentro de cada
// técnica, sus formatos: formación, taller y certificación. Los slugs son
// los publicados en producción; el catálogo vive en el CMS, pero el menú no
// puede esperar a una llamada.
const columnasCursos = menuCursos as ColumnaMenu[];

// En escritorio, Cursos se reparte como Servicios: mosaico con los nueve
// cursos de las tres técnicas (una fila por técnica: formación, taller y
// certificación), lista con confiabilidad y gestión, y tarjetas con el
// diplomado y el catálogo. El menú móvil sigue usando columnasCursos.
const [cursosVib, cursosTermo, cursosUltra, cursosConf] = columnasCursos;
const tecnicaCorta = (titulo: string) => titulo.split(" ")[0];
const formatoCorto = (label: string) =>
    label.startsWith("Formación") ? "Formación" : label.startsWith("Taller") ? "Taller" : label;
const fichasTecnicas = [cursosVib, cursosTermo, cursosUltra].flatMap((tecnica) =>
    tecnica.items
        .filter((i) => ["formacion", "taller", "certificado"].includes(i.icono ?? ""))
        .map((i) => ({ ...i, label: `${tecnicaCorta(tecnica.titulo)} · ${formatoCorto(i.label)}` })),
);
const diplomado = cursosConf.items.find((i) => i.href.includes("diplomado"));
// Confiabilidad y gestión en cuatro tarjetas con foto, como Programas. Los
// demás cursos (informes técnicos, fotovoltaicas) siguen en el catálogo.
const fotosConfiabilidad: Record<string, string> = {
    "/cursos/incremento-de-la-confiabilidad-monitoreo-de-condicion": "/images/cursos/confiabilidad/confiabilidad-05.webp",
    "/cursos/curso-de-mantenimiento-para-no-mantenedores": "/images/cursos/confiabilidad/confiabilidad-06.webp",
    "/cursos/alineamiento-balanceo-proactivo": "/images/servicios/alineacion-balanceo/campo-sensores-acople.webp",
    "/cursos/cursos-de-aprendizaje-practico-vibraciones-ultrasonido-termografia": "/images/cursos/confiabilidad/confiabilidad-10.webp",
};
const columnasCursosPanel: ColumnaMenu[] = [
    {
        titulo: "Vibraciones, termografía y ultrasonido",
        href: "/cursos#catalogo",
        items: fichasTecnicas,
        ancho: 2,
        formato: "mosaico",
    },
    {
        titulo: cursosConf.titulo,
        items: cursosConf.items
            .filter((i) => fotosConfiabilidad[i.href])
            .map((i) => ({ ...i, imagen: fotosConfiabilidad[i.href] })),
        formato: "tarjetas",
    },
    {
        titulo: "Programas",
        items: [
            ...(diplomado ? [{ ...diplomado, imagen: "/images/cursos/confiabilidad/confiabilidad-03.webp" }] : []),
            { label: "Clínicas técnicas", href: "/cursos/clinicas-tecnicas", descripcion: "Un tema puntual, en vivo y a bajo costo", imagen: "/images/cursos/clinicas/configuracion-de-la-camara-termografica.webp" },
            { label: "Capacitaciones y talleres", href: "/cursos#catalogo", descripcion: "Con certificado o práctica en planta", imagen: "/images/cursos/vibraciones/vibraciones-01.webp" },
        ],
        formato: "tarjetas",
    },
];

// Todo lo institucional cuelga de "Empresa" en vez de ocupar la tira principal.
const columnasEmpresa: ColumnaMenu[] = [
    {
        titulo: "Conócenos",
        items: [
            { label: "Acerca de Nosotros", href: "/acerca-de", descripcion: "Quiénes somos y desde cuándo", icono: "empresa" },
            { label: "Metodología", href: "/metodologia", descripcion: "Cómo llevamos un programa predictivo", icono: "metodologia" },
            { label: "Galería", href: "/acerca-de#galeria", descripcion: "Nuestra gente y nuestros equipos en campo", icono: "galeria" },
        ],
    },
    {
        titulo: "Recursos",
        items: [
            { label: "Blog", href: "/blog", descripcion: "Guías técnicas de mantenimiento predictivo", icono: "blog" },
            { label: "Webinar", href: "/webinar", descripcion: "Próxima sesión en línea, sin costo", icono: "camaras" },
            { label: "Folleto digital", href: "/folletodigital", descripcion: "Todos los servicios en un solo documento", icono: "folleto" },
            { label: "Contacto", href: "/contacto", descripcion: "Escríbenos o llámanos", icono: "contacto" },
        ],
    },
];
// El menú móvil sigue usando la lista plana.
const empresaLinks = columnasEmpresa.flatMap((c) => c.items);

export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-40 bg-black transition-all duration-300 ease-out ${isScrolled ? "shadow-lg border-b border-white/10" : "shadow shadow-black"
            } w-full`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between py-3 sm:py-4">
                    {/* Left Side: Logo + Desktop Navigation */}
                    <div className="flex items-center gap-6 xl:gap-10 min-w-0">
                        {/* Logo */}
                        <Link prefetch={false} href="/" className="flex items-center z-50 shrink-0">
                            <Logo />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-white whitespace-nowrap">
                            <MegaMenu trigger="Servicios" columnas={columnasServicios} />
                            <MegaMenu trigger="Cursos" columnas={columnasCursosPanel} />
                            <NavLink href="/productos">
                                Equipos
                            </NavLink>
                            <NavLink href="/casos-exito">
                                Casos de Éxito
                            </NavLink>
                            <MegaMenu trigger="Empresa" columnas={columnasEmpresa} />
                        </div>
                    </div>

                    {/* Right Side: Desktop CTA Button + Social Media + Mobile Menu Button */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Desktop CTA Button */}
                        <div className="hidden lg:block">
                            <Link prefetch={false} href="/contacto">
                                <Button variant="primary" ghost ghostVariant="auto">
                                    Cotizar
                                </Button>
                            </Link>
                        </div>

                        {/* Social Media Links - Hidden on mobile */}
                        <div className="hidden lg:flex flex-col gap-1">
                            <label className="text-white/70 text-[10px] uppercase tracking-wide font-medium">
                                Síguenos
                            </label>
                            <div className="flex items-center gap-2">
                                <a
                                    href="https://www.facebook.com/diapsa/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-white hover:bg-secondary flex items-center justify-center transition-all duration-200 rounded group"
                                    aria-label="Facebook"
                                >
                                    <svg
                                        className="w-4 h-4 text-black group-hover:text-white transition-colors"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/grupodiapsa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-white hover:bg-secondary flex items-center justify-center transition-all duration-200 rounded group"
                                    aria-label="LinkedIn"
                                >
                                    <svg
                                        className="w-4 h-4 text-black group-hover:text-white transition-colors"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden z-50 p-2 text-white hover:text-secondary transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menú móvil en acordeón (Emiliano, 2026-10-05): antes era una
                    lista plana con los 13 subservicios y los 15 cursos abiertos,
                    y había que deslizar varias pantallas para llegar a Empresa.
                    Ahora cada entrada principal se abre al tocarla, con sus
                    grupos también plegados, y el panel cabe en la pantalla con
                    su propio desplazamiento. Solo cambia en celular: en
                    escritorio sigue el panel ancho. */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 shadow-xl max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
                        <nav className="px-4 py-3" aria-label="Menú principal">
                            <Acordeon titulo="Servicios" href="/servicios/monitoreo-condicion" abierto>
                                {[monitoreoCondicion, monitoreoContinuo].map((grupo) => (
                                    <Acordeon key={grupo.href} titulo={grupo.label} href={grupo.href} nivel={2}>
                                        {(grupo.children ?? []).map((child) => (
                                            <EnlaceMovil key={child.href} href={child.href} nivel={3} onClick={() => setIsMobileMenuOpen(false)}>
                                                {child.label}
                                            </EnlaceMovil>
                                        ))}
                                    </Acordeon>
                                ))}
                                {sueltos.map((item) => (
                                    <EnlaceMovil key={item.href} href={item.href} nivel={2} onClick={() => setIsMobileMenuOpen(false)}>
                                        {item.label}
                                    </EnlaceMovil>
                                ))}
                            </Acordeon>

                            <Acordeon titulo="Cursos" href="/cursos">
                                {diplomado && (
                                    <EnlaceMovil href={diplomado.href} nivel={2} onClick={() => setIsMobileMenuOpen(false)}>
                                        {diplomado.label}
                                    </EnlaceMovil>
                                )}
                                <EnlaceMovil href="/cursos/clinicas-tecnicas" nivel={2} onClick={() => setIsMobileMenuOpen(false)}>
                                    Clínicas técnicas
                                </EnlaceMovil>
                                {columnasCursos.map((columna) => (
                                    <Acordeon key={columna.titulo} titulo={columna.titulo} nivel={2}>
                                        {columna.items
                                            .filter((item) => item.href !== diplomado?.href)
                                            .map((item) => (
                                                <EnlaceMovil key={item.href} href={item.href} nivel={3} onClick={() => setIsMobileMenuOpen(false)}>
                                                    {item.label}
                                                </EnlaceMovil>
                                            ))}
                                    </Acordeon>
                                ))}
                            </Acordeon>

                            <EnlaceMovil href="/productos" onClick={() => setIsMobileMenuOpen(false)}>
                                Equipos
                            </EnlaceMovil>
                            <EnlaceMovil href="/casos-exito" onClick={() => setIsMobileMenuOpen(false)}>
                                Casos de Éxito
                            </EnlaceMovil>

                            <Acordeon titulo="Empresa">
                                {empresaLinks.map((item) => (
                                    <EnlaceMovil key={item.href} href={item.href} nivel={2} onClick={() => setIsMobileMenuOpen(false)}>
                                        {item.label}
                                    </EnlaceMovil>
                                ))}
                            </Acordeon>

                            {/* Cotizar, siempre a la vista al final del panel */}
                            <div className="sticky bottom-0 -mx-4 mt-2 border-t border-white/10 bg-black px-4 py-3">
                                <Link prefetch={false} href="/contacto" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" ghost ghostVariant="auto">
                                        Cotizar
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </nav>
    );
};

/* Sangría por nivel del menú móvil. */
const SANGRIA = { 1: "pl-4", 2: "pl-8", 3: "pl-12" } as const;

/** Enlace del menú móvil: una fila tocable, con el tamaño según el nivel. */
function EnlaceMovil({ href, nivel = 1, onClick, children }: { href: string; nivel?: 1 | 2 | 3; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link prefetch={false}
            href={href}
            onClick={onClick}
            className={`block rounded-lg ${SANGRIA[nivel]} pr-4 ${nivel === 1 ? "py-3 text-base font-semibold text-white" : nivel === 2 ? "py-2.5 text-[15px] text-white/90" : "py-2 text-sm text-white/75"} transition-colors hover:bg-white/5 hover:text-secondary`}
        >
            {children}
        </Link>
    );
}

/**
 * Grupo plegable del menú móvil. La fila completa abre o cierra el grupo; si
 * el grupo tiene página propia, va como primer enlace dentro ("Ver todo"),
 * para que tocar el título no navegue por accidente.
 */
function Acordeon({ titulo, href, nivel = 1, abierto = false, children }: { titulo: string; href?: string; nivel?: 1 | 2; abierto?: boolean; children: React.ReactNode }) {
    const [open, setOpen] = useState(abierto);
    return (
        <div className={nivel === 1 ? "border-b border-white/10" : ""}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className={`flex w-full items-center justify-between rounded-lg ${SANGRIA[nivel]} pr-4 text-left transition-colors hover:bg-white/5 ${nivel === 1 ? "py-3 text-base font-semibold text-white" : "py-2.5 text-[15px] font-semibold text-white/90"}`}
            >
                {titulo}
                <svg className={`h-4 w-4 shrink-0 text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="pb-2">
                    {href && (
                        <Link prefetch={false} href={href} className={`block rounded-lg ${nivel === 1 ? "pl-8" : "pl-12"} pr-4 py-2 text-sm font-bold text-secondary hover:bg-white/5`}>
                            Ver todo
                        </Link>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
}
