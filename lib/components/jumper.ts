import { z } from "zod"
import {
  commonComponentProps,
  type CommonComponentProps,
} from "lib/common/layout"
import {
  schematicPinStyle,
  type SchematicPinStyle,
} from "lib/common/schematicPinStyle"
import { distance } from "@tscircuit/soup"
import { expectTypesMatch } from "lib/typecheck"
import { schematicPortArrangement } from "lib/common/schematicPinDefinitions"

export interface JumperProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string>
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPortArrangement?: SchematicPortArrangement
}

export const jumperProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z.record(z.number().or(z.string()), z.string()).optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  schDirection: z.enum(["left", "right"]).optional(),
  schPortArrangement: schematicPortArrangement.optional(),
})

type InferredJumperProps = z.input<typeof jumperProps>
expectTypesMatch<JumperProps, InferredJumperProps>(true)
