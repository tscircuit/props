import { distance, rotation } from "circuit-json"
import { z } from "zod"
import { nine_point_anchor } from "lib/common/nine_point_anchor"
import { five_point_anchor } from "lib/common/five_point_anchor"

export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
  fontSize: z.number().default(1),
  anchor: z
    .union([five_point_anchor.describe("legacy"), nine_point_anchor])
    .default("center"),
  color: z.string().default("#000000"),
  schRotation: rotation.default(0),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>
