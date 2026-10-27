import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

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
}

export const assemblyDrawingDimensionProps = z
  .object({
    name: z.string().optional(),
    edgeRef: z.string().trim().min(1).optional(),
    widthOfView: z.boolean().optional(),
    heightOfView: z.boolean().optional(),
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
  })

export type InferredAssemblyDrawingDimensionProps = z.input<
  typeof assemblyDrawingDimensionProps
>
expectTypesMatch<
  AssemblyDrawingDimensionProps,
  z.input<typeof assemblyDrawingDimensionProps>
>(true)
