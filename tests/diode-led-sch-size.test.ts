import { expect, test } from "bun:test"
import { diodeProps, type DiodeProps } from "lib/components/diode"
import { ledProps, type LedProps } from "lib/components/led"

test("diodes and LEDs accept the existing schematic symbol size API", () => {
  for (const schSize of ["sm", "xs", "default", "md", 0.5, "0.1in"] as const) {
    const diode: DiodeProps = { name: "D1", variant: "zener", schSize }
    const led: LedProps = { name: "LED1", schSize }
    const expected = schSize === "0.1in" ? 2.54 : schSize
    expect(diodeProps.parse(diode).schSize).toEqual(expected)
    expect(diodeProps.parse(diode).zener).toBe(true)
    expect(ledProps.parse(led).schSize).toEqual(expected)
  }
  for (const schema of [diodeProps, ledProps]) {
    expect(schema.parse({ name: "D1" }).schSize).toBeUndefined()
    expect(schema.safeParse({ name: "D1", schSize: "large" }).success).toBe(
      false,
    )
  }
})
