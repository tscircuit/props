import { distance, type Distance } from "lib/common/distance"
import { z } from "zod"
import {
  manufacturingSurfacePlacementShape,
  type ManufacturingSurfacePlacementProps,
} from "../surface-placement"

/** Props shared by every laser-engraved mark. */
export interface ManufacturingLaserEngravingProps
  extends ManufacturingSurfacePlacementProps {
  /** Stable identity of this mark within its part. */
  name?: string
  /** Depth of material removed, in mm or a distance string. Omit for a surface
   * mark with no specified depth; no depth is assumed.
   */
  engravingDepth?: Distance
  /** Color the engraved area ends up, e.g. the pale mark a laser leaves on a
   * dark part. Renderers draw the mark in it. Omit to let the renderer derive
   * it from the part.
   */
  resultingColor?: string
}

// Internal composition helper; consumers use each element's full validator.
export const manufacturingLaserEngravingShape = {
  ...manufacturingSurfacePlacementShape,
  name: z.string().trim().min(1).optional(),
  engravingDepth: distance.pipe(z.number().positive().finite()).optional(),
  resultingColor: z.string().trim().min(1).optional(),
}
