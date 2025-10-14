import { distance } from "circuit-json"
import { z } from "zod"

export const schematicLineProps = z.object({
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})
export type SchematicLineProps = z.input<typeof schematicLineProps>
