import { expect, test } from "bun:test"
import {
  resonatorProps,
  type ResonatorProps,
} from "../lib/components/resonator"
import { expectTypeOf } from "expect-type"

test("should parse resonator props with no_ground variant", () => {
  const rawProps: ResonatorProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "no_ground",
  }

  const parsedProps = resonatorProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("no_ground")
})

test("should parse resonator props with ground_pin variant", () => {
  const rawProps: ResonatorProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "ground_pin",
  }

  const parsedProps = resonatorProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("ground_pin")
})

test("should fail to parse resonator props with invalid pin variant", () => {
  const rawProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "invalid_variant",
  }

  expect(() => resonatorProps.parse(rawProps)).toThrow()
})

test("should enforce correct types for resonator props", () => {
  const rawProps: ResonatorProps = {
    name: "resonator",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "ground_pin",
  }

  expectTypeOf(rawProps).toMatchTypeOf<ResonatorProps>()
})
