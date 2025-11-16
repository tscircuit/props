import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { baseGroupProps, type BaseGroupProps } from "./group"

export type DepanelizationMethod = "tab-routing"

export interface PanelProps extends BaseGroupProps {
  width: Distance
  height: Distance
  children?: BaseGroupProps["children"]
  /**
   * Depanelization method. Currently only "tab-routing" is supported.
   * Defaults to "tab-routing".
   */
  depanelizationMethod?: DepanelizationMethod
  /**
   * If true, prevent a solder mask from being applied to this panel.
   */
  noSolderMask?: boolean
  /**
   * Configuration options for tab routing.
   */
  tabRouting?: {
    /** Number of tabs around the board */
    tabCount?: number
    /** Width of each tab (mm) */
    tabWidth?: Distance
    /** Mouse-bite configuration */
    mouseBites?: {
      holeDiameter?: Distance
      holeSpacing?: Distance
    }
  }
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
    depanelizationMethod: z.literal("tab-routing").optional(),
    noSolderMask: z.boolean().optional(),
    tabRouting: z
      .object({
        tabCount: z.number().optional(),
        tabWidth: distance.optional(),
        mouseBites: z
          .object({
            holeDiameter: distance.optional(),
            holeSpacing: distance.optional(),
          })
          .optional(),
      })
      .optional(),
  })

type InferredPanelProps = z.input<typeof panelProps>
expectTypesMatch<PanelProps, InferredPanelProps>(true)
