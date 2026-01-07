"use client";

import clsx from "clsx";

export type TabItem = {
  id: string;
  label: string;
};

export type SectionTabsProps = {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  className?: string;
};

export default function SectionTabs({
  tabs,
  activeTabId,
  onTabChange,
  className,
}: SectionTabsProps) {
  if (!tabs?.length) return null;

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-8 bg-black p-4",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (!isActive) onTabChange(tab.id);
            }}
            className={clsx(
              "flex items-center justify-center px-8 py-4 text-sm md:text-base font-semibold uppercase tracking-[0.08em] transition-colors duration-200 select-none",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              isActive
                ? "bg-[#ffb000] text-black cursor-default focus-visible:outline-[#ffb000]"
                : "bg-[#0a3a4a] text-white cursor-pointer hover:bg-[#0f4d60] focus-visible:outline-[#7fd3ff]"
            )}
            aria-current={isActive ? "page" : undefined}
            aria-pressed={isActive}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Ejemplo de uso:
 *
 * <SectionTabs
 *   tabs={[
 *     { id: "diagnostico", label: "Diagnóstico" },
 *     { id: "plan", label: "Plan de acción" },
 *     { id: "seguimiento", label: "Seguimiento" },
 *   ]}
 *   activeTabId={activeTab}
 *   onTabChange={setActiveTab}
 * />
 */
