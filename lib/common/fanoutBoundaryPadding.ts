import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { distance, type Distance } from "./distance"

export interface DirectionalFanoutBoundaryPadding {
  top?: Distance
  right?: Distance
  bottom?: Distance
  left?: Distance
}

/**
 * Padding between the union of the fanout source pads and the shared boundary
 * where fanout traces terminate. Omitted directional values are treated as
 * zero.
 */
export type FanoutBoundaryPadding = Distance | DirectionalFanoutBoundaryPadding

const nonnegativeDistance = distance.refine((value) => value >= 0, {
  message: "Fanout boundary padding cannot be negative",
})

export const fanoutBoundaryPadding = z.union([
  nonnegativeDistance,
  z.object({
    top: nonnegativeDistance.optional(),
    right: nonnegativeDistance.optional(),
    bottom: nonnegativeDistance.optional(),
    left: nonnegativeDistance.optional(),
  }),
])

expectTypesMatch<FanoutBoundaryPadding, z.input<typeof fanoutBoundaryPadding>>(
  true,
)
