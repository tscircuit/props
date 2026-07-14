import { expect, test } from "bun:test"
import {
  cutoutApertureProps,
  type CutoutApertureProps,
} from "lib/components/cutout-aperture"

test("cutout aperture props normalize dimensions to millimeters", () => {
  const raw: CutoutApertureProps = {
    shape: "rounded_rect",
    widthMm: "0.144in",
    heightMm: "8.34mm",
    cornerRadiusMm: "1.83mm",
    zCenterAboveBoardMm: 6.75,
    marginMm: "0.2mm",
  }

  const parsed = cutoutApertureProps.parse(raw)

  expect(parsed).toEqual({
    shape: "rounded_rect",
    widthMm: expect.any(Number),
    heightMm: 8.34,
    cornerRadiusMm: 1.83,
    zCenterAboveBoardMm: 6.75,
    marginMm: 0.2,
  })
  expect(parsed.widthMm).toBeCloseTo(3.6576)
})

test("cutout aperture props support circular and D-shaped profiles", () => {
  expect(
    cutoutApertureProps.parse({
      shape: "circle",
      diameterMm: "6.5mm",
    }),
  ).toEqual({ shape: "circle", diameterMm: 6.5 })

  expect(
    cutoutApertureProps.parse({
      shape: "d_shape",
      diameterMm: "9mm",
      flatOffsetMm: "1mm",
    }),
  ).toEqual({
    shape: "d_shape",
    diameterMm: 9,
    flatOffsetMm: 1,
  })
})

test("cutout aperture props reject unknown shapes", () => {
  expect(() =>
    cutoutApertureProps.parse({ shape: "oval", widthMm: "4mm" }),
  ).toThrow()
})
