import { distance } from "circuit-json"
import { z } from "zod"

export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
  anchor: z
    .enum([
      "top_left",
      "top_center",
      "top_right",
      "center_left",
      "center",
      "center_right",
      "bottom_left",
      "bottom_center",
      "bottom_right",
    ])
    .optional(),
  color: z.string().optional(),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>
