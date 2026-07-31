import { expectTypesMatch } from "lib/typecheck"
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
  /** Autorouting phase in which this bus constraint should be applied. */
  routingPhaseIndex?: number | null
}

export const busProps = z.object({
  name: z.string().optional(),
  connections: z.array(z.string()).min(2),
  routingPhaseIndex: z.number().nullable().optional(),
})

type InferredBusProps = z.input<typeof busProps>
expectTypesMatch<BusProps, InferredBusProps>(true)
