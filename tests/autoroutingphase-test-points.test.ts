import { expect, test } from "bun:test"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"

test("test-point autorouter accepts hoisted options and rejects conflicting modes", () => {
  expect(
    autoroutingPhaseProps.parse({
      reroute: true,
      addTestPoints: true,
      testPointMaxDetour: "10mm",
    }),
  ).toEqual({ reroute: true, addTestPoints: true, testPointMaxDetour: 10 })
  const input = {
    reroute: true,
    addTestPoints: true,
    connection: "net.SDA",
    testPointLayer: "bottom" as const,
    testPointDiameter: "1mm",
    testPointClearance: "0.2mm",
    testPointMinProbeSpacing: "100mil",
    testPointMaxDetour: "10mm",
  }
  expect(autoroutingPhaseProps.parse(input)).toEqual({
    ...input,
    testPointDiameter: 1,
    testPointClearance: 0.2,
    testPointMinProbeSpacing: 2.54,
    testPointMaxDetour: 10,
  })
  for (const patch of [
    { reroute: false },
    { reroute: undefined },
    { autorouter: "simplify" },
    { algorithmFn: async () => ({}) },
    { region: { minX: 0, maxX: 1, minY: 0, maxY: 1 } },
    { pcbTracePaths: [] },
    { testPointDiameter: -1 },
    { testPointDiameter: 0 },
    { testPointClearance: -1 },
    { testPointMinProbeSpacing: -1 },
    { testPointMaxDetour: -1 },
    { addTestPoints: false },
  ])
    expect(
      autoroutingPhaseProps.safeParse({ ...input, ...patch }).success,
    ).toBe(false)
  expect(
    autoroutingPhaseProps.safeParse({ testPointMaxDetour: "10mm" }).success,
  ).toBe(false)
  expect(autoroutingPhaseProps.parse({ addTestPoints: false })).toEqual({
    addTestPoints: false,
  })
})
