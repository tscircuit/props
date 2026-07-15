import { expect, test } from "bun:test"
import {
  enclosureCutoutApertureShapes,
  enclosureCutoutApertureProps,
  type EnclosureCutoutApertureProps,
  enclosureProps,
} from "lib/enclosure"

test("enclosure cutout aperture props normalize dimensions to millimeters", () => {
  const raw: EnclosureCutoutApertureProps = {
    shape: "pill",
    width: "0.144in",
    height: "8.34mm",
    margin: "0.2mm",
  }

  const parsed = enclosureCutoutApertureProps.parse(raw)

  expect(parsed).toEqual({
    shape: "pill",
    width: expect.any(Number),
    height: 8.34,
    margin: 0.2,
  })
  if (parsed.shape === "pill") {
    expect(parsed.width).toBeCloseTo(3.6576)
  }
})

test("exposes cutout aperture props through the enclosure namespace", () => {
  expect(enclosureProps.cutoutaperture).toBe(enclosureCutoutApertureProps)
  expect(enclosureCutoutApertureShapes).toEqual(["pill", "rect", "circle"])

  expect(
    enclosureProps.cutoutaperture.parse({
      shape: "rect",
      width: "4mm",
      height: "2mm",
    }),
  ).toEqual({ shape: "rect", width: 4, height: 2 })

  expect(
    enclosureProps.cutoutaperture.parse({
      shape: "circle",
      radius: "3.25mm",
    }),
  ).toEqual({ shape: "circle", radius: 3.25 })
})

test("enclosure cutout aperture props reject missing geometry and unknown shapes", () => {
  expect(() => enclosureCutoutApertureProps.parse({ shape: "rect" })).toThrow()
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
