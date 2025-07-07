import { expect, test } from "bun:test"
import {
  schematicCellProps,
  type SchematicCellProps,
} from "lib/components/schematic-cell"

test("should parse schematic cell props", () => {
  const rawProps: SchematicCellProps = {
    children: "A1",
    horizontalAlign: "center",
    verticalAlign: "middle",
    fontSize: "2mm",
    width: "10mm",
  }
  const parsed = schematicCellProps.parse(rawProps)
  expect(parsed.children).toBe("A1")
  expect(parsed.horizontalAlign).toBe("center")
  expect(parsed.verticalAlign).toBe("middle")
  expect(parsed.fontSize).toBe(2)
  expect(parsed.width).toBe(10)
})

test("should parse schematic cell props with spans", () => {
  const rawProps: SchematicCellProps = {
    children: "A1",
    rowSpan: 2,
    colSpan: 3,
  }
  const parsed = schematicCellProps.parse(rawProps)
  expect(parsed.children).toBe("A1")
  expect(parsed.rowSpan).toBe(2)
  expect(parsed.colSpan).toBe(3)
})

test("should parse schematic cell props without children", () => {
  const rawProps: SchematicCellProps = {
    horizontalAlign: "left",
  }
  const parsed = schematicCellProps.parse(rawProps)
  expect(parsed.children).toBeUndefined()
  expect(parsed.horizontalAlign).toBe("left")
})
