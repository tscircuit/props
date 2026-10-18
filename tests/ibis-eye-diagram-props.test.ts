import { expect, test } from "bun:test"
import { analogEyeDiagramProps } from "../lib"
test("eye gates must follow the declared fixed time origin and ordered endpoints", () => {
  const eye = {
    name: "eye",
    simulationRef: ".run",
    probeRef: ".probe",
    unitInterval: "2ns",
    timeOrigin: "0ns",
    startTime: "8ns",
    endTime: "4ns",
  }
  expect(analogEyeDiagramProps.safeParse(eye).success).toBe(false)
  expect(
    analogEyeDiagramProps.safeParse({ ...eye, endTime: "20ns" }).success,
  ).toBe(true)
})
