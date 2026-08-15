import { type LayerRefInput, layer_ref } from "circuit-json"
import { type Distance, distance } from "lib/common/distance"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface CopperPourProps {
  name?: string
  layer: LayerRefInput
  connectsTo: string
  unbroken?: boolean
  padMargin?: Distance
  traceMargin?: Distance
  clearance?: Distance
  boardEdgeMargin?: Distance
  cutoutMargin?: Distance
  thermalRelief?: {
    spokeWidth: Distance
    spokeCount?: number
  }
  outline?: Point[]
  coveredWithSolderMask?: boolean
}

export const copperPourProps = z.object({
  name: z.string().optional(),
  layer: layer_ref,
  connectsTo: z.string(),
  unbroken: z.boolean().optional(),
  padMargin: distance.optional(),
  traceMargin: distance.optional(),
  clearance: distance.optional(),
  boardEdgeMargin: distance.optional(),
  cutoutMargin: distance.optional(),
  thermalRelief: z
    .object({
      spokeWidth: distance.refine((spokeWidth) => spokeWidth > 0, {
        message: "Thermal relief spoke width must be greater than 0",
      }),
      spokeCount: z.number().int().positive().optional(),
    })
    .optional(),
  outline: z.array(point).optional(),
  coveredWithSolderMask: z.boolean().optional().default(true),
})

expectTypesMatch<CopperPourProps, z.input<typeof copperPourProps>>(true)

export type CopperPourPropsInput = z.input<typeof copperPourProps>
