import { type LayerRef, layer_ref } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface CadAssemblyProps {
  /**
   * The layer that the CAD assembly is designed for. If you set this to "top"
   * then it means the children were intended to represent the top layer. If
   * the <chip /> with this assembly is moved to the bottom layer, then the
   * components will be mirrored.
   *
   * Generally, you shouldn't set this except where it can help prevent
   * confusion because you have a complex multi-layer assembly. Default is
   * "top" and this is most intuitive.
   */
  originalLayer?: LayerRef
}

export const cadassemblyProps = z.object({
  originalLayer: layer_ref.default("top").optional(),
})

export type CadAssemblyPropsInput = z.input<typeof cadassemblyProps>
type InferredCadAssemblyProps = z.infer<typeof cadassemblyProps>
expectTypesMatch<InferredCadAssemblyProps, CadAssemblyProps>(true)
