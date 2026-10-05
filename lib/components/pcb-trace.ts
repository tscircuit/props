import { distance, route_hint_point } from "circuit-json"
import { z } from "zod"

export const pcbTraceProps = z.object({
  layer: z.string().optional(),
  thickness: distance.optional(),
  route: z.array(route_hint_point),
  connectsTo: z
    .string()
    .optional()
    .describe("Net selector assigning this authored copper trace to a net"),
})
export type PcbTraceProps = z.input<typeof pcbTraceProps>
