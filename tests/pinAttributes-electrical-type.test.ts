import { expect, test } from "bun:test"
import { chipProps, type PinAttributeMap, type PinElectricalType } from "lib"

const electricalTypes = [
  "input",
  "output",
  "bidirectional",
  "tri_state",
  "passive",
  "free",
  "unspecified",
  "power_input",
  "power_output",
  "open_collector",
  "open_emitter",
] as const satisfies readonly PinElectricalType[]

test.each([...electricalTypes])(
  "chip preserves electricalType %s",
  (electricalType) => {
    const attributes: PinAttributeMap = { electricalType }
    const parsed = chipProps.parse({
      name: "U1",
      pinAttributes: { pin1: attributes },
    })
    expect(parsed.pinAttributes?.pin1).toEqual(attributes)
  },
)

test("electricalType is optional and does not change existing attributes", () => {
  const pinAttributes: Record<string, PinAttributeMap> = {
    pin1: {},
    pin2: { requiresPower: true, requiresVoltage: "3.3V" },
    pin3: { electricalType: "power_output", providesPower: true },
    pin4: { electricalType: "free", doNotConnect: false },
    pin5: { electricalType: "unspecified" },
    pin6: { canUseOpenDrain: true, isUsingOpenDrain: true },
    pin7: { doNotConnect: true },
    // Classification is independent metadata, not a cross-field ERC validator.
    pin8: { electricalType: "input", providesPower: true },
  }
  const parsed = chipProps.parse({ name: "U1", pinAttributes })
  expect(parsed.pinAttributes).toEqual(pinAttributes)
  expect(parsed.pinAttributes?.pin1).not.toHaveProperty("electricalType")
  expect(chipProps.parse({ name: "U1" }).pinAttributes).toBeUndefined()
})

test.each(["invalid", "tri-state", "powerInput", "open_drain", "", null, 1])(
  "rejects invalid electricalType %s",
  (electricalType) => {
    const result = chipProps.safeParse({
      name: "U1",
      pinAttributes: { pin1: { electricalType } },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual([
        "pinAttributes",
        "pin1",
        "electricalType",
      ])
    }
  },
)

test("electricalType rejects invalid values at compile time", () => {
  // @ts-expect-error Only the documented electrical pin types are accepted.
  const attributes: PinAttributeMap = { electricalType: "invalid" }
  void attributes
})
