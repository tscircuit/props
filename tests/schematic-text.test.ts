import { expect, test } from "bun:test"
import {
  schematicTextProps,
  type SchematicTextProps,
} from "lib/components/schematic-text"
import { expectTypeOf } from "expect-type"

test("should parse schematic text with all fields", () => {
  const raw: SchematicTextProps = {
    schX: 10,
    schY: 20,
    text: "Label",
    fontSize: 2,
    anchor: "center",
    color: "#FF0000",
    schRotation: 90,
  }
  expectTypeOf(raw).toMatchTypeOf<SchematicTextProps>()
  const parsed = schematicTextProps.parse(raw)
  expect(parsed.schX).toBe(10)
  expect(parsed.schY).toBe(20)
  expect(parsed.text).toBe("Label")
  expect(parsed.fontSize).toBe(2)
  expect(parsed.anchor).toBe("center")
  expect(parsed.color).toBe("#FF0000")
  expect(parsed.schRotation).toBe(90)
})

test("should parse schematic text with only required fields", () => {
  const raw: SchematicTextProps = {
    text: "Only required",
  }
  const parsed = schematicTextProps.parse(raw)
  expect(parsed.text).toBe("Only required")
  expect(parsed.schX).toBeUndefined()
  expect(parsed.schY).toBeUndefined()
  expect(parsed.fontSize).toBe(1)
  expect(parsed.anchor).toBe("center")
  expect(parsed.color).toBe("#000000")
  expect(parsed.schRotation).toBe(0)
})
