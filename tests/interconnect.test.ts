import { expect, test } from "bun:test"
import { interconnectProps } from "lib/components/interconnect"

test("allows footprint and interconnect standard", () => {
  const standards = [
    "TSC0001_36P_XALT_2025_11",
    "0805",
    "0603",
    "1206",
  ] as const

  for (const standard of standards) {
    const parsed = interconnectProps.parse({
      name: "IC1",
      footprint: "tscircuit:interconnect",
      standard,
    })

    expect(parsed.standard).toBe(standard)
    expect(parsed.footprint).toBe("tscircuit:interconnect")
  }
})

test("rejects unsupported interconnect standards", () => {
  expect(() =>
    interconnectProps.parse({
      name: "IC2",
      standard: "legacy" as any,
    }),
  ).toThrow()
})

test("allows internallyConnectedPins", () => {
  const parsed = interconnectProps.parse({
    name: "IC3",
    internallyConnectedPins: [
      ["1", "2"],
      ["3", "4"],
      [5, 6],
    ],
  })

  expect(parsed.internallyConnectedPins).toEqual([
    ["1", "2"],
    ["3", "4"],
    [5, 6],
  ])
})

test("rejects invalid internallyConnectedPins shape", () => {
  expect(() =>
    interconnectProps.parse({
      name: "IC4",
      internallyConnectedPins: ["1", "2"] as any,
    }),
  ).toThrow()
})

test("allows pinLabels", () => {
  const parsed = interconnectProps.parse({
    name: "IC5",
    pinLabels: {
      1: "VCC",
      2: ["GND", "SHIELD"],
    },
  })

  expect(parsed.pinLabels).toEqual({
    1: "VCC",
    2: ["GND", "SHIELD"],
  })
})
