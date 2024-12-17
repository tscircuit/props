import { z } from "zod"
import { point } from "circuit-json"

export const manual_pcb_placement = z.object({
  selector: z.string(),
  relative_to: z
    .string()
    .optional()
    .default("group_center")
    .describe("Can be a selector or 'group_center'"),
  center: point,
})

export type ManualPcbPosition = z.infer<typeof manual_pcb_placement>
export type ManualPcbPositionInput = z.input<typeof manual_pcb_placement>
