import { frequency, rotation, current } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { createConnectionsProp } from "lib/common/connectionsProp"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { dutyCycle } from "lib/common/dutyCycle"
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
  /** Fraction from 0 to 1 or a percentage string, e.g. "50%". Whitespace is trimmed. */
  dutyCycle?: number | string
  /** Small-signal AC magnitude. Raw numbers are amperes. */
  acMagnitude?: number | string
  /** Small-signal AC phase. Raw numbers are degrees. */
  acPhase?: number | string
  connections?: Connections<CurrentSourcePinLabels>
}

export const currentSourceProps = commonComponentProps.extend({
  current: current.optional(),
  frequency: frequency.optional(),
  peakToPeakCurrent: current.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: dutyCycle.optional(),
  acMagnitude: current.optional(),
  acPhase: rotation.optional(),
  connections: createConnectionsProp(currentSourcePinLabels).optional(),
})

export const currentSourcePins = lrPolarPins

type InferredCurrentSourceProps = z.input<typeof currentSourceProps>
expectTypesMatch<CurrentSourceProps, InferredCurrentSourceProps>(true)
