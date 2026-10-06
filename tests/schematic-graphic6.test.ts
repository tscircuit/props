import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should reject non-positive or non-finite graphic dimensions", () => {
  const zeroWidth = schematicGraphicProps.safeParse({
    imageUrl: "https://example.com/diagram.svg",
    width: 0,
  })
  const infiniteHeight = schematicGraphicProps.safeParse({
    imageUrl: "https://example.com/diagram.svg",
    height: Number.POSITIVE_INFINITY,
  })

  expect(zeroWidth.success).toBe(false)
  expect(infiniteHeight.success).toBe(false)
  if (!zeroWidth.success && !infiniteHeight.success) {
    expect(zeroWidth.error.issues[0]?.message).toBe(
      "width must be a positive finite distance",
    )
    expect(infiniteHeight.error.issues[0]?.message).toBe(
      "height must be a positive finite distance",
    )
  }
})
