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
import { dutyCycle } from "lib/common/dutyCycle"

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
  /** Fraction from 0 to 1 or a percentage string, e.g. "50%". Whitespace is trimmed. */
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
  connections?: Connections<VoltageSourcePinLabels>
}

export const voltageSourceProps = commonComponentProps.extend({
  voltage: voltage.optional(),
  frequency: frequency.optional(),
  peakToPeakVoltage: voltage.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: dutyCycle.optional(),
  pulseDelay: ms.optional(),
  riseTime: ms.optional(),
  fallTime: ms.optional(),
  pulseWidth: ms.optional(),
  period: ms.optional(),
  acMagnitude: voltage.optional(),
  acPhase: rotation.optional(),
  connections: createConnectionsProp(voltageSourcePinLabels).optional(),
})

export const voltageSourcePins = lrPolarPins

type InferredVoltageSourceProps = z.input<typeof voltageSourceProps>
expectTypesMatch<VoltageSourceProps, InferredVoltageSourceProps>(true)
