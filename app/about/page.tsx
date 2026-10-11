import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Opala Property | Melbourne Apartment Provider",
  description:
    "Opala is a Melbourne property service provider offering comfortable, furnished apartments in Melbourne CBD.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <h1 className="font-serif text-4xl sm:text-5xl text-navy font-normal tracking-tight">
          About Opala
        </h1>
        <p className="text-xl sm:text-2xl text-navy font-serif font-normal leading-relaxed pt-2">
          Opala is a Melbourne property service provider offering comfortable, furnished apartments.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="max-w-3xl space-y-6 text-base text-opala-charcoal font-sans leading-relaxed">
        <p>
          Opala Group Pty Ltd provides well-kept, fully furnished apartments in Melbourne CBD. We believe the place you come home to should be clean, comfortable and simple to live in, with clear pricing and a team that answers when you need us.
        </p>
        <p>
          Our apartments are prepared and managed by our team, from furnishing through to day-to-day care, so you can focus on study, work or settling into the city.
        </p>
      </div>

      {/* Three principles (strictly numbered, no icons as required) */}
      <div className="pt-12 border-t border-opala-border">
        <h2 className="text-xs uppercase tracking-widest text-opala-muted font-medium mb-8">
          Our Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-opala-border p-6 sm:p-8 rounded-[2px] space-y-3">
            <span className="font-serif text-2xl text-navy/40 font-normal block">
              01
            </span>
            <h3 className="font-serif text-xl text-navy font-normal">
              Furnished and ready to move in.
            </h3>
            <p className="text-xs text-opala-muted font-sans leading-relaxed">
              Every home comes complete with furniture, kitchen essentials, laundry appliances, and climate control.
            </p>
          </div>

          <div className="bg-white border border-opala-border p-6 sm:p-8 rounded-[2px] space-y-3">
            <span className="font-serif text-2xl text-navy/40 font-normal block">
              02
            </span>
            <h3 className="font-serif text-xl text-navy font-normal">
              Clear pricing, with or without bills.
            </h3>
            <p className="text-xs text-opala-muted font-sans leading-relaxed">
              Transparent weekly rates reviewed quarterly, with options for unified bills covering power, water, gas, and internet.
            </p>
          </div>

          <div className="bg-white border border-opala-border p-6 sm:p-8 rounded-[2px] space-y-3">
            <span className="font-serif text-2xl text-navy/40 font-normal block">
              03
            </span>
            <h3 className="font-serif text-xl text-navy font-normal">
              A real team, close by.
            </h3>
            <p className="text-xs text-opala-muted font-sans leading-relaxed">
              Managed directly by Opala Group in Melbourne CBD, providing responsive local care when you have questions.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-12 border-t border-opala-border flex flex-wrap items-center gap-4">
        <Link
          href="/apartments"
          className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
        >
          View apartments →
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider border border-navy text-navy hover:bg-navy hover:text-[#FAF8F5] transition-colors rounded-[2px]"
        >
          Contact our team
        </Link>
      </div>
    </div>
  );
}
