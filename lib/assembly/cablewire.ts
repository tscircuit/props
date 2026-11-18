import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** American Wire Gauge as a number, or a string with an optional awg suffix. */
export const wireAwg = z
  .union([z.number(), z.string()])
  .transform((value, context) => {
    const gauge =
      typeof value === "number"
        ? value
        : /^\d+(\.\d+)?(\s*awg)?$/i.test(value.trim())
          ? Number.parseFloat(value)
          : Number.NaN
    if (!Number.isFinite(gauge) || gauge < 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expected a wire gauge such as 22 or "22awg"',
      })
      return z.NEVER
    }
    return gauge
  })

/** A 1-based contact position, or the matching pinN label. */
const cablePin = z
  .union([z.number(), z.string()])
  .transform((value, context) => {
    const pin =
      typeof value === "number"
        ? value
        : /^(pin)?[1-9]\d*$/i.test(value.trim())
          ? Number(value.trim().replace(/^pin/i, ""))
          : Number.NaN
    if (!Number.isSafeInteger(pin) || pin < 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expected a contact position such as 1 or "pin1"',
      })
      return z.NEVER
    }
    return pin
  })

/** One insulated conductor of the parent assembly.cable. Connector cavities
 * with no wire are left unpopulated, so the two ends may differ in contact count. */
export interface AssemblyCableWireProps {
  /** Signal or conductor name, e.g. "A+". */
  name?: string
  /** Contact on the connector at the cable's from end: 1 or "pin1". */
  fromPin: number | string
  /** Contact on the connector at the cable's to end: 1 or "pin1". */
  toPin: number | string
  /** Insulation color as it should read on a drawing, e.g. "black" or "red/white". */
  color?: string
  /** Conductor gauge: 22 or "22awg". Omitted inherits the cable's wireAwg. */
  awg?: number | string
}

export const assemblyCableWireProps = z.object({
  name: z.string().trim().min(1).optional(),
  fromPin: cablePin,
  toPin: cablePin,
  color: z.string().trim().min(1).optional(),
  awg: wireAwg.optional(),
})

export type AssemblyCableWirePropsInput = z.input<typeof assemblyCableWireProps>

expectTypesMatch<AssemblyCableWireProps, AssemblyCableWirePropsInput>(true)
