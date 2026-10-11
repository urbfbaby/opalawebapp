import Link from "next/link";
import { MinimalMap } from "@/components/MinimalMap";
import { ApartmentCard } from "@/components/ApartmentCard";
import type { Property, PopulatedApartment, FeatureFlags } from "@/lib/schemas";

interface PropertyDetailViewProps {
  property: Property;
  buildingApartments: PopulatedApartment[];
  flags: FeatureFlags;
}

export function PropertyDetailView({
  property,
  buildingApartments,
  flags,
}: PropertyDetailViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Property Title & Lead */}
      <div className="max-w-3xl space-y-4">
        <h1 className="font-serif text-4xl sm:text-5xl text-navy font-normal tracking-tight">
          {property.name}
        </h1>
        <p className="text-sm uppercase tracking-wider text-opala-muted font-sans font-medium">
          {property.address}, {property.suburb} {property.state} {property.postcode}
        </p>
        <p className="text-lg sm:text-xl text-opala-charcoal font-sans leading-relaxed pt-2">
          {property.summary}
        </p>
      </div>

      {/* Main Grid: Body & Campus Times (Left) + Minimal Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4 text-base text-opala-charcoal font-sans leading-relaxed">
            <p>
              {property.name} sits on {property.address.split(",")[0]}, close to public transport, cafes, supermarkets and daily essentials. Apartments are move-in ready and suit students, young professionals, interns and exchange students.
            </p>
          </div>

          {/* Getting to campus (list, strictly no icons as specified) */}
          <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-4">
            <h2 className="font-serif text-2xl text-navy font-normal">
              Getting to campus
            </h2>
            <ul className="space-y-2.5 text-sm text-opala-charcoal font-sans divide-y divide-opala-borderSubtle">
              {property.nearby.map((place) => (
                <li key={place.name} className="pt-2.5 first:pt-0 flex items-center justify-between">
                  <span className="font-medium text-navy">{place.name}</span>
                  <span className="text-opala-muted">{place.distance}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Link
              href={`/contact?intent=building&property=${property.slug}`}
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
            >
              Enquire about this building
            </Link>
          </div>
        </div>

        {/* Minimal Map */}
        <div className="lg:col-span-5">
          <MinimalMap
            address={`${property.address}, ${property.suburb} ${property.state}`}
            lat={property.map.lat}
            lng={property.map.lng}
          />
        </div>
      </div>

      {/* Available Apartments in this property */}
      <div className="pt-12 border-t border-opala-border space-y-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-3xl text-navy font-normal">
            Apartments at {property.name}
          </h2>
          <span className="text-xs text-opala-muted">
            {buildingApartments.length} available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildingApartments.map((apt) => (
            <ApartmentCard
              key={apt.slug}
              apartment={apt}
              showAvailabilityFlag={flags.showAvailability}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
