import type { Metadata } from "next";
import { Phone, Envelope, MapPin, Chats } from "@phosphor-icons/react/dist/ssr";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact Opala Property | Melbourne CBD",
  description:
    "Tell us about the apartment you are looking for and we will get back to you. Furnished apartments in Melbourne CBD.",
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/61478888769?text=${encodeURIComponent(
    "Hello Opala Property, I would like to enquire about an apartment."
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <h1 className="font-serif text-4xl sm:text-5xl text-navy font-normal tracking-tight">
          Contact
        </h1>
        <p className="text-xl sm:text-2xl text-navy font-serif font-normal leading-relaxed">
          Tell us about the apartment you are looking for and we will get back to you.
        </p>
      </div>

      {/* Main Grid: Details (Left) + Contact Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Contact Details (Icons only in facilities & contact details as required) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white border border-opala-border p-6 sm:p-8 rounded-[2px] space-y-6">
            <h2 className="font-serif text-2xl text-navy font-normal pb-3 border-b border-opala-border">
              Opala Property
            </h2>

            <div className="space-y-4 text-sm text-opala-charcoal font-sans">
              <div className="flex items-start gap-3">
                <MapPin size={20} weight="light" className="text-navy mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-navy font-medium">Service Area</strong>
                  <span className="text-opala-muted">Melbourne CBD, Victoria</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={20} weight="light" className="text-navy mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-navy font-medium">Phone / WhatsApp</strong>
                  <a
                    href="tel:+61478888769"
                    className="text-opala-charcoal hover:text-navy underline transition-colors"
                  >
                    0478 888 769 (+61 478 888 769)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Envelope size={20} weight="light" className="text-navy mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-navy font-medium">Email</strong>
                  <a
                    href="mailto:admin@opala.com.au"
                    className="text-opala-charcoal hover:text-navy underline transition-colors"
                  >
                    admin@opala.com.au
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-opala-borderSubtle">
                <strong className="block text-navy font-medium">Business Hours</strong>
                <span className="text-opala-muted text-xs">Monday to Friday, 9:00 am – 5:30 pm AEST</span>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-4 border-t border-opala-border">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-navy text-[#FAF8F5] hover:bg-navy-surface transition-colors rounded-[2px]"
              >
                <Chats size={18} weight="light" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <EnquiryForm
            isGeneralContact={true}
            defaultHeading="Send us a message"
          />
        </div>
      </div>
    </div>
  );
}
