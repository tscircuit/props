import { distance } from "circuit-json"
import { z } from "zod"

export const schematicSymbolSize = z
  .enum(["xs", "sm", "small", "default", "md", "normal"])
  .or(distance)
  .describe("distance between pin1 and pin2 of the schematic symbol")

export type SchematicSymbolSize = z.input<typeof schematicSymbolSize>
