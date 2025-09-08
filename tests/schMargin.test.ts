import { expect, test } from "bun:test"
import { batteryProps, type BatteryProps } from "lib/components/battery"

test("should parse schMargin props", () => {
  const raw: BatteryProps = {
    name: "bat1",
    schMarginTop: "1mm",
    schMarginRight: "2mm",
    schMarginBottom: 3,
    schMarginLeft: "4mm",
    schMarginX: "5mm",
    schMarginY: 6,
  }
  const parsed = batteryProps.parse(raw)
  expect(parsed.schMarginTop).toBe(1)
  expect(parsed.schMarginRight).toBe(2)
  expect(parsed.schMarginBottom).toBe(3)
  expect(parsed.schMarginLeft).toBe(4)
  expect(parsed.schMarginX).toBe(5)
  expect(parsed.schMarginY).toBe(6)
})
