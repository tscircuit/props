import { expect, test } from "bun:test"
import { resistorProps, type ResistorProps } from "lib/components/resistor"

test("should parse schOrientation for resistor", () => {
  const raw: ResistorProps = {
    name: "R1",
    resistance: 1000,
    schOrientation: "vertical",
  }

  const parsed = resistorProps.parse(raw)
  expect(parsed.schOrientation).toBe("vertical")
})

test("should parse tolerance percentage for resistor", () => {
  const raw: ResistorProps = {
    name: "R2",
    resistance: 2200,
    tolerance: "5%",
  }

  const parsed = resistorProps.parse(raw)
  expect(parsed.tolerance).toBeCloseTo(0.05)
})
