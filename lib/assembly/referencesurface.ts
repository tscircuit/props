import { type Distance, distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A named, non-solid mounting frame in the owning part's local, right-handed
 * XYZ (mm). Offsets locate its origin; its normal and tangent are directions.
 */
export interface AssemblyReferenceSurfaceProps {
  /** Unique within the part; defaults to "anchor". Use PART.name to mount to it. */
  name?: string
  /** Reference shape; defaults to rect. Does not create solid geometry. */
  shape?: "rect"
  /** Defaults to xy. Positive normals: xy +Z, xz +Y, yz +X. */
  plane?: "xy" | "xz" | "yz"
  /** The direction the surface faces, away from the part's material. Must be
   * perpendicular to plane. Defaults: xy z+, xz y+, yz x+. Reversing the
   * normal retains the local X tangent.
   */
  outwardNormal?: "x+" | "x-" | "y+" | "y-" | "z+" | "z-"
  /** Alias of outwardNormal, with the same meaning. It must match
   * outwardNormal when both are given.
   */
  normalDirection?: "x+" | "x-" | "y+" | "y-" | "z+" | "z-"
  /** Surface center offsets from the part origin, in mm or unit strings; each defaults to zero. */
  centerXOffset?: Distance
  centerYOffset?: Distance
  centerZOffset?: Distance
  /** Optional rectangular extents along the tangent and its perpendicular.
   * Supply width and height together. Mounting uses the center, not the edges.
   */
  width?: Distance
  height?: Distance
}

const offset = distance.pipe(z.number().finite())
const normal = z.enum(["x+", "x-", "y+", "y-", "z+", "z-"])
const extent = distance.pipe(z.number().positive().finite())

export const assemblyReferenceSurfaceProps = z
  .object({
    name: z.string().trim().min(1).default("anchor"),
    shape: z.literal("rect").default("rect"),
    plane: z.enum(["xy", "xz", "yz"]).default("xy"),
    outwardNormal: normal.optional(),
    normalDirection: normal.optional(),
    centerXOffset: offset.default(0),
    centerYOffset: offset.default(0),
    centerZOffset: offset.default(0),
    width: extent.optional(),
    height: extent.optional(),
  })
  .refine(
    (surface) =>
      (surface.width === undefined) === (surface.height === undefined),
    {
      message: "Provide width and height together",
      path: ["width"],
    },
  )
  .superRefine((surface, ctx) => {
    if (
      surface.outwardNormal !== undefined &&
      surface.normalDirection !== undefined &&
      surface.outwardNormal !== surface.normalDirection
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["normalDirection"],
        message:
          "normalDirection is an alias of outwardNormal; they must match",
      })
      return
    }
    const authored = surface.outwardNormal ?? surface.normalDirection
    const normalAxis =
      surface.plane === "xy" ? "z" : surface.plane === "xz" ? "y" : "x"
    if (authored && authored[0] !== normalAxis)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          surface.outwardNormal !== undefined
            ? "outwardNormal"
            : "normalDirection",
        ],
        message: `outwardNormal must be ${normalAxis}+ or ${normalAxis}- for plane ${surface.plane}`,
      })
  })
  .transform((surface) => {
    const outwardNormal =
      surface.outwardNormal ??
      surface.normalDirection ??
      (surface.plane === "xy"
        ? ("z+" as const)
        : surface.plane === "xz"
          ? ("y+" as const)
          : ("x+" as const))
    // Both names are always set, so consumers can read either.
    return { ...surface, outwardNormal, normalDirection: outwardNormal }
  })

export type AssemblyReferenceSurfacePropsInput = z.input<
  typeof assemblyReferenceSurfaceProps
>
expectTypesMatch<
  AssemblyReferenceSurfaceProps,
  AssemblyReferenceSurfacePropsInput
>(true)
