import { z } from "zod"

/** Degrees counterclockwise as a number, or a string such as `"90deg"`,
 * `"1.57rad"`, `"90deg ccw"` or `"90deg cw"`.
 */
export type Rotation = number | string

const rotationPattern =
  /^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*(deg|rad)?\s*(ccw|cw)?\s*$/

/** Parses a rotation to degrees counterclockwise.
 *
 * A number is degrees. A string is a number with an optional `deg` or `rad`
 * unit (degrees when omitted) and an optional `ccw` or `cw` direction
 * (counterclockwise when omitted), so `"90deg cw"` parses to -90. Any other
 * string, and any non-finite value, is rejected.
 */
export const rotation = z
  .union([z.number(), z.string()])
  .transform((value, ctx) => {
    if (typeof value === "number") return value
    const match = rotationPattern.exec(value)
    if (!match) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Expected degrees as a number, or a string such as "90deg", "90deg ccw", "90deg cw" or "1.57rad"',
      })
      return z.NEVER
    }
    const [, magnitude, unit, direction] = match
    const degrees =
      unit === "rad" ? (Number(magnitude) * 180) / Math.PI : Number(magnitude)
    // Adding zero turns the -0 of "0deg cw" into 0.
    return (direction === "cw" ? -degrees : degrees) + 0
  })
  .pipe(z.number().finite())
