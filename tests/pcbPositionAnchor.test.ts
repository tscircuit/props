import { expect, test } from "bun:test"
import { resistorProps, type ResistorProps } from "lib/components/resistor"

test("pcbPositionAnchor defaults allow padcenter", () => {
  const raw: ResistorProps = {
    name: "R1",
    resistance: 1000,
    pcbPositionAnchor: "padcenter",
  }
  const parsed = resistorProps.parse(raw)
  expect(parsed.pcbPositionAnchor).toBe("padcenter")
})

test("pcbPositionAnchor accepts arbitrary strings", () => {
  const raw: ResistorProps = {
    name: "R1",
    resistance: 1000,
    pcbPositionAnchor: "pin1",
  }
  const parsed = resistorProps.parse(raw)
  expect(parsed.pcbPositionAnchor).toBe("pin1")
})
