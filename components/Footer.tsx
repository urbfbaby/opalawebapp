"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Envelope, MapPin } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-navy text-[#FAF8F5] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Summary */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo theme="light" showManagedBy={true} />
            <p className="text-sm text-[#FAF8F5]/70 max-w-sm leading-relaxed mt-4">
              Fully furnished one and two bedroom apartments at La Trobe Tower, Melbourne CBD. Ready to move in, close to universities, transport and city life.
            </p>
            <div className="pt-2 text-xs text-[#FAF8F5]/50">
              <p>Managed by Opala Group Pty Ltd</p>
              <p>ABN [00 000 000 000]</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#FDB92F] font-medium">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF8F5]/80">
              <li>
                <Link href="/apartments" className="hover:text-[#FAF8F5] transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-[#FAF8F5] transition-colors">
                  Location
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FAF8F5] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FAF8F5] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/for-education-agents"
                  className="hover:text-[#FAF8F5] transition-colors text-[#FAF8F5]/60 hover:text-[#FAF8F5]"
                >
                  For education agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Icons only in facilities & contact details as required) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#FDB92F] font-medium">
              Contact & Enquiries
            </h3>
            <div className="space-y-3 text-sm text-[#FAF8F5]/80">
              <div className="flex items-start gap-3">
                <MapPin size={18} weight="light" className="text-[#FAF8F5]/70 mt-0.5 flex-shrink-0" />
                <span>327 La Trobe Street, Melbourne CBD, Victoria</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} weight="light" className="text-[#FAF8F5]/70 flex-shrink-0" />
                <a
                  href="tel:+61478888769"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  0478 888 769 (+61 478 888 769)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Envelope size={18} weight="light" className="text-[#FAF8F5]/70 flex-shrink-0" />
                <a
                  href="mailto:admin@opala.com.au"
                  className="hover:text-[#FAF8F5] transition-colors"
                >
                  admin@opala.com.au
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Thin rule & Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/50">
          <div>
            <span>© 2026 Opala Group Pty Ltd. All rights reserved.</span>
          </div>

          <div className="text-[#FAF8F5]/40 text-center">
            <span>
              Website developed & maintained by{" "}
              <span className="text-[#FAF8F5]/75 font-medium">Aurora Digital</span>
            </span>
          </div>

          <div className="flex items-center gap-x-6">
            <Link href="/privacy" className="hover:text-[#FAF8F5] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FAF8F5] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
