import { z } from "zod"
import { distance } from "@tscircuit/soup"
import { commonComponentProps } from "lib/common/layout"
import { schematicPortArrangement } from "lib/common/schematicPinDefinitions"
import { schematicPinStyle } from "lib/common/schematicPinStyle"

export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z.record(z.number().or(z.string()), z.string()).optional(),

  schPortArrangement: schematicPortArrangement.optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
})

export type SchematicPinStyle = {
  leftMargin?: number | string
  rightMargin?: number | string
  topMargin?: number | string
  bottomMargin?: number | string
}
export type SchematicPinStyles = Record<string, SchematicPinStyle>

/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type ChipProps = z.input<typeof chipProps>
