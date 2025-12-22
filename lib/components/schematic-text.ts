import { distance, rotation } from "circuit-json"
import { z } from "zod"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { fivePointAnchor } from "lib/common/fivePointAnchor"
import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"

export const schematicTextProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  text: z.string(),
  fontSize: z.number().default(1),
  anchor: z
    .union([fivePointAnchor.describe("legacy"), ninePointAnchor])
    .default("center"),
  color: z.string().default("#000000"),
  schRotation: rotation.default(0),
})

export interface SchematicTextProps {
  schX?: Distance
  schY?: Distance
  text: string
  fontSize?: number
  anchor?: z.infer<typeof fivePointAnchor> | z.infer<typeof ninePointAnchor>
  color?: string
  schRotation?: number | string
}

export type InferredSchematicTextProps = z.input<typeof schematicTextProps>

expectTypesMatch<SchematicTextProps, z.input<typeof schematicTextProps>>(true)
