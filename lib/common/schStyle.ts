import { distance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface SchStyle {
  defaultPassiveSize?: "xs" | "sm" | "md" | string | number
  defaultCapacitorOrientation?: "vertical" | "none"
  inversionCircle?: boolean
}

export const schStyle = z.object({
  defaultPassiveSize: z
    .union([z.enum(["xs", "sm", "md"]), distance])
    .optional(),
  defaultCapacitorOrientation: z.enum(["vertical", "none"]).optional(),
  inversionCircle: z.boolean().optional(),
})

expectTypesMatch<SchStyle, z.input<typeof schStyle>>(true)
