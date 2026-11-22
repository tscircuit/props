import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "../lib/simulation/pcb-transient-channel-simulation"

test("a whitespace-only aggressor pattern is invalid", () => {
  expect(
    pcbTransientChannelSimulationProps.safeParse({
      bitRate: 50e6,
      aggressorPattern: " ",
    }).success,
  ).toBe(false)
})
