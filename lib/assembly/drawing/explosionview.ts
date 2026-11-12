import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import {
  assemblyDrawingPartViewBase,
  defaultDrawingViewCenter,
  validateDrawingViewLayout,
  type AssemblyDrawingPartViewProps,
} from "./partview"

/** An exploded orthographic viewport. Uses the same paper layout, direction,
 * section and annotation controls as partview, with explicit stage and pose. */
export interface AssemblyDrawingExplosionViewProps
  extends Omit<
    AssemblyDrawingPartViewProps,
    "partRef" | "stageRef" | "explosionRef"
  > {
  /** Membership to display; required, no implicit stage. */
  stageRef: string
  /** Reusable assembly.drawing.explosion selector; required. */
  explosionRef: string
  /** Geometry membership comes from stageRef. */
  partRef?: never
}
export const assemblyDrawingExplosionViewProps = assemblyDrawingPartViewBase
  .extend({
    partRef: z.never().optional(),
    stageRef: z.string().trim().min(1),
    explosionRef: z.string().trim().min(1),
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
