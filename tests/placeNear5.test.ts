import { expect, test } from "bun:test"
import { capacitorProps, type CapacitorProps } from "lib/components/capacitor"

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
