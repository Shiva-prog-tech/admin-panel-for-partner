// ===========================================================================
// Country reference data — used by card-order destinations and KYC filters
// ===========================================================================

export interface Country {
  code: string;
  name: string;
  dial: string;
  currency: string;
  region: "EU" | "APAC" | "MEA" | "AMER";
}

export const COUNTRIES: Country[] = [
  { code: "AE", name: "United Arab Emirates", dial: "+971", currency: "AED", region: "MEA" },
  { code: "AU", name: "Australia", dial: "+61", currency: "AUD", region: "APAC" },
  { code: "BR", name: "Brazil", dial: "+55", currency: "BRL", region: "AMER" },
  { code: "CA", name: "Canada", dial: "+1", currency: "CAD", region: "AMER" },
  { code: "CH", name: "Switzerland", dial: "+41", currency: "CHF", region: "EU" },
  { code: "DE", name: "Germany", dial: "+49", currency: "EUR", region: "EU" },
  { code: "ES", name: "Spain", dial: "+34", currency: "EUR", region: "EU" },
  { code: "FR", name: "France", dial: "+33", currency: "EUR", region: "EU" },
  { code: "GB", name: "United Kingdom", dial: "+44", currency: "GBP", region: "EU" },
  { code: "IN", name: "India", dial: "+91", currency: "INR", region: "APAC" },
  { code: "JP", name: "Japan", dial: "+81", currency: "JPY", region: "APAC" },
  { code: "KE", name: "Kenya", dial: "+254", currency: "KES", region: "MEA" },
  { code: "MY", name: "Malaysia", dial: "+60", currency: "MYR", region: "APAC" },
  { code: "NG", name: "Nigeria", dial: "+234", currency: "NGN", region: "MEA" },
  { code: "NL", name: "Netherlands", dial: "+31", currency: "EUR", region: "EU" },
  { code: "PH", name: "Philippines", dial: "+63", currency: "PHP", region: "APAC" },
  { code: "SG", name: "Singapore", dial: "+65", currency: "SGD", region: "APAC" },
  { code: "TR", name: "Türkiye", dial: "+90", currency: "TRY", region: "MEA" },
  { code: "US", name: "United States", dial: "+1", currency: "USD", region: "AMER" },
  { code: "ZA", name: "South Africa", dial: "+27", currency: "ZAR", region: "MEA" },
];

export const COUNTRY_BY_CODE: Record<string, Country> = COUNTRIES.reduce(
  (acc, country) => {
    acc[country.code] = country;
    return acc;
  },
  {} as Record<string, Country>
);

export function countryName(code: string): string {
  return COUNTRY_BY_CODE[code]?.name ?? code;
}
