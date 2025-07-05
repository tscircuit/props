import { distance } from "circuit-json"
import { z } from "zod"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { expectTypesMatch } from "lib/typecheck"

export const schematicTableProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  children: z.any().optional(),
  cellPadding: distance.optional(),
  borderWidth: distance.optional(),
  anchor: ninePointAnchor.optional(),
  fontSize: distance.optional(),
})

export interface SchematicTableProps {
  schX?: number | string
  schY?: number | string
  children?: any
  cellPadding?: number | string
  borderWidth?: number | string
  anchor?: z.infer<typeof ninePointAnchor>
  fontSize?: number | string
}

expectTypesMatch<SchematicTableProps, z.input<typeof schematicTableProps>>(true)
