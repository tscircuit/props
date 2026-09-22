import { expect, test } from "bun:test"
import { pcbBendProps, type PcbBendProps } from "lib"

const bend = {
  name: "B1",
  x1: 0,
  y1: "-1cm",
  x2: 0,
  y2: "10mm",
  bendAngle: "-90deg",
  bendRadius: "0.3cm",
  bendSide: "right",
} satisfies PcbBendProps

test("bend normalizes coordinates, radius and signed angles", () => {
  expect(pcbBendProps.parse(bend)).toEqual({
    ...bend,
    y1: -10,
    y2: 10,
    bendAngle: -90,
    bendRadius: 3,
  })
  expect(
    pcbBendProps.parse({ ...bend, bendAngle: `${Math.PI / 2}rad` }).bendAngle,
  ).toBeCloseTo(90)
  expect(
    pcbBendProps.parse({ ...bend, bendAngle: 0, bendSide: "left" }).bendAngle,
  ).toBe(0)
})

test("bend requires explicit design choices", () => {
  for (const key of [
    "x1",
    "y1",
    "x2",
    "y2",
    "bendAngle",
    "bendRadius",
    "bendSide",
  ] as const) {
    expect(pcbBendProps.safeParse({ ...bend, [key]: undefined }).success).toBe(
      false,
    )
  }
  expect(pcbBendProps.parse({ ...bend, name: undefined }).name).toBeUndefined()
})

test("bend rejects degenerate centerlines after unit conversion", () => {
  expect(
    pcbBendProps.safeParse({ ...bend, y1: "1cm", y2: "10mm" }).success,
  ).toBe(false)
})

test("bend rejects nonphysical dimensions, invalid sides and nonfinite geometry", () => {
  for (const bendRadius of [0, -1, "-1mm", Infinity, NaN]) {
    expect(pcbBendProps.safeParse({ ...bend, bendRadius }).success).toBe(false)
  }
  for (const key of ["x1", "y1", "x2", "y2", "bendAngle"] as const) {
    for (const value of [Infinity, -Infinity, NaN]) {
      expect(pcbBendProps.safeParse({ ...bend, [key]: value }).success).toBe(
        false,
      )
    }
  }
  expect(pcbBendProps.safeParse({ ...bend, bendSide: "top" }).success).toBe(
    false,
  )
})
