import { z } from "zod"

/**
 * A duty cycle: a fraction from 0 to 1, given either as a number or as a
 * string holding a plain decimal (scientific notation allowed) with an
 * optional trailing `%`, so `"50%"` parses to 0.5 and `"0.5"` to 0.5.
 * Surrounding whitespace is ignored. The whole string must be numeric —
 * trailing garbage such as `"0.5abc"` or `"50%%"` is rejected instead of
 * being silently truncated the way `parseFloat` would truncate it.
 */
export const dutyCycle = z
  .union([
    z.number(),
    z
      .string()
      .trim()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\s*%?$/,
        'Duty cycle must be a number or a percentage string such as "50%"',
      )
      .transform((value) =>
        value.endsWith("%") ? Number(value.slice(0, -1)) / 100 : Number(value),
      ),
  ])
  .pipe(
    z
      .number()
      .min(0, "Duty cycle must be non-negative")
      .max(1, "Duty cycle cannot be greater than 100%"),
  )
