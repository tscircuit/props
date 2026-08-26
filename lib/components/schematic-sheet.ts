import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export type SchematicSheetSize = "A4" | "ANSI_B"

export interface SchematicSheetProps {
  name: string
  displayName: string
  sheetIndex?: number
  /** Sheet size used to render the schematic. Defaults to A4. */
  sheetSize?: SchematicSheetSize
  children?: any
}

export const schematicSheetProps = z.object({
  name: z.string(),
  displayName: z.string(),
  sheetIndex: z.number().optional(),
  sheetSize: z.enum(["A4", "ANSI_B"]).default("A4"),
  children: z.any().optional(),
})

export type InferredSchematicSheetProps = z.input<typeof schematicSheetProps>

expectTypesMatch<SchematicSheetProps, z.input<typeof schematicSheetProps>>(true)
