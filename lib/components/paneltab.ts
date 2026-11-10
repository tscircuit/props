import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const panelTabEdge = z.enum(["top", "right", "bottom", "left"])
export type PanelTabEdge = z.infer<typeof panelTabEdge>

export interface PanelTabProps {
  /** Stable board name. Omit to apply this tab to every board in the containing panel. */
  boardName?: string
  /** Board edge the tab bridges to the panel. */
  boardEdge: PanelTabEdge
  /** Left or right edge tab: distance from the board's top edge to the tab centre. */
  offsetFromTopEdge?: Distance
  /** Left or right edge tab: distance from the board's bottom edge to the tab centre. */
  offsetFromBottomEdge?: Distance
  /** Top or bottom edge tab: distance from the board's left edge to the tab centre. */
  offsetFromLeftEdge?: Distance
  /** Top or bottom edge tab: distance from the board's right edge to the tab centre. */
  offsetFromRightEdge?: Distance
  /**
   * Width of this tab along the board edge. Defaults to the panel's
   * `tabLength`, the tab span along the edge; the panel's `tabWidth` is the
   * routed slot width.
   */
  tabWidth?: Distance
}

const nonnegativeTabOffset = distance.refine(
  (millimetres) => Number.isFinite(millimetres) && millimetres >= 0,
  { message: "Panel tab offsets must be finite and nonnegative" },
)

const offsetsByEdgeAxis = {
  vertical: ["offsetFromTopEdge", "offsetFromBottomEdge"],
  horizontal: ["offsetFromLeftEdge", "offsetFromRightEdge"],
} as const

export const panelTabProps = z
  .object({
    boardName: z.string().min(1).optional(),
    boardEdge: panelTabEdge,
    offsetFromTopEdge: nonnegativeTabOffset.optional(),
    offsetFromBottomEdge: nonnegativeTabOffset.optional(),
    offsetFromLeftEdge: nonnegativeTabOffset.optional(),
    offsetFromRightEdge: nonnegativeTabOffset.optional(),
    tabWidth: distance
      .refine(
        (millimetres) => Number.isFinite(millimetres) && millimetres > 0,
        { message: "Panel tab width must be a finite positive distance" },
      )
      .optional(),
  })
  .superRefine((tab, context) => {
    const allowedOffsets =
      tab.boardEdge === "left" || tab.boardEdge === "right"
        ? offsetsByEdgeAxis.vertical
        : offsetsByEdgeAxis.horizontal
    const givenOffsets = [
      ...offsetsByEdgeAxis.vertical,
      ...offsetsByEdgeAxis.horizontal,
    ].filter((offsetName) => tab[offsetName] !== undefined)
    if (givenOffsets.length !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["boardEdge"],
        message: `A ${tab.boardEdge} edge panel tab needs exactly one of ${allowedOffsets.join(" or ")}`,
      })
      return
    }
    const offsetName = givenOffsets[0]!
    if (!(allowedOffsets as readonly string[]).includes(offsetName)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [offsetName],
        message: `${offsetName} cannot place a tab on the ${tab.boardEdge} edge; use ${allowedOffsets.join(" or ")}`,
      })
    }
  })

type InferredPanelTabProps = z.input<typeof panelTabProps>
expectTypesMatch<PanelTabProps, InferredPanelTabProps>(true)
