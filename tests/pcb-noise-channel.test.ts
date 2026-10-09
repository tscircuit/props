import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { pcbNoiseChannelProps } from "lib/index"
import { channel } from "./fixtures/pcb-noise"

test("a channel owns explicit terminal selectors, source/load impedances and load bias", () => {
  const parsed = pcbNoiseChannelProps.parse({
    ...channel,
    name: " victim ",
    source: " .U1 > .V ",
    sourceLayer: "top",
    loadLayer: { name: "bottom" },
    sourceReferenceLayer: "top",
    loadReferenceLayer: "bottom",
    loadCapacitance: "1pF",
  })
  expect(parsed.name).toBe("victim")
  expect(parsed.source).toBe(".U1 > .V")
  expect(parsed.sourceLayer).toBe("top")
  expect(parsed.loadLayer).toBe("bottom")
  expect(parsed.loadCapacitance).toBe(1e-12)
  expect(parsed.sourceImpedance).toBe(50)
  expect(parsed.loadImpedance).toBe(100)
  expect(parsed.loadBiasVoltage).toBe(0)
  expectTypeOf(parsed.loadImpedance).toEqualTypeOf<number>()
  expect(pcbNoiseChannelProps.parse(channel)).not.toHaveProperty(
    "loadCapacitance",
  )
  for (const field of [
    "name",
    "role",
    "source",
    "sourceReference",
    "load",
    "loadReference",
    "sourceImpedance",
    "loadImpedance",
    "loadBiasVoltage",
    "waveform",
  ] as const) {
    const input = { ...channel }
    delete (input as Partial<typeof input>)[field]
    expect(pcbNoiseChannelProps.safeParse(input).success).toBe(false)
  }
  for (const changes of [
    { source: " " },
    { sourceReference: "" },
    { loadReferenceLayer: "bogus" },
    { sourceImpedance: "50ohm trailing" },
    { sourceImpedance: "1V" },
    { loadImpedance: 0 },
    { loadImpedance: Infinity },
    { loadBiasVoltage: "0V trailing" },
    { loadCapacitance: 0 },
    { loadCapacitance: "-1pF" },
    { loadCapacitance: "1pF trailing" },
    { loadCapacitance: "1ohm" },
    { port: "v_tx" },
    { sourceModel: { kind: "thevenin", resistance: 50 } },
  ])
    expect(
      pcbNoiseChannelProps.safeParse({ ...channel, ...changes }).success,
    ).toBe(false)
})
