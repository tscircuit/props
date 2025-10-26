import { layer_ref, length } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { z } from "zod"

export const copperTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: ninePointAnchor.default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  layers: z.array(layer_ref).optional(),
})
export type CopperTextProps = z.input<typeof copperTextProps>
