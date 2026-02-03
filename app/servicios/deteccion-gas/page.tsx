import Button from "@/components/atoms/Button";
import PageHeader from "@/components/organisms/PageHeader";
import { VibrationIcon, VisibilityIcon, SecurityIcon, EcoIcon, PrecisionManufacturingIcon } from "@/components/atoms/icons";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Detección de Gas y Fugas Industriales | Grupo DIAPSA",
    description:
        "Servicios profesionales de detección de gas y fugas con tecnología acústica y óptica (OGI). Localización precisa de emisiones en plantas industriales. Seguridad garantizada 24/7 en México.",
    keywords: [
        "detección de gas industrial",
        "detección de fugas México",
        "tecnología OGI",
        "detección acústica de fugas",
        "termografía infrarroja gas",
        "seguridad industrial México",
        "monitoreo emisiones industriales",
        "detección ultrasónica fugas",
        "Optical Gas Imaging",
        "inspección fugas alta presión",
        "reducción emisiones CO2",
        "gestión de activos industriales",
    ],
    alternates: {
        canonical: "/servicios/deteccion-gas",
    },
    openGraph: {
        title: "Detección de Gas y Fugas con Tecnología Avanzada | DIAPSA",
        description:
            "Detección acústica y óptica (OGI) de última generación para localización precisa de emisiones y fugas. Seguridad industrial 24/7.",
        url: "/servicios/deteccion-gas",
        type: "website",
    },
};

const tecnologyCards = [
    {
        title: "Detección Acústica",
        description: "Visualización ultrasónica que permite identificar fugas mediante patrones de sonido inaudibles para el oído humano. Ideal para inspecciones a distancia en sistemas de alta presión.",
        little: "Precisión Sónica",
        icon: <VibrationIcon className="w-10 h-10" />
    },
    {
        title: "Detección Óptica (OGI)",
        description: "Tecnología infrarroja de última generación (Optical Gas Imaging) para visualizar nubes de gas invisibles en tiempo real, permitiendo una respuesta inmediata sin contacto.",
        little: "Visión Infrarroja",
        icon: <VisibilityIcon className="w-10 h-10" />
    }
];

const indicadores = [
    {
        name: "Seguridad",
        value: "100%",
        label: "Prioridad absoluta en entornos de alto riesgo.",
        icon: <SecurityIcon className="w-16 h-16" />
    },
    {
        name: "Sustentabilidad",
        value: <>CO<sub>2</sub></>,
        label: "Reducción drástica de huella de carbono.",
        icon: <EcoIcon className="w-16 h-16" />
    },
    {
        name: "Continuidad",
        value: "24/7",
        label: "Eliminación de tiempos muertos operativos.",
        icon: <PrecisionManufacturingIcon className="w-16 h-16" />
    }
]

export default function DeteccionGasPage() {
    return (
        <main>
            <PageHeader title="Deteccion de Gas" subtitle="" />

            <div className="bg-industrial-dark font-display overflow-x-hidden">
                {/* <!-- Technology Features Section --> */}
                <div className="py-24 px-6 max-w-300 mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl @[480px]:text-5xl font-extrabold  tracking-tighter mb-4">TECNOLOGÍAS DE VANGUARDIA</h2>
                        <div className="h-1.5 w-24 bg-accent-orange mx-auto rounded-full"></div>
                        <p className="dark:text-[#8db9ce] dark:font-normal text-secondary font-bold mt-6 text-lg max-w-175 mx-auto">
                            Implementamos los métodos más avanzados para la localización precisa de emisiones y fugas en entornos industriales críticos.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tecnologyCards.map((t) => (
                            <div key={t.title} className="flex flex-col gap-6 rounded-xl border dark:border-secondary/50 dark:bg-primary/10 bg-secondary/10 border-secondary p-8 hover:border-accent-orange/50 transition-colors group">
                                <div className="w-16 h-16 rounded-lg dark:bg-primary bg-secondary flex items-center justify-center text-accent-orange group-hover:scale-110 transition-transform">
                                    {t.icon}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-3xl font-black leading-tight">{t.title}</h3>
                                    <p className="dark:text-[#8db9ce] text-base leading-relaxed">
                                        {t.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-accent-orange font-bold text-sm uppercase mt-2">
                                        <span>{t.little}</span>
                                        <div className="h-px flex-1 bg-accent-orange/30"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* <!-- DIAPSA Strategy Section --> */}
                <div className="dark:bg-primary/20 py-16 border-y dark:border-primary/50 bg-secondary/10 border-secondary/50">
                    <div className="max-w-3000 px-6 mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                            <div className="max-w-150">
                                <h2 className="text-4xl font-black leading-tight tracking-tight uppercase">Estrategia DIAPSA</h2>
                                <p className="dark:text-[#8db9ce] mt-4 text-lg">Metodologías integrales diseñadas para la optimización de activos y mitigación de riesgos operativos.</p>
                            </div>
                            <div className="hidden md:block h-px flex-1 bg-secondary mx-8 mb-4"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* <!-- Asset Management Card --> */}
                            <div className="bg-industrial-dark border-l-4 dark:border-l-secondary border border-secondary/50 rounded-lg p-8 flex gap-6 items-start">
                                <div className="hidden sm:block w-32 h-32 shrink-0 bg-cover bg-center rounded-lg" data-alt="Icono de gestión de activos industriales" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuASzoPFm_d8UPTzczW9azlI5JrU_trzLzkYZrTgjO3aVXXeXn2KnJb5ewl6VI5mbglDkpDKnxwWPMIAJ8BdLYfD8LReQTK1omTh6yk08PXiotSNfpIg4GppnVDmKWSz2q72RzmGWHmccW7sicclJnVqtVrY9APCclynVqEFyg_0NMpqZP8fWqE0hgoInIA0BOH8akcwbNWeNokScmcWf6yoz0CRZpyWX3-PTHtSJDotsh2hyICSC8p-dFnijCiVsqMvndWF1goJL1o")' }}></div>
                                <div>
                                    <span className="text-accent-orange text-xs font-bold tracking-widest uppercase mb-2 block">Lifecycle Focus</span>
                                    <h4 className="text-xl font-bold mb-3">Gestión de Activos</h4>
                                    <p className="dark:text-[#8db9ce] text-sm leading-relaxed mb-4">Optimización del ciclo de vida de su infraestructura para maximizar la rentabilidad y reducir riesgos operativos críticos.</p>
                                    <p className="text-primary font-mono text-xs font-bold">ASSET_MANAGEMENT_ST_01</p>
                                </div>
                            </div>
                            {/* <!-- Condition Monitoring Card --> */}
                            <div className="bg-industrial-dark border-l-4 border-l-secondary border border-secondary/50 rounded-lg p-8 flex gap-6 items-start">
                                <div className="hidden sm:block w-32 h-32 shrink-0 bg-cover bg-center rounded-lg" data-alt="Monitoreo de equipos industriales en tiempo real" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMNALM8OuH1vy2TBGWz5SJqAIocoYWbbwXEppBQMjB-FyvyfBLumbtKjJmfnXNQVq3p_cqGWxsN_X9TNNFKVXq2qrcbrgGEa4vbbDpEOLna8tDjFpfouzje488V8r3MHd2sEfiNyyynyVoH_bk3tfJiG7_jmwVADRIOhDI6ZwPx32B9m590uAPwd6DVivt_s6YNPkTxduSGYSl0MZHeleeOhlfM3pOQa8iGIZscjc24UwZfy1E4yVMkxaSjHzZmbfDJMaXUtKIdFw")' }}></div>
                                <div>
                                    <span className="text-accent-orange text-xs font-bold tracking-widest uppercase mb-2 block">Real-time Data</span>
                                    <h4 className="text-xl font-bold mb-3">Monitoreo de Condición</h4>
                                    <p className="dark:text-[#8db9ce] text-sm leading-relaxed mb-4">Seguimiento constante de la salud de sus equipos para prevenir fallas catastróficas y paros no programados.</p>
                                    <p className="text-primary font-mono text-xs font-bold">CONDITION_MONITORING_RT_24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Impact Pillars Section --> */}
                <div className="py-16 px-6 max-w-300 mx-auto text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {indicadores.map((i) => (
                            <div key={i.name} className="flex flex-col items-center gap-4 p-8 rounded-2xl border dark:border-primary/50 dark:bg-primary/20 border-secondary/50 bg-secondary/10">
                                <div className="text-accent-orange mb-2">
                                    {i.icon}
                                </div>
                                <h3 className="text-4xl font-black leading-tight">{i.value}</h3>
                                <p className="text-lg font-bold  uppercase tracking-wider">{i.name}</p>
                                <p className="dark:text-[#8db9ce] text-sm italic">{i.label}</p>
                            </div>
                        ))}
                    </div>
                    {/* <div className="mt-20">
                        <div className="bg-primary p-12 rounded-xl border border-accent-orange/30 relative overflow-hidden">
                            <!-- Abstract Accent -->
                            <div className="absolute right-0 top-0 w-64 h-64 bg-accent-orange/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <h3 className="text-3xl font-black mb-6 relative z-10">¿Listo para asegurar su planta industrial?</h3>
                            <p className="text-[#8db9ce] max-w-150 mx-auto mb-10 relative z-10">Agende hoy mismo una demostración de nuestras tecnologías de detección acústica y óptica.</p>
                            <Button variant="secondary" className="bg-accent-orange hover:text-primary transition-all duration-300 px-12 py-5 rounded-lg font-black text-xl uppercase tracking-widest relative z-10">
                                Contáctenos Ahora
                            </Button>
                        </div>
                    </div> */}
                </div>

            </div>
        </main>
    )
}