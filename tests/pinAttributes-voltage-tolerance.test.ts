import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"
import {
  type PinAttributeMap,
  pinAttributeMap,
} from "lib/common/pinAttributeMap"

test("requiredVoltageTolerance normalizes fractions and percentages on pins", () => {
  for (const value of [0.05, "0.05", "5%", " 5 % "]) {
    const attributes: PinAttributeMap = {
      requiresVoltage: "3.3V",
      requiredVoltageTolerance: value,
    }
    const parsed = chipProps.parse({
      name: "U1",
      pinAttributes: { VCC: attributes },
    })
    expect(parsed.pinAttributes?.VCC).toEqual({
      requiresVoltage: "3.3V",
      requiredVoltageTolerance: 0.05,
    })
  }
})

test("requiredVoltageTolerance supports exact matching and 100% tolerance", () => {
  for (const value of [0, "0%", 1, "100%"]) {
    expect(
      pinAttributeMap.parse({ requiredVoltageTolerance: value })
        .requiredVoltageTolerance,
    ).toBe(value === 0 || value === "0%" ? 0 : 1)
  }
})

test("requiredVoltageTolerance is optional without an inferred default", () => {
  expect(pinAttributeMap.parse({ requiresVoltage: 3.3 })).toEqual({
    requiresVoltage: 3.3,
  })
})

test("requiredVoltageTolerance rejects invalid and out-of-range values", () => {
  for (const value of [
    -0.05,
    1.01,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "-5%",
    "101%",
    "5% extra",
    "5V",
    "",
    true,
    null,
    {},
  ]) {
    expect(
      pinAttributeMap.safeParse({ requiredVoltageTolerance: value }).success,
    ).toBe(false)
  }
})
