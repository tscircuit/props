import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  assemblyDrawingSelection,
  hasAssemblyDrawingSelection,
  type AssemblyDrawingSelection,
} from "./stage"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import {
  assemblyDrawingPartViewBase,
  defaultDrawingViewCenter,
  validateDrawingViewLayout,
  type AssemblyDrawingPartViewProps,
} from "./partview"

/** A simultaneous displacement from assembled placement, in CAD world axes (+Z up). */
export interface AssemblyDrawingExplosionMove extends AssemblyDrawingSelection {
  /** Signed millimetres or a distance string. Omitted axes parse as zero. At least one axis must be authored. */
  offX?: Distance
  offY?: Distance
  offZ?: Distance
}
const offset = distance.pipe(z.number().finite())
export const assemblyDrawingExplosionMove = assemblyDrawingSelection
  .extend({
    offX: offset.optional(),
    offY: offset.optional(),
    offZ: offset.optional(),
  })
  .refine(
    hasAssemblyDrawingSelection,
    "Explosion move requires selected parts or stages",
  )
  .refine(
    (m) => m.offX !== undefined || m.offY !== undefined || m.offZ !== undefined,
    "Provide at least one displacement axis",
  )
  .transform((m) => ({
    ...m,
    offX: m.offX ?? 0,
    offY: m.offY ?? 0,
    offZ: m.offZ ?? 0,
  }))

expectTypesMatch<
  AssemblyDrawingExplosionMove,
  z.input<typeof assemblyDrawingExplosionMove>
>(true)

/** An exploded orthographic viewport. Uses the same paper layout, direction,
 * section and annotation controls as partview, with explicit stage membership and inline drawing-only displacements. */
export interface AssemblyDrawingExplosionViewProps
  extends Omit<
    AssemblyDrawingPartViewProps,
    "partRef" | "stageRef" | "moves" | "factor" | "showTrails"
  > {
  /** Membership to display; required, no implicit stage. */
  stageRef: string
  /** Simultaneous, noncumulative offsets from assembled placement. Expanded targets must not overlap across moves. */
  moves: AssemblyDrawingExplosionMove[]
  /** Fraction of authored separation, finite 0..1; defaults to 1. */
  factor?: number
  /** Depth-tested separation guides; defaults to false. */
  showTrails?: boolean
  /** Geometry membership comes from stageRef. */
  partRef?: never
}
export const assemblyDrawingExplosionViewProps = assemblyDrawingPartViewBase
  .extend({
    partRef: z.never().optional(),
    stageRef: z.string().trim().min(1),
    moves: z.array(assemblyDrawingExplosionMove).min(1),
    factor: z.number().finite().min(0).max(1).default(1),
    showTrails: z.boolean().default(false),
  })
  .superRefine(validateDrawingViewLayout)
  .transform(defaultDrawingViewCenter)
export type InferredAssemblyDrawingExplosionViewProps = z.input<
  typeof assemblyDrawingExplosionViewProps
>
expectTypesMatch<
  AssemblyDrawingExplosionViewProps,
  InferredAssemblyDrawingExplosionViewProps
>(true)
