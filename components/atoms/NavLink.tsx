import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "footer" | "inline";
  className?: string;
}

export default function NavLink({
  href,
  children,
  variant = "default",
  className = "",
}: NavLinkProps) {
  // El padding vertical existe por accesibilidad, no por estética: sin él las
  // entradas del menú medían 24px de alto y los enlaces del pie 16px, muy por
  // debajo del objetivo táctil de 44px. El subrayado animado se reposiciona
  // para seguir cayendo justo bajo el texto, no bajo la caja con padding.
  const variantStyles = {
    default: "relative inline-flex items-center py-2.5 hover:text-secondary transition-all duration-300 ease-out font-medium after:content-[''] after:absolute after:left-0 after:bottom-1.5 after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-300 after:ease-out hover:after:w-full",
    footer: "inline-block py-1.5 text-white/80 hover:text-secondary transition-all duration-200 ease-out text-sm font-medium",
    inline: "text-primary hover:underline font-medium transition-colors duration-200 ease-out",
  };

  const baseClass = variantStyles[variant];

  return (
    <Link href={href} className={`${baseClass} ${className}`}>
      {children}
    </Link>
  );
}
