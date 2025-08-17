import { frequency, rotation, voltage } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type WaveShape = "sinewave" | "square" | "triangle" | "sawtooth"

export interface VoltageSourceProps extends CommonComponentProps {
  voltage?: number | string
  frequency?: number | string
  peakToPeakVoltage?: number | string
  waveShape?: WaveShape
  phase?: number | string
}

export const voltageSourceProps = commonComponentProps.extend({
  voltage: voltage.optional(),
  frequency: frequency.optional(),
  peakToPeakVoltage: voltage.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
})

type InferredVoltageSourceProps = z.input<typeof voltageSourceProps>
expectTypesMatch<VoltageSourceProps, InferredVoltageSourceProps>(true)
