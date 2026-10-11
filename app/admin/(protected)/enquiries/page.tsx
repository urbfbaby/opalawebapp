import { getEnquiries } from "@/lib/data";
import { EnquiriesList } from "@/components/admin/EnquiriesList";

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy">
            Enquiries Inbox
          </h1>
          <p className="text-sm text-opala-muted font-sans mt-1">
            Review and respond to prospect tenant enquiries submitted through the public website.
          </p>
        </div>

        <span className="text-xs text-opala-muted">
          {enquiries.length} total received
        </span>
      </div>

      <EnquiriesList enquiries={enquiries} />
    </div>
  );
}
