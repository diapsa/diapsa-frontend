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


    const prodcutosItem = [
        {
            label: "Cámaras",
            href: "/camaras",
        },
    ];
    const serviciosItems = [

        {
            label: "Conoce IDAP",
            href: "/servicios-productos/termografia-infrarroja",
        },
        {
            label: "Monitoreo de condicion",
            href: "/servicios-productos/monitoreo-condicion",
        },

        {
            label: "Detecciones de Gas",
            href: "/servicios-productos/vibraciones-mecanicas",
        },

        // {
        //     label: "Diagnóstico de Maquinaria",
        //     href: "/servicios-productos/diagnostico-de-maquinaria",
        // },
        // {
        //     label: "Análisis de Ultrasonido",
        //     href: "/servicios-productos/analisis-de-ultrasonido",
        // },
        // {
        //     label: "Estudios Eléctricos",
        //     href: "/servicios-productos/estudios-electricos",
        // }
    ];

    return (
        <nav className={`sticky top-0 z-40 bg-black transition-all duration-300 ease-out ${isScrolled ? "shadow-lg border-b border-white/10" : "shadow shadow-black"
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
                                trigger="Servicios"
                                items={serviciosItems}
                            />
                            <Dropdown
                                trigger="Productos"
                                items={prodcutosItem}
                            />
                            <NavLink href="/metodologia">
                                Metodología
                            </NavLink>
                            <NavLink href="/cursos">
                                Cursos
                            </NavLink>
                        </div>
                    </div>

                    {/* Right Side: Desktop CTA Button + Social Media + Mobile Menu Button */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Desktop CTA Button */}
                        <div className="hidden lg:block">
                            <Link href="/#contacto">
                                <Button variant="primary" ghost ghostVariant="auto">
                                    Contactanos
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
                                    className="w-6 h-6 bg-white hover:bg-secondary flex items-center justify-center transition-all duration-200 rounded group"
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
                                    className="w-6 h-6 bg-white hover:bg-secondary flex items-center justify-center transition-all duration-200 rounded group"
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
                                {/* <a
                                    href="https://x.com/DIAPSA1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-6 h-6 bg-white hover:bg-secondary flex items-center justify-center transition-all duration-200 rounded group"
                                    aria-label="Twitter"
                                >
                                    <svg
                                        className="w-4 h-4 text-black group-hover:text-white transition-colors"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a> */}
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
                                    Servicios
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
                            {/* Mobile Products Section */}
                            <div className="py-2">
                                <p className="text-white/60 text-xs uppercase font-semibold px-4 mb-2">
                                    Productos
                                </p>
                                {prodcutosItem.map((item, index) => (
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