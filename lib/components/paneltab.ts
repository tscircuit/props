import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const panelTabEdge = z.enum(["top", "right", "bottom", "left"])
export type PanelTabEdge = z.infer<typeof panelTabEdge>

export interface PanelTabProps {
  /** Stable board name. Omit to apply this tab to every board in the containing panel. */
  boardName?: string
  boardEdge: PanelTabEdge
  /** Tab centre measured along a board edge in mm (or a unit string): left to right on horizontal edges, bottom to top on vertical edges. */
  offset: Distance
}

export const panelTabProps = z.object({
  boardName: z.string().min(1).optional(),
  boardEdge: panelTabEdge,
  offset: distance.refine(
    (millimetres) => Number.isFinite(millimetres) && millimetres >= 0,
    { message: "Panel tab offset must be finite and nonnegative" },
  ),
})

type InferredPanelTabProps = z.input<typeof panelTabProps>
expectTypesMatch<PanelTabProps, InferredPanelTabProps>(true)
