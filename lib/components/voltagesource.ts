import { frequency, rotation, voltage } from "circuit-json"
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

export const voltageSourceProps = commonComponentProps.extend({
  voltage: voltage.optional(),
  frequency: frequency.optional(),
  peakToPeakVoltage: voltage.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: percentage.optional(),
  connections: createConnectionsProp(voltageSourcePinLabels).optional(),
})

export const voltageSourcePins = lrPolarPins

type InferredVoltageSourceProps = z.input<typeof voltageSourceProps>
expectTypesMatch<VoltageSourceProps, InferredVoltageSourceProps>(true)
