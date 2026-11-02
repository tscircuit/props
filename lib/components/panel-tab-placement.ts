import { distance, type Distance } from "lib/common/distance"
import { z } from "zod"

export const panelEdge = z.enum(["top", "right", "bottom", "left"])
export type PanelEdge = z.infer<typeof panelEdge>

export interface PanelTabPosition {
  /** Stable board name; omitted applies to every rectangular board. */
  boardName?: string
  edge: PanelEdge
  /** Distance from the left end of horizontal edges, or bottom end of vertical edges. Numbers are mm. */
  offset: Distance
}

export interface PanelTabKeepout {
  boardName?: string
  edge: PanelEdge
  /** Inclusive interval along the same edge coordinates as tab positions. */
  from: Distance
  to: Distance
}

export interface PanelTabPlacement {
  /** Evenly spaced tabs per edge. Omitted preserves one centred tab; conflicts with positions. */
  countPerEdge?: number
  /** Explicit positions replace automatic tab placement. No aliases. */
  positions?: PanelTabPosition[]
  /** A complete tab span must avoid each keepout. */
  keepouts?: PanelTabKeepout[]
}

const nonnegativeDistance = distance.refine(
  (millimetres) => Number.isFinite(millimetres) && millimetres >= 0,
  { message: "Panel edge distances must be finite and nonnegative" },
)
const tabPosition = z
  .object({
    boardName: z.string().min(1).optional(),
    edge: panelEdge,
    offset: nonnegativeDistance,
  })
  .strict()
const tabKeepout = z
  .object({
    boardName: z.string().min(1).optional(),
    edge: panelEdge,
    from: nonnegativeDistance,
    to: nonnegativeDistance,
  })
  .strict()
  .refine((keepout) => keepout.to >= keepout.from, {
    path: ["to"],
    message: "Tab keepout to must be greater than or equal to from",
  })

export const panelTabPlacement = z
  .object({
    countPerEdge: z.number().int().positive().optional(),
    positions: z.array(tabPosition).optional(),
    keepouts: z.array(tabKeepout).optional(),
  })
  .strict()
  .refine(
    (placement) =>
      placement.countPerEdge === undefined || placement.positions === undefined,
    {
      path: ["positions"],
      message: "Use either countPerEdge or explicit tab positions",
    },
  )
