import { expect, test } from "bun:test"
import {
  schematicPathProps,
  type SchematicPathProps,
} from "lib/components/schematic-path"

test("schematic path accepts dash distance parameters", () => {
  const parsed = schematicPathProps.parse({
    points: [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
    ],
    strokeWidth: "0.1mm",
    strokeColor: "#123456",
    dashLength: "2mm",
    dashGap: "1mm",
  } satisfies SchematicPathProps)

  expect(parsed.strokeWidth).toBeCloseTo(0.1)
  expect(parsed.strokeColor).toBe("#123456")
  expect(parsed.dashLength).toBe(2)
  expect(parsed.dashGap).toBe(1)
  expect(parsed.isFilled).toBe(false)
})
