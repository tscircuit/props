import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const base_manual_edit_event = z.object({
  edit_event_id: z.string(),
  in_progress: z.boolean().optional(),
  created_at: z.number(),
})

export interface BaseManualEditEvent {
  edit_event_id: string
  in_progress?: boolean
  created_at: number
}

export type BaseManualEditEventInput = z.input<typeof base_manual_edit_event>

expectTypesMatch<BaseManualEditEvent, z.infer<typeof base_manual_edit_event>>(
  true,
)
