import { layer_ref, length } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { z } from "zod"

export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: ninePointAnchor.default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  /**
   * If true, text will knock out underlying silkscreen
   */
  isKnockout: z.boolean().optional(),
  knockoutPadding: z
    .object({
      left: length,
      top: length,
      bottom: length,
      right: length,
    })
    .optional(),
  layers: z.array(layer_ref).optional(),
})
export type SilkscreenTextProps = z.input<typeof silkscreenTextProps>
