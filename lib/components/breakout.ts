import {
  fanoutTracePath,
  type FanoutTracePath,
} from "lib/common/fanoutTracePath"
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
  /**
   * Saved port-to-exit wire/via routes in the fanout's local PCB frame.
   * Numeric distances are mm; unit strings are normalized to mm. Each route
   * must start at its selected port and end at its fanout exit. Layers name
   * physical board layers. Core creates the exits and preserves saved copper.
   * When supplied, replaces automatic routing (including `autorouter`) for
   * this fanout and must cover all its routing connections. Do not also add
   * a breakoutpoint/fanoutpoint for the same port. Omitted by default; existing
   * automatic fanouts are unchanged. No aliases or migration are required.
   */
  pcbTracePaths?: FanoutTracePath[]
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
  pcbTracePaths: z.array(fanoutTracePath).optional(),
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
