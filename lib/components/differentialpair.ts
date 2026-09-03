import { expectTypesMatch } from "lib/typecheck"
import {
  distance,
  layer_ref,
  resistance,
  type LayerRefInput,
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
  /** Maximum length over which the pair may be routed without coupling. Raw numbers are millimeters. */
  maxUncoupledLength?: number | string
  /** Explicit PCB trace width for each member of the differential pair. Raw numbers are millimeters. */
  pcbTraceWidth?: number | string
  /** Alias for pcbTraceWidth. Raw numbers are millimeters. */
  traceWidth?: number | string
  /** Target or preferred PCB layer on which the differential pair should be routed. */
  layer?: LayerRefInput
  /** Allowed PCB layers on which the differential pair may be routed. */
  pcbAllowedLayers?: LayerRefInput[]
  /** Whether both traces of the differential pair must be routed on the same layer. */
  sameLayer?: boolean
  /** Whether via transitions between layers must be matched between pair members. */
  matchViaTransitions?: boolean
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
  pcbTraceWidth: distance.pipe(z.number().positive().finite()).optional(),
  traceWidth: distance.pipe(z.number().positive().finite()).optional(),
  layer: layer_ref.optional(),
  pcbAllowedLayers: z.array(layer_ref).min(1).optional(),
  sameLayer: z.boolean().optional(),
  matchViaTransitions: z.boolean().optional(),
})

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)
