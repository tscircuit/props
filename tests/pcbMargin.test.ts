import { expect, test } from "bun:test"
import { batteryProps, type BatteryProps } from "lib/components/battery"

test("should parse pcbMargin props", () => {
  const raw: BatteryProps = {
    name: "bat1",
    pcbMarginTop: "1mm",
    pcbMarginRight: "2mm",
    pcbMarginBottom: 3,
    pcbMarginLeft: "4mm",
    pcbMarginX: "5mm",
    pcbMarginY: 6,
  }
  const parsed = batteryProps.parse(raw)
  expect(parsed.pcbMarginTop).toBe(1)
  expect(parsed.pcbMarginRight).toBe(2)
  expect(parsed.pcbMarginBottom).toBe(3)
  expect(parsed.pcbMarginLeft).toBe(4)
  expect(parsed.pcbMarginX).toBe(5)
  expect(parsed.pcbMarginY).toBe(6)
})
