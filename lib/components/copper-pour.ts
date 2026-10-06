import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { layer_ref, type LayerRefInput } from "circuit-json"

export interface CopperPourProps {
  name?: string
  layer: LayerRefInput
  connectsTo: string
  /**
   * Fill with a 45-degree crosshatch (defaults: 0.25mm copper width, 1mm pitch).
   * Preserves solid copper around boundaries and connections. Defaults to false.
   */
  crosshatch?: boolean
  /** Repeat spacing perpendicular to the hatch strips. Defaults to 1mm when crosshatch is enabled. */
  crosshatchPitch?: Distance
  /** Copper strip width, also used for the solid rim. Defaults to 0.25mm; must be less than the pitch when crosshatch is enabled. */
  crosshatchWidth?: Distance
  /**
   * Reserves the pour region during autorouting so unrelated traces do not
   * split it. Vias may still cross the region using antipads.
   */
  unbroken?: boolean
  padMargin?: Distance
  traceMargin?: Distance
  clearance?: Distance
  boardEdgeMargin?: Distance
  cutoutMargin?: Distance
  useThermalReliefs?: boolean
  outline?: Point[]
  coveredWithSolderMask?: boolean
}

export const copperPourProps = z
  .object({
    name: z.string().optional(),
    layer: layer_ref,
    connectsTo: z.string(),
    crosshatch: z.boolean().optional(),
    crosshatchPitch: distance.pipe(z.number().finite().positive()).optional(),
    crosshatchWidth: distance.pipe(z.number().finite().positive()).optional(),
    unbroken: z
      .boolean()
      .optional()
      .describe(
        "Reserves the pour region during autorouting so unrelated traces do not split it. Vias may still cross the region using antipads.",
      ),
    padMargin: distance.optional(),
    traceMargin: distance.optional(),
    clearance: distance.optional(),
    boardEdgeMargin: distance.optional(),
    cutoutMargin: distance.optional(),
    useThermalReliefs: z.boolean().optional(),
    outline: z.array(point).optional(),
    coveredWithSolderMask: z.boolean().optional().default(true),
  })
  .superRefine((props, ctx) => {
    if (
      props.crosshatch &&
      (props.crosshatchWidth ?? 0.25) >= (props.crosshatchPitch ?? 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["crosshatchWidth"],
        message: "crosshatchWidth must be less than crosshatchPitch",
      })
    }
  })

expectTypesMatch<CopperPourProps, z.input<typeof copperPourProps>>(true)

export type CopperPourPropsInput = z.input<typeof copperPourProps>
