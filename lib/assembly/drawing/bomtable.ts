import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  type NinePointAnchor,
  ninePointAnchor,
} from "lib/common/ninePointAnchor"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A numbered parts list on a drawing page. Item numbers are assigned in BOM
 * order and are the numbers that balloons display. */
export interface AssemblyDrawingBomTableProps {
  name?: string
  /** Selector for the cable or subassembly whose direct BOM children are the rows. Omit to list the top-level BOM of the assembly that owns the page. */
  partRef?: string
  /** Where the anchorAlignment point of the table sits, relative to the drawing page anchor, mm; +X right, +Y up. */
  paperX: Distance
  paperY: Distance
  /** Which point of the table paperX/paperY locates. Required: a table's position is never implied. */
  anchorAlignment: NinePointAnchor
}

export const assemblyDrawingBomTableProps = z.object({
  name: z.string().optional(),
  partRef: z.string().trim().min(1).optional(),
  paperX: distance.pipe(z.number().finite()),
  paperY: distance.pipe(z.number().finite()),
  anchorAlignment: ninePointAnchor,
})

expectTypesMatch<
  AssemblyDrawingBomTableProps,
  z.input<typeof assemblyDrawingBomTableProps>
>(true)
