import { distance } from "circuit-json"
import { z } from "zod"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { expectTypesMatch } from "lib/typecheck"

export const schematicTableCellProps = z.object({
  text: z.string(),
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
  fontSize: distance.optional(),
})

export interface SchematicTableCellProps {
  text: string
  horizontalAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "middle" | "bottom"
  fontSize?: number | string
}

expectTypesMatch<
  SchematicTableCellProps,
  z.input<typeof schematicTableCellProps>
>(true)

export const schematicTableProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  rows: z.array(z.array(schematicTableCellProps)),
  columnWidths: z.array(distance),
  rowHeights: z.array(distance),
  cellPadding: distance.optional(),
  borderWidth: distance.optional(),
  anchor: ninePointAnchor.optional(),
})

export interface SchematicTableProps {
  schX?: number | string
  schY?: number | string
  rows: SchematicTableCellProps[][]
  columnWidths: (number | string)[]
  rowHeights: (number | string)[]
  cellPadding?: number | string
  borderWidth?: number | string
  anchor?: z.infer<typeof ninePointAnchor>
}

expectTypesMatch<SchematicTableProps, z.input<typeof schematicTableProps>>(true)
