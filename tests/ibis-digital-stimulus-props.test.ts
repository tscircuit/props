import { expect, test } from "bun:test"
import { analogDigitalStimulusProps } from "../lib"

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

test("digital traffic normalizes timing without inferring bit patterns", () => {
  const parsed = analogDigitalStimulusProps.parse(stimulus)
  expect(parsed.bitDuration).toBeCloseTo(0.000002, 14)
  expect(parsed.startTime).toBeCloseTo(0.000004, 14)
  expect(parsed.inverted).toBe(false)
  expect(
    analogDigitalStimulusProps.parse({
      ...stimulus,
      startTime: 0,
      transmittedData: { ...stimulus.transmittedData, bits: [0, 1, 0, 1] },
    }).transmittedData.bits,
  ).toEqual([0, 1, 0, 1])
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      initialState: undefined,
    }).success,
  ).toBe(false)
})

test.each([-1, "-2ns", 0, "0ns", "garbage"])(
  "digital traffic rejects bitDuration %j",
  (bitDuration) => {
    expect(
      analogDigitalStimulusProps.safeParse({ ...stimulus, bitDuration })
        .success,
    ).toBe(false)
  },
)

test.each([-1, "-2ns", "garbage"])(
  "digital traffic rejects startTime %j",
  (startTime) => {
    expect(
      analogDigitalStimulusProps.safeParse({ ...stimulus, startTime }).success,
    ).toBe(false)
  },
)

test.each(["012", "", [], [2], [0, 2]].map((bits) => [bits] as const))(
  "digital traffic rejects transmitted bits %j",
  (bits) => {
    expect(
      analogDigitalStimulusProps.safeParse({
        ...stimulus,
        transmittedData: { ...stimulus.transmittedData, bits },
      }).success,
    ).toBe(false)
  },
)

test("transmitted bit patterns are capped at 65,536 bits", () => {
  const stimulus = (bits: string | (0 | 1)[]) =>
    analogDigitalStimulusProps.safeParse({
      name: "data",
      simulationRef: ".sim",
      sourcePinRef: ".U1 > .DQ",
      bitDuration: "1ns",
      startTime: 0,
      initialState: 0,
      transmittedData: { transmissionType: "bits", bits, repeat: false },
    }).success
  expect(stimulus("1".repeat(65536))).toBe(true)
  expect(stimulus("1".repeat(65537))).toBe(false)
  expect(stimulus(Array<0 | 1>(65536).fill(1))).toBe(true)
  expect(stimulus(Array<0 | 1>(65537).fill(1))).toBe(false)
})
