import { z } from "zod"
import {
  base_manual_edit_event,
  type BaseManualEditEvent,
} from "./base_manual_edit_event"
import { expectTypesMatch } from "lib/typecheck"

export const edit_trace_hint_event = base_manual_edit_event.extend({
  pcb_edit_event_type: z.literal("edit_trace_hint").describe("deprecated"),
  edit_event_type: z.literal("edit_pcb_trace_hint").optional(),
  pcb_port_id: z.string(),
  pcb_trace_hint_id: z.string().optional(),
  route: z.array(
    z.object({ x: z.number(), y: z.number(), via: z.boolean().optional() }),
  ),
})

export interface EditTraceHintEvent extends BaseManualEditEvent {
  /** @deprecated */
  pcb_edit_event_type: "edit_trace_hint"
  edit_event_type?: "edit_pcb_trace_hint"
  pcb_port_id: string
  pcb_trace_hint_id?: string
  route: Array<{ x: number; y: number; via?: boolean }>
}

export type EditTraceHintEventInput = z.input<typeof edit_trace_hint_event>

expectTypesMatch<EditTraceHintEvent, z.infer<typeof edit_trace_hint_event>>(
  true,
)
