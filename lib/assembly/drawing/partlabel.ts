import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import {
  assemblyDrawingSelection,
  hasAssemblyDrawingSelection,
  type AssemblyDrawingSelection,
} from "./stage"
/** A leader nested inside a partview, with an explicit world anchor and paper text position. */
export interface AssemblyDrawingPartLabelProps
  extends AssemblyDrawingSelection {
  name?: string
  text: string
  /** Assembled CAD-world mm (+Z up), or distance strings; follows the selected parts' drawing translation. */
  anchor: { x: Distance; y: Distance; z: Distance }
  /** Fixed text baseline in page-centered paper mm (+X right, +Y up). */
  paperX: Distance
  paperY: Distance
}
const coordinate = distance.pipe(z.number().finite())
export const assemblyDrawingPartLabelProps = assemblyDrawingSelection
  .extend({
    name: z.string().optional(),
    text: z
      .string()
      .refine((s) => s.trim().length > 0, "Text must not be blank"),
    anchor: z.object({ x: coordinate, y: coordinate, z: coordinate }),
    paperX: coordinate,
    paperY: coordinate,
  })
  .refine(
    hasAssemblyDrawingSelection,
    "Part label requires selected parts or stages",
  )
expectTypesMatch<
  AssemblyDrawingPartLabelProps,
  z.input<typeof assemblyDrawingPartLabelProps>
>(true)
