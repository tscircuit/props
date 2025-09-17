import { expect, test } from "bun:test"
import {
  schematicRectProps,
  type SchematicRectProps,
} from "lib/components/schematic-rect"

test("schematic rect parses minimal props", () => {
  const rect: SchematicRectProps = {
    center: { x: 5, y: 10 },
    width: 20,
    height: 15,
  }

  const parsed = schematicRectProps.parse(rect)

  expect(parsed.center).toEqual({ x: 5, y: 10 })
  expect(parsed.width).toBe(20)
  expect(parsed.height).toBe(15)
  expect(parsed.rotation).toBe(0)
  expect(parsed.strokeWidth).toBeUndefined()
  expect(parsed.color).toBe("#000000")
  expect(parsed.isFilled).toBe(false)
  expect(parsed.isDashed).toBe(false)
})

test("schematic rect allows styling overrides", () => {
  const parsed = schematicRectProps.parse({
    center: { x: 0, y: 0 },
    width: "5mm",
    height: "2mm",
    rotation: 45,
    strokeWidth: "0.3mm",
    color: "#ff0000",
    isFilled: true,
    fillColor: "#cccccc",
    isDashed: true,
  })

  expect(parsed.rotation).toBe(45)
  expect(parsed.strokeWidth).toBeGreaterThan(0)
  expect(parsed.color).toBe("#ff0000")
  expect(parsed.isFilled).toBe(true)
  expect(parsed.fillColor).toBe("#cccccc")
  expect(parsed.isDashed).toBe(true)
})
