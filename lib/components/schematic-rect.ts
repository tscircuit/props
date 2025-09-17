import { distance, point, rotation } from "circuit-json"
import { z } from "zod"

export const schematicRectProps = z.object({
  center: point,
  width: distance,
  height: distance,
  rotation: rotation.default(0),
  strokeWidth: distance.optional(),
  color: z.string().optional().default("#000000"),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})

export type SchematicRectProps = z.input<typeof schematicRectProps>
