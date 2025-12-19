import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  schematicPinLabel,
  type SchematicPinLabel,
} from "lib/common/schematicPinLabel"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface InterconnectProps extends CommonComponentProps {
  standard?: "TSC0001_36P_XALT_2025_11" | "0805" | "0603" | "1206"
  pinLabels?: Record<
    number | SchematicPinLabel,
    SchematicPinLabel | SchematicPinLabel[]
  >
  /**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: (string | number)[][]
}

export const interconnectProps = commonComponentProps.extend({
  standard: z
    .enum(["TSC0001_36P_XALT_2025_11", "0805", "0603", "1206"])
    .optional(),
  pinLabels: z
    .record(
      z.number().or(schematicPinLabel),
      schematicPinLabel.or(z.array(schematicPinLabel)),
    )
    .optional(),
  internallyConnectedPins: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional(),
})

type InferredInterconnectProps = z.input<typeof interconnectProps>
expectTypesMatch<InterconnectProps, InferredInterconnectProps>(true)
