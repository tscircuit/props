// Re-export everything from the new files
export * from "./types/common"
export * from "./components/resistor"
export * from "./components/capacitor"
export * from "./components/inductor"
export * from "./components/diode"
export * from "./components/led"
export * from "./components/switch"
export * from "./components/board"
export * from "./components/chip"
export * from "./utils/direction"
export * from "./utils/portHints"

// New exports
export * from "./components/via"
export * from "./components/netAlias"
export * from "./components/trace"
export * from "./components/smtPad"
export * from "./components/platedHole"
export * from "./components/hole"
export * from "./components/schematic"
export * from "./components/constraint"
export * from "./components/footprint"
export * from "./components/group"
export * from "./components/powerSource"
export * from "./components/port"
export * from "./components/silkscreen"
export * from "./components/fabricationNote"

import { z } from "zod"
import { distance, layer_ref, route_hint_point } from "@tscircuit/soup"

export const directionAlongEdge = z.enum([
  "top-to-bottom",
  "left-to-right",
  "bottom-to-top",
  "right-to-left",
])

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

export const pcbTraceProps = z.object({
  layer: z.string().optional(),
  thickness: distance.optional(),
  route: z.array(route_hint_point),
})
export type PcbTraceProps = z.input<typeof pcbTraceProps>
