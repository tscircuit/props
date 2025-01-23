import { distance } from "circuit-json"
import { z } from "zod"

export const schematicBoxProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
})
export type SchematicBoxProps = z.input<typeof schematicBoxProps>
