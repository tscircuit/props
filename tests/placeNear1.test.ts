import { expect, test } from "bun:test"
import { capacitorProps, type CapacitorProps } from "lib/components/capacitor"

test("should parse placeNear on a capacitor", () => {
  const raw: CapacitorProps = {
    name: "C1",
    capacitance: "100nF",
    placeNear: "U1.VCC",
    facingPad: ".pin1",
    placeNearMaxDistance: "2mm",
  }
  const parsed = capacitorProps.parse(raw)
  expect(parsed.placeNear).toBe("U1.VCC")
  expect(parsed.facingPad).toBe(".pin1")
  expect(parsed.placeNearMaxDistance).toBeCloseTo(2)
})
