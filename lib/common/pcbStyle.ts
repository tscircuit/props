import { distance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { textureSchema } from "./texture"

export interface PcbStyle {
  silkscreenFontSize?: string | number
  viaPadDiameter?: string | number
  viaHoleDiameter?: string | number
  silkscreenTextPosition?:
    | "centered"
    | "outside"
    | "none"
    | {
        offsetX: number
        offsetY: number
      }
  silkscreenTextVisibility?: "hidden" | "visible" | "inherit"
  texture?: z.infer<typeof textureSchema>
}

export const pcbStyle = z
  .object({
    silkscreenFontSize: distance.optional(),
    viaPadDiameter: distance.optional(),
    viaHoleDiameter: distance.optional(),
    silkscreenTextPosition: z
      .union([
        z.enum(["centered", "outside", "none"]),
        z.object({
          offsetX: z.number(),
          offsetY: z.number(),
        }),
      ])
      .optional(),
    silkscreenTextVisibility: z
      .enum(["hidden", "visible", "inherit"])
      .optional(),
  })
  .and(z.object({ texture: textureSchema.optional() }))

expectTypesMatch<PcbStyle, z.input<typeof pcbStyle>>(true)
