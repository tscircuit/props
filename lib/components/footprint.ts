import { type LayerRef, layer_ref } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface FootprintProps {
  children?: any
  /**
   * The layer that the footprint is designed for. If you set this to "top"
   * then it means the children were intended to represent the top layer. If
   * the <chip /> with this footprint is moved to the bottom layer, then the
   * components will be mirrored.
   *
   * Generally, you shouldn't set this except where it can help prevent
   * confusion because you have a complex multi-layer footprint. Default is
   * "top" and this is most intuitive.
   */
  originalLayer?: LayerRef
}

export const footprintProps = z.object({
  children: z.any().optional(),
  originalLayer: layer_ref.default("top").optional(),
})

export type FootprintPropsInput = z.input<typeof footprintProps>
type InferredFootprintProps = z.infer<typeof footprintProps>
expectTypesMatch<InferredFootprintProps, FootprintProps>(true)
