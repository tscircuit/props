import { expect, test } from "bun:test"
import { capacitorProps } from "lib/components/capacitor"
import { resistorProps } from "lib/components/resistor"

test("named schSize tokens survive parse instead of becoming NaN", () => {
  const namedSizes = ["xs", "sm", "small", "default", "md", "normal"] as const

  for (const schSize of namedSizes) {
    const capacitor = capacitorProps.parse({
      name: "C1",
      capacitance: "1uF",
      schSize,
    })
    expect(capacitor.schSize).toBe(schSize)

    const resistor = resistorProps.parse({
      name: "R1",
      resistance: "1k",
      schSize,
    })
    expect(resistor.schSize).toBe(schSize)
  }
})

test("numeric schSize distances still parse to millimeters", () => {
  const parsed = capacitorProps.parse({
    name: "C1",
    capacitance: "1uF",
    schSize: "0.5mm",
  })

  expect(parsed.schSize).toBe(0.5)
})
