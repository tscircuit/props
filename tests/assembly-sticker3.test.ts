import { expect, test } from "bun:test"
import { assemblyStickerProps, type AssemblyStickerProps } from "../lib"

test("sticker corners can be rounded up to half of its shorter side", () => {
  const sticker = {
    name: "LABEL",
    surfaceRef: "topSurface",
    imageUrl: "./label.svg",
    width: "38.1mm",
    height: "19.05mm",
  } satisfies AssemblyStickerProps

  expect(assemblyStickerProps.parse(sticker)).not.toHaveProperty("cornerRadius")
  expect(
    assemblyStickerProps.parse({ ...sticker, cornerRadius: "0.0625in" })
      .cornerRadius,
  ).toBeCloseTo(1.5875, 6)
  // Zero is square corners; half of the shorter side is a full stadium end.
  for (const cornerRadius of [0, 1.5, "9.525mm"])
    expect(
      assemblyStickerProps.safeParse({ ...sticker, cornerRadius }).success,
    ).toBe(true)

  const tooLarge = assemblyStickerProps.safeParse({
    ...sticker,
    cornerRadius: 10,
  })
  expect(tooLarge.success).toBe(false)
  expect(tooLarge.error?.issues).toMatchObject([
    {
      path: ["cornerRadius"],
      message: "cornerRadius cannot exceed half of the height",
    },
  ])

  // With one size following the image, only the given size bounds the radius.
  const { height: _, ...widthOnly } = sticker
  expect(
    assemblyStickerProps.safeParse({ ...widthOnly, cornerRadius: 19.05 })
      .success,
  ).toBe(true)
  for (const cornerRadius of [19.06, -1, "abc", Number.POSITIVE_INFINITY])
    expect(
      assemblyStickerProps.safeParse({ ...widthOnly, cornerRadius }).success,
    ).toBe(false)
})
