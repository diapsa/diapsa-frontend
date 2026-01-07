"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import NavLink from "@/components/atoms/NavLink";
import Dropdown from "@/components/atoms/Dropdown";
import Link from "next/link";

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

    const serviciosItems = [
        {
            label: "Cámaras",
            href: "/camaras",
        },
        {
            label: "Termografía Infrarroja",
            href: "/servicios-productos/termografia-infrarroja",
        },
        {
            label: "Vibraciones Mecánicas",
            href: "/servicios-productos/vibraciones-mecanicas",
        },
        {
            label: "Diagnóstico de Maquinaria",
            href: "/servicios-productos/diagnostico-de-maquinaria",
        },
        {
            label: "Análisis de Ultrasonido",
            href: "/servicios-productos/analisis-de-ultrasonido",
        },
        {
            label: "Estudios Eléctricos",
            href: "/servicios-productos/estudios-electricos",
        }
    ];

    return (
        <nav className={`sticky top-0 z-40 bg-black transition-all duration-300 ease-out ${
            isScrolled ? "shadow-lg border-b border-white/10" : "shadow shadow-black"
        } w-full`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between py-3 sm:py-4">
                    {/* Left Side: Logo + Desktop Navigation */}
                    <div className="flex items-center space-x-12">
                        {/* Logo */}
                        <Link href="/" className="flex items-center z-50">
                            <Logo />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8 text-white">
                            <NavLink href="/acerca-de">
                                Acerca de
                            </NavLink>
                            <Dropdown 
                                trigger="Servicios y Productos" 
                                items={serviciosItems}
                            />
                            <NavLink href="/metodologia">
                                Metodología
                            </NavLink>
                            <NavLink href="/cursos">
                                Cursos
                            </NavLink>
                        </div>
                    </div>

                    {/* Right Side: Desktop CTA Button + Mobile Menu Button */}
                    <div className="flex items-center">
                        {/* Desktop CTA Button */}
                        <div className="hidden lg:block">
                            <Link href="/#contacto">
                                <Button variant="primary" ghost ghostVariant="auto">
                                    Contactanos
                                </Button>
                            </Link>
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

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 shadow-xl">
                        <div className="flex flex-col space-y-1 px-4 py-4">
                            <Link
                                href="/acerca-de"
                                className="text-white hover:text-secondary transition-colors py-3 px-4 rounded-lg hover:bg-white/5"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Acerca de
                            </Link>
                            
                            {/* Mobile Services Section */}
                            <div className="py-2">
                                <p className="text-white/60 text-xs uppercase font-semibold px-4 mb-2">
                                    Servicios y Productos
                                </p>
                                {serviciosItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="text-white hover:text-secondary transition-colors py-2.5 px-6 block rounded-lg hover:bg-white/5"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href="/metodologia"
                                className="text-white hover:text-secondary transition-colors py-3 px-4 rounded-lg hover:bg-white/5"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Metodología
                            </Link>
                            
                            <Link
                                href="/cursos"
                                className="text-white hover:text-secondary transition-colors py-3 px-4 rounded-lg hover:bg-white/5"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Cursos
                            </Link>

                            {/* Mobile CTA */}
                            <div className="pt-4 pb-2 px-4">
                                <Link href="/#contacto" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" ghost ghostVariant="auto">
                                        Contactanos
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};