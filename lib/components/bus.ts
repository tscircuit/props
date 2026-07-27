import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type BusPcbFanoutDirection = "left" | "right" | "up" | "down"

export type BusPcbFanoutPreferredExit =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "top_left"
  | "top_right"
  | "bottom_left"
  | "bottom_right"

/**
 * Declares a group of connections that an autorouter should keep together.
 * Each connection may be a trace name or a port selector.
 */
export interface BusProps {
  name?: string
  /** Trace names or port selectors for the connections in the bus. */
  connections: string[]
  /** Direction in which this complete bus should leave its source footprint. */
  pcbFanoutDirection?: BusPcbFanoutDirection
  /** Board edge or corner toward which this complete bus should fan out. */
  pcbFanoutPreferredExit?: BusPcbFanoutPreferredExit
}

export const busProps = z.object({
  name: z.string().optional(),
  connections: z.array(z.string()).min(2),
  pcbFanoutDirection: z.enum(["left", "right", "up", "down"]).optional(),
  pcbFanoutPreferredExit: z
    .enum([
      "left",
      "right",
      "top",
      "bottom",
      "top_left",
      "top_right",
      "bottom_left",
      "bottom_right",
    ])
    .optional(),
})

type InferredBusProps = z.input<typeof busProps>
expectTypesMatch<BusProps, InferredBusProps>(true)
