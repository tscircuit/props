import { distance, point } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"
import type { Point } from "lib/common/point"

export const schematicPathProps = z.object({
  points: z.array(point).optional(),
  svgPath: z.string().optional(),
  strokeWidth: distance.optional(),
  strokeColor: z.string().optional(),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})

export interface SchematicPathProps {
  points?: Point[]
  svgPath?: string
  strokeWidth?: Distance
  strokeColor?: string
  isFilled?: boolean
  fillColor?: "red" | "blue"
}

export type InferredSchematicPathProps = z.input<typeof schematicPathProps>

expectTypesMatch<SchematicPathProps, z.input<typeof schematicPathProps>>(true)
