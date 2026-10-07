import { distance, type Distance } from "./distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const explodeDirectionNames = [
  "right",
  "left",
  "top",
  "bottom",
  "above",
  "below",
] as const

export type ExplodeDirectionName = (typeof explodeDirectionNames)[number]

/** Unitless direction in the right-handed circuit-world frame: +X right,
 * +Y top, and +Z above the board. This is a direction, not a position.
 */
export interface ExplodeDirectionVector {
  x: number
  y: number
  z: number
}

export type ExplodeDirection = ExplodeDirectionName | ExplodeDirectionVector

export interface ExplodeProps {
  /** Direction from the assembled position toward this part's exploded position.
   * Named values say where the exploded part ends up in circuit-world space.
   * Must be provided together with explodeDistance.
   */
  explodeDirection?: ExplodeDirection
  /** Travel at a fully exploded view, in millimeters or a unit string.
   * Must be provided together with explodeDirection.
   */
  explodeDistance?: Distance
}

const explodeDirectionVector = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
  })
  .refine(
    ({ x, y, z }) => Math.hypot(x, y, z) > 0,
    "explodeDirection cannot be a zero vector",
  )

export const explodeProps = z.object({
  explodeDirection: z
    .union([z.enum(explodeDirectionNames), explodeDirectionVector])
    .optional(),
  explodeDistance: distance.pipe(z.number().positive().finite()).optional(),
})

expectTypesMatch<ExplodeProps, z.input<typeof explodeProps>>(true)
