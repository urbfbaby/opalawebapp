"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateApartmentAction } from "@/app/actions/admin-content";
import { ApartmentPhoto } from "@/components/ApartmentPhoto";
import { ApartmentPhotoUploader } from "@/components/admin/ApartmentPhotoUploader";
import { facilities } from "@/lib/facilities";
import type { PopulatedApartment } from "@/lib/schemas";

interface ApartmentEditFormProps {
  apartment: PopulatedApartment;
}

export function ApartmentEditForm({ apartment: apt }: ApartmentEditFormProps) {
  const allFacilityKeys = Object.keys(facilities);
  const extraFacilitiesSet = new Set(apt.extraFacilities || []);

  const handleUpdate = async (
    prevState: { success?: boolean; message?: string } | null,
    formData: FormData
  ) => {
    return await updateApartmentAction(apt.slug, formData);
  };

  const [state, formAction, isPending] = useActionState(handleUpdate, null);

  return (
    <div className="space-y-8">
      <form
        action={formAction}
        className="space-y-8 bg-white border border-opala-border p-6 sm:p-8 rounded-[2px]"
      >
      {state?.message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[2px] text-xs">
          {state.message}
        </div>
      )}

      {/* Core Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-opala-border">
        <div>
          <label className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
            Unit Code
          </label>
          <input
            type="text"
            value={apt.code}
            disabled
            className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-muted cursor-not-allowed"
          />
          <p className="text-[11px] text-opala-muted mt-1">
            Codes follow the property floorplan registry.
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1">
            Unit Type
          </label>
          <input
            type="text"
            value={apt.unitTypeDetails?.label || apt.unitType}
            disabled
            className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-muted cursor-not-allowed"
          />
          <p className="text-[11px] text-opala-muted mt-1">
            Rent rates are governed on the Unit Type.
          </p>
        </div>

        <div>
          <label
            htmlFor="floor"
            className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1"
          >
            Floor Level
          </label>
          <input
            type="number"
            id="floor"
            name="floor"
            defaultValue={apt.floor}
            required
            className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
          />
        </div>

        <div>
          <label
            htmlFor="availableFrom"
            className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1"
          >
            Available From Date <span className="lowercase font-normal">(optional)</span>
          </label>
          <input
            type="date"
            id="availableFrom"
            name="availableFrom"
            defaultValue={apt.availableFrom || ""}
            className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
          />
        </div>
      </div>

      {/* Toggles: Published & Floor Inferred */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-opala-border">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={apt.published}
            className="mt-1 w-4 h-4 text-navy border-opala-border rounded-[2px]"
          />
          <div>
            <span className="text-sm font-medium text-navy block">
              Published on public site
            </span>
            <span className="text-xs text-opala-muted">
              Unchecking this immediately removes the unit from the public catalogue and search.
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="floorInferred"
            value="true"
            defaultChecked={apt.floorInferred}
            className="mt-1 w-4 h-4 text-navy border-opala-border rounded-[2px]"
          />
          <div>
            <span className="text-sm font-medium text-navy block">
              Floor level inferred
            </span>
            <span className="text-xs text-opala-muted">
              Mark as inferred if the physical floor level has not been confirmed on-site.
            </span>
          </div>
        </label>
      </div>

      {/* Description */}
      <div className="pb-6 border-b border-opala-border">
        <label
          htmlFor="description"
          className="block text-xs uppercase tracking-wider font-medium text-opala-muted mb-1"
        >
          Apartment Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={apt.description}
          required
          className="w-full px-3 py-2 text-sm bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:bg-white focus:outline-none focus:border-navy"
        />
      </div>

      {/* Extra Facilities Checklist */}
      <div className="pb-6 border-b border-opala-border space-y-3">
        <div>
          <h3 className="font-serif text-lg text-navy">
            Extra Facilities (Unit-Specific)
          </h3>
          <p className="text-xs text-opala-muted">
            Standard facilities are inherited from the building ({apt.propertyDetails?.name}). Check any additional features unique to this unit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {allFacilityKeys.map((key) => {
            const fac = facilities[key as keyof typeof facilities];
            const isStandard = apt.propertyDetails?.standardFacilities.includes(key);
            const isChecked = isStandard || extraFacilitiesSet.has(key);

            return (
              <label
                key={key}
                className={`flex items-center gap-2.5 p-2 rounded-[2px] text-xs border ${
                  isStandard
                    ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-white border-opala-border text-opala-charcoal hover:border-navy cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  name="extraFacilities"
                  value={key}
                  defaultChecked={isChecked}
                  disabled={isStandard}
                  className="w-3.5 h-3.5 text-navy rounded-[2px]"
                />
                <span>{fac.label}</span>
                {isStandard && (
                  <span className="ml-auto text-[10px] text-slate-400">Standard</span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Photos Preview */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg text-navy">
          Photos ({apt.images.length})
        </h3>
        <p className="text-xs text-opala-muted">
          Photos are referenced from data. Where placeholder is true, the site renders the warm grey neutral canvas.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {apt.images.map((img) => (
            <div key={img.src} className="space-y-1">
              <ApartmentPhoto image={img} unitCode={apt.code} aspectRatio="video" />
              <div className="flex items-center justify-between text-[10px] text-opala-muted">
                <span className="capitalize">{img.category}</span>
                {img.isCover && <span className="font-semibold text-navy">Cover</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Actions */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/admin/apartments"
          className="text-xs text-opala-muted hover:text-navy underline"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px] disabled:opacity-50"
        >
          {isPending ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    </form>

    {/* Cloud Photos & Image Management (Independent Component) */}
    <div className="bg-white border border-opala-border p-6 sm:p-8 rounded-[2px]">
      <ApartmentPhotoUploader
        slug={apt.slug}
        unitCode={apt.code}
        images={apt.images}
      />
    </div>
  </div>
  );
}
