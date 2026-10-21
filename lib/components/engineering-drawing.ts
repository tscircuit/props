import { z } from "zod"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A paper-space drawing of one circuit/assembly, containing engineering views. */
export interface EngineeringDrawingProps {
  name?: string
  displayName?: string
  /** Circuit selector for the board, group or assembly to draw. */
  target: string
  /** Paper dimensions in mm when numeric; unit strings are accepted. */
  width: Distance
  height: Distance
  children?: any
}

export const engineeringDrawingProps = z.object({
  name: z.string().optional(),
  displayName: z.string().optional(),
  target: z.string().min(1),
  width: distance.pipe(z.number().finite().positive()),
  height: distance.pipe(z.number().finite().positive()),
  children: z.any().optional(),
})

export type InferredEngineeringDrawingProps = z.input<
  typeof engineeringDrawingProps
>
expectTypesMatch<
  EngineeringDrawingProps,
  z.input<typeof engineeringDrawingProps>
>(true)
