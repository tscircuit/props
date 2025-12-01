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
