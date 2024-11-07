import { distance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type SchematicPinStyle = Record<
  string,
  {
    leftMargin?: number | string
    rightMargin?: number | string
    topMargin?: number | string
    bottomMargin?: number | string
  }
>

export const schematicPinStyle = z.record(
  z.object({
    leftMargin: distance.optional(),
    rightMargin: distance.optional(),
    topMargin: distance.optional(),
    bottomMargin: distance.optional(),
  }),
)

expectTypesMatch<SchematicPinStyle, z.input<typeof schematicPinStyle>>(true)
