import { expect, test } from "bun:test"
import {
  enclosureCutoutApertureShapes,
  enclosureCutoutApertureProps,
  type EnclosureCutoutApertureProps,
  enclosureProps,
} from "lib/enclosure"

test("enclosure cutout aperture props normalize dimensions to millimeters", () => {
  const raw: EnclosureCutoutApertureProps = {
    shape: "rounded_rect",
    width: "0.144in",
    height: "8.34mm",
    cornerRadius: "1.83mm",
    margin: "0.2mm",
  }

  const parsed = enclosureCutoutApertureProps.parse(raw)

  expect(parsed).toEqual({
    shape: "rounded_rect",
    width: expect.any(Number),
    height: 8.34,
    cornerRadius: 1.83,
    margin: 0.2,
  })
  expect(parsed.width).toBeCloseTo(3.6576)
})

test("exposes cutout aperture props through the enclosure namespace", () => {
  expect(enclosureProps.cutoutaperture).toBe(enclosureCutoutApertureProps)
  expect(enclosureCutoutApertureShapes).toEqual([
    "rect",
    "rounded_rect",
    "circle",
  ])

  expect(enclosureProps.cutoutaperture.parse({ shape: "rect" })).toEqual({
    shape: "rect",
  })

  expect(
    enclosureProps.cutoutaperture.parse({
      shape: "circle",
      diameter: "6.5mm",
    }),
  ).toEqual({ shape: "circle", diameter: 6.5 })
})

test("enclosure cutout aperture props reject D-shaped and unknown shapes", () => {
  expect(() =>
    enclosureCutoutApertureProps.parse({
      shape: "d_shape",
      diameter: "9mm",
    }),
  ).toThrow()
  expect(() =>
    enclosureCutoutApertureProps.parse({ shape: "oval", width: "4mm" }),
  ).toThrow()
})
