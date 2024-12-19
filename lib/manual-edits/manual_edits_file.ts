import { z } from "zod"
import {
  manual_pcb_placement,
  type ManualPcbPlacement,
} from "./manual_pcb_placement"
import { manual_edit_event } from "./manual_edit_event"
import { manual_trace_hint, type ManualTraceHint } from "./manual_trace_hint"
import {
  manual_schematic_placement,
  type ManualSchematicPlacement,
} from "./manual_schematic_placement"
import { expectTypesMatch } from "lib/typecheck"

export const manual_edits_file = z.object({
  pcb_placements: z.array(manual_pcb_placement).optional(),
  manual_trace_hints: z.array(manual_trace_hint).optional(),
  schematic_placements: z.array(manual_schematic_placement).optional(),
})

export interface ManualEditsFile {
  pcb_placements?: ManualPcbPlacement[]
  manual_trace_hints?: ManualTraceHint[]
  schematic_placements?: ManualSchematicPlacement[]
}

export type ManualEditsFileInput = z.input<typeof manual_edits_file>

expectTypesMatch<ManualEditsFile, z.infer<typeof manual_edits_file>>(true)
