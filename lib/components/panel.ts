import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { baseGroupProps, type BaseGroupProps } from "./group"

export interface PanelProps extends BaseGroupProps {
  width: Distance
  height: Distance
  children?: BaseGroupProps["children"]
  /**
   * If true, prevent a solder mask from being applied to this panel.
   */
  noSolderMask?: boolean
}

export const panelProps = baseGroupProps
  .omit({
    width: true,
    height: true,
    children: true,
  })
  .extend({
    width: distance,
    height: distance,
    children: z.any().optional(),
    noSolderMask: z.boolean().optional(),
  })

type InferredPanelProps = z.input<typeof panelProps>
expectTypesMatch<PanelProps, InferredPanelProps>(true)
