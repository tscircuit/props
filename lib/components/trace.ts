import { distance, route_hint_point } from "circuit-json"
import { z } from "zod"
import { point } from "../common/point"

export const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>((v) =>
    Boolean(v.getPortSelector),
  ),
])

const pcbPathPoint = point.extend({
  layer: z.string().optional(),
})

const pcbPath = z.array(z.union([pcbPathPoint, z.string()]))

const baseTraceProps = z.object({
  key: z.string().optional(),
  thickness: distance.optional(),
  width: distance.optional().describe("Alias for trace thickness"),
  schematicRouteHints: z.array(point).optional(),
  pcbRouteHints: z.array(route_hint_point).optional(),
  pcbPathRelativeTo: z.string().optional(),
  pcbPath: pcbPath.optional(),
  pcbPaths: z.array(pcbPath).optional(),
  pcbStraightLine: z
    .boolean()
    .optional()
    .describe("Draw a straight pcb trace between the connected points"),
  schDisplayLabel: z.string().optional(),
  schStroke: z.string().optional(),
  highlightColor: z.string().optional(),
  maxLength: distance.optional(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
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
