import { expect, test } from "bun:test"
import {
  type SimulationEyeDiagramProps,
  simulationEyeDiagramProps,
  simulationProps,
} from "../lib"

test("eye diagrams link a transient channel simulation", () => {
  const eye = {
    name: "DDR3 eye",
    simulationRef: "ddr3",
  } satisfies SimulationEyeDiagramProps
  expect(simulationProps.eyediagram.parse(eye)).toEqual(eye)
  expect(
    simulationEyeDiagramProps.parse({
      ...eye,
      startTime: "2UI",
      endTime: "8ns",
    }),
  ).toEqual({ ...eye, startTime: "2UI", endTime: 8e-9 })
  for (const invalid of [
    { simulationRef: "" },
    { startTime: "-1ns" },
    { channelRef: "A0" },
    { unitInterval: "2.5ns" },
    { probeRef: "A0" },
  ]) {
    expect(
      simulationEyeDiagramProps.safeParse({ ...eye, ...invalid }).success,
    ).toBe(false)
  }
})
