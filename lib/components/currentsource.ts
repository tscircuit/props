import { current, frequency, ms, rotation } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { createConnectionsProp } from "lib/common/connectionsProp"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { type WaveShape } from "./voltagesource"

export const currentSourcePinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type CurrentSourcePinLabels = (typeof currentSourcePinLabels)[number]

export interface CurrentSourceProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  current?: number | string
  frequency?: number | string
  peakToPeakCurrent?: number | string
  waveShape?: WaveShape
  phase?: number | string
  dutyCycle?: number | string
  /** Small-signal AC magnitude. Raw numbers are amperes. */
  acMagnitude?: number | string
  /** Small-signal AC phase. Raw numbers are degrees. */
  acPhase?: number | string
  /** Piecewise-linear transient source points. Raw times are milliseconds. */
  currentWaveform?: Array<{
    time: number | string
    current: number | string
  }>
  connections?: Connections<CurrentSourcePinLabels>
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

export const currentSourceProps = commonComponentProps
  .extend({
    current: current.optional(),
    frequency: frequency.optional(),
    peakToPeakCurrent: current.optional(),
    waveShape: z
      .enum(["sinewave", "square", "triangle", "sawtooth"])
      .optional(),
    phase: rotation.optional(),
    dutyCycle: percentage.optional(),
    acMagnitude: current.optional(),
    acPhase: rotation.optional(),
    currentWaveform: z
      .array(
        z
          .object({
            time: ms.refine((timeMs) => timeMs >= 0, {
              message: "Waveform times must be nonnegative",
            }),
            current,
          })
          .strict(),
      )
      .min(1)
      .optional(),
    connections: createConnectionsProp(currentSourcePinLabels).optional(),
  })
  .superRefine((source, context) => {
    if (source.currentWaveform && source.waveShape) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentWaveform"],
        message: "currentWaveform cannot be combined with waveShape",
      })
    }
    for (
      let index = 1;
      index < (source.currentWaveform?.length ?? 0);
      index++
    ) {
      if (
        source.currentWaveform![index]!.time <=
        source.currentWaveform![index - 1]!.time
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["currentWaveform", index, "time"],
          message: "Waveform times must be strictly increasing",
        })
        break
      }
    }
  })

export const currentSourcePins = lrPolarPins

type InferredCurrentSourceProps = z.input<typeof currentSourceProps>
expectTypesMatch<CurrentSourceProps, InferredCurrentSourceProps>(true)
