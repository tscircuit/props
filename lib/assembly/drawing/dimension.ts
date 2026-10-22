import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A linear dimension of a model-defined edge or the visible geometry's extent.
 * Targets use CAD world coordinates (+Z up, mm). Placement uses paper mm.
 */
export interface AssemblyDrawingDimensionProps {
  name?: string
  /** Selector for a model-defined named edge, e.g. .tube > .outer_top; never a preset or mesh edge index. */
  edgeRef?: string
  /** Dimension the selected geometry's horizontal extent in the view's model axes. Conflicts with edgeRef, heightOfView=true, and explicit orientation. */
  widthOfView?: boolean
  /** Dimension the selected geometry's vertical extent in the view's model axes. Conflicts with edgeRef, widthOfView=true, and explicit orientation. */
  heightOfView?: boolean
  /** Named-edge dimensions only: aligned measures true 3D length; horizontal/vertical measure the view-axis component. Defaults to aligned. */
  orientation?: "horizontal" | "vertical" | "aligned"
  /** Signed offset of the dimension line in paper mm; unit strings accepted. Defaults to 8mm. */
  offset?: Distance
  /** Number of decimal places in the measured mm value, 0–6. Defaults to 1. */
  precision?: number
}

export const assemblyDrawingDimensionProps = z
  .object({
    name: z.string().optional(),
    edgeRef: z.string().trim().min(1).optional(),
    widthOfView: z.boolean().optional(),
    heightOfView: z.boolean().optional(),
    orientation: z.enum(["horizontal", "vertical", "aligned"]).optional(),
    offset: distance.pipe(z.number().finite()).default(8),
    precision: z.number().int().min(0).max(6).default(1),
  })
  .superRefine((dimension, ctx) => {
    const targets = [
      dimension.edgeRef !== undefined,
      dimension.widthOfView === true,
      dimension.heightOfView === true,
    ].filter(Boolean).length
    if (targets !== 1)
      ctx.addIssue({
        code: "custom",
        message:
          "Specify exactly one of edgeRef, widthOfView=true, or heightOfView=true",
      })
    if (
      dimension.orientation !== undefined &&
      (dimension.widthOfView === true || dimension.heightOfView === true)
    )
      ctx.addIssue({
        code: "custom",
        path: ["orientation"],
        message: "View extent dimensions infer orientation; omit orientation",
      })
  })
  .transform((dimension) => ({
    ...dimension,
    orientation:
      dimension.widthOfView === true
        ? ("horizontal" as const)
        : dimension.heightOfView === true
          ? ("vertical" as const)
          : (dimension.orientation ?? "aligned"),
  }))

export type InferredAssemblyDrawingDimensionProps = z.input<
  typeof assemblyDrawingDimensionProps
>
expectTypesMatch<
  AssemblyDrawingDimensionProps,
  z.input<typeof assemblyDrawingDimensionProps>
>(true)
