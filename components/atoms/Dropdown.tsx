"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface DropdownProps {
  trigger: string;
  items: DropdownItem[];
  className?: string;
}

export default function Dropdown({ trigger, items, className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:text-secondary transition-all duration-200 ease-out group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{trigger}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 hover:bg-secondary/5 transition-colors duration-150 ease-out group/item"
              >
                <div className="font-medium text-primary group-hover/item:text-secondary transition-colors duration-150">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-sm text-gray-600 mt-1 group-hover/item:text-gray-700 transition-colors duration-150">{item.description}</div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
