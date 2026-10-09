import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  nonnegativeQuantity,
  positiveQuantity,
  strictQuantity,
} from "../simulation/strict-quantity"

export interface PcbNoiseTimeInterval {
  start: number | string
  end: number | string
}

export type PcbNoiseEyeOrigin =
  | { kind: "authored_epoch"; epoch: number | string }
  | { kind: "one_phase_estimate"; trainingInterval: PcbNoiseTimeInterval }

/** Seconds and volts, with an explicit timing origin and no synthetic clock default.
 * recovered_clock is a reserved typed input: validation rejects it as unsupported. */
export type PcbNoiseEyeTiming =
  | {
      kind: "known_ui"
      unitInterval: number | string
      sampleOffset: number | string
      /** Symbol-boundary epoch shorthand, normalized to authored_epoch. Conflicts with origin. */
      epoch?: number | string
      /** Supply exactly one of origin or epoch; timing is never silently estimated. */
      origin?: PcbNoiseEyeOrigin
    }
  | {
      kind: "explicit_clock"
      clock:
        | { kind: "observation"; clockObservation: string }
        | { kind: "authored_edges"; edgeSource: string }
      edge: "rising" | "falling" | "both"
      threshold: number | string
      uiPerSelectedEdge: number
      sampleOffset: number | string
      /** Authored transmitter edges are allowed only with nominal_reference. */
      interpretation: "actual_receiver_clock" | "nominal_reference"
    }
  | {
      /** Reserved input: validation rejects recovery until a verified provider exists. */
      kind: "recovered_clock"
      method: "edge_lattice"
      baudSearchRange: [number | string, number | string]
      trainingInterval: PcbNoiseTimeInterval
    }
  | {
      /** Reserved input: CDR requires explicit loop parameters and remains unsupported. */
      kind: "recovered_clock"
      method: "cdr"
      baudSearchRange: [number | string, number | string]
      trainingInterval: PcbNoiseTimeInterval
      loopBandwidth: number | string
      damping: number
    }

/** Digital active-NRZ eye request. Analysis uses full-resolution voltages and explicit timing. */
export interface PcbNoiseEyeProps {
  observation: string
  modulation: "nrz"
  /** known_ui or explicit_clock. Reserved recovered_clock inputs are rejected. */
  timing: PcbNoiseEyeTiming
}

const seconds = strictQuantity("s", "seconds", "0ns")
const positiveSeconds = positiveQuantity("s", "seconds", "2ns")
const offset = nonnegativeQuantity("s", "seconds", "1ns")
const interval = z
  .object({ start: offset, end: positiveSeconds })
  .strict()
  .refine((v) => v.end > v.start, "trainingInterval end must exceed start")
const origin = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("authored_epoch"), epoch: seconds }).strict(),
  z
    .object({
      kind: z.literal("one_phase_estimate"),
      trainingInterval: interval,
    })
    .strict(),
])
const knownUi = z
  .object({
    kind: z.literal("known_ui"),
    unitInterval: positiveSeconds,
    sampleOffset: offset,
    epoch: seconds.optional(),
    origin: origin.optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if ((v.epoch === undefined) === (v.origin === undefined)) {
      ctx.addIssue({
        code: "custom",
        message: "Supply exactly one of epoch or origin",
        path: ["origin"],
      })
    }
    if (v.sampleOffset >= v.unitInterval) {
      ctx.addIssue({
        code: "custom",
        message: "sampleOffset must be less than unitInterval",
        path: ["sampleOffset"],
      })
    }
  })
const explicitClock = z
  .object({
    kind: z.literal("explicit_clock"),
    clock: z.discriminatedUnion("kind", [
      z
        .object({
          kind: z.literal("observation"),
          clockObservation: z.string().trim().min(1),
        })
        .strict(),
      z
        .object({
          kind: z.literal("authored_edges"),
          edgeSource: z.string().trim().min(1),
        })
        .strict(),
    ]),
    edge: z.enum(["rising", "falling", "both"]),
    threshold: strictQuantity("V", "volts", "0.5V"),
    uiPerSelectedEdge: z.number().finite().positive(),
    sampleOffset: offset,
    interpretation: z.enum(["actual_receiver_clock", "nominal_reference"]),
  })
  .strict()
  .refine(
    (v) =>
      v.clock.kind !== "authored_edges" ||
      v.interpretation === "nominal_reference",
    {
      message: "Authored source edges require nominal_reference timing",
      path: ["interpretation"],
    },
  )
const recovery = {
  kind: z.literal("recovered_clock"),
  baudSearchRange: z.tuple([
    positiveQuantity("Hz|baud|symbols/s", "symbols per second", "500MHz"),
    positiveQuantity("Hz|baud|symbols/s", "symbols per second", "600MHz"),
  ]),
  trainingInterval: interval,
}

export const pcbNoiseEyeProps = z
  .object({
    observation: z.string().trim().min(1),
    modulation: z.literal("nrz"),
    timing: z.union([
      knownUi,
      explicitClock,
      z.object({ ...recovery, method: z.literal("edge_lattice") }).strict(),
      z
        .object({
          ...recovery,
          method: z.literal("cdr"),
          loopBandwidth: positiveQuantity("Hz", "hertz", "1MHz"),
          damping: z.number().finite().positive(),
        })
        .strict(),
    ]),
  })
  .strict()
  .transform(({ timing, ...props }, ctx) => {
    if (timing.kind === "recovered_clock") {
      ctx.addIssue({
        code: "custom",
        message:
          "recovered_clock is unsupported; use known_ui or explicit_clock",
        path: ["timing", "kind"],
      })
      return z.NEVER
    }
    if (timing.kind === "known_ui") {
      return {
        ...props,
        timing: {
          kind: timing.kind,
          unitInterval: timing.unitInterval,
          sampleOffset: timing.sampleOffset,
          origin: timing.origin ?? {
            kind: "authored_epoch" as const,
            epoch: timing.epoch!,
          },
        },
      }
    }
    return { ...props, timing }
  })

expectTypesMatch<PcbNoiseEyeProps, z.input<typeof pcbNoiseEyeProps>>(true)
