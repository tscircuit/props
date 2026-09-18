import { expect, test } from "bun:test"
import {
  differentialPairProps,
  type DifferentialPairProps,
} from "lib/components/differentialpair"

test("parses DDR differential-pair constraints into canonical units", () => {
  const rawProps = {
    name: "DDR3_DQS0",
    positiveConnection: "DQS0_P",
    negativeConnection: "DQS0_N",
    maxLengthSkew: "2mil",
    targetDifferentialImpedance: "100ohm",
    pcbTraceGap: "5mil",
    maxUncoupledLength: "1mm",
  } satisfies DifferentialPairProps

  expect(differentialPairProps.parse(rawProps)).toEqual({
    ...rawProps,
    maxLengthSkew: 0.0508,
    targetDifferentialImpedance: 100,
    pcbTraceGap: 0.127,
    maxUncoupledLength: 1,
  })
})

test("rejects invalid DDR differential-pair constraints", () => {
  const baseProps = {
    positiveConnection: "DQS0_P",
    negativeConnection: "DQS0_N",
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
