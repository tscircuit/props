import { expect, test } from "bun:test"
import {
  differentialPairProps,
  type DifferentialPairProps,
} from "lib/components/differentialpair"

test("parses differential pair with routing geometry constraints", () => {
  const raw: DifferentialPairProps = {
    name: "USB_TX",
    positiveConnection: "TX_POS",
    negativeConnection: "TX_NEG",
    maxLengthSkew: "0.1mm",
    pcbTraceGap: "0.28mm",
    pcbTraceWidth: "0.17mm",
    traceWidth: "0.17mm",
    layer: "top",
    pcbAllowedLayers: ["top", "bottom"],
    sameLayer: true,
    matchViaTransitions: true,
    targetDifferentialImpedance: "90ohm",
    maxUncoupledLength: "5mm",
  }

  const parsed = differentialPairProps.parse(raw)
  expect(parsed.name).toBe("USB_TX")
  expect(parsed.maxLengthSkew).toBe(0.1)
  expect(parsed.pcbTraceGap).toBe(0.28)
  expect(parsed.pcbTraceWidth).toBe(0.17)
  expect(parsed.traceWidth).toBe(0.17)
  expect(parsed.layer).toBe("top")
  expect(parsed.pcbAllowedLayers).toEqual(["top", "bottom"])
  expect(parsed.sameLayer).toBe(true)
  expect(parsed.matchViaTransitions).toBe(true)
  expect(parsed.targetDifferentialImpedance).toBe(90)
  expect(parsed.maxUncoupledLength).toBe(5)
})

test("rejects invalid routing geometry constraints", () => {
  expect(() =>
    differentialPairProps.parse({
      positiveConnection: "TX_POS",
      negativeConnection: "TX_NEG",
      pcbTraceGap: -0.5,
    }),
  ).toThrow()

  expect(() =>
    differentialPairProps.parse({
      positiveConnection: "TX_POS",
      negativeConnection: "TX_NEG",
      pcbTraceWidth: 0,
    }),
  ).toThrow()

  expect(() =>
    differentialPairProps.parse({
      positiveConnection: "TX_POS",
      negativeConnection: "TX_NEG",
      pcbAllowedLayers: [],
    }),
  ).toThrow()
})
