import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { pcbNoiseChannelProps } from "lib/index"
import { channel } from "./fixtures/pcb-noise"

test("authored seeded PRBS gains only stable algorithm metadata and validates finite ramps", () => {
  const parsed = pcbNoiseChannelProps.parse(channel)
  expect(parsed.waveform).toEqual({
    kind: "prbs",
    order: 7,
    baudRate: 500e6,
    lowVoltage: 0,
    highVoltage: 1,
    riseTime: 200e-12,
    fallTime: 200e-12,
    seed: 1,
    algorithm: "lfsr_fibonacci",
    algorithmVersion: "1",
    edgeTimeConvention: "10_90",
  })
  if (parsed.waveform.kind !== "prbs" || channel.waveform.kind !== "prbs")
    throw new Error("Expected PRBS")
  expectTypeOf(parsed.waveform.riseTime).toEqualTypeOf<number>()
  expectTypeOf(parsed.waveform.algorithmVersion).toEqualTypeOf<"1">()
  for (const changes of [
    { seed: 0 },
    { seed: 128 },
    { seed: 1.5 },
    { order: 8 },
    { algorithm: "lfsr_fibonacci" },
    { algorithmVersion: "1" },
    { edgeTimeConvention: "10_90" },
    { riseTime: 0 },
    { riseTime: "2ns" },
    { riseTime: "1.6ns" },
    { fallTime: -1 },
    { lowVoltage: "1V" },
    { highVoltage: "1V trailing" },
    { baudRate: "500MBps" },
    { amplitude: "1V" },
  ])
    expect(
      pcbNoiseChannelProps.safeParse({
        ...channel,
        waveform: { ...channel.waveform, ...changes },
      }).success,
    ).toBe(false)
  for (const field of [
    "seed",
    "riseTime",
    "fallTime",
    "baudRate",
    "lowVoltage",
    "highVoltage",
    "order",
  ] as const) {
    const waveform = { ...channel.waveform }
    delete (waveform as Partial<typeof waveform>)[field]
    expect(
      pcbNoiseChannelProps.safeParse({ ...channel, waveform }).success,
    ).toBe(false)
  }
  const quiet = pcbNoiseChannelProps.parse({
    ...channel,
    waveform: { kind: "dc", voltage: "-20mV" },
  })
  expect(quiet.waveform).toEqual({ kind: "dc", voltage: -0.02 })
  expect(quiet.sourceImpedance).toBe(50)
  for (const waveform of [
    { kind: "dc" },
    { kind: "dc", voltage: 0, seed: 1 },
  ]) {
    expect(
      pcbNoiseChannelProps.safeParse({ ...channel, waveform }).success,
    ).toBe(false)
  }
})
