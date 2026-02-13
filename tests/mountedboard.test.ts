import { z } from "zod"
import { expect, test } from "bun:test"
import { mountedboardProps } from "lib/components/mountedboard"

test("should parse footprint and common layout props", () => {
  const raw: z.input<typeof mountedboardProps> = {
    name: "carrier",
    footprint: "soic8",
    pcbX: 10,
    pcbY: "2mm",
  }

  const parsed = mountedboardProps.parse(raw)

  expect(parsed.footprint).toBe("soic8")
  expect(parsed.pcbX).toBe(10)
  expect(parsed.pcbY).toBe(2)
})

test("should parse chip-compatible props", () => {
  const raw: z.input<typeof mountedboardProps> = {
    name: "module",
    pinLabels: {
      pin1: "VCC",
      pin2: "GND",
    },
    showPinAliases: true,
    pcbPinLabels: {
      pin1: "1",
      pin2: "2",
    },
    manufacturerPartNumber: "MOD-123",
    internallyConnectedPins: [["pin1", "pin2"]],
    externallyConnectedPins: [["pin1", "J1.1"]],
    noSchematicRepresentation: true,
    schPortArrangement: {
      leftSide: {
        direction: "top-to-bottom",
        pins: ["pin1"],
      },
      rightSide: {
        direction: "top-to-bottom",
        pins: ["pin2"],
      },
    },
    pinCompatibleVariants: [
      {
        manufacturerPartNumber: "MOD-123-ALT",
      },
    ],
  }

  const parsed = mountedboardProps.parse(raw)

  expect(parsed.pinLabels?.pin1).toBe("VCC")
  expect(parsed.showPinAliases).toBe(true)
  expect(parsed.pcbPinLabels?.pin2).toBe("2")
  expect(parsed.manufacturerPartNumber).toBe("MOD-123")
  expect(parsed.internallyConnectedPins).toEqual([["pin1", "pin2"]])
  expect(parsed.externallyConnectedPins).toEqual([["pin1", "J1.1"]])
  expect(parsed.noSchematicRepresentation).toBe(true)
  expect(parsed.schPortArrangement?.leftSide?.pins).toEqual(["pin1"])
  expect(parsed.pinCompatibleVariants?.[0]?.manufacturerPartNumber).toBe(
    "MOD-123-ALT",
  )
})
