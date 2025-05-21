import { distance, rotation } from "circuit-json"
import { z } from "zod"
import { nine_point_anchor } from "lib/common/nine_point_anchor"

export const schematicSectionProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
  text: z.string(),
  fontSize: z.number().default(1),
  anchor: nine_point_anchor.default("center"),
  labelColor: z.string().default("#000000"),
  strokeStyle: z.enum(["solid", "dashed"]).default("dashed"),
  schRotation: rotation.default(0),
  color: z.string().default("#000000"),
})

export type SchematicSectionProps = z.input<typeof schematicSectionProps>
