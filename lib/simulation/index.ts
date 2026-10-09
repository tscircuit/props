import { pcbNoiseEyeProps } from "../components/pcb-noise-eye"
import { pcbNoiseObservationProps } from "../components/pcb-noise-observation"
import { pcbNoiseTerminationProps } from "../components/pcb-noise-termination"
import { pcbNoiseExcitationProps } from "../components/pcb-noise-excitation"
import { pcbNoisePortProps } from "../components/pcb-noise-port"
import { pcbNoiseSimulationProps } from "../components/pcb-noise-simulation"
import { pcbReturnCurrentExcitationProps } from "../components/pcb-return-current-excitation"
import { pcbReturnCurrentSimulationProps } from "../components/pcb-return-current-simulation"

export * from "../components/pcb-return-current-excitation"
export * from "../components/pcb-return-current-simulation"

export const simulationProps = {
  pcbnoiseeye: pcbNoiseEyeProps,
  pcbnoiseobservation: pcbNoiseObservationProps,
  pcbnoisetermination: pcbNoiseTerminationProps,
  pcbnoiseexcitation: pcbNoiseExcitationProps,
  pcbnoiseport: pcbNoisePortProps,
  pcbnoisesimulation: pcbNoiseSimulationProps,
  pcbreturncurrentsimulation: pcbReturnCurrentSimulationProps,
  pcbreturncurrentexcitation: pcbReturnCurrentExcitationProps,
} as const

export * from "../components/pcb-noise-simulation"

export * from "../components/pcb-noise-port"

export * from "../components/pcb-noise-excitation"

export * from "../components/pcb-noise-termination"

export * from "../components/pcb-noise-observation"

export * from "../components/pcb-noise-eye"
