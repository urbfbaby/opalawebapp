import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getApartment, getApartments, getFeatureFlags } from "@/lib/data";
import { ApartmentGallery } from "@/components/ApartmentGallery";
import { FacilitiesList } from "@/components/FacilitiesList";
import { RentDisplay } from "@/components/RentDisplay";
import { EnquiryForm } from "@/components/EnquiryForm";

interface ApartmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const apartments = await getApartments();
  return apartments.map((apt) => ({
    slug: apt.slug,
  }));
}

export async function generateMetadata({
  params,
}: ApartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const apt = await getApartment(slug);
  if (!apt) return {};

  const beds = apt.unitTypeDetails?.bedrooms ?? 1;
  const propertyName = apt.propertyDetails?.name ?? "La Trobe Tower";

  return {
    title: `${apt.code} | ${beds} Bedroom Apartment, ${propertyName}`,
    description: apt.description,
  };
}

export default async function ApartmentDetailPage({
  params,
}: ApartmentPageProps) {
  const { slug } = await params;
  const [apartment, flags] = await Promise.all([
    getApartment(slug),
    getFeatureFlags(),
  ]);

  if (!apartment) {
    notFound();
  }

  const {
    code,
    floor,
    unitTypeDetails,
    propertyDetails,
    images,
    allFacilities,
    description,
  } = apartment;

  const bedrooms = unitTypeDetails?.bedrooms ?? 1;
  const bathrooms = unitTypeDetails?.bathrooms ?? 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-opala-muted font-sans flex items-center gap-2">
        <Link href="/" className="hover:text-navy transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/apartments" className="hover:text-navy transition-colors">
          Apartments
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">{code}</span>
      </nav>

      {/* Header & Overview line */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-opala-border">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy font-normal">
              {code}
            </h1>
            {/* Generated Overview Line */}
            <p className="mt-2 text-sm sm:text-base text-opala-muted font-sans">
              Unit {code} · Level {floor} · {bedrooms} Bed · {bathrooms} Bath
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 text-xs uppercase tracking-wider font-medium bg-navy text-[#FAF8F5] rounded-[2px]">
              Available
            </span>
            <a
              href="#enquire"
              className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
            >
              Enquire
            </a>
          </div>
        </div>

        <p className="text-base text-opala-charcoal font-sans max-w-3xl leading-relaxed pt-2">
          {description}
        </p>
      </div>

      {/* Photo Gallery & Lightbox */}
      <section aria-label="Photo gallery">
        <ApartmentGallery images={images} unitCode={code} />
      </section>

      {/* Main Grid: Details (Left) + Rent & Enquiry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-6">
        {/* Left Column: Overview, Facilities, Location */}
        <div className="lg:col-span-7 space-y-16">
          {/* Facilities Section */}
          <section id="facilities" className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-navy font-normal pb-3 border-b border-opala-border">
              Facilities
            </h2>
            <FacilitiesList facilityKeys={allFacilities} />
          </section>

          {/* Location Section */}
          <section id="location" className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-navy font-normal pb-3 border-b border-opala-border">
              Location
            </h2>
            <div className="space-y-4 text-sm text-opala-charcoal font-sans leading-relaxed">
              <p>
                <strong>{propertyDetails?.name || "La Trobe Tower"}</strong> is located at{" "}
                <strong>{propertyDetails?.address || "327 La Trobe Street"}</strong>, Melbourne CBD.
              </p>
              <p className="text-opala-muted">
                {propertyDetails?.summary ||
                  "In the heart of Melbourne CBD, within walking distance of major universities, transport, cafes and supermarkets."}
              </p>

              {/* Campus Walking Distances */}
              {propertyDetails?.nearby && (
                <div className="pt-2">
                  <h4 className="font-serif text-lg text-navy mb-3">
                    Getting to campus
                  </h4>
                  <ul className="space-y-2 border-l border-opala-border pl-4 text-xs text-opala-muted">
                    {propertyDetails.nearby.map((place) => (
                      <li key={place.name}>
                        <span className="font-medium text-opala-charcoal">{place.name}:</span>{" "}
                        {place.distance}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/location"
                  className="text-xs uppercase tracking-wider font-medium text-navy underline hover:text-amber-hover transition-colors"
                >
                  Explore building & neighbourhood details →
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Rent Block & Enquiry Form */}
        <div className="lg:col-span-5 space-y-8">
          {/* Rent Block */}
          {unitTypeDetails && (
            <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-6">
              <h3 className="font-serif text-2xl text-navy font-normal pb-3 border-b border-opala-border">
                Rent & Terms
              </h3>
              <RentDisplay
                unitType={unitTypeDetails}
                showToggle={true}
                showNotes={true}
                showStayLength={true}
                shortTermFlag={flags.shortTerm}
              />
            </div>
          )}

          {/* Enquiry Form */}
          <div id="enquire">
            <EnquiryForm
              apartmentCode={code}
              apartmentSlug={apartment.slug}
              defaultHeading={`Enquire about ${code}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
