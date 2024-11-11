import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import { distance } from "lib/common/distance"
import { rotation } from "circuit-json"

export interface NetAliasProps {
  net?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "up" | "right" | "down"
}

export const netAliasProps = z.object({
  net: z.string().optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "up", "right", "down"]).optional(),
})

type InferredNetAliasProps = z.input<typeof netAliasProps>
expectTypesMatch<NetAliasProps, InferredNetAliasProps>(true)
