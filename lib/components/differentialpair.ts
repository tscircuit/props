import { expectTypesMatch } from "lib/typecheck"
import { distance } from "circuit-json"
import { z } from "zod"

/** A string selects one trace, unambiguous port, or two-pad net.
 * An array contains only trace names, in signal order; selectors are not allowed. */
export type DifferentialPairConnection = string | [string, ...string[]]

/** Length matching for two ordered lanes. Unsupported routing intent is an error. */
export interface DifferentialPairProps {
  name?: string
  /** One positive hop selector, or ordered positive trace names. */
  positiveConnection: DifferentialPairConnection
  /** One negative hop selector, or ordered negative trace names. */
  negativeConnection: DifferentialPairConnection
  /** Maximum absolute difference of the lane sums of planar copper, in mm.
   * Required, finite and nonnegative; zero is allowed. No default or aliases. */
  maxLengthSkew: number | string
}

const nonemptyConnection = z
  .string()
  .regex(/\S/, "Connection must not be empty")
const traceName = nonemptyConnection.refine(
  (name) => !/[\s.>#:[\],*+~='"|]/.test(name),
  "Differential pair arrays must contain trace names only, not selectors",
)
const connection = z.union([nonemptyConnection, z.array(traceName).nonempty()])

const skewDistance = z
  .union([z.string(), z.number()])
  .transform((value, ctx) => {
    try {
      return distance.parse(value)
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "maxLengthSkew must be a distance in mm or a distance unit string",
      })
      return z.NEVER
    }
  })
  .pipe(z.number().finite().nonnegative())

export const differentialPairProps = z
  .object({
    name: z.string().optional(),
    positiveConnection: connection,
    negativeConnection: connection,
    maxLengthSkew: skewDistance,
  })
  .strict("differentialpair only supports maxLengthSkew for now")

export type ParsedDifferentialPairProps = z.output<typeof differentialPairProps>

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)
