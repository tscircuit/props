import { distance, layer_ref, type LayerRefInput } from "circuit-json"
import { commonLayoutProps, type CommonLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ViaProps extends CommonLayoutProps {
  name?: string
  fromLayer: LayerRefInput
  toLayer: LayerRefInput
  holeDiameter: number | string
  outerDiameter: number | string
  connectsTo?: string | string[]
}

export const viaProps = commonLayoutProps.extend({
  name: z.string().optional(),
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance,
  outerDiameter: distance,
  connectsTo: z.string().or(z.array(z.string())).optional(),
})
export type InferredViaProps = z.input<typeof viaProps>
expectTypesMatch<ViaProps, InferredViaProps>(true)
