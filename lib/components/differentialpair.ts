import { expectTypesMatch } from "lib/typecheck"
import {
  distance,
  layer_ref,
  type LayerRefInput,
  resistance,
} from "circuit-json"
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
  /** Alias for pcbTraceGap. */
  traceGap?: number | string
  /** Trace width for the differential pair. Raw numbers are millimeters. */
  traceWidth?: number | string
  /** Alias for traceWidth. */
  pcbTraceWidth?: number | string
  /** Target routing layer. */
  layer?: LayerRefInput
  /** Whether the pair is required to route on the same layer throughout. */
  requireSameLayer?: boolean
  /** Maximum length over which the pair may be routed without coupling. Raw numbers are millimeters. */
  maxUncoupledLength?: number | string
  /** Edge-to-edge gap between differential via pairs. Raw numbers are millimeters. */
  viaGap?: number | string
  /** Alias for viaGap. */
  pcbViaGap?: number | string
  /** Whether via transitions must occur at matched coordinates/layers for both traces. */
  requireMatchedVias?: boolean
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
  traceGap: distance.pipe(z.number().positive().finite()).optional(),
  traceWidth: distance.pipe(z.number().positive().finite()).optional(),
  pcbTraceWidth: distance.pipe(z.number().positive().finite()).optional(),
  layer: layer_ref.optional(),
  requireSameLayer: z.boolean().optional(),
  maxUncoupledLength: distance.pipe(z.number().min(0).finite()).optional(),
  viaGap: distance.pipe(z.number().positive().finite()).optional(),
  pcbViaGap: distance.pipe(z.number().positive().finite()).optional(),
  requireMatchedVias: z.boolean().optional(),
})

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)

