import { resistance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** Scalar ohm target or a tolerance string, e.g. "50±25ohm".
 * Input remains XML-compatible. Component parsing expands tolerance strings
 * to the scalar target and its Min/Max sibling props, all in ohms. */
export type ImpedanceTarget = number | string
export const positiveImpedance = z
  .union([
    z.number(),
    z
      .string()
      .refine(
        (value) => !/(?:±|\+\/-)/.test(value),
        "Use a scalar impedance for explicit bounds",
      ),
  ])
  .pipe(resistance)
  .pipe(z.number().positive().finite())
const quantity = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*(.*?)$/i
const tolerantImpedance = z
  .string()
  .regex(/(?:±|\+\/-)/)
  .transform((value, ctx) => {
    const parts = value.trim().split(/\s*(?:±|\+\/-)\s*/)
    const nominal = parts.length === 2 ? parts[0]!.match(quantity) : null
    const tolerance = parts.length === 2 ? parts[1]!.match(quantity) : null
    if (!nominal || !tolerance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use a nominal impedance ± an absolute ohm tolerance",
      })
      return z.NEVER
    }
    const ohmUnit = /^(?:[yzafpnumkKMGTPEZYµμ])?(?:ohms?|Ω)$/i
    if (
      (nominal[2] && !ohmUnit.test(nominal[2])) ||
      (tolerance[2] && !ohmUnit.test(tolerance[2]))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Use an absolute ohm tolerance, not a percentage or another unit",
      })
      return z.NEVER
    }
    const nominalValue = resistance.safeParse(
      `${nominal[1]}${nominal[2] || tolerance[2] || "ohm"}`,
    )
    const toleranceValue = resistance.safeParse(
      `${tolerance[1]}${tolerance[2] || nominal[2] || "ohm"}`,
    )
    if (
      !nominalValue.success ||
      !toleranceValue.success ||
      !Number.isFinite(nominalValue.data) ||
      !Number.isFinite(toleranceValue.data) ||
      nominalValue.data <= 0 ||
      toleranceValue.data < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Nominal impedance must be positive and tolerance nonnegative, in ohms",
      })
      return z.NEVER
    }
    return {
      nominal: nominalValue.data,
      min: nominalValue.data - toleranceValue.data,
      max: nominalValue.data + toleranceValue.data,
    }
  })
  .pipe(
    z.object({
      nominal: z.number().positive().finite(),
      min: z.number().positive().finite(),
      max: z.number().positive().finite(),
    }),
  )
const scalarImpedance = positiveImpedance
export const impedanceTarget = z.union([tolerantImpedance, scalarImpedance])
expectTypesMatch<ImpedanceTarget, z.input<typeof impedanceTarget>>(true)

/** Explicit bounds may accompany a scalar target. When both range notations
 * are supplied, they must agree; no conflicting bounds are silently replaced. */
export function validateImpedanceTarget(
  target: z.output<typeof impedanceTarget> | undefined,
  min: number | undefined,
  max: number | undefined,
  ctx: z.RefinementCtx,
  propName: string,
) {
  if (min !== undefined && max !== undefined && min > max)
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [`${propName}Max`],
      message: "Maximum impedance cannot be below minimum impedance",
    })
  if (typeof target === "object") {
    for (const [suffix, explicit, derived] of [
      ["Min", min, target.min],
      ["Max", max, target.max],
    ] as const)
      if (
        explicit !== undefined &&
        Math.abs(explicit - derived) > 1e-9 * Math.max(1, Math.abs(derived))
      )
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [`${propName}${suffix}`],
          message:
            "Explicit impedance bound conflicts with the target tolerance",
        })
  } else if (
    target !== undefined &&
    ((min !== undefined && target < min) || (max !== undefined && target > max))
  )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [propName],
      message: "Target impedance must lie within its declared bounds",
    })
}
