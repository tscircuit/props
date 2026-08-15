import { expect, test } from "bun:test"
import { differentialPairProps } from "lib/components/differentialpair"

test("should parse differentialpair with routing geometry constraints (#743)", () => {
  const rawProps = {
    name: "TX_PAIR",
    positiveConnection: "TX_POS",
    negativeConnection: "TX_NEG",
    traceWidth: "0.17mm",
    traceGap: "0.28mm",
    layer: "inner1" as const,
    requireSameLayer: true,
    maxLengthSkew: "0.1mm",
    maxUncoupledLength: "1mm",
    viaGap: "0.25mm",
    requireMatchedVias: true,
  }

  const parsed = differentialPairProps.parse(rawProps)
  expect(parsed.traceWidth).toBeCloseTo(0.17, 3)
  expect(parsed.traceGap).toBeCloseTo(0.28, 3)
  expect(parsed.layer).toBe("inner1")
  expect(parsed.requireSameLayer).toBe(true)
  expect(parsed.maxLengthSkew).toBeCloseTo(0.1, 3)
  expect(parsed.maxUncoupledLength).toBeCloseTo(1, 3)
  expect(parsed.viaGap).toBeCloseTo(0.25, 3)
  expect(parsed.requireMatchedVias).toBe(true)
})

test("should accept pcb aliases for traceWidth and viaGap", () => {
  const parsed = differentialPairProps.parse({
    positiveConnection: "TX_POS",
    negativeConnection: "TX_NEG",
    pcbTraceWidth: 0.2,
    pcbViaGap: 0.3,
  })

  expect(parsed.pcbTraceWidth).toBe(0.2)
  expect(parsed.pcbViaGap).toBe(0.3)
})

test("should reject non-positive values for traceWidth, traceGap, viaGap", () => {
  expect(
    differentialPairProps.safeParse({
      positiveConnection: "TX_POS",
      negativeConnection: "TX_NEG",
      traceWidth: -0.1,
    }).success,
  ).toBe(false)

  expect(
    differentialPairProps.safeParse({
      positiveConnection: "TX_POS",
      negativeConnection: "TX_NEG",
      traceGap: 0,
    }).success,
  ).toBe(false)

  expect(
    differentialPairProps.safeParse({
      positiveConnection: "TX_POS",
      negativeConnection: "TX_NEG",
      viaGap: -0.5,
    }).success,
  ).toBe(false)
})
