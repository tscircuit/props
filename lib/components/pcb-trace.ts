import {
  distance,
  layer_ref,
  pcb_trace_route_point,
  route_hint_point,
} from "circuit-json"
import { z } from "zod"

/**
 * Fixed copper path: coordinate-only wire shorthand or complete Circuit JSON
 * points. Positions are footprint-local points in mm (+X right, +Y board top,
 * +Z above, right-handed); core applies parent placement. Unit strings parse
 * to mm. Use complete Circuit JSON points for vias and other explicit routes.
 */
export const pcbTraceProps = z.object({
  layer: layer_ref.optional(),
  thickness: distance.optional(),
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
