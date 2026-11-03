import { z } from "zod"
import {
  copper_pour_clearance_object_type,
  type CopperPourClearanceObjectType,
} from "circuit-json"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

export interface CopperPourClearanceRuleProps {
  clearance: Distance
  /** Target net selectors, as in connectsTo. Omitted matches all nets; [] matches none. */
  netSelectors?: string[]
  /** Copper kinds affected by this rule. Omitted matches every kind. */
  objectTypes?: CopperPourClearanceObjectType[]
}

export const copperPourClearanceRuleProps = z.object({
  clearance: distance.pipe(z.number().finite().nonnegative()),
  netSelectors: z.array(z.string()).optional(),
  objectTypes: z.array(copper_pour_clearance_object_type).optional(),
})

expectTypesMatch<
  CopperPourClearanceRuleProps,
  z.input<typeof copperPourClearanceRuleProps>
>(true)
