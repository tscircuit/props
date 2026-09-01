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
 *
 * ## Frame of reference
 *
 * An aperture is authored around the owning part's interaction axis, derived
 * from its footprint `cutoutApertureDirection` or `insertionDirection`. On a
 * side opening, `height` is board Z, `width` is perpendicular to that axis in
 * the board plane, and `depth` follows the axis inboard. On the lid or floor,
 * width and height rotate in-plane with the footprint and depth is vertical.
 *
 * The enclosure face is resolved later from where the transformed axis first
 * intersects the box; it supplies a material plane, not the aperture's original
 * coordinate frame.
 */
export interface CutoutApertureProps {
  /** Additional clearance around the nominal opening. */
  margin?: Distance
  /**
   * Move the opening's **center** across the face it pierces, along the same two
   * axes its `width` and `height` are measured in. Both may be negative.
   *
   * Sharing a frame with the dimensions is the point. These replace
   * `zExtentAboveBoard`, which only made sense on the four walls: on the lid and
   * the floor an opening does not move in Z at all, so a "Z extent" had no
   * meaning there.
   *
   * Zero means "wherever the part puts it", which is usually right. On a side
   * face the opening is centred on the part's body above the board, taken from
   * the model's measured bounds, so it lines up with the connector without
   * anyone computing a height. On the lid or the floor it is centred on the
   * part's own position, and both offsets turn with the part.
   *
   * `heightDimensionOffset` runs **outward** from the mounting surface on a side
   * face -- up for a top-mounted part, down for a bottom-mounted one -- so, like
   * the default it shifts, it describes the part rather than where the part was
   * placed. A negative value pulls the opening back toward and past the board,
   * which is what a cable jacket fatter than its connector needs; the binding
   * constraint is that the opening must not cut into the floor.
   */
  widthDimensionOffset?: Distance
  /** See `widthDimensionOffset`. */
  heightDimensionOffset?: Distance
  /**
   * How far the cutting tool continues inboard along the part's interaction
   * axis, so the lid lip or other material behind the wall cannot obstruct it.
   * On a side opening this axis may be oblique to X/Y; on the lid or floor it is
   * vertical. The profile is cut as authored and never capped, so an explicitly
   * excessive depth can reach the shell on the far side.
   *
   * Usually unnecessary: side depth is derived from the rotated CAD-body/PCB
   * envelope. Horizontal depth uses the model's measured reach from the board
   * and converts it to the cavity span beyond the plate's inner surface; where
   * bounds are absent, `cadModel.size.z` is a less accurate fallback because it
   * can include pins and through-board geometry.
   *
   * Set this where that envelope is wrong for the purpose -- for example a
   * tapered body -- or where a part has no CAD model.
   */
  depth?: Distance
}

export interface PillEnclosureCutoutApertureProps
  extends PillShapeProps,
    CutoutApertureProps {}

export interface RectEnclosureCutoutApertureProps
  extends RectShapeProps,
    CutoutApertureProps {}

export interface CircleEnclosureCutoutApertureProps
  extends CircleShapeProps,
    CutoutApertureProps {}

export type EnclosureCutoutApertureProps =
  | PillEnclosureCutoutApertureProps
  | RectEnclosureCutoutApertureProps
  | CircleEnclosureCutoutApertureProps

export const cutoutApertureBaseProps = z.object({
  margin: distance.optional(),
  widthDimensionOffset: distance.optional(),
  heightDimensionOffset: distance.optional(),
  depth: distance.optional(),
})

const apertureOnlyProps = cutoutApertureBaseProps.shape

export const enclosureCutoutApertureProps = z.discriminatedUnion("shape", [
  pillShapeProps.extend(apertureOnlyProps),
  rectShapeProps.extend(apertureOnlyProps),
  circleShapeProps.extend(apertureOnlyProps),
])

export type ParsedEnclosureCutoutApertureProps = z.output<
  typeof enclosureCutoutApertureProps
>

type InferredEnclosureCutoutApertureProps = z.input<
  typeof enclosureCutoutApertureProps
>

expectTypesMatch<
  EnclosureCutoutApertureProps,
  InferredEnclosureCutoutApertureProps
>(true)
