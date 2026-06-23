"use client";

import Link from "next/link";
import { useState } from "react";

const menus = [
  { href: "/dashboard", label: "Ерөнхий самбар", icon: "D" },
  { href: "/inspection", label: "Хяналт шалгалтын төв", icon: "I" },
  { href: "/compliance", label: "Хууль, журмын нийцлийн төв", icon: "C" },
  { href: "/research", label: "Судалгаа, хөгжлийн төв", icon: "R" },
  { href: "/reports", label: "Тайлан, шинжилгээ", icon: "RP" },
  { href: "/voice", label: "Ажилтны дуу хоолой", icon: "V" },
  { href: "/ai", label: "AI туслах төв", icon: "AI" },
  { href: "/settings", label: "Тохиргоо", icon: "S" },
  { label: "Удирдлагын төв", href: "/admin/users", icon: "A"},
];

type Props = {
  open: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
};

export default function Sidebar({
  open,
  mobileOpen,
  onToggle,
  onCloseMobile,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const expanded = mobileOpen || open || hovered;
  const desktopWidth = open ? "md:w-72" : "md:w-20";

  return (
    <>
      {mobileOpen && (
        <button
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside className={`hidden shrink-0 md:block ${desktopWidth}`} />

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          fixed left-0 top-0 z-40 h-screen bg-slate-950 text-white transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${expanded ? "w-72" : "w-20"}
        `}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div>
            <h1 className="text-xl font-bold">{expanded ? "INSPECT.MN" : "IN"}</h1>
            {expanded && (
              <p className="mt-1 text-xs text-slate-400">Smart Control System</p>
            )}
          </div>

          <button
            onClick={onToggle}
            className="hidden rounded-lg bg-slate-800 px-2 py-1 text-sm md:block"
          >
            {open ? "‹" : "›"}
          </button>

          <button
            onClick={onCloseMobile}
            className="rounded-lg bg-slate-800 px-2 py-1 text-sm md:hidden"
          >
            ×
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={onCloseMobile}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-slate-800"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold">
                {menu.icon}
              </span>

              {expanded && <span className="whitespace-nowrap">{menu.label}</span>}

            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}