import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"

export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  material?: "fr4" | "fr1"
  /** Number of layers for the PCB */
  layers?: 2 | 4
}

export const boardProps = subcircuitGroupProps.extend({
  material: z.enum(["fr4", "fr1"]).default("fr4"),
  layers: z.union([z.literal(2), z.literal(4)]).default(2),
})

type InferredBoardProps = z.input<typeof boardProps>
expectTypesMatch<BoardProps, InferredBoardProps>(true)
