import { z } from "zod"
import {
  edit_component_location_event,
  type EditComponentLocationEvent,
} from "./manual-edit-events/edit_component_location_event"
import {
  edit_trace_hint_event,
  type EditTraceHintEvent,
} from "./manual-edit-events/edit_trace_hint_event"
import { expectTypesMatch } from "lib/typecheck"

export type ManualEditEvent = EditComponentLocationEvent | EditTraceHintEvent

export const manual_edit_event = z.union([
  edit_component_location_event,
  edit_trace_hint_event,
])

export type ManualEditEventInput = z.input<typeof manual_edit_event>
type InferredManualEditEvent = z.infer<typeof manual_edit_event>

expectTypesMatch<ManualEditEvent, InferredManualEditEvent>(true)
