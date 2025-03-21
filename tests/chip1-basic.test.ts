import { expect, test } from "bun:test"
import { chipProps, type ChipProps } from "lib/components/chip"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse chip props", () => {
  const rawProps: ChipProps = {
    name: "chip",
    manufacturerPartNumber: "1234",
    pinLabels: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
    },
    schPortArrangement: {
      leftSize: 1,
      topSize: 2,
      rightSize: 3,
      bottomSize: 4,
    },
    schPinSpacing: "0.2mm",
    schWidth: 2,
    noSchematicRepresentation: true,
  }

  const parsedProps = chipProps.parse(rawProps)

  expect(parsedProps.schPinSpacing).toBe(0.2)
  expect(parsedProps.noSchematicRepresentation).toBe(true)
})

// New tests for connections prop
test("should parse chip props with single string connections", () => {
  const rawProps: ChipProps = {
    name: "chip",
    manufacturerPartNumber: "1234",
    connections: {
      1: ".R1 > .pin1",
      VCC: "net.VCC",
      GND: "net.GND",
    },
    noSchematicRepresentation: false,
  }
  const parsedProps = chipProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    1: ".R1 > .pin1",
    VCC: "net.VCC",
    GND: "net.GND",
  })
})

test("should parse chip props with array connections", () => {
  const rawProps: ChipProps = {
    name: "chip",
    manufacturerPartNumber: "1234",
    connections: {
      VCC: ["net.VCC", "net.5V"],
      GND: ["net.GND", "net.0V"],
      1: [".R1 > .pin1", ".C1 > .pin1"],
    },
    noSchematicRepresentation: false,
  }
  const parsedProps = chipProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    VCC: ["net.VCC", "net.5V"],
    GND: ["net.GND", "net.0V"],
    1: [".R1 > .pin1", ".C1 > .pin1"],
  })
})

test("should parse chip props with mixed string and array connections", () => {
  const rawProps: ChipProps = {
    name: "chip",
    manufacturerPartNumber: "1234",
    connections: {
      1: ".R1 > .pin1",
      VCC: ["net.VCC", "net.5V"],
      A4: ".LED1 > .anode",
      GND: ["net.GND"],
    },
    noSchematicRepresentation: false,
  }
  const parsedProps = chipProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    1: ".R1 > .pin1",
    VCC: ["net.VCC", "net.5V"],
    A4: ".LED1 > .anode",
    GND: ["net.GND"],
  })
})

test("should parse chip props with connections and other properties", () => {
  const rawProps: ChipProps = {
    name: "chip",
    manufacturerPartNumber: "1234",
    pinLabels: {
      1: "VCC",
      2: "GND",
      3: "SIG",
    },
    connections: {
      1: "net.VCC",
      2: "net.GND",
      3: [".R1 > .pin1", ".C1 > .pin1"],
    },
    schPortArrangement: {
      leftSide: {
        pins: ["1", "2", "3"],
        direction: "top-to-bottom",
      },
    },
    schPinSpacing: "0.2mm",
    noSchematicRepresentation: false,
  }

  const parsedProps = chipProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    1: "net.VCC",
    2: "net.GND",
    3: [".R1 > .pin1", ".C1 > .pin1"],
  })
  expect(parsedProps.pinLabels).toEqual({
    1: "VCC",
    2: "GND",
    3: "SIG",
  })
  expect((parsedProps.schPortArrangement as any)?.leftSide.pins).toEqual([
    "1",
    "2",
    "3",
  ])
})

test("should handle invalid connection values", () => {
  const rawProps: ChipProps = {
    name: "chip",
    connections: {
      1: "", // Empty string
      2: [], // Empty array
      3: [""], // Array with empty string
    },
  }

  expect(() => chipProps.parse(rawProps)).not.toThrow()
})

// Test for generic type parameter
test("should work with generic type parameter for pin labels", () => {
  // Define a type with specific pin labels
  type MyChipPins = "VCC" | "GND" | "SIG1" | "SIG2"

  const rawProps: ChipProps<MyChipPins> = {
    name: "chip",
    pinLabels: {
      VCC: "Power",
      GND: "Ground",
      SIG1: "Signal 1",
      SIG2: "Signal 2",
    },
    connections: {
      VCC: "net.VCC",
      GND: "net.GND",
      SIG1: ".R1 > .pin1",
      SIG2: [".LED1 > .anode", ".C1 > .pin1"],
    },
  }

  const parsedProps = chipProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    VCC: "net.VCC",
    GND: "net.GND",
    SIG1: ".R1 > .pin1",
    SIG2: [".LED1 > .anode", ".C1 > .pin1"],
  })
})
