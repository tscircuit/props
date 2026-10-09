import { pcbReturnCurrentExcitationProps } from "../components/pcb-return-current-excitation"
import { pcbReturnCurrentSimulationProps } from "../components/pcb-return-current-simulation"

export * from "../components/pcb-return-current-excitation"
export * from "../components/pcb-return-current-simulation"

export const simulationProps = {
  pcbreturncurrentsimulation: pcbReturnCurrentSimulationProps,
  pcbreturncurrentexcitation: pcbReturnCurrentExcitationProps,
} as const
