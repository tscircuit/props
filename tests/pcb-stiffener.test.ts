import { expect, test } from "bun:test"
import { pcbStiffenerProps, type PcbStiffenerProps } from "lib"

const rect = {
  name: "S1",
  shape: "rect",
  pcbX: "2cm",
  pcbY: -2,
  pcbRotation: "90deg",
  width: "12mm",
  height: "1cm",
  layer: "bottom",
  material: "fr4",
  thickness: "0.4mm",
  adhesiveThickness: "0.05mm",
} satisfies PcbStiffenerProps

const polygon = {
  shape: "polygon",
  outline: [
    { x: 0, y: 0 },
    { x: "1cm", y: 0 },
    { x: 0, y: "5mm" },
  ],
  layer: "top",
  material: "polyimide",
  thickness: 0.2,
} satisfies PcbStiffenerProps

test("rect stiffener normalizes geometry, placement and separate material thicknesses", () => {
  expect(pcbStiffenerProps.parse(rect)).toEqual({
    ...rect,
    pcbX: 20,
    pcbRotation: 90,
    width: 12,
    height: 10,
    thickness: 0.4,
    adhesiveThickness: 0.05,
  })
})

test("polygon stiffener normalizes local outline without applying layout transforms", () => {
  const result = pcbStiffenerProps.parse({
    ...polygon,
    pcbX: 20,
    pcbRotation: 90,
  })
  expect(result.shape).toBe("polygon")
  expect(result.outline).toEqual([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 5 },
  ])
  expect(result.adhesiveThickness).toBeUndefined()
  expect(
    pcbStiffenerProps.safeParse({
      ...polygon,
      outline: [...polygon.outline].reverse(),
    }).success,
  ).toBe(true)
})

test("stiffener requires shape, attachment face, material and geometry", () => {
  for (const key of [
    "shape",
    "layer",
    "material",
    "thickness",
    "width",
    "height",
  ] as const) {
    expect(
      pcbStiffenerProps.safeParse({ ...rect, [key]: undefined }).success,
    ).toBe(false)
  }
  expect(
    pcbStiffenerProps.safeParse({ ...polygon, outline: undefined }).success,
  ).toBe(false)
  for (const layer of ["inner1", "both", "wrong"]) {
    expect(pcbStiffenerProps.safeParse({ ...rect, layer }).success).toBe(false)
  }
  expect(
    pcbStiffenerProps.safeParse({ ...rect, material: "unknown" }).success,
  ).toBe(false)
  expect(
    pcbStiffenerProps.safeParse({ ...rect, shape: "circle" }).success,
  ).toBe(false)
  for (const material of ["fr4", "polyimide", "stainless_steel", "aluminum"]) {
    expect(pcbStiffenerProps.safeParse({ ...rect, material }).success).toBe(
      true,
    )
  }
})

test("stiffener rejects nonpositive dimensions and negative adhesive thickness", () => {
  for (const key of ["width", "height", "thickness"] as const) {
    for (const value of [0, "0mm", -1, "-1mm", Infinity, NaN]) {
      expect(
        pcbStiffenerProps.safeParse({ ...rect, [key]: value }).success,
      ).toBe(false)
    }
  }
  for (const adhesiveThickness of [-1, "-1mm", Infinity, NaN]) {
    expect(
      pcbStiffenerProps.safeParse({ ...rect, adhesiveThickness }).success,
    ).toBe(false)
  }
  expect(
    pcbStiffenerProps.parse({ ...rect, adhesiveThickness: 0 })
      .adhesiveThickness,
  ).toBe(0)
})

test("stiffener rejects conflicting shape geometry", () => {
  expect(
    pcbStiffenerProps.safeParse({ ...rect, outline: polygon.outline }).success,
  ).toBe(false)
  expect(pcbStiffenerProps.safeParse({ ...polygon, width: 10 }).success).toBe(
    false,
  )
  expect(pcbStiffenerProps.safeParse({ ...polygon, height: 5 }).success).toBe(
    false,
  )
})

test("stiffener rejects underspecified, degenerate and nonfinite polygon outlines", () => {
  for (const outline of [
    [],
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 0, y: 0 },
      { x: Infinity, y: 0 },
      { x: 0, y: 5 },
    ],
  ]) {
    expect(pcbStiffenerProps.safeParse({ ...polygon, outline }).success).toBe(
      false,
    )
  }
})
