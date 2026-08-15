import { test, expect } from "bun:test"
import { capacitorProps } from "lib/components/capacitor"

test("capacitorProps accepts tolerance, temperatureCoefficient, and equivalentSeriesResistance", () => {
  const parsed = capacitorProps.parse({
    name: "C1",
    capacitance: "100nF",
    tolerance: "10%",
    temperatureCoefficient: "X7R",
    equivalentSeriesResistance: "50mohm",
    esr: "0.05ohm",
  })

  expect(parsed.capacitance).toBe(1e-7)
  expect(parsed.tolerance).toBe(0.1)
  expect(parsed.temperatureCoefficient).toBe("X7R")
  expect(parsed.equivalentSeriesResistance).toBe(0.05)
  expect(parsed.esr).toBe(0.05)
})

test("capacitorProps parses numeric tolerance", () => {
  const parsed = capacitorProps.parse({
    name: "C2",
    capacitance: "10uF",
    tolerance: 0.05,
  })

  expect(parsed.tolerance).toBe(0.05)
})
