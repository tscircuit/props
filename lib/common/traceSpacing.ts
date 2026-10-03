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

/** Optional tight-escape allowance. The maxLength budget is per signal and
 * shared across all neighbours; overlapping close regions count once.
 * Numeric minimum is mm; width multiples use the same units as TraceSpacing. */
export interface PcbEscapeSpacing {
  minimum: TraceSpacing
  /** Maximum total routed length at reduced spacing, in mm. */
  maxLength: number | string
}
export const pcbEscapeSpacing = z
  .object({
    minimum: traceSpacing,
    maxLength: distance.pipe(z.number().nonnegative().finite()),
  })
  .strict()
expectTypesMatch<PcbEscapeSpacing, z.input<typeof pcbEscapeSpacing>>(true)

export function validateTraceSpacing(
  props: {
    pcbTraceSpacing?: z.output<typeof traceSpacing>
    pcbSpacingToOtherSignals?: z.output<typeof traceSpacing>
    pcbEscapeSpacing?: z.output<typeof pcbEscapeSpacing>
  },
  ctx: z.RefinementCtx,
) {
  if (
    props.pcbEscapeSpacing !== undefined &&
    props.pcbTraceSpacing === undefined &&
    props.pcbSpacingToOtherSignals === undefined
  )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pcbEscapeSpacing"],
      message: "Escape spacing requires a normal trace spacing requirement",
    })
  const minimum = props.pcbEscapeSpacing?.minimum
  for (const normal of [
    props.pcbTraceSpacing,
    props.pcbSpacingToOtherSignals,
  ]) {
    if (minimum === undefined || normal === undefined) continue
    const wider =
      typeof minimum === "number" && typeof normal === "number"
        ? minimum > normal
        : typeof minimum !== "number" && typeof normal !== "number"
          ? minimum.widthMultiplier > normal.widthMultiplier
          : false
    if (wider)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pcbEscapeSpacing", "minimum"],
        message: "Escape minimum cannot exceed normal spacing",
      })
  }
}
