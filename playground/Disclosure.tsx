"use client";

import { useState, ReactNode } from "react";

type DisclosureProps = {
  summary: string;
  children: ReactNode;
  id: string;
};

export function Disclosure({ summary, children, id }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `disclosure-panel-${id}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded border px-3 py-2 text-left"
      >
        <span>{summary}</span>
        <span aria-hidden="true">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div id={panelId} className="p-3 text-sm text-slate-600">
          {children}
        </div>
      )}
    </div>
  );
}