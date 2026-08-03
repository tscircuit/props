import { expectTypesMatch } from "lib/typecheck"
import {
  distance,
  layer_ref,
  resistance,
  type LayerRefInput,
} from "circuit-json"
import { z } from "zod"

export type BusName = string

/**
 * Declares a group of connections that an autorouter should keep together.
 * Each connection may be a trace name or a port selector.
 */
export interface BusProps {
  name?: string
  /** Trace names or port selectors for the connections in the bus. */
  connections: string[]
  /** If set, every trace in this bus is assigned to this autorouting phase. */
  routingPhaseIndex?: number | null
  /** Maximum routed-length difference between bus members. Raw numbers are millimeters. */
  maxLengthSkew?: number | string
  /** Intended single-ended characteristic impedance. Raw numbers are ohms. */
  targetImpedance?: number | string
  /** Explicit PCB trace width for every bus member. Raw numbers are millimeters. */
  pcbTraceWidth?: number | string
  /** PCB layers on which the bus may be routed. */
  pcbAllowedLayers?: LayerRefInput[]
}

export const busProps = z.object({
  name: z.string().optional(),
  connections: z.array(z.string()).min(2),
  routingPhaseIndex: z.number().nullable().optional(),
  maxLengthSkew: distance.pipe(z.number().min(0).finite()).optional(),
  targetImpedance: resistance.pipe(z.number().positive().finite()).optional(),
  pcbTraceWidth: distance.pipe(z.number().positive().finite()).optional(),
  pcbAllowedLayers: z.array(layer_ref).min(1).optional(),
})

type InferredBusProps = z.input<typeof busProps>
expectTypesMatch<BusProps, InferredBusProps>(true)
