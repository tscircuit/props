import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import { distance } from "lib/common/distance"
import { rotation } from "circuit-json"

export interface NetLabelProps {
  net?: string
  connection?: string
  connectsTo?: string | string[]
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "top" | "right" | "bottom"
}

export const netLabelProps = z.object({
  net: z.string().optional(),
  connection: z.string().optional(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "top", "right", "bottom"]).optional(),
})

type InferredNetLabelProps = z.input<typeof netLabelProps>
expectTypesMatch<NetLabelProps, InferredNetLabelProps>(true)
