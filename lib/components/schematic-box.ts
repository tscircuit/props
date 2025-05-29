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
  overlay: z.array(z.string()).optional(),
  strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
  paddingLeft: distance.default(0),
  paddingRight: distance.default(0),
  paddingTop: distance.default(0),
  paddingBottom: distance.default(0),
})
export type SchematicBoxProps = z.input<typeof schematicBoxProps>
