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
  }
  const parsed = schematicCellProps.parse(rawProps)
  expect(parsed.children).toBe("A1")
  expect(parsed.horizontalAlign).toBe("center")
  expect(parsed.verticalAlign).toBe("middle")
  expect(parsed.fontSize).toBe(2)
})
