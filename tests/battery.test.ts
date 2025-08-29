import { expect, test } from "bun:test"
import { batteryProps, type BatteryProps } from "lib/components/battery"

test("should parse voltage and standard for battery", () => {
  const raw: BatteryProps = {
    name: "bat1",
    voltage: "9V",
    standard: "9V",
  }
  const parsed = batteryProps.parse(raw)
  expect(parsed.voltage).toBe(9)
  expect(parsed.standard).toBe("9V")
})

test("should fail with invalid standard", () => {
  const raw = { name: "bat2", standard: "invalid" } as any
  expect(() => batteryProps.parse(raw)).toThrow()
})
