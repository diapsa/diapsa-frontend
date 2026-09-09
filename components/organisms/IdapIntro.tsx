"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import idapdata from "@/data/idap.json";

export default function IdapIntro() {
    const [activeTab, setActiveTab] = useState<string | null>(idapdata.tabs[0]?.id ?? null);
    const content = idapdata.homeIntro;

    return (
        <section className="w-full bg-primary text-white" aria-labelledby="idap-intro-title">
            <div className="relative overflow-hidden border-b border-white/10">
                <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 text-center">
                    <div className="relative mx-auto mb-6 h-20 w-56 sm:h-24 sm:w-72">
                        <Image
                            fill
                            src="/images/idap/idap-logo.png"
                            alt="IDAP"
                            className="object-contain"
                            sizes="(max-width: 640px) 224px, 288px"
                        />
                    </div>
                    <h2
                        id="idap-intro-title"
                        className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight text-white lg:text-4xl"
                    >
                        {content.title} <span className="text-secondary">{content.titleHighlight}</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 lg:text-lg">
                        {content.description}
                    </p>
                </div>
            </div>

            <div className="relative py-16 lg:py-20">
                {/* <div className="absolute top-1/4 left-1/3 w-150 h-150 bg-secondary/8 rounded-full blur-3xl pointer-events-none" /> */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
                    <div className="relative order-2 lg:order-1">
                        <div className="relative h-72 w-full sm:h-96 lg:h-112">
                            <Image
                                fill
                                src="/images/idap/mockup.png"
                                alt="Panel de monitoreo predictivo de IDAP"
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    <div className="relative order-1 lg:order-2">
                        {/* H3 = 24px. Antes iba a 36px, idéntico a los H2 de la
                            página: los niveles no se distinguían entre sí. */}
                        <h3 className="text-xl font-extrabold leading-tight text-white lg:text-2xl">
                            {content.aboutTitle} <span className="text-secondary">{content.aboutTitleHighlight}</span>
                        </h3>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 lg:text-lg">
                            {content.aboutDescription}
                        </p>

                        <div className="mt-8 space-y-3">
                            {idapdata.tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const panelId = `idap-panel-${tab.id}`;
                                const triggerId = `idap-trigger-${tab.id}`;

                                return (
                                    <div
                                        key={tab.id}
                                        className={`overflow-hidden rounded-sm border transition-all duration-300 motion-reduce:transition-none ${isActive
                                            ? "bg-white/10 border-secondary/50 shadow-xl"
                                            : "bg-white/5 border-white/15 hover:border-secondary/50"
                                            }`}
                                    >
                                        <h4>
                                            <button
                                                id={triggerId}
                                                type="button"
                                                aria-expanded={isActive}
                                                aria-controls={panelId}
                                                onClick={() => setActiveTab(isActive ? null : tab.id)}
                                                className="flex w-full items-center gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-secondary"
                                            >
                                                <span className="flex-1 text-sm font-bold leading-snug text-white sm:text-base">
                                                    {tab.title}
                                                </span>
                                                <svg
                                                    className={`h-5 w-5 shrink-0 text-white/80 transition-transform duration-300 motion-reduce:transition-none ${isActive ? "rotate-180" : ""
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </h4>
                                        <div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={triggerId}
                                            aria-hidden={!isActive}
                                            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-white/80">
                                                    {tab.text.map((paragraph, paragraphIndex) => (
                                                        <p key={paragraphIndex}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                    <div className="max-w-2xl">
                        <h3 className="text-xl font-bold leading-snug text-white lg:text-2xl">
                            {content.informationTitle} <span className="text-secondary">{content.informationTitleHighlight}</span>
                        </h3>
                        <p className="mt-4 text-base leading-relaxed text-white/80 lg:text-lg">
                            {content.informationDescription}
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {idapdata.questions.map((question) => (
                            <article
                                key={question.title}
                                className="rounded-sm border border-white/15 bg-white/10 p-6 shadow-sm transition-all duration-300 hover:border-secondary/50 hover:shadow-xl motion-reduce:transition-none"
                            >
                                <div className="border-l-2 border-secondary pl-4">
                                    <h4 className="text-lg font-bold text-white">{question.title}</h4>
                                    <p className="mt-2 text-sm leading-relaxed text-white/80">{question.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-y border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center lg:px-12">
                    <div>
                        <p className="text-xl font-bold text-white sm:text-2xl">
                            {content.ctaTitle}
                        </p>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">{content.ctaDescription}</p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Link
                            href="/servicios/idap"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xs bg-secondary px-8 py-3 font-bold text-primary shadow-md transition-all duration-300 hover:bg-white hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
                        >
                            Conocer IDAP
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link
                            href="#contacto"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xs border border-white/30 px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-white hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
                        >
                            Contactar especialista
                        </Link>
                    </div>
                </div>
            </div>

            <div className="relative isolate overflow-hidden px-6 py-12 lg:py-16">
                <Image
                    src="/images/factory-image.avif"
                    fill
                    className="-z-20 object-cover"
                    alt="Planta industrial monitoreada con IDAP"
                    sizes="100vw"
                />
                <div className="absolute inset-0 -z-10 bg-primary/75" />
                <div className="mx-auto max-w-4xl text-center">
                    <p className="text-xl font-semibold leading-relaxed text-white sm:text-2xl lg:text-3xl">
                        {content.closingStatement}
                    </p>
                </div>
            </div>
        </section>
    );
}
