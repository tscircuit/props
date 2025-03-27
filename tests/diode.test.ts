import { expect, test } from "bun:test"
import { diodeProps, type DiodeProps } from "lib/components/diode"

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

test("should handle invalid connection values for diode", () => {
  const rawProps: DiodeProps = {
    name: "diode",
    connections: {
      anode: "", // Empty string
      cathode: [], // Empty array
    },
  }

  expect(() => diodeProps.parse(rawProps)).not.toThrow()
})
