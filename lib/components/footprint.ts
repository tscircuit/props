import {
  type InsertionDirectionInput,
  type LayerRef,
  layer_ref,
} from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { type FootprintProp, footprintProp } from "../common/footprintProp"

/**
 * Direction a cable or mating part is attached from, named for the side of the
 * footprint it approaches from.
 *
 * Aliased to Circuit JSON's input union so the two cannot drift apart. Both the
 * named spellings and their Cartesian equivalents are accepted here, as are the
 * deprecated `from_front` (now `from_top`) and `from_back` (now `from_bottom`).
 * Core normalizes them to the six named values before writing
 * `pcb_component.insertion_direction`.
 */
export type FootprintInsertionDirection = InsertionDirectionInput

export const footprintInsertionDirection = z.enum([
  "from_left",
  "from_right",
  "from_top",
  "from_bottom",
  "from_above",
  "from_below",
  "from_x_neg",
  "from_x_pos",
  "from_y_pos",
  "from_y_neg",
  "from_z_pos",
  "from_z_neg",
  // Deprecated, accepted so existing sources keep type-checking.
  "from_front",
  "from_back",
])
expectTypesMatch<
  FootprintInsertionDirection,
  z.infer<typeof footprintInsertionDirection>
>(true)

export interface FootprintProps {
  children?: any
  name?: string
  /**
   * The layer that the footprint is designed for. If you set this to "top"
   * then it means the children were intended to represent the top layer. If
   * the <chip /> with this footprint is moved to the bottom layer, then the
   * components will be mirrored.
   *
   * Generally, you shouldn't set this except where it can help prevent
   * confusion because you have a complex multi-layer footprint. Default is
   * "top" and this is most intuitive.
   */
  originalLayer?: LayerRef
  /**
   * Serialized circuit JSON describing a precompiled footprint
   */
  circuitJson?: any[]
  /**
   * Can be a footprint or kicad string
   */
  src?: FootprintProp
  /**
   * Direction a cable or mating part is attached from, in the footprint's own
   * frame -- the same frame its pads are drawn in. Directions are named for the
   * footprint as drawn in the 2D PCB view: `from_top` is +Y, `from_bottom` -Y,
   * `from_left` -X, `from_right` +X, `from_above` +Z and `from_below` -Z.
   * Cartesian spellings such as `from_y_pos` are also accepted.
   *
   * This names a side, not a motion. A receptacle on the +Y edge is `from_top`
   * because that is the side the plug comes from, even though the plug itself
   * moves in -Y as it seats.
   *
   * This is a property of the part, so it is authored without regard to where
   * the part is placed. Rotating or flipping the component rotates this with it,
   * and `pcb_component.insertion_direction` reports the result in board
   * coordinates. The two frames coincide for an unrotated top-layer part, which
   * makes the distinction easy to miss.
   */
  insertionDirection?: FootprintInsertionDirection
  /**
   * Direction the part's enclosure opening faces, named the same way as
   * `insertionDirection` and in the same unrotated part frame.
   *
   * These are two different physical facts and a part may need both. A
   * side-actuated switch is *installed* from above and *actuated* from the side:
   * its aperture must pierce a side wall, while nothing is ever inserted into
   * it. Reusing `insertionDirection` for that would either put the opening on
   * the wrong face or overload a field documented as "the side exposing the
   * receptacle where the cable is attached".
   *
   * Like `insertionDirection`, this is a property of the part, authored without
   * regard to placement: rotating or flipping the component rotates it too, and
   * `pcb_component.cutout_aperture_direction` reports the result in board
   * coordinates.
   *
   * When absent, the aperture falls back to `insertionDirection`, which is
   * correct for every connector -- a cable enters through the opening it needs.
   */
  cutoutApertureDirection?: FootprintInsertionDirection
}

export const footprintProps = z.object({
  children: z.any().optional(),
  name: z.string().optional(),
  originalLayer: layer_ref.default("top").optional(),
  circuitJson: z.array(z.any()).optional(),
  src: footprintProp.describe("Can be a footprint or kicad string").optional(),
  insertionDirection: footprintInsertionDirection
    .optional()
    .describe(
      "Direction a cable or mating part is attached from, named for the side of the footprint it approaches from, in its unrotated orientation.",
    ),
  cutoutApertureDirection: footprintInsertionDirection
    .optional()
    .describe(
      "Direction the part's enclosure opening faces, in its unrotated orientation. Distinct from insertionDirection: a side-actuated switch is installed from above and actuated from the side. Falls back to insertionDirection when absent.",
    ),
})

export type FootprintPropsInput = z.input<typeof footprintProps>
type InferredFootprintProps = z.infer<typeof footprintProps>
expectTypesMatch<InferredFootprintProps, FootprintProps>(true)
