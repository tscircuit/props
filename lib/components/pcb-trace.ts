import { distance, route_hint_point } from "circuit-json"
import { z } from "zod"

export const pcbTraceProps = z.object({
  layer: z.string().optional(),
  thickness: distance.optional(),
  route: z.array(route_hint_point),
})
export type PcbTraceProps = z.input<typeof pcbTraceProps>
