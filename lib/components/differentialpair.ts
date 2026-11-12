import { expectTypesMatch } from "lib/typecheck"
import { distance } from "circuit-json"
import { z } from "zod"

/**
 * Two signals routed as a differential pair, with their routed lengths matched.
 *
 * @example
 * // A trace name, port selector, or a net with exactly 2 pads
 * <differentialpair positiveConnection="net.USB_DP" negativeConnection="net.USB_DM" maxLengthSkew="0.1mm" />
 * // A signal that passes through several traces: list the trace names in signal order
 * <differentialpair positiveConnection={["DP1", "DP2"]} negativeConnection={["DM1", "DM2"]} maxLengthSkew={0} />
 */
export interface DifferentialPairProps {
  name?: string
  /** A trace name, port selector, or 2-pad `net.X`; or a list of trace names in signal order. */
  positiveConnection: string | string[]
  /** Same forms as positiveConnection. */
  negativeConnection: string | string[]
  /** Maximum allowed difference between the positive and negative routed lengths. Raw numbers are millimeters. */
  maxLengthSkew: number | string
}

const connection = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1),
])

export const differentialPairProps = z
  .object({
    name: z.string().optional(),
    positiveConnection: connection,
    negativeConnection: connection,
    maxLengthSkew: distance.pipe(z.number().min(0).finite()),
  })
  .strict("differentialpair only supports maxLengthSkew for now")

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)
