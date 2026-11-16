import { pcbChannelProps } from "../components/pcb-channel"
import { pcbReturnCurrentExcitationProps } from "../components/pcb-return-current-excitation"
import { pcbReturnCurrentSimulationProps } from "../components/pcb-return-current-simulation"
import { pcbTransientChannelSimulationProps } from "../components/pcb-transient-channel-simulation"

export * from "../components/pcb-channel"
export * from "../components/pcb-return-current-excitation"
export * from "../components/pcb-return-current-simulation"
export * from "../components/pcb-transient-channel-simulation"

export const simulationProps = {
  pcbchannel: pcbChannelProps,
  pcbreturncurrentsimulation: pcbReturnCurrentSimulationProps,
  pcbreturncurrentexcitation: pcbReturnCurrentExcitationProps,
  pcbtransientchannelsimulation: pcbTransientChannelSimulationProps,
} as const
