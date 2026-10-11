"use client";

import { useState, useTransition } from "react";
import { updateFeatureFlagsAction } from "@/app/actions/admin-content";
import type { FeatureFlags } from "@/lib/schemas";

interface FlagsManagerProps {
  initialFlags: FeatureFlags;
}

export function FlagsManager({ initialFlags }: FlagsManagerProps) {
  const [flags, setFlags] = useState<FeatureFlags>(initialFlags);
  const [isPending, startTransition] = useTransition();
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const toggleFlag = (key: keyof FeatureFlags) => {
    const updated = {
      ...flags,
      [key]: !flags[key],
    };
    setFlags(updated);

    startTransition(async () => {
      await updateFeatureFlagsAction(updated);
      setSavedMessage(`Feature flag '${key}' updated to ${updated[key] ? "ON" : "OFF"}.`);
      setTimeout(() => setSavedMessage(null), 3000);
    });
  };

  return (
    <div className="space-y-6 bg-white border border-opala-border p-6 sm:p-8 rounded-[2px]">
      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[2px] text-xs">
          {savedMessage}
        </div>
      )}

      {/* Flag 1: shortTerm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-opala-border">
        <div className="max-w-xl space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg text-navy">
              shortTerm
            </h3>
            <span
              className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[2px] ${
                flags.shortTerm
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {flags.shortTerm ? "Enabled" : "Disabled"}
            </span>
          </div>
          <p className="text-xs text-opala-muted leading-relaxed">
            When disabled, hides all short-term copy, stay-type UI, and filters. When enabled, surfaces options for 3 to 4 month stays on the apartment detail and enquiry blocks.
          </p>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => toggleFlag("shortTerm")}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            flags.shortTerm ? "bg-navy" : "bg-slate-200"
          }`}
          role="switch"
          aria-checked={flags.shortTerm}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              flags.shortTerm ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Flag 2: showAvailability */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="max-w-xl space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg text-navy">
              showAvailability
            </h3>
            <span
              className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[2px] ${
                flags.showAvailability
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {flags.showAvailability ? "Enabled" : "Disabled"}
            </span>
          </div>
          <p className="text-xs text-opala-muted leading-relaxed">
            When disabled, hides availability labels and the availableFrom field. When enabled, displays &quot;Available from [date]&quot; on catalogue cards and detail pages.
          </p>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => toggleFlag("showAvailability")}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            flags.showAvailability ? "bg-navy" : "bg-slate-200"
          }`}
          role="switch"
          aria-checked={flags.showAvailability}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              flags.showAvailability ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
