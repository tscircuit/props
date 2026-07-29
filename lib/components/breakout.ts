import { distance, type Distance } from "lib/common/distance"
import {
  type FanoutBoundaryPadding,
  fanoutBoundaryPadding,
} from "lib/common/fanoutBoundaryPadding"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  autorouterProp,
  subcircuitGroupProps,
  type AutorouterProp,
  type SubcircuitGroupProps,
} from "./group"

export interface BreakoutProps
  extends Omit<SubcircuitGroupProps, "subcircuit"> {
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
   * Padding between the union of the fanout source pads and the shared
   * boundary where fanout traces terminate. This is independent of the
   * breakout group's layout padding.
   */
  fanoutBoundaryPadding?: FanoutBoundaryPadding
}

export const breakoutProps = subcircuitGroupProps.extend({
  autorouter: autorouterProp.default("fanout"),
  padding: distance.optional(),
  paddingLeft: distance.optional(),
  paddingRight: distance.optional(),
  paddingTop: distance.optional(),
  paddingBottom: distance.optional(),
  fanoutBoundaryPadding: fanoutBoundaryPadding.optional(),
})

type InferredBreakoutProps = z.input<typeof breakoutProps>
expectTypesMatch<BreakoutProps, InferredBreakoutProps>(true)
