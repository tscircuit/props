import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"
import { jumperProps } from "lib/components/jumper"
import { solderjumperProps } from "lib/components/solderjumper"
import { pinHeaderProps } from "lib/components/pin-header"

test("Component props should validate pcbPinLabels as an optional object", () => {
  // Test chipProps
  const chipValidProps = {
    name: "TestChip",
    pcbPinLabels: { pin1: "A", pin2: "B", pin3: "C" },
  }
  const chipResult = chipProps.safeParse(chipValidProps)
  expect(chipResult.success).toBe(true)

  // Test jumperProps
  const jumperValidProps = {
    name: "TestJumper",
    pcbPinLabels: { pin1: "A", pin2: "B" },
  }
  const jumperResult = jumperProps.safeParse(jumperValidProps)
  expect(jumperResult.success).toBe(true)

  // Test solderJumperProps
  const solderJumperValidProps = {
    name: "TestSolderJumper",
    pcbPinLabels: { pin1: "A", pin2: "B" },
  }
  const solderJumperResult = solderjumperProps.safeParse(solderJumperValidProps)
  expect(solderJumperResult.success).toBe(true)

  // Test pinHeaderProps
  const pinHeaderValidProps = {
    name: "TestPinHeader",
    pinCount: 5, // Required prop for pin headers
    pcbPinLabels: { pin1: "VCC", pin2: "GND", pin3: "DATA" },
  }
  const pinHeaderResult = pinHeaderProps.safeParse(pinHeaderValidProps)
  expect(pinHeaderResult.success).toBe(true)

  // Test with empty object
  const propsWithEmptyObject = {
    name: "TestComponent",
    pcbPinLabels: {},
  }
  expect(chipProps.safeParse(propsWithEmptyObject).success).toBe(true)
  expect(jumperProps.safeParse(propsWithEmptyObject).success).toBe(true)
  expect(solderjumperProps.safeParse(propsWithEmptyObject).success).toBe(true)

  // Test without pcbPinLabels
  const propsWithoutLabels = {
    name: "TestComponent",
  }
  expect(chipProps.safeParse(propsWithoutLabels).success).toBe(true)
  expect(jumperProps.safeParse(propsWithoutLabels).success).toBe(true)
  expect(solderjumperProps.safeParse(propsWithoutLabels).success).toBe(true)

  // Test with invalid value (should fail)
  const invalidProps = {
    name: "TestComponent",
    pcbPinLabels: "invalid", // String instead of object
  }
  expect(chipProps.safeParse(invalidProps).success).toBe(false)
  expect(jumperProps.safeParse(invalidProps).success).toBe(false)
  expect(solderjumperProps.safeParse(invalidProps).success).toBe(false)

  const invalidPinHeaderProps = {
    name: "TestPinHeader",
    pinCount: 5,
    pcbPinLabels: "invalid", // String instead of object
  }
  expect(pinHeaderProps.safeParse(invalidPinHeaderProps).success).toBe(false)
})
