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
  const variantStyles = {
    default: "relative hover:text-secondary transition-all duration-300 ease-out font-medium after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-secondary after:transition-all after:duration-300 after:ease-out hover:after:w-full",
    footer: "text-white/80 hover:text-secondary transition-all duration-200 ease-out text-sm font-medium",
    inline: "text-primary hover:underline font-medium transition-colors duration-200 ease-out",
  };

  const baseClass = variantStyles[variant];

  return (
    <Link href={href} className={`${baseClass} ${className}`}>
      {children}
    </Link>
  );
}
