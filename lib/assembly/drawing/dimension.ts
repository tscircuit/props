import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

const dimensionAnchor = z.enum(["center", "left", "right", "top", "bottom"])
export type AssemblyDrawingDimensionAnchor = z.infer<typeof dimensionAnchor>

/** Authoring intent for a dimension of model geometry or a part view's extent.
 * Core resolves geometry, measurement text and paper placement in a follow-up.
 */
export interface AssemblyDrawingDimensionProps {
  /** Stable circuit identity; does not choose a measurement or its formatting. */
  name?: string
  /** Selector for one model-defined named edge or outline, e.g. .tube > .inner_top; never a preset or mesh edge index. */
  edgeRef?: string
  /** Request the selected geometry's width in the view. Conflicts with edgeRef and heightOfView=true. */
  widthOfView?: boolean
  /** Request the selected geometry's height in the view. Conflicts with edgeRef and widthOfView=true. */
  heightOfView?: boolean
  /** Paired selectors for holes, boards or named model outlines. Both are required; conflicts with edgeRef and true view targets. */
  fromRef?: string
  toRef?: string
  /** Anchor on the reference's projected bounds. Defaults to center; directions are relative to the drawing view, not CAD world axes. */
  fromAnchor?: AssemblyDrawingDimensionAnchor
  toAnchor?: AssemblyDrawingDimensionAnchor
  /** Measure separation on the view's horizontal (x) or vertical (y) axis. Omitted chooses the larger separation, x on ties. Requires paired references. */
  axis?: "x" | "y"
}

export const assemblyDrawingDimensionProps = z
  .object({
    name: z.string().optional(),
    edgeRef: z.string().trim().min(1).optional(),
    widthOfView: z.boolean().optional(),
    heightOfView: z.boolean().optional(),
    fromRef: z.string().trim().min(1).optional(),
    toRef: z.string().trim().min(1).optional(),
    fromAnchor: dimensionAnchor.optional(),
    toAnchor: dimensionAnchor.optional(),
    axis: z.enum(["x", "y"]).optional(),
  })
  .superRefine((dimension, ctx) => {
    const targets = [
      dimension.edgeRef !== undefined,
      dimension.widthOfView === true,
      dimension.heightOfView === true,
      dimension.fromRef !== undefined || dimension.toRef !== undefined,
    ].filter(Boolean).length
    if (targets !== 1)
      ctx.addIssue({
        code: "custom",
        message:
          "Specify exactly one of edgeRef, widthOfView=true, heightOfView=true, or paired fromRef/toRef",
      })
    if ((dimension.fromRef === undefined) !== (dimension.toRef === undefined))
      ctx.addIssue({
        code: "custom",
        message: "fromRef and toRef must be specified together",
      })
    if (
      (dimension.axis !== undefined ||
        dimension.fromAnchor !== undefined ||
        dimension.toAnchor !== undefined) &&
      (dimension.fromRef === undefined || dimension.toRef === undefined)
    )
      ctx.addIssue({
        code: "custom",
        message: "axis, fromAnchor and toAnchor require paired fromRef/toRef",
      })
  })

export type InferredAssemblyDrawingDimensionProps = z.input<
  typeof assemblyDrawingDimensionProps
>
expectTypesMatch<
  AssemblyDrawingDimensionProps,
  z.input<typeof assemblyDrawingDimensionProps>
>(true)
