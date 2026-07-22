import { expect, test } from "bun:test"
import {
  schematicBoxProps,
  type SchematicBoxProps,
} from "lib/components/schematic-box"
import { expectTypeOf } from "expect-type"

test("should parse schematic box with schX and schY", () => {
  const raw: SchematicBoxProps = {
    schX: 5,
    schY: 10,
    width: 20,
    height: 30,
  }
  expectTypeOf(raw).toMatchTypeOf<SchematicBoxProps>()
  const parsed = schematicBoxProps.parse(raw)
  expect(parsed.schX).toBe(5)
  expect(parsed.schY).toBe(10)
  expect(parsed.width).toBe(20)
  expect(parsed.height).toBe(30)
})

test("should parse schematic box chip reference props", () => {
  const raw: SchematicBoxProps = {
    name: "U1A",
    chipRef: "U1",
    schSheetName: "Power Sheet",
    width: 2.245,
    height: 1,
    pinLabels: {
      pin1: "VCC",
      pin2: "GND",
    },
    schPinArrangement: {
      leftSide: ["pin1", "pin2"],
      rightSide: [],
    },
  }

  const parsed = schematicBoxProps.parse(raw)

  expect(parsed.name).toBe("U1A")
  expect(parsed.chipRef).toBe("U1")
  expect(parsed.schSheetName).toBe("Power Sheet")
  expect(parsed.pinLabels).toEqual({ pin1: "VCC", pin2: "GND" })
  expect(parsed.schPinArrangement).toEqual({
    leftSide: {
      pins: ["pin1", "pin2"],
      direction: "top-to-bottom",
    },
    rightSide: {
      pins: [],
      direction: "top-to-bottom",
    },
  })
})

test("should parse schematic box with only overlay", () => {
  const raw: SchematicBoxProps = {
    overlay: ["custom"],
  }
  const parsed = schematicBoxProps.parse(raw)
  expect(parsed.overlay).toEqual(["custom"])
  expect(parsed.schX).toBeUndefined()
  expect(parsed.schY).toBeUndefined()
})

test("should fail if neither width/height nor overlay is provided", () => {
  const raw: SchematicBoxProps = {}
  expect(() => schematicBoxProps.parse(raw)).toThrow()
})

test("should fail if both width/height and overlay are provided", () => {
  const raw: SchematicBoxProps = {
    width: 10,
    height: 10,
    overlay: ["custom"],
  }
  expect(() => schematicBoxProps.parse(raw)).toThrow()
})
