import { z } from "zod"

const quantity = (units: Record<string, number>, message: string) =>
  z
    .union([z.number(), z.string()])
    .transform((value, ctx) => {
      if (typeof value === "number") return value
      const match = value
        .trim()
        .match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*(\S*)$/)
      const scale = match ? units[match[2]!] : undefined
      if (scale === undefined || !match) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message })
        return z.NEVER
      }
      return Number(match[1]) * scale
    })
    .pipe(z.number().finite())

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
  .regex(/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\s*UI$/i)
  .transform((value) => Number(value.replace(/UI$/i, "")))
  .pipe(z.number().finite().nonnegative())
  .transform((value) => `${value}UI` as const)

export const signalTimeOrUi = z.union([
  unitIntervals,
  signalTime.pipe(z.number().nonnegative()),
])
