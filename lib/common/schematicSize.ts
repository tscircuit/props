import { distance } from "circuit-json"
import { z } from "zod"

export const schematicSymbolSize = z
  .enum(["xs", "sm", "default", "md"])
  .or(distance.pipe(z.number().finite()))
  .describe("distance between pin1 and pin2 of the schematic symbol")

export type SchematicSymbolSize = z.input<typeof schematicSymbolSize>
