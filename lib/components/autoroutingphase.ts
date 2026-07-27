import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  type AutorouterProp,
  type RoutingTolerances,
  autorouterProp,
  routingTolerances,
} from "./group"

export type FanoutDirection = "left" | "right" | "up" | "down"

export type FanoutPreferredExit =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "top_left"
  | "top_right"
  | "bottom_left"
  | "bottom_right"

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
  /** Selector for the component whose pads should be escaped in this phase. */
  fanoutComponent?: string
  /** Direction in which complete buses should leave the selected component. */
  fanoutDirection?: FanoutDirection
  /** Boundary edge or corner toward which buses should leave the component. */
  fanoutPreferredExit?: FanoutPreferredExit
}

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
    fanoutComponent: z.string().optional(),
    fanoutDirection: z.enum(["left", "right", "up", "down"]).optional(),
    fanoutPreferredExit: z
      .enum([
        "left",
        "right",
        "top",
        "bottom",
        "top_left",
        "top_right",
        "bottom_left",
        "bottom_right",
      ])
      .optional(),
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
    if (
      value.fanoutComponent === undefined &&
      (value.fanoutDirection !== undefined ||
        value.fanoutPreferredExit !== undefined)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "fanoutComponent is required when fanoutDirection or fanoutPreferredExit is provided",
        path: ["fanoutComponent"],
      })
    }
  })

type InferredAutoroutingPhaseProps = z.input<typeof autoroutingPhaseProps>
expectTypesMatch<AutoroutingPhaseProps, InferredAutoroutingPhaseProps>(true)
