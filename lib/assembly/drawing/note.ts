import {
  assemblyDrawingPaperPosition,
  validateDrawingPaperPosition,
  type AssemblyDrawingPaperPositionProps,
} from "./paper-position"
import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
/** Plain text nested inside a drawing page or view. */
export interface AssemblyDrawingNoteProps
  extends AssemblyDrawingPaperPositionProps {
  name?: string
  text: string
  /** View selector for offsets when authored on a page. Omit inside a view to use that parent. Core must reject missing/ambiguous/cross-page views. */
  viewRef?: string
  /** Paper-space text size; defaults to 2.7mm. Must be positive. */
  fontSize?: Distance
}
export const assemblyDrawingNoteProps = z
  .object({
    name: z.string().optional(),
    text: z
      .string()
      .refine((s) => s.trim().length > 0, "Text must not be blank"),
    ...assemblyDrawingPaperPosition.shape,
    viewRef: z.string().trim().min(1).optional(),
    fontSize: distance.pipe(z.number().finite().positive()).default(2.7),
  })
  .superRefine(validateDrawingPaperPosition)
expectTypesMatch<
  AssemblyDrawingNoteProps,
  z.input<typeof assemblyDrawingNoteProps>
>(true)
