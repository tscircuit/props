import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"
import { jumperProps } from "lib/components/jumper"
import { solderjumperProps } from "lib/components/solderjumper"
import { pinHeaderProps } from "lib/components/pin-header"

test("Component props should validate showSchematicPinLabels as an optional boolean", () => {
  // Test chipProps
  const chipValidProps = {
    name: "TestChip",
    showSchematicPinLabels: true,
  }
  const chipResult = chipProps.safeParse(chipValidProps)
  expect(chipResult.success).toBe(true)

  // Test jumperProps
  const jumperValidProps = {
    name: "TestJumper",
    showSchematicPinLabels: true,
  }
  const jumperResult = jumperProps.safeParse(jumperValidProps)
  expect(jumperResult.success).toBe(true)

  // Test solderJumperProps
  const solderJumperValidProps = {
    name: "TestSolderJumper",
    showSchematicPinLabels: true,
  }
  const solderJumperResult = solderjumperProps.safeParse(solderJumperValidProps)
  expect(solderJumperResult.success).toBe(true)

  // Test pinHeaderProps
  const pinHeaderValidProps = {
    name: "TestPinHeader",
    pinCount: 5, // Required prop for pin headers
    showSchematicPinLabels: true,
  }
  const pinHeaderResult = pinHeaderProps.safeParse(pinHeaderValidProps)
  expect(pinHeaderResult.success).toBe(true)

  // Test with false value
  const propsWithFalse = {
    name: "TestComponent",
    showSchematicPinLabels: false,
  }
  expect(chipProps.safeParse(propsWithFalse).success).toBe(true)
  expect(jumperProps.safeParse(propsWithFalse).success).toBe(true)
  expect(solderjumperProps.safeParse(propsWithFalse).success).toBe(true)

  // Test without showSchematicPinLabels
  const propsWithoutFlag = {
    name: "TestComponent",
  }
  expect(chipProps.safeParse(propsWithoutFlag).success).toBe(true)
  expect(jumperProps.safeParse(propsWithoutFlag).success).toBe(true)
  expect(solderjumperProps.safeParse(propsWithoutFlag).success).toBe(true)

  // Test with invalid value (should fail)
  const invalidProps = {
    name: "TestComponent",
    showSchematicPinLabels: "true", // String instead of boolean
  }
  expect(chipProps.safeParse(invalidProps).success).toBe(false)
  expect(jumperProps.safeParse(invalidProps).success).toBe(false)
  expect(solderjumperProps.safeParse(invalidProps).success).toBe(false)

  const invalidPinHeaderProps = {
    name: "TestPinHeader",
    pinCount: 5,
    showSchematicPinLabels: "true", // String instead of boolean
  }
  expect(pinHeaderProps.safeParse(invalidPinHeaderProps).success).toBe(false)
})
