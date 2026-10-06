import { expect, test } from "bun:test"
import { fabricationNoteDimensionProps } from "lib/components/fabrication-note-dimension"

const endpoints = { from: { x: 0, y: 0 }, to: { x: 4, y: 0 } }

test("dimension offsets parse distance units and preserve unitless directions", () => {
  const parsed = fabricationNoteDimensionProps.parse({
    ...endpoints,
    offset: "0.5in",
    offsetDirection: { x: 0, y: -1 },
  })
  expect(parsed.offset).toBeCloseTo(12.7)
  expect(parsed.offsetDirection).toEqual({ x: 0, y: -1 })
  expect(
    fabricationNoteDimensionProps.parse(endpoints).offsetDirection,
  ).toBeUndefined()
  expect(
    fabricationNoteDimensionProps.parse({ ...endpoints, offset: 0 }).offset,
  ).toBe(0)
  expect(
    fabricationNoteDimensionProps.safeParse({
      ...endpoints,
      offsetDirection: { x: "1mm", y: 0 },
    }).success,
  ).toBe(false)
})
