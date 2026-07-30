import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface TransientMeasurementSeries {
  timestampsMs: readonly number[]
  values: readonly number[]
}

export interface AnalogTransientMeasurementContext {
  getVoltage: (selector: string) => TransientMeasurementSeries
  getCurrent: (selector: string) => TransientMeasurementSeries
}

export interface AnalogMeasurementProps {
  name: string
  unit: string
  measureFn: (context: AnalogTransientMeasurementContext) => number
}

export const analogMeasurementProps = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  measureFn: z.custom<AnalogMeasurementProps["measureFn"]>(
    (measureFn) => typeof measureFn === "function",
  ),
})

expectTypesMatch<
  AnalogMeasurementProps,
  z.input<typeof analogMeasurementProps>
>(true)
