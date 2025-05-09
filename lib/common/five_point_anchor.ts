import { z } from "zod"

export const five_point_anchor = z.enum([
  "center",
  "left",
  "right",
  "top",
  "bottom",
])
