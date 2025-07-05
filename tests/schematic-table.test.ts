import { expect, test } from "bun:test"
import {
  schematicTableProps,
  type SchematicTableProps,
} from "lib/components/schematic-table"

test("should parse schematic table props", () => {
  const rawProps: SchematicTableProps = {
    rows: [
      [{ text: "A1" }, { text: "B1" }],
      [{ text: "A2" }, { text: "B2" }],
    ],
    columnWidths: [5, 5],
    rowHeights: [2, 2],
    schX: 10,
    schY: 20,
    cellPadding: 1,
    borderWidth: 0.1,
    anchor: "top_left",
  }
  const parsed = schematicTableProps.parse(rawProps)
  expect(parsed.rows.length).toBe(2)
  expect(parsed.rows[0]!.length).toBe(2)
  expect(parsed.rows[0]![0]!.text).toBe("A1")
  expect(parsed.columnWidths).toEqual([5, 5])
  expect(parsed.rowHeights).toEqual([2, 2])
  expect(parsed.schX).toBe(10)
  expect(parsed.schY).toBe(20)
  expect(parsed.cellPadding).toBe(1)
  expect(parsed.borderWidth).toBe(0.1)
  expect(parsed.anchor).toBe("top_left")
})

test("should parse schematic table cell props", () => {
  const rawProps: SchematicTableProps = {
    rows: [
      [
        {
          text: "A1",
          horizontalAlign: "center",
          verticalAlign: "middle",
          fontSize: "2mm",
        },
      ],
    ],
    columnWidths: [10],
    rowHeights: [4],
  }
  const parsed = schematicTableProps.parse(rawProps)
  const cell = parsed.rows[0]![0]!
  expect(cell.horizontalAlign).toBe("center")
  expect(cell.verticalAlign).toBe("middle")
  expect(cell.fontSize).toBe(2)
})
