import { distance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PcbStyle {
  silkscreenFontSize?: string | number
}

export const pcbStyle = z.object({
  silkscreenFontSize: distance.optional(),
})

expectTypesMatch<PcbStyle, z.input<typeof pcbStyle>>(true)
