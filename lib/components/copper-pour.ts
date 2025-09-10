import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { layer_ref, type LayerRefInput } from "circuit-json"

export interface CopperPourProps {
  name?: string
  layer: LayerRefInput
  connectsTo: string
  padMargin?: Distance
  traceMargin?: Distance
}

export const copperPourProps = z.object({
  name: z.string().optional(),
  layer: layer_ref,
  connectsTo: z.string(),
  padMargin: distance.optional(),
  traceMargin: distance.optional(),
})

expectTypesMatch<CopperPourProps, z.input<typeof copperPourProps>>(true)

export type CopperPourPropsInput = z.input<typeof copperPourProps>
