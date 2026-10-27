import { expect, test } from "bun:test"
import { analogTransientSimulationProps } from "../lib"
test("IBIS pin booleans require the PCB SPICE engine and output-only enable states", () => {
  const ibisPinStates = {
    ".U1 > .pin1": { isOutput: true, isOutputEnabled: false },
  }
  expect(
    analogTransientSimulationProps.safeParse({
      spiceEngine: "pcb_spice",
      ibisPinStates,
    }).success,
  ).toBe(true)
  expect(
    analogTransientSimulationProps.safeParse({ ibisPinStates }).success,
  ).toBe(false)
  for (const state of [
    { isOutput: true },
    { isOutput: false, isOutputEnabled: true },
    { isOutput: "output" },
  ]) {
    expect(
      analogTransientSimulationProps.safeParse({
        spiceEngine: "pcb_spice",
        ibisPinStates: { pin: state },
      }).success,
    ).toBe(false)
  }
  expect(
    analogTransientSimulationProps.safeParse({
      spiceEngine: "pcb_spice",
      ibisPinStates: { pin: { isOutput: false } },
    }).success,
  ).toBe(true)
})
