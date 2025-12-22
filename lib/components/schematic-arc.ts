import { distance, point, rotation } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import type { Point } from "lib/common/point"
import type { Distance } from "lib/common/distance"

export const schematicArcProps = z.object({
  center: point,
  radius: distance,
  startAngleDegrees: rotation,
  endAngleDegrees: rotation,
  direction: z
    .enum(["clockwise", "counterclockwise"])
    .default("counterclockwise"),
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})

export interface SchematicArcProps {
  center: Point
  radius: Distance
  startAngleDegrees: number | string
  endAngleDegrees: number | string
  direction?: "clockwise" | "counterclockwise"
  strokeWidth?: Distance
  color?: string
  isDashed?: boolean
}

export type InferredSchematicArcProps = z.input<typeof schematicArcProps>

expectTypesMatch<SchematicArcProps, z.input<typeof schematicArcProps>>(true)
