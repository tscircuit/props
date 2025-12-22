import { distance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"

export const schematicLineProps = z.object({
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})

export interface SchematicLineProps {
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  strokeWidth?: Distance
  color?: string
  isDashed?: boolean
}

export type InferredSchematicLineProps = z.input<typeof schematicLineProps>

expectTypesMatch<SchematicLineProps, z.input<typeof schematicLineProps>>(true)
