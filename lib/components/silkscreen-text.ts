import { length } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { nine_point_anchor } from "lib/common/nine_point_anchor"
import { z } from "zod"

export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: nine_point_anchor.default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
})
export type SilkscreenTextProps = z.input<typeof silkscreenTextProps>
