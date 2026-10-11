import { getAdminApartments } from "@/lib/data";
import { ApartmentsTable } from "@/components/admin/ApartmentsTable";

export default async function AdminApartmentsListPage() {
  const apartments = await getAdminApartments();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">
            Apartments
          </h1>
          <p className="text-sm text-opala-muted font-sans mt-1">
            Manage apartment inventory, publishing visibility, floor allocations, and facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-opala-muted">
            {apartments.length} total units configured
          </span>
        </div>
      </div>

      {/* Table */}
      <ApartmentsTable apartments={apartments} />
    </div>
  );
}
