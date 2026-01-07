"use client";

import React, { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface ServiceAccordionProps {
  items: AccordionItem[];
}

const ServiceAccordion: React.FC<ServiceAccordionProps> = ({ items }) => {
  const [openItem, setOpenItem] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border-l-4 border-l-secondary overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-5 py-3.5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 text-left"
          >
            <h3 className="text-base lg:text-lg font-semibold text-primary pr-4">
              {item.title}
            </h3>
            <svg
              className={`w-5 h-5 text-secondary transition-transform duration-200 shrink-0 ${
                openItem === item.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openItem === item.id && (
            <div className="px-5 py-4 bg-white">
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                {item.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceAccordion;
