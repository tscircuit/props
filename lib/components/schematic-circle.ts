import { distance, point } from "circuit-json"
import { z } from "zod"

export const schematicCircleProps = z.object({
  center: point,
  radius: distance,
  strokeWidth: distance.optional(),
  color: z.string().optional().default("#000000"),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})

export type SchematicCircleProps = z.input<typeof schematicCircleProps>
