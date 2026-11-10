import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { panelTabEdge, type PanelTabEdge } from "./paneltab"

export interface PanelTabKeepoutProps {
  /** Stable board name. Omit to reserve the interval on every board in the containing panel. */
  boardName?: string
  boardEdge: PanelTabEdge
  /** Inclusive start in edge-local mm: left to right on horizontal edges, bottom to top on vertical edges. */
  from: Distance
  /** Inclusive end in the same edge coordinates. Must be at least from. */
  to: Distance
}

const nonnegativeEdgeDistance = distance.refine(
  (millimetres) => Number.isFinite(millimetres) && millimetres >= 0,
  { message: "Panel tab keepout distances must be finite and nonnegative" },
)
export const panelTabKeepoutProps = z
  .object({
    boardName: z.string().min(1).optional(),
    boardEdge: panelTabEdge,
    from: nonnegativeEdgeDistance,
    to: nonnegativeEdgeDistance,
  })
  .refine((keepout) => keepout.to >= keepout.from, {
    path: ["to"],
    message: "Panel tab keepout to must be greater than or equal to from",
  })

type InferredPanelTabKeepoutProps = z.input<typeof panelTabKeepoutProps>
expectTypesMatch<PanelTabKeepoutProps, InferredPanelTabKeepoutProps>(true)
