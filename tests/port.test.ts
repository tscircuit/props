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

test("should parse schematic pin-label font-size distances", () => {
  const numericProps: PortProps = {
    name: "P3",
    schPinLabelFontSize: 0.1,
  }
  const unitProps: PortProps = {
    name: "P4",
    schPinLabelFontSize: "0.1mm",
  }

  expectTypeOf(numericProps).toMatchTypeOf<PortProps>()
  expectTypeOf(unitProps).toMatchTypeOf<PortProps>()

  expect(portProps.parse(numericProps).schPinLabelFontSize).toBe(0.1)
  expect(portProps.parse(unitProps).schPinLabelFontSize).toBe(0.1)
})

test("should parse schematic pin-label font-size presets", () => {
  expect(
    portProps.parse({ name: "P5", schPinLabelFontSize: "default" })
      .schPinLabelFontSize,
  ).toBe("default")
  expect(
    portProps.parse({ name: "P6", schPinLabelFontSize: "sm" })
      .schPinLabelFontSize,
  ).toBe("sm")
})

test("should leave schematic pin-label font size undefined by default", () => {
  const parsed = portProps.parse({ name: "P7" })

  expect(parsed.schPinLabelFontSize).toBeUndefined()
})

test("should reject invalid schematic pin-label font sizes", () => {
  for (const schPinLabelFontSize of [
    0,
    -0.1,
    Number.POSITIVE_INFINITY,
    "large",
    "invalid-distance",
  ]) {
    expect(
      portProps.safeParse({ name: "P8", schPinLabelFontSize }).success,
    ).toBe(false)
  }
})
