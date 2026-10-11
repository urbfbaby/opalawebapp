"use client";

import { useActionState } from "react";
import { updateSiteSettingsAction } from "@/app/actions/admin-content";
import type { Site } from "@/lib/schemas";

interface SiteSettingsFormProps {
  site: Site;
}

export function SiteSettingsForm({ site }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (
      prevState: { success?: boolean; message?: string } | null,
      formData: FormData
    ) => {
      return await updateSiteSettingsAction(formData);
    },
    null
  );

  return (
    <form action={formAction} className="bg-white border border-opala-border p-6 sm:p-8 rounded-[2px] space-y-6">
      {state?.message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[2px] text-xs">
          {state.message}
        </div>
      )}

      {/* Legal & Entity */}
      <div className="space-y-4 pb-6 border-b border-opala-border">
        <h3 className="font-serif text-lg text-navy">
          Entity & Compliance Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
              Legal Company Name
            </label>
            <input
              type="text"
              value={site.legalName}
              disabled
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-muted cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="abn" className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
              Australian Business Number (ABN)
            </label>
            <input
              type="text"
              id="abn"
              name="abn"
              defaultValue={site.abn}
              required
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
            />
            <p className="text-[11px] text-opala-muted mt-1">Displayed in the footer and legal notices.</p>
          </div>
        </div>
      </div>

      {/* Contact Channels */}
      <div className="space-y-4 pb-6 border-b border-opala-border">
        <h3 className="font-serif text-lg text-navy">
          Direct Contact Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
              Australian Local Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue={site.phone}
              required
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <label htmlFor="phoneInternational" className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
              International Phone Format
            </label>
            <input
              type="text"
              id="phoneInternational"
              name="phoneInternational"
              defaultValue={site.phoneInternational}
              required
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
              Enquiries & Admin Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={site.email}
              required
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <label htmlFor="businessHours" className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
              Business Hours
            </label>
            <input
              type="text"
              id="businessHours"
              name="businessHours"
              defaultValue={site.businessHours === "[add]" ? "Monday to Friday, 9:00 am – 5:30 pm AEST" : site.businessHours}
              required
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Prefill */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-navy">
          WhatsApp Integration
        </h3>
        <div>
          <label htmlFor="whatsappMessage" className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
            Default WhatsApp Prefill Message
          </label>
          <input
            type="text"
            id="whatsappMessage"
            name="whatsappMessage"
            defaultValue={site.whatsappMessage}
            required
            className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
          />
          <p className="text-[11px] text-opala-muted mt-1">Pre-filled when visitors click the WhatsApp contact button.</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-navy text-[#FAF8F5] hover:bg-navy-surface transition-colors rounded-[2px] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save site settings"}
        </button>
      </div>
    </form>
  );
}
