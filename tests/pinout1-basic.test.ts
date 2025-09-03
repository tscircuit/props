import { expect, test } from "bun:test"
import { pinoutProps, type PinoutProps } from "lib/components/pinout"

test("should parse pinout props", () => {
  const rawProps: PinoutProps = {
    name: "pinout",
    pinLabels: {
      1: "VCC",
      2: "GND",
    },
    connections: {
      1: "net.VCC",
      2: "net.GND",
    },
  }

  const parsedProps = pinoutProps.parse(rawProps)
  expect(parsedProps.pinLabels).toEqual({ 1: "VCC", 2: "GND" })
  expect(parsedProps.connections).toEqual({ 1: "net.VCC", 2: "net.GND" })
})
