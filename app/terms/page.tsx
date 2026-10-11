import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Opala Property",
  description: "Terms and Conditions for Opala Property (Opala Group Pty Ltd).",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-navy font-normal">
        Terms and Conditions
      </h1>
      <p className="text-xs uppercase tracking-wider text-opala-muted font-sans">
        Opala Group Pty Ltd · Last updated October 2026
      </p>

      <div className="space-y-6 text-sm text-opala-charcoal font-sans leading-relaxed border-t border-opala-border pt-6">
        <p>
          Welcome to Opala Property. These terms and conditions govern your use of this website operated by Opala Group Pty Ltd.
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">1. Rental Rates & Availability</h2>
        <p>
          All rental rates advertised on this website are guide prices, quoted in Australian Dollars (AUD), and are reviewed quarterly. Availability is subject to confirmation by Opala Property and execution of a formal tenancy agreement under the Residential Tenancies Act 1997 (Victoria).
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">2. Apartment Features & Representative Photography</h2>
        <p>
          While we take every effort to ensure accuracy of floor levels, layouts, and inclusions, photos and floorplans may illustrate similar units within La Trobe Tower. Detailed apartment specifications are confirmed prior to signing.
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">3. Consumer Affairs Victoria</h2>
        <p>
          All residential rental agreements managed by Opala Group Pty Ltd comply with applicable Victorian tenancy laws and standards overseen by Consumer Affairs Victoria.
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">4. Inquiries</h2>
        <p>
          For questions regarding tenancy terms, please contact{" "}
          <a href="mailto:admin@opala.com.au" className="text-navy underline">
            admin@opala.com.au
          </a>.
        </p>
      </div>
    </div>
  );
}
