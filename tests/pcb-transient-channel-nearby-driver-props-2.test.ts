import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "../lib/simulation/pcb-transient-channel-simulation"

test("nearby driver controls preserve the pattern and disabled flag", () => {
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
})
