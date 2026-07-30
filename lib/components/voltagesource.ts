import { frequency, ms, rotation, voltage } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { createConnectionsProp } from "lib/common/connectionsProp"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type WaveShape = "sinewave" | "square" | "triangle" | "sawtooth"

export const voltageSourcePinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type VoltageSourcePinLabels = (typeof voltageSourcePinLabels)[number]

export interface VoltageSourceProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  voltage?: number | string
  frequency?: number | string
  peakToPeakVoltage?: number | string
  waveShape?: WaveShape
  phase?: number | string
  dutyCycle?: number | string
  pulseDelay?: number | string
  riseTime?: number | string
  fallTime?: number | string
  pulseWidth?: number | string
  period?: number | string
  /** Small-signal AC magnitude. Raw numbers are volts. */
  acMagnitude?: number | string
  /** Small-signal AC phase. Raw numbers are degrees. */
  acPhase?: number | string
  /** Piecewise-linear transient source points. Raw times are milliseconds. */
  voltageWaveform?: Array<{
    time: number | string
    voltage: number | string
  }>
  connections?: Connections<VoltageSourcePinLabels>
}

const percentage = z
  .union([z.string(), z.number()])
  .transform((val) => {
    if (typeof val === "string") {
      if (val.endsWith("%")) {
        return parseFloat(val.slice(0, -1)) / 100
      }
      return parseFloat(val)
    }
    return val
  })
  .pipe(
    z
      .number()
      .min(0, "Duty cycle must be non-negative")
      .max(1, "Duty cycle cannot be greater than 100%"),
  )

export const voltageSourceProps = commonComponentProps
  .extend({
    voltage: voltage.optional(),
    frequency: frequency.optional(),
    peakToPeakVoltage: voltage.optional(),
    waveShape: z
      .enum(["sinewave", "square", "triangle", "sawtooth"])
      .optional(),
    phase: rotation.optional(),
    dutyCycle: percentage.optional(),
    pulseDelay: ms.optional(),
    riseTime: ms.optional(),
    fallTime: ms.optional(),
    pulseWidth: ms.optional(),
    period: ms.optional(),
    acMagnitude: voltage.optional(),
    acPhase: rotation.optional(),
    voltageWaveform: z
      .array(
        z
          .object({
            time: ms.refine((timeMs) => timeMs >= 0, {
              message: "Waveform times must be nonnegative",
            }),
            voltage,
          })
          .strict(),
      )
      .min(1)
      .optional(),
    connections: createConnectionsProp(voltageSourcePinLabels).optional(),
  })
  .superRefine((source, context) => {
    if (source.voltageWaveform && source.waveShape) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["voltageWaveform"],
        message: "voltageWaveform cannot be combined with waveShape",
      })
    }
    for (
      let index = 1;
      index < (source.voltageWaveform?.length ?? 0);
      index++
    ) {
      if (
        source.voltageWaveform![index]!.time <=
        source.voltageWaveform![index - 1]!.time
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["voltageWaveform", index, "time"],
          message: "Waveform times must be strictly increasing",
        })
        break
      }
    }
  })

export const voltageSourcePins = lrPolarPins

type InferredVoltageSourceProps = z.input<typeof voltageSourceProps>
expectTypesMatch<VoltageSourceProps, InferredVoltageSourceProps>(true)
