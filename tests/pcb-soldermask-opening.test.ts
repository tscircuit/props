import { expect, test } from "bun:test"
import {
  pcbSoldermaskOpeningProps,
  type PcbSoldermaskOpeningProps,
} from "../lib"

test("solder-mask openings parse local geometry and ordinary PCB placement", () => {
  const rect = {
    name: "CONTACT_WINDOW",
    shape: "rect",
    layer: "top",
    width: "1cm",
    height: "2mm",
    pcbX: "-3mm",
    pcbY: 4,
    pcbRotation: "90deg",
  } satisfies PcbSoldermaskOpeningProps
  expect(pcbSoldermaskOpeningProps.parse(rect)).toMatchObject({
    width: 10,
    height: 2,
    pcbX: -3,
    pcbY: 4,
    pcbRotation: 90,
    layer: "top",
  })
  expect(
    pcbSoldermaskOpeningProps.parse({
      shape: "circle",
      layer: "bottom",
      radius: "0.5mm",
    }),
  ).toEqual({ shape: "circle", layer: "bottom", radius: 0.5 })
  expect(
    pcbSoldermaskOpeningProps.parse({
      shape: "polygon",
      layer: "bottom",
      points: [
        { x: 0, y: 0 },
        { x: "1cm", y: 0 },
        { x: 0, y: "2mm" },
      ],
    }),
  ).toMatchObject({
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 2 },
    ],
  })
})

test("solder-mask openings require a face and reject invalid or conflicting geometry", () => {
  const rect = { shape: "rect", layer: "top", width: 4, height: 2 }
  for (const layer of [undefined, "inner1", "both"]) {
    expect(
      pcbSoldermaskOpeningProps.safeParse({ ...rect, layer }).success,
    ).toBe(false)
  }
  for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    expect(
      pcbSoldermaskOpeningProps.safeParse({ ...rect, width: value }).success,
    ).toBe(false)
    expect(
      pcbSoldermaskOpeningProps.safeParse({
        shape: "circle",
        layer: "bottom",
        radius: value,
      }).success,
    ).toBe(false)
  }
  for (const points of [
    [],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    [
      { x: 0, y: 0 },
      { x: Number.POSITIVE_INFINITY, y: 1 },
      { x: 2, y: 0 },
    ],
  ]) {
    expect(
      pcbSoldermaskOpeningProps.safeParse({
        shape: "polygon",
        layer: "top",
        points,
      }).success,
    ).toBe(false)
  }
  expect(
    pcbSoldermaskOpeningProps.safeParse({ ...rect, radius: 1 }).success,
  ).toBe(false)
  expect(
    pcbSoldermaskOpeningProps.safeParse({ ...rect, points: [{ x: 0, y: 0 }] })
      .success,
  ).toBe(false)
})
