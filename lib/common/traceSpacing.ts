import { distance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** Centreline distance in mm, or a multiple of the larger local trace width
 * written as e.g. "3w". Parsed multiples remain {widthMultiplier: 3} so the
 * checker can evaluate varying widths without choosing a width in props. */
export type TraceSpacing = number | string
const widthSpacing = z
  .string()
  .regex(/^\s*(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\s*w\s*$/i)
  .transform((value) => ({
    widthMultiplier: Number(value.trim().replace(/w$/i, "")),
  }))
  .pipe(z.object({ widthMultiplier: z.number().positive().finite() }))
const absoluteSpacing = distance.pipe(z.number().positive().finite())
export const traceSpacing = z.union([widthSpacing, absoluteSpacing])
expectTypesMatch<TraceSpacing, z.input<typeof traceSpacing>>(true)
