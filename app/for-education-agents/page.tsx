import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Education Agents | Opala Property",
  description:
    "Information for education agents working with students heading to Melbourne CBD.",
};

export default function ForEducationAgentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto bg-white border border-opala-border p-8 sm:p-12 rounded-[2px] space-y-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy font-normal">
          For education agents
        </h1>

        <p className="text-base text-opala-charcoal font-sans leading-relaxed">
          If you work with students heading to Melbourne and would like to talk about accommodation, please get in touch.
        </p>

        <div className="pt-4 border-t border-opala-border space-y-3 text-sm text-opala-charcoal font-sans">
          <p>
            <strong className="text-navy font-medium">Email:</strong>{" "}
            <a
              href="mailto:admin@opala.com.au"
              className="text-navy underline hover:text-amber-hover transition-colors"
            >
              admin@opala.com.au
            </a>
          </p>
          <p>
            <strong className="text-navy font-medium">Phone / WhatsApp:</strong>{" "}
            <a
              href="tel:+61478888769"
              className="text-navy underline hover:text-amber-hover transition-colors"
            >
              0478 888 769 (+61 478 888 769)
            </a>
          </p>
        </div>

        <div className="pt-6 border-t border-opala-border flex items-center justify-between">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
          >
            Contact us directly
          </Link>
          <Link
            href="/apartments"
            className="text-xs uppercase tracking-wider text-navy hover:underline"
          >
            Browse catalogue →
          </Link>
        </div>
      </div>
    </div>
  );
}
