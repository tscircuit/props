import { distance } from "circuit-json"
import { portRef } from "./trace"
import { z } from "zod"

export const schematicBoxProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
  padding: distance.default(0),
  title: z.string().optional(),
  overlay: z.array(z.string()),
  strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
})
export type SchematicBoxProps = z.input<typeof schematicBoxProps>
