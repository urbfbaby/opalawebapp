"use client";

import { useState } from "react";
import type { UnitType } from "@/lib/schemas";

interface RentDisplayProps {
  unitType: UnitType;
  initialMode?: "excl" | "incl";
  showToggle?: boolean;
  showNotes?: boolean;
  showStayLength?: boolean;
  shortTermFlag?: boolean;
  className?: string;
}

export function RentDisplay({
  unitType,
  initialMode = "excl",
  showToggle = true,
  showNotes = true,
  showStayLength = false,
  shortTermFlag = false,
  className = "",
}: RentDisplayProps) {
  const [billsMode, setBillsMode] = useState<"excl" | "incl">(initialMode);
  const { rent } = unitType;

  return (
    <div className={`space-y-4 ${className}`}>
      {showToggle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-opala-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-opala-muted">
              Bills
            </span>
            <div className="inline-flex p-0.5 bg-opala-bgAlt border border-opala-border rounded-[2px]">
              <button
                type="button"
                onClick={() => setBillsMode("excl")}
                className={`px-3 py-1 text-xs font-medium rounded-[2px] transition-colors ${
                  billsMode === "excl"
                    ? "bg-navy text-[#FAF8F5]"
                    : "text-opala-charcoal hover:text-navy"
                }`}
                aria-pressed={billsMode === "excl"}
              >
                Excluded
              </button>
              <button
                type="button"
                onClick={() => setBillsMode("incl")}
                className={`px-3 py-1 text-xs font-medium rounded-[2px] transition-colors ${
                  billsMode === "incl"
                    ? "bg-navy text-[#FAF8F5]"
                    : "text-opala-charcoal hover:text-navy"
                }`}
                aria-pressed={billsMode === "incl"}
              >
                Included
              </button>
            </div>
          </div>
          <span className="text-xs text-opala-muted">
            Bills cover internet, gas, water and electricity.
          </span>
        </div>
      )}

      {/* Main Rent Price */}
      <div>
        <p className="font-serif text-2xl sm:text-3xl text-navy">
          {billsMode === "excl" ? (
            <>
              From <span className="font-medium text-navy">${rent.fromExclBills}</span>
              <span className="text-base font-sans font-normal text-opala-muted">
                /week excl. bills
              </span>
            </>
          ) : (
            <>
              From <span className="font-medium text-navy">${rent.fromInclBills}</span>
              <span className="text-base font-sans font-normal text-opala-muted">
                /week incl. bills
              </span>
            </>
          )}
        </p>

        {/* Alternative price note */}
        <p className="text-xs text-opala-muted mt-1">
          {billsMode === "excl" ? (
            <>Bills included from ${rent.fromInclBills}/week</>
          ) : (
            <>Bills excluded from ${rent.fromExclBills}/week</>
          )}
        </p>
      </div>

      {showStayLength && (
        <div className="pt-2 text-sm text-opala-charcoal space-y-1">
          <p>
            <strong className="font-medium text-navy">Minimum stay:</strong> 6 months. Flexible options for 3 to 4 months are available.
          </p>
          {shortTermFlag && (
            <p className="text-opala-muted">
              Short stays are also available. Enquire for details.
            </p>
          )}
        </div>
      )}

      {showNotes && (
        <p className="text-xs text-opala-muted/90 pt-1">
          Rates are a guide and are reviewed quarterly.
        </p>
      )}
    </div>
  );
}
