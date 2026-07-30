import { layer_ref, type LayerRefInput } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type BusName = string

export type BusFanoutTermination =
  | {
      type: "boundary"
    }
  | {
      type: "plane"
      layer: LayerRefInput
    }

/**
 * Declares a group of connections that an autorouter should keep together.
 * Each connection may be a trace name or a port selector.
 */
export interface BusProps {
  name?: string
  /** Trace names or port selectors for the connections in the bus. */
  connections: string[]
  /**
   * How this bus should terminate during fanout.
   *
   * Plane termination escapes each source pad to a local via on the selected
   * layer instead of routing the bus to the breakout boundary.
   */
  fanoutTermination?: BusFanoutTermination
}

const busFanoutTermination = z.discriminatedUnion("type", [
  z.object({ type: z.literal("boundary") }),
  z.object({
    type: z.literal("plane"),
    layer: layer_ref,
  }),
])

export const busProps = z
  .object({
    name: z.string().optional(),
    connections: z.array(z.string()).min(1),
    fanoutTermination: busFanoutTermination.optional(),
  })
  .superRefine((props, ctx) => {
    if (
      props.connections.length < 2 &&
      props.fanoutTermination?.type !== "plane"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 2,
        type: "array",
        inclusive: true,
        message: "Boundary-routed buses must contain at least two connections",
        path: ["connections"],
      })
    }
  })

type InferredBusProps = z.input<typeof busProps>
expectTypesMatch<BusProps, InferredBusProps>(true)
