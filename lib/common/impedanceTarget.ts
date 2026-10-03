import { resistance } from "circuit-json"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** Scalar target or an inclusive acceptable range, in ohms. Describes design
 * intent; the physical stackup is still required to check achieved impedance. */
export type ImpedanceTarget =
  | number
  | string
  | { min: number | string; max: number | string }
const positiveImpedance = resistance.pipe(z.number().positive().finite())
export const impedanceTarget = z.union([
  positiveImpedance,
  z
    .object({ min: positiveImpedance, max: positiveImpedance })
    .strict()
    .refine((r) => r.min <= r.max, "Impedance range must be ordered"),
])
expectTypesMatch<ImpedanceTarget, z.input<typeof impedanceTarget>>(true)
