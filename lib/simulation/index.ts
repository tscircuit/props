import { pcbDriverReceiverChannelProps } from "./pcb-driver-receiver-channel"
import { pcbReturnCurrentExcitationProps } from "./pcb-return-current-excitation"
import { pcbReturnCurrentSimulationProps } from "./pcb-return-current-simulation"
import { pcbTransientChannelSimulationProps } from "./pcb-transient-channel-simulation"

export * from "./pcb-driver-receiver-channel"
export * from "./pcb-return-current-excitation"
export * from "./pcb-return-current-simulation"
export * from "./pcb-transient-channel-simulation"
export * from "./simulation-ibis-model"

export const simulationProps = {
  pcbdriverreceiverchannel: pcbDriverReceiverChannelProps,
  pcbreturncurrentsimulation: pcbReturnCurrentSimulationProps,
  pcbreturncurrentexcitation: pcbReturnCurrentExcitationProps,
  pcbtransientchannelsimulation: pcbTransientChannelSimulationProps,
} as const
