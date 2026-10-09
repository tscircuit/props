import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { positiveQuantity, strictQuantity } from "../simulation/strict-quantity"

export interface PcbNoiseSourceModel {
  kind: "thevenin"
  /** Real output resistance in ohms; independent of extraction reference impedance. */
  resistance: number | string
}

/** DC volts, or deterministic NRZ PRBS with volts, seconds and symbols/second.
 * PRBS algorithm/version and a nonzero initial state are required. No defaults. */
export type PcbNoiseWaveform =
  | { kind: "dc"; voltage: number | string }
  | {
      kind: "prbs"
      order: 7 | 9 | 11 | 15 | 23 | 31
      /** Symbols per second. MHz means one million symbols per second. */
      baudRate: number | string
      lowVoltage: number | string
      highVoltage: number | string
      /** Positive 10–90% transition times in seconds; ideal steps are unsupported. */
      riseTime: number | string
      fallTime: number | string
      edgeTimeConvention: "10_90"
      /** Nonzero initial LFSR state, less than 2**order; no random implicit seed. */
      seed: number
      algorithm: "lfsr_fibonacci"
      algorithmVersion: "1"
    }

/** Explicit voltage driver. Use DC for a quiet victim; a quiet victim has no digital eye. */
export interface PcbNoiseExcitationProps {
  /** Defaults in core to `${port}_source` for stable experiment-local identity. */
  name?: string
  port: string
  role: "aggressor" | "victim"
  sourceModel: PcbNoiseSourceModel
  waveform: PcbNoiseWaveform
}

const prbs = z
  .object({
    kind: z.literal("prbs"),
    order: z.union([
      z.literal(7),
      z.literal(9),
      z.literal(11),
      z.literal(15),
      z.literal(23),
      z.literal(31),
    ]),
    baudRate: positiveQuantity(
      "Hz|baud|symbols/s",
      "symbols per second",
      "500MHz",
    ),
    lowVoltage: strictQuantity("V", "volts", "0V"),
    highVoltage: strictQuantity("V", "volts", "1V"),
    riseTime: positiveQuantity("s", "seconds", "200ps"),
    fallTime: positiveQuantity("s", "seconds", "200ps"),
    edgeTimeConvention: z.literal("10_90"),
    seed: z.number().int().positive(),
    algorithm: z.literal("lfsr_fibonacci"),
    algorithmVersion: z.literal("1"),
  })
  .strict()

export const pcbNoiseExcitationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    port: z.string().trim().min(1),
    role: z.enum(["aggressor", "victim"]),
    sourceModel: z
      .object({
        kind: z.literal("thevenin"),
        resistance: positiveQuantity("ohms?|Ohms?|Ω", "ohms", "50ohm"),
      })
      .strict(),
    waveform: z.discriminatedUnion("kind", [
      prbs,
      z
        .object({
          kind: z.literal("dc"),
          voltage: strictQuantity("V", "volts", "0V"),
        })
        .strict(),
    ]),
  })
  .strict()
  .superRefine(({ waveform }, ctx) => {
    if (waveform.kind !== "prbs") return
    if (waveform.seed >= 2 ** waveform.order) {
      ctx.addIssue({
        code: "custom",
        message: "PRBS seed must be a nonzero state less than 2**order",
        path: ["waveform", "seed"],
      })
    }
    if (waveform.highVoltage <= waveform.lowVoltage) {
      ctx.addIssue({
        code: "custom",
        message: "highVoltage must exceed lowVoltage",
        path: ["waveform", "highVoltage"],
      })
    }
    // The full SPICE ramp is 10–90% time / 0.8 and must fit a symbol.
    for (const field of ["riseTime", "fallTime"] as const) {
      if (waveform[field] * waveform.baudRate >= 0.8) {
        ctx.addIssue({
          code: "custom",
          message: "The full PRBS ramp must be shorter than one unit interval",
          path: ["waveform", field],
        })
      }
    }
  })

expectTypesMatch<
  PcbNoiseExcitationProps,
  z.input<typeof pcbNoiseExcitationProps>
>(true)
