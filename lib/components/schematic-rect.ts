import { distance, point, rotation } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"

export const schematicRectProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  width: distance,
  height: distance,
  rotation: rotation.default(0),
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
  cornerRadius: distance.optional(),
})

export interface SchematicRectProps {
  schX?: Distance
  schY?: Distance
  width: Distance
  height: Distance
  rotation?: number | string
  strokeWidth?: Distance
  color?: string
  isFilled?: boolean
  fillColor?: string
  isDashed?: boolean
  cornerRadius?: Distance
}

export type InferredSchematicRectProps = z.input<typeof schematicRectProps>

expectTypesMatch<SchematicRectProps, z.input<typeof schematicRectProps>>(true)
