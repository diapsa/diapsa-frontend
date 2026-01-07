import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  link: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, variant = "dark" }) => {
  const textColor = variant === "light" ? "text-gray-600" : "text-primary";
  const linkColor = variant === "light" 
    ? "text-gray-700 hover:text-secondary" 
    : "text-primary hover:text-secondary";
  const separatorColor = variant === "light" ? "text-gray-400" : "text-tertiary";

  return (
    <nav className="py-4 px-4 lg:px-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm lg:text-base">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className={`mx-2 ${separatorColor}`}>/</span>
            )}
            {index === items.length - 1 ? (
              <span className={`${textColor} font-medium`}>{item.label}</span>
            ) : (
              <Link
                href={item.link}
                className={`${linkColor} transition-colors duration-200 font-medium`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
