import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { assemblyPartProps, type AssemblyPartProps } from "./part"

/** An assembly part that fastens to its mounting target, even without geometry. */
export interface AssemblyFastenerProps extends AssemblyPartProps {
  /** Qualified reference surface, e.g. "FRAME.boltHole". Implies fastening.
   * Without mountFace, use the fastener's authored local mounting origin.
   */
  mountedTo?: string
  /** Common fastener vocabulary for mountedTo; parsed output uses mountedTo.
   * Both may be supplied only when their trimmed values agree.
   */
  fastenedTo?: string
  /** Optional named mating face on this fastener; requires a mounting target.
   * When supplied, outward normals oppose and in-plane X directions align.
   */
  mountFace?: string
  /** Nonnegative surface clearance in mm or a unit string; defaults to zero
   * in the consumer. Requires a mounting target; omitted values stay omitted.
   */
  mountGap?: Distance
}

const mountingTarget = z
  .string()
  .trim()
  .regex(
    /^[A-Za-z_][A-Za-z0-9_-]*(?:\.[A-Za-z_][A-Za-z0-9_-]*)+$/,
    "Expected a qualified reference surface, e.g. part.face",
  )

export const assemblyFastenerProps = assemblyPartProps
  .and(
    z.object({
      mountedTo: mountingTarget.optional(),
      fastenedTo: mountingTarget.optional(),
      mountFace: z.string().trim().min(1).optional(),
      mountGap: distance.pipe(z.number().nonnegative().finite()).optional(),
    }),
  )
  .superRefine((fastener, ctx) => {
    if (
      fastener.mountedTo !== undefined &&
      fastener.fastenedTo !== undefined &&
      fastener.mountedTo !== fastener.fastenedTo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fastenedTo"],
        message: "mountedTo and fastenedTo must refer to the same surface",
      })
    }
    if (fastener.mountedTo === undefined && fastener.fastenedTo === undefined) {
      for (const prop of ["mountFace", "mountGap"] as const) {
        if (fastener[prop] !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [prop],
            message: `${prop} requires mountedTo or fastenedTo`,
          })
        }
      }
    }
  })
  .transform(({ fastenedTo, ...fastener }) => {
    const mountedTo = fastener.mountedTo ?? fastenedTo
    return mountedTo === undefined ? fastener : { ...fastener, mountedTo }
  })

export type AssemblyFastenerPropsInput = {
  [K in keyof z.input<typeof assemblyFastenerProps>]: z.input<
    typeof assemblyFastenerProps
  >[K]
}

expectTypesMatch<AssemblyFastenerProps, AssemblyFastenerPropsInput>(true)
