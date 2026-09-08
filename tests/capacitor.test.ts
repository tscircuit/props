import { expect, test } from "bun:test"
import {
  type CapacitorProps,
  capacitorProps,
} from "../lib/components/capacitor"

test("parses maxDecouplingTraceLength with distance units", () => {
  const rawProps: CapacitorProps = {
    name: "C1",
    capacitance: "100nF",
    maxDecouplingTraceLength: "0.1in",
  }

  const parsedProps = capacitorProps.parse(rawProps)

  expect(parsedProps.maxDecouplingTraceLength).toBeCloseTo(2.54)
})

test("parses numeric maxDecouplingTraceLength as millimeters", () => {
  const rawProps: CapacitorProps = {
    name: "C1",
    capacitance: "100nF",
    maxDecouplingTraceLength: 3,
  }

  const parsedProps = capacitorProps.parse(rawProps)

  expect(parsedProps.maxDecouplingTraceLength).toBe(3)
})

test("accepts documented specification props", () => {
  const rawProps: CapacitorProps = {
    name: "C2",
    capacitance: "100nF",
    tolerance: "10%",
    temperatureCoefficient: "X7R",
    equivalentSeriesResistance: "0.02",
  }

  const parsedProps = capacitorProps.parse(rawProps)

  expect(parsedProps.tolerance).toBeCloseTo(0.1)
  expect(parsedProps.temperatureCoefficient).toBe("X7R")
  expect(parsedProps.equivalentSeriesResistance).toBeCloseTo(0.02)
})
