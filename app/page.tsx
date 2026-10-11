import Link from "next/link";
import { getApartments, getFeatureFlags } from "@/lib/data";
import { ApartmentCard } from "@/components/ApartmentCard";

export default async function HomePage() {
  const [allApartments, flags] = await Promise.all([
    getApartments(),
    getFeatureFlags(),
  ]);

  // Select 3 to 4 featured apartments for home page
  const featuredApartments = allApartments.slice(0, 4);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section */}
      <section className="bg-navy text-[#FAF8F5] pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.12]">
              Furnished apartments in the heart of Melbourne CBD.
            </h1>
            <p className="text-lg sm:text-xl text-[#FAF8F5]/85 font-sans leading-relaxed">
              Move-in ready homes at La Trobe Tower, close to RMIT, the University of Melbourne and the city&apos;s trams, cafes and supermarkets.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/apartments"
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
              >
                View apartments →
              </Link>
              <Link
                href="/contact?intent=enquire"
                className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider border border-white/30 text-[#FAF8F5] hover:bg-white/10 transition-colors rounded-[2px]"
              >
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-serif text-2xl sm:text-3xl text-navy leading-relaxed font-normal">
            Opala Property offers fully furnished one and two bedroom apartments on La Trobe Street. Each home is ready to move in, with heating, air conditioning, a private bathroom, a full kitchen and laundry. Choose rent with or without bills.
          </p>
        </div>

        {/* At a glance (three short columns, strictly no icons) */}
        <div className="mt-16 pt-12 border-t border-opala-border grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2">
            <h3 className="font-serif text-xl text-navy">
              Rent from $730 per week
            </h3>
            <p className="text-sm text-opala-muted leading-relaxed font-sans">
              One bedroom apartments, bills excluded. Bills included from $830 per week.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl text-navy">
              Bills included, if you want them
            </h3>
            <p className="text-sm text-opala-muted leading-relaxed font-sans">
              Internet, gas, water and electricity in one weekly amount.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl text-navy">
              Stays from 6 months
            </h3>
            <p className="text-sm text-opala-muted leading-relaxed font-sans">
              Flexible options for 3 to 4 months are available.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-opala-border">
          <h2 className="font-serif text-3xl sm:text-4xl text-navy font-normal">
            Our apartments
          </h2>
          <Link
            href="/apartments"
            className="text-xs uppercase tracking-wider font-medium text-navy hover:text-amber-hover transition-colors"
          >
            See all apartments →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredApartments.map((apt) => (
            <ApartmentCard
              key={apt.slug}
              apartment={apt}
              showAvailabilityFlag={flags.showAvailability}
            />
          ))}
        </div>
      </section>

      {/* What is included (strictly numbered 01, 02, 03, 04, no icons) */}
      <section className="bg-opala-bgAlt py-20 border-y border-opala-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-navy font-normal">
              What is included
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 bg-white p-6 border border-opala-border rounded-[2px]">
              <span className="font-serif text-2xl text-navy/40 font-normal block">
                01
              </span>
              <h3 className="font-serif text-xl text-navy">
                Fully furnished
              </h3>
              <p className="text-xs text-opala-muted leading-relaxed font-sans">
                Comfortable living and dining space, bed, wardrobe and a study desk and chair.
              </p>
            </div>

            <div className="space-y-3 bg-white p-6 border border-opala-border rounded-[2px]">
              <span className="font-serif text-2xl text-navy/40 font-normal block">
                02
              </span>
              <h3 className="font-serif text-xl text-navy">
                A complete kitchen
              </h3>
              <p className="text-xs text-opala-muted leading-relaxed font-sans">
                Fridge, stove, oven and the kitchen equipment you need, including cutlery.
              </p>
            </div>

            <div className="space-y-3 bg-white p-6 border border-opala-border rounded-[2px]">
              <span className="font-serif text-2xl text-navy/40 font-normal block">
                03
              </span>
              <h3 className="font-serif text-xl text-navy">
                Laundry at home
              </h3>
              <p className="text-xs text-opala-muted leading-relaxed font-sans">
                Washing machine, dryer, iron and ironing board.
              </p>
            </div>

            <div className="space-y-3 bg-white p-6 border border-opala-border rounded-[2px]">
              <span className="font-serif text-2xl text-navy/40 font-normal block">
                04
              </span>
              <h3 className="font-serif text-xl text-navy">
                Comfort year round
              </h3>
              <p className="text-xs text-opala-muted leading-relaxed font-sans">
                Heating and air conditioning, with plenty of natural light.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-opala-border p-8 sm:p-12 lg:p-16 rounded-[2px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-navy font-normal">
              Walk to class, or to the city.
            </h2>
            <p className="text-base text-opala-muted leading-relaxed font-sans">
              La Trobe Tower is on La Trobe Street, about 7 minutes&apos; walk to RMIT University and around 15 minutes to the University of Melbourne. Victoria University&apos;s City Campus is close by.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              href="/location"
              className="inline-flex items-center justify-center px-6 py-3 text-xs font-semibold uppercase tracking-wider border border-navy text-navy hover:bg-navy hover:text-[#FAF8F5] transition-colors rounded-[2px]"
            >
              Explore the location →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy text-[#FAF8F5] p-10 sm:p-14 lg:p-16 rounded-[2px] text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal">
              Find your place in Melbourne.
            </h2>
            <p className="text-base text-[#FAF8F5]/80 font-sans">
              Tell us what you are looking for and we will suggest the right apartment.
            </p>
          </div>
          <div>
            <Link
              href="/contact?intent=enquire"
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-wider bg-amber text-navy hover:bg-amber-hover transition-colors rounded-[2px]"
            >
              Enquire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
