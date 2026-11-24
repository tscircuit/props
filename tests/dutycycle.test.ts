import { expect, test } from "bun:test"
import { currentSourceProps } from "lib/components/currentsource"
import { voltageSourceProps } from "lib/components/voltagesource"

const sourceSchemas = [
  ["voltageSourceProps", voltageSourceProps, "vs_duty"] as const,
  ["currentSourceProps", currentSourceProps, "cs_duty"] as const,
]

test("dutyCycle parses plain fractions and percentage strings", () => {
  for (const [, schema, name] of sourceSchemas) {
    const parse = (dutyCycle: number | string) =>
      (schema.parse({ name, dutyCycle }) as any).dutyCycle
    expect(parse("50%")).toBe(0.5)
    expect(parse("0.5%")).toBe(0.005)
    expect(parse("0.5")).toBe(0.5)
    expect(parse(0.25)).toBe(0.25)
    expect(parse(0)).toBe(0)
    expect(parse("100%")).toBe(1)
    expect(parse("1e-1")).toBe(0.1)
    // Surrounding whitespace is ignored, including before the % suffix
    expect(parse(" 50%")).toBe(0.5)
    expect(parse("50% ")).toBe(0.5)
    expect(parse("50 %")).toBe(0.5)
  }
})

test("dutyCycle rejects malformed strings instead of truncating them", () => {
  for (const [, schema, name] of sourceSchemas) {
    for (const dutyCycle of [
      "0.5abc",
      "50%%",
      "0.75 volts",
      "0.5%garbage",
      "0.1.2",
      "50percent",
      "abc",
      "",
      "%",
    ]) {
      expect(schema.safeParse({ name, dutyCycle }).success).toBe(false)
    }
  }
})

test("dutyCycle still enforces the 0-1 range", () => {
  for (const [, schema, name] of sourceSchemas) {
    for (const dutyCycle of ["150%", 2, "-0.1", -0.1] as const) {
      expect(schema.safeParse({ name, dutyCycle }).success).toBe(false)
    }
  }
})
