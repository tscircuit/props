import { z } from "zod"
import { distance, point } from "@tscircuit/soup"

export const boardProps = z.object({
  width: distance,
  height: distance,
  outline: z.array(point).optional(),
  pcbX: distance.optional().default(0),
  pcbY: distance.optional().default(0),
  layout: z.any().optional(),
  routingDisabled: z.boolean().optional(),
  children: z.any(),
})
export type BoardProps = z.input<typeof boardProps>
