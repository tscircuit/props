import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"
import { connectorProps } from "lib/components/connector"
import { jumperProps } from "lib/components/jumper"
import { pinHeaderProps } from "lib/components/pin-header"

test("Schematic pinLabels should reject labels with invalid characters", () => {
  const invalidChip = {
    name: "chip",
    pinLabels: { 1: "A-B" },
  }
  expect(chipProps.safeParse(invalidChip).success).toBe(false)

  const invalidConnector = {
    name: "conn",
    pinLabels: { 1: "A-B" },
  }
  expect(connectorProps.safeParse(invalidConnector).success).toBe(false)

  const invalidJumper = {
    name: "jump",
    pinLabels: { 1: "A-B" },
  }
  expect(jumperProps.safeParse(invalidJumper).success).toBe(false)

  const invalidHeader = {
    name: "hdr",
    pinCount: 2,
    pinLabels: ["A-B"],
  }
  expect(pinHeaderProps.safeParse(invalidHeader).success).toBe(false)
})
