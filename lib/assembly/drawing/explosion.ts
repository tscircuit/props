import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import {
  assemblyDrawingSelection,
  hasAssemblyDrawingSelection,
  type AssemblyDrawingSelection,
} from "./stage"

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
/** Drawing-only pose. Does not execute the ordered assembly.explosion.stage API. */
export interface AssemblyDrawingExplosionProps {
  name: string
  displayName?: string
  /** Fraction of authored separation, 0..1; defaults to 1. */
  factor?: number
  /** Depth-tested separation guides; defaults to false. */
  showTrails?: boolean
  /** Simultaneous, noncumulative offsets. Expanded targets must not overlap across moves. */
  moves: AssemblyDrawingExplosionMove[]
}
export const assemblyDrawingExplosionProps = z.object({
  name: z.string().trim().min(1),
  displayName: z.string().optional(),
  factor: z.number().finite().min(0).max(1).default(1),
  showTrails: z.boolean().default(false),
  moves: z.array(assemblyDrawingExplosionMove).min(1),
})
expectTypesMatch<
  AssemblyDrawingExplosionMove,
  z.input<typeof assemblyDrawingExplosionMove>
>(true)
expectTypesMatch<
  AssemblyDrawingExplosionProps,
  z.input<typeof assemblyDrawingExplosionProps>
>(true)
