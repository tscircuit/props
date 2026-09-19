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

test("parses tolerance percentage string and plus-minus prefix", () => {
  const propsWithPlusMinus: CapacitorProps = {
    name: "C1",
    capacitance: "100nF",
    footprint: "0402",
    tolerance: "±10%",
  }
  const parsed = capacitorProps.parse(propsWithPlusMinus)
  expect(parsed.tolerance).toBeCloseTo(0.1)

  const propsWithPercent: CapacitorProps = {
    name: "C1",
    capacitance: "100nF",
    tolerance: "5%",
  }
  expect(capacitorProps.parse(propsWithPercent).tolerance).toBeCloseTo(0.05)

  const propsWithDecimal: CapacitorProps = {
    name: "C1",
    capacitance: "100nF",
    tolerance: 0.1,
  }
  expect(capacitorProps.parse(propsWithDecimal).tolerance).toBeCloseTo(0.1)
})

test("parses temperatureCoefficient specification", () => {
  const rawProps: CapacitorProps = {
    name: "C2",
    capacitance: "100nF",
    footprint: "0402",
    temperatureCoefficient: "X7R",
  }

  const parsed = capacitorProps.parse(rawProps)
  expect(parsed.temperatureCoefficient).toBe("X7R")
})

test("parses equivalentSeriesResistance with unit strings or numbers", () => {
  const rawProps: CapacitorProps = {
    name: "C3",
    capacitance: "100nF",
    footprint: "0402",
    equivalentSeriesResistance: "0.5Ω",
  }

  const parsed = capacitorProps.parse(rawProps)
  expect(parsed.equivalentSeriesResistance).toBe(0.5)

  const propsWithOhms: CapacitorProps = {
    name: "C3",
    capacitance: "100nF",
    equivalentSeriesResistance: "0.5ohm",
  }
  expect(capacitorProps.parse(propsWithOhms).equivalentSeriesResistance).toBe(
    0.5,
  )

  const propsWithNumber: CapacitorProps = {
    name: "C3",
    capacitance: "100nF",
    equivalentSeriesResistance: 0.5,
  }
  expect(capacitorProps.parse(propsWithNumber).equivalentSeriesResistance).toBe(
    0.5,
  )
})
