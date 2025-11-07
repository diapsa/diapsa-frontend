"use client";

import { useEffect, useState } from "react";
import NavBar from "../molecules/navbar/NavBar";
import TopBar from "../molecules/navbar/TopBar";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Consideramos que hay scroll después de 50px
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* TopBar - se oculta cuando hay scroll */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isScrolled ? '-translate-y-full' : 'translate-y-0'}`}>
                <TopBar />
            </div>
            
            {/* NavBar - se mantiene fijo y sube cuando el TopBar desaparece */}
            <div className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'top-0' : 'top-11'}`}>
                <NavBar />
            </div>
        </>
    )
}