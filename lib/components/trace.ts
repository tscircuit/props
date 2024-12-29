import { distance, route_hint_point } from "circuit-json"
import { z } from "zod"
import { point } from "../common/point"

export const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>((v) =>
    Boolean(v.getPortSelector),
  ),
])

const baseTraceProps = z.object({
  key: z.string().optional(),
  thickness: distance.optional(),
  schematicRouteHints: z.array(point).optional(),
  pcbRouteHints: z.array(route_hint_point).optional(),
  schDisplayLabel: z.string().optional(),
  maxLength: z.number().optional(),
})

export const traceProps = z.union([
  baseTraceProps.extend({
    path: z.array(portRef),
  }),
  baseTraceProps.extend({
    from: portRef,
    to: portRef,
  }),
])

export type TraceProps = z.input<typeof traceProps>
