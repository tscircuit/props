import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
/** Plain text nested inside an assembly.drawing.page. */
export interface AssemblyDrawingNoteProps {
  name?: string
  text: string
  /** Left text baseline in page-centered paper mm (+X right, +Y up). Distance strings are accepted. */
  paperX: Distance
  paperY: Distance
  /** Paper-space text size; defaults to 2.7mm. Must be positive. */
  fontSize?: Distance
}
const coordinate = distance.pipe(z.number().finite())
export const assemblyDrawingNoteProps = z.object({
  name: z.string().optional(),
  text: z.string().refine((s) => s.trim().length > 0, "Text must not be blank"),
  paperX: coordinate,
  paperY: coordinate,
  fontSize: distance.pipe(z.number().finite().positive()).default(2.7),
})
expectTypesMatch<
  AssemblyDrawingNoteProps,
  z.input<typeof assemblyDrawingNoteProps>
>(true)
