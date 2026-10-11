# Opala Property Architecture & Data Layer

This document outlines the architecture, data structures, and operational guides for Opala Property (`Opala Group Pty Ltd`).

---

## 1. Overview & Data Layer Decoupling

The frontend never directly imports raw JSON or interacts directly with the filesystem. All components and Next.js App Router pages consume content through the unified data layer located in `/lib/data/index.ts`:

- `getProperties()`: Returns all active properties.
- `getProperty(slug)`: Returns a single property by its slug.
- `getApartments(filters)`: Returns populated apartments filtered by bedrooms, property, floor, etc.
- `getApartment(slug)`: Returns an apartment with joined property, unit type, rent, and composed facilities.
- `getUnitTypes()`: Returns all unit types and rate matrices.
- `getSite()`: Returns global site configuration (contact, legal names, service area).
- `getFeatureFlags()`: Returns feature flags (e.g. `shortTerm`, `showAvailability`).

### Future CMS Migration
Because UI components only interface with `/lib/data/index.ts` functions, migrating from local JSON files to a headless CMS (Sanity, Payload, Supabase, Strapi) requires updating only `/lib/data/index.ts`. Page components and routes require zero alterations.

---

## 2. Content Structure

All data is stored in discrete JSON files validated by Zod schemas in `/lib/schemas.ts`:

```
content/
├── site.json
├── flags.json
├── properties/
│   └── <property-slug>.json
├── unit-types/
│   └── <unit-type-key>.json
└── apartments/
    └── <apartment-slug>.json
```

### Relations
- **Apartment -> Property**: Modeled via `property: "<property-slug>"`.
- **Apartment -> Unit Type**: Modeled via `unitType: "<unit-type-key>"`.
- **Rent**: Lives exclusively on the **unit type** (`fromExclBills`, `fromInclBills`). Rent is never duplicated on individual apartments.
- **Facilities**: Referenced by key from `/lib/facilities.ts`. The effective facility list for an apartment is composed dynamically:
  $$\text{Apartment Facilities} = \text{Property.standardFacilities} \cup \text{Apartment.extraFacilities}$$

---

## 3. How-To Guides

### How to Add a New Facility
1. Open `/lib/facilities.ts`.
2. Add a new entry to the `facilities` record:
   ```ts
   "balcony": { label: "Private balcony", group: "living", icon: "Sun" },
   ```
3. Assign an appropriate `@phosphor-icons/react` icon name and group (`living`, `kitchen`, `bedroom`, `laundry`, `comfort`, `bills`).

### How to Add a New Unit Type
1. Create a new JSON file under `/content/unit-types/<key>.json` (e.g. `/content/unit-types/3br-2ba.json`).
2. Populate the unit type definition:
   ```json
   {
     "key": "3br-2ba",
     "label": "3 Bedroom, 2 Bathroom",
     "bedrooms": 3,
     "bathrooms": 2,
     "rent": {
       "currency": "AUD",
       "unit": "week",
       "fromExclBills": 1050,
       "fromInclBills": 1180,
       "display": "from",
       "reviewed": "Quarterly",
       "updatedAt": "2026-10-12"
     }
   }
   ```

### How to Add a New Property
1. Create a new JSON file under `/content/properties/<property-slug>.json`.
2. Define the property details, address, walking distances, standard facilities, and coordinates:
   ```json
   {
     "slug": "collins-house",
     "name": "Collins House",
     "address": "466 Collins Street",
     "suburb": "Melbourne CBD",
     "state": "VIC",
     "postcode": "3000",
     "country": "Australia",
     "summary": "...",
     "minStay": "6 months",
     "flexibleStay": "Flexible options for 3 to 4 months are available.",
     "billsCoverage": ["internet", "gas", "water", "electricity"],
     "nearby": [...],
     "map": { "lat": -37.8175, "lng": 144.9589 },
     "standardFacilities": ["wifi", "aircon", "heating", "bed"],
     "published": true
   }
   ```
3. When more than one property is published, the catalogue UI automatically enables the Property filter.

### How to Add an Apartment
1. Create a new JSON file under `/content/apartments/<slug>.json` (e.g. `/content/apartments/ltt-1205.json`).
2. Provide the unit specifications:
   ```json
   {
     "slug": "ltt-1205",
     "code": "LTT 1205",
     "property": "la-trobe-tower",
     "unitType": "1br-1ba",
     "floor": 12,
     "floorInferred": false,
     "description": "Bright one bedroom apartment on level 12.",
     "extraFacilities": [],
     "stayTypes": ["long-term"],
     "availableFrom": null,
     "published": true,
     "images": [
       {
         "src": "/images/apartments/ltt-1205/01-living.jpg",
         "alt": "Living area in LTT 1205",
         "category": "living",
         "order": 1,
         "isCover": true,
         "placeholder": true
       }
     ]
   }
   ```

---

## 4. Image Placeholders & Asset Strategy

- All apartment images specify `src`, `alt`, `category`, `order`, `isCover`, and `placeholder`.
- When `placeholder: true`, components render a warm grey placeholder canvas displaying the unit code in a Fraunces serif typeface. Stock photography is strictly prohibited.
- When original high-resolution photography is supplied, files are placed at the matching `src` paths and `placeholder` is set to `false`.
