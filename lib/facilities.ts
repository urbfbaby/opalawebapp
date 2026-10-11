// Facility master list. Replaces the earlier facilities.ts. Save as /lib/facilities.ts.
// Apartments and properties reference facilities by KEY only.
// Icons: @phosphor-icons/react, weight="light", size 18-20, same colour as body text.
// Verify each icon name against the installed Phosphor version. If one is missing,
// choose the closest icon and keep the key unchanged (the key is what the data uses).
// To add a facility: add one entry here. In a future CMS this list becomes a collection.

export type FacilityGroup =
  | "living"
  | "kitchen"
  | "bedroom"
  | "laundry"
  | "comfort"
  | "bills";

export interface Facility {
  label: string;
  group: FacilityGroup;
  icon: string;
}

export const facilityGroupLabels: Record<FacilityGroup, string> = {
  living: "Living and dining",
  kitchen: "Kitchen",
  bedroom: "Bedroom",
  laundry: "Laundry",
  comfort: "Comfort",
  bills: "Bills",
};

export const facilities = {
  // Living and dining
  "living-space":      { label: "Comfortable living space", group: "living",  icon: "Couch" },
  "dining-area":       { label: "Dining area",              group: "living",  icon: "ForkKnife" },
  "natural-light":     { label: "Natural light",            group: "living",  icon: "Sun" },
  "fully-furnished":   { label: "Fully furnished",          group: "living",  icon: "Armchair" },
  "tv":                { label: "Television",               group: "living",  icon: "Television" },

  // Kitchen
  "fridge":            { label: "Fridge",                   group: "kitchen", icon: "Snowflake" },
  "stove":             { label: "Stove",                    group: "kitchen", icon: "Flame" },
  "oven":              { label: "Oven",                     group: "kitchen", icon: "CookingPot" },
  "kitchen-equipment": { label: "Full kitchen equipment, including cutlery", group: "kitchen", icon: "Knife" },

  // Bedroom
  "bed":               { label: "Bed setup",                group: "bedroom", icon: "Bed" },
  "wardrobe":          { label: "Wardrobe and storage",     group: "bedroom", icon: "Package" },
  "study-desk":        { label: "Study desk and chair",     group: "bedroom", icon: "Desk" },

  // Laundry
  "washing-machine":   { label: "Washing machine",          group: "laundry", icon: "WashingMachine" },
  "dryer":             { label: "Dryer",                    group: "laundry", icon: "Wind" },
  "iron":              { label: "Iron",                     group: "laundry", icon: "TShirt" },
  "ironing-board":     { label: "Ironing board",            group: "laundry", icon: "TShirt" },

  // Comfort
  "aircon":            { label: "Air conditioning",         group: "comfort", icon: "Snowflake" },
  "heating":           { label: "Heating",                  group: "comfort", icon: "Thermometer" },
  "private-bathroom":  { label: "Private bathroom",         group: "comfort", icon: "Bathtub" },
  "wifi":              { label: "Wi-Fi",                    group: "comfort", icon: "WifiHigh" },

  // Bills coverage (used by the bills toggle and rent block)
  "internet":          { label: "Internet",                 group: "bills",   icon: "WifiHigh" },
  "gas":               { label: "Gas",                      group: "bills",   icon: "Flame" },
  "water":             { label: "Water",                    group: "bills",   icon: "Drop" },
  "electricity":       { label: "Electricity",              group: "bills",   icon: "Lightning" },
} as const satisfies Record<string, Facility>;

export type FacilityKey = keyof typeof facilities;
