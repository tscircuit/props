import type { LayoutBuilder, ManualEditFile } from "@tscircuit/layout"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"

export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  width?: number | string
  height?: number | string
  outline?: Point[]
}

export const boardProps = subcircuitGroupProps
  .omit({ subcircuit: true })
  .extend({
    width: distance.optional(),
    height: distance.optional(),
    outline: z.array(point).optional(),
  })

type InferredBoardProps = z.input<typeof boardProps>
expectTypesMatch<BoardProps, InferredBoardProps>(true)
