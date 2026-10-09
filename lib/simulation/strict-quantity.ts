import { z } from "zod"

const quantity = "[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?"
const prefixScale: Record<string, number> = {
  "": 1,
  y: 1e-24,
  z: 1e-21,
  a: 1e-18,
  f: 1e-15,
  p: 1e-12,
  n: 1e-9,
  u: 1e-6,
  µ: 1e-6,
  μ: 1e-6,
  m: 1e-3,
  k: 1e3,
  M: 1e6,
  G: 1e9,
  T: 1e12,
  P: 1e15,
  E: 1e18,
  Z: 1e21,
  Y: 1e24,
}

// Full-string parsing preserves scientific notation and rejects other
// dimensions. The generic Circuit JSON converters currently do neither.
export function strictQuantity(unit: string, label: string, example: string) {
  const pattern = new RegExp(
    `^(${quantity})\\s*(?:([yzafpnumkMGTPEZYµμ]?)(?:${unit}))?$`,
  )
  return z
    .union([
      z.number(),
      z
        .string()
        .trim()
        .regex(pattern, `Use ${label} or a unit string, e.g. ${example}`),
    ])
    .transform((value) => {
      if (typeof value === "number") return value
      const match = pattern.exec(value)!
      return Number(match[1]) * prefixScale[match[2] ?? ""]!
    })
    .pipe(z.number().finite())
}

export function positiveQuantity(unit: string, label: string, example: string) {
  return strictQuantity(unit, label, example).pipe(
    z.number().positive(`${label} must be greater than zero`),
  )
}

export function nonnegativeQuantity(
  unit: string,
  label: string,
  example: string,
) {
  return strictQuantity(unit, label, example).pipe(z.number().nonnegative())
}
