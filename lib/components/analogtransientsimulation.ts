import { ms } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { ibisPinRunState, type IbisPinRunState } from "lib/common/ibis"
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
  /** Physical pin selectors and per-experiment direction/enable states. Requires spiceEngine="pcb_spice"; rendering only declares the experiment. */
  ibisPinStates?: Record<string, IbisPinRunState>
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
    ibisPinStates: z.record(z.string().min(1), ibisPinRunState).optional(),
  })
  .superRefine((simulation, context) => {
    if (simulation.ibisPinStates && simulation.spiceEngine !== "pcb_spice") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ibisPinStates"],
        message: "IBIS pin states require spiceEngine=pcb_spice",
      })
    }
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
