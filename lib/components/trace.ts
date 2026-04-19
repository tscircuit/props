import { distance, layer_ref, route_hint_point } from "circuit-json"
import { z } from "zod"
import { point } from "../common/point"

export const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>(
    (v) =>
      typeof v === "object" &&
      v !== null &&
      "getPortSelector" in v &&
      typeof v.getPortSelector === "function",
  ),
])

const pcbPathPoint = point
  .extend({
    via: z.boolean().optional(),
    fromLayer: layer_ref.optional(),
    toLayer: layer_ref.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.via) {
      if (!value.toLayer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "toLayer is required when via is true",
          path: ["toLayer"],
        })
      }
    } else if (value.fromLayer || value.toLayer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "fromLayer/toLayer are only allowed when via is true",
        path: ["via"],
      })
    }
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
  routingPhaseIndex: z.number().nullable().optional(),
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
  baseTraceProps.extend({
    start: portRef,
    end: portRef,
  }),
])

export type TraceProps = z.input<typeof traceProps>
