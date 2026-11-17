import { expect, test } from "bun:test"
import { manufacturingLaserEngravingImageProps } from "../lib"

test("laserengraving.image requires a source and at least one dimension", () => {
  const valid = { imageUrl: "./logo.svg", surfaceRef: "topSurface", height: 8 }
  expect(manufacturingLaserEngravingImageProps.safeParse(valid).success).toBe(
    true,
  )
  for (const invalid of [
    { ...valid, height: undefined },
    { ...valid, imageUrl: "" },
    { ...valid, imageUrl: undefined },
    { ...valid, width: 0 },
    { ...valid, height: "-2mm" },
    { ...valid, rasterMode: "halftone" },
    { ...valid, invertImage: "yes" },
    { ...valid, surfaceRef: "" },
  ]) {
    expect(
      manufacturingLaserEngravingImageProps.safeParse(invalid).success,
    ).toBe(false)
  }
})
