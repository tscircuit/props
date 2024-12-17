import { z } from "zod"
import { manual_pcb_placement } from "./manual_pcb_position"
import { manual_edit_event } from "./manual_edit_event"
import { manual_trace_hint } from "./manual_trace_hint"

export const manual_edit_file = z.object({
  pcb_placements: z.array(manual_pcb_placement).optional(),
  manual_trace_hints: z.array(manual_trace_hint).optional(),
})
