import { expect, test } from "bun:test"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"

test("test-point autorouter accepts hoisted options and rejects conflicting modes", () => {
  expect(
    autoroutingPhaseProps.parse({
      reroute: true,
      addTestPoints: true,
      maxDetour: "10mm",
    }),
  ).toEqual({ reroute: true, addTestPoints: true, maxDetour: 10 })
  const input = {
    reroute: true,
    addTestPoints: true,
    connection: "net.SDA",
    layer: "bottom" as const,
    diameter: "1mm",
    clearance: "0.2mm",
    minProbeSpacing: "100mil",
    maxDetour: "10mm",
  }
  expect(autoroutingPhaseProps.parse(input)).toEqual({
    ...input,
    diameter: 1,
    clearance: 0.2,
    minProbeSpacing: 2.54,
    maxDetour: 10,
  })
  for (const patch of [
    { reroute: false },
    { reroute: undefined },
    { autorouter: "simplify" },
    { algorithmFn: async () => ({}) },
    { region: { minX: 0, maxX: 1, minY: 0, maxY: 1 } },
    { pcbTracePaths: [] },
    { diameter: -1 },
    { diameter: 0 },
    { clearance: -1 },
    { minProbeSpacing: -1 },
    { maxDetour: -1 },
    { addTestPoints: false },
  ])
    expect(
      autoroutingPhaseProps.safeParse({ ...input, ...patch }).success,
    ).toBe(false)
  expect(autoroutingPhaseProps.safeParse({ maxDetour: "10mm" }).success).toBe(
    false,
  )
  expect(autoroutingPhaseProps.parse({ addTestPoints: false })).toEqual({
    addTestPoints: false,
  })
})
