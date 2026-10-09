import { pcbNoiseEyeProps } from "../components/pcb-noise-eye"
import { pcbNoiseChannelProps } from "../components/pcb-noise-channel"
import { pcbNoiseSimulationProps } from "../components/pcb-noise-simulation"
import { pcbReturnCurrentExcitationProps } from "../components/pcb-return-current-excitation"
import { pcbReturnCurrentSimulationProps } from "../components/pcb-return-current-simulation"

export * from "../components/pcb-return-current-excitation"
export * from "../components/pcb-return-current-simulation"

export const simulationProps = {
  pcbnoiseeye: pcbNoiseEyeProps,
  pcbnoisechannel: pcbNoiseChannelProps,
  pcbnoisesimulation: pcbNoiseSimulationProps,
  pcbreturncurrentsimulation: pcbReturnCurrentSimulationProps,
  pcbreturncurrentexcitation: pcbReturnCurrentExcitationProps,
} as const

export * from "../components/pcb-noise-simulation"

export * from "../components/pcb-noise-channel"

export * from "../components/pcb-noise-eye"
