import {
  facilities,
  facilityGroupLabels,
  type FacilityGroup,
  type FacilityKey,
} from "@/lib/facilities";
import { FacilityIcon } from "@/components/FacilityIcon";

interface FacilitiesListProps {
  facilityKeys: string[];
  hideBills?: boolean;
}

export function FacilitiesList({
  facilityKeys,
  hideBills = false,
}: FacilitiesListProps) {
  const groups: FacilityGroup[] = [
    "living",
    "kitchen",
    "bedroom",
    "laundry",
    "comfort",
    ...(hideBills ? [] : (["bills"] as FacilityGroup[])),
  ];

  // Group active facilities
  const groupedFacilities = groups.map((group) => {
    const items = facilityKeys
      .filter((key) => {
        const item = facilities[key as FacilityKey];
        return item && item.group === group;
      })
      .map((key) => facilities[key as FacilityKey]);

    return {
      group,
      label: facilityGroupLabels[group],
      items,
    };
  }).filter((g) => g.items.length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {groupedFacilities.map(({ group, label, items }) => (
        <div key={group} className="space-y-3">
          <h4 className="font-serif text-lg text-navy border-b border-opala-border pb-2">
            {label}
          </h4>
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 text-sm text-opala-charcoal font-sans"
              >
                <FacilityIcon name={item.icon} size={19} className="text-opala-charcoal flex-shrink-0" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
