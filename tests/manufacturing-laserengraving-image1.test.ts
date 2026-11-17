import { expect, test } from "bun:test"
import {
  type ManufacturingLaserEngravingImageProps,
  manufacturingLaserEngravingImageProps,
  manufacturingProps,
} from "../lib"

test("laserengraving.image parses a sized image on a named surface", () => {
  const input = {
    imageUrl: "./logo.svg",
    surfaceRef: "badge",
    width: "18mm",
    xOffsetFromSurfaceCenter: 2,
    distanceFromSurfaceBottomEdge: "1mm",
    rasterMode: "dither",
    invertImage: true,
  } satisfies ManufacturingLaserEngravingImageProps

  expect(manufacturingProps.laserengraving.image).toBe(
    manufacturingLaserEngravingImageProps,
  )
  expect(manufacturingLaserEngravingImageProps.parse(input)).toEqual({
    imageUrl: "./logo.svg",
    surfaceRef: "badge",
    width: 18,
    xOffsetFromSurfaceCenter: 2,
    distanceFromSurfaceBottomEdge: 1,
    anchorAlignment: "center",
    rasterMode: "dither",
    invertImage: true,
  })

  // Static-file imports resolve through their default export.
  const parsed = manufacturingLaserEngravingImageProps.parse({
    imageUrl: { default: "/assets/logo.png" },
    surfaceRef: "bottomSurface",
    width: 10,
    height: "0.5in",
  })
  expect(parsed.imageUrl).toBe("/assets/logo.png")
  expect(parsed.height).toBe(12.7)
})
