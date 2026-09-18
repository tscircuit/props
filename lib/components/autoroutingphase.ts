import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { type FanoutProps, fanoutProps } from "../common/fanoutProps"
import {
  type FanoutTracePath,
  fanoutTracePath,
} from "../common/fanoutTracePath"
import {
  type AutorouterProp,
  type PreflightRoutingCheckPolicy,
  type RoutingTolerances,
  autorouterProp,
  preflightRoutingCheckPolicy,
  routingTolerances,
} from "./group"

export type {
  BusFanoutDirection,
  BusFanoutDirectionLiteral,
  CanonicalBusFanoutDirection,
  FanoutPourNetMap,
  LegacyBusFanoutDirection,
} from "../common/fanoutProps"

export interface AutoroutingPhaseProps extends RoutingTolerances, FanoutProps {
  key?: any
  name?: string
  autorouter?: AutorouterProp
  preflightRoutingCheckPolicy?: PreflightRoutingCheckPolicy
  phaseIndex?: number
  /**
   * Saved PCB wire/via routes using the same format as fanout pcbTracePaths.
   * Numeric distances are mm; unit strings are normalized to mm. Omitted by
   * default; an empty array is accepted. No aliases or prop conflicts are
   * introduced, and existing phases require no migration.
   */
  pcbTracePaths?: FanoutTracePath[]
  region?: {
    shape?: "rect"
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
  connection?: string
  connections?: string[]
  // Reroutes traces selected by region or connection. The simplify autorouter
  // may omit a selector to simplify every existing trace in the phase.
  reroute?: boolean
}

export const autoroutingPhaseProps = z
  .object({
    key: z.any().optional(),
    name: z.string().optional(),
    autorouter: autorouterProp.optional(),
    preflightRoutingCheckPolicy: preflightRoutingCheckPolicy.optional(),
    phaseIndex: z.number().optional(),
    pcbTracePaths: z.array(fanoutTracePath).optional(),
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
    ...fanoutProps.shape,
  })
  .superRefine((value, ctx) => {
    const isSimplifyAutorouter =
      value.autorouter === "simplify" ||
      (typeof value.autorouter === "object" &&
        value.autorouter?.preset === "simplify")

    if (isSimplifyAutorouter && value.reroute !== true) {
      console.warn(
        'The "simplify" autorouter preset should only be used with reroute=true',
      )
    }

    if (
      value.reroute !== undefined &&
      !(isSimplifyAutorouter && value.reroute === true) &&
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
