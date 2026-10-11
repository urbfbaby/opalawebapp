"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/BrandLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/apartments", label: "Apartments" },
  { href: "/location", label: "Location" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-navy text-[#FAF8F5] border-b border-white/10 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandLogo theme="light" showManagedBy={true} />
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center space-x-8"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors py-1 ${
                    active
                      ? "text-[#FDB92F] font-medium"
                      : "text-[#FAF8F5]/80 hover:text-[#FAF8F5]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact?intent=enquire"
              className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
            >
              Enquire
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#FAF8F5]/90 hover:text-[#FAF8F5] focus:outline-none focus-visible:ring-1 focus-visible:ring-amber"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X size={20} weight="light" />
              ) : (
                <List size={20} weight="light" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-white/10 bg-[#070828] px-4 pt-4 pb-6 space-y-3"
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base rounded-[2px] transition-colors ${
                    active
                      ? "text-[#FDB92F] font-medium bg-white/5"
                      : "text-[#FAF8F5]/85 hover:text-[#FAF8F5] hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-xs text-[#FAF8F5]/60 px-3">
              <p>Melbourne CBD, Victoria</p>
              <p className="mt-1">0478 888 769 · admin@opala.com.au</p>
            </div>
            <div className="px-3">
              <Link
                href="/contact?intent=enquire"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
              >
                Enquire
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
