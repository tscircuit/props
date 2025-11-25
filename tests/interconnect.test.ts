import { expect, test } from "bun:test"
import { interconnectProps } from "lib/components/interconnect"

test("allows footprint and interconnect standard", () => {
  const parsed = interconnectProps.parse({
    name: "IC1",
    footprint: "tscircuit:interconnect",
    standard: "TSC0001_36P_XALT_2025_11",
  })

  expect(parsed.standard).toBe("TSC0001_36P_XALT_2025_11")
  expect(parsed.footprint).toBe("tscircuit:interconnect")
})

test("rejects unsupported interconnect standards", () => {
  expect(() =>
    interconnectProps.parse({
      name: "IC2",
      standard: "legacy" as any,
    }),
  ).toThrow()
})
