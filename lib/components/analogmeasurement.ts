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
  /** Stable name written to the simulation measurement result. */
  name: string
  /** Unit of the scalar returned by measureFn. */
  unit: string
  /** Computes one scalar for each transient simulation run. */
  measureFn: (context: AnalogTransientMeasurementContext) => number
}

export const analogMeasurementProps = z
  .object({
    name: z.string().min(1),
    unit: z.string().min(1),
    measureFn: z.custom<AnalogMeasurementProps["measureFn"]>(
      (value) => typeof value === "function",
    ),
  })
  .strict()

expectTypesMatch<
  AnalogMeasurementProps,
  z.input<typeof analogMeasurementProps>
>(true)
