import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  type FanoutBoundaryPadding,
  fanoutBoundaryPadding,
} from "../common/fanoutBoundaryPadding"
import {
  type NinePointAnchor,
  ninePointAnchor,
} from "../common/ninePointAnchor"
import type { BusName } from "./bus"
import {
  type AutorouterProp,
  type RoutingTolerances,
  autorouterProp,
  routingTolerances,
} from "./group"

export type BusFanoutDirection =
  | NinePointAnchor
  | {
      direction: NinePointAnchor
    }

export interface AutoroutingPhaseProps extends RoutingTolerances {
  key?: any
  name?: string
  autorouter?: AutorouterProp
  phaseIndex?: number
  region?: {
    shape?: "rect"
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
  connection?: string
  connections?: string[]
  reroute?: boolean
  /**
   * Fanout direction for each named bus in this phase. `center` leaves the
   * direction unconstrained.
   */
  busFanoutDirections?: Record<BusName, BusFanoutDirection>
  /**
   * Padding between the union of the fanout source pads and the shared
   * boundary where fanout traces terminate.
   */
  fanoutBoundaryPadding?: FanoutBoundaryPadding
}

const busFanoutDirection = z.union([
  ninePointAnchor,
  z.object({ direction: ninePointAnchor }),
])

export const autoroutingPhaseProps = z
  .object({
    key: z.any().optional(),
    name: z.string().optional(),
    autorouter: autorouterProp.optional(),
    phaseIndex: z.number().optional(),
    ...routingTolerances.shape,
    region: z
      .object({
        shape: z.literal("rect").optional(),
        minX: z.number(),
        maxX: z.number(),
        minY: z.number(),
        maxY: z.number(),
      })
      .optional(),
    connection: z.string().optional(),
    connections: z.array(z.string()).optional(),
    reroute: z.boolean().optional(),
    busFanoutDirections: z.record(busFanoutDirection).optional(),
    fanoutBoundaryPadding: fanoutBoundaryPadding.optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.reroute !== undefined &&
      value.region === undefined &&
      value.connection === undefined &&
      value.connections === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "region, connection, or connections is required when reroute is provided",
        path: ["region"],
      })
    }
  })

type InferredAutoroutingPhaseProps = z.input<typeof autoroutingPhaseProps>
expectTypesMatch<AutoroutingPhaseProps, InferredAutoroutingPhaseProps>(true)
