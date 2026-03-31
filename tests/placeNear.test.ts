import { expect, test } from "bun:test"
import { capacitorProps, type CapacitorProps } from "lib/components/capacitor"
import { resistorProps, type ResistorProps } from "lib/components/resistor"
import { commonLayoutProps } from "lib/common/layout"

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

test("should parse placeNear on a resistor", () => {
  const raw: ResistorProps = {
    name: "R1",
    resistance: "1k",
    placeNear: ".LED > .pos",
    facingPad: ".pin1",
  }
  const parsed = resistorProps.parse(raw)
  expect(parsed.placeNear).toBe(".LED > .pos")
  expect(parsed.facingPad).toBe(".pin1")
  expect(parsed.placeNearMaxDistance).toBeUndefined()
})

test("should parse placeNearMaxDistance as a number (meters)", () => {
  const parsed = commonLayoutProps.parse({
    placeNear: "U1.pin17",
    placeNearMaxDistance: 0.005,
  })
  expect(parsed.placeNear).toBe("U1.pin17")
  expect(parsed.placeNearMaxDistance).toBeCloseTo(0.005)
})

test("should allow placeNear without facingPad", () => {
  const parsed = commonLayoutProps.parse({ placeNear: "U1.VCC" })
  expect(parsed.placeNear).toBe("U1.VCC")
  expect(parsed.facingPad).toBeUndefined()
})

test("capacitor decouplingFor and placeNear can coexist", () => {
  const raw: CapacitorProps = {
    name: "C1",
    capacitance: "100nF",
    decouplingFor: "U1.VCC",
    decouplingTo: "C1.pin1",
    placeNear: "U1.VCC",
    facingPad: ".pin1",
  }
  const parsed = capacitorProps.parse(raw)
  expect(parsed.decouplingFor).toBe("U1.VCC")
  expect(parsed.placeNear).toBe("U1.VCC")
})
