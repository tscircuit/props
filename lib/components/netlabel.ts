import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import { distance } from "lib/common/distance"
import { rotation } from "circuit-json"

export interface NetLabelProps {
  net?: string
  connection?: string
  connectsTo?: string | string[]
  /**
   * Render the net name along its schematic trace instead of as an anchored
   * label. Inline placement is automatic, so schematic anchor positioning
   * props are ignored.
   */
  inline?: boolean
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "top" | "right" | "bottom"
}

export const netLabelProps = z.object({
  net: z.string().optional(),
  connection: z.string().optional(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  inline: z.boolean().optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "top", "right", "bottom"]).optional(),
})

type InferredNetLabelProps = z.input<typeof netLabelProps>
expectTypesMatch<NetLabelProps, InferredNetLabelProps>(true)
