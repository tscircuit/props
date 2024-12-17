import { z } from "zod"
import { point, type Point } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"

export const manual_pcb_placement = z.object({
  selector: z.string(),
  relative_to: z
    .string()
    .optional()
    .default("group_center")
    .describe("Can be a selector or 'group_center'"),
  center: point,
})

export interface ManualPcbPlacement {
  selector: string
  relative_to: string
  center: Point
}

export type ManualPcbPlacementInput = z.input<typeof manual_pcb_placement>
type InferredManualPcbPlacement = z.infer<typeof manual_pcb_placement>

expectTypesMatch<ManualPcbPlacement, InferredManualPcbPlacement>(true)
