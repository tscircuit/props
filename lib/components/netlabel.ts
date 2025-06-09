import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import { distance } from "lib/common/distance"
import { rotation } from "circuit-json"

export interface NetLabelProps {
  net?: string
  /** Selector for the connection this label represents */
  connection?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "up" | "right" | "down"
}

export const netLabelProps = z.object({
  net: z.string().optional(),
  connection: z.string().optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "up", "right", "down"]).optional(),
})

type InferredNetLabelProps = z.input<typeof netLabelProps>
expectTypesMatch<NetLabelProps, InferredNetLabelProps>(true)
