import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperty, getProperties, getApartments, getFeatureFlags } from "@/lib/data";
import { PropertyDetailView } from "@/components/PropertyDetailView";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((prop) => ({
    slug: prop.slug,
  }));
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prop = await getProperty(slug);
  if (!prop) return {};

  return {
    title: `${prop.name}, ${prop.address} | Opala Property`,
    description: prop.summary,
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyPageProps) {
  const { slug } = await params;
  const [property, allApartments, flags] = await Promise.all([
    getProperty(slug),
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
