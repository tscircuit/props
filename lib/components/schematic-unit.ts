import { distance, rotation } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/**
 * Props for an independently placeable schematic representation of one part
 * of a parent physical component.
 */
export interface SchematicUnitProps {
  /** Unit suffix displayed with the parent component reference, such as "A". */
  unit: string
  /** Name of the schematic symbol used to render this unit. */
  symbolName: string
  /** Maps symbol port names to pin names on the parent component. */
  pinMapping: Record<string, string>
  schX?: string | number
  schY?: string | number
  schRotation?: string | number
}

export const schematicUnitProps = z.object({
  unit: z.string().min(1),
  symbolName: z.string().min(1),
  pinMapping: z
    .record(z.string().min(1), z.string().min(1))
    .refine((mapping) => Object.keys(mapping).length > 0, {
      message: "pinMapping must contain at least one symbol port mapping",
    }),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
})

export type InferredSchematicUnitProps = z.input<typeof schematicUnitProps>

expectTypesMatch<SchematicUnitProps, z.input<typeof schematicUnitProps>>(true)
