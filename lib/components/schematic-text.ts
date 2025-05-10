import { distance } from "circuit-json"
import { z } from "zod"
import { nine_point_anchor } from "lib/common/nine_point_anchor"
import { five_point_anchor } from "lib/common/five_point_anchor"

export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
  anchor: z.union([five_point_anchor.describe("legacy"), nine_point_anchor]),
  color: z.string().optional(),
  schRotation: z.number().optional(),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>
