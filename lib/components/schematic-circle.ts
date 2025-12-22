import { distance, point } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import type { Point } from "lib/common/point"
import type { Distance } from "lib/common/distance"

export const schematicCircleProps = z.object({
  center: point,
  radius: distance,
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})

export interface SchematicCircleProps {
  center: Point
  radius: Distance
  strokeWidth?: Distance
  color?: string
  isFilled?: boolean
  fillColor?: string
  isDashed?: boolean
}

export type InferredSchematicCircleProps = z.input<typeof schematicCircleProps>

expectTypesMatch<SchematicCircleProps, z.input<typeof schematicCircleProps>>(
  true,
)
