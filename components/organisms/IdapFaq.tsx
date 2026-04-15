"use client";

import { useState } from "react";
import { questions } from "@/data/idap.json";

export default function IdapFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative bg-black py-20 lg:py-32 overflow-hidden">
            {/* Líneas decorativas */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />

            <div className="relative max-w-5xl mx-auto px-6 lg:px-12 space-y-12">

                {/* Encabezado */}
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5">
                        <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                            Preguntas frecuentes
                        </span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Lo que necesitas saber{" "}
                        <span className="text-secondary italic">sobre IDAP</span>
                    </h2>
                </div>

                {/* Acordeón */}
                <div className="space-y-3">
                    {questions.map((q, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <div
                                key={q.title}
                                className={`border rounded-2xl transition-all duration-300 ${isOpen
                                    ? "border-secondary/50 bg-secondary/5"
                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                                    aria-expanded={isOpen}
                                >
                                    <span className={`text-base lg:text-lg font-bold uppercase tracking-wide transition-colors duration-200 ${isOpen ? "text-secondary" : "text-white"}`}>
                                        {q.title}
                                    </span>
                                    <span
                                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${isOpen
                                            ? "border-secondary bg-secondary/20 rotate-45"
                                            : "border-white/20 bg-white/5"
                                            }`}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-current">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                        </svg>
                                    </span>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    <p className="px-6 pb-6 text-gray-300 leading-relaxed text-base lg:text-lg">
                                        {q.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
