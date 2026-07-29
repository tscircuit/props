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
import { validateStrictlyIncreasingWaveformTimes } from "../common/simulation-waveform"

export const currentSourcePinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type CurrentSourcePinLabels = (typeof currentSourcePinLabels)[number]

export interface CurrentWaveformPoint {
  /** Time from the start of the transient simulation. Raw numbers are milliseconds. */
  time: number | string
  /** Source current at this point. Raw numbers are amperes. */
  current: number | string
}

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
  /** Piecewise-linear transient source waveform. Cannot be combined with waveShape. */
  currentWaveform?: CurrentWaveformPoint[]
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

const currentWaveform = z
  .array(
    z
      .object({
        time: ms.pipe(z.number().nonnegative()),
        current,
      })
      .strict(),
  )
  .min(1)
  .superRefine(validateStrictlyIncreasingWaveformTimes)

export const currentSourceProps = commonComponentProps.extend({
  current: current.optional(),
  frequency: frequency.optional(),
  peakToPeakCurrent: current.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: percentage.optional(),
  acMagnitude: current.optional(),
  acPhase: rotation.optional(),
  currentWaveform: currentWaveform.optional(),
  connections: createConnectionsProp(currentSourcePinLabels).optional(),
})

export const currentSourcePins = lrPolarPins

type InferredCurrentSourceProps = z.input<typeof currentSourceProps>
expectTypesMatch<CurrentSourceProps, InferredCurrentSourceProps>(true)
