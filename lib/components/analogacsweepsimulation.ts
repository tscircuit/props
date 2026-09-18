import { frequency } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  analogAnalysisSimulationBaseProps,
  type AnalogAnalysisSimulationBaseProps,
} from "./analogsimulation"

export interface AnalogAcSweepSimulationProps
  extends AnalogAnalysisSimulationBaseProps {
  /** Frequency spacing used by the AC analysis. */
  sweepType: "linear" | "decade" | "octave"
  /** First positive frequency. Raw numbers are hertz. */
  startFrequency: number | string
  /** Last frequency, which must be greater than startFrequency. Raw numbers are hertz. */
  stopFrequency: number | string
  /** Samples per decade or octave; required for non-linear sweeps. */
  samplesPerInterval?: number
  /** Total samples; required for linear sweeps. */
  sampleCount?: number
}

export const analogAcSweepSimulationProps = z
  .object({
    ...analogAnalysisSimulationBaseProps,
    sweepType: z.enum(["linear", "decade", "octave"]),
    startFrequency: frequency.refine(
      (startFrequencyHz) => startFrequencyHz > 0,
      "startFrequency must be positive",
    ),
    stopFrequency: frequency.refine(
      (stopFrequencyHz) => stopFrequencyHz > 0,
      "stopFrequency must be positive",
    ),
    samplesPerInterval: z.number().int().positive().optional(),
    sampleCount: z.number().int().positive().optional(),
  })
  .superRefine((simulation, context) => {
    if (simulation.stopFrequency <= simulation.startFrequency) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stopFrequency"],
        message: "stopFrequency must be greater than startFrequency",
      })
    }

    if (simulation.sweepType === "linear") {
      if (simulation.sampleCount === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sampleCount"],
          message: "sampleCount is required for a linear AC sweep",
        })
      }
      if (simulation.samplesPerInterval !== undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["samplesPerInterval"],
          message:
            "samplesPerInterval is only valid for decade or octave sweeps",
        })
      }
      return
    }

    if (simulation.samplesPerInterval === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["samplesPerInterval"],
        message: "samplesPerInterval is required for decade or octave sweeps",
      })
    }
    if (simulation.sampleCount !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sampleCount"],
        message: "sampleCount is only valid for a linear sweep",
      })
    }
  })

expectTypesMatch<
  AnalogAcSweepSimulationProps,
  z.input<typeof analogAcSweepSimulationProps>
>(true)
