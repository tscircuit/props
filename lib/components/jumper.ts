import { distance } from "circuit-json"
import { connectionTarget } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  type SchematicPortArrangement,
  schematicPinArrangement,
  schematicPortArrangement,
} from "lib/common/schematicPinDefinitions"
import {
  type SchematicPinLabel,
  schematicPinLabel,
} from "lib/common/schematicPinLabel"
import {
  type SchematicPinStyle,
  schematicPinStyle,
} from "lib/common/schematicPinStyle"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export interface JumperProps extends Omit<CommonComponentProps, "name"> {
  name?: string
  manufacturerPartNumber?: string
  pinLabels?: Record<
    number | SchematicPinLabel,
    SchematicPinLabel | SchematicPinLabel[]
  >
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPinArrangement?: SchematicPortArrangement
  /**
   * @deprecated Use schPinArrangement instead.
   */
  schPortArrangement?: SchematicPortArrangement
  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>
  /**
   * Number of pins on the jumper (2 or 3)
   */
  pinCount?: 2 | 3
  /**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: (string | number)[][]
  /**
   * Connections to other components
   */
  connections?: Connections<string>
}

export const jumperProps = commonComponentProps.omit({ name: true }).extend({
  name: z.string().optional(),
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(
      z.number().or(schematicPinLabel),
      schematicPinLabel.or(z.array(schematicPinLabel)),
    )
    .optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  schDirection: z.enum(["left", "right"]).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  pinCount: z.union([z.literal(2), z.literal(3)]).optional(),
  internallyConnectedPins: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional(),
  connections: z
    .custom<Connections>()
    .pipe(z.record(z.string(), connectionTarget))
    .optional(),
})

type InferredJumperProps = z.input<typeof jumperProps>
expectTypesMatch<JumperProps, InferredJumperProps>(true)
