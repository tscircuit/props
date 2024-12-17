import { z } from "zod"
import {
  base_manual_edit_event,
  type BaseManualEditEvent,
} from "./base_manual_edit_event"
import { expectTypesMatch } from "lib/typecheck"

export const edit_component_location_event = base_manual_edit_event.extend({
  pcb_edit_event_type: z.literal("edit_component_location"),
  pcb_component_id: z.string(),
  original_center: z.object({ x: z.number(), y: z.number() }),
  new_center: z.object({ x: z.number(), y: z.number() }),
})

export interface EditComponentLocationEvent extends BaseManualEditEvent {
  pcb_edit_event_type: "edit_component_location"
  pcb_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}

export type EditComponentLocationEventInput = z.input<
  typeof edit_component_location_event
>

expectTypesMatch<
  EditComponentLocationEvent,
  z.infer<typeof edit_component_location_event>
>(true)
