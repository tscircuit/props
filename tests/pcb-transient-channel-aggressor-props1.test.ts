import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "../lib/simulation/pcb-transient-channel-simulation"

test("omitted aggressor controls stay absent", () => {
  expect(
    pcbTransientChannelSimulationProps.parse({ bitRate: "50Mbps" }),
  ).toStrictEqual({ bitRate: 50e6, allowUnroutedTraces: false })
})
