import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
export const direction = z.enum(["up", "down", "left", "right"])
export type Direction = "up" | "down" | "left" | "right"

export type DirectionAlongEdge =
  | "top-to-bottom"
  | "left-to-right"
  | "bottom-to-top"
  | "right-to-left"

export const directionAlongEdge = z.enum([
  "top-to-bottom",
  "left-to-right",
  "bottom-to-top",
  "right-to-left",
])

expectTypesMatch<Direction, z.infer<typeof direction>>(true)
expectTypesMatch<DirectionAlongEdge, z.infer<typeof directionAlongEdge>>(true)
