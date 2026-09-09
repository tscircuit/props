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
 * Layers are physical board layers, independent of placement.
 */
export const fanoutTracePath = z.object({
  connection: z.string().min(1),
  route: z
    .array(routePoint)
    .min(2)
    .superRefine((route, ctx) => {
      if (
        route[0]?.route_type !== "wire" ||
        route.at(-1)?.route_type !== "wire"
      ) {
        ctx.addIssue({
          code: "custom",
          message: "A fanout trace path must start and end with wire points",
        })
      }
      let layer = route[0]?.route_type === "wire" ? route[0].layer : undefined
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
