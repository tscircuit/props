import { z } from "zod"
import { distance } from "@tscircuit/soup"
import { expectTypesMatch } from "lib/typecheck"

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
