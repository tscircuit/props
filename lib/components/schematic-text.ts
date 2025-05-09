import { distance } from "circuit-json"
import { z } from "zod"

export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
  anchor: z.enum(["center", "left", "right", "top", "bottom"]).optional(),
  color: z.string().optional(),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>
