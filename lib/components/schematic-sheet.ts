import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface SchematicSheetProps {
  name: string
  displayName: string
  children?: any
}

export const schematicSheetProps = z.object({
  name: z.string(),
  displayName: z.string(),
  children: z.any().optional(),
})

export type InferredSchematicSheetProps = z.input<typeof schematicSheetProps>

expectTypesMatch<SchematicSheetProps, z.input<typeof schematicSheetProps>>(true)
