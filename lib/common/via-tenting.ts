import { z } from "zod"

export const viaTenting = z
  .union([
    z.boolean(),
    z.enum([
      "both_sides",
      "top_and_bottom_tented",
      "top_tented",
      "bottom_tented",
      "exposed",
    ]),
  ])
  .transform((value) => {
    if (value === true || value === "both_sides") {
      return "top_and_bottom_tented" as const
    }
    if (value === false) return "exposed" as const
    return value
  })

export type ViaTenting = z.input<typeof viaTenting>
