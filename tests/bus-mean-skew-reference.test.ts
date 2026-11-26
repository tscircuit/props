import { expect, test } from "bun:test"
import { busProps } from "../lib/components/bus"

test("bus skew may use each member's deviation from the arithmetic mean", () => {
  expect(
    busProps.parse({
      connections: ["D0", "D1"],
      maxLengthSkew: "100mil",
      lengthSkewReference: "mean",
    }),
  ).toEqual({
    connections: ["D0", "D1"],
    maxLengthSkew: 2.54,
    lengthSkewReference: "mean",
  })
  expect(busProps.parse({ connections: ["D0", "D1"] })).not.toHaveProperty(
    "lengthSkewReference",
  )
  expect(
    busProps.safeParse({
      connections: ["D0", "D1"],
      lengthSkewReference: "invalid",
    }).success,
  ).toBe(false)
})
