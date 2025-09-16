import { distance, point, rotation } from "circuit-json"
import { z } from "zod"

export const schematicArcProps = z.object({
  center: point,
  radius: distance,
  startAngleDegrees: rotation,
  endAngleDegrees: rotation,
  direction: z.enum(["clockwise", "counterclockwise"]).default(
    "counterclockwise",
  ),
  strokeWidth: distance.optional(),
  color: z.string().optional().default("#000000"),
  isDashed: z.boolean().optional().default(false),
})

export type SchematicArcProps = z.input<typeof schematicArcProps>
