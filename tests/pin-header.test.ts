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

test("should parse rightAngle property", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 2,
    rightAngle: true,
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed.rightAngle).toBe(true)
})

test("should parse pcbOrientation property", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 2,
    pcbOrientation: "horizontal",
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed.pcbOrientation).toBe("horizontal")
})

test("should parse pinLabels as array", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 2,
    pinLabels: ["A", "B"],
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed.pinLabels).toEqual(["A", "B"])
})

test("should parse pinLabels as record", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 2,
    pinLabels: { 1: "A", 2: "B" },
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed.pinLabels).toEqual({ 1: "A", 2: "B" })
})

test("should snapshot schematic props for pin header", () => {
  const rawProps: PinHeaderProps = {
    name: "header",
    pinCount: 4,
    schWidth: 10,
    schHeight: 5,
    schPinSpacing: "0.2in",
    schPinStyle: {
      "1": { marginTop: "0.1in" },
      "2": { marginBottom: "0.1in" },
    },
  }
  const parsed = pinHeaderProps.parse(rawProps)
  expect(parsed).toMatchInlineSnapshot(`
    {
      "gender": "male",
      "name": "header",
      "pinCount": 4,
      "schHeight": 5,
      "schPinSpacing": 5.08,
      "schPinStyle": {
        "1": {
          "marginTop": 2.54,
        },
        "2": {
          "marginBottom": 2.54,
        },
      },
      "schWidth": 10,
    }
  `)
})
