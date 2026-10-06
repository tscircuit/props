import {
  routeLength,
  lengthMatchTo,
  nonnegativeRouteDistance,
  validateRouteLengths,
  type RouteLength,
} from "../common/routeLength"
import { traceSpacing, type TraceSpacing } from "../common/traceSpacing"
import {
  impedanceTarget,
  positiveImpedance,
  validateImpedanceTarget,
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
  pcbSpacingToOtherSignals?: TraceSpacing

  /** Name of the trace or pin carrying the positive signal. */
  positiveConnection: string
  /** Name of the trace or pin carrying the negative signal. */
  negativeConnection: string
  /** Maximum permitted routed-length skew. Raw numbers are millimeters. */
  maxLengthSkew?: number | string
  /** Intended differential impedance, e.g. "100±10ohm". Raw numbers are ohms. */
  targetDifferentialImpedance?: ImpedanceTarget
  /** Inclusive minimum/maximum acceptable impedance, in ohms. May be used without a nominal target. */
  targetDifferentialImpedanceMin?: number | string
  targetDifferentialImpedanceMax?: number | string
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
    pcbSpacingToOtherSignals: traceSpacing.optional(),

    positiveConnection: z.string(),
    negativeConnection: z.string(),
    maxLengthSkew: distance.pipe(z.number().min(0).finite()).optional(),
    targetDifferentialImpedance: impedanceTarget.optional(),
    targetDifferentialImpedanceMin: positiveImpedance.optional(),
    targetDifferentialImpedanceMax: positiveImpedance.optional(),
    pcbTraceGap: distance.pipe(z.number().positive().finite()).optional(),
    maxUncoupledLength: distance.pipe(z.number().min(0).finite()).optional(),
  })
  .superRefine((props, ctx) => {
    validateRouteLengths(props, ctx)
    validateImpedanceTarget(
      props.targetDifferentialImpedance,
      props.targetDifferentialImpedanceMin,
      props.targetDifferentialImpedanceMax,
      ctx,
      "targetDifferentialImpedance",
    )
  })
  .transform(
    ({
      targetDifferentialImpedance,
      ...props
    }): typeof props & { targetDifferentialImpedance?: number } => {
      if (targetDifferentialImpedance === undefined) return props
      if (typeof targetDifferentialImpedance === "number")
        return { ...props, targetDifferentialImpedance }
      return {
        ...props,
        targetDifferentialImpedance: targetDifferentialImpedance.nominal,
        targetDifferentialImpedanceMin: targetDifferentialImpedance.min,
        targetDifferentialImpedanceMax: targetDifferentialImpedance.max,
      }
    },
  )

type InferredDifferentialPairProps = z.input<typeof differentialPairProps>
expectTypesMatch<DifferentialPairProps, InferredDifferentialPairProps>(true)
