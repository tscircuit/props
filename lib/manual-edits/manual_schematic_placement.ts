import { z } from "zod"
import { point, type Point } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"

export const manual_schematic_placement = z.object({
  selector: z.string(),
  relative_to: z
    .string()
    .optional()
    .default("group_center")
    .describe("Can be a selector or 'group_center'"),
  center: point,
})

export interface ManualSchematicPlacement {
  selector: string
  relative_to: string
  center: Point
}

export type ManualSchematicPlacementInput = z.input<
  typeof manual_schematic_placement
>
type InferredManualSchematicPlacement = z.infer<
  typeof manual_schematic_placement
>

expectTypesMatch<ManualSchematicPlacement, InferredManualSchematicPlacement>(
  true,
)
