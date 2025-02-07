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

export const manualEditsProps = z
  .object({
    pcbPlacements: z.array(manual_pcb_placement).optional(),
    manualTraceHints: z.array(manual_trace_hint).optional(),
    schematicPlacements: z.array(manual_schematic_placement).optional(),
  })
  .transform<ManualEditsFile>((data) => ({
    ...data,
    pcb_placements: data.pcbPlacements,
    manual_trace_hints: data.manualTraceHints,
    schematic_placements: data.schematicPlacements,
  }))

export interface ManualEditsFile {
  pcbPlacements?: ManualPcbPlacement[]
  manualTraceHints?: ManualTraceHint[]
  schematicPlacements?: ManualSchematicPlacement[]
  pcb_placements?: ManualPcbPlacement[]
  manual_trace_hints?: ManualTraceHint[]
  schematic_placements?: ManualSchematicPlacement[]
}

export type ManualEditsFileInput = z.input<typeof manualEditsProps>

expectTypesMatch<ManualEditsFile, z.infer<typeof manualEditsProps>>(true)
