import type { LayoutBuilder, ManualEditFile } from "@tscircuit/layout"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface BoardProps {
  width?: number | string
  height?: number | string
  outline?: Point[]
  pcbX?: number | string
  pcbY?: number | string
  layout?: LayoutBuilder
  manualEdits?: ManualEditFile
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
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  manualEdits: z.custom<ManualEditFile>((v) => true).optional(),
  routingDisabled: z.boolean().optional(),
  children: z.any(),
  defaultTraceWidth: distance.optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
})

expectTypesMatch<BoardProps, z.input<typeof boardProps>>(true)
