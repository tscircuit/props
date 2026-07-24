import { current, voltage } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  analogAnalysisSimulationBaseProps,
  type AnalogAnalysisSimulationBaseProps,
} from "./analogsimulation"

export interface AnalogDcSweepSimulationProps
  extends AnalogAnalysisSimulationBaseProps {
  /** Selector for the independent voltage or current source being swept. */
  sweepSource: string
  /** First source level. Raw numbers use volts or amperes according to the source. */
  sweepStart: number | string
  /** Last source level. Raw numbers use volts or amperes according to the source. */
  sweepStop: number | string
  /** Nonzero increment directed from sweepStart toward sweepStop. */
  sweepStep: number | string
}

const dcSweepQuantity = z.union([voltage, current])

export const analogDcSweepSimulationProps = z
  .object({
    ...analogAnalysisSimulationBaseProps,
    sweepSource: z.string().min(1),
    sweepStart: dcSweepQuantity,
    sweepStop: dcSweepQuantity,
    sweepStep: dcSweepQuantity.refine(
      (sweepStep) => sweepStep !== 0,
      "sweepStep must be nonzero",
    ),
  })
  .superRefine((simulation, context) => {
    if (
      Math.sign(simulation.sweepStop - simulation.sweepStart) !==
      Math.sign(simulation.sweepStep)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sweepStep"],
        message: "sweepStep must move from sweepStart toward sweepStop",
      })
    }
  })

expectTypesMatch<
  AnalogDcSweepSimulationProps,
  z.input<typeof analogDcSweepSimulationProps>
>(true)
