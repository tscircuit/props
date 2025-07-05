import { distance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export const schematicCellProps = z.object({
  children: z.string(),
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
  fontSize: distance.optional(),
})

export interface SchematicCellProps {
  children: string
  horizontalAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "middle" | "bottom"
  fontSize?: number | string
}

expectTypesMatch<SchematicCellProps, z.input<typeof schematicCellProps>>(true)
