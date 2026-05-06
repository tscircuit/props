import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { autorouterProp, type AutorouterProp } from "./group"

export interface AutoroutingPhaseProps {
  key?: any
  autorouter?: AutorouterProp
  phaseIndex?: number
  region?: {
    shape?: "rect"
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
  reroute?: boolean
}

export const autoroutingPhaseProps = z
  .object({
    key: z.any().optional(),
    autorouter: autorouterProp.optional(),
    phaseIndex: z.number().optional(),
    region: z
      .object({
        shape: z.literal("rect").optional(),
        minX: z.number(),
        maxX: z.number(),
        minY: z.number(),
        maxY: z.number(),
      })
      .optional(),
    reroute: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.reroute !== undefined && value.region === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "region is required when reroute is provided",
        path: ["region"],
      })
    }
  })

type InferredAutoroutingPhaseProps = z.input<typeof autoroutingPhaseProps>
expectTypesMatch<AutoroutingPhaseProps, InferredAutoroutingPhaseProps>(true)
