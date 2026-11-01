import { rotation } from "circuit-json"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A mechanical point in mm in its parent's right-handed XYZ frame. */
export interface AssemblyPosition {
  x: Distance
  y: Distance
  z: Distance
}

/** Right-handed Euler angles; numbers are degrees, strings use deg or rad. */
export interface AssemblyRotation {
  x: number | string
  y: number | string
  z: number | string
}

export interface AssemblyPlacementProps {
  /** Origin in the parent assembly frame: +X right, +Y top, +Z above.
   * All axes are required when supplied. Omission preserves inherited placement.
   * Moves this element, its reference surfaces, and its assembly descendants.
   */
  cadPosition?: AssemblyPosition
  /** Local orientation, composed as Rz * Ry * Rx before cadPosition translation.
   * All axes are required when supplied. Omission means identity rotation.
   * Positive angles follow the right-hand rule. Parsed angles are degrees.
   */
  cadRotation?: AssemblyRotation
}

const coordinate = distance.pipe(z.number().finite())
const angle = z.union([
  z.number().finite(),
  z
    .string()
    .trim()
    .regex(
      /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?:deg|rad)$/,
      "Expected a finite angle with a deg or rad unit",
    )
    .pipe(rotation)
    .pipe(z.number().finite()),
])

export const assemblyPlacementProps = z.object({
  cadPosition: z
    .object({ x: coordinate, y: coordinate, z: coordinate })
    .optional(),
  cadRotation: z.object({ x: angle, y: angle, z: angle }).optional(),
})

export type AssemblyPlacementPropsInput = z.input<typeof assemblyPlacementProps>

expectTypesMatch<AssemblyPlacementProps, AssemblyPlacementPropsInput>(true)
