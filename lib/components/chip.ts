import { z } from "zod"
import { distance } from "@tscircuit/soup"
import {
  commonComponentProps,
  type CommonComponentProps,
} from "lib/common/layout"
import {
  schematicPortArrangement,
  type SchematicPortArrangement,
} from "lib/common/schematicPinDefinitions"
import {
  schematicPinStyle,
  type SchematicPinStyle,
} from "lib/common/schematicPinStyle"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

export interface ChipProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string | readonly string[]>
  schPortArrangement?: SchematicPortArrangement
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: Distance
  schWidth?: Distance
  schHeight?: Distance
}

export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(
      z.number().or(z.string()),
      z.string().or(z.array(z.string()).readonly()),
    )
    .optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
})

/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type InferredChipProps = z.input<typeof chipProps>

expectTypesMatch<InferredChipProps, ChipProps>(true)
