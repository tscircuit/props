import { distance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type SchematicPinStyle = Record<
  string,
  {
    marginTop?: number | string
    marginRight?: number | string
    marginBottom?: number | string
    marginLeft?: number | string

    /** @deprecated use marginLeft */
    leftMargin?: number | string
    /** @deprecated use marginRight */
    rightMargin?: number | string
    /** @deprecated use marginTop */
    topMargin?: number | string
    /** @deprecated use marginBottom */
    bottomMargin?: number | string
  }
>

export const schematicPinStyle = z.record(
  z.object({
    marginLeft: distance.optional(),
    marginRight: distance.optional(),
    marginTop: distance.optional(),
    marginBottom: distance.optional(),

    leftMargin: distance.optional(),
    rightMargin: distance.optional(),
    topMargin: distance.optional(),
    bottomMargin: distance.optional(),
  }),
)

expectTypesMatch<SchematicPinStyle, z.input<typeof schematicPinStyle>>(true)
