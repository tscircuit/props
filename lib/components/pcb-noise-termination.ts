import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { positiveQuantity, strictQuantity } from "../simulation/strict-quantity"

/** Explicit load resistance in ohms, positive capacitance in farads and bias in volts. */
export type PcbNoiseTerminationModel =
  | {
      kind: "resistor"
      resistance: number | string
      biasVoltage: number | string
    }
  | {
      kind: "parallel_rc"
      resistance: number | string
      capacitance: number | string
      biasVoltage: number | string
    }

export interface PcbNoiseTerminationProps {
  /** Defaults in core to `${port}_termination` for stable experiment-local identity. */
  name?: string
  port: string
  /** Numbers are ohms, farads and volts. DC bias is required even when zero. */
  model: PcbNoiseTerminationModel
}

const electrical = {
  resistance: positiveQuantity("ohms?|Ohms?|Ω", "ohms", "50ohm"),
  biasVoltage: strictQuantity("V", "volts", "0V"),
}

export const pcbNoiseTerminationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    port: z.string().trim().min(1),
    model: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("resistor"), ...electrical }).strict(),
      z
        .object({
          kind: z.literal("parallel_rc"),
          ...electrical,
          capacitance: positiveQuantity("F", "farads", "1pF"),
        })
        .strict(),
    ]),
  })
  .strict()

expectTypesMatch<
  PcbNoiseTerminationProps,
  z.input<typeof pcbNoiseTerminationProps>
>(true)
