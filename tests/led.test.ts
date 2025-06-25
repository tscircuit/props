import { expect, test } from "bun:test"
import { ledProps, type LedProps } from "lib/components/led"
import { z } from "zod"

test("should parse led props with single string connections", () => {
  const rawProps: LedProps = {
    name: "led",
    connections: {
      anode: "net.VCC",
      cathode: "net.GND",
    },
  }
  const parsedProps = ledProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: "net.GND",
  })
})

test("should parse led props with array connections", () => {
  const rawProps: LedProps = {
    name: "led",
    connections: {
      anode: ["net.VCC", "net.5V"],
      cathode: ["net.GND", "net.0V"],
    },
  }
  const parsedProps = ledProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: ["net.VCC", "net.5V"],
    cathode: ["net.GND", "net.0V"],
  })
})

test("should parse led props with all connection keys", () => {
  const rawProps: LedProps = {
    name: "led",
    connections: {
      anode: "net.VCC",
      cathode: "net.GND",
      pin1: "net.PIN1",
      pin2: "net.PIN2",
      pos: "net.POS",
      neg: "net.NEG",
      left: "net.LEFT",
      right: "net.RIGHT",
    },
  }
  const parsedProps = ledProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: "net.VCC",
    cathode: "net.GND",
    pin1: "net.PIN1",
    pin2: "net.PIN2",
    pos: "net.POS",
    neg: "net.NEG",
    left: "net.LEFT",
    right: "net.RIGHT",
  })
})

test("should reject connections with invalid keys", () => {
  expect(() => {
    ledProps.parse({
      name: "led",
      connections: {
        invalidKey: "net.INVALID",
        anode: "net.VCC",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should handle empty string and array connection values", () => {
  const rawProps: LedProps = {
    name: "led",
    connections: {
      anode: "",
      cathode: [],
    },
  }
  const parsedProps = ledProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    anode: "",
    cathode: [],
  })
})

test("should allow optional connections", () => {
  const rawProps: LedProps = {
    name: "led",
  }
  const parsedProps = ledProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})
