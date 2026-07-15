import {
  circleShapeProps,
  type CircleShapeProps,
  type CommonShapeProps,
  pillShapeProps,
  type PillShapeProps,
  rectShapeProps,
  type RectShapeProps,
} from "lib/common/commonShape"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const enclosureCutoutApertureShapes = ["pill", "rect", "circle"] as const

export type EnclosureCutoutApertureShape = CommonShapeProps["shape"]

/**
 * Describes the nominal enclosure opening required by a component.
 *
 * Numeric values are interpreted as mm.
 */
export interface PillEnclosureCutoutApertureProps extends PillShapeProps {
  /** Additional clearance around the nominal opening. */
  margin?: Distance
}

export interface RectEnclosureCutoutApertureProps extends RectShapeProps {
  /** Additional clearance around the nominal opening. */
  margin?: Distance
}

export interface CircleEnclosureCutoutApertureProps extends CircleShapeProps {
  /** Additional clearance around the nominal opening. */
  margin?: Distance
}

export type EnclosureCutoutApertureProps =
  | PillEnclosureCutoutApertureProps
  | RectEnclosureCutoutApertureProps
  | CircleEnclosureCutoutApertureProps

const apertureOnlyProps = {
  margin: distance.optional(),
}

export const enclosureCutoutApertureProps = z.discriminatedUnion("shape", [
  pillShapeProps.extend(apertureOnlyProps),
  rectShapeProps.extend(apertureOnlyProps),
  circleShapeProps.extend(apertureOnlyProps),
])

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
