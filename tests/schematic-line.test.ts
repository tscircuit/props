import { expect, test } from "bun:test"
import {
  schematicLineProps,
  type SchematicLineProps,
} from "lib/components/schematic-line"

const baseLine: SchematicLineProps = {
  x1: 0,
  y1: 0,
  x2: 5,
  y2: 5,
}

test("schematic line parses with defaults", () => {
  const parsed = schematicLineProps.parse(baseLine)

  expect(parsed.x1).toBe(0)
  expect(parsed.y1).toBe(0)
  expect(parsed.x2).toBe(5)
  expect(parsed.y2).toBe(5)
  expect(parsed.strokeWidth).toBeUndefined()
  expect(parsed.isDashed).toBe(false)
})

test("schematic line accepts style overrides", () => {
  const parsed = schematicLineProps.parse({
    ...baseLine,
    strokeWidth: "0.05in",
    color: "#123456",
    isDashed: true,
  })

  expect(parsed.strokeWidth).toBeGreaterThan(0)
  expect(parsed.color).toBe("#123456")
  expect(parsed.isDashed).toBe(true)
})
