import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-black shadow shadow-black w-full">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center justify-between space-x-16">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="flex space-x-6 uppercase">
                        <Link href="/acerca-de" className="hover:text-secondary transition-colors">
                            Acerca de
                        </Link>
                        <Link href="/servicios-productos" className="hover:text-secondary transition-colors">
                            Servicios
                        </Link>
                        <Link href="/metodologia" className="hover:text-secondary transition-colors">
                            Metodología
                        </Link>
                        <Link href="/cursos" className="hover:text-secondary transition-colors">
                            Cursos
                        </Link>
                    </div>
                </div>
                <div className="flex items-center">
                    <Link href="/#contacto">
                        <Button variant="primary">
                            Contacto
                        </Button>
                    </Link>
                </div>

            </div>
        </nav>
    )
};