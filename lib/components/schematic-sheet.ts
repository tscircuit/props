import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

export type SchematicSheetSize = "A4" | "ANSI_B"

export interface SchematicSheetProps {
  name: string
  displayName: string
  sheetIndex?: number
  /** Sheet size used to render the schematic. Defaults to A4. */
  sheetSize?: SchematicSheetSize
  /** Explicit schematic sheet width. Overrides the width from sheetSize. */
  sheetWidth?: Distance
  /** Explicit schematic sheet height. Overrides the height from sheetSize. */
  sheetHeight?: Distance
  children?: any
}

export const schematicSheetProps = z.object({
  name: z.string(),
  displayName: z.string(),
  sheetIndex: z.number().optional(),
  sheetSize: z.enum(["A4", "ANSI_B"]).default("A4"),
  sheetWidth: distance.pipe(z.number().positive()).optional(),
  sheetHeight: distance.pipe(z.number().positive()).optional(),
  children: z.any().optional(),
})

export type InferredSchematicSheetProps = z.input<typeof schematicSheetProps>

expectTypesMatch<SchematicSheetProps, z.input<typeof schematicSheetProps>>(true)
