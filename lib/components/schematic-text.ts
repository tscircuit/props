import { distance, rotation } from "circuit-json"
import { z } from "zod"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { fivePointAnchor } from "lib/common/fivePointAnchor"
import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"

export const schematicTextSpan = z.object({
  text: z.string().min(1),
  overline: z.boolean().optional(),
})

export interface SchematicTextSpan {
  text: string
  /** Draw an overline above this span, typically for an active-low signal. */
  overline?: boolean
}

expectTypesMatch<SchematicTextSpan, z.input<typeof schematicTextSpan>>(true)

export const schematicTextProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  /** Plain text, or ordered spans when only part of the text needs an overline. */
  text: z.union([z.string(), z.array(schematicTextSpan).min(1)]),
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
  /** Plain text, or ordered spans when only part of the text needs an overline. */
  text: string | SchematicTextSpan[]
  fontSize?: number
  anchor?: z.infer<typeof fivePointAnchor> | z.infer<typeof ninePointAnchor>
  color?: string
  schRotation?: number | string
}

export type InferredSchematicTextProps = z.input<typeof schematicTextProps>

expectTypesMatch<SchematicTextProps, z.input<typeof schematicTextProps>>(true)
