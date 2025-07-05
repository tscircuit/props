import { expect, test } from "bun:test"
import {
  schematicRowProps,
  type SchematicRowProps,
} from "lib/components/schematic-row"

test("should parse schematic row props", () => {
  const rawProps: SchematicRowProps = {
    height: 10,
  }
  const parsed = schematicRowProps.parse(rawProps)
  expect(parsed.height).toBe(10)
})
