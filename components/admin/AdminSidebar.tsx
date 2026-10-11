"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Buildings,
  CurrencyDollar,
  Sliders,
  Tray,
  Gear,
  SignOut,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { logoutAdminAction } from "@/app/actions/admin-auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: House },
  { href: "/admin/apartments", label: "Apartments", icon: Buildings },
  { href: "/admin/rates", label: "Rates & Unit Types", icon: CurrencyDollar },
  { href: "/admin/flags", label: "Feature Flags", icon: Sliders },
  { href: "/admin/enquiries", label: "Enquiries Inbox", icon: Tray },
  { href: "/admin/settings", label: "Site Settings", icon: Gear },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-navy text-[#FAF8F5] flex flex-col min-h-screen border-r border-white/10 flex-shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-xl uppercase tracking-wider text-[#FAF8F5]">
            Opala
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase text-amber">
            Admin
          </span>
        </div>
        <p className="text-[10px] text-[#FAF8F5]/50 tracking-wider uppercase">
          Opala Group Pty Ltd
        </p>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1.5" aria-label="Admin Navigation">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide rounded-[2px] transition-colors ${
                active
                  ? "bg-white/10 text-amber font-medium"
                  : "text-[#FAF8F5]/80 hover:text-[#FAF8F5] hover:bg-white/5"
              }`}
            >
              <IconComponent size={19} weight="light" className="flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Utility Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs text-[#FAF8F5]/70 hover:text-[#FAF8F5] hover:bg-white/5 rounded-[2px] transition-colors"
        >
          <span>View Public Website</span>
          <ArrowSquareOut size={16} weight="light" />
        </a>

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 rounded-[2px] transition-colors text-left"
          >
            <SignOut size={19} weight="light" />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
