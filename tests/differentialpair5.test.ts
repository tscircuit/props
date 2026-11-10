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

test("rejects removed DDR differential-pair constraints", () => {
  const baseProps = {
    positiveConnection: "DQS0_P",
    negativeConnection: "DQS0_N",
    maxLengthSkew: 0.1,
  }

  expect(() =>
    differentialPairProps.parse({
      ...baseProps,
      targetDifferentialImpedance: 0,
    }),
  ).toThrow()
  expect(() =>
    differentialPairProps.parse({ ...baseProps, pcbTraceGap: 0 }),
  ).toThrow()
  expect(() =>
    differentialPairProps.parse({ ...baseProps, maxUncoupledLength: "-1mm" }),
  ).toThrow()
})
