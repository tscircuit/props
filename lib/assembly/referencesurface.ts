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
  /** Reverse the plane's normal while retaining its local X tangent. */
  normalDirection?: "positive" | "negative"
  /** Local origin offsets, in mm or unit strings; each defaults to zero. */
  xOffset?: Distance
  yOffset?: Distance
  zOffset?: Distance
  /** Optional rectangular extents along the tangent and its perpendicular.
   * Supply width and height together. Mounting uses the center, not the edges.
   */
  width?: Distance
  height?: Distance
}

const offset = distance.pipe(z.number().finite())
const extent = distance.pipe(z.number().positive().finite())

export const assemblyReferenceSurfaceProps = z
  .object({
    name: z.string().trim().min(1).default("anchor"),
    shape: z.literal("rect").default("rect"),
    plane: z.enum(["xy", "xz", "yz"]).default("xy"),
    normalDirection: z.enum(["positive", "negative"]).default("positive"),
    xOffset: offset.default(0),
    yOffset: offset.default(0),
    zOffset: offset.default(0),
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

export type AssemblyReferenceSurfacePropsInput = z.input<
  typeof assemblyReferenceSurfaceProps
>
expectTypesMatch<
  AssemblyReferenceSurfaceProps,
  AssemblyReferenceSurfacePropsInput
>(true)
