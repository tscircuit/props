import { expect, test } from "bun:test"
import { resistorProps, type ResistorProps } from "../lib/components/resistor"
import { expectTypeOf } from "expect-type"

test("should parse resistor props with standard values", () => {
  const rawProps: ResistorProps = {
    name: "resistor1",
    resistance: 10000,
  }
  const parsedProps = resistorProps.parse(rawProps)
  expect(parsedProps.resistance).toBe(10000)
  expect(parsedProps.ptc).toBeUndefined()
  expect(parsedProps.ntc).toBeUndefined()
})

test("should parse resistor props with PTC", () => {
  const rawProps: ResistorProps = {
    name: "ptc_resistor",
    resistance: 100,
    ptc: true,
  }
  const parsedProps = resistorProps.parse(rawProps)
  expect(parsedProps.resistance).toBe(100)
  expect(parsedProps.ptc).toBe(true)
  expect(parsedProps.ntc).toBeUndefined()
})

test("should parse resistor props with NTC", () => {
  const rawProps: ResistorProps = {
    name: "ntc_resistor",
    resistance: 5000,
    ntc: true,
  }
  const parsedProps = resistorProps.parse(rawProps)
  expect(parsedProps.resistance).toBe(5000)
  expect(parsedProps.ntc).toBe(true)
  expect(parsedProps.ptc).toBeUndefined()
})

test("should parse resistor props with pullup settings", () => {
  const rawProps: ResistorProps = {
    name: "pullup_resistor",
    resistance: 4700,
    pullupFor: "inputPin",
    pullupTo: "VCC",
  }
  const parsedProps = resistorProps.parse(rawProps)
  expect(parsedProps.resistance).toBe(4700)
  expect(parsedProps.pullupFor).toBe("inputPin")
  expect(parsedProps.pullupTo).toBe("VCC")
})

test("should enforce correct types for resistor props", () => {
  const rawProps: ResistorProps = {
    name: "test_resistor",
    resistance: 1000,
    ptc: false,
    ntc: true,
  }
  expectTypeOf(rawProps).toMatchTypeOf<ResistorProps>()
})
