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
  widthMm?: Distance
  /** Nominal height for rectangular and rounded-rectangular openings. */
  heightMm?: Distance
  /** Nominal diameter for circular and D-shaped openings. */
  diameterMm?: Distance
  /** Corner radius for a rounded-rectangular opening. */
  cornerRadiusMm?: Distance
  /** Distance from the aperture center to a D-shaped opening's flat edge. */
  flatOffsetMm?: Distance
  /** Height of the opening's center above the top surface of the PCB. */
  zCenterAboveBoardMm?: Distance
  /** Additional clearance around the nominal opening. */
  marginMm?: Distance
}

export const cutoutApertureProps = z.object({
  shape: z.enum(cutoutApertureShapes),
  widthMm: distance.optional(),
  heightMm: distance.optional(),
  diameterMm: distance.optional(),
  cornerRadiusMm: distance.optional(),
  flatOffsetMm: distance.optional(),
  zCenterAboveBoardMm: distance.optional(),
  marginMm: distance.optional(),
})

type InferredCutoutApertureProps = z.input<typeof cutoutApertureProps>
export type ParsedCutoutApertureProps = z.output<typeof cutoutApertureProps>

expectTypesMatch<CutoutApertureProps, InferredCutoutApertureProps>(true)
