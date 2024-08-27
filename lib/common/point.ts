import { distance } from "@tscircuit/soup"
import { z } from "zod"

export const point = z.object({
  x: distance,
  y: distance,
})

export type Point = { x: number | string; y: number | string }
