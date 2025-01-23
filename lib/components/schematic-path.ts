import { point } from "circuit-json"
import { z } from "zod"

export const schematicPathProps = z.object({
  points: z.array(point),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})
export type SchematicPathProps = z.input<typeof schematicPathProps>
