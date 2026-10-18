import { expect, test } from "bun:test"
import { analogDigitalStimulusProps } from "../lib"
test("digital traffic normalizes timing without inferring bit patterns", () => {
  const stimulus = {
    name: "data",
    simulationRef: ".run",
    drives: ".U1 > .pin1",
    unitInterval: "2ns",
    startTime: "4ns",
    initialState: 0,
    pattern: { type: "bits", bits: "0101", repeat: true },
  }
  expect(analogDigitalStimulusProps.parse(stimulus).unitInterval).toBeCloseTo(
    0.000002,
    14,
  )
  expect(analogDigitalStimulusProps.parse(stimulus).inverted).toBe(false)
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      pattern: { type: "bits", bits: "012", repeat: true },
    }).success,
  ).toBe(false)
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      initialState: undefined,
    }).success,
  ).toBe(false)
})
