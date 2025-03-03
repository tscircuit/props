import { expect, test } from "bun:test"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"
import {
  chipProps,
  type ChipProps,
  type Connections,
} from "lib/components/chip"

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

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof chipProps>>()

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

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof chipProps>>()
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

test("should support generic pin labels for type safety", () => {
  type MyPinLabels = "VCC" | "GND" | "DATA" | "CLK"

  const typedChip: ChipProps<MyPinLabels> = {
    name: "typed-chip",
    manufacturerPartNumber: "TST123",
    connections: {
      VCC: "net.power",
      GND: "net.ground",
      DATA: [".MCU > .pin7", ".EEPROM > .pin3"],
      CLK: ".MCU > .pin8",
      // Numeric pins are still valid
      1: "net.misc",
    },
  }

  const parsedChip = chipProps.parse(typedChip)

  expect(parsedChip.connections).toEqual({
    VCC: "net.power",
    GND: "net.ground",
    DATA: [".MCU > .pin7", ".EEPROM > .pin3"],
    CLK: ".MCU > .pin8",
    1: "net.misc",
  })

  expectTypeOf(typedChip).toMatchTypeOf<ChipProps<MyPinLabels>>()

  expectTypeOf(typedChip).toMatchTypeOf<Parameters<typeof chipProps.parse>[0]>()
})

test("should maintain backward compatibility with non-generic usage", () => {
  const legacyChip: ChipProps = {
    name: "legacy-chip",
    connections: {
      VCC: "net.power",
      GND: "net.ground",
      DATA: [".MCU > .pin7"],
      SIG: ".INPUT > .pin1",
      5: "net.reset",
    },
  }

  const parsedLegacy = chipProps.parse(legacyChip)
  expect(parsedLegacy.connections).toEqual({
    VCC: "net.power",
    GND: "net.ground",
    DATA: [".MCU > .pin7"],
    SIG: ".INPUT > .pin1",
    5: "net.reset",
  })
})

test("should properly type check the connections property with generic PinLabel", () => {
  type MCUPins = "TX" | "RX" | "MOSI" | "MISO" | "SCK" | "RESET"

  const mcuChip: ChipProps<MCUPins> = {
    name: "mcu-chip",
    connections: {
      TX: ".UART > .RX",
      RX: ".UART > .TX",
      MOSI: ".SPI > .DI",
      MISO: ".SPI > .DO",
      SCK: ".SPI > .CLK",
      RESET: "net.reset",
      1: "net.misc",
    },
  }

  expectTypeOf<typeof mcuChip.connections>().toMatchTypeOf<
    Connections<MCUPins> | undefined
  >()

  type ZodConnectionsType = z.infer<typeof chipProps>["connections"]
  expectTypeOf<Connections<MCUPins>>().toMatchTypeOf<ZodConnectionsType>()
})

test("should enforce type safety for Connections type", () => {
  type CustomPins = "IN" | "OUT" | "EN"

  const validConnections: Connections<CustomPins> = {
    IN: "net.input",
    OUT: ["net.output1", "net.output2"],
    EN: ".control > .enable",
    1: "net.misc",
  }

  expectTypeOf(validConnections).toMatchTypeOf<Connections<CustomPins>>()
})
