import { z } from "zod"
export const direction = z.enum(["up", "down", "left", "right"])
export type Direction = "up" | "down" | "left" | "right"
