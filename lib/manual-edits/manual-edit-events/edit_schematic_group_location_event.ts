import { z } from "zod"
import {
  base_manual_edit_event,
  type BaseManualEditEvent,
} from "./base_manual_edit_event"
import { expectTypesMatch } from "lib/typecheck"

export const edit_schematic_group_location_event =
  base_manual_edit_event.extend({
    edit_event_type: z.literal("edit_schematic_group_location"),
    schematic_group_id: z.string(),
    original_center: z.object({ x: z.number(), y: z.number() }),
    new_center: z.object({ x: z.number(), y: z.number() }),
  })

export interface EditSchematicGroupLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_schematic_group_location"
  schematic_group_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}

export type EditSchematicGroupLocationEventInput = z.input<
  typeof edit_schematic_group_location_event
>

expectTypesMatch<
  EditSchematicGroupLocationEvent,
  z.infer<typeof edit_schematic_group_location_event>
>(true)
