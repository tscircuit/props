import { expectTypesMatch } from "lib/typecheck"
import { distance, resistance, type LayerRefInput, layer_ref } from "circuit-json"
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
  /** Nominal width of each trace in the pair. Raw numbers are millimeters. */
  traceWidth?: number | string
  /** Board layer where the differential pair must be routed. */
  layer?: LayerRefInput
  /** If true, both traces must be routed on the exact same layer. */
  requireSameLayer?: boolean
  /** Edge-to-edge gap required when placing vias along the differential pair. */
  viaGap?: number | string
  /** If true, via transitions must be placed symmetrically and matched in quantity. */
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
  maxUncoupledLength: distance.pipe(z.number().min(0).finite()).optional(),
  traceWidth: distance.pipe(z.number().positive().finite()).optional(),
  layer: layer_ref.optional(),
  requireSameLayer: z.boolean().optional(),
  viaGap: distance.pipe(z.number().positive().finite()).optional(),
  requireMatchedVias: z.boolean().optional(),
})

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)
