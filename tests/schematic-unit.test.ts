import { expect, test } from "bun:test"
import {
  schematicUnitProps,
  type SchematicUnitProps,
} from "lib/components/schematic-unit"

test("parses schematic unit props", () => {
  const rawProps: SchematicUnitProps = {
    unit: "A",
    symbolName: "mosfet_n_channel",
    pinMapping: {
      gate: "pin2",
      source: "pin1",
      drain: "pin6",
    },
    schX: "10mm",
    schY: 5,
    schRotation: "90deg",
  }

  expect(schematicUnitProps.parse(rawProps)).toEqual({
    unit: "A",
    symbolName: "mosfet_n_channel",
    pinMapping: {
      gate: "pin2",
      source: "pin1",
      drain: "pin6",
    },
    schX: 10,
    schY: 5,
    schRotation: 90,
  })
})

test("requires at least one pin mapping", () => {
  const result = schematicUnitProps.safeParse({
    unit: "A",
    symbolName: "mosfet_n_channel",
    pinMapping: {},
  })

  expect(result.success).toBe(false)
})

test("requires non-empty pin mapping names", () => {
  expect(
    schematicUnitProps.safeParse({
      unit: "A",
      symbolName: "mosfet_n_channel",
      pinMapping: { gate: "" },
    }).success,
  ).toBe(false)
})

test("requires non-empty unit and symbol names", () => {
  expect(
    schematicUnitProps.safeParse({
      unit: "",
      symbolName: "mosfet_n_channel",
      pinMapping: { gate: "pin2" },
    }).success,
  ).toBe(false)
  expect(
    schematicUnitProps.safeParse({
      unit: "A",
      symbolName: "",
      pinMapping: { gate: "pin2" },
    }).success,
  ).toBe(false)
})
