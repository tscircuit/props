import { expect, test } from "bun:test"
import {
  type LightDependentResistorProps,
  lightDependentResistorProps,
} from "lib/components/ldr"
import { z } from "zod"

// Test resistance parsing
test("should parse darkResistance and lightResistance as numbers", () => {
  const raw: LightDependentResistorProps = {
    name: "LDR1",
    darkResistance: 1000000, // 1M ohm in dark
    lightResistance: 1000, // 1k ohm in light
  }
  const parsed = lightDependentResistorProps.parse(raw)
  expect(parsed.darkResistance).toBe(1000000)
  expect(parsed.lightResistance).toBe(1000)
})

test("should parse darkResistance and lightResistance as strings", () => {
  const raw: LightDependentResistorProps = {
    name: "LDR1",
    darkResistance: "1M",
    lightResistance: "1k",
  }
  const parsed = lightDependentResistorProps.parse(raw)
  expect(parsed.darkResistance).toBe(1000000)
  expect(parsed.lightResistance).toBe(1000)
})

test("should allow optional darkResistance and lightResistance", () => {
  const raw: LightDependentResistorProps = {
    name: "LDR1",
  }
  const parsed = lightDependentResistorProps.parse(raw)
  expect(parsed.darkResistance).toBeUndefined()
  expect(parsed.lightResistance).toBeUndefined()
})

// Test schematic props
test("should parse schOrientation for ldr", () => {
  const raw: LightDependentResistorProps = {
    name: "LDR1",
    schOrientation: "vertical",
  }
  const parsed = lightDependentResistorProps.parse(raw)
  expect(parsed.schOrientation).toBe("vertical")
})

test("should parse schSize for ldr", () => {
  const raw: LightDependentResistorProps = {
    name: "LDR1",
    schSize: 10,
  }
  const parsed = lightDependentResistorProps.parse(raw)
  expect(parsed.schSize).toBe(10)
})

// Test connection handling
test("should parse ldr props with single string connections", () => {
  const rawProps: LightDependentResistorProps = {
    name: "LDR1",
    connections: {
      pin1: "net.A",
      pin2: "net.B",
    },
  }
  const parsedProps = lightDependentResistorProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: "net.A",
    pin2: "net.B",
  })
})

test("should parse ldr props with array connections", () => {
  const rawProps: LightDependentResistorProps = {
    name: "LDR1",
    connections: {
      pin1: ["net.A", "net.A2"],
      pin2: ["net.B", "net.B2"],
    },
  }
  const parsedProps = lightDependentResistorProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: ["net.A", "net.A2"],
    pin2: ["net.B", "net.B2"],
  })
})

test("should parse ldr props with all connection keys", () => {
  const rawProps: LightDependentResistorProps = {
    name: "LDR1",
    connections: {
      pin1: "net.PIN1",
      pin2: "net.PIN2",
      pos: "net.POS",
      neg: "net.NEG",
    },
  }
  const parsedProps = lightDependentResistorProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: "net.PIN1",
    pin2: "net.PIN2",
    pos: "net.POS",
    neg: "net.NEG",
  })
})

test("should reject connections with invalid keys", () => {
  expect(() => {
    lightDependentResistorProps.parse({
      name: "LDR1",
      connections: {
        invalid: "net.INVALID",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should handle empty string and array connection values", () => {
  const rawProps: LightDependentResistorProps = {
    name: "LDR1",
    connections: {
      pin1: "",
      pin2: [],
    },
  }
  const parsedProps = lightDependentResistorProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: "",
    pin2: [],
  })
})

test("should allow optional connections", () => {
  const rawProps: LightDependentResistorProps = {
    name: "LDR1",
  }
  const parsedProps = lightDependentResistorProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})

// Test mixed props
test("should parse ldr with all props combined", () => {
  const rawProps: LightDependentResistorProps = {
    name: "LDR1",
    darkResistance: "1M",
    lightResistance: 1000,
    schOrientation: "horizontal",
    schSize: 5,
    connections: {
      pos: "net.VCC",
      neg: "net.GND",
    },
  }
  const parsedProps = lightDependentResistorProps.parse(rawProps)
  expect(parsedProps.darkResistance).toBe(1000000)
  expect(parsedProps.lightResistance).toBe(1000)
  expect(parsedProps.schOrientation).toBe("horizontal")
  expect(parsedProps.schSize).toBe(5)
  expect(parsedProps.connections).toEqual({
    pos: "net.VCC",
    neg: "net.GND",
  })
})
