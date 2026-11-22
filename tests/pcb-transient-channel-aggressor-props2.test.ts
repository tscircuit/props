import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "../lib/simulation/pcb-transient-channel-simulation"

test("aggressor controls preserve the pattern and disabled flag", () => {
  expect(
    pcbTransientChannelSimulationProps.parse({
      bitRate: 50e6,
      aggressorPattern: " prbs15 ",
      aggressorDisabled: false,
    }),
  ).toEqual({
    bitRate: 50e6,
    allowUnroutedTraces: false,
    aggressorPattern: "prbs15",
    aggressorDisabled: false,
  })
})
