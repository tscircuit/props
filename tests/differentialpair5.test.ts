import { expect, test } from "bun:test"
import {
  differentialPairProps,
  type DifferentialPairProps,
} from "lib/components/differentialpair"

test("parses DDR differential-pair skew into canonical millimeters", () => {
  const rawProps = {
    name: "DDR3_DQS0",
    positiveConnection: "DQS0_P",
    negativeConnection: "DQS0_N",
    maxLengthSkew: "2mil",
  } satisfies DifferentialPairProps

  expect(differentialPairProps.parse(rawProps)).toEqual({
    ...rawProps,
    maxLengthSkew: 0.0508,
  })
})
