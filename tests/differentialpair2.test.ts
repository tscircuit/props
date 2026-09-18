import { expect, test } from "bun:test"
import { differentialPairProps } from "lib/components/differentialpair"

test("requires both differential-pair connections", () => {
  expect(() =>
    differentialPairProps.parse({
      maxLengthSkew: 0.1,
    }),
  ).toThrow()
})
