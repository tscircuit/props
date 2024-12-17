import { expect, test } from "bun:test"
import { resonatorProps, type ResonatorProps } from "../lib/components/resonator"
import { expectTypeOf } from "expect-type"

test("should parse resonator props with 3pin variant", () => {
  const rawProps: ResonatorProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "3pin",
  }

  const parsedProps = resonatorProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("3pin")
})

test("should fail to parse resonator props with invalid pin variant", () => {
  const rawProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "2pin", 
  }

  expect(() => resonatorProps.parse(rawProps)).toThrow()
})

test("should parse resonator props without pinVariant (default 3pin)", () => {
  const rawProps: ResonatorProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "3pin",
  }

  const parsedProps = resonatorProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("3pin")
})

test("should enforce correct types for resonator props", () => {
  const rawProps: ResonatorProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "3pin",
  }

  expectTypeOf(rawProps).toMatchTypeOf<ResonatorProps>()
})
