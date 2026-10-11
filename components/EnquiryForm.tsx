"use client";

import { useActionState } from "react";
import { submitEnquiryAction } from "@/app/actions/enquiry";
import type { EnquiryActionResult } from "@/lib/enquiry";

interface EnquiryFormProps {
  apartmentCode?: string;
  apartmentSlug?: string;
  defaultHeading?: string;
  isGeneralContact?: boolean;
}

const initialState: EnquiryActionResult = {
  success: false,
  message: "",
};

export function EnquiryForm({
  apartmentCode,
  apartmentSlug,
  defaultHeading,
  isGeneralContact = false,
}: EnquiryFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitEnquiryAction,
    initialState
  );

  return (
    <div className="bg-white border border-opala-border p-6 sm:p-8 rounded-[2px]">
      <h3 className="font-serif text-2xl text-navy mb-2">
        {defaultHeading ||
          (apartmentCode
            ? `Enquire about ${apartmentCode}`
            : "Enquire about an apartment")}
      </h3>
      <p className="text-xs text-opala-muted mb-6">
        Tell us about your plans and our team will get back to you shortly.
      </p>

      {state.success ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-[2px] text-sm">
          <p className="font-medium">
            {isGeneralContact
              ? "Thanks, we have your message and will be in touch soon."
              : "Thanks, we have your enquiry and will be in touch soon."}
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Need an urgent response? You can also message us directly on WhatsApp at{" "}
            <a
              href="https://wa.me/61478888769?text=Hello%20Opala%20Property%2C%20I%20would%20like%20to%20enquire%20about%20an%20apartment."
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-emerald-900"
            >
              0478 888 769
            </a>.
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          {state.message && !state.success && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-[2px] text-xs">
              {state.message}
            </div>
          )}

          {/* Hidden fields */}
          {apartmentCode && (
            <input type="hidden" name="apartmentCode" value={apartmentCode} />
          )}
          {apartmentSlug && (
            <input type="hidden" name="apartmentSlug" value={apartmentSlug} />
          )}

          {/* Honeypot field for bot deterrence */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_field">Leave this empty</label>
            <input
              type="text"
              id="website_field"
              name="website_field"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
              >
                Name <span className="text-amber">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
                placeholder="Your full name"
              />
              {state.errors?.name && (
                <p className="text-xs text-rose-600 mt-1">{state.errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
              >
                Email <span className="text-amber">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
                placeholder="name@example.com"
              />
              {state.errors?.email && (
                <p className="text-xs text-rose-600 mt-1">{state.errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
            >
              Phone <span className="text-xs font-normal lowercase">(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
              placeholder="e.g. 0478 888 769"
            />
          </div>

          {/* Move-in Date & Stay Length (for apartment enquiry) */}
          {!isGeneralContact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="moveInDate"
                  className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
                >
                  Preferred move-in date
                </label>
                <input
                  type="date"
                  id="moveInDate"
                  name="moveInDate"
                  className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
                />
              </div>

              <div>
                <label
                  htmlFor="stayLength"
                  className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
                >
                  Stay length
                </label>
                <select
                  id="stayLength"
                  name="stayLength"
                  defaultValue="6-months"
                  className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
                >
                  <option value="6-months">6 months (Standard)</option>
                  <option value="12-months">12 months or longer</option>
                  <option value="flexible-3-4-months">3 to 4 months (Flexible)</option>
                </select>
              </div>
            </div>
          )}

          {/* Bills Preference */}
          {!isGeneralContact && (
            <div>
              <label
                htmlFor="billsPreference"
                className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
              >
                Bills
              </label>
              <select
                id="billsPreference"
                name="billsPreference"
                defaultValue="not-sure"
                className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
              >
                <option value="excluded">Excluded</option>
                <option value="included">Included</option>
                <option value="not-sure">Not sure</option>
              </select>
            </div>
          )}

          {/* General contact: apartment of interest */}
          {isGeneralContact && (
            <div>
              <label
                htmlFor="apartmentCode"
                className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
              >
                Apartment of interest <span className="text-xs font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                id="apartmentCode"
                name="apartmentCode"
                className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
                placeholder="e.g. LTT 401 or 1 Bedroom"
              />
            </div>
          )}

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1"
            >
              Message <span className="text-amber">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
              placeholder={
                isGeneralContact
                  ? "Tell us how we can help..."
                  : "Tell us a bit about yourself, move-in preferences, or questions..."
              }
            />
            {state.errors?.message && (
              <p className="text-xs text-rose-600 mt-1">{state.errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed shadow-none"
            >
              {isPending
                ? "Sending..."
                : isGeneralContact
                ? "Send message"
                : "Send enquiry"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
