"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toggleApartmentPublishedAction } from "@/app/actions/admin-content";
import type { PopulatedApartment } from "@/lib/schemas";

interface ApartmentsTableProps {
  apartments: PopulatedApartment[];
}

export function ApartmentsTable({ apartments }: ApartmentsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (slug: string) => {
    startTransition(async () => {
      await toggleApartmentPublishedAction(slug);
    });
  };

  return (
    <div className="bg-white border border-opala-border rounded-[2px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-opala-charcoal">
          <thead className="bg-opala-bg border-b border-opala-border uppercase tracking-wider text-opala-muted font-medium">
            <tr>
              <th className="px-5 py-3">Unit Code</th>
              <th className="px-5 py-3">Property</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Floor</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-opala-borderSubtle">
            {apartments.map((apt) => (
              <tr key={apt.slug} className="hover:bg-opala-bg/40 transition-colors">
                {/* Code & Description snippet */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-medium text-navy">
                      {apt.code}
                    </span>
                    {apt.floorInferred && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-[2px]">
                        Floor inferred
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-opala-muted truncate max-w-xs mt-0.5">
                    {apt.description}
                  </p>
                </td>

                {/* Property */}
                <td className="px-5 py-4 font-medium text-navy">
                  {apt.propertyDetails?.name || "La Trobe Tower"}
                </td>

                {/* Type */}
                <td className="px-5 py-4">
                  <span className="text-opala-charcoal">
                    {apt.unitTypeDetails?.label || apt.unitType}
                  </span>
                </td>

                {/* Floor */}
                <td className="px-5 py-4">
                  <span className="font-medium text-navy">Level {apt.floor}</span>
                </td>

                {/* Published Toggle */}
                <td className="px-5 py-4">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggle(apt.slug)}
                    className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-[2px] transition-colors border ${
                      apt.published
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {apt.published ? "● Published" : "○ Draft / Hidden"}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right space-x-3">
                  <Link
                    href={`/admin/apartments/${apt.slug}`}
                    className="text-xs text-navy font-medium underline hover:text-amber transition-colors"
                  >
                    Edit Details
                  </Link>
                  <a
                    href={`/apartments/${apt.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-opala-muted hover:text-navy underline transition-colors"
                  >
                    Preview ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
