import { z } from "zod"

export const dutyCycle = z
  .union([
    z.number(),
    z
      .string()
      .trim()
      .regex(
        /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?\s*%?$/,
        "Duty cycle must be a number or percentage",
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
