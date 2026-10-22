import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A linear dimension of one authored named edge, nested in a part view.
 * The edge uses CAD world coordinates (+Z up, mm). Placement uses paper mm.
 */
export interface AssemblyDrawingDimensionProps {
  name?: string
  /** Stable semantic edge name on the selected part, e.g. overall_width; never a mesh edge index. */
  edgeRef: string
  /** Aligned measures true 3D length; horizontal/vertical measure the view-axis component. Defaults to aligned. */
  orientation?: "horizontal" | "vertical" | "aligned"
  /** Signed offset of the dimension line in paper mm; unit strings accepted. Defaults to 8mm. */
  offset?: Distance
  /** Number of decimal places in the measured mm value, 0–6. Defaults to 1. */
  precision?: number
}

export const assemblyDrawingDimensionProps = z.object({
  name: z.string().optional(),
  edgeRef: z.string().trim().min(1),
  orientation: z.enum(["horizontal", "vertical", "aligned"]).default("aligned"),
  offset: distance.pipe(z.number().finite()).default(8),
  precision: z.number().int().min(0).max(6).default(1),
})

export type InferredAssemblyDrawingDimensionProps = z.input<
  typeof assemblyDrawingDimensionProps
>
expectTypesMatch<
  AssemblyDrawingDimensionProps,
  z.input<typeof assemblyDrawingDimensionProps>
>(true)
