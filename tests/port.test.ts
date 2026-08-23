import { expect, test } from "bun:test"
import { portProps, type PortProps } from "lib/components/port"
import { expectTypeOf } from "expect-type"

test("should parse PortProps without direction", () => {
  const rawProps: PortProps = {
    name: "P1",
  }

  expectTypeOf(rawProps).toMatchTypeOf<PortProps>()

  const parsed = portProps.parse(rawProps)
  expect(parsed.name).toBe("P1")
  expect(parsed.direction).toBeUndefined()
})

test("should parse PortProps without name", () => {
  const rawProps: PortProps = {
    direction: "left",
  }

  expectTypeOf(rawProps).toMatchTypeOf<PortProps>()

  const parsed = portProps.parse(rawProps)
  expect(parsed.name).toBeUndefined()
  expect(parsed.direction).toBe("left")
})

test("should parse PortProps with provided direction", () => {
  const rawProps: PortProps = {
    name: "P2",
    direction: "right",
  }

  const parsed = portProps.parse(rawProps)
  expect(parsed.direction).toBe("right")
})

test("should parse an optional schematic pin-label font size", () => {
  const rawProps: PortProps = {
    name: "P3",
    schPinLabelFontSize: 0.1,
  }

  expectTypeOf(rawProps).toMatchTypeOf<PortProps>()

  const parsed = portProps.parse(rawProps)
  expect(parsed.schPinLabelFontSize).toBe(0.1)
})

test("should leave schematic pin-label font size undefined by default", () => {
  const parsed = portProps.parse({ name: "P4" })

  expect(parsed.schPinLabelFontSize).toBeUndefined()
})

test("should reject non-positive or non-finite schematic pin-label font sizes", () => {
  expect(
    portProps.safeParse({ name: "P5", schPinLabelFontSize: 0 }).success,
  ).toBe(false)
  expect(
    portProps.safeParse({ name: "P6", schPinLabelFontSize: -0.1 }).success,
  ).toBe(false)
  expect(
    portProps.safeParse({
      name: "P7",
      schPinLabelFontSize: Number.POSITIVE_INFINITY,
    }).success,
  ).toBe(false)
})
