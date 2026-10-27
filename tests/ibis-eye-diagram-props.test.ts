import { expect, test } from "bun:test"
import { analogEyeDiagramProps } from "../lib"

const eye = {
  name: "eye",
  simulationRef: ".run",
  probeRef: ".probe",
  unitInterval: "2ns",
  timeOrigin: "0ns",
  startTime: "8ns",
  endTime: "20ns",
}

test("eye gates must follow the declared fixed time origin and ordered endpoints", () => {
  expect(
    analogEyeDiagramProps.safeParse({ ...eye, endTime: "4ns" }).success,
  ).toBe(false)
  expect(analogEyeDiagramProps.parse(eye).unitInterval).toBeCloseTo(
    0.000002,
    14,
  )
})

test.each([-1, "-2ns", 0, "0ns", "garbage"])(
  "eye diagram rejects unitInterval %j",
  (unitInterval) => {
    expect(
      analogEyeDiagramProps.safeParse({ ...eye, unitInterval }).success,
    ).toBe(false)
  },
)
