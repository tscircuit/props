import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "../lib/simulation/pcb-transient-channel-simulation"

test("nearby driver controls preserve an explicit declaration and have no defaults", () => {
  expect(
    pcbTransientChannelSimulationProps.parse({ bitRate: "50Mbps" }),
  ).toEqual({ bitRate: 50e6, allowUnroutedTraces: false })
  expect(
    pcbTransientChannelSimulationProps.parse({
      bitRate: 50e6,
      nearbyDriverPattern: " prbs15 ",
      nearbyDriversDisabled: false,
    }),
  ).toEqual({
    bitRate: 50e6,
    allowUnroutedTraces: false,
    nearbyDriverPattern: "prbs15",
    nearbyDriversDisabled: false,
  })
  expect(
    pcbTransientChannelSimulationProps.safeParse({
      bitRate: 50e6,
      nearbyDriverPattern: " ",
    }).success,
  ).toBe(false)
})
