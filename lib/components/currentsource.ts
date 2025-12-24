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

export const currentSourceProps = commonComponentProps.extend({
  current: current.optional(),
  frequency: frequency.optional(),
  peakToPeakCurrent: current.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: percentage.optional(),
  connections: createConnectionsProp(currentSourcePinLabels).optional(),
})

export const currentSourcePins = lrPolarPins

type InferredCurrentSourceProps = z.input<typeof currentSourceProps>
expectTypesMatch<CurrentSourceProps, InferredCurrentSourceProps>(true)
