import { expect, test } from "bun:test"
import { chipProps, type PinAttributeMap } from "lib"

const electricalFlags = [
  "isInput",
  "isOutput",
  "isPassive",
  "isBidirectional",
  "canUseTriState",
  "isUsingTriState",
  "canUseOpenCollector",
  "isUsingOpenCollector",
  "canUseOpenEmitter",
  "isUsingOpenEmitter",
] as const satisfies readonly (keyof PinAttributeMap)[]

test.each([...electricalFlags])(
  "chip preserves true and false for %s",
  (flag) => {
    for (const value of [true, false]) {
      const attributes: PinAttributeMap = { [flag]: value }
      expect(
        chipProps.parse({ name: "U1", pinAttributes: { pin1: attributes } })
          .pinAttributes?.pin1,
      ).toEqual(attributes)
    }
  },
)

test.each([...electricalFlags])("rejects non-boolean values for %s", (flag) => {
  for (const value of ["true", 1, null]) {
    const result = chipProps.safeParse({
      name: "U1",
      pinAttributes: { pin1: { [flag]: value } },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual([
        "pinAttributes",
        "pin1",
        flag,
      ])
    }
  }
})

test("electrical flags compose with existing attributes without inferred defaults", () => {
  const pinAttributes: Record<string, PinAttributeMap> = {
    pin1: {},
    pin2: { isBidirectional: true, isGpio: true },
    pin3: { requiresPower: true, requiresVoltage: "3.3V" },
    pin4: { providesPower: true },
    pin5: { isOutput: true, canUseTriState: true, isUsingTriState: false },
    pin8: { isPassive: true },
    pin9: {
      isOutput: true,
      canUseOpenCollector: true,
      isUsingOpenCollector: true,
    },
    pin10: {
      isOutput: true,
      canUseOpenEmitter: true,
      isUsingOpenEmitter: true,
    },
    pin11: { canUseOpenDrain: true, isUsingOpenDrain: true },
    pin12: { doNotConnect: true },
  }
  expect(chipProps.parse({ name: "U1", pinAttributes }).pinAttributes).toEqual(
    pinAttributes,
  )
  expect(chipProps.parse({ name: "U1" }).pinAttributes).toBeUndefined()
})

test("electrical flags are boolean at compile time", () => {
  // @ts-expect-error Electrical flags accept booleans only.
  const attributes: PinAttributeMap = { isInput: "true" }
  void attributes
})
