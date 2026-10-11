"use client";

import { useTransition } from "react";
import { deleteEnquiryAction } from "@/app/actions/admin-content";
import type { EnquiryRecord } from "@/lib/schemas";

interface EnquiriesListProps {
  enquiries: EnquiryRecord[];
}

export function EnquiriesList({ enquiries }: EnquiriesListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this enquiry record?")) {
      startTransition(async () => {
        await deleteEnquiryAction(id);
      });
    }
  };

  if (enquiries.length === 0) {
    return (
      <div className="bg-white border border-opala-border p-12 text-center rounded-[2px] space-y-3">
        <h3 className="font-serif text-2xl text-navy">
          No Enquiries Yet
        </h3>
        <p className="text-xs text-opala-muted font-sans max-w-sm mx-auto">
          When prospective tenants submit an enquiry on apartment detail pages or the contact form, their submissions will be listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enquiries.map((enq) => {
        const mailtoUrl = `mailto:${enq.email}?subject=${encodeURIComponent(
          `Opala Property - Regarding your enquiry about ${enq.apartmentCode || "Melbourne CBD apartments"}`
        )}`;

        const phoneClean = enq.phone?.replace(/[^0-9+]/g, "");
        const whatsappUrl = phoneClean
          ? `https://wa.me/${phoneClean.replace(/^0/, "61")}?text=${encodeURIComponent(
              `Hello ${enq.name}, thank you for your enquiry with Opala Property regarding ${enq.apartmentCode || "our apartments"}.`
            )}`
          : null;

        return (
          <div
            key={enq.id}
            className="bg-white border border-opala-border p-6 rounded-[2px] space-y-4 transition-all hover:border-navy/30"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-opala-borderSubtle">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg text-navy font-medium">
                    {enq.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 bg-navy/5 text-navy font-semibold rounded-[2px] uppercase">
                    {enq.apartmentCode ? `Unit ${enq.apartmentCode}` : "General Enquiry"}
                  </span>
                </div>
                <p className="text-xs text-opala-muted mt-0.5">
                  {enq.email} {enq.phone && `· ${enq.phone}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-opala-muted">
                  {new Date(enq.createdAt).toLocaleString("en-AU", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(enq.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Tenancy preferences */}
            {(enq.moveInDate || enq.stayLength || enq.billsPreference) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-opala-bg rounded-[2px] text-xs">
                {enq.moveInDate && (
                  <div>
                    <span className="text-opala-muted block text-[10px] uppercase font-medium">
                      Move-in Date
                    </span>
                    <span className="font-medium text-navy">{enq.moveInDate}</span>
                  </div>
                )}
                {enq.stayLength && (
                  <div>
                    <span className="text-opala-muted block text-[10px] uppercase font-medium">
                      Stay Length
                    </span>
                    <span className="font-medium text-navy">{enq.stayLength}</span>
                  </div>
                )}
                {enq.billsPreference && (
                  <div>
                    <span className="text-opala-muted block text-[10px] uppercase font-medium">
                      Bills Preference
                    </span>
                    <span className="font-medium text-navy capitalize">{enq.billsPreference}</span>
                  </div>
                )}
              </div>
            )}

            {/* Message Body */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-opala-muted block mb-1">
                Message:
              </span>
              <p className="text-sm text-opala-charcoal font-sans whitespace-pre-wrap bg-white p-3 border border-opala-borderSubtle rounded-[2px] leading-relaxed">
                {enq.message}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={mailtoUrl}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-navy text-[#FAF8F5] hover:bg-navy-surface transition-colors rounded-[2px]"
              >
                Reply via Email
              </a>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-emerald-600 text-emerald-800 hover:bg-emerald-50 transition-colors rounded-[2px]"
                >
                  Open WhatsApp
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
