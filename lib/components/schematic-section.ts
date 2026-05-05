import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface SchematicSectionProps {
  displayName?: string
  referenceName: string
}

export const schematicSectionProps = z.object({
  displayName: z.string().optional(),
  referenceName: z.string(),
})

export type InferredSchematicSectionProps = z.input<
  typeof schematicSectionProps
>

expectTypesMatch<SchematicSectionProps, z.input<typeof schematicSectionProps>>(
  true,
)
