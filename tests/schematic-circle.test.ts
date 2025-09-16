import { expect, test } from "bun:test"
import {
  schematicCircleProps,
  type SchematicCircleProps,
} from "lib/components/schematic-circle"

test("schematic circle parses minimal props", () => {
  const circle: SchematicCircleProps = {
    center: { x: 1, y: 2 },
    radius: 3,
  }

  const parsed = schematicCircleProps.parse(circle)

  expect(parsed.center).toEqual({ x: 1, y: 2 })
  expect(parsed.radius).toBe(3)
  expect(parsed.strokeWidth).toBeUndefined()
  expect(parsed.isFilled).toBe(false)
  expect(parsed.isDashed).toBe(false)
})

test("schematic circle allows styling overrides", () => {
  const parsed = schematicCircleProps.parse({
    center: { x: 0, y: 0 },
    radius: 1,
    strokeWidth: "0.2mm",
    color: "#00ff00",
    isFilled: true,
    fillColor: "#cccccc",
    isDashed: true,
  })

  expect(parsed.strokeWidth).toBeGreaterThan(0)
  expect(parsed.color).toBe("#00ff00")
  expect(parsed.isFilled).toBe(true)
  expect(parsed.fillColor).toBe("#cccccc")
  expect(parsed.isDashed).toBe(true)
})
