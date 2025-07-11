import { distance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export const schematicCellProps = z.object({
  children: z.string().optional(),
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
  fontSize: distance.optional(),
  rowSpan: z.number().optional(),
  colSpan: z.number().optional(),
  width: distance.optional(),
  text: z.string().optional(),
})

export interface SchematicCellProps {
  children?: string
  horizontalAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "middle" | "bottom"
  fontSize?: number | string
  rowSpan?: number
  colSpan?: number
  width?: number | string
  text?: string
}

expectTypesMatch<SchematicCellProps, z.input<typeof schematicCellProps>>(true)
