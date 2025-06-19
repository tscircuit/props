import { distance, rotation } from "circuit-json"
import { z } from "zod"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { fivePointAnchor } from "lib/common/fivePointAnchor"

export const schematicTextProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  text: z.string(),
  fontSize: z.number().default(1),
  anchor: z
    .union([fivePointAnchor.describe("legacy"), ninePointAnchor])
    .default("center"),
  color: z.string().default("#000000"),
  schRotation: rotation.default(0),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>
