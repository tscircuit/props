import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { pcbNoiseSimulationProps } from "lib/index"

test("duration, sample interval and quiet-channel baseline require explicit SI values", () => {
  for (const [duration, expected] of [
    [0.001, 0.001],
    ["1ms", 0.001],
    ["1e-3s", 0.001],
    ["1000000ns", 0.001],
  ] as const) {
    const parsed = pcbNoiseSimulationProps.parse({
      duration,
      sampleInterval: "5ps",
    })
    expect(parsed.duration).toBeCloseTo(expected, 15)
    expect(parsed.sampleInterval).toBeCloseTo(5e-12, 20)
    expectTypeOf(parsed.duration).toEqualTypeOf<number>()
  }
  const parsed = pcbNoiseSimulationProps.parse({
    name: " Two line ",
    duration: "192ns",
    sampleInterval: "5ps",
    baseline: { quietChannels: [" aggressor "], voltage: "0V" },
  })
  expect(parsed.duration).toBeCloseTo(192e-9, 18)
  expect(parsed).toMatchObject({
    name: "Two line",
    sampleInterval: 5e-12,
    baseline: { quietChannels: ["aggressor"], voltage: 0 },
  })
  for (const duration of [
    "1msjunk",
    "1s 2s",
    "1V",
    "Infinitys",
    NaN,
    Infinity,
    0,
    -1,
  ]) {
    expect(
      pcbNoiseSimulationProps.safeParse({ duration, sampleInterval: "1ps" })
        .success,
    ).toBe(false)
  }
  for (const input of [
    {},
    { duration: 1 },
    { sampleInterval: 1 },
    { duration: 1, sampleInterval: 2 },
    { duration: 1, sampleInterval: 1 },
    { duration: 1, sampleInterval: 0 },
    { duration: 1, sampleInterval: 0.1, clock: "synthetic" },
  ])
    expect(pcbNoiseSimulationProps.safeParse(input).success).toBe(false)
  for (const baseline of [
    { quietChannels: [], voltage: 0 },
    { quietChannels: ["a", " a "], voltage: 0 },
    { quietChannels: ["a"] },
    { quietChannels: ["a"], voltage: "1A" },
    { quietChannels: ["a"], voltage: 0, sourceNames: ["a_source"] },
    { kind: "quiet_sources", sourceNames: ["a_source"], voltage: 0 },
  ])
    expect(
      pcbNoiseSimulationProps.safeParse({
        duration: 1,
        sampleInterval: 0.1,
        baseline,
      }).success,
    ).toBe(false)
})
