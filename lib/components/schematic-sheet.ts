import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface SchematicSheetProps {
  name: string
  displayName: string
  sheetIndex?: number
  children?: any
}

export const schematicSheetProps = z.object({
  name: z.string(),
  displayName: z.string(),
  sheetIndex: z.number().optional(),
  children: z.any().optional(),
})

export type InferredSchematicSheetProps = z.input<typeof schematicSheetProps>

expectTypesMatch<SchematicSheetProps, z.input<typeof schematicSheetProps>>(true)
