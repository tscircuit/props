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
  dutyCycle?: number | string
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

export const voltageSourceProps = commonComponentProps.extend({
  voltage: voltage.optional(),
  frequency: frequency.optional(),
  peakToPeakVoltage: voltage.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: percentage.optional(),
})

type InferredVoltageSourceProps = z.input<typeof voltageSourceProps>
expectTypesMatch<VoltageSourceProps, InferredVoltageSourceProps>(true)
