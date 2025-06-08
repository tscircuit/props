import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { subcircuitGroupProps, type SubcircuitGroupProps } from "./group"

export interface BreakoutProps
  extends Omit<SubcircuitGroupProps, "subcircuit"> {
  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
}

export const breakoutProps = subcircuitGroupProps.extend({
  padding: distance.optional(),
  paddingLeft: distance.optional(),
  paddingRight: distance.optional(),
  paddingTop: distance.optional(),
  paddingBottom: distance.optional(),
})

type InferredBreakoutProps = z.input<typeof breakoutProps>
expectTypesMatch<BreakoutProps, InferredBreakoutProps>(true)
