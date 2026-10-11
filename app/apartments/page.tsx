import type { Metadata } from "next";
import { getApartments, getProperties, getUnitTypes, getFeatureFlags } from "@/lib/data";
import { ApartmentsCatalogue } from "@/components/ApartmentsCatalogue";

export const metadata: Metadata = {
  title: "Melbourne CBD Apartments for Rent",
  description:
    "Fully furnished one and two bedroom apartments at La Trobe Tower, Melbourne CBD. Select a home to see photos, facilities and rent.",
};

export default async function ApartmentsPage() {
  const [apartments, properties, unitTypes, featureFlags] = await Promise.all([
    getApartments(),
    getProperties(),
    getUnitTypes(),
    getFeatureFlags(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <h1 className="font-serif text-4xl sm:text-5xl text-navy font-normal tracking-tight">
          Apartments
        </h1>
        <p className="text-base sm:text-lg text-opala-muted font-sans leading-relaxed">
          Fully furnished apartments at La Trobe Tower, Melbourne CBD. Select a home to see photos, facilities and rent.
        </p>
      </div>

      {/* Catalogue with Interactive Filters */}
      <ApartmentsCatalogue
        initialApartments={apartments}
        properties={properties}
        unitTypes={unitTypes}
        featureFlags={featureFlags}
      />
    </div>
  );
}
