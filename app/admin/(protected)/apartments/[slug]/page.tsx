import { notFound } from "next/navigation";
import Link from "next/link";
import { getApartment } from "@/lib/data";
import { ApartmentEditForm } from "@/components/admin/ApartmentEditForm";

interface EditApartmentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminEditApartmentPage({
  params,
}: EditApartmentPageProps) {
  const { slug } = await params;
  const apt = await getApartment(slug);

  if (!apt) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header & Back Link */}
      <div className="space-y-2">
        <Link
          href="/admin/apartments"
          className="text-xs text-navy underline hover:text-amber transition-colors"
        >
          ← Back to all apartments
        </Link>
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">
            Edit {apt.code}
          </h1>
          <span className="text-xs text-opala-muted font-sans">
            Slug: <code className="bg-opala-bgAlt px-1.5 py-0.5 rounded-[2px]">{apt.slug}</code>
          </span>
        </div>
      </div>

      <ApartmentEditForm apartment={apt} />
    </div>
  );
}
