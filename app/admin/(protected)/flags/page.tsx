import { getFeatureFlags } from "@/lib/data";
import { FlagsManager } from "@/components/admin/FlagsManager";

export default async function AdminFlagsPage() {
  const flags = await getFeatureFlags();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-navy">
          Feature Flags
        </h1>
        <p className="text-sm text-opala-muted font-sans mt-1">
          Toggle key tenant-facing behaviours instantly. Changes update the live site without rebuilding or redeploying code.
        </p>
      </div>

      <FlagsManager initialFlags={flags} />
    </div>
  );
}
