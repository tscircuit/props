import {
  distance,
  layer_ref,
  pcb_trace_route_point,
  route_hint_point,
} from "circuit-json"
import { z } from "zod"

/** Coordinate shorthand for pcbtrace; a via must name its destination layer. */
export const pcbTraceRouteHint = z.discriminatedUnion("via", [
  route_hint_point
    .merge(
      z.object({
        via: z.literal(false).optional(),
        to_layer: z.never().optional(),
      }),
    )
    .strict(),
  route_hint_point
    .merge(z.object({ via: z.literal(true), to_layer: layer_ref }))
    .strict(),
])

/**
 * A fixed copper path. Route positions are points in a footprint-local,
 * right-handed frame in mm: +X right, +Y toward the board top, +Z above.
 * Core applies parent placement, including translation, when rendering.
 *
 * Coordinate shorthand and complete Circuit JSON points can be mixed. Parsing
 * converts unit strings to mm and preserves explicit route metadata; it does
 * not inject rendered wire fields or change the supplied props. Core defaults
 * an omitted layer to top and width to thickness, then 0.1mm. A shorthand
 * trace_width overrides thickness for that point.
 *
 * Shorthand vias require to_layer; wire hints cannot set it. Complete tagged
 * points must satisfy their Circuit JSON schema and cannot fall back to
 * shorthand. No aliases are introduced. Existing coordinate and complete routes
 * remain valid; ambiguous via hints must supply their destination layer.
 */
export const pcbTraceProps = z.object({
  layer: layer_ref.optional(),
  thickness: distance.optional(),
  route: z.array(z.union([pcb_trace_route_point, pcbTraceRouteHint])),
})
export type PcbTraceProps = z.input<typeof pcbTraceProps>
