import { expect, test } from "bun:test"
import {
  chipProps,
  type ChipProps,
  type ConnectionTarget,
} from "lib/components/chip"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse chip props (number)", () => {
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
      leftSide: {
        pins: [29, 7, 8, 20, 19, 22],
        direction: "top-to-bottom",
      },
      topSide: {
        direction: "left-to-right",
        pins: [4, 18],
      },
      rightSide: {
        direction: "bottom-to-top",
        pins: [12, 13, 14, 15, 16, 17, 23],
      },
    },
    schPinSpacing: "0.2mm",
    schWidth: 2,
    noSchematicRepresentation: false, // Add this line
  }

  const parsedProps = chipProps.parse(rawProps)

  expect((parsedProps.schPortArrangement as any)?.leftSide.pins).toEqual([
    29, 7, 8, 20, 19, 22,
  ])
  expect(parsedProps.noSchematicRepresentation).toBe(false)
})

test("should parse chip props (string)", () => {
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
      leftSide: {
        pins: ["29", "7", "8", "20", "19", "22"],
        direction: "top-to-bottom",
      },
      topSide: {
        direction: "left-to-right",
        pins: ["A4", "B18"],
      },
    },
    schPinSpacing: "0.2mm",
    schWidth: 2,
    noSchematicRepresentation: false, // Add this line
  }

  const parsedProps = chipProps.parse(rawProps)

  expect((parsedProps.schPortArrangement as any)?.topSide.pins).toEqual([
    "A4",
    "B18",
  ])
  expect(parsedProps.noSchematicRepresentation).toBe(false)
})

// Test with generic type parameter
test("should work with string literal pin labels", () => {
  type PinLabels = "CLK" | "RST" | "DATA" | "VCC" | "GND"

  const rawProps: ChipProps<PinLabels> = {
    name: "chip",
    manufacturerPartNumber: "1234",
    pinLabels: {
      CLK: "Clock",
      RST: "Reset",
      DATA: "Data",
      VCC: "Power",
      GND: "Ground",
    },
    schPortArrangement: {
      leftSide: {
        pins: ["CLK", "RST", "DATA"],
        direction: "top-to-bottom",
      },
      rightSide: {
        pins: ["VCC", "GND"],
        direction: "top-to-bottom",
      },
    },
    schPinSpacing: "0.2mm",
    schWidth: 2,
    connections: {
      CLK: "net1",
      RST: "net2",
      DATA: "net3",
      VCC: "VCC",
      GND: "GND",
    },
  }

  const parsedProps = chipProps.parse(rawProps)
  expect(parsedProps.pinLabels).toEqual({
    CLK: "Clock",
    RST: "Reset",
    DATA: "Data",
    VCC: "Power",
    GND: "Ground",
  })

  // Type tests for connections
  // The following line is a type test - it should compile
  // because CLK is a valid key in the connections object
  const clkConnection: ConnectionTarget = rawProps.connections!.CLK!

  // The following line should not compile because DOES_NOT_EXIST
  // is not a valid key in the connections object
  // @ts-expect-error
  const invalidConnection = rawProps.connections!.DOES_NOT_EXIST
})
