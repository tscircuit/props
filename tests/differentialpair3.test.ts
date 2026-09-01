import { expect, test } from "bun:test"
import { differentialPairProps } from "lib/components/differentialpair"

test("requires maximum length skew to be non-negative", () => {
  expect(() =>
    differentialPairProps.parse({
      positiveConnection: "data-positive",
      negativeConnection: "data-negative",
      maxLengthSkew: -0.1,
    }),
  ).toThrow()
})
