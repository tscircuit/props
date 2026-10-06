import { expect, test } from "bun:test"
import { pcbNoteDimensionProps } from "lib/components/pcb-note-dimension"

const endpoints = { from: { x: 0, y: 0 }, to: { x: 4, y: 0 } }

test("PCB note dimension offsets preserve unitless directions", () => {
  const parsed = pcbNoteDimensionProps.parse({
    ...endpoints,
    offset: "0.25in",
    offsetDirection: { x: 1, y: -1 },
  })
  expect(parsed.offset).toBeCloseTo(6.35)
  expect(parsed.offsetDirection).toEqual({ x: 1, y: -1 })
  expect(pcbNoteDimensionProps.parse(endpoints).offsetDirection).toBeUndefined()
  expect(
    pcbNoteDimensionProps.safeParse({
      ...endpoints,
      offsetDirection: { x: "1mm", y: 0 },
    }).success,
  ).toBe(false)
})
