import type { SupplierName } from "./layout"

export type PartAvailabilityPlatformFetch = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>

export interface FetchPartAvailabilityParams {
  supplierName: SupplierName
  supplierPartNumber: string
  platformFetch?: PartAvailabilityPlatformFetch
  signal?: AbortSignal
}

export interface PartAvailability {
  /** Available unit count; null means availability could not be confirmed. */
  stock: number | null
  /** Unit price at the supplier's lowest quantity tier; null means unknown. */
  price: number | null
  /** ISO 4217 currency code, such as USD; null when the price is unknown. */
  currency: string | null
  /** ISO timestamp of this lookup, rather than a guarantee of stock freshness. */
  checkedAt?: string
}
