import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"

/** Choose exactly one position per axis. Absolute positions are relative to the
 * drawing page origin; offsets are relative to the enclosing/referenced view center.
 * All values are paper mm or distance strings; +X right, +Y up. No implicit axis. */
export interface AssemblyDrawingPaperPositionProps {
  paperX?: Distance
  paperY?: Distance
  xOffsetFromViewCenter?: Distance
  yOffsetFromViewCenter?: Distance
}
const coordinate = distance.pipe(z.number().finite())
export const assemblyDrawingPaperPosition = z.object({
  paperX: coordinate.optional(),
  paperY: coordinate.optional(),
  xOffsetFromViewCenter: coordinate.optional(),
  yOffsetFromViewCenter: coordinate.optional(),
})
export function validateDrawingPaperPosition(
  position: z.output<typeof assemblyDrawingPaperPosition>,
  ctx: z.RefinementCtx,
) {
  for (const [absolute, relative] of [
    ["paperX", "xOffsetFromViewCenter"],
    ["paperY", "yOffsetFromViewCenter"],
  ] as const) {
    if (
      (position[absolute] !== undefined) ===
      (position[relative] !== undefined)
    )
      ctx.addIssue({
        code: "custom",
        path: [absolute],
        message: `Provide exactly one of ${absolute} or ${relative}`,
      })
  }
}
