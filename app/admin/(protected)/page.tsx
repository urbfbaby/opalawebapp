import Link from "next/link";
import {
  getAdminApartments,
  getUnitTypes,
  getFeatureFlags,
  getEnquiries,
} from "@/lib/data";

export default async function AdminDashboardPage() {
  const [apartments, unitTypes, flags, enquiries] = await Promise.all([
    getAdminApartments(),
    getUnitTypes(),
    getFeatureFlags(),
    getEnquiries(),
  ]);

  const publishedCount = apartments.filter((a) => a.published).length;
  const draftCount = apartments.length - publishedCount;

  return (
    <div className="space-y-10">
      {/* Welcome & Overview Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-navy">
          Dashboard Overview
        </h1>
        <p className="text-sm text-opala-muted font-sans mt-1">
          Welcome to the Opala Property management dashboard. Manage your Melbourne CBD apartments, live rates, feature flags, and tenant enquiries.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Apartments */}
        <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-opala-muted">
            Total Apartments
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl text-navy">{apartments.length}</span>
            <span className="text-xs text-emerald-700 font-medium">
              ({publishedCount} active)
            </span>
          </div>
          <p className="text-[11px] text-opala-muted">
            {draftCount > 0 ? `${draftCount} draft/hidden units` : "All units published"}
          </p>
        </div>

        {/* Metric 2: Rent 1BR */}
        <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-opala-muted">
            1BR Rate (Weekly)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl text-navy">
              ${unitTypes.find((u) => u.key === "1br-1ba")?.rent.fromExclBills ?? 730}
            </span>
            <span className="text-xs text-opala-muted">excl. bills</span>
          </div>
          <p className="text-[11px] text-opala-muted">
            Incl. bills: ${unitTypes.find((u) => u.key === "1br-1ba")?.rent.fromInclBills ?? 830}/week
          </p>
        </div>

        {/* Metric 3: Rent 2BR */}
        <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-opala-muted">
            2BR Rate (Weekly)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl text-navy">
              ${unitTypes.find((u) => u.key === "2br-1ba")?.rent.fromExclBills ?? 830}
            </span>
            <span className="text-xs text-opala-muted">excl. bills</span>
          </div>
          <p className="text-[11px] text-opala-muted">
            Incl. bills: ${unitTypes.find((u) => u.key === "2br-1ba")?.rent.fromInclBills ?? 930}/week
          </p>
        </div>

        {/* Metric 4: Inbound Enquiries */}
        <div className="bg-white border border-opala-border p-6 rounded-[2px] space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-opala-muted">
            Tenant Enquiries
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl text-navy">{enquiries.length}</span>
            <span className="text-xs text-navy font-medium">inbox</span>
          </div>
          <p className="text-[11px] text-opala-muted">
            {enquiries.length === 0 ? "No pending messages" : "Stored locally"}
          </p>
        </div>
      </div>

      {/* Feature Flags Status Box */}
      <div className="bg-white border border-opala-border p-6 rounded-[2px] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-xl text-navy">
            Feature Flags Status
          </h2>
          <p className="text-xs text-opala-muted mt-1">
            Control dynamic site behaviour without redeploying code.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                flags.shortTerm ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
            <span>Short-Term Stay: <strong>{flags.shortTerm ? "ON" : "OFF"}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                flags.showAvailability ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
            <span>Show Availability: <strong>{flags.showAvailability ? "ON" : "OFF"}</strong></span>
          </div>

          <Link
            href="/admin/flags"
            className="px-3 py-1.5 border border-navy text-navy hover:bg-navy hover:text-[#FAF8F5] transition-colors rounded-[2px] font-medium"
          >
            Manage Flags →
          </Link>
        </div>
      </div>

      {/* Recent Enquiries & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-opala-border rounded-[2px] overflow-hidden">
          <div className="p-5 border-b border-opala-border flex items-center justify-between">
            <h3 className="font-serif text-lg text-navy">
              Recent Tenant Enquiries
            </h3>
            <Link
              href="/admin/enquiries"
              className="text-xs text-navy underline hover:text-amber transition-colors font-medium"
            >
              View all ({enquiries.length})
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-opala-charcoal">
                <thead className="bg-opala-bg border-b border-opala-border uppercase tracking-wider text-opala-muted font-medium">
                  <tr>
                    <th className="px-5 py-3">Prospect</th>
                    <th className="px-5 py-3">Unit</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-opala-borderSubtle">
                  {enquiries.slice(0, 5).map((enq) => (
                    <tr key={enq.id} className="hover:bg-opala-bg/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-navy">{enq.name}</p>
                        <p className="text-opala-muted text-[11px]">{enq.email}</p>
                      </td>
                      <td className="px-5 py-3.5 font-medium">
                        {enq.apartmentCode || "General"}
                      </td>
                      <td className="px-5 py-3.5 text-opala-muted text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href="/admin/enquiries"
                          className="text-navy hover:text-amber underline font-medium"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-opala-muted">
              No prospect enquiries yet. Submissions from the website forms will appear here.
            </div>
          )}
        </div>

        {/* Quick Operations (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-opala-border p-5 rounded-[2px] space-y-3">
            <h3 className="font-serif text-lg text-navy">
              Quick Operations
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/admin/apartments"
                className="block p-3 bg-opala-bg hover:bg-opala-bgAlt border border-opala-borderSubtle rounded-[2px] transition-colors"
              >
                <strong className="block text-navy font-medium">Manage Apartments</strong>
                <span className="text-opala-muted text-[11px]">
                  Edit units, floors, publishing toggles, and photo specs.
                </span>
              </Link>

              <Link
                href="/admin/rates"
                className="block p-3 bg-opala-bg hover:bg-opala-bgAlt border border-opala-borderSubtle rounded-[2px] transition-colors"
              >
                <strong className="block text-navy font-medium">Update Weekly Rates</strong>
                <span className="text-opala-muted text-[11px]">
                  Adjust quarterly rent matrices for 1BR and 2BR.
                </span>
              </Link>

              <Link
                href="/admin/settings"
                className="block p-3 bg-opala-bg hover:bg-opala-bgAlt border border-opala-borderSubtle rounded-[2px] transition-colors"
              >
                <strong className="block text-navy font-medium">Site & Legal Settings</strong>
                <span className="text-opala-muted text-[11px]">
                  Update phone numbers, WhatsApp, business hours, and ABN.
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
