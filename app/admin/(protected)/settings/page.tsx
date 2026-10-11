import { getSite } from "@/lib/data";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const site = await getSite();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-navy">
          Site & Legal Settings
        </h1>
        <p className="text-sm text-opala-muted font-sans mt-1">
          Update official entity credentials, business hours, Australian contact phone, email, and WhatsApp settings.
        </p>
      </div>

      <SiteSettingsForm site={site} />
    </div>
  );
}
