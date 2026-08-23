import { distance, type Distance } from "lib/common/distance"
import { type FanoutProps, fanoutProps } from "lib/common/fanoutProps"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  autorouterProp,
  subcircuitGroupProps,
  type AutorouterProp,
  type SubcircuitGroupProps,
} from "./group"

export interface BreakoutProps
  extends Omit<SubcircuitGroupProps, "subcircuit">,
    FanoutProps {
  /**
   * Autorouter used to escape the components inside the breakout boundary.
   * Defaults to the multilayer fanout autorouter.
   */
  autorouter?: AutorouterProp
  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
  /**
   * Minimum clearance between this fanout boundary and another fanout
   * boundary. Fanout boundaries may never overlap, even when this is omitted.
   */
  fanoutMargin?: Distance
}

const nonnegativeFanoutMargin = distance.refine((value) => value >= 0, {
  message: "Fanout margin cannot be negative",
})

export const breakoutProps = subcircuitGroupProps.extend({
  autorouter: autorouterProp.default("fanout"),
  padding: distance.optional(),
  paddingLeft: distance.optional(),
  paddingRight: distance.optional(),
  paddingTop: distance.optional(),
  paddingBottom: distance.optional(),
  fanoutMargin: nonnegativeFanoutMargin.optional(),
  ...fanoutProps.shape,
})

type InferredBreakoutProps = z.input<typeof breakoutProps>
expectTypesMatch<BreakoutProps, InferredBreakoutProps>(true)
