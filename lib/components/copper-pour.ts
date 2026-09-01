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

export const copperPourProps = z.object({
  name: z.string().optional(),
  layer: layer_ref,
  connectsTo: z.string(),
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

expectTypesMatch<CopperPourProps, z.input<typeof copperPourProps>>(true)

export type CopperPourPropsInput = z.input<typeof copperPourProps>
