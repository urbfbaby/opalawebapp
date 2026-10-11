import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Opala Property",
  description: "Privacy Policy for Opala Property (Opala Group Pty Ltd).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-navy font-normal">
        Privacy Policy
      </h1>
      <p className="text-xs uppercase tracking-wider text-opala-muted font-sans">
        Opala Group Pty Ltd · Last updated October 2026
      </p>

      <div className="space-y-6 text-sm text-opala-charcoal font-sans leading-relaxed border-t border-opala-border pt-6">
        <p>
          Opala Group Pty Ltd (&quot;Opala Property&quot;, &quot;we&quot;, &quot;us&quot;) respects the privacy of prospective and current tenants. This Privacy Policy sets out how we collect, store, and handle your personal information in accordance with the Australian Privacy Principles (APPs) and the Privacy Act 1988 (Cth).
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">1. Information We Collect</h2>
        <p>
          When you submit an enquiry, contact us, or apply for an apartment, we may collect your name, email address, phone number, preferred move-in dates, length of stay, and rental preferences.
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">2. Use of Information</h2>
        <p>
          We use your information solely to respond to your rental enquiries, arrange property viewings, process tenancy documentation, and communicate regarding services in Melbourne CBD.
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">3. Disclosure of Information</h2>
        <p>
          We do not sell, rent, or trade your personal information. Information is only shared with third-party service providers (such as email delivery or residential utility providers) strictly necessary to administer your tenancy.
        </p>

        <h2 className="font-serif text-xl text-navy pt-4">4. Contact Us</h2>
        <p>
          If you have questions about your personal data, please contact Opala Group Pty Ltd at{" "}
          <a href="mailto:admin@opala.com.au" className="text-navy underline">
            admin@opala.com.au
          </a>.
        </p>
      </div>
    </div>
  );
}
