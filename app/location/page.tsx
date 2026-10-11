import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty, getApartments, getFeatureFlags } from "@/lib/data";
import { PropertyDetailView } from "@/components/PropertyDetailView";

export const metadata: Metadata = {
  title: "La Trobe Tower, 327 La Trobe Street",
  description:
    "In the heart of Melbourne CBD, within walking distance of major universities, transport, cafes and supermarkets.",
};

export default async function LocationPage() {
  const [property, allApartments, flags] = await Promise.all([
    getProperty("la-trobe-tower"),
    getApartments(),
    getFeatureFlags(),
  ]);

  if (!property) {
    notFound();
  }

  const buildingApartments = allApartments.filter(
    (apt) => apt.property === property.slug
  );

  return (
    <PropertyDetailView
      property={property}
      buildingApartments={buildingApartments}
      flags={flags}
    />
  );
}
