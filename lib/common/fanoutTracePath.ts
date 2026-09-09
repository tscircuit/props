import { layer_ref } from "circuit-json"
import { z } from "zod"
import { distance } from "./distance"

const coordinate = distance.refine(Number.isFinite, "Coordinate must be finite")
const positiveDistance = distance.refine(
  (value) => Number.isFinite(value) && value > 0,
  "Distance must be positive and finite",
)
const routePoint = z.discriminatedUnion("route_type", [
  z.object({
    route_type: z.literal("wire"),
    x: coordinate,
    y: coordinate,
    width: positiveDistance,
    layer: layer_ref,
  }),
  z.object({
    route_type: z.literal("via"),
    x: coordinate,
    y: coordinate,
    from_layer: layer_ref,
    to_layer: layer_ref,
    via_diameter: positiveDistance.optional(),
    via_hole_diameter: positiveDistance.optional(),
  }),
])

/**
 * A saved route from a selected port to a fanout exit. Points are in the
 * fanout's local PCB frame, in mm: +X right, +Y up, right-handed with +Z
 * above the board. They are points (placement adds translation), not
 * directions. Numeric distances are mm; unit strings are parsed to mm.
 * Layers are physical board layers, independent of placement. Either endpoint
 * may be a via: the initial layer is its from_layer and the final layer is its
 * to_layer. Placement legality (including allowViaInPad) is checked by core,
 * since this schema has no pad geometry or inherited routing configuration.
 */
export const fanoutTracePath = z.object({
  connection: z.string().min(1),
  route: z
    .array(routePoint)
    .min(2)
    .superRefine((route, ctx) => {
      const first = route[0]
      let layer = first?.route_type === "via" ? first.from_layer : first?.layer
      for (const point of route) {
        if (
          (point.route_type === "wire" ? point.layer : point.from_layer) !==
          layer
        ) {
          ctx.addIssue({
            code: "custom",
            message: "A fanout trace path must use vias for layer changes",
          })
        }
        if (point.route_type === "via") layer = point.to_layer
      }
    }),
})

export type FanoutTracePath = z.input<typeof fanoutTracePath>
