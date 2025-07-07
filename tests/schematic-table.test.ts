import { expect, test } from "bun:test"
import {
  schematicTableProps,
  type SchematicTableProps,
} from "lib/components/schematic-table"

test("should parse schematic table props", () => {
  const rawProps: SchematicTableProps = {
    schX: 10,
    schY: 20,
    columnWidths: [10, "20mm"],
    rowHeights: [5, "5mm"],
    cellPadding: 1,
    borderWidth: 0.1,
    anchor: "top_left",
    fontSize: "3mm",
  }
  const parsed = schematicTableProps.parse(rawProps)
  expect(parsed.schX).toBe(10)
  expect(parsed.schY).toBe(20)
  expect(parsed.columnWidths).toEqual([10, 20])
  expect(parsed.rowHeights).toEqual([5, 5])
  expect(parsed.cellPadding).toBe(1)
  expect(parsed.borderWidth).toBe(0.1)
  expect(parsed.anchor).toBe("top_left")
  expect(parsed.fontSize).toBe(3)
})

test("should parse schematic table props without columnWidths and rowHeights", () => {
  const rawProps: SchematicTableProps = {
    schX: 10,
    schY: 20,
    cellPadding: 1,
    borderWidth: 0.1,
    anchor: "top_left",
    fontSize: "3mm",
  }
  const parsed = schematicTableProps.parse(rawProps)
  expect(parsed.schX).toBe(10)
  expect(parsed.schY).toBe(20)
  expect(parsed.columnWidths).toBeUndefined()
  expect(parsed.rowHeights).toBeUndefined()
  expect(parsed.cellPadding).toBe(1)
  expect(parsed.borderWidth).toBe(0.1)
  expect(parsed.anchor).toBe("top_left")
  expect(parsed.fontSize).toBe(3)
})
