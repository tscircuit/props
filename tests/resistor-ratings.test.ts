import { test, expect } from "bun:test"
import { resistorProps } from "lib/components/resistor"

test("resistorProps parses and validates powerRating, maxPowerRating, maxVoltageRating, temperatureOperatingRange, schShowRatings (#3105)", () => {
  const parsed = resistorProps.parse({
    name: "R1",
    resistance: "10k",
    powerRating: "0.25W",
    maxPowerRating: "0.5W",
    maxVoltageRating: "200V",
    temperatureOperatingRange: [-40, 125],
    schShowRatings: true,
  })

  expect(parsed.resistance).toBe(10000)
  expect(parsed.powerRating).toBe("0.25W")
  expect(parsed.maxPowerRating).toBe("0.5W")
  expect(parsed.maxVoltageRating).toBe("200V")
  expect(parsed.temperatureOperatingRange).toEqual([-40, 125])
  expect(parsed.schShowRatings).toBe(true)
})

test("resistorProps parses string temperatureOperatingRange", () => {
  const parsed = resistorProps.parse({
    name: "R1",
    resistance: 100,
    temperatureOperatingRange: "-40C to +125C",
  })

  expect(parsed.resistance).toBe(100)
  expect(parsed.temperatureOperatingRange).toBe("-40C to +125C")
})
