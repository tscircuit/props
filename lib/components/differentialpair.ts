import { expectTypesMatch } from "lib/typecheck"
import { distance, resistance } from "circuit-json"
import { z } from "zod"

/**
 * Defines matched routing constraints for two named traces that form a
 * differential pair. Both connections must refer to trace `name` values.
 */
export interface DifferentialPairProps {
  name?: string
  /** Name of the trace or pin carrying the positive signal. */
  positiveConnection: string
  /** Name of the trace or pin carrying the negative signal. */
  negativeConnection: string
  /** Maximum permitted routed-length skew. Raw numbers are millimeters. */
  maxLengthSkew?: number | string
  /** Intended differential characteristic impedance. Raw numbers are ohms. */
  targetDifferentialImpedance?: number | string
  /** Edge-to-edge PCB copper gap between the pair. Raw numbers are millimeters. */
  pcbTraceGap?: number | string
  /** Maximum length over which the pair may be routed without coupling. Raw numbers are millimeters. */
  maxUncoupledLength?: number | string
}

export const differentialPairProps = z.object({
  name: z.string().optional(),
  positiveConnection: z.string(),
  negativeConnection: z.string(),
  maxLengthSkew: distance.pipe(z.number().min(0).finite()).optional(),
  targetDifferentialImpedance: resistance
    .pipe(z.number().positive().finite())
    .optional(),
  pcbTraceGap: distance.pipe(z.number().positive().finite()).optional(),
  maxUncoupledLength: distance.pipe(z.number().min(0).finite()).optional(),
})

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)
