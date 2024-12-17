import { z } from "zod"
import {
  edit_pcb_component_location_event,
  type EditPcbComponentLocationEvent,
} from "./manual-edit-events/edit_pcb_component_location_event"
import {
  edit_schematic_component_location_event,
  type EditSchematicComponentLocationEvent,
} from "./manual-edit-events/edit_schematic_component_location_event"
import {
  edit_trace_hint_event,
  type EditTraceHintEvent,
} from "./manual-edit-events/edit_trace_hint_event"
import { expectTypesMatch } from "lib/typecheck"

export type ManualEditEvent =
  | EditPcbComponentLocationEvent
  | EditTraceHintEvent
  | EditSchematicComponentLocationEvent

export const manual_edit_event = z.union([
  edit_pcb_component_location_event,
  edit_trace_hint_event,
  edit_schematic_component_location_event,
])

export type ManualEditEventInput = z.input<typeof manual_edit_event>
type InferredManualEditEvent = z.infer<typeof manual_edit_event>

expectTypesMatch<ManualEditEvent, InferredManualEditEvent>(true)
