import { distance, layer_ref, route_hint_point } from "circuit-json"
import { z } from "zod"

export const routeHintPointProps = z.object({
  x: distance,
  y: distance,
  via: z.boolean().optional(),
  toLayer: layer_ref.optional(),
})

export const traceHintProps = z.object({
  for: z
    .string()
    .optional()
    .describe(
      "Selector for the port you're targeting, not required if you're inside a trace",
    ),
  order: z.number().optional(),
  offset: route_hint_point.or(routeHintPointProps).optional(),
  offsets: z
    .array(route_hint_point)
    .or(z.array(routeHintPointProps))
    .optional(),
  traceWidth: z.number().optional(),
})

export type TraceHintProps = z.input<typeof traceHintProps>
