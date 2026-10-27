import { distance, type Distance } from "../common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { type FanoutProps, fanoutProps } from "../common/fanoutProps"
import {
  type FanoutTracePath,
  fanoutTracePath,
} from "../common/fanoutTracePath"
import {
  type AutorouterConfig,
  type AutorouterProp,
  type PreflightRoutingCheckPolicy,
  type RoutingTolerances,
  autorouterConfig,
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
  /**
   * Custom async routing function accepting simple route JSON and returning the
   * routing result, using the same contract as autorouter.algorithmFn. Parsing
   * preserves the function unchanged. Omitted by default; no aliases or prop
   * conflicts are introduced, and existing phases require no migration.
   */
  algorithmFn?: AutorouterConfig["algorithmFn"]
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
  /**
   * Select the test-point autorouter. Requires reroute=true; omitted/false leaves
   * existing routing unchanged. Optional connection(s) select traces, otherwise
   * all routed traces are selected. Conflicts with region, pcbTracePaths,
   * autorouter and algorithmFn. No alias for the unreleased pcbTestPoints object.
   */
  addTestPoints?: boolean
  /** Test-point layer; defaults to bottom when addTestPoints is enabled. */
  layer?: "top" | "bottom"
  /** Probe pad diameter, mm or unit string; defaults to 1 mm. Must be positive. */
  diameter?: Distance
  /** Copper edge clearance, mm or unit string; defaults to 0.2 mm. */
  clearance?: Distance
  /** Minimum probe center spacing, mm or unit string; defaults to 2.54 mm. */
  minProbeSpacing?: Distance
  /** Maximum local trace detour, mm or unit string; defaults to 1 mm. */
  maxDetour?: Distance
}

export const autoroutingPhaseProps = z
  .object({
    key: z.any().optional(),
    name: z.string().optional(),
    autorouter: autorouterProp.optional(),
    algorithmFn: autorouterConfig.shape.algorithmFn,
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
    addTestPoints: z.boolean().optional(),
    layer: z.enum(["top", "bottom"]).optional(),
    diameter: distance.pipe(z.number().finite().positive()).optional(),
    clearance: distance.pipe(z.number().finite().nonnegative()).optional(),
    minProbeSpacing: distance
      .pipe(z.number().finite().nonnegative())
      .optional(),
    maxDetour: distance.pipe(z.number().finite().nonnegative()).optional(),
    ...fanoutProps.shape,
  })
  .superRefine((value, ctx) => {
    if (
      value.addTestPoints &&
      (value.reroute !== true ||
        value.region ||
        value.pcbTracePaths ||
        value.autorouter ||
        value.algorithmFn)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["addTestPoints"],
        message:
          "addTestPoints requires reroute=true and cannot combine with region, pcbTracePaths, autorouter, or algorithmFn",
      })
    }
    for (const option of [
      "layer",
      "diameter",
      "clearance",
      "minProbeSpacing",
      "maxDetour",
    ] as const) {
      if (value[option] !== undefined && !value.addTestPoints) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [option],
          message: `${option} requires addTestPoints=true`,
        })
      }
    }
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
      !(
        (isSimplifyAutorouter || value.addTestPoints) &&
        value.reroute === true
      ) &&
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
