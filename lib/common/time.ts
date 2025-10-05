import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export type Time = number | string

export const time = z
  .union([z.string(), z.number()])
  .transform((v) => {
    if (typeof v === "number") return v
    if (v.endsWith("ms")) return parseFloat(v) / 1000
    if (v.endsWith("us")) return parseFloat(v) / 1_000_000
    if (v.endsWith("ns")) return parseFloat(v) / 1_000_000_000
    if (v.endsWith("ps")) return parseFloat(v) / 1_000_000_000_000
    if (v.endsWith("fs")) return parseFloat(v) / 1_000_000_000_000_000
    if (v.endsWith("s")) return parseFloat(v)
    return parseFloat(v)
  })
  .describe("A time value, e.g. '1ms' or 0.001")

expectTypesMatch<Time, z.input<typeof time>>(true)
