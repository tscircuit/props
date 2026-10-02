import type { AnyCircuitElement, AnySourceComponent } from "circuit-json"
import type { SupplierPartNumbers } from "./common/layout"

/** Fetch-compatible callable, without runtime-specific properties such as preconnect. */
export type PartsEnginePlatformFetch = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>

/** Electrical information is represented by canonical source ports in Circuit JSON. */
export type DatasheetInformation = {
  circuitJson: AnyCircuitElement[]
  datasheetId?: string
  chipName?: string
  datasheetPdfUrls?: string[] | null
  footprinterString?: string | null
  /** Stored source text; consumers must not implicitly evaluate it. */
  generatedTsx?: string | null
}

export type FetchDatasheetInformationParams = {
  manufacturerPartNumber: string
  platformFetch?: PartsEnginePlatformFetch
}

export type PartsEngine = {
  findPart: (params: {
    sourceComponent: AnySourceComponent
    footprinterString?: string
  }) => Promise<SupplierPartNumbers> | SupplierPartNumbers
  fetchPartCircuitJson?: (params: {
    supplierPartNumber?: string
    manufacturerPartNumber?: string
    platformFetch?: PartsEnginePlatformFetch
  }) =>
    | Promise<AnyCircuitElement[] | undefined>
    | AnyCircuitElement[]
    | undefined
  /** Independent of supplier/footprint lookup. Undefined means no stored datasheet. */
  fetchDatasheetInformation?: (
    params: FetchDatasheetInformationParams,
  ) =>
    | Promise<DatasheetInformation | undefined>
    | DatasheetInformation
    | undefined
}
