import { distance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PcbStyle {
  silkscreenFontSize?: string | number
  silkscreenTextPosition?:
    | "centered"
    | "outside"
    | "none"
    | {
        offsetX: number
        offsetY: number
      }
  silkscreenTextVisibility?: "hidden" | "visible" | "inherit"
}

export const pcbStyle = z.object({
  silkscreenFontSize: distance.optional(),
  silkscreenTextPosition: z
    .union([
      z.enum(["centered", "outside", "none"]),
      z.object({
        offsetX: z.number(),
        offsetY: z.number(),
      }),
    ])
    .optional(),
  silkscreenTextVisibility: z.enum(["hidden", "visible", "inherit"]).optional(),
})

expectTypesMatch<PcbStyle, z.input<typeof pcbStyle>>(true)
