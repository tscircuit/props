import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "../lib/simulation/pcb-transient-channel-simulation"

test("aggressors can be disabled without a pattern", () => {
  expect(
    pcbTransientChannelSimulationProps.parse({
      bitRate: 50e6,
      aggressorDisabled: true,
    }),
  ).toStrictEqual({
    bitRate: 50e6,
    allowUnroutedTraces: false,
    aggressorDisabled: true,
  })
})
