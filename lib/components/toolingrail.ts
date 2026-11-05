import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { baseGroupProps, type BaseGroupProps } from "./group"
import { panelEdge, type PanelEdge } from "./panel"

export interface ToolingrailProps
  extends Omit<BaseGroupProps, "width" | "height"> {
  /** Panel edge carrying the rail. Required; rail children use its local centre as origin. */
  side: PanelEdge
  /** Rail width across the selected edge, in mm or a unit string. Must fit in the panel's edge padding. No default or aliases. */
  width: Distance
}

export const toolingrailProps = baseGroupProps
  .omit({ width: true, height: true })
  .extend({
    side: panelEdge,
    width: distance.refine(
      (millimetres) => Number.isFinite(millimetres) && millimetres > 0,
      { message: "Tooling rail width must be a finite positive distance" },
    ),
  })

type InferredToolingrailProps = z.input<typeof toolingrailProps>
expectTypesMatch<ToolingrailProps, InferredToolingrailProps>(true)
