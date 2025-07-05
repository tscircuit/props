import { expect, test } from "bun:test"
import {
  schematicTableProps,
  type SchematicTableProps,
} from "lib/components/schematic-table"

test("should parse schematic table props", () => {
  const rawProps: SchematicTableProps = {
    columnWidths: [5, 5],
    rowHeights: [2, 2],
    schX: 10,
    schY: 20,
    cellPadding: 1,
    borderWidth: 0.1,
    anchor: "top_left",
    fontSize: "3mm",
  }
  const parsed = schematicTableProps.parse(rawProps)
  expect(parsed.columnWidths).toEqual([5, 5])
  expect(parsed.rowHeights).toEqual([2, 2])
  expect(parsed.schX).toBe(10)
  expect(parsed.schY).toBe(20)
  expect(parsed.cellPadding).toBe(1)
  expect(parsed.borderWidth).toBe(0.1)
  expect(parsed.anchor).toBe("top_left")
  expect(parsed.fontSize).toBe(3)
})
