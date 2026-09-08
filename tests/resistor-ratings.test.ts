import { expect, test } from "bun:test"
import { resistorProps, type ResistorProps } from "lib/components/resistor"

test("accepts documented powerRating and temperatureOperatingRange", () => {
  const raw: ResistorProps = {
    name: "R1",
    resistance: "10k",
    powerRating: "0.25W",
    temperatureOperatingRange: [-40, 125],
  }

  const parsed = resistorProps.parse(raw)

  expect(parsed.powerRating).toBe("0.25W")
  expect(parsed.temperatureOperatingRange).toEqual([-40, 125])
})

test("accepts string temperatureOperatingRange", () => {
  const raw: ResistorProps = {
    name: "R2",
    resistance: 100,
    temperatureOperatingRange: "-40C to +125C",
  }

  const parsed = resistorProps.parse(raw)

  expect(parsed.temperatureOperatingRange).toBe("-40C to +125C")
})
