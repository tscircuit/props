import { z } from "zod"
import {
  base_manual_edit_event,
  type BaseManualEditEvent,
} from "./base_manual_edit_event"
import { expectTypesMatch } from "lib/typecheck"

export const edit_pcb_component_location_event = base_manual_edit_event.extend({
  pcb_edit_event_type: z
    .literal("edit_component_location")
    .describe("deprecated"),
  edit_event_type: z.literal("edit_pcb_component_location"),
  pcb_component_id: z.string(),
  selector: z.string().optional(),
  original_center: z.object({ x: z.number(), y: z.number() }),
  new_center: z.object({ x: z.number(), y: z.number() }),
})

/** @deprecated use edit_pcb_component_location_event instead */
export const edit_component_location_event = edit_pcb_component_location_event

export interface EditPcbComponentLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_pcb_component_location"
  /** @deprecated */
  pcb_edit_event_type: "edit_component_location"

  /** optional: provided so that manual edits file can be edited without access to circuit json **/
  selector?: string
  pcb_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}

export type EditPcbComponentLocationEventInput = z.input<
  typeof edit_pcb_component_location_event
>

expectTypesMatch<
  EditPcbComponentLocationEvent,
  z.infer<typeof edit_pcb_component_location_event>
>(true)
