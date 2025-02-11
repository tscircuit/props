import { expect, test } from "bun:test"
import {
  potentiometerProps,
  type PotentiometerProps,
} from "../lib/components/potentiometer"
import { expectTypeOf } from "expect-type"

test("should parse potentiometer props with two_pin variant", () => {
  const rawProps: PotentiometerProps = {
    name: "potentiometer",
    maxResistance: "10k",
    pinVariant: "two_pin",
  }
  const parsedProps = potentiometerProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("two_pin")
})

test("should parse potentiometer props with three_pin variant", () => {
  const rawProps: PotentiometerProps = {
    name: "potentiometer",
    maxResistance: "20k",
    pinVariant: "three_pin",
  }
  const parsedProps = potentiometerProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("three_pin")
})

test("should enforce correct types for potentiometer props", () => {
  const rawProps: PotentiometerProps = {
    name: "potentiometer",
    maxResistance: "10k",
    pinVariant: "two_pin",
  }
  expectTypeOf(rawProps).toMatchTypeOf<PotentiometerProps>()
})
