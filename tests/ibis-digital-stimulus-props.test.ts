import { expect, test } from "bun:test"
import { analogDigitalStimulusProps } from "../lib"
test("digital traffic normalizes timing without inferring bit patterns", () => {
  const stimulus = {
    name: "data",
    simulationRef: ".run",
    sourcePinRef: ".U1 > .pin1",
    bitDuration: "2ns",
    startTime: "4ns",
    initialState: 0,
    transmittedData: {
      transmissionType: "bits",
      bits: "0101",
      repeat: true,
    },
  }
  expect(analogDigitalStimulusProps.parse(stimulus).bitDuration).toBeCloseTo(
    0.000002,
    14,
  )
  expect(analogDigitalStimulusProps.parse(stimulus).inverted).toBe(false)
  expect(
    analogDigitalStimulusProps.parse({
      ...stimulus,
      transmittedData: { ...stimulus.transmittedData, bits: [0, 1, 0, 1] },
    }).transmittedData.bits,
  ).toEqual([0, 1, 0, 1])
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      transmittedData: { ...stimulus.transmittedData, bits: "012" },
    }).success,
  ).toBe(false)
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      transmittedData: { ...stimulus.transmittedData, bits: [] },
    }).success,
  ).toBe(false)
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      transmittedData: { ...stimulus.transmittedData, bits: [0, 2] },
    }).success,
  ).toBe(false)
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      initialState: undefined,
    }).success,
  ).toBe(false)
})
