import type { AutocompleteString } from "lib/common/autocomplete"
import { distance, type Distance } from "lib/common/distance"
import {
  type NinePointAnchor,
  ninePointAnchor,
} from "lib/common/ninePointAnchor"
import { z } from "zod"

/** Bounding surfaces every part has, taken from its model bounds in the part's
 * local, right-handed XYZ: top z+, bottom z-, right x+, left x-, back y+,
 * front y-. The four sides are upright (surface +Y is part +Z); top and bottom
 * have surface +X along part +X.
 */
export const manufacturingBuiltInSurfaces = [
  "topSurface",
  "bottomSurface",
  "leftSurface",
  "rightSurface",
  "frontSurface",
  "backSurface",
] as const

export type ManufacturingBuiltInSurface =
  (typeof manufacturingBuiltInSurfaces)[number]

/** A built-in bounding surface, or the name of a reference surface on the
 * parent part.
 */
export type ManufacturingSurfaceRef =
  AutocompleteString<ManufacturingBuiltInSurface>

/** Where a manufacturing mark sits on one surface of its parent part.
 *
 * Positions are in the surface's own frame, seen from outside the part: +X
 * runs along the surface's in-plane X direction and +Y along its second
 * tangent, so "left" is -X and "top" is +Y. Choose at most one position per
 * axis; an axis with none is centered on the surface.
 */
export interface ManufacturingSurfacePlacementProps {
  /** The surface to mark: `topSurface`, `bottomSurface`, `leftSurface`,
   * `rightSurface`, `frontSurface`, `backSurface`, or a reference surface named
   * on the parent part. Resolved by core.
   */
  surface: ManufacturingSurfaceRef
  /** Signed distance from the surface center to the mark's anchor point. */
  xOffsetFromSurfaceCenter?: Distance
  /** Gap between the surface's left edge and the mark's left edge. */
  distanceFromSurfaceLeftEdge?: Distance
  /** Gap between the surface's right edge and the mark's right edge. */
  distanceFromSurfaceRightEdge?: Distance
  /** Signed distance from the surface center to the mark's anchor point. */
  yOffsetFromSurfaceCenter?: Distance
  /** Gap between the surface's top edge and the mark's top edge. */
  distanceFromSurfaceTopEdge?: Distance
  /** Gap between the surface's bottom edge and the mark's bottom edge. */
  distanceFromSurfaceBottomEdge?: Distance
  /** The point of the mark that center offsets locate; defaults to center.
   * It has no effect on an axis positioned from a surface edge.
   */
  anchorAlignment?: NinePointAnchor
  /** Rotation of the mark seen from outside the part. A number is degrees
   * counterclockwise. A string is `"90deg"` or `"1.57rad"`, optionally followed
   * by `ccw` or `cw`, e.g. `"90deg ccw"` or `"90deg cw"`; without a direction
   * it is counterclockwise. Parsed to degrees counterclockwise, so
   * `"90deg cw"` is -90. Edge distances measure the rotated mark's bounds.
   */
  rotationOnSurface?: number | string
}

const surfaceRotationPattern =
  /^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*(deg|rad)?\s*(ccw|cw)?\s*$/

/** Parses to degrees counterclockwise. Unlike the PCB rotation parser this
 * honors a `cw`/`ccw` suffix and rejects strings it does not understand.
 */
export const manufacturingSurfaceRotation = z
  .union([z.number(), z.string()])
  .transform((value, ctx) => {
    if (typeof value === "number") return value
    const match = surfaceRotationPattern.exec(value)
    if (!match) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Expected degrees as a number, or a string such as "90deg", "90deg ccw", "90deg cw" or "1.57rad"',
      })
      return z.NEVER
    }
    const [, magnitude, unit, direction] = match
    const degrees =
      unit === "rad" ? (Number(magnitude) * 180) / Math.PI : Number(magnitude)
    // Adding zero turns the -0 of "0deg cw" into 0.
    return (direction === "cw" ? -degrees : degrees) + 0
  })
  .pipe(z.number().finite())

const offsetFromCenter = distance.pipe(z.number().finite())
const distanceFromEdge = distance.pipe(z.number().nonnegative().finite())

// Shared fields/refinement are internal composition helpers. Consumers use
// each element's complete validator rather than a partial placement schema.
export const manufacturingSurfacePlacementShape = {
  surface: z
    .custom<ManufacturingSurfaceRef>((value) => typeof value === "string", {
      message: "Expected a surface name",
    })
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, {
      message: "surface cannot be blank",
    }),
  xOffsetFromSurfaceCenter: offsetFromCenter.optional(),
  distanceFromSurfaceLeftEdge: distanceFromEdge.optional(),
  distanceFromSurfaceRightEdge: distanceFromEdge.optional(),
  yOffsetFromSurfaceCenter: offsetFromCenter.optional(),
  distanceFromSurfaceTopEdge: distanceFromEdge.optional(),
  distanceFromSurfaceBottomEdge: distanceFromEdge.optional(),
  anchorAlignment: ninePointAnchor.default("center"),
  rotationOnSurface: manufacturingSurfaceRotation.optional(),
}

const placementAxes = [
  [
    "xOffsetFromSurfaceCenter",
    "distanceFromSurfaceLeftEdge",
    "distanceFromSurfaceRightEdge",
  ],
  [
    "yOffsetFromSurfaceCenter",
    "distanceFromSurfaceTopEdge",
    "distanceFromSurfaceBottomEdge",
  ],
] as const

export const refineManufacturingSurfacePlacement = (
  placement: Partial<
    Record<(typeof placementAxes)[number][number], number | undefined>
  >,
  ctx: z.RefinementCtx,
) => {
  for (const axis of placementAxes) {
    const supplied = axis.filter((prop) => placement[prop] !== undefined)
    if (supplied.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [supplied[1]!],
        message: `Provide at most one of ${axis.join(", ")}`,
      })
    }
  }
}
