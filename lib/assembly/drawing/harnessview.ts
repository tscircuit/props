import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { defaultDrawingViewCenter, validateDrawingViewLayout } from "./partview"

/** A flattened view of one assembly.cable for cable manufacturing: both
 * connectors, one line per assembly.cablewire, connector designators, end pin
 * numbers and the cable's length. The cable's 3D route is not shown and its
 * drawn length is not to scale. */
export interface AssemblyDrawingHarnessViewProps {
  name?: string
  displayName?: string
  /** Selector for the assembly.cable to draw. */
  cableRef: string
  /** Viewport center relative to the drawing page anchor, mm; +X right, +Y up. Defaults to 0 on axes without a relative reference. */
  centerX?: Distance
  centerY?: Distance
  /** Sibling view selectors, with the same meaning and conflicts as on assembly.drawing.partview. */
  leftOfRef?: string
  rightOfRef?: string
  aboveRef?: string
  belowRef?: string
  /** Paper-space viewport size; dimensions must be positive. */
  width: Distance
  height: Distance
  /** Circle the item numbers of the cable's connectors, contacts and wire. Requires an assembly.drawing.bomtable on the same page. Defaults to false. */
  showBalloons?: boolean
  /** Nested assembly.drawing.note annotations. */
  children?: any
}

export const assemblyDrawingHarnessViewProps = z
  .object({
    name: z.string().optional(),
    displayName: z.string().optional(),
    cableRef: z.string().trim().min(1),
    centerX: distance.pipe(z.number().finite()).optional(),
    centerY: distance.pipe(z.number().finite()).optional(),
    leftOfRef: z.string().trim().min(1).optional(),
    rightOfRef: z.string().trim().min(1).optional(),
    aboveRef: z.string().trim().min(1).optional(),
    belowRef: z.string().trim().min(1).optional(),
    width: distance.pipe(z.number().finite().positive()),
    height: distance.pipe(z.number().finite().positive()),
    showBalloons: z.boolean().default(false),
    children: z.any().optional(),
  })
  .superRefine(validateDrawingViewLayout)
  .transform(defaultDrawingViewCenter)

expectTypesMatch<
  AssemblyDrawingHarnessViewProps,
  z.input<typeof assemblyDrawingHarnessViewProps>
>(true)
