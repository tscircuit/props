import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  type NinePointAnchor,
  ninePointAnchor,
} from "lib/common/ninePointAnchor"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A pin-to-pin wiring list for one assembly.cable, one row per assembly.cablewire. */
export interface AssemblyDrawingWiringTableProps {
  name?: string
  /** Selector for the assembly.cable whose wires are listed. */
  cableRef: string
  /** Heading row spanning the table. Omitted draws no heading. */
  title?: string
  /** Where the anchorAlignment point of the table sits, relative to the drawing page anchor, mm; +X right, +Y up. */
  paperX: Distance
  paperY: Distance
  /** Which point of the table paperX/paperY locates. Required: a table's position is never implied. */
  anchorAlignment: NinePointAnchor
}

export const assemblyDrawingWiringTableProps = z.object({
  name: z.string().optional(),
  cableRef: z.string().trim().min(1),
  title: z
    .string()
    .refine((s) => s.trim().length > 0, "Title must not be blank")
    .optional(),
  paperX: distance.pipe(z.number().finite()),
  paperY: distance.pipe(z.number().finite()),
  anchorAlignment: ninePointAnchor,
})

expectTypesMatch<
  AssemblyDrawingWiringTableProps,
  z.input<typeof assemblyDrawingWiringTableProps>
>(true)
