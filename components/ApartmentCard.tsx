import Link from "next/link";
import { ApartmentPhoto } from "@/components/ApartmentPhoto";
import type { PopulatedApartment } from "@/lib/schemas";

interface ApartmentCardProps {
  apartment: PopulatedApartment;
  showAvailabilityFlag?: boolean;
}

export function ApartmentCard({
  apartment,
  showAvailabilityFlag = false,
}: ApartmentCardProps) {
  const { code, slug, floor, unitTypeDetails, images, availableFrom } = apartment;
  const coverImage = images.find((img) => img.isCover) || images[0];

  const bedrooms = unitTypeDetails?.bedrooms ?? 1;
  const bathrooms = unitTypeDetails?.bathrooms ?? 1;
  const rentExcl = unitTypeDetails?.rent.fromExclBills;

  return (
    <article className="group bg-white border border-opala-border hover:border-navy/30 transition-all duration-200 rounded-[2px] overflow-hidden flex flex-col h-full">
      {/* Cover Photo */}
      <Link href={`/apartments/${slug}`} className="block relative overflow-hidden">
        <ApartmentPhoto
          image={coverImage}
          unitCode={code}
          aspectRatio="video"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase bg-navy/90 text-[#FAF8F5] rounded-[2px] backdrop-blur-sm">
            Available
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif text-xl text-navy group-hover:text-navy/80 transition-colors">
              <Link href={`/apartments/${slug}`}>
                {code}
              </Link>
            </h3>
            {/* Specs as plain text */}
            <span className="text-xs text-opala-muted font-sans">
              {bedrooms} Bed · {bathrooms} Bath · Level {floor}
            </span>
          </div>

          <p className="mt-2 text-xs text-opala-muted line-clamp-2 leading-relaxed">
            {apartment.description}
          </p>

          {/* Conditional Availability line */}
          {showAvailabilityFlag && availableFrom && (
            <p className="mt-2 text-xs font-medium text-navy">
              Available from {availableFrom}
            </p>
          )}
        </div>

        {/* Rent & Action */}
        <div className="pt-4 border-t border-opala-borderSubtle flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-opala-muted font-sans">
              Rates from
            </p>
            <p className="font-serif text-lg text-navy leading-tight">
              ${rentExcl}
              <span className="text-xs font-sans text-opala-muted font-normal">
                /week excl. bills
              </span>
            </p>
          </div>

          <Link
            href={`/apartments/${slug}`}
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-medium border border-navy/25 text-navy hover:bg-navy hover:text-[#FAF8F5] transition-colors rounded-[2px]"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
