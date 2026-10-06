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

test("tear reliefs are opt-in without an implicit radius", () => {
  expect(pcbBendProps.parse(bend)).not.toHaveProperty("tearReliefRadius")
  expect(
    pcbBendProps.parse({ ...bend, tearReliefRadius: undefined })
      .tearReliefRadius,
  ).toBeUndefined()
})

test("tear relief radius normalizes to mm independently of the fold", () => {
  for (const bendSide of ["left", "right"] as const) {
    for (const bendAngle of [-90, 0, 90]) {
      for (const tearReliefRadius of [0.5, "0.5mm", "0.05cm"]) {
        const input = {
          ...bend,
          bendSide,
          bendAngle,
          tearReliefRadius,
        } satisfies PcbBendProps
        expect(pcbBendProps.parse(input)).toEqual({
          ...pcbBendProps.parse({ ...bend, bendSide, bendAngle }),
          tearReliefRadius: 0.5,
        })
      }
    }
  }
})

test("tear relief radius rejects invalid or nonpositive dimensions", () => {
  for (const tearReliefRadius of [
    0,
    "0mm",
    -1,
    "-0.1cm",
    Infinity,
    -Infinity,
    NaN,
    "invalid",
    null,
    true,
  ]) {
    const result = pcbBendProps.safeParse({ ...bend, tearReliefRadius })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["tearReliefRadius"])
    }
  }
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
