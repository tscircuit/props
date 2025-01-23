import { distance } from "circuit-json"
import { z } from "zod"

export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>
