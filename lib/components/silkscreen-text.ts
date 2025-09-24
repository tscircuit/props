import { layer_ref, length } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { z } from "zod"

export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: ninePointAnchor.default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  isKnockout: z.boolean().optional(),
  knockoutPadding: length.optional(),
  knockoutPaddingLeft: length.optional(),
  knockoutPaddingRight: length.optional(),
  knockoutPaddingTop: length.optional(),
  knockoutPaddingBottom: length.optional(),
  knockoutCornerRadius: length.optional(),
  knockoutBorderWidth: length.optional(),
  knockoutColor: z.string().optional(),
  layers: z.array(layer_ref).optional(),
})
export type SilkscreenTextProps = z.input<typeof silkscreenTextProps>
