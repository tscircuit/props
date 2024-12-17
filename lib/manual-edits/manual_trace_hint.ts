import { z } from "zod"
import { layer_ref, route_hint_point, type RouteHintPoint } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"

export const manual_trace_hint = z.object({
  pcb_port_selector: z.string(),
  offsets: z.array(route_hint_point),
})

export interface ManualTraceHint {
  pcb_port_selector: string
  offsets: Array<RouteHintPoint>
}

export type ManualTraceHintInput = z.input<typeof manual_trace_hint>

expectTypesMatch<ManualTraceHint, z.infer<typeof manual_trace_hint>>(true)
