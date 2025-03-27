import { expect, test } from "bun:test"
import { diodeProps, type DiodeProps } from "lib/components/diode"
import { z } from "zod"

test("should parse diode props with single string connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "net.VCC",
      cathode: "net.GND",
    },
  }

  const parsedProps = diodeProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: "net.GND",
  })
})

test("should parse diode props with array connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: ["net.VCC", "net.5V"],
      cathode: ["net.GND", "net.0V"],
    },
  }

  const parsedProps = diodeProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    anode: ["net.VCC", "net.5V"],
    cathode: ["net.GND", "net.0V"],
  })
})

test("should parse diode props with mixed string and array connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "net.VCC",
      cathode: ["net.GND", "net.0V"],
    },
  }

  const parsedProps = diodeProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: ["net.GND", "net.0V"],
  })
})

test("should parse diode props with all connection keys", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "net.VCC",
      cathode: "net.GND",
      pin1: "net.PIN1",
      pin2: "net.PIN2",
      pos: "net.POS",
      neg: "net.NEG",
    },
  }
  const parsedProps = diodeProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: "net.GND",
    pin1: "net.PIN1",
    pin2: "net.PIN2",
    pos: "net.POS",
    neg: "net.NEG",
  })
})

test("should reject connections with invalid keys", () => {
  // Demonstrate that invalid keys throw a ZodError
  expect(() => {
    diodeProps.parse({
      name: "diode",
      connections: {
        invalidKey: "net.INVALID", // This should cause a parsing error
        anode: "net.VCC",
      } as unknown as DiodeProps,
    })
  }).toThrow(z.ZodError)
})

test("should handle empty string and array connection values", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "", // Empty string
      cathode: [], // Empty array
    },
  }
  const parsedProps = diodeProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: "",
    cathode: [],
  })
})

test("should allow optional connections", () => {
  const rawProps: DiodeProps = {
    name: "diode",
  }
  const parsedProps = diodeProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})
