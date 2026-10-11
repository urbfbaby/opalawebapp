"use client";

import { useActionState } from "react";
import { updateUnitTypeRentAction } from "@/app/actions/admin-content";
import type { UnitType } from "@/lib/schemas";

interface RateEditorCardProps {
  unitType: UnitType;
}

export function RateEditorCard({ unitType }: RateEditorCardProps) {
  const handleUpdate = async (
    prevState: { success?: boolean; message?: string } | null,
    formData: FormData
  ) => {
    const fromExclBills = Number(formData.get("fromExclBills"));
    const fromInclBills = Number(formData.get("fromInclBills"));

    return await updateUnitTypeRentAction(
      unitType.key,
      fromExclBills,
      fromInclBills
    );
  };

  const [state, formAction, isPending] = useActionState(handleUpdate, null);

  return (
    <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-6">
      <div className="flex items-baseline justify-between pb-4 border-b border-opala-border">
        <div>
          <h3 className="font-serif text-2xl text-navy">
            {unitType.label}
          </h3>
          <p className="text-xs text-opala-muted mt-0.5">
            Key: <code className="bg-opala-bgAlt px-1.5 py-0.5 rounded-[2px]">{unitType.key}</code> · {unitType.bedrooms} Bed · {unitType.bathrooms} Bath
          </p>
        </div>
        <span className="text-xs text-opala-muted">
          Reviewed {unitType.rent.reviewed}
        </span>
      </div>

      {state?.message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[2px] text-xs">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`excl-${unitType.key}`}
              className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1"
            >
              From Excl. Bills ($/week)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-opala-muted">$</span>
              <input
                type="number"
                id={`excl-${unitType.key}`}
                name="fromExclBills"
                defaultValue={unitType.rent.fromExclBills}
                required
                className="w-full pl-7 pr-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
              />
            </div>
            <p className="text-[11px] text-opala-muted mt-1">Tenant pays bills separately.</p>
          </div>

          <div>
            <label
              htmlFor={`incl-${unitType.key}`}
              className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1"
            >
              From Incl. Bills ($/week)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm text-opala-muted">$</span>
              <input
                type="number"
                id={`incl-${unitType.key}`}
                name="fromInclBills"
                defaultValue={unitType.rent.fromInclBills}
                required
                className="w-full pl-7 pr-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
              />
            </div>
            <p className="text-[11px] text-opala-muted mt-1">Covers power, gas, water & wifi.</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-opala-muted">
            Last updated: {unitType.rent.updatedAt}
          </span>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-navy text-[#FAF8F5] hover:bg-navy-surface transition-colors rounded-[2px] disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Save rate changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
