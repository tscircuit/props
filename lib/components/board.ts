import { z } from "zod"
import { distance } from "@tscircuit/soup"
import { point, type Point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import type { SubcircuitGroupProps } from "./group"
import type { Distance } from "lib/common/distance"

export interface BoardProps {
  width?: number | string
  height?: number | string
  outline?: Point[]
  pcbX?: number | string
  pcbY?: number | string
  layout?: any
  routingDisabled?: boolean
  children?: any
  defaultTraceWidth?: Distance
  /**
   * If true, we'll automatically layout the schematic for this group. Must be
   * a subcircuit (currently). This is eventually going to be replaced with more
   * sophisticated layout options/modes and will be enabled by default.
   */
  schAutoLayoutEnabled?: boolean
}

export const boardProps = z.object({
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
  pcbX: distance.optional().default(0),
  pcbY: distance.optional().default(0),
  layout: z.any().optional(),
  routingDisabled: z.boolean().optional(),
  children: z.any(),
  defaultTraceWidth: distance.optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
})

expectTypesMatch<BoardProps, z.input<typeof boardProps>>(true)
