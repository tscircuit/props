import { type Distance, distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** One straight, incremental movement within an explosion stage. */
export interface AssemblyExplosionMoveProps {
  /** Part or subassembly identity relative to the stage owner. Uses targetRef
   * because React reserves ref rather than forwarding it as an ordinary prop.
   */
  targetRef: string
  /** Signed X displacement in the stage owner's frame, in mm or a unit string.
   * Omitted axes mean zero in the consumer; parsed props remain omitted.
   */
  offX?: Distance
  /** Signed Y displacement in the stage owner's frame, in mm or a unit string. */
  offY?: Distance
  /** Signed Z displacement in the stage owner's frame, in mm or a unit string. */
  offZ?: Distance
}

const offset = distance.pipe(z.number().finite())

export const assemblyExplosionMoveProps = z
  .object({
    targetRef: z.string().trim().min(1),
    offX: offset.optional(),
    offY: offset.optional(),
    offZ: offset.optional(),
  })
  .refine(
    (move) =>
      move.offX !== undefined ||
      move.offY !== undefined ||
      move.offZ !== undefined,
    {
      message: "Provide at least one of offX, offY, or offZ",
      path: ["offX"],
    },
  )

export type AssemblyExplosionMovePropsInput = z.input<
  typeof assemblyExplosionMoveProps
>

expectTypesMatch<AssemblyExplosionMoveProps, AssemblyExplosionMovePropsInput>(
  true,
)
