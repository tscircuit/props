import { expect, test } from "bun:test"
import { commonComponentProps } from "lib/common/layout"

test("commonComponentProps should validate showSchematicPinLabels as an optional boolean", () => {
  // Should pass with showSchematicPinLabels: true
  const validProps = {
    name: "TestComponent",
    showSchematicPinLabels: true,
  }
  const result = commonComponentProps.safeParse(validProps)
  expect(result.success).toBe(true)

  // Should pass with showSchematicPinLabels: false
  const validProps2 = {
    name: "TestComponent",
    showSchematicPinLabels: false,
  }
  const result2 = commonComponentProps.safeParse(validProps2)
  expect(result2.success).toBe(true)

  // Should pass without showSchematicPinLabels
  const validProps3 = {
    name: "TestComponent",
  }
  const result3 = commonComponentProps.safeParse(validProps3)
  expect(result3.success).toBe(true)

  // Should fail with non-boolean showSchematicPinLabels
  const invalidProps = {
    name: "TestComponent",
    showSchematicPinLabels: "true", // String instead of boolean
  }
  const result4 = commonComponentProps.safeParse(invalidProps)
  expect(result4.success).toBe(false)
})
