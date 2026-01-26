import { point } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import type { Point } from "lib/common/point"

export const schematicPathProps = z.object({
  points: z.array(point),
  svgPath: z.string().optional(),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})

export interface SchematicPathProps {
  points: Point[]
  svgPath?: string
  isFilled?: boolean
  fillColor?: "red" | "blue"
}

export type InferredSchematicPathProps = z.input<typeof schematicPathProps>

expectTypesMatch<SchematicPathProps, z.input<typeof schematicPathProps>>(true)
