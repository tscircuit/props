import type { LayoutBuilder } from "@tscircuit/layout"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { type ManualEditFile } from "lib/common/manualEdit"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"
import { commonLayoutProps } from "lib/common/layout"

export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  width?: number | string
  height?: number | string
  outline?: Point[]
}

export const boardProps = commonLayoutProps.merge(
  subcircuitGroupProps
    .pick({
      name: true,
      children: true,
      layout: true,
      manualEdits: true,
      routingDisabled: true,
      defaultTraceWidth: true,
      minTraceWidth: true,
      pcbRouteCache: true,
      autorouter: true,
      partsEngine: true,
      schAutoLayoutEnabled: true
    })
).extend({
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
})

type InferredBoardProps = z.input<typeof boardProps>
expectTypesMatch<BoardProps, InferredBoardProps>("property manualEdits has mismatched types")
