import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export type SchematicSheetPaperSize = "A4" | "ANSI_B"

export interface SchematicSheetProps {
  name: string
  displayName: string
  sheetIndex?: number
  /** Paper size used to render the schematic sheet. Defaults to A4. */
  paperSize?: SchematicSheetPaperSize
  children?: any
}

export const schematicSheetProps = z.object({
  name: z.string(),
  displayName: z.string(),
  sheetIndex: z.number().optional(),
  paperSize: z.enum(["A4", "ANSI_B"]).default("A4"),
  children: z.any().optional(),
})

export type InferredSchematicSheetProps = z.input<typeof schematicSheetProps>

expectTypesMatch<SchematicSheetProps, z.input<typeof schematicSheetProps>>(true)
