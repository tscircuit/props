import {
  distance,
  layer_ref,
  pcb_trace_route_point,
  route_hint_point,
} from "circuit-json"
import { z } from "zod"

/** Accepts wire coordinates or complete Circuit JSON route points. */
export const pcbTraceProps = z.object({
  layer: layer_ref.optional(),
  thickness: distance.optional(),
  // Associate this PCB trace with an existing Circuit JSON source trace.
  source_trace_id: z.string().optional(),
  route: z.array(
    z.union([
      pcb_trace_route_point,
      // Keep malformed tagged points from falling back to coordinate shorthand.
      route_hint_point
        .pick({ x: true, y: true, trace_width: true })
        .strict(),
    ]),
  ),
})
export type PcbTraceProps = z.input<typeof pcbTraceProps>
