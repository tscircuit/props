import { distance, type Distance } from "lib/common/distance"
import { z } from "zod"

/** Signed distances along the target face's local in-plane X/Y axes, in mm. */
export interface AssemblyMountOffset {
  x?: Distance
  y?: Distance
}

export interface AssemblyFaceMountProps {
  /** Target face reference, e.g. "BRIDGE.rail" or ".BRIDGE > .rail".
   * CSS selectors and compact identity paths are resolved by core.
   * References are resolved in the containing device, independently of order.
   */
  mountedTo?: string
  /** This element's named mating face. Outward normals oppose and in-plane
   * X directions align. A mount determines the complete local rigid pose.
   */
  mountFace?: string
  /** Finite nonnegative clearance, in mm or a distance string.
   * Requires mountedTo. Omission stays absent and means zero in core.
   * Positive gaps separate the faces along the target's outward normal.
   */
  mountGap?: Distance
  /** Signed in-plane offset in the target face frame; requires mountedTo.
   * Supplied axes accept mm numbers or distance strings; omitted axes are zero.
   * Normal separation is expressed by mountGap, not a third offset axis.
   */
  mountOffset?: AssemblyMountOffset
}

export const assemblyMountOffset = z
  .object({
    x: distance.pipe(z.number().finite()).default(0),
    y: distance.pipe(z.number().finite()).default(0),
  })
  .strict()

// Shared fields/refinement are internal composition helpers. Consumers use
// each element's complete validator rather than a partial mounting schema.
export const assemblyFaceMountShape = {
  mountedTo: z.string().trim().min(1).optional(),
  mountFace: z.string().trim().min(1).optional(),
  mountGap: distance.pipe(z.number().nonnegative().finite()).optional(),
  mountOffset: assemblyMountOffset.optional(),
}

export const refineAssemblyFaceMount = (
  part: AssemblyFaceMountProps,
  context: z.RefinementCtx,
) => {
  if ((part.mountedTo === undefined) !== (part.mountFace === undefined)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["mountFace"],
      message: "Provide mountedTo and mountFace together",
    })
  }
  if (part.mountGap !== undefined && part.mountedTo === undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["mountGap"],
      message: "mountGap requires mountedTo",
    })
  }
  if (part.mountOffset !== undefined && part.mountedTo === undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["mountOffset"],
      message: "mountOffset requires mountedTo",
    })
  }
}
