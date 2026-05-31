import { distance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface SchematicSectionProps {
  displayName?: string
  name: string
  sectionTitleFontSize?: number | string
}

export const schematicSectionProps = z.object({
  displayName: z.string().optional(),
  name: z.string(),
  sectionTitleFontSize: distance.optional(),
})

export type InferredSchematicSectionProps = z.input<
  typeof schematicSectionProps
>

expectTypesMatch<SchematicSectionProps, z.input<typeof schematicSectionProps>>(
  true,
)
