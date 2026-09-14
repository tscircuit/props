import { expect, test } from "bun:test"
import { currentSourceProps } from "lib/components/currentsource"
import { voltageSourceProps } from "lib/components/voltagesource"

for (const [name, schema] of [
  ["current source", currentSourceProps],
  ["voltage source", voltageSourceProps],
] as const) {
  test(`${name} normalizes complete duty cycle values`, () => {
    for (const [input, expected] of [
      [0, 0],
      [1, 1],
      [0.25, 0.25],
      ["0.25", 0.25],
      ["50%", 0.5],
      ["0%", 0],
      ["100%", 1],
      [" 0.5% ", 0.005],
      [" 50% ", 0.5],
      ["2.5e1%", 0.25],
    ] as const) {
      expect(schema.parse({ name: "source", dutyCycle: input }).dutyCycle).toBe(
        expected,
      )
    }
    expect(schema.parse({ name: "source" }).dutyCycle).toBeUndefined()
  })

  test(`${name} rejects malformed duty cycles instead of parsing a prefix`, () => {
    for (const dutyCycle of [
      "0.5oops",
      "50oops%",
      "50%%",
      "0.5.5",
      "1e-",
      "0x1",
      "",
      " ",
      "%",
      "150%",
      -0.1,
      1.1,
      Infinity,
      NaN,
    ]) {
      const result = schema.safeParse({ name: "source", dutyCycle })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["dutyCycle"])
      }
    }
  })
}
