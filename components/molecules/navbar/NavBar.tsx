"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import NavLink from "@/components/atoms/NavLink";
import Dropdown from "@/components/atoms/Dropdown";
import Link from "next/link";

export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const serviciosItems = [
        {
            label: "Análisis Predictivo",
            href: "/servicios-productos#analisis",
        },
        {
            label: "Monitoreo de Condición",
            href: "/servicios-productos#monitoreo",
        },
        {
            label: "Consultoría Especializada",
            href: "/servicios-productos#consultoria",
        },
        {
            label: "Ver todos los servicios",
            href: "/servicios-productos",
        },
    ];

    return (
        <nav className={`sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-black transition-all duration-300 ease-out ${
            isScrolled ? "shadow-lg border-b border-white/10" : "shadow shadow-black"
        } w-full`}>
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center justify-between space-x-16">
                    <Link href="/" className="flex items-center">
                        <Logo />
                    </Link>
                    <div className="flex items-center space-x-8 text-white">
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
                <div className="flex items-center">
                    <Link href="/#contacto">
                        <Button variant="primary" ghost ghostVariant="auto">
                            Contactanos
                        </Button>
                    </Link>
                </div>

            </div>
        </nav>
    )
};