import { distance } from "circuit-json"
import { type Point, point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"

export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
  material?: "fr4" | "fr1"
}

export const boardProps = subcircuitGroupProps.extend({
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
  outlineOffsetX: distance.optional(),
  outlineOffsetY: distance.optional(),
  material: z.enum(["fr4", "fr1"]).default("fr4"),
})

type InferredBoardProps = z.input<typeof boardProps>
expectTypesMatch<BoardProps, InferredBoardProps>(true)
