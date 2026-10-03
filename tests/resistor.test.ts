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

test.each(["0.5% ", " 0.5% ", "\t0.5%\n"])(
  "should preserve fractional percentage tolerance with surrounding whitespace: %j",
  (tolerance) => {
    const parsed = resistorProps.parse({
      name: "R1",
      resistance: "1k",
      tolerance,
    })

    expect(parsed.tolerance).toBeCloseTo(0.005)
  },
)

test.each([" 5% ", " 100% "])(
  "should accept percentage tolerance with surrounding whitespace: %j",
  (tolerance) => {
    const parsed = resistorProps.parse({
      name: "R1",
      resistance: "1k",
      tolerance,
    })

    expect(parsed.tolerance).toBe(tolerance.includes("100") ? 1 : 0.05)
  },
)

test.each([0, 0.005, 1, "0.005", " 0.005 ", "0.5%"])(
  "should preserve existing numeric and percentage tolerance inputs: %j",
  (tolerance) => {
    const parsed = resistorProps.parse({
      name: "R1",
      resistance: "1k",
      tolerance,
    })

    expect(parsed.tolerance).toBe(
      typeof tolerance === "number" ? tolerance : 0.005,
    )
  },
)

test.each([" -1% ", " 101% "])(
  "should reject out-of-range percentage tolerance with whitespace: %j",
  (tolerance) => {
    const parsed = resistorProps.safeParse({
      name: "R1",
      resistance: "1k",
      tolerance,
    })

    expect(parsed.success).toBe(false)
  },
)

test("should parse resistance strings to numbers", () => {
  const parsed = resistorProps.parse({
    name: "R3",
    resistance: "10k",
  })

  const parsedResistance: number = parsed.resistance
  expect(parsedResistance).toBe(10000)
})

test("should map supported resistor imperial footprints", () => {
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
