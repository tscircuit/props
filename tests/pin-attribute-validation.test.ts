import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"
import {
  type PinAttributeMap,
  pinAttributeMap,
} from "lib/common/pinAttributeMap"

test("unknown pin attributes fail with the component pin path", () => {
  const parsed = chipProps.safeParse({
    name: "U1",
    pinAttributes: {
      pin4: { isOutput: true, isUsingInternalPullupp: true },
    },
  })
  expect(parsed.success).toBe(false)
  if (parsed.success) throw new Error("Expected invalid pin attributes")
  expect(parsed.error.issues).toMatchInlineSnapshot(`
    [
      {
        "code": "unrecognized_keys",
        "keys": [
          "isUsingInternalPullupp",
        ],
        "message": "Unrecognized key(s) in object: 'isUsingInternalPullupp'",
        "path": [
          "pinAttributes",
          "pin4",
        ],
      },
    ]
  `)
})

test("Circuit JSON names are not silently accepted as TSX pin attributes", () => {
  const parsed = pinAttributeMap.safeParse({ is_output: true })
  expect(parsed.success).toBe(false)
  if (parsed.success) throw new Error("Expected invalid pin attributes")
  expect(parsed.error.issues).toMatchInlineSnapshot(`
    [
      {
        "code": "unrecognized_keys",
        "keys": [
          "is_output",
        ],
        "message": "Unrecognized key(s) in object: 'is_output'",
        "path": [],
      },
    ]
  `)
})

test("known capabilities and selected modes remain unchanged without defaults", () => {
  const pin4 = {
    isGpio: true,
    isBidirectional: true,
    isInput: true,
    canUseInternalPullup: true,
    isUsingInternalPullup: true,
    capabilities: ["i2c_sda"],
    activeCapability: "i2c_sda",
    canUseInternalPulldown: false,
  } satisfies PinAttributeMap
  expect(
    chipProps.parse({ name: "U1", pinAttributes: { pin4 } }).pinAttributes,
  ).toEqual({ pin4 })
  expect(pinAttributeMap.parse({})).toEqual({})
})
