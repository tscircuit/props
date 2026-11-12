import { z } from "zod"

/** A plain decimal number, so `Number`'s hex, blank and `Infinity` quirks are rejected. */
const decimal = (text: string) =>
  Number.parseFloat(text) === Number(text) ? Number(text) : Number.NaN

/** Parses a number, or a string with one of `units` as its suffix, scaled by that unit. */
const quantity = (units: Record<string, number>, message: string) => {
  const suffixes = Object.keys(units).sort((a, b) => b.length - a.length)
  return z
    .union([
      z.number(),
      z.string().transform((text, ctx) => {
        const value = text.trim()
        const unit = suffixes.find((suffix) => value.endsWith(suffix))!
        const scaled =
          decimal(value.slice(0, value.length - unit.length)) * units[unit]!
        if (Number.isNaN(scaled)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          return z.NEVER
        }
        return scaled
      }),
    ])
    .pipe(z.number().finite())
}

/** Parsed rates are bit/s; bytes/s and frequency units are not bit rates. */
export const signalBitRate = quantity(
  {
    "": 1,
    bps: 1,
    "bit/s": 1,
    kbps: 1e3,
    "kbit/s": 1e3,
    Mbps: 1e6,
    "Mbit/s": 1e6,
    Gbps: 1e9,
    "Gbit/s": 1e9,
    Tbps: 1e12,
    "Tbit/s": 1e12,
  },
  "Expected a bit rate in bit/s, e.g. 20Mbps or 250kbps",
).pipe(z.number().positive())

/** Raw and parsed numeric times are seconds, unlike legacy transient props. */
export const signalTime = quantity(
  {
    "": 1,
    s: 1,
    ms: 1e-3,
    us: 1e-6,
    µs: 1e-6,
    μs: 1e-6,
    ns: 1e-9,
    ps: 1e-12,
    fs: 1e-15,
  },
  "Expected a time in seconds, e.g. 2ns",
)

/** UI stays relative until the block or signal bit rate is known. */
const unitIntervals = z
  .string()
  .trim()
  .refine((value) => value.toUpperCase().endsWith("UI"))
  .transform((value) => decimal(value.slice(0, -2).trim()))
  .pipe(z.number().finite().nonnegative())
  .transform((value) => `${value}UI` as const)

export const signalTimeOrUi = z.union([
  unitIntervals,
  signalTime.pipe(z.number().nonnegative()),
])

/** Strictly positive time or UI; UI is resolved by core at the block bit rate. */
export const signalDurationOrUi = z.union([
  unitIntervals.refine((value) => value !== "0UI"),
  signalTime.pipe(z.number().positive()),
])
