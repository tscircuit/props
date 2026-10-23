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
  /** PCB channel extraction settings. Requires spiceEngine="pcb_spice". */
  pcbSpiceChannel?: PcbSpiceChannelProps
}

/** Channel settings parsed to Hz and mm. No extraction defaults are inferred. */
export interface PcbSpiceChannelProps {
  /** Extract real routes and ground pours, or use declared stage profiles. */
  reduction: "routed-copper" | "straightened-stages"
  /** Uniform pi sections per stage, from 1 through 128. */
  sections: number
  /** One to three coupled lanes in matrix order, with physical port selectors. */
  lanes: Array<{ name: string; from: string; to: string }>
  /** Physical port selector whose net is the channel reference ground. */
  referencePinRef: string
  /** Component selectors of passives included in the simulated scope. */
  passiveComponentRefs?: string[]
  extraction: {
    /** Frequencies accept units such as "1GHz"; raw numbers are Hz. */
    minimumFrequency: number | string
    maximumFrequency: number | string
    modelFrequency: number | string
    filaments: number
    /** Positive integer strictly greater than filaments. */
    refinementFilaments: number
    convergenceTolerance: number
    capacitanceTolerance: number
    reciprocityTolerance: number
    dcResistanceTolerance: number
    /** Lengths accept units; raw numbers are mm. */
    maxPanelLength: number | string
    /** Required by the routed-copper extraction pipeline. */
    groundMeshSize?: number | string
  }
  /** Homogeneous override; routed copper otherwise uses the PCB stackup. */
  relativePermittivity?: number
  via?: {
    /** Length in mm; otherwise uses the stackup's plated hole copper. */
    platingThickness?: number | string
    equivalentWidth?: number | string
    omitThroughViaStubs?: boolean
  }
  /** Per-layer profiles for straightened-stages, keyed by top, inner1, via, etc. */
  straightenedStageProfiles?: Record<
    string,
    {
      spacing: number | string
      relativePermittivity: number
      return: {
        width: number | string
        thickness: number | string
        lengthFactor: number
        /** Signed coordinates in mm. */
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
