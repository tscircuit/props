import { expect, test } from "bun:test"
import { pinHeaderProps, type PinHeaderProps } from "lib/components/pin-header"

// Ensure connections prop parses with simple string targets

test("should parse pin header props with single string connections", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 2,
    connections: {
      1: "net.VCC",
      2: "net.GND",
    },
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    1: "net.VCC",
    2: "net.GND",
  })
})

// Ensure array connections also parse

test("should parse pin header props with array connections", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 2,
    connections: {
      1: ["net.VCC", "net.POWER"],
      2: ["net.GND"],
    },
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    1: ["net.VCC", "net.POWER"],
    2: ["net.GND"],
  })
})

// Connections should be optional

test("should allow optional connections", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 2,
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed.connections).toBeUndefined()
})
