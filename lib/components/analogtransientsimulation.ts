import { frequency, length, ms } from "circuit-json"
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
  pcbSpiceChannel?: PcbSpiceChannelProps
}

export interface PcbSpiceChannelProps {
  reduction: "routed-copper" | "straightened-stages"
  sections: number
  lanes: Array<{ name: string; from: string; to: string }>
  referencePinRef: string
  passiveComponentRefs?: string[]
  extraction: {
    minimumFrequency: number | string
    maximumFrequency: number | string
    modelFrequency: number | string
    filaments: number
    refinementFilaments: number
    convergenceTolerance: number
    capacitanceTolerance: number
    reciprocityTolerance: number
    dcResistanceTolerance: number
    maxPanelLength: number | string
    groundMeshSize?: number | string
  }
  relativePermittivity?: number
  via?: {
    platingThickness?: number | string
    equivalentWidth?: number | string
    omitThroughViaStubs?: boolean
  }
  straightenedStageProfiles?: Record<
    string,
    {
      spacing: number | string
      relativePermittivity: number
      return: {
        width: number | string
        thickness: number | string
        lengthFactor: number
        centerY: number | string
        centerZ: number | string
      }
    }
  >
}

const positiveLength = length.pipe(z.number().finite().positive())
const signedLength = length.pipe(z.number().finite())
const positiveFrequency = frequency.pipe(z.number().finite().positive())

export const pcbSpiceChannelProps = z.object({
  reduction: z.enum(["routed-copper", "straightened-stages"]),
  sections: z.number().int().min(1).max(128),
  lanes: z
    .array(
      z.object({
        name: z.string().min(1),
        from: z.string().min(1),
        to: z.string().min(1),
      }),
    )
    .min(1)
    .max(3),
  referencePinRef: z.string().min(1),
  passiveComponentRefs: z.array(z.string().min(1)).optional(),
  extraction: z
    .object({
      minimumFrequency: positiveFrequency,
      maximumFrequency: positiveFrequency,
      modelFrequency: positiveFrequency,
      filaments: z.number().int().positive(),
      refinementFilaments: z.number().int().positive(),
      convergenceTolerance: z.number().finite().positive(),
      capacitanceTolerance: z.number().finite().positive(),
      reciprocityTolerance: z.number().finite().positive(),
      dcResistanceTolerance: z.number().finite().positive(),
      maxPanelLength: positiveLength,
      groundMeshSize: positiveLength.optional(),
    })
    .refine(
      (extraction) => extraction.refinementFilaments > extraction.filaments,
      {
        path: ["refinementFilaments"],
        message: "refinementFilaments must be greater than filaments",
      },
    ),
  relativePermittivity: z.number().finite().positive().optional(),
  via: z
    .object({
      platingThickness: positiveLength.optional(),
      equivalentWidth: positiveLength.optional(),
      omitThroughViaStubs: z.boolean().optional(),
    })
    .optional(),
  straightenedStageProfiles: z
    .record(
      z.object({
        spacing: positiveLength,
        relativePermittivity: z.number().finite().positive(),
        return: z.object({
          width: positiveLength,
          thickness: positiveLength,
          lengthFactor: z.number().finite().positive(),
          centerY: signedLength,
          centerZ: signedLength,
        }),
      }),
    )
    .optional(),
})

expectTypesMatch<PcbSpiceChannelProps, z.input<typeof pcbSpiceChannelProps>>(
  true,
)

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
    pcbSpiceChannel: pcbSpiceChannelProps.optional(),
    ibisPinStates: z.record(z.string().min(1), ibisPinRunState).optional(),
  })
  .superRefine((simulation, context) => {
    if (simulation.pcbSpiceChannel && simulation.spiceEngine !== "pcb_spice") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pcbSpiceChannel"],
        message: "PCB SPICE channel settings require spiceEngine=pcb_spice",
      })
    }
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
