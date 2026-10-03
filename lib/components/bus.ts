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
  pcbEscapeSpacing,
  type PcbEscapeSpacing,
} from "../common/traceSpacing"
import {
  impedanceTarget,
  type ImpedanceTarget,
} from "../common/impedanceTarget"
import { expectTypesMatch } from "lib/typecheck"
import { distance, layer_ref, type LayerRefInput } from "circuit-json"
import { z } from "zod"

export type BusName = string

/**
 * Declares one or more connections that an autorouter should route as a group.
 * Each connection may be a trace name or a port selector.
 */
export interface BusProps {
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
  /** Minimum centreline spacing between bus members, excluding declared pair partners.
   * Raw numbers are mm; "3w" means three times the larger local trace width. */
  pcbTraceSpacing?: TraceSpacing
  /** Minimum centreline spacing to traces outside this bus/pair (mm or e.g. "4w"). */
  pcbSpacingToOtherSignals?: TraceSpacing
  /** Optional tight-escape allowance with an explicit shared per-signal length cap.
   * Applies to declared spacing requirements, never to a pair's pcbTraceGap. */
  pcbEscapeSpacing?: PcbEscapeSpacing

  /** One or more trace names or port selectors for the connections in the bus. */
  connections: string[]
  /** If set, every trace in this bus is assigned to this autorouting phase. */
  routingPhaseIndex?: number | null
  /** Maximum routed-length difference between bus members. Raw numbers are millimeters. */
  maxLengthSkew?: number | string
  /** Intended single-ended impedance or acceptable range. Raw numbers are ohms. */
  targetImpedance?: ImpedanceTarget
  /** Explicit PCB trace width for every bus member. Raw numbers are millimeters. */
  pcbTraceWidth?: number | string
  /** PCB layers on which the bus may be routed. */
  pcbAllowedLayers?: LayerRefInput[]
  /** Preferred PCB layer for routing the bus. */
  preferredLayer?: LayerRefInput
  /** Preferred PCB layers for routing the bus, in priority order. */
  preferredLayers?: LayerRefInput[]
}

export const busProps = z
  .object({
    name: z.string().optional(),
    lengthMatchTo: lengthMatchTo.optional(),
    minLength: routeLength.optional(),
    maxLength: routeLength.optional(),
    targetLength: routeLength.optional(),
    lengthTolerance: nonnegativeRouteDistance.optional(),
    pcbTraceSpacing: traceSpacing.optional(),
    pcbSpacingToOtherSignals: traceSpacing.optional(),
    pcbEscapeSpacing: pcbEscapeSpacing.optional(),

    connections: z.array(z.string()).min(1),
    routingPhaseIndex: z.number().nullable().optional(),
    maxLengthSkew: distance.pipe(z.number().min(0).finite()).optional(),
    targetImpedance: impedanceTarget.optional(),
    pcbTraceWidth: distance.pipe(z.number().positive().finite()).optional(),
    pcbAllowedLayers: z.array(layer_ref).min(1).optional(),
    preferredLayer: layer_ref.optional(),
    preferredLayers: z.array(layer_ref).min(1).optional(),
  })
  .superRefine((props, ctx) => {
    validateRouteLengths(props, ctx)
    validateTraceSpacing(props, ctx)
  })

type InferredBusProps = z.input<typeof busProps>
expectTypesMatch<BusProps, InferredBusProps>(true)
