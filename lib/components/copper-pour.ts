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
  coveredWithSolderMask?: boolean
}

export const copperPourProps = z.object({
  name: z.string().optional(),
  layer: layer_ref,
  connectsTo: z.string(),
  padMargin: distance.optional(),
  traceMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional().default(false),
})

expectTypesMatch<CopperPourProps, z.input<typeof copperPourProps>>(true)

export type CopperPourPropsInput = z.input<typeof copperPourProps>
