import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

export const point_with_bulge = z.object({
  x: distance,
  y: distance,
  bulge: z.number().optional(),
})

export interface PointWithBulge {
  x: Distance
  y: Distance
  bulge?: number
}
type InferredPointWithBulge = z.input<typeof point_with_bulge>
expectTypesMatch<PointWithBulge, InferredPointWithBulge>(true)

export const ring = z.object({
  vertices: z.array(point_with_bulge),
})

export interface Ring {
  vertices: PointWithBulge[]
}
type InferredRing = z.input<typeof ring>
expectTypesMatch<Ring, InferredRing>(true)

export const brep_shape = z.object({
  outer_ring: ring,
  inner_rings: z.array(ring).default([]),
})

/**
 * B-rep shape defined by an outer ring and inner rings (holes).
 */
export interface BRepShape {
  /**
   * The outer boundary of the shape. Vertices must be in clockwise order.
   */
  outer_ring: Ring
  /**
   * Inner boundaries (holes). Vertices must be in counter-clockwise order.
   */
  inner_rings?: Ring[]
}
type InferredBRepShape = z.input<typeof brep_shape>
expectTypesMatch<BRepShape, InferredBRepShape>(true)
