import { length } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { pcbCoordinate } from "./distance"
import { z } from "zod"
import type { AutocompleteString } from "./autocomplete"

export type PcbSxSelector =
  | "& footprint[src^='kicad:'] silkscreentext"
  | "& silkscreentext"

export interface PcbSxValue {
  fontSize?: string | number
  pcbX?: string | number
  pcbY?: string | number
}

export type PcbSx = Record<
  AutocompleteString<PcbSxSelector>,
  PcbSxValue
>

export const pcbSxValue = z.object({
  fontSize: length.optional(),
  pcbX: pcbCoordinate.optional(),
  pcbY: pcbCoordinate.optional(),
})

export const pcbSx = z.record(
  z.string() as z.ZodType<AutocompleteString<PcbSxSelector>>,
  pcbSxValue,
)

expectTypesMatch<PcbSx, z.input<typeof pcbSx>>(true)
