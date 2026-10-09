import { layer_ref, type LayerRefInput } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { positiveQuantity, strictQuantity } from "../simulation/strict-quantity"

/** DC volts or deterministic NRZ PRBS. Parsed PRBS carries the stable
 * lfsr_fibonacci algorithm, version 1 and 10_90 edge convention. */
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
      /** Nonzero initial LFSR state, less than 2**order. */
      seed: number
    }

/** One driven signal path with an explicit source, load and physical references.
 * Selectors resolve existing PCB contacts after routing; they do not create copper.
 * Positive voltage is signal minus reference. References may be shared.
 * Core creates `${name}_tx`/`${name}_rx` ports, `${name}_source` excitation,
 * `${name}_load` termination and passive observations: `${name}_source_voltage`,
 * `${name}_load_voltage`, `${name}_source_current` and `${name}_load_current`.
 * Positive terminal current enters the PCB at each signal contact.
 */
export interface PcbNoiseChannelProps {
  name: string
  role: "aggressor" | "victim"
  source: string
  sourceReference: string
  load: string
  loadReference: string
  /** Required by core for a contact spanning multiple copper layers. */
  sourceLayer?: LayerRefInput
  sourceReferenceLayer?: LayerRefInput
  loadLayer?: LayerRefInput
  loadReferenceLayer?: LayerRefInput
  /** Real Thevenin resistance in ohms, independent of extraction impedance. */
  sourceImpedance: number | string
  /** Real load resistance in ohms. */
  loadImpedance: number | string
  /** DC load bias in volts, required even when zero. */
  loadBiasVoltage: number | string
  /** Positive farads selects parallel RC; omission explicitly selects a resistor. */
  loadCapacitance?: number | string
  waveform: PcbNoiseWaveform
}

const selector = z.string().trim().min(1)
const resistance = positiveQuantity("ohms?|Ohms?|Ω", "ohms", "50ohm")
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
    seed: z.number().int().positive(),
  })
  .strict()

export const pcbNoiseChannelProps = z
  .object({
    name: selector,
    role: z.enum(["aggressor", "victim"]),
    source: selector,
    sourceReference: selector,
    load: selector,
    loadReference: selector,
    sourceLayer: layer_ref.optional(),
    sourceReferenceLayer: layer_ref.optional(),
    loadLayer: layer_ref.optional(),
    loadReferenceLayer: layer_ref.optional(),
    sourceImpedance: resistance,
    loadImpedance: resistance,
    loadBiasVoltage: strictQuantity("V", "volts", "0V"),
    loadCapacitance: positiveQuantity("F", "farads", "1pF").optional(),
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
  .transform(({ waveform, ...props }) => ({
    ...props,
    waveform:
      waveform.kind === "prbs"
        ? {
            ...waveform,
            algorithm: "lfsr_fibonacci" as const,
            algorithmVersion: "1" as const,
            edgeTimeConvention: "10_90" as const,
          }
        : waveform,
  }))

expectTypesMatch<PcbNoiseChannelProps, z.input<typeof pcbNoiseChannelProps>>(
  true,
)
