import { distance, type Distance } from "lib/common/distance"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { baseGroupProps, type BaseGroupProps } from "./group"

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
  /** Method for panelization */
  panelizationMethod?: "tab-routing" | "none"
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
    panelizationMethod: z.enum(["tab-routing", "none"]).optional(),
    boardGap: distance.optional(),
    layoutMode: z.enum(["grid", "pack", "none"]).optional(),
    row: z.number().optional(),
    col: z.number().optional(),
    cellWidth: distance.optional(),
    cellHeight: distance.optional(),
    tabWidth: distance.optional(),
    tabLength: distance.optional(),
    mouseBites: z.boolean().optional(),
    edgePadding: distance.optional(),
    edgePaddingLeft: distance.optional(),
    edgePaddingRight: distance.optional(),
    edgePaddingTop: distance.optional(),
    edgePaddingBottom: distance.optional(),
    _subcircuitCachingEnabled: z.boolean().optional(),
  })

type InferredPanelProps = z.input<typeof panelProps>
expectTypesMatch<PanelProps, InferredPanelProps>(true)
