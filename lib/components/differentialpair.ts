import {
  routeLength,
  lengthMatchTo,
  nonnegativeRouteDistance,
  validateRouteLengths,
  type RouteLength,
} from "../common/routeLength"
import {
  traceSpacing,
  validateTraceSpacing,
  type TraceSpacing,
} from "../common/traceSpacing"
import {
  impedanceTarget,
  type ImpedanceTarget,
} from "../common/impedanceTarget"
import { expectTypesMatch } from "lib/typecheck"
import { distance } from "circuit-json"
import { z } from "zod"

/**
 * Defines matched routing constraints for two named traces that form a
 * differential pair. Both connections must refer to trace `name` values.
 */
export interface DifferentialPairProps {
  name?: string
  /** Match these trace/port/bus/pair selectors as well as this element's members.
   * maxLengthSkew applies to the combined members; no tolerance is inferred. */
  lengthMatchTo?: string | string[]
  /** Minimum/maximum pad-to-pad planar length for each member. Raw numbers are mm. */
  minLength?: RouteLength
  maxLength?: RouteLength
  /** Nominal member length, absolute or relative to selected endpoints.
   * Requires an explicit lengthTolerance, including zero for exact matching. */
  targetLength?: RouteLength
  /** Allowed deviation above/below targetLength, in mm. */
  lengthTolerance?: number | string
  /** Minimum centreline spacing to traces outside this bus/pair (mm or e.g. "4w"). */
  pcbExternalTraceSpacing?: TraceSpacing
  /** Reduced centreline spacing allowed only with maxReducedSpacingLength.
   * Applies to declared spacing requirements, never to the pair's own pcbTraceGap. */
  pcbReducedTraceSpacing?: TraceSpacing
  /** Shared per-member length cap for all reduced-spacing intervals, in mm. */
  maxReducedSpacingLength?: number | string

  /** Name of the trace or pin carrying the positive signal. */
  positiveConnection: string
  /** Name of the trace or pin carrying the negative signal. */
  negativeConnection: string
  /** Maximum permitted routed-length skew. Raw numbers are millimeters. */
  maxLengthSkew?: number | string
  /** Intended differential impedance or acceptable range. Raw numbers are ohms. */
  targetDifferentialImpedance?: ImpedanceTarget
  /** Edge-to-edge PCB copper gap between the pair. Raw numbers are millimeters. */
  pcbTraceGap?: number | string
  /** Maximum length over which the pair may be routed without coupling. Raw numbers are millimeters. */
  maxUncoupledLength?: number | string
}

export const differentialPairProps = z
  .object({
    name: z.string().optional(),
    lengthMatchTo: lengthMatchTo.optional(),
    minLength: routeLength.optional(),
    maxLength: routeLength.optional(),
    targetLength: routeLength.optional(),
    lengthTolerance: nonnegativeRouteDistance.optional(),
    pcbExternalTraceSpacing: traceSpacing.optional(),
    pcbReducedTraceSpacing: traceSpacing.optional(),
    maxReducedSpacingLength: nonnegativeRouteDistance.optional(),

    positiveConnection: z.string(),
    negativeConnection: z.string(),
    maxLengthSkew: distance.pipe(z.number().min(0).finite()).optional(),
    targetDifferentialImpedance: impedanceTarget.optional(),
    pcbTraceGap: distance.pipe(z.number().positive().finite()).optional(),
    maxUncoupledLength: distance.pipe(z.number().min(0).finite()).optional(),
  })
  .superRefine((props, ctx) => {
    validateRouteLengths(props, ctx)
    validateTraceSpacing(props, ctx)
  })

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)
