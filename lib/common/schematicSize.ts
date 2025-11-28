import { distance } from "circuit-json"
import { z } from "zod"

export const schematicSymbolSize = distance
  .or(z.enum(["xs", "sm", "default", "md"]))
  .describe("distance between pin1 and pin2 of the schematic symbol")

export type SchematicSymbolSize = z.input<typeof schematicSymbolSize>
