import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { assemblyFastenerProps, type AssemblyFastenerProps } from "./fastener"

export type AssemblyBoltHeadType = "socket" | "hex" | "pan" | "countersunk"

/** A bolt specified by dimensions, or by one existing assembly CAD source. */
export interface AssemblyBoltProps extends AssemblyFastenerProps {
  /** Nominal thread diameter in mm or a unit string. Required with length
   * when no model, modelUrl, or cadModel is supplied.
   */
  diameter?: Distance
  /** Shaft length in mm or a unit string, excluding the head (including the
   * head for countersunk bolts). Required with diameter for dimensional bolts.
   */
  length?: Distance
  /** Optional thread pitch in mm or a unit string. No pitch is inferred. */
  threadPitch?: Distance
  /** Head shape for dimensional bolts; defaults to socket. */
  headType?: AssemblyBoltHeadType
}

const positiveDistance = distance.pipe(z.number().positive().finite())

export const assemblyBoltProps = assemblyFastenerProps
  .and(
    z.object({
      diameter: positiveDistance.optional(),
      length: positiveDistance.optional(),
      threadPitch: positiveDistance.optional(),
      headType: z.enum(["socket", "hex", "pan", "countersunk"]).optional(),
    }),
  )
  .superRefine((bolt, ctx) => {
    const hasModel = [bolt.model, bolt.modelUrl, bolt.cadModel].some(
      (value) => value !== undefined,
    )
    if (hasModel) {
      for (const prop of [
        "diameter",
        "length",
        "threadPitch",
        "headType",
      ] as const) {
        if (bolt[prop] !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [prop],
            message:
              "Bolt dimensions and headType are exclusive with CAD sources",
          })
        }
      }
    } else {
      for (const prop of ["diameter", "length"] as const) {
        if (bolt[prop] === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [prop],
            message: "Provide diameter and length, or an assembly CAD source",
          })
        }
      }
    }
  })
  .transform((bolt) =>
    bolt.diameter === undefined
      ? bolt
      : { ...bolt, headType: bolt.headType ?? ("socket" as const) },
  )

export type AssemblyBoltPropsInput = {
  [K in keyof z.input<typeof assemblyBoltProps>]: z.input<
    typeof assemblyBoltProps
  >[K]
}

expectTypesMatch<AssemblyBoltProps, AssemblyBoltPropsInput>(true)
