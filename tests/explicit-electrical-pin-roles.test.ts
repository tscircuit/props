import { expect, test } from "bun:test"
import { pinAttributeMap } from "../lib/common/pinAttributeMap"

test("explicit electrical roles preserve true, false, and unknown", () => {
  const flags = [
    "isResetInput",
    "isUsbDataPositive",
    "isUsbDataNegative",
    "isCurrentSensePositiveInput",
    "isCurrentSenseNegativeInput",
    "isMosfetGate",
    "isMosfetSource",
    "isMosfetDrain",
    "isTransistorBase",
    "isTransistorCollector",
    "isTransistorEmitter",
    "isDiodeAnode",
    "isDiodeCathode",
    "isOpAmpInvertingInput",
    "isOpAmpNonInvertingInput",
    "isOpAmpOutput",
    "isRelayCoil",
    "isRelayCommonContact",
    "isRelayNormallyOpenContact",
    "isRelayNormallyClosedContact",
  ] as const
  const base = {}
  const unspecified = pinAttributeMap.parse(base)
  for (const flag of flags) {
    expect(unspecified[flag]).toBeUndefined()
    for (const value of [true, false]) {
      expect(pinAttributeMap.parse({ ...base, [flag]: value })[flag]).toBe(
        value,
      )
    }
    expect(pinAttributeMap.safeParse({ ...base, [flag]: "true" }).success).toBe(
      false,
    )
  }
})
