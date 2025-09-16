import { expect, test } from "bun:test"
import {
  schematicArcProps,
  type SchematicArcProps,
} from "lib/components/schematic-arc"

const baseArc: SchematicArcProps = {
  center: { x: 0, y: 0 },
  radius: 1,
  startAngleDegrees: 0,
  endAngleDegrees: 90,
}

test("schematic arc parses defaults", () => {
  const parsed = schematicArcProps.parse(baseArc)

  expect(parsed.center).toEqual({ x: 0, y: 0 })
  expect(parsed.radius).toBe(1)
  expect(parsed.direction).toBe("counterclockwise")
  expect(parsed.color).toBe("#000000")
  expect(parsed.isDashed).toBe(false)
})

test("schematic arc allows overriding styling", () => {
  const parsed = schematicArcProps.parse({
    ...baseArc,
    direction: "clockwise",
    strokeWidth: "0.1mm",
    color: "#ff0000",
    isDashed: true,
  })

  expect(parsed.direction).toBe("clockwise")
  expect(parsed.strokeWidth).toBeGreaterThan(0)
  expect(parsed.color).toBe("#ff0000")
  expect(parsed.isDashed).toBe(true)
})
