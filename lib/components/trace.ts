import { distance, route_hint_point } from "circuit-json"
import { z } from "zod"
import { point } from "../common/point"

export const portRef = z.union(
  [
    z.string(),
    z.any()
  ],
  {
    description: "Port Reference",
    invalid_type_error:
      "Port reference must be either a string selector or Port object with getPortSelector() method",
  },
)

const baseTraceProps = z.object({
  key: z.string().optional(),
  thickness: distance.optional(),
  schematicRouteHints: z.array(point).optional(),
  pcbRouteHints: z.array(route_hint_point).optional(),
})

export const traceProps = z.union(
  [
    baseTraceProps.extend({
      path: z
        .array(portRef)
        .min(2, "Path must contain at least 2 port references"),
    }),
    baseTraceProps.extend({
      from: portRef.describe("Source port reference"),
      to: portRef.describe("Destination port reference"),
    }),
  ],
  {
    description: "Trace Properties",
    invalid_type_error:
      "Trace must specify either a 'path' array or 'from'/'to' pair of port references",
  },
)

export type TraceProps = z.input<typeof traceProps>
