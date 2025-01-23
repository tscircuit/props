import { distance, layer_ref } from "circuit-json"
import { commonLayoutProps } from "lib/common/layout"
import type { z } from "zod"

export const viaProps = commonLayoutProps.extend({
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance,
  outerDiameter: distance,
})
export type ViaProps = z.input<typeof viaProps>
