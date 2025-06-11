import { z } from "zod"

export const fivePointAnchor = z.enum([
  "center",
  "left",
  "right",
  "top",
  "bottom",
])
