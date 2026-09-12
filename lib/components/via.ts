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
  /**
   * Overrides the owning board's viaTenting default. True tents both faces;
   * false exposes both. An object must specify both top and bottom booleans.
   * Parsed values are preserved; omitted stays undefined for board inheritance.
   * Tenting covers the via with solder mask without filling or plugging it.
   */
  tented?: boolean | { top: boolean; bottom: boolean }
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
  tented: z
    .union([z.boolean(), z.object({ top: z.boolean(), bottom: z.boolean() })])
    .optional()
    .describe(
      "Per-via solder mask coverage overriding the owning board's viaTenting default. True tents both faces, false exposes both, or specify both top and bottom booleans. Values are preserved; omitted stays undefined for inheritance. Does not fill or plug the via.",
    ),
})
export type InferredViaProps = z.input<typeof viaProps>
expectTypesMatch<ViaProps, InferredViaProps>(true)
