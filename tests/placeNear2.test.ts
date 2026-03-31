import { expect, test } from "bun:test"
import { resistorProps, type ResistorProps } from "lib/components/resistor"

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
