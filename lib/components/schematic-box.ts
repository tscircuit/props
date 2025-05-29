import { distance } from "circuit-json"
import { z } from "zod"

export const schematicBoxProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
  padding: distance.optional(),
  title: z.string().optional(),
  overlay: z.array(z.string()).optional(),
  strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
  paddingLeft: distance.optional(),
  paddingRight: distance.optional(),
  paddingTop: distance.optional(),
  paddingBottom: distance.optional(),
})
export type SchematicBoxProps = z.input<typeof schematicBoxProps>
