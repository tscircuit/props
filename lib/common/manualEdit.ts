import { z } from "zod"
import { point, route_hint_point, type PcbRouteHint } from "circuit-json"

// Types matching layout library exactly
export interface ManualPcbPosition {
  selector: string
  relative_to?: string
  center: { x: number; y: number }
}

export interface ManualTraceHint {
  pcb_port_selector: string
  offsets: PcbRouteHint[]
}

export interface ManualEditFile {
  pcb_placements?: ManualPcbPosition[]
  manual_trace_hints?: ManualTraceHint[]
  /**
   * @deprecated edit events use ids instead of selectors so
   * aren't safe
   */
  edit_events?: any[] // TODO: Replace with EditEvent[] once @tscircuit/manual-edit-events is available
}

// Schema for manual PCB position with snake_case
export const manualPcbPosition = z.object({
  selector: z.string(),
  relative_to: z
    .string()
    .optional()
    .default("group_center")
    .describe("Can be a selector or 'group_center'"),
  center: point,
})

// Schema for manual trace hint with snake_case
export const manualTraceHint = z.object({
  pcb_port_selector: z.string(),
  offsets: z.array(route_hint_point),
})

// Schema for manual edit file with snake_case
export const manualEditFile = z.object({
  pcb_placements: z.array(manualPcbPosition).optional(),
  manual_trace_hints: z.array(manualTraceHint).optional(),
  edit_events: z.array(z.any()).optional(),
})

// Export types for input validation
export type ManualPcbPositionInput = z.input<typeof manualPcbPosition>
export type ManualTraceHintInput = z.input<typeof manualTraceHint>
export type ManualEditFileInput = z.input<typeof manualEditFile>

// Export the schemas themselves
export {
  manualPcbPosition as manualPcbPositionSchema,
  manualTraceHint as manualTraceHintSchema,
  manualEditFile as manualEditFileSchema,
}
