import { expect, test } from "bun:test"
import { busProps } from "lib/components/bus"

test("reference matching requires an explicit reference selection", () => {
  expect(() =>
    busProps.parse({
      connections: ["DQ0"],
      skewReference: "references",
      maxLengthSkew: 1,
    }),
  ).toThrow("requires lengthMatchTo")
})
