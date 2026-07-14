import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const cutoutApertureShapes = [
  "rect",
  "rounded_rect",
  "circle",
  "d_shape",
] as const

export type CutoutApertureShape = (typeof cutoutApertureShapes)[number]

/**
 * Describes the nominal enclosure opening required by a component.
 *
 * All dimensions are optional because an enclosure generator may infer omitted
 * dimensions from the component's body. Numeric values are interpreted as mm.
 */
export interface CutoutApertureProps {
  /** Opening geometry used by the enclosure generator. */
  shape: CutoutApertureShape
  /** Nominal width for rectangular and rounded-rectangular openings. */
  width?: Distance
  /** Nominal height for rectangular and rounded-rectangular openings. */
  height?: Distance
  /** Nominal diameter for circular and D-shaped openings. */
  diameter?: Distance
  /** Corner radius for a rounded-rectangular opening. */
  cornerRadius?: Distance
  /** Distance from the aperture center to a D-shaped opening's flat edge. */
  flatOffset?: Distance
  /** Height of the opening's center above the top surface of the PCB. */
  zCenterAboveBoard?: Distance
  /** Additional clearance around the nominal opening. */
  margin?: Distance
}

export const cutoutApertureProps = z.object({
  shape: z.enum(cutoutApertureShapes),
  width: distance.optional(),
  height: distance.optional(),
  diameter: distance.optional(),
  cornerRadius: distance.optional(),
  flatOffset: distance.optional(),
  zCenterAboveBoard: distance.optional(),
  margin: distance.optional(),
})

type InferredCutoutApertureProps = z.input<typeof cutoutApertureProps>
export type ParsedCutoutApertureProps = z.output<typeof cutoutApertureProps>

expectTypesMatch<CutoutApertureProps, InferredCutoutApertureProps>(true)
