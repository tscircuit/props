import { ms } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  analogAnalysisSimulationBaseProps,
  type AnalogAnalysisSimulationBaseProps,
} from "./analogsimulation"

export interface AnalogTransientSimulationProps
  extends AnalogAnalysisSimulationBaseProps {
  /** Simulation duration. Raw numbers are milliseconds. Defaults to 10ms. */
  duration?: number | string
  /** Time at which recording starts. Raw numbers are milliseconds. Defaults to 0ms. */
  startTime?: number | string
  /** Maximum simulation timestep. Raw numbers are milliseconds. Defaults to 0.01ms. */
  timePerStep?: number | string
}

const positiveMilliseconds = ms.refine(
  (milliseconds) => milliseconds > 0,
  "Time must be positive",
)

export const analogTransientSimulationProps = z
  .object({
    ...analogAnalysisSimulationBaseProps,
    duration: positiveMilliseconds.default("10ms"),
    startTime: ms.default("0ms"),
    timePerStep: positiveMilliseconds.default("0.01ms"),
  })
  .superRefine((simulation, context) => {
    if (
      simulation.startTime < 0 ||
      simulation.startTime > simulation.duration
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "startTime must be between zero and duration",
      })
    }
  })

expectTypesMatch<
  AnalogTransientSimulationProps,
  z.input<typeof analogTransientSimulationProps>
>(true)
