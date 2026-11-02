import { distance, type Distance } from "lib/common/distance"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { baseGroupProps, type BaseGroupProps } from "./group"
import {
  panelTabPlacement,
  type PanelTabPlacement,
} from "./panel-tab-placement"
import {
  panelSizeConstraints,
  type PanelSizeConstraints,
} from "./panel-size-constraints"
export type {
  PanelTabPlacement,
  PanelTabPosition,
  PanelTabKeepout,
  PanelEdge,
} from "./panel-tab-placement"
export type { PanelSizeConstraints } from "./panel-size-constraints"

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
  /** Rectangular-board tab count, explicit edge offsets and keepouts. Distances parse to mm; omission preserves legacy automatic placement. */
  tabPlacement?: PanelTabPlacement
  /** Optional manufacturing envelope; no default min/max, no aliases. Core checks the final panel dimensions. */
  sizeConstraints?: PanelSizeConstraints
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
    tabPlacement: panelTabPlacement.optional(),
    sizeConstraints: panelSizeConstraints.optional(),
    edgePadding: distance.optional(),
    edgePaddingLeft: distance.optional(),
    edgePaddingRight: distance.optional(),
    edgePaddingTop: distance.optional(),
    edgePaddingBottom: distance.optional(),
    _subcircuitCachingEnabled: z.boolean().optional(),
  })

type InferredPanelProps = z.input<typeof panelProps>
expectTypesMatch<PanelProps, InferredPanelProps>(true)
