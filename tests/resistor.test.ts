import { expect, test } from "bun:test"
import { resistorProps, type ResistorProps } from "lib/components/resistor"

test("should parse schOrientation for resistor", () => {
  const raw: ResistorProps = {
    name: "R1",
    resistance: 1000,
    schOrientation: "vertical",
  }

  const parsed = resistorProps.parse(raw)
  expect(parsed.schOrientation).toBe("vertical")
})
