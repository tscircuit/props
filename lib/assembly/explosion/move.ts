import { type Distance, distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** One straight, incremental movement within an explosion stage. */
export interface AssemblyExplosionMoveProps {
  /** Parts or subassemblies to move together, relative to the stage owner.
   * Accepts a comma-separated string or an array; parsed as a nonempty array of
   * trimmed references. Supply exactly one of targetRefs or targetRef.
   */
  targetRefs?: string | string[]
  /** Single-target compatibility alias for targetRefs. Parsed as targetRefs:
   * [targetRef]; cannot be combined with targetRefs. React reserves ref.
   */
  targetRef?: string
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
const reference = z.string().trim().min(1)
const references = z
  .union([
    z.string().transform((value) => value.split(",")),
    z.array(z.string()),
  ])
  .pipe(z.array(reference).min(1))

export const assemblyExplosionMoveProps = z
  .object({
    targetRefs: references.optional(),
    targetRef: reference.optional(),
    offX: offset.optional(),
    offY: offset.optional(),
    offZ: offset.optional(),
  })
  .refine(
    (move) =>
      (move.targetRefs !== undefined) !== (move.targetRef !== undefined),
    {
      message: "Provide exactly one of targetRefs or targetRef",
      path: ["targetRefs"],
    },
  )
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
  .transform(({ targetRef, targetRefs, ...move }) => ({
    ...move,
    targetRefs: targetRefs ?? [targetRef!],
  }))

export type AssemblyExplosionMovePropsInput = z.input<
  typeof assemblyExplosionMoveProps
>

expectTypesMatch<AssemblyExplosionMoveProps, AssemblyExplosionMovePropsInput>(
  true,
)
