import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import { distance } from "lib/common/distance"
import { rotation } from "circuit-json"

/**
 * @deprecated Use NetLabelProps instead.
 */
export interface NetAliasProps {
  net?: string
  connection?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "top" | "right" | "bottom"
}

/** @deprecated Use netLabelProps instead. */
export const netAliasProps = z.object({
  net: z.string().optional(),
  connection: z.string().optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "top", "right", "bottom"]).optional(),
})

type InferredNetAliasProps = z.input<typeof netAliasProps>
expectTypesMatch<NetAliasProps, InferredNetAliasProps>(true)
