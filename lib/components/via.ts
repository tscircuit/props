import { distance, layer_ref, type LayerRefInput } from "circuit-json"
import { commonLayoutProps, type CommonLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ViaProps extends CommonLayoutProps {
  name?: string
  fromLayer?: LayerRefInput
  toLayer?: LayerRefInput
  layers?: LayerRefInput[]
  holeDiameter?: number | string
  outerDiameter?: number | string
  connectsTo?: string | string[]
  netIsAssignable?: boolean
}

export const viaProps = commonLayoutProps.extend({
  name: z.string().optional(),
  fromLayer: layer_ref.optional(),
  toLayer: layer_ref.optional(),
  holeDiameter: distance.optional(),
  outerDiameter: distance.optional(),
  layers: z.array(layer_ref).optional(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  netIsAssignable: z.boolean().optional(),
})
export type InferredViaProps = z.input<typeof viaProps>
expectTypesMatch<ViaProps, InferredViaProps>(true)
