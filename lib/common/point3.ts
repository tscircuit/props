import { distance } from "@tscircuit/soup"
import { z } from "zod"

export const point3 = z.object({
  x: distance,
  y: distance,
  z: distance,
})
