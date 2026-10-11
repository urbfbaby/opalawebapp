import { getUnitTypes } from "@/lib/data";
import { RateEditorCard } from "@/components/admin/RateEditorCard";

export default async function AdminRatesPage() {
  const unitTypes = await getUnitTypes();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-navy">
          Rates & Unit Types
        </h1>
        <p className="text-sm text-opala-muted font-sans mt-1 leading-relaxed">
          Rental rates live on the Unit Type. Any update here automatically reflects across all matching apartments on the public catalogue, home page, and detail views.
        </p>
      </div>

      <div className="space-y-6">
        {unitTypes.map((unitType) => (
          <RateEditorCard key={unitType.key} unitType={unitType} />
        ))}
      </div>

      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-[2px] text-xs text-amber-950">
        <p className="font-medium">Regulatory Note (Consumer Affairs Victoria):</p>
        <p className="mt-0.5 text-amber-900/90 leading-relaxed">
          Victorian residential tenancy regulations govern fixed-price rental advertising. Ensure that quarterly guide rates comply with current CAV guidance before publishing widespread adjustments.
        </p>
      </div>
    </div>
  );
}
