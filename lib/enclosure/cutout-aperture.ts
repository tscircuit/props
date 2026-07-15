import { distance, type Distance } from "lib/common/distance"
import { circleShapeProps, rectShapeProps } from "lib/common/commonShape"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const enclosureCutoutApertureShapes = [
  "rect",
  "rounded_rect",
  "circle",
] as const

export type EnclosureCutoutApertureShape =
  (typeof enclosureCutoutApertureShapes)[number]

/**
 * Describes the nominal enclosure opening required by a component.
 *
 * All dimensions are optional because an enclosure generator may infer omitted
 * dimensions from the component's body. Numeric values are interpreted as mm.
 */
export interface EnclosureCutoutApertureProps {
  /** Opening geometry used by the enclosure generator. */
  shape: EnclosureCutoutApertureShape
  /** Nominal width for rectangular and rounded-rectangular openings. */
  width?: Distance
  /** Nominal height for rectangular and rounded-rectangular openings. */
  height?: Distance
  /** Nominal diameter for circular openings. */
  diameter?: Distance
  /** Corner radius for a rounded-rectangular opening. */
  cornerRadius?: Distance
  /** Additional clearance around the nominal opening. */
  margin?: Distance
}

export const enclosureCutoutApertureProps = z.object({
  shape: z.union([
    rectShapeProps.shape.shape,
    z.literal("rounded_rect"),
    circleShapeProps.shape.shape,
  ]),
  width: distance.optional(),
  height: distance.optional(),
  diameter: distance.optional(),
  cornerRadius: distance.optional(),
  margin: distance.optional(),
})

type InferredEnclosureCutoutApertureProps = z.input<
  typeof enclosureCutoutApertureProps
>
export type ParsedEnclosureCutoutApertureProps = z.output<
  typeof enclosureCutoutApertureProps
>

expectTypesMatch<
  EnclosureCutoutApertureProps,
  InferredEnclosureCutoutApertureProps
>(true)
