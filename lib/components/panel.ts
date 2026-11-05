import { distance, type Distance } from "lib/common/distance"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { baseGroupProps, type BaseGroupProps } from "./group"
export const panelEdge = z.enum(["top", "right", "bottom", "left"])
export type PanelEdge = z.infer<typeof panelEdge>

export interface PanelTab {
  /** Stable board name; omitted applies to every rectangular board. */
  boardName?: string
  edge: PanelEdge
  /** Tab centre distance from the left end of horizontal edges, or bottom end of vertical edges. Numbers are mm. */
  offset: Distance
}

export interface PanelTabKeepout {
  boardName?: string
  edge: PanelEdge
  /** Inclusive interval along the same edge coordinates as tabs. */
  from: Distance
  to: Distance
}

const nonnegativeEdgeDistance = distance.refine(
  (millimetres) => Number.isFinite(millimetres) && millimetres >= 0,
  { message: "Panel edge distances must be finite and nonnegative" },
)
export const panelTab = z
  .object({
    boardName: z.string().min(1).optional(),
    edge: panelEdge,
    offset: nonnegativeEdgeDistance,
  })
  .strict()
export const panelTabKeepout = z
  .object({
    boardName: z.string().min(1).optional(),
    edge: panelEdge,
    from: nonnegativeEdgeDistance,
    to: nonnegativeEdgeDistance,
  })
  .strict()
  .refine((keepout) => keepout.to >= keepout.from, {
    path: ["to"],
    message: "Tab keepout to must be greater than or equal to from",
  })

const positivePanelDistance = distance.refine(
  (millimetres) => Number.isFinite(millimetres) && millimetres > 0,
  { message: "Panel size limits must be finite positive distances" },
)

export interface PanelProps
  extends Omit<BaseGroupProps, "height" | "layoutMode" | "width"> {
  width?: Distance
  height?: Distance
  children?: BaseGroupProps["children"]
  anchorAlignment?: z.infer<typeof ninePointAnchor>
  /**
   * If true, prevent a solder mask from being applied to this panel.
   */
  noSolderMask?: boolean
  /**
   * Method used to separate boards in the panel.
   *
   * `outline_routing` creates continuous routed cutouts around each board
   * outline without tabs.
   * `v_score` requests straight score annotations on rectangular boards with
   * zero board gap. It does not imply routed slots or machine-specific files.
   */
  panelizationMethod?: "tab-routing" | "outline_routing" | "v_score" | "none"
  /** Gap between boards in a panel */
  boardGap?: Distance
  layoutMode?: "grid" | "pack" | "none"
  row?: number
  col?: number
  cellWidth?: Distance
  cellHeight?: Distance
  tabWidth?: Distance
  tabLength?: Distance
  mouseBites?: boolean
  /** Evenly spaced tabs on each rectangular board edge; a positive integer. Conflicts with tabs. Omission preserves current automatic placement. */
  tabCountPerEdge?: number
  /** Explicit tabs on rectangular boards, using edge-local offsets. Replaces automatic tabs; [] requests no tabs. */
  tabs?: PanelTab[]
  /** Edge intervals that the full tab span must avoid. Automatic tabs are omitted on conflict; explicit tabs produce an error. */
  tabKeepouts?: PanelTabKeepout[]
  /** Minimum finished panel width, including edge padding. Validation only; does not resize the panel. No default. */
  minWidth?: Distance
  /** Maximum finished panel width, including edge padding. Validation only; does not resize the panel. No default. */
  maxWidth?: Distance
  /** Minimum finished panel height, including edge padding. Validation only; does not resize the panel. No default. */
  minHeight?: Distance
  /** Maximum finished panel height, including edge padding. Validation only; does not resize the panel. No default. */
  maxHeight?: Distance
  edgePadding?: Distance
  edgePaddingLeft?: Distance
  edgePaddingRight?: Distance
  edgePaddingTop?: Distance
  edgePaddingBottom?: Distance
  _subcircuitCachingEnabled?: boolean
}

export const panelProps = baseGroupProps
  .omit({
    width: true,
    height: true,
    layoutMode: true,
    children: true,
  })
  .extend({
    width: distance.optional(),
    height: distance.optional(),
    children: z.any().optional(),
    anchorAlignment: ninePointAnchor.optional(),
    noSolderMask: z.boolean().optional(),
    panelizationMethod: z
      .enum(["tab-routing", "outline_routing", "v_score", "none"])
      .optional(),
    boardGap: distance.optional(),
    layoutMode: z.enum(["grid", "pack", "none"]).optional(),
    row: z.number().optional(),
    col: z.number().optional(),
    cellWidth: distance.optional(),
    cellHeight: distance.optional(),
    tabWidth: distance.optional(),
    tabLength: distance.optional(),
    mouseBites: z.boolean().optional(),
    tabCountPerEdge: z.number().int().positive().optional(),
    tabs: z.array(panelTab).optional(),
    tabKeepouts: z.array(panelTabKeepout).optional(),
    minWidth: positivePanelDistance.optional(),
    maxWidth: positivePanelDistance.optional(),
    minHeight: positivePanelDistance.optional(),
    maxHeight: positivePanelDistance.optional(),
    edgePadding: distance.optional(),
    edgePaddingLeft: distance.optional(),
    edgePaddingRight: distance.optional(),
    edgePaddingTop: distance.optional(),
    edgePaddingBottom: distance.optional(),
    _subcircuitCachingEnabled: z.boolean().optional(),
  })
  .refine(
    (panel) => panel.tabCountPerEdge === undefined || panel.tabs === undefined,
    { path: ["tabs"], message: "Use either tabCountPerEdge or explicit tabs" },
  )
  .refine(
    (panel) =>
      panel.minWidth === undefined ||
      panel.maxWidth === undefined ||
      panel.minWidth <= panel.maxWidth,
    {
      path: ["maxWidth"],
      message: "Panel maxWidth must be greater than or equal to minWidth",
    },
  )
  .refine(
    (panel) =>
      panel.minHeight === undefined ||
      panel.maxHeight === undefined ||
      panel.minHeight <= panel.maxHeight,
    {
      path: ["maxHeight"],
      message: "Panel maxHeight must be greater than or equal to minHeight",
    },
  )

type InferredPanelProps = z.input<typeof panelProps>
expectTypesMatch<PanelProps, InferredPanelProps>(true)
