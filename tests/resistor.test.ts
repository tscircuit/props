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

test("should normalize supported resistor imperial footprints", () => {
  const supportedFootprints = ["01005", "0402", "2512"] as const

  for (const footprint of supportedFootprints) {
    const raw: ResistorProps = {
      name: `R_${footprint}`,
      resistance: 4700,
      footprint,
    }

    const parsed = resistorProps.parse(raw)
    expect(parsed.footprint).toBe(`res${footprint}`)
  }
})

test("should preserve non-generic resistor footprints", () => {
  const raw: ResistorProps = {
    name: "R4",
    resistance: 10000,
    footprint: "kicad:R_0402_1005Metric",
  }

  const parsed = resistorProps.parse(raw)
  expect(parsed.footprint).toBe("kicad:R_0402_1005Metric")
})
