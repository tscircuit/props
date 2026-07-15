import { expect, test } from "bun:test"
import {
  cutoutApertureShapes,
  cutoutApertureProps,
  type CutoutApertureProps,
} from "lib/components/cutout-aperture"

test("cutout aperture props normalize dimensions to millimeters", () => {
  const raw: CutoutApertureProps = {
    shape: "rounded_rect",
    width: "0.144in",
    height: "8.34mm",
    cornerRadius: "1.83mm",
    margin: "0.2mm",
  }

  const parsed = cutoutApertureProps.parse(raw)

  expect(parsed).toEqual({
    shape: "rounded_rect",
    width: expect.any(Number),
    height: 8.34,
    cornerRadius: 1.83,
    margin: 0.2,
  })
  expect(parsed.width).toBeCloseTo(3.6576)
})

test("cutout aperture props expose the supported shape spec", () => {
  expect(cutoutApertureShapes).toEqual(["rect", "rounded_rect", "circle"])

  expect(cutoutApertureProps.parse({ shape: "rect" })).toEqual({
    shape: "rect",
  })

  expect(
    cutoutApertureProps.parse({
      shape: "circle",
      diameter: "6.5mm",
    }),
  ).toEqual({ shape: "circle", diameter: 6.5 })
})

test("cutout aperture props reject D-shaped and unknown shapes", () => {
  expect(() =>
    cutoutApertureProps.parse({ shape: "d_shape", diameter: "9mm" }),
  ).toThrow()
  expect(() =>
    cutoutApertureProps.parse({ shape: "oval", width: "4mm" }),
  ).toThrow()
})
