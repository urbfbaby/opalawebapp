"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ApartmentCard } from "@/components/ApartmentCard";
import type { PopulatedApartment, Property, UnitType, FeatureFlags } from "@/lib/schemas";

interface ApartmentsCatalogueProps {
  initialApartments: PopulatedApartment[];
  properties: Property[];
  unitTypes: UnitType[];
  featureFlags: FeatureFlags;
}

export function ApartmentsCatalogue({
  initialApartments,
  properties,
  unitTypes,
  featureFlags,
}: ApartmentsCatalogueProps) {
  const [selectedBedroom, setSelectedBedroom] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedFloorGroup, setSelectedFloorGroup] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"floor-asc" | "floor-desc">("floor-asc");
  const [billsMode, setBillsMode] = useState<"excl" | "incl">("excl");

  // Filter apartments
  const filteredApartments = useMemo(() => {
    return initialApartments
      .filter((apt) => {
        // Bedroom filter
        if (selectedBedroom !== "all") {
          const beds = apt.unitTypeDetails?.bedrooms;
          if (beds !== Number(selectedBedroom)) return false;
        }

        // Property filter (only relevant if multiple properties exist)
        if (properties.length > 1 && selectedProperty !== "all") {
          if (apt.property !== selectedProperty) return false;
        }

        // Floor filter
        if (selectedFloorGroup !== "all") {
          if (selectedFloorGroup === "low" && apt.floor > 10) return false;
          if (selectedFloorGroup === "mid" && (apt.floor <= 10 || apt.floor > 20)) return false;
          if (selectedFloorGroup === "high" && apt.floor <= 20) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "floor-desc") {
          return b.floor - a.floor;
        }
        return a.floor - b.floor;
      });
  }, [
    initialApartments,
    selectedBedroom,
    selectedProperty,
    selectedFloorGroup,
    sortOrder,
    properties.length,
  ]);

  return (
    <div className="space-y-10">
      {/* Filter and Control Bar */}
      <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-opala-borderSubtle">
          {/* Bills Toggle with Coverage */}
          <div className="flex flex-wrap items-center gap-4">
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
            <span className="text-xs text-opala-muted hidden sm:inline">
              Internet, gas, water and electricity.
            </span>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="text-xs text-opala-muted uppercase tracking-wider font-medium">
              Sort
            </label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "floor-asc" | "floor-desc")}
              className="text-xs px-3 py-1.5 bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:outline-none focus:border-navy"
            >
              <option value="floor-asc">Floor (low to high)</option>
              <option value="floor-desc">Floor (high to low)</option>
            </select>
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Bedrooms Filter */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1.5">
              Bedrooms
            </label>
            <select
              value={selectedBedroom}
              onChange={(e) => setSelectedBedroom(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:outline-none focus:border-navy"
            >
              <option value="all">All bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
            </select>
          </div>

          {/* Floor Range Filter */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1.5">
              Floor
            </label>
            <select
              value={selectedFloorGroup}
              onChange={(e) => setSelectedFloorGroup(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:outline-none focus:border-navy"
            >
              <option value="all">All floors</option>
              <option value="low">Lower floors (Levels 4–10)</option>
              <option value="mid">Mid floors (Levels 11–20)</option>
              <option value="high">High floors (Levels 21+)</option>
            </select>
          </div>

          {/* Conditional Property Filter (Only shown when > 1 property exists) */}
          {properties.length > 1 && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-opala-muted mb-1.5">
                Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-opala-bg border border-opala-border rounded-[2px] text-opala-charcoal focus:outline-none focus:border-navy"
              >
                <option value="all">All buildings</option>
                {properties.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters */}
          {(selectedBedroom !== "all" ||
            selectedFloorGroup !== "all" ||
            selectedProperty !== "all") && (
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedBedroom("all");
                  setSelectedFloorGroup("all");
                  setSelectedProperty("all");
                }}
                className="text-xs text-navy underline hover:text-amber-hover transition-colors py-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rates Note */}
      <div className="flex items-center justify-between text-xs text-opala-muted px-1">
        <span>Showing {filteredApartments.length} {filteredApartments.length === 1 ? "apartment" : "apartments"}</span>
        <span>Rates are a guide and are reviewed quarterly.</span>
      </div>

      {/* Apartment Cards Grid / Empty State */}
      {filteredApartments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApartments.map((apt) => (
            <ApartmentCard
              key={apt.slug}
              apartment={apt}
              showAvailabilityFlag={featureFlags.showAvailability}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-opala-border p-12 text-center rounded-[2px] space-y-4 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl text-navy font-normal">
            No apartments match those filters.
          </h3>
          <p className="text-sm text-opala-muted font-sans leading-relaxed">
            Try widening your search, or get in touch and we will help.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedBedroom("all");
                setSelectedFloorGroup("all");
                setSelectedProperty("all");
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-navy text-navy hover:bg-navy hover:text-[#FAF8F5] transition-colors rounded-[2px]"
            >
              Reset filters
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
            >
              Contact us
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
