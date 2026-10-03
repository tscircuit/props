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

export function validateTraceSpacing(
  props: {
    pcbTraceSpacing?: z.output<typeof traceSpacing>
    pcbExternalTraceSpacing?: z.output<typeof traceSpacing>
    pcbReducedTraceSpacing?: z.output<typeof traceSpacing>
    maxReducedSpacingLength?: number
  },
  ctx: z.RefinementCtx,
) {
  if (
    (props.pcbReducedTraceSpacing !== undefined) !==
    (props.maxReducedSpacingLength !== undefined)
  )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxReducedSpacingLength"],
      message:
        "pcbReducedTraceSpacing and maxReducedSpacingLength must be supplied together",
    })
  if (
    props.pcbReducedTraceSpacing !== undefined &&
    props.pcbTraceSpacing === undefined &&
    props.pcbExternalTraceSpacing === undefined
  )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pcbReducedTraceSpacing"],
      message: "Reduced spacing requires a normal trace spacing requirement",
    })
  const reduced = props.pcbReducedTraceSpacing
  for (const normal of [props.pcbTraceSpacing, props.pcbExternalTraceSpacing]) {
    if (reduced === undefined || normal === undefined) continue
    const wider =
      typeof reduced === "number" && typeof normal === "number"
        ? reduced > normal
        : typeof reduced !== "number" && typeof normal !== "number"
          ? reduced.widthMultiplier > normal.widthMultiplier
          : false
    if (wider)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pcbReducedTraceSpacing"],
        message: "Reduced spacing cannot exceed normal spacing",
      })
  }
}
