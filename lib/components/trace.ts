import { z } from "zod"
import { distance, route_hint_point } from "@tscircuit/soup"
import { point } from "../common/point"

export const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>((v) =>
    Boolean(v.getPortSelector),
  ),
])

const baseTraceProps = z.object({
  key: z.string().optional(),
  path: z.array(portRef),
  thickness: distance.optional(),
  schematicRouteHints: z.array(point).optional(),
  pcbRouteHints: z.array(route_hint_point).optional(),
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
