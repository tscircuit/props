import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import {
  assemblyDrawingPartViewBase,
  defaultDrawingViewCenter,
  validateDrawingViewLayout,
  type AssemblyDrawingPartViewProps,
} from "./partview"

/** An exploded orthographic viewport. Uses the same paper layout, direction,
 * section and annotation controls as partview, with moves inherited from the referenced assembly.explosion.stage. */
export interface AssemblyDrawingExplosionViewProps
  extends Omit<
    AssemblyDrawingPartViewProps,
    "partRef" | "stageRef" | "factor" | "showTrails"
  > {
  /** Required assembly.explosion.stage reference. Inherit its assembly.explosion.move children; resolve names in the owning assembly, including qualified subassembly names. */
  stageRef: string
  /** Fraction of authored separation, finite 0..1; defaults to 1. */
  factor?: number
  /** Depth-tested separation guides; defaults to false. */
  showTrails?: boolean
  /** Geometry comes from the referenced explosion stage's owning assembly. */
  partRef?: never
}
export const assemblyDrawingExplosionViewProps = assemblyDrawingPartViewBase
  .extend({
    partRef: z.never().optional(),
    stageRef: z.string().trim().min(1),
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
