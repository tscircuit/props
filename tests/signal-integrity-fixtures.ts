import { Children, type Attributes, type ReactElement } from "react"
import {
  pcbTransientChannelSimulationProps,
  pcbChannelProps,
  type PcbTransientChannelSimulationProps,
  type PcbChannelProps,
} from "lib"

// Match core's typed namespace without coupling props tests to the renderer.
export const simulation = {
  pcbtransientchannelsimulation: (_: PcbTransientChannelSimulationProps) =>
    null,
  pcbchannel: (_: PcbChannelProps & Attributes) => null,
}

export function parseBlock(
  element: ReactElement<PcbTransientChannelSimulationProps>,
) {
  return {
    block: pcbTransientChannelSimulationProps.parse(element.props),
    signals: Children.toArray(element.props.children).map((child) =>
      pcbChannelProps.parse((child as ReactElement<PcbChannelProps>).props),
    ),
  }
}

export const data = {
  name: "DATA",
  driverRef: ".TX > .Y",
  receiverRef: ".RX > .A",
}
