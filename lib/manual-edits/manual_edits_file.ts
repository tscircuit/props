import { z } from "zod"
import { manual_pcb_placement } from "./manual_pcb_placement"
import { manual_edit_event } from "./manual_edit_event"
import { manual_trace_hint } from "./manual_trace_hint"
import { manual_schematic_placement } from "./manual_schematic_placement"

export const manual_edits_file = z.object({
  pcb_placements: z.array(manual_pcb_placement).optional(),
  manual_trace_hints: z.array(manual_trace_hint).optional(),
  schematic_placements: z.array(manual_schematic_placement).optional(),
})

export type ManualEditsFile = z.infer<typeof manual_edits_file>
