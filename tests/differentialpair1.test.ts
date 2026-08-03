import { expect, test } from "bun:test"
import {
  differentialPairProps,
  type DifferentialPairProps,
} from "lib/components/differentialpair"

test("parses a differential pair with maximum length skew", () => {
  const raw = {
    name: "data",
    positiveConnection: "data-positive",
    negativeConnection: "data-negative",
    maxLengthSkew: 2.5,
  } satisfies DifferentialPairProps

  const parsed = differentialPairProps.parse(raw)

  expect(parsed).toEqual(raw)
})
