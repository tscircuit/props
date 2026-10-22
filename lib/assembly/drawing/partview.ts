import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** Axis names use tscircuit CAD coordinates: mm, +Z up. The camera sits on
 * the named side of the model and looks toward its center. */
export type AssemblyDrawingPartViewDirection =
  | "x+"
  | "x-"
  | "y+"
  | "y-"
  | "z+"
  | "z-"
  | "isometric"

export interface AssemblyDrawingSectionPlane {
  axis: "x" | "y" | "z"
  /** Plane coordinate in CAD world space, numeric mm or a distance string. */
  offset: Distance
  /** Retain coordinates <= offset or >= offset, respectively. */
  keepSide: "less" | "greater"
  /** Physical distance between 45-degree strokes on the model. Defaults to 1mm. */
  hatchSpacing?: Distance
}

export const assemblyDrawingSectionPlane = z.object({
  axis: z.enum(["x", "y", "z"]),
  offset: distance.pipe(z.number().finite()),
  keepSide: z.enum(["less", "greater"]),
  hatchSpacing: distance.pipe(z.number().finite().positive()).default(1),
})

/** An orthographic viewport within an assembly.drawing.page. */
export interface AssemblyDrawingPartViewProps {
  name?: string
  displayName?: string
  /** Selector for the board, group or assembly geometry shown in this view. */
  partRef: string
  direction: AssemblyDrawingPartViewDirection
  /** Viewport center relative to the paper center, mm; +X right, +Y up. Defaults to 0 on axes without a relative reference. */
  centerX?: Distance
  centerY?: Distance
  /** Sibling part-view selector; infer centerX with this viewport left of the reference. Conflicts with rightOfRef and centerX. */
  leftOfRef?: string
  /** Sibling part-view selector; infer centerX with this viewport right of the reference. Conflicts with leftOfRef and centerX. */
  rightOfRef?: string
  /** Sibling part-view selector; infer centerY with this viewport above the reference. Conflicts with belowRef and centerY. */
  aboveRef?: string
  /** Sibling part-view selector; infer centerY with this viewport below the reference. Conflicts with aboveRef and centerY. */
  belowRef?: string
  /** Paper-space viewport size; dimensions must be positive. */
  width: Distance
  height: Distance
  /** Draw obscured edges as dashed strokes. Defaults to false. */
  showHiddenEdges?: boolean
  /** A planar cut with diagonal hatching on closed cut surfaces. */
  section?: AssemblyDrawingSectionPlane
}

export const assemblyDrawingPartViewProps = z
  .object({
    name: z.string().optional(),
    displayName: z.string().optional(),
    partRef: z.string().min(1),
    direction: z.enum(["x+", "x-", "y+", "y-", "z+", "z-", "isometric"]),
    centerX: distance.pipe(z.number().finite()).optional(),
    centerY: distance.pipe(z.number().finite()).optional(),
    leftOfRef: z.string().trim().min(1).optional(),
    rightOfRef: z.string().trim().min(1).optional(),
    aboveRef: z.string().trim().min(1).optional(),
    belowRef: z.string().trim().min(1).optional(),
    width: distance.pipe(z.number().finite().positive()),
    height: distance.pipe(z.number().finite().positive()),
    showHiddenEdges: z.boolean().default(false),
    section: assemblyDrawingSectionPlane.optional(),
  })
  .superRefine((view, ctx) => {
    for (const [center, negative, positive] of [
      ["centerX", "leftOfRef", "rightOfRef"],
      ["centerY", "belowRef", "aboveRef"],
    ] as const) {
      if (view[negative] !== undefined && view[positive] !== undefined)
        ctx.addIssue({
          code: "custom",
          path: [positive],
          message: `${negative} and ${positive} are mutually exclusive`,
        })
      if (
        view[center] !== undefined &&
        (view[negative] !== undefined || view[positive] !== undefined)
      )
        ctx.addIssue({
          code: "custom",
          path: [center],
          message: `${center} cannot be combined with ${negative} or ${positive}`,
        })
    }
  })
  .transform((view) => ({
    ...view,
    ...(view.leftOfRef || view.rightOfRef
      ? {}
      : { centerX: view.centerX ?? 0 }),
    ...(view.aboveRef || view.belowRef ? {} : { centerY: view.centerY ?? 0 }),
  }))

export type InferredAssemblyDrawingPartViewProps = z.input<
  typeof assemblyDrawingPartViewProps
>
expectTypesMatch<
  AssemblyDrawingSectionPlane,
  z.input<typeof assemblyDrawingSectionPlane>
>(true)
expectTypesMatch<
  AssemblyDrawingPartViewProps,
  z.input<typeof assemblyDrawingPartViewProps>
>(true)
