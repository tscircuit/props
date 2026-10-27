import { expect, test } from "bun:test"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"
test("test point phases normalize units and reject ambiguous routing configurations", () => {
  const input = {
    reroute: true,
    connection: "net.SDA",
    pcbTestPoints: {
      layer: "bottom",
      diameter: "1mm",
      clearance: "0.2mm",
      minProbeSpacing: "100mil",
      maxDetour: "1mm",
    },
  }
  expect(autoroutingPhaseProps.parse(input).pcbTestPoints).toEqual({
    layer: "bottom",
    diameter: 1,
    clearance: 0.2,
    minProbeSpacing: 2.54,
    maxDetour: 1,
  })
  for (const patch of [
    { reroute: false },
    { connection: undefined },
    { autorouter: "simplify" },
    { pcbTestPoints: { ...input.pcbTestPoints, diameter: -1 } },
  ]) {
    expect(
      autoroutingPhaseProps.safeParse({ ...input, ...patch }).success,
    ).toBe(false)
  }
})
