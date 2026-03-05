import { length } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { pcbCoordinate } from "./distance"
import { z } from "zod"

export type PcbSxSelector =
  | "& footprint[src^='kicad:'] silkscreentext"
  | "& silkscreentext"
  | "& fabricationnotetext"

export interface PcbSxValue {
  fontSize?: string | number
  pcbX?: string | number
  pcbY?: string | number
  visibility?: "hidden" | "visible"
}

type PcbSxBase = Record<string, PcbSxValue>

export type PcbSx = PcbSxBase & {
  [K in PcbSxSelector]?: PcbSxValue
}

export const pcbSxValue = z.object({
  fontSize: length.optional(),
  pcbX: pcbCoordinate.optional(),
  pcbY: pcbCoordinate.optional(),
  visibility: z.enum(["hidden", "visible"]).optional(),
})

export const pcbSx = z.record(
  z.string(),
  pcbSxValue,
) as unknown as z.ZodType<PcbSx>

expectTypesMatch<PcbSx, z.input<typeof pcbSx>>(true)
