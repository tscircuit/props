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
  target: string
  direction: AssemblyDrawingPartViewDirection
  /** Viewport center relative to the paper center, mm; +X right, +Y up. Defaults to 0. */
  x?: Distance
  y?: Distance
  /** Paper-space viewport size; dimensions must be positive. */
  width: Distance
  height: Distance
  /** Model-to-paper ratio: 1 is 1:1, 0.5 is 1:2. Omit to fit the viewport. */
  scale?: number
  /** Draw obscured edges as dashed strokes. Defaults to false. */
  showHiddenEdges?: boolean
  /** A planar cut with diagonal hatching on closed cut surfaces. */
  section?: AssemblyDrawingSectionPlane
}

export const assemblyDrawingPartViewProps = z.object({
  name: z.string().optional(),
  displayName: z.string().optional(),
  target: z.string().min(1),
  direction: z.enum(["x+", "x-", "y+", "y-", "z+", "z-", "isometric"]),
  x: distance.pipe(z.number().finite()).default(0),
  y: distance.pipe(z.number().finite()).default(0),
  width: distance.pipe(z.number().finite().positive()),
  height: distance.pipe(z.number().finite().positive()),
  scale: z.number().finite().positive().optional(),
  showHiddenEdges: z.boolean().default(false),
  section: assemblyDrawingSectionPlane.optional(),
})

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
