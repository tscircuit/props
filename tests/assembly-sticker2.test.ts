import { expect, test } from "bun:test"
import { assemblyStickerProps } from "../lib"

test("sticker needs a name, a surface and a resolvable size", () => {
  const printed = { name: "LABEL", surfaceRef: "topSurface" }
  const withImage = { ...printed, imageUrl: "./label.svg" }

  // Artwork supplies the aspect ratio, so one dimension is enough.
  for (const size of [{ width: 30 }, { height: 16 }, { width: 30, height: 16 }])
    expect(
      assemblyStickerProps.safeParse({ ...withImage, ...size }).success,
    ).toBe(true)
  // An unprinted sticker has no aspect ratio to follow.
  expect(
    assemblyStickerProps.safeParse({ ...printed, width: 30, height: 16 })
      .success,
  ).toBe(true)
  const widthOnly = assemblyStickerProps.safeParse({ ...printed, width: 30 })
  expect(widthOnly.success).toBe(false)
  expect(widthOnly.error?.issues[0]?.path).toEqual(["height"])
  const unsized = assemblyStickerProps.safeParse(withImage)
  expect(unsized.success).toBe(false)
  expect(unsized.error?.issues[0]?.path).toEqual(["width"])

  const valid = { ...withImage, width: 30, height: 16 }
  const parsed = assemblyStickerProps.parse(valid)
  expect(parsed).not.toHaveProperty("thickness")
  expect(parsed).not.toHaveProperty("backgroundColor")
  for (const invalid of [
    { ...valid, name: " " },
    { ...valid, name: undefined },
    { ...valid, surfaceRef: undefined },
    { ...valid, surfaceRef: " " },
    { ...valid, imageUrl: "" },
    { ...valid, width: 0 },
    { ...valid, height: "-2mm" },
    { ...valid, thickness: 0 },
    { ...valid, backgroundColor: " " },
    { ...valid, purchaseUrls: ["ftp://store.example/labels"] },
    {
      ...valid,
      xOffsetFromSurfaceCenter: 1,
      distanceFromSurfaceLeftEdge: 1,
    },
    { ...valid, distanceFromSurfaceTopEdge: -1 },
    { ...valid, rotationOnSurface: "90deg clockwise" },
  ]) {
    expect(assemblyStickerProps.safeParse(invalid).success).toBe(false)
  }
})
