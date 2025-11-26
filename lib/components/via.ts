import { distance, layer_ref, type LayerRefInput } from "circuit-json"
import { commonLayoutProps, type CommonLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ViaProps extends CommonLayoutProps {
  name?: string
  fromLayer: LayerRefInput
  toLayer: LayerRefInput
  holeDiameter?: number | string
  outerDiameter?: number | string
  connectsTo?: string | string[]
  netIsAssignable?: boolean
}

export const viaProps = commonLayoutProps.extend({
  name: z.string().optional(),
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance.default(0.3).optional(),
  outerDiameter: distance.default(0.6).optional(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  netIsAssignable: z.boolean().optional(),
})
export type InferredViaProps = z.input<typeof viaProps>
expectTypesMatch<ViaProps, InferredViaProps>(true)
